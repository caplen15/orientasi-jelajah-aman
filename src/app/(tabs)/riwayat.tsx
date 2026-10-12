// src/app/(tabs)/riwayat.tsx
import { useState, useCallback } from "react";
import { View, Text, Button, Alert, Modal, Platform } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../../types/favorit";
export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [kotaKonfirmasiHapus, setKotaKonfirmasiHapus] =
    useState<KotaFavorit | null>(null);
  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, []),
  );
  async function hapus(kota: KotaFavorit) {
    await hapusFavorit(kota.id);
    setDaftarFavorit((prev) => prev.filter((item) => item.id !== kota.id));
  }
  function konfirmasiHapus(kota: KotaFavorit) {
    if (Platform.OS === "web") {
      setKotaKonfirmasiHapus(kota);
      return;
    }
    Alert.alert(`Yakin hapus ${kota.nama}?`, undefined, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          void hapus(kota);
        },
      },
    ]);
  }
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Kota Favorit</Text>
      <Text>Tersimpan {daftarFavorit.length} kota</Text>
      {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}
      {daftarFavorit.map((kota) => (
        <View
          key={kota.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{kota.nama}</Text>
          <Button title="Hapus" onPress={() => konfirmasiHapus(kota)} />
        </View>
      ))}
      <Modal
        visible={kotaKonfirmasiHapus !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setKotaKonfirmasiHapus(null)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 24,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <View style={{ padding: 20, gap: 16, backgroundColor: "white" }}>
            <Text>
              {kotaKonfirmasiHapus &&
                `Yakin hapus ${kotaKonfirmasiHapus.nama}?`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <Button
                title="Batal"
                onPress={() => setKotaKonfirmasiHapus(null)}
              />
              <Button
                title="Hapus"
                onPress={() => {
                  if (kotaKonfirmasiHapus) {
                    void hapus(kotaKonfirmasiHapus);
                    setKotaKonfirmasiHapus(null);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
