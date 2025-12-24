import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TimelineItem = {
  year: string;
  period: string;
  title: string;
  description: string;
  achievements: string[];
  isActive?: boolean;
};

type Leader = {
  id: string;
  name: string;
  period: string;
  status: "Aktif" | "Selesai";
};

const timelineData: TimelineItem[] = [
  {
    year: "2015",
    period: "2015 - 2016",
    title: "Berdirinya HMIF UMMI",
    description:
      "Himpunan Mahasiswa Informatika resmi didirikan sebagai wadah organisasi mahasiswa Program Studi Informatika.",
    achievements: [
      "Pembentukan struktur organisasi pertama",
      "Pengesahan AD/ART HMIF",
      "Kegiatan pertama: Workshop Pemrograman",
    ],
  },
  {
    year: "2016",
    period: "2016 - 2017",
    title: "Era Pengembangan",
    description:
      "Fokus pada pengembangan kompetensi mahasiswa melalui berbagai workshop dan seminar.",
    achievements: [
      "Seminar Nasional Teknologi Informasi",
      "Kompetisi Programming antar kampus",
      "Kerjasama dengan industri IT",
    ],
  },
  {
    year: "2018",
    period: "2018 - 2019",
    title: "Ekspansi Program",
    description:
      "Perluasan program kerja dengan menambah divisi-divisi baru untuk mendukung kegiatan mahasiswa.",
    achievements: [
      "Pembentukan 5 divisi kerja",
      "Hackathon HMIF pertama",
      "Program mentoring junior",
    ],
  },
  {
    year: "2020",
    period: "2020 - 2021",
    title: "Adaptasi Digital",
    description:
      "Transformasi digital di masa pandemi dengan mengoptimalkan kegiatan secara online.",
    achievements: [
      "Webinar series bulanan",
      "E-learning platform untuk anggota",
      "Virtual networking dengan alumni",
    ],
  },
  {
    year: "2022",
    period: "2022 - 2023",
    title: "Inovasi & Kolaborasi",
    description:
      "Meningkatkan kolaborasi dengan berbagai pihak dan mengembangkan inovasi teknologi.",
    achievements: [
      "Kerjasama dengan 10+ perusahaan tech",
      "Program magang bersertifikat",
      "Research competition",
    ],
  },
  {
    year: "2024",
    period: "2024 - Sekarang",
    title: "Era Digitalisasi Penuh",
    description:
      "Implementasi sistem digital terintegrasi untuk meningkatkan pelayanan kepada anggota.",
    achievements: [
      "Peluncuran aplikasi HMIF UMMI",
      "Dashboard transparansi keuangan",
      "Portal kegiatan digital",
    ],
    isActive: true,
  },
];

