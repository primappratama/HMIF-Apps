import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AdminMenuItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  bgColor: string;
};

const adminMenuItems: AdminMenuItem[] = [
  {
    id: "1",
    title: "Manage Banner",
    description: "Kelola banner carousel homepage",
    icon: "images",
    route: "/(screens)/admin/banner",
    color: "#007AFF",
    bgColor: "#E3F2FD",
  },
  {
    id: "2",
    title: "Manage Berita",
    description: "Kelola berita & pengumuman",
    icon: "newspaper",
    route: "/(screens)/admin/news",
    color: "#FF9500",
    bgColor: "#FFF3E0",
  },
  {
    id: "3",
    title: "Manage Kegiatan",
    description: "Kelola kegiatan HMIF",
    icon: "calendar",
    route: "/(screens)/kegiatan",
    color: "#00C853",
    bgColor: "#E8F5E9",
  },
  {
    id: "4",
    title: "Manage Keuangan",
    description: "Kelola transaksi keuangan",
    icon: "wallet",
    route: "/(screens)/admin/finance",
    color: "#9C27B0",
    bgColor: "#F3E5F5",
  },
  {
    id: "5",
    title: "Manage Pengurus",
    description: "Kelola struktur organisasi",
    icon: "people",
    route: "/(screens)/admin/organization",
    color: "#FF3B30",
    bgColor: "#FFEBEE",
  },
  {
    id: "6",
    title: "Manage Users",
    description: "Kelola user & role",
    icon: "person",
    route: "/(screens)/admin/users",
    color: "#00BCD4",
    bgColor: "#E0F7FA",
  },
  {
    id: "7",
    title: "Send Notification",
    description: "Kirim notifikasi broadcast",
    icon: "notifications",
    route: "/(screens)/admin/notification",
    color: "#FF5722",
    bgColor: "#FBE9E7",
  },
  {
    id: "8",
    title: "App Settings",
    description: "Pengaturan aplikasi",
    icon: "settings",
    route: "/(screens)/admin/settings",
    color: "#607D8B",
    bgColor: "#ECEFF1",
  },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Check if user is SUPER ADMIN only
  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed" size={64} color="#ccc" />
          <Text style={styles.errorTitle}>Akses Ditolak</Text>
          <Text style={styles.errorText}>
            Hanya Super Admin yang memiliki akses ke halaman ini
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Kelola semua konten HMIF UMMI
          </Text>
        </View>
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#00C853" />
          <Text style={styles.adminBadgeText}>Super Admin</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="#007AFF" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Kegiatan</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="newspaper" size={24} color="#FF9500" />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Berita</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#00C853" />
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
        </View>

        {/* Admin Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.menuGrid}>
            {adminMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.menuIconBox,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#00C853",
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 14,
  },
  menuIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  menuDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginTop: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  bottomSpace: {
    height: 40,
  },
});
