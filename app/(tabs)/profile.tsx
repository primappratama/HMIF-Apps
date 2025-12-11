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
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const handleComingSoon = (feature: string) => {
    Alert.alert("Coming Soon", `Fitur ${feature} akan segera hadir!`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#666" />
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </View>

          <Text style={styles.name}>{user?.name || "Mahasiswa HMIF"}</Text>
          <Text style={styles.email}>
            {user?.email || "mahasiswa@ummi.ac.id"}
          </Text>

          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.badgeText}>Angkatan 2024</Text>
            </View>

            {/* Role Badge */}
            <View
              style={[
                styles.badge,
                user?.role === "admin" && styles.adminBadge,
                user?.role === "pengurus" && styles.pengurusBadge,
              ]}
            >
              <Ionicons
                name={
                  user?.role === "admin"
                    ? "shield-checkmark"
                    : user?.role === "pengurus"
                    ? "star"
                    : "person"
                }
                size={14}
                color={
                  user?.role === "admin"
                    ? "#FF9500"
                    : user?.role === "pengurus"
                    ? "#007AFF"
                    : "#666"
                }
              />
              <Text
                style={[
                  styles.badgeText,
                  user?.role === "admin" && styles.adminBadgeText,
                  user?.role === "pengurus" && styles.pengurusBadgeText,
                ]}
              >
                {user?.role === "admin"
                  ? "Admin"
                  : user?.role === "pengurus"
                  ? "Pengurus"
                  : "Member"}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color="#000" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Kegiatan</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={24} color="#FF9500" />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Prestasi</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#007AFF" />
            <Text style={styles.statValue}>245</Text>
            <Text style={styles.statLabel}>Teman</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleComingSoon("Edit Profil")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="person-outline" size={22} color="#000" />
              </View>
              <Text style={styles.menuText}>Edit Profil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleComingSoon("Ganti Password")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="lock-closed-outline" size={22} color="#000" />
              </View>
              <Text style={styles.menuText}>Ganti Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleComingSoon("Notifikasi")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="notifications-outline" size={22} color="#000" />
              </View>
              <Text style={styles.menuText}>Notifikasi</Text>
            </View>
            <View style={styles.menuRight}>
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>3</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengaturan</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleComingSoon("Privasi")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="shield-outline" size={22} color="#000" />
              </View>
              <Text style={styles.menuText}>Privasi</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleComingSoon("Bahasa")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="language-outline" size={22} color="#000" />
              </View>
              <Text style={styles.menuText}>Bahasa</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>Indonesia</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleComingSoon("Tentang Aplikasi")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color="#000"
                />
              </View>
              <Text style={styles.menuText}>Tentang Aplikasi</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>

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
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fafafa",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 12,
  },
  adminBadge: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FFE0B2",
  },
  pengurusBadge: {
    backgroundColor: "#E3F2FD",
    borderColor: "#BBDEFB",
  },
  adminBadgeText: {
    color: "#FF9500",
  },
  pengurusBadgeText: {
    color: "#007AFF",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
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
  menuItem: {
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
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuValue: {
    fontSize: 14,
    color: "#666",
  },
  notifBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  notifBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 24,
    marginTop: 32,
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#FF3B30",
    backgroundColor: "#fff",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF3B30",
  },
  version: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 24,
  },
  bottomSpace: {
    height: 20,
  },
});
