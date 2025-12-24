import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Apakah Anda yakin ingin keluar?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color="#666" />
          </View>
          <Text style={styles.profileName}>{user?.name || "User"}</Text>
          <Text style={styles.profileNim}>{user?.nim || "-"}</Text>
          <View style={styles.angkatanBadge}>
            <Text style={styles.angkatanText}>
              Angkatan {user?.angkatan || "2024"}
            </Text>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "-"}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>NIM</Text>
                <Text style={styles.infoValue}>{user?.nim || "-"}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Angkatan</Text>
                <Text style={styles.infoValue}>{user?.angkatan || "-"}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#666"
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>
                  {user?.role === "admin"
                    ? "Super Admin"
                    : user?.role === "pengurus"
                    ? "Pengurus"
                    : "Anggota"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengaturan</Text>
          <View style={styles.menuCard}>
            {/* Admin Dashboard - Only for SUPER ADMIN */}
            {user?.role === "admin" && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push("/(screens)/admin-dashboard" as any)}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <View
                    style={[styles.menuIconBox, { backgroundColor: "#FFF3E0" }]}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#FF9500"
                    />
                  </View>
                  <Text style={styles.menuText}>Admin Dashboard</Text>
                </View>
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>Super Admin</Text>
                </View>
              </TouchableOpacity>
            )}

            {user?.role === "admin" && <View style={styles.menuDivider} />}

            {/* Notifications */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/(screens)/settings/notifications")}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#E3F2FD" }]}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#007AFF"
                  />
                </View>
                <Text style={styles.menuText}>Notifikasi</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Privacy */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/(screens)/settings/privacy")}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#E8F5E9" }]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#00C853"
                  />
                </View>
                <Text style={styles.menuText}>Privasi & Keamanan</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Language */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/(screens)/settings/language")}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#FFF3E0" }]}
                >
                  <Ionicons name="language-outline" size={20} color="#FF9500" />
                </View>
                <Text style={styles.menuText}>Bahasa</Text>
              </View>
              <View style={styles.languageBadge}>
                <Text style={styles.languageText}>ID</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* About */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/(screens)/settings/about")}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#F3E5F5" }]}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#9C27B0"
                  />
                </View>
                <Text style={styles.menuText}>Tentang Aplikasi</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>HMIF UMMI v1.0.0</Text>
        </View>

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
  profileCard: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fafafa",
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  profileNim: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  angkatanBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  angkatanText: {
    fontSize: 12,
    fontWeight: "700",
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
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  infoCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 16,
  },
  menuCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 12,
  },
  adminBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#00C853",
  },
  languageBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  languageText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF3B30",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: "#999",
  },
  bottomSpace: {
    height: 20,
  },
});
