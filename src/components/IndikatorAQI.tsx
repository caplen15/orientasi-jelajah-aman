import { Text, View } from "react-native";
import { LaporanUdara } from "../../types/cuaca";

interface IndikatorAQIProps {
  laporan: LaporanUdara;
}

const warnaTingkat: Record<LaporanUdara["tingkat"], string> = {
  BAIK: "green",
  SEDANG: "orange",
  TIDAK_SEHAT: "red",
  BERBAHAYA: "darkred",
};

export default function IndikatorAQI({ laporan }: IndikatorAQIProps) {
  return (
    <View>
      <Text style={{ color: warnaTingkat[laporan.tingkat], fontWeight: "bold" }}>
        {laporan.kota}: {laporan.tingkat} (AQI {laporan.indeksAQI})
      </Text>
      {laporan.diperbaruiPada ? (
        <Text>Diperbarui pada: {laporan.diperbaruiPada}</Text>
      ) : null}
    </View>
  );
}