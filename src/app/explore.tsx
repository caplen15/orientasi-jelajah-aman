import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Halaman eksplorasi aplikasi Jelajah Aman.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fitur Utama</Text>
          <Text style={styles.cardText}>- Pencarian kota</Text>
          <Text style={styles.cardText}>- Informasi suhu dan AQI</Text>
          <Text style={styles.cardText}>- Riwayat pencarian</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },
  container: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
});
