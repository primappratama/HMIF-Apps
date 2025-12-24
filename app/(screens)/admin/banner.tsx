import { useAuth } from "@/context/AuthContext";
import {
  Banner,
  createBanner,
  deleteBanner,
  getAllBanners,
  reorderBanners,
  updateBanner,
} from "@/services/banner.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BannerManagementScreen() {
  const { user } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await getAllBanners();
      setBanners(data);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat banner");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = () => {
    setEditMode(false);
    setSelectedBanner(null);
    setImageUrl("");
    setIsActive(true);
    setModalVisible(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditMode(true);
    setSelectedBanner(banner);
    setImageUrl(banner.image);
    setIsActive(banner.active);
    setModalVisible(true);
  };

  const handleSaveBanner = async () => {
    if (!imageUrl.trim()) {
      Alert.alert("Error", "URL gambar harus diisi");
      return;
    }

    // Validate URL
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      Alert.alert("Error", "URL harus dimulai dengan http:// atau https://");
      return;
    }

    setSaving(true);

    try {
      if (editMode && selectedBanner) {
        // Update existing banner
        await updateBanner(selectedBanner.id, {
          image: imageUrl,
          active: isActive,
        });
        Alert.alert("Sukses", "Banner berhasil diupdate");
      } else {
        // Create new banner
        await createBanner(imageUrl);
        Alert.alert("Sukses", "Banner berhasil ditambahkan");
      }

      setModalVisible(false);
      loadBanners();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBanner = (banner: Banner) => {
    Alert.alert(
      "Hapus Banner",
      "Apakah Anda yakin ingin menghapus banner ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBanner(banner.id);
              Alert.alert("Sukses", "Banner berhasil dihapus");
              loadBanners();
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus banner");
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await updateBanner(banner.id, { active: !banner.active });
      loadBanners();
    } catch (error) {
      Alert.alert("Error", "Gagal mengupdate status banner");
    }
  };

  const handleMoveUp = async (banner: Banner) => {
    if (banner.order === 1) return;
    try {
      await reorderBanners(banner.id, banner.order - 1);
      loadBanners();
    } catch (error) {
      Alert.alert("Error", "Gagal mengubah urutan banner");
    }
  };

  const handleMoveDown = async (banner: Banner) => {
    if (banner.order === banners.length) return;
    try {
      await reorderBanners(banner.id, banner.order + 1);
      loadBanners();
    } catch (error) {
      Alert.alert("Error", "Gagal mengubah urutan banner");
    }
  };

  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed" size={64} color="#ccc" />
          <Text style={styles.errorText}>Akses ditolak</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Memuat banner...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{banners.length}</Text>
          <Text style={styles.statLabel}>Total Banner</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {banners.filter((b) => b.active).length}
          </Text>
          <Text style={styles.statLabel}>Aktif</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {banners.filter((b) => !b.active).length}
          </Text>
          <Text style={styles.statLabel}>Nonaktif</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daftar Banner</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddBanner}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {banners.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Belum ada banner</Text>
              <Text style={styles.emptySubtext}>
                Tap tombol Tambah untuk membuat banner baru
              </Text>
            </View>
          ) : (
            <View style={styles.bannerList}>
              {banners.map((banner, index) => (
                <View key={banner.id} style={styles.bannerCard}>
                  {/* Banner Image */}
                  <Image
                    source={{ uri: banner.image }}
                    style={styles.bannerImage}
                  />

                  {/* Banner Info */}
                  <View style={styles.bannerInfo}>
                    <View style={styles.bannerHeader}>
                      <View style={styles.orderBadge}>
                        <Text style={styles.orderText}>#{banner.order}</Text>
                      </View>
                      <View style={styles.bannerActions}>
                        {/* Move Up */}
                        <TouchableOpacity
                          onPress={() => handleMoveUp(banner)}
                          disabled={banner.order === 1}
                          style={[
                            styles.actionButton,
                            banner.order === 1 && styles.actionButtonDisabled,
                          ]}
                        >
                          <Ionicons
                            name="chevron-up"
                            size={20}
                            color={banner.order === 1 ? "#ccc" : "#007AFF"}
                          />
                        </TouchableOpacity>

                        {/* Move Down */}
                        <TouchableOpacity
                          onPress={() => handleMoveDown(banner)}
                          disabled={banner.order === banners.length}
                          style={[
                            styles.actionButton,
                            banner.order === banners.length &&
                              styles.actionButtonDisabled,
                          ]}
                        >
                          <Ionicons
                            name="chevron-down"
                            size={20}
                            color={
                              banner.order === banners.length
                                ? "#ccc"
                                : "#007AFF"
                            }
                          />
                        </TouchableOpacity>

                        {/* Edit */}
                        <TouchableOpacity
                          onPress={() => handleEditBanner(banner)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="create" size={20} color="#FF9500" />
                        </TouchableOpacity>

                        {/* Delete */}
                        <TouchableOpacity
                          onPress={() => handleDeleteBanner(banner)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="trash" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.bannerMeta}>
                      <Text style={styles.bannerUrl} numberOfLines={1}>
                        {banner.image}
                      </Text>
                      <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        <Switch
                          value={banner.active}
                          onValueChange={() => handleToggleActive(banner)}
                          trackColor={{ false: "#d0d0d0", true: "#00C853" }}
                          thumbColor="#fff"
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: banner.active ? "#00C853" : "#999" },
                          ]}
                        >
                          {banner.active ? "Aktif" : "Nonaktif"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? "Edit Banner" : "Tambah Banner"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Image URL Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>URL Gambar</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
                <Text style={styles.inputHint}>
                  Ukuran rekomendasi: 1920x1080 (16:9)
                </Text>
              </View>

              {/* Preview */}
              {imageUrl.trim() !== "" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Preview</Text>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                </View>
              )}

              {/* Active Status */}
              <View style={styles.inputGroup}>
                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.inputLabel}>Status Aktif</Text>
                    <Text style={styles.inputHint}>
                      Banner aktif akan ditampilkan di homepage
                    </Text>
                  </View>
                  <Switch
                    value={isActive}
                    onValueChange={setIsActive}
                    trackColor={{ false: "#d0d0d0", true: "#00C853" }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveBanner}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editMode ? "Update Banner" : "Tambah Banner"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  emptyState: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 48,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  bannerList: {
    gap: 16,
  },
  bannerCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  bannerImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#e0e0e0",
  },
  bannerInfo: {
    padding: 16,
  },
  bannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  orderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  bannerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  actionButtonDisabled: {
    opacity: 0.3,
  },
  bannerMeta: {
    gap: 12,
  },
  bannerUrl: {
    fontSize: 12,
    color: "#666",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#000",
    borderWidth: 2,
    borderColor: "#f5f5f5",
  },
  inputHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  previewImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  bottomSpace: {
    height: 40,
  },
});
