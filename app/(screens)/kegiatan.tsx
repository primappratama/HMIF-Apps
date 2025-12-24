import { useAuth } from "@/context/AuthContext";
import {
  deleteKegiatan,
  getAllKegiatan,
  Kegiatan,
} from "@/services/kegiatan.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "semua" | "mendatang" | "berlangsung" | "selesai";

export default function KegiatanScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>("semua");
  const [refreshing, setRefreshing] = useState(false);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user can manage kegiatan (admin or pengurus)
  const canManage = user?.role === "admin" || user?.role === "pengurus";

  useEffect(() => {
    loadKegiatan();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadKegiatan();
    }, [])
  );

  const loadKegiatan = async () => {
    try {
      const data = await getAllKegiatan();
      setKegiatanList(data);
    } catch (error) {
      console.error("Error loading kegiatan:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadKegiatan();
    setRefreshing(false);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Hapus Kegiatan",
      `Apakah Anda yakin ingin menghapus "${title}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteKegiatan(id);
              await loadKegiatan();
              Alert.alert("Sukses", "Kegiatan berhasil dihapus");
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus kegiatan");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    router.push({
      pathname: "/(screens)/kegiatan-form",
      params: { id },
    });
  };

  const getFilteredActivities = () => {
    if (activeFilter === "semua") return kegiatanList;
    return kegiatanList.filter((activity) => activity.status === activeFilter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "mendatang":
        return "#007AFF";
      case "berlangsung":
        return "#00C853";
      case "selesai":
        return "#999";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "mendatang":
        return "Akan Datang";
      case "berlangsung":
        return "Berlangsung";
      case "selesai":
        return "Selesai";
      default:
        return status;
    }
  };

  const renderActivityCard = (item: Kegiatan) => (
    <View key={item.id} style={styles.activityCard}>
      <Image source={{ uri: item.image }} style={styles.activityImage} />

      {/* Action Buttons - Only for admin/pengurus */}
      {canManage && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons name="create" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.title)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.activityContent}>
        {/* Category & Status */}
        <View style={styles.activityHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.activityTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Description */}
        <Text style={styles.activityDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>

        {/* Participants */}
        <View style={styles.participantsRow}>
          <View style={styles.participantsInfo}>
            <Ionicons name="people" size={16} color="#666" />
            <Text style={styles.participantsText}>
              {item.participants}/{item.maxParticipants} Peserta
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    (item.participants / item.maxParticipants) * 100,
                    100
                  )}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "semua" && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter("semua")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === "semua" && styles.filterTextActive,
              ]}
            >
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "mendatang" && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter("mendatang")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="time"
              size={16}
              color={activeFilter === "mendatang" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === "mendatang" && styles.filterTextActive,
              ]}
            >
              Akan Datang
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "berlangsung" && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter("berlangsung")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="play-circle"
              size={16}
              color={activeFilter === "berlangsung" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === "berlangsung" && styles.filterTextActive,
              ]}
            >
              Berlangsung
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "selesai" && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter("selesai")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={activeFilter === "selesai" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === "selesai" && styles.filterTextActive,
              ]}
            >
              Selesai
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Activities List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Memuat kegiatan...</Text>
          </View>
        ) : getFilteredActivities().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum Ada Kegiatan</Text>
            <Text style={styles.emptyText}>
              {activeFilter === "semua"
                ? "Belum ada kegiatan yang tersedia"
                : `Tidak ada kegiatan dengan status "${getStatusText(
                    activeFilter
                  )}"`}
            </Text>
          </View>
        ) : (
          <View style={styles.activitiesList}>
            {getFilteredActivities().map(renderActivityCard)}
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Floating Action Button - Only for admin/pengurus */}
      {canManage && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(screens)/kegiatan-form")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterContent: {
    paddingHorizontal: 24,
    gap: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#f0f0f0",
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#999",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  activitiesList: {
    padding: 24,
    gap: 20,
  },
  activityCard: {
    backgroundColor: "#fafafa",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    position: "relative",
  },
  activityImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#e0e0e0",
  },
  actionButtons: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  activityContent: {
    padding: 20,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  participantsRow: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  participantsInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  participantsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00C853",
    borderRadius: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSpace: {
    height: 80,
  },
});
