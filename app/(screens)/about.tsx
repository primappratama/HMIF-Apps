import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo & Info */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/hmif-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>HMIF UMMI</Text>
          <Text style={styles.appTagline}>Himpunan Mahasiswa Informatika</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
          <Text style={styles.sectionText}>
            Aplikasi HMIF UMMI adalah platform digital yang menghubungkan
            mahasiswa Informatika Universitas Muhammadiyah Sukabumi. Aplikasi
            ini menyediakan berbagai fitur untuk memudahkan akses informasi
            kegiatan, berita, transparansi keuangan, dan layanan lainnya.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitur Utama</Text>
          <View style={styles.featureItem}>
            <Ionicons name="calendar" size={20} color="#007AFF" />
            <Text style={styles.featureText}>
              Informasi kegiatan dan event HMIF
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="newspaper" size={20} color="#007AFF" />
            <Text style={styles.featureText}>
              Berita dan pengumuman terkini
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="wallet" size={20} color="#007AFF" />
            <Text style={styles.featureText}>
              Transparansi keuangan organisasi
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="search" size={20} color="#007AFF" />
            <Text style={styles.featureText}>
              NIM Finder untuk cari data mahasiswa
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="time" size={20} color="#007AFF" />
            <Text style={styles.featureText}>Sejarah kepemimpinan HMIF</Text>
          </View>
        </View>

        {/* Developer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dikembangkan Oleh</Text>
          <View style={styles.developerCard}>
            <View style={styles.developerAvatar}>
              <Ionicons name="code-slash" size={32} color="#000" />
            </View>
            <View style={styles.developerInfo}>
              <Text style={styles.developerName}>Prima Pratama Putra</Text>
              <Text style={styles.developerRole}>Ketua Himpunan 2025/2026</Text>
              <Text style={styles.developerInstitution}>
                Himpunan Mahasiswa Informatika Universitas Muhammadiyah Sukabumi
              </Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hubungi Kami</Text>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleOpenLink("mailto:hmif@ummi.ac.id")}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconBox}>
              <Ionicons name="mail" size={22} color="#007AFF" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>hmif@ummi.ac.id</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleOpenLink("https://instagram.com/hmif.ummi")}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconBox}>
              <Ionicons name="logo-instagram" size={22} color="#E1306C" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Instagram</Text>
              <Text style={styles.contactValue}>@hmif.ummi</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleOpenLink("https://ummi.ac.id")}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconBox}>
              <Ionicons name="globe" size={22} color="#00C853" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue}>ummi.ac.id</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.legalLinks}>
            <Text style={styles.legalLink}>Syarat & Ketentuan</Text>
            <Text style={styles.legalDivider}>•</Text>
            <Text style={styles.legalLink}>Kebijakan Privasi</Text>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2024 HMIF UMMI. All rights reserved.
          </Text>
          <Text style={styles.footerText}>Made with soul for HMIF UMMI</Text>
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
    paddingVertical: 40,
    backgroundColor: "#fafafa",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 15,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  versionBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  versionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 32,
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
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    paddingLeft: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  developerCard: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    padding: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  developerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  developerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  developerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  developerRole: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },
  developerInstitution: {
    fontSize: 13,
    color: "#666",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 12,
  },
  contactIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  legalLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  legalDivider: {
    fontSize: 14,
    color: "#ccc",
  },
  footer: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 16,
  },
  copyright: {
    fontSize: 13,
    color: "#999",
    marginBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: "#666",
  },
  bottomSpace: {
    height: 20,
  },
});
