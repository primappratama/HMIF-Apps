import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router'; // ← Tambahkan ini
import Ionicons from '@expo/vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

// Mock data untuk banner
const bannerData = [
  {
    id: '1',
    title: 'Workshop Web Development',
    description: 'Belajar membuat website modern',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    date: '15 Des',
  },
  {
    id: '2',
    title: 'Seminar AI & ML',
    description: 'Kecerdasan buatan masa depan',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    date: '20 Des',
  },
  {
    id: '3',
    title: 'Hackathon 2025',
    description: '48 jam coding marathon',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
    date: '10 Jan',
  },
];

// Quick actions dengan route
const quickActions = [
  { 
    id: '1', 
    title: 'NIM Finder', 
    icon: 'search',
    route: '/(screens)/nim-finder', // ← Tambahkan route
  },
  { 
    id: '2', 
    title: 'Sejarah', 
    icon: 'time',
    route: '/(screens)/history', // ← Tambahkan route
  },
  { 
    id: '3', 
    title: 'Keuangan', 
    icon: 'wallet',
    route: '/(screens)/finance', // ← Tambahkan route
  },
  { 
    id: '4', 
    title: 'Kegiatan', 
    icon: 'calendar',
    route: '/(screens)/kegiatan', // ← Coming soon
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter(); // ← Tambahkan ini
  const [refreshing, setRefreshing] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const handleActionPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
  };

  const renderBannerItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.bannerCard} 
      activeOpacity={0.95}
      onPress={() => console.log('Banner pressed:', item.id)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <View style={styles.bannerOverlay}>
        <View style={styles.bannerBadge}>
          <Ionicons name="calendar" size={12} color="#fff" />
          <Text style={styles.bannerDate}>{item.date}</Text>
        </View>
        <Text style={styles.bannerTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bannerDesc} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#000"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('@/assets/images/hmif-logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user?.name || 'Mahasiswa HMIF'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Banner Carousel */}
        <View style={styles.carouselSection}>
          <Carousel
            loop
            width={width}
            height={220}
            autoPlay={true}
            autoPlayInterval={4000}
            data={bannerData}
            scrollAnimationDuration={800}
            onSnapToItem={(index) => setActiveSlide(index)}
            renderItem={renderBannerItem}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
          />
          
          {/* Pagination */}
          <View style={styles.pagination}>
            {bannerData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeSlide && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akses Cepat</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                activeOpacity={0.7}
                onPress={() => handleActionPress(action.route)} // ← Tambah handler
              >
                <View style={styles.actionIconBox}>
                  <Ionicons 
                    name={action.icon as any} 
                    size={24} 
                    color="#000" 
                  />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informasi</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.infoCard} 
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/news')} // ← Tambah navigation
          >
            <View style={styles.infoIconBox}>
              <Ionicons name="megaphone" size={22} color="#000" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Pengumuman Terbaru</Text>
              <Text style={styles.infoDesc}>
                Informasi penting dari kepengurusan HMIF
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.infoCard} 
            activeOpacity={0.8}
            onPress={() => router.push('/(screens)/history')} // ← Tambah navigation
          >
            <View style={styles.infoIconBox}>
              <Ionicons name="people" size={22} color="#000" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Struktur Organisasi</Text>
              <Text style={styles.infoDesc}>
                Lihat kepengurusan HMIF periode ini
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  greeting: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.3,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#fff',
  },
  carouselSection: {
    marginBottom: 32,
  },
  bannerCard: {
    marginHorizontal: 0,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 8,
  },
  bannerDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  bannerDesc: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d0d0d0',
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#000',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 72) / 4,
    alignItems: 'center',
    gap: 10,
  },
  actionIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.2,
  },
  infoDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  bottomSpace: {
    height: 20,
  },
});