import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="shield-checkmark" size={48} color="#00C853" />
          </View>
          <Text style={styles.headerTitle}>Kebijakan Privasi</Text>
          <Text style={styles.headerSubtitle}>
            Terakhir diperbarui: Desember 2024
          </Text>
        </View>

        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            1. Informasi yang Kami Kumpulkan
          </Text>
          <Text style={styles.sectionText}>
            Kami mengumpulkan informasi yang Anda berikan saat mendaftar dan
            menggunakan aplikasi, termasuk:
          </Text>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Nama lengkap dan NIM</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Email dan nomor telepon</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Angkatan dan program studi</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Aktivitas dalam aplikasi</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Penggunaan Informasi</Text>
          <Text style={styles.sectionText}>
            Informasi yang kami kumpulkan digunakan untuk:
          </Text>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>
              Menyediakan dan meningkatkan layanan
            </Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Mengirimkan notifikasi penting</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>
              Menganalisis penggunaan aplikasi
            </Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Memastikan keamanan akun</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Keamanan Data</Text>
          <Text style={styles.sectionText}>
            Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi
            informasi Anda dari akses yang tidak sah, perubahan, pengungkapan,
            atau penghancuran.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Berbagi Informasi</Text>
          <Text style={styles.sectionText}>
            Kami tidak akan membagikan informasi pribadi Anda kepada pihak
            ketiga tanpa persetujuan Anda, kecuali:
          </Text>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Diwajibkan oleh hukum</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Untuk melindungi hak kami</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>
              Dengan persetujuan eksplisit Anda
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Hak Anda</Text>
          <Text style={styles.sectionText}>Anda memiliki hak untuk:</Text>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Mengakses data pribadi Anda</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Memperbarui informasi Anda</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Menghapus akun Anda</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>
              Menolak pengumpulan data tertentu
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Kontak</Text>
          <Text style={styles.sectionText}>
            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan
            hubungi kami:
          </Text>
          <View style={styles.contactCard}>
            <Ionicons name="mail" size={20} color="#007AFF" />
            <Text style={styles.contactText}>hmif@ummi.ac.id</Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: "#fafafa",
    marginBottom: 24,
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000",
    marginTop: 8,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 12,
  },
  contactText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
  },
  bottomSpace: {
    height: 40,
  },
});
