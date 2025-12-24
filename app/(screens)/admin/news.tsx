import { useAuth } from "@/context/AuthContext";
import {
  createNews,
  deleteNews,
  getAllNews,
  News,
  updateNews,
} from "@/services/news.service";
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

const categories = [
  { value: "pengumuman", label: "Pengumuman", color: "#007AFF" },
  { value: "berita", label: "Berita", color: "#00C853" },
  { value: "info", label: "Info", color: "#FF9500" },
];

export default function NewsManagementScreen() {
  const { user } = useAuth();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<"pengumuman" | "berita" | "info">(
    "pengumuman"
  );
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await getAllNews();
      setNewsList(data);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat berita");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = () => {
    setEditMode(false);
    setSelectedNews(null);
    setTitle("");
    setContent("");
    setImageUrl("");
    setCategory("pengumuman");
    setFeatured(false);
    setModalVisible(true);
  };

  const handleEditNews = (news: News) => {
    setEditMode(true);
    setSelectedNews(news);
    setTitle(news.title);
    setContent(news.content);
    setImageUrl(news.image);
    setCategory(news.category);
    setFeatured(news.featured);
    setModalVisible(true);
  };

  const handleSaveNews = async () => {
    if (!title.trim() || !content.trim() || !imageUrl.trim()) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      Alert.alert(
        "Error",
        "URL gambar harus dimulai dengan http:// atau https://"
      );
      return;
    }

    setSaving(true);

    try {
      if (editMode && selectedNews) {
        await updateNews(selectedNews.id, {
          title,
          content,
          image: imageUrl,
          category,
          featured,
        });
        Alert.alert("Sukses", "Berita berhasil diupdate");
      } else {
        await createNews(
          title,
          content,
          imageUrl,
          category,
          user?.name || "Admin",
          featured
        );
        Alert.alert("Sukses", "Berita berhasil ditambahkan");
      }

      setModalVisible(false);
      loadNews();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNews = (news: News) => {
    Alert.alert(
      "Hapus Berita",
      "Apakah Anda yakin ingin menghapus berita ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNews(news.id);
              Alert.alert("Sukses", "Berita berhasil dihapus");
              loadNews();
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus berita");
            }
          },
        },
      ]
    );
  };

  const getCategoryColor = (cat: string) => {
    return categories.find((c) => c.value === cat)?.color || "#666";
  };

  const getCategoryLabel = (cat: string) => {
    return categories.find((c) => c.value === cat)?.label || cat;
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
          <Text style={styles.loadingText}>Memuat berita...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{newsList.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {newsList.filter((n) => n.featured).length}
          </Text>
          <Text style={styles.statLabel}>Featured</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {newsList.reduce((sum, n) => sum + n.views, 0)}
          </Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* News List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daftar Berita</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddNews}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {newsList.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="newspaper-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Belum ada berita</Text>
              <Text style={styles.emptySubtext}>
                Tap tombol Tambah untuk membuat berita baru
              </Text>
            </View>
          ) : (
            <View style={styles.newsList}>
              {newsList.map((news) => (
                <View key={news.id} style={styles.newsCard}>
                  {/* Featured Badge */}
                  {news.featured && (
                    <View style={styles.featuredBadge}>
                      <Ionicons name="star" size={12} color="#fff" />
                      <Text style={styles.featuredText}>Featured</Text>
                    </View>
                  )}

                  {/* News Image */}
                  <Image
                    source={{ uri: news.image }}
                    style={styles.newsImage}
                  />

                  {/* News Content */}
                  <View style={styles.newsContent}>
                    <View style={styles.newsHeader}>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: getCategoryColor(news.category) },
                        ]}
                      >
                        <Text style={styles.categoryText}>
                          {getCategoryLabel(news.category)}
                        </Text>
                      </View>
                      <View style={styles.newsActions}>
                        <TouchableOpacity
                          onPress={() => handleEditNews(news)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="create" size={18} color="#007AFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteNews(news)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="trash" size={18} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={styles.newsTitle} numberOfLines={2}>
                      {news.title}
                    </Text>

                    <Text style={styles.newsExcerpt} numberOfLines={2}>
                      {news.content}
                    </Text>

                    <View style={styles.newsMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="person-outline"
                          size={14}
                          color="#666"
                        />
                        <Text style={styles.metaText}>{news.author}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="eye-outline" size={14} color="#666" />
                        <Text style={styles.metaText}>{news.views} views</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.metaText}>
                          {new Date(news.publishedAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
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
                {editMode ? "Edit Berita" : "Tambah Berita"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Judul Berita</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan judul berita"
                  value={title}
                  onChangeText={setTitle}
                  multiline
                />
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kategori</Text>
                <View style={styles.categorySelector}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.value}
                      style={[
                        styles.categoryOption,
                        category === cat.value && {
                          backgroundColor: cat.color,
                          borderColor: cat.color,
                        },
                      ]}
                      onPress={() => setCategory(cat.value as any)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          category === cat.value &&
                            styles.categoryOptionTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Content */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Konten Berita</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Masukkan konten berita"
                  value={content}
                  onChangeText={setContent}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              {/* Image URL */}
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

              {/* Featured Toggle */}
              <View style={styles.inputGroup}>
                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.inputLabel}>
                      Tandai sebagai Featured
                    </Text>
                    <Text style={styles.inputHint}>
                      Berita featured akan ditampilkan di halaman utama
                    </Text>
                  </View>
                  <Switch
                    value={featured}
                    onValueChange={setFeatured}
                    trackColor={{ false: "#d0d0d0", true: "#FFD700" }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveNews}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editMode ? "Update Berita" : "Publish Berita"}
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
  newsList: {
    gap: 16,
  },
  newsCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    position: "relative",
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  newsImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#e0e0e0",
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  newsActions: {
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
  newsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    lineHeight: 22,
    marginBottom: 8,
  },
  newsExcerpt: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 12,
  },
  newsMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
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
  textArea: {
    minHeight: 120,
  },
  inputHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  categorySelector: {
    flexDirection: "row",
    gap: 8,
  },
  categoryOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f0f0f0",
    alignItems: "center",
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  categoryOptionTextActive: {
    color: "#fff",
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
