import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    kegiatan: true,
    berita: true,
    keuangan: false,
    reminder: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="notifications" size={24} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Pengaturan Notifikasi</Text>
            <Text style={styles.infoText}>
              Kelola notifikasi yang Anda terima dari aplikasi
            </Text>
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Umum</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={22}
                  color="#000"
                />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Push Notification</Text>
                <Text style={styles.settingDescription}>
                  Terima notifikasi push di perangkat
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.push}
              onValueChange={() => handleToggle("push")}
              trackColor={{ false: "#f0f0f0", true: "#000" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Ionicons name="mail-outline" size={22} color="#000" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Email Notification</Text>
                <Text style={styles.settingDescription}>
                  Terima notifikasi via email
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.email}
              onValueChange={() => handleToggle("email")}
              trackColor={{ false: "#f0f0f0", true: "#000" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Konten</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Ionicons name="calendar-outline" size={22} color="#000" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Kegiatan HMIF</Text>
                <Text style={styles.settingDescription}>
                  Notifikasi kegiatan dan event
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.kegiatan}
              onValueChange={() => handleToggle("kegiatan")}
              trackColor={{ false: "#f0f0f0", true: "#000" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Ionicons name="newspaper-outline" size={22} color="#000" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Berita & Pengumuman</Text>
                <Text style={styles.settingDescription}>
                  Update berita terbaru HMIF
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.berita}
              onValueChange={() => handleToggle("berita")}
              trackColor={{ false: "#f0f0f0", true: "#000" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Ionicons name="wallet-outline" size={22} color="#000" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Keuangan</Text>
                <Text style={styles.settingDescription}>
                  Update transparansi keuangan
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.keuangan}
              onValueChange={() => handleToggle("keuangan")}
              trackColor={{ false: "#f0f0f0", true: "#000" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Ionicons name="alarm-outline" size={22} color="#000" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Reminder</Text>
                <Text style={styles.settingDescription}>
                  Pengingat kegiatan mendatang
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.reminder}
              onValueChange={() => handleToggle("reminder")}
              trackColor={{ false: "#f0f0f0", true: "#000" }}
              thumbColor="#fff"
            />
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
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#F0F8FF",
    margin: 24,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D6EDFF",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#007AFF",
    lineHeight: 18,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  bottomSpace: {
    height: 40,
  },
});
