import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { spacing, typeScale } from "../../constants/styles";

export default function TentangScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text
          accessible
          accessibilityLabel="Judul halaman tentang aplikasi Jelajah Aman"
          style={styles.title}
        >
          Jelajah Aman
        </Text>

        <Text style={styles.version}>Versi: 1.0.0</Text>
        <Text style={styles.creator}>Pembuat: M. Hamdan Aldiansyah</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.sedang,
    gap: spacing.kecil,
  },
  title: {
    fontSize: typeScale.judul,
    fontWeight: "700",
    color: "#0F172A",
  },
  version: {
    fontSize: typeScale.isi,
    color: "#475569",
  },
  creator: {
    fontSize: typeScale.subjudul,
    color: "#334155",
  },
});
