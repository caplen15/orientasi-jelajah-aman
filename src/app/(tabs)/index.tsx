import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import { ambilCuaca } from "../../services/weatherService";
import { ambilKualitasUdara } from "../../services/airQualityService";
import {
  ambilKoordinatSaatIni,
  mintaIzinLokasi,
} from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { HasilGeocoding } from "../../../types/geocoding";
import { DataCuacaLengkap, DataKualitasUdara } from "../../../types/weather";
export default function HalamanUtama() {
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [cuaca, setCuaca] = useState<DataCuacaLengkap | null>(null);
  const [kualitasUdara, setKualitasUdara] = useState<DataKualitasUdara | null>(
    null,
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [sedangMencari, setSedangMencari] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanErrorPencarian, setPesanErrorPencarian] = useState<string | null>(
    null,
  );
  const [ulangiPencarian, setUlangiPencarian] = useState(0);
  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0); // pencegah race condition
  const requestPencarianIdRef = useRef(0);
  useEffect(() => {
    const namaKota = teksTertunda.trim();
    const idSaatIni = ++requestPencarianIdRef.current;
    if (namaKota.length === 0) {
      setHasilPencarian([]);
      setPesanErrorPencarian(null);
      setSedangMencari(false);
      return;
    }
    setSedangMencari(true);
    setPesanErrorPencarian(null);
    cariKota(namaKota)
      .then((hasil) => {
        if (idSaatIni !== requestPencarianIdRef.current) return;
        setHasilPencarian(hasil);
      })
      .catch(() => {
        if (idSaatIni !== requestPencarianIdRef.current) return;
        setHasilPencarian([]);
        setPesanErrorPencarian(
          "Gagal mencari kota. Periksa koneksi internet Anda.",
        );
      })
      .finally(() => {
        if (idSaatIni === requestPencarianIdRef.current) {
          setSedangMencari(false);
        }
      });
  }, [teksTertunda, ulangiPencarian]);
  async function pilihKota(kota: HasilGeocoding) {
    setKotaTerpilih(kota);
    setCuaca(null);
    setKualitasUdara(null);
    const idSaatIni = ++requestIdRef.current;
    setSedangMemuat(true);
    setPesanError(null);
    try {
      const [dataCuaca, dataAQI] = await Promise.all([
        ambilCuaca(kota.latitude, kota.longitude),
        ambilKualitasUdara(kota.latitude, kota.longitude),
      ]);
      if (idSaatIni !== requestIdRef.current) return; // hasil basi, abaikan
      setCuaca(dataCuaca);
      setKualitasUdara(dataAQI);
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;
      setPesanError("Gagal memuat data cuaca. Periksa koneksi internet Anda.");
    } finally {
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
    }
  }
  async function gunakanLokasiSaatIni() {
    try {
      const status = await mintaIzinLokasi();
      if (status === "denied") {
        setPesanLokasi(
          "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
        );
        return;
      }
      if (status === "unavailable") {
        setPesanLokasi(
          "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
        );
        return;
      }

      setPesanLokasi(null);
      const koordinat = await ambilKoordinatSaatIni();
      await pilihKota({
        id: -1,
        name: "Lokasi Saat Ini",
        latitude: koordinat.latitude,
        longitude: koordinat.longitude,
        country: "",
      });
    } catch {
      setPesanLokasi(
        "Tidak dapat mengambil lokasi. Silakan periksa pengaturan lokasi atau cari kota secara manual.",
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}>
      <SearchBox onCari={setTeksCari} />
      <Button
        title="Gunakan Lokasi Saat Ini"
        onPress={gunakanLokasiSaatIni}
      />
      {pesanLokasi && (
        <Text accessibilityLabel={pesanLokasi}>{pesanLokasi}</Text>
      )}
      {sedangMencari && <ActivityIndicator />}
      {pesanErrorPencarian && (
        <View>
          <Text accessibilityLabel={pesanErrorPencarian}>
            {pesanErrorPencarian}
          </Text>
          <Button
            title="Coba Lagi"
            onPress={() => setUlangiPencarian((nomor) => nomor + 1)}
          />
        </View>
      )}
      {hasilPencarian.map((kota) => (
        <TouchableOpacity key={kota.id} onPress={() => pilihKota(kota)}>
          <Text>{kota.name}</Text>
        </TouchableOpacity>
      ))}
      {sedangMemuat && <ActivityIndicator />}
      {pesanError && (
        <View>
          <Text>{pesanError}</Text>
          <Button
            title="Coba Lagi"
            onPress={() => kotaTerpilih && pilihKota(kotaTerpilih)}
          />
        </View>
      )}
      {cuaca && kualitasUdara && kotaTerpilih && !sedangMemuat && (
        <>
          <WeatherCard
            kota={kotaTerpilih.name}
            suhu={cuaca.saatIni.suhu}
            tingkatAQI={konversiTingkatAQI(kualitasUdara.indeksAQI)}
            indeksAQI={kualitasUdara.indeksAQI}
          />
          <Text style={{ fontSize: 14, color: "#666" }}>
            Hari ini: Maks {cuaca.harian.suhuMaksimal[0]}°C · Min{" "}
            {cuaca.harian.suhuMinimal[0]}°C
          </Text>
        </>
      )}
      {cuaca && (
        <Text style={{ fontSize: 12, color: "#888" }}>
          Kondisi: {labelKodeCuaca(cuaca.saatIni.kodeCuaca)} • Angin
          {cuaca.saatIni.kecepatanAngin} km/j
        </Text>
      )}
      {kualitasUdara && (
        <Text style={{ fontSize: 12, color: "#888" }}>
          PM2.5: {kualitasUdara.pm25} µg/m³ · PM10: {kualitasUdara.pm10} µg/m³
        </Text>
      )}
      <AtribusiCuaca />
    </SafeAreaView>
  );
}