import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// Mock data berita
const newsData = [
  {
    id: '1',
    title: 'HMIF UMMI Raih Juara 1 Kompetisi Hackathon Nasional',
    category: 'Prestasi',
    date: '10 Des 2024',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400',
    excerpt: 'Tim HMIF UMMI berhasil meraih juara pertama dalam kompetisi hackathon tingkat nasional...',
  },
  {
    id: '2',
    title: 'Workshop AI & Machine Learning Dihadiri 150 Peserta',
    category: 'Kegiatan',
    date: '8 Des 2024',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    excerpt: 'HMIF menyelenggarakan workshop AI yang diikuti oleh mahasiswa dari berbagai universitas...',
  },
  {
    id: '3',
    title: 'Kerjasama dengan 5 Perusahaan IT Terkemuka',
    category: 'Pengumuman',
    date: '5 Des 2024',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    excerpt: 'HMIF menjalin kerjasama strategis dengan perusahaan IT untuk program magang mahasiswa...',
  },
  {
    id: '4',
    title: 'Seminar Nasional: Future of Technology 2025',
    category: 'Event',
    date: '1 Des 2024',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    excerpt: 'Menghadirkan pembicara dari Google Indonesia dan praktisi IT ternama...',
  },
];

export default function NewsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const renderNewsCard = (item: any) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.newsCard} 
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/(screens)/news-detail',
        params: {
          id: item.id,
          title: item.title,
          category: item.category,
          date: item.date,
          image: item.image,
          excerpt: item.excerpt,
        }
      })}
    >
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={14} color="#999" />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.newsExcerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="newspaper" size={24} color="#000" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Berita HMIF</Text>
            <Text style={styles.headerSubtitle}>Update & Informasi Terkini</Text>
          </View>
        </View>
      </View>

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
        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]} activeOpacity={0.7}>
              <Text style={[styles.filterText, styles.filterTextActive]}>Semua</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Text style={styles.filterText}>Prestasi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Text style={styles.filterText}>Kegiatan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Text style={styles.filterText}>Pengumuman</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* News List */}
        <View style={styles.newsList}>
          {newsData.map(renderNewsCard)}
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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  newsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  newsCard: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  newsImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e0e0e0',
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  newsExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomSpace: {
    height: 20,
  },
});