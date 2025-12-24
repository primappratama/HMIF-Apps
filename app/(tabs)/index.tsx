import { useAuth } from "@/context/AuthContext";
import { Banner, getActiveBanners } from "@/services/banner.service";
import { getAllKegiatan, Kegiatan } from "@/services/kegiatan.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Quick actions
const quickActions = [
  {
    id: "1",
    title: "Kalender",
    icon: "calendar",
    route: "/(screens)/calendar",
  },
  {
    id: "2",
    title: "Sejarah",
    icon: "time",
    route: "/(screens)/history",
  },
  {
    id: "3",
    title: "Keuangan",
    icon: "wallet",
    route: "/(screens)/finance",
  },
  {
    id: "4",
    title: "NIM Finder",
    icon: "search",
    route: "/(screens)/nim-finder",
  },
];

// Notifications data
type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
};

const notificationsData: Notification[] = [
  {
    id: "1",
    title: "Workshop React Native",
    message: "Workshop akan dimulai besok pukul 09:00 WIB",
    time: "5 menit lalu",
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "Pembayaran Iuran",
    message: "Iuran bulan ini telah diterima",
    time: "2 jam lalu",
    read: false,
    type: "success",
  },
  {
    id: "3",
    title: "Pengumuman Penting",
    message: "Rapat pengurus akan dilaksanakan hari Jumat",
    time: "1 hari lalu",
    read: true,
    type: "warning",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const carouselRef = useRef(null);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [bannerData, setBannerData] = useState<Banner[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(-400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const unreadCount = notificationsData.filter((n) => !n.read).length;

  useEffect(() => {
    loadKegiatan();
    loadBanners();
  }, []);

  const loadKegiatan = async () => {
    try {
      const data = await getAllKegiatan();
      const upcomingKegiatan = data
        .filter((k) => k.status === "mendatang")
        .slice(0, 3);
      setKegiatanList(upcomingKegiatan);
    } catch (error) {
      console.error("Error loading kegiatan:", error);
    }
  };

  const loadBanners = async () => {
    try {
      const data = await getActiveBanners();
      setBannerData(data);
    } catch (error) {
      console.error("Error loading banners:", error);
    }
  };

  const toggleNotifications = () => {
    if (showNotifications) {
      // Close animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -400,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowNotifications(false));
    } else {
      // Open animation
      setShowNotifications(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "warning":
        return "alert-circle";
      default:
        return "information-circle";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "#00C853";
      case "warning":
        return "#FF9500";
      default:
        return "#007AFF";
    }
  };

  const handleActionPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
  };

  const renderCarouselItem = ({ item }: { item: Banner }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Selamat Datang</Text>
          <Text style={styles.appName}>{user?.name || "HMIF UMMI"}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={toggleNotifications}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#000" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notification Dropdown Overlay */}
      {showNotifications && (
        <TouchableWithoutFeedback onPress={toggleNotifications}>
          <Animated.View
            style={[styles.notificationOverlay, { opacity: fadeAnim }]}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.notificationDropdown,
                  { transform: [{ translateY: slideAnim }] },
                ]}
              >
                {/* Dropdown Header */}
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownTitle}>Notifikasi</Text>
                  <TouchableOpacity onPress={toggleNotifications}>
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                </View>

                {/* Notifications List */}
                <ScrollView
                  style={styles.notificationsList}
                  showsVerticalScrollIndicator={false}
                >
                  {notificationsData.map((notification) => (
                    <TouchableOpacity
                      key={notification.id}
                      style={[
                        styles.notificationItem,
                        !notification.read && styles.notificationItemUnread,
                      ]}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.notificationIcon,
                          {
                            backgroundColor: `${getNotificationColor(
                              notification.type
                            )}20`,
                          },
                        ]}
                      >
                        <Ionicons
                          name={getNotificationIcon(notification.type)}
                          size={24}
                          color={getNotificationColor(notification.type)}
                        />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>
                          {notification.title}
                        </Text>
                        <Text style={styles.notificationMessage}>
                          {notification.message}
                        </Text>
                        <Text style={styles.notificationTime}>
                          {notification.time}
                        </Text>
                      </View>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </TouchableOpacity>
                  ))}

                  {/* Empty State */}
                  {notificationsData.length === 0 && (
                    <View style={styles.emptyState}>
                      <Ionicons
                        name="notifications-off-outline"
                        size={48}
                        color="#ccc"
                      />
                      <Text style={styles.emptyStateText}>
                        Tidak ada notifikasi
                      </Text>
                    </View>
                  )}
                </ScrollView>

                {/* View All Button */}
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => {
                    toggleNotifications();
                    router.push("/(screens)/notifications");
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllText}>Lihat Semua Notifikasi</Text>
                  <Ionicons name="arrow-forward" size={16} color="#007AFF" />
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Carousel Banner */}
        {bannerData.length > 0 && (
          <View style={styles.carouselSection}>
            <Carousel
              ref={carouselRef}
              width={width - 48}
              height={180}
              data={bannerData}
              renderItem={renderCarouselItem}
              autoPlay={true}
              autoPlayInterval={4000}
              scrollAnimationDuration={800}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.94,
                parallaxScrollingOffset: 40,
              }}
              style={{ width: width }}
              onSnapToItem={(index) => setActiveSlide(index)}
            />

            {/* Dot Indicator */}
            <View style={styles.dotContainer}>
              {bannerData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeSlide === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akses Cepat</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={() => handleActionPress(action.route)}
                activeOpacity={0.7}
              >
                <View style={styles.quickActionIconBox}>
                  <Ionicons name={action.icon as any} size={24} color="#000" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Kegiatan Terbaru Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kegiatan Terbaru</Text>
            <TouchableOpacity
              onPress={() => router.push("/(screens)/kegiatan")}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {kegiatanList.length === 0 ? (
            <View style={styles.emptyKegiatan}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Belum ada kegiatan mendatang</Text>
            </View>
          ) : (
            <View style={styles.kegiatanList}>
              {kegiatanList.map((kegiatan) => (
                <TouchableOpacity
                  key={kegiatan.id}
                  style={styles.kegiatanCard}
                  onPress={() => router.push("/(screens)/kegiatan")}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: kegiatan.image }}
                    style={styles.kegiatanImage}
                  />
                  <View style={styles.kegiatanContent}>
                    <View style={styles.kegiatanHeader}>
                      <View style={styles.kegiatanBadge}>
                        <Text style={styles.kegiatanBadgeText}>
                          {kegiatan.category}
                        </Text>
                      </View>
                      <View style={styles.kegiatanStatus}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Akan Datang</Text>
                      </View>
                    </View>

                    <Text style={styles.kegiatanTitle} numberOfLines={2}>
                      {kegiatan.title}
                    </Text>

                    <View style={styles.kegiatanMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color="#666"
                        />
                        <Text style={styles.metaText}>{kegiatan.date}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="people-outline"
                          size={14}
                          color="#666"
                        />
                        <Text style={styles.metaText}>
                          {kegiatan.participants}/{kegiatan.maxParticipants}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi</Text>
          <View style={styles.infoCards}>
            <TouchableOpacity
              style={styles.infoCard}
              onPress={() => router.push("/(tabs)/news")}
              activeOpacity={0.8}
            >
              <View
                style={[styles.infoIconBox, { backgroundColor: "#E3F2FD" }]}
              >
                <Ionicons name="newspaper" size={24} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Pengumuman Terbaru</Text>
                <Text style={styles.infoDescription}>
                  Lihat berita dan pengumuman HMIF
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoCard}
              onPress={() => router.push("/(screens)/organization")}
              activeOpacity={0.8}
            >
              <View
                style={[styles.infoIconBox, { backgroundColor: "#E8F5E9" }]}
              >
                <Ionicons name="people" size={24} color="#00C853" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Struktur Organisasi</Text>
                <Text style={styles.infoDescription}>
                  Kenali pengurus HMIF UMMI
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  notificationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  notificationDropdown: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    maxHeight: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.3,
  },
  notificationsList: {
    maxHeight: 320,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 12,
  },
  notificationItemUnread: {
    backgroundColor: "#F0F8FF",
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 11,
    color: "#999",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  content: {
    flex: 1,
  },
  carouselSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  carouselItem: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    resizeMode: "cover",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d0d0d0",
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  quickActionItem: {
    alignItems: "center",
    width: (width - 48) / 4,
  },
  quickActionIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  kegiatanList: {
    gap: 16,
  },
  kegiatanCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row",
    height: 120,
  },
  kegiatanImage: {
    width: 120,
    height: 120,
    backgroundColor: "#e0e0e0",
  },
  kegiatanContent: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  kegiatanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  kegiatanBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  kegiatanBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  kegiatanStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#007AFF",
  },
  kegiatanTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    lineHeight: 20,
    marginBottom: 8,
  },
  kegiatanMeta: {
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
    fontWeight: "500",
  },
  emptyKegiatan: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
  },
  infoCards: {
    gap: 12,
    marginTop: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 18,
    borderRadius: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  infoIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  infoDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  bottomSpace: {
    height: 20,
  },
});
