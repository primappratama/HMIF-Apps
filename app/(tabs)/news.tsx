import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "semua" | "prestasi" | "kegiatan" | "pengumuman";

type NewsItem = {
  id: string;
  title: string;
  category: "prestasi" | "kegiatan" | "pengumuman";
  date: string;
  image: string;
  excerpt: string;
  tags: string[];
};

const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Tim HMIF Raih Juara 1 Hackathon Nasional 2024",
    category: "prestasi",
    date: "10 Desember 2024",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
    excerpt:
      "Tim dari HMIF UMMI berhasil meraih juara pertama dalam kompetisi hackathon tingkat nasional dengan mengembangkan solusi inovatif untuk smart city.",
    tags: ["Kompetisi", "Teknologi", "Juara"],
  },
  {
    id: "2",
    title: "Workshop React Native: Build Your First Mobile App",
    category: "kegiatan",
    date: "8 Desember 2024",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    excerpt:
      "HMIF mengadakan workshop React Native untuk membantu mahasiswa membangun aplikasi mobile pertama mereka.",
    tags: ["Workshop", "Mobile Dev", "React Native"],
  },
  {
    id: "3",
    title: "Pengumuman: Pendaftaran Anggota Baru Dibuka",
    category: "pengumuman",
    date: "5 Desember 2024",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    excerpt:
      "Pendaftaran anggota baru HMIF periode 2024/2025 resmi dibuka. Daftarkan diri Anda sekarang!",
    tags: ["Pendaftaran", "Anggota Baru"],
  },
  {
    id: "4",
    title: "Seminar: AI & Machine Learning in Real World",
    category: "kegiatan",
    date: "3 Desember 2024",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    excerpt:
      "Seminar tentang implementasi AI dan Machine Learning di industri dengan pembicara dari perusahaan tech terkemuka.",
    tags: ["Seminar", "AI", "Machine Learning"],
  },
  {
    id: "5",
    title: "Mahasiswa Informatika Raih Best Paper di Konferensi Internasional",
    category: "prestasi",
    date: "1 Desember 2024",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
    excerpt:
      "Paper penelitian mahasiswa Informatika UMMI terpilih sebagai Best Paper dalam konferensi internasional.",
    tags: ["Penelitian", "Prestasi", "Internasional"],
  },
];

export default function NewsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("semua");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getFilteredNews = () => {
    if (activeFilter === "semua") return newsData;
    return newsData.filter((news) => news.category === activeFilter);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "prestasi":
        return "#FF9500";
      case "kegiatan":
        return "#007AFF";
      case "pengumuman":
        return "#00C853";
      default:
        return "#666";
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "prestasi":
        return "Prestasi";
      case "kegiatan":
        return "Kegiatan";
      case "pengumuman":
        return "Pengumuman";
      default:
        return category;
    }
  };

  const renderNewsCard = (item: NewsItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.newsCard}
      onPress={() =>
        router.push({
          pathname: "/(screens)/news-detail",
          params: { id: item.id },
        })
      }
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(item.category) },
            ]}
          >
            <Text style={styles.categoryText}>
              {getCategoryText(item.category)}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={14} color="#999" />
            <Text style={styles.newsDate}>{item.date}</Text>
          </View>
        </View>

        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.newsExcerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>

        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Berita & Informasi</Text>
        <Text style={styles.headerSubtitle}>Update terbaru dari HMIF UMMI</Text>
      </View>

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
              activeFilter === "prestasi" && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter("prestasi")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="trophy"
              size={16}
              color={activeFilter === "prestasi" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === "prestasi" && styles.filterTextActive,
              ]}
            >
              Prestasi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "kegiatan" && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter("kegiatan")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar"
              size={16}
              color={activeFilter === "kegiatan" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === "kegiatan" && styles.filterTextActive,
              ]}
            >
              Kegiatan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "pengumuman" && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter("pengumuman")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="megaphone"
              size={16}
              color={activeFilter === "pengumuman" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === "pengumuman" && styles.filterTextActive,
              ]}
            >
              Pengumuman
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* News List */}
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
        <View style={styles.newsList}>
          {getFilteredNews().map(renderNewsCard)}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
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
  newsList: {
    padding: 24,
    gap: 20,
  },
  newsCard: {
    backgroundColor: "#fafafa",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  newsImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#e0e0e0",
  },
  newsContent: {
    padding: 20,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  newsDate: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  newsExcerpt: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 14,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  bottomSpace: {
    height: 20,
  },
});