const leadersData = {
  himpunan: [
    {
      id: "1",
      name: "Ahmad Fauzi",
      period: "2024 - Sekarang",
      status: "Aktif" as const,
    },
    {
      id: "2",
      name: "Budi Santoso",
      period: "2023 - 2024",
      status: "Selesai" as const,
    },
    {
      id: "3",
      name: "Dedi Suryadi",
      period: "2022 - 2023",
      status: "Selesai" as const,
    },
    {
      id: "4",
      name: "Eko Prasetyo",
      period: "2021 - 2022",
      status: "Selesai" as const,
    },
    {
      id: "5",
      name: "Fajar Ramadhan",
      period: "2020 - 2021",
      status: "Selesai" as const,
    },
  ],
  angkatan: [
    {
      id: "1",
      name: "Rizky Firmansyah (2024)",
      period: "2024 - Sekarang",
      status: "Aktif" as const,
    },
    {
      id: "2",
      name: "Siti Nurhaliza (2023)",
      period: "2023 - Sekarang",
      status: "Aktif" as const,
    },
    {
      id: "3",
      name: "Dika Pratama (2022)",
      period: "2022 - Sekarang",
      status: "Aktif" as const,
    },
    {
      id: "4",
      name: "Maya Sari (2021)",
      period: "2021 - 2025",
      status: "Selesai" as const,
    },
    {
      id: "5",
      name: "Andi Setiawan (2020)",
      period: "2020 - 2024",
      status: "Selesai" as const,
    },
  ],
  ldk: [
    {
      id: "1",
      name: "Fitri Handayani",
      period: "2024 - Sekarang",
      status: "Aktif" as const,
    },
    {
      id: "2",
      name: "Galih Permana",
      period: "2023 - 2024",
      status: "Selesai" as const,
    },
    {
      id: "3",
      name: "Hani Safitri",
      period: "2022 - 2023",
      status: "Selesai" as const,
    },
    {
      id: "4",
      name: "Irfan Hakim",
      period: "2021 - 2022",
      status: "Selesai" as const,
    },
    {
      id: "5",
      name: "Joko Widodo",
      period: "2020 - 2021",
      status: "Selesai" as const,
    },
  ],
};

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<"timeline" | "leaders">(
    "timeline"
  );
  const [activeLeaderType, setActiveLeaderType] = useState<
    "himpunan" | "angkatan" | "ldk"
  >("himpunan");

  const renderTimelineItem = (item: TimelineItem, index: number) => (
    <View key={index} style={styles.timelineItem}>
      {/* Timeline Line */}
      <View style={styles.timelineLeft}>
        <View
          style={[
            styles.timelineDot,
            item.isActive && styles.timelineDotActive,
          ]}
        >
          <View
            style={[
              styles.timelineDotInner,
              item.isActive && styles.timelineDotInnerActive,
            ]}
          />
        </View>
        {index < timelineData.length - 1 && (
          <View style={styles.timelineLine} />
        )}
      </View>

      {/* Content */}
      <View
        style={[
          styles.timelineContent,
          item.isActive && styles.timelineContentActive,
        ]}
      >
        <View style={styles.yearBadge}>
          <Ionicons
            name={item.isActive ? "flash" : "time-outline"}
            size={16}
            color={item.isActive ? "#FF9500" : "#666"}
          />
          <Text
            style={[styles.yearText, item.isActive && styles.yearTextActive]}
          >
            {item.year}
          </Text>
        </View>

        <Text style={styles.period}>{item.period}</Text>
        <Text style={styles.timelineTitle}>{item.title}</Text>
        <Text style={styles.timelineDescription}>{item.description}</Text>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.achievementsTitle}>Pencapaian:</Text>
          {item.achievements.map((achievement, idx) => (
            <View key={idx} style={styles.achievementItem}>
              <Ionicons name="checkmark-circle" size={16} color="#00C853" />
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>

        {item.isActive && (
          <View style={styles.activeBadge}>
            <Ionicons name="radio-button-on" size={12} color="#FF9500" />
            <Text style={styles.activeBadgeText}>Periode Aktif</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderLeaderCard = (leader: Leader) => (
    <View key={leader.id} style={styles.leaderCard}>
      <View style={styles.leaderContent}>
        <View style={styles.leaderLeft}>
          <View style={styles.leaderAvatar}>
            <Ionicons name="person" size={28} color="#666" />
          </View>
          <View style={styles.leaderInfo}>
            <Text style={styles.leaderName}>{leader.name}</Text>
            <View style={styles.periodContainer}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.leaderPeriod}>{leader.period}</Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            leader.status === "Aktif"
              ? styles.statusBadgeActive
              : styles.statusBadgeInactive,
          ]}
        >
          <Ionicons
            name={
              leader.status === "Aktif" ? "radio-button-on" : "checkmark-circle"
            }
            size={14}
            color={leader.status === "Aktif" ? "#00C853" : "#999"}
          />
          <Text
            style={[
              styles.statusText,
              leader.status === "Aktif"
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            {leader.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="time" size={32} color="#000" />
        </View>
        <Text style={styles.headerTitle}>Sejarah HMIF UMMI</Text>
        <Text style={styles.headerSubtitle}>
          Timeline perjalanan dan kepemimpinan HMIF
        </Text>
      </View>

      {/* Main Tabs */}
      <View style={styles.mainTabContainer}>
        <TouchableOpacity
          style={[
            styles.mainTab,
            activeTab === "timeline" && styles.mainTabActive,
          ]}
          onPress={() => setActiveTab("timeline")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="git-branch-outline"
            size={20}
            color={activeTab === "timeline" ? "#fff" : "#666"}
          />
          <Text
            style={[
              styles.mainTabText,
              activeTab === "timeline" && styles.mainTabTextActive,
            ]}
          >
            Timeline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.mainTab,
            activeTab === "leaders" && styles.mainTabActive,
          ]}
          onPress={() => setActiveTab("leaders")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="people-outline"
            size={20}
            color={activeTab === "leaders" ? "#fff" : "#666"}
          />
          <Text
            style={[
              styles.mainTabText,
              activeTab === "leaders" && styles.mainTabTextActive,
            ]}
          >
            Kepemimpinan
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "timeline" ? (
          <>
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="calendar" size={24} color="#007AFF" />
                <Text style={styles.statValue}>10+</Text>
                <Text style={styles.statLabel}>Tahun Berdiri</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="people" size={24} color="#00C853" />
                <Text style={styles.statValue}>500+</Text>
                <Text style={styles.statLabel}>Alumni</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="trophy" size={24} color="#FF9500" />
                <Text style={styles.statValue}>50+</Text>
                <Text style={styles.statLabel}>Prestasi</Text>
              </View>
            </View>

            {/* Timeline */}
            <View style={styles.timelineContainer}>
              {timelineData.map((item, index) =>
                renderTimelineItem(item, index)
              )}
            </View>
          </>
        ) : (
          <>
            {/* Leader Type Tabs */}
            <View style={styles.leaderTabsContainer}>
              <TouchableOpacity
                style={[
                  styles.leaderTab,
                  activeLeaderType === "himpunan" && styles.leaderTabActive,
                ]}
                onPress={() => setActiveLeaderType("himpunan")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.leaderTabText,
                    activeLeaderType === "himpunan" &&
                      styles.leaderTabTextActive,
                  ]}
                >
                  Ketua Himpunan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.leaderTab,
                  activeLeaderType === "angkatan" && styles.leaderTabActive,
                ]}
                onPress={() => setActiveLeaderType("angkatan")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.leaderTabText,
                    activeLeaderType === "angkatan" &&
                      styles.leaderTabTextActive,
                  ]}
                >
                  Ketua Angkatan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.leaderTab,
                  activeLeaderType === "ldk" && styles.leaderTabActive,
                ]}
                onPress={() => setActiveLeaderType("ldk")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.leaderTabText,
                    activeLeaderType === "ldk" && styles.leaderTabTextActive,
                  ]}
                >
                  Ketua LDK
                </Text>
              </TouchableOpacity>
            </View>

            {/* Leaders List */}
            <View style={styles.leadersContainer}>
              {leadersData[activeLeaderType].map(renderLeaderCard)}
            </View>
          </>
        )}

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
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  mainTabContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  mainTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    gap: 8,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  mainTabActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  mainTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  mainTabTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
    gap: 12,
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
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
  timelineContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  timelineLeft: {
    width: 40,
    alignItems: "center",
    paddingTop: 4,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  timelineDotActive: {
    backgroundColor: "#FF9500",
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#999",
  },
  timelineDotInnerActive: {
    backgroundColor: "#fff",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#f0f0f0",
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 20,
    borderRadius: 16,
    marginLeft: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  timelineContentActive: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FFE0B2",
  },
  yearBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  yearText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
  },
  yearTextActive: {
    color: "#FF9500",
  },
  period: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 8,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  timelineDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  achievementsSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  achievementsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  achievementText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FF9500",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    marginTop: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  leaderTabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 10,
  },
  leaderTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  leaderTabActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  leaderTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
    textAlign: "center",
  },
  leaderTabTextActive: {
    color: "#fff",
  },
  leadersContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  leaderCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },
  leaderContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  leaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 14,
  },
  leaderAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  leaderInfo: {
    flex: 1,
    gap: 6,
  },
  leaderName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.3,
  },
  periodContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  leaderPeriod: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusBadgeActive: {
    backgroundColor: "#E8F5E9",
  },
  statusBadgeInactive: {
    backgroundColor: "#f5f5f5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextActive: {
    color: "#00C853",
  },
  statusTextInactive: {
    color: "#999",
  },
  bottomSpace: {
    height: 40,
  },
});
