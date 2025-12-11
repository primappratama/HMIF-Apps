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
import Ionicons from '@expo/vector-icons/Ionicons';

type FilterType = 'semua' | 'mendatang' | 'berlangsung' | 'selesai';

// Mock data kegiatan
const activitiesData = [
  {
    id: '1',
    title: 'Workshop AI & Machine Learning',
    category: 'Workshop',
    date: '15 Desember 2024',
    time: '09:00 - 16:00 WIB',
    location: 'Lab Komputer Gedung A',
    status: 'mendatang',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    participants: 45,
    maxParticipants: 50,
    description: 'Workshop intensif tentang AI dan Machine Learning untuk mahasiswa',
  },
  {
    id: '2',
    title: 'Seminar Nasional: Future of Technology',
    category: 'Seminar',
    date: '20 Desember 2024',
    time: '08:00 - 15:00 WIB',
    location: 'Auditorium Utama',
    status: 'mendatang',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    participants: 120,
    maxParticipants: 200,
    description: 'Seminar nasional dengan pembicara dari perusahaan tech terkemuka',
  },
  {
    id: '3',
    title: 'Hackathon HMIF 2025',
    category: 'Competition',
    date: '10 Januari 2025',
    time: '08:00 - 20:00 WIB',
    location: 'Kampus UMMI',
    status: 'mendatang',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400',
    participants: 30,
    maxParticipants: 40,
    description: '48 jam coding marathon dengan hadiah total 10 juta rupiah',
  },
  {
    id: '4',
    title: 'LDK (Latihan Dasar Kepemimpinan)',
    category: 'Training',
    date: '5 Desember 2024',
    time: '07:00 - 17:00 WIB',
    location: 'Gunung Gede',
    status: 'selesai',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
    participants: 85,
    maxParticipants: 85,
    description: 'Pelatihan kepemimpinan untuk pengurus HMIF',
  },
  {
    id: '5',
    title: 'Gathering Angkatan 2024',
    category: 'Social',
    date: '1 Desember 2024',
    time: '16:00 - 21:00 WIB',
    location: 'Taman Kota',
    status: 'selesai',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    participants: 65,
    maxParticipants: 70,
    description: 'Acara kumpul bersama mahasiswa angkatan 2024',
  },
];

export default function KegiatanScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('semua');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getFilteredActivities = () => {
    if (activeFilter === 'semua') return activitiesData;
    return activitiesData.filter(activity => activity.status === activeFilter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mendatang':
        return '#007AFF';
      case 'berlangsung':
        return '#00C853';
      case 'selesai':
        return '#999';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'mendatang':
        return 'Akan Datang';
      case 'berlangsung':
        return 'Berlangsung';
      case 'selesai':
        return 'Selesai';
      default:
        return status;
    }
  };

  const renderActivityCard = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.activityCard} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.activityImage} />
      
      <View style={styles.activityContent}>
        {/* Category & Status */}
        <View style={styles.activityHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
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
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
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
                { width: `${(item.participants / item.maxParticipants) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'semua' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('semua')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'semua' && styles.filterTextActive]}>
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'mendatang' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('mendatang')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'mendatang' && styles.filterTextActive]}>
              Akan Datang
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'berlangsung' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('berlangsung')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'berlangsung' && styles.filterTextActive]}>
              Berlangsung
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'selesai' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('selesai')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'selesai' && styles.filterTextActive]}>
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
        <View style={styles.activitiesList}>
          {getFilteredActivities().map(renderActivityCard)}
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
  filterSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  content: {
    flex: 1,
  },
  activitiesList: {
    padding: 24,
    gap: 20,
  },
  activityCard: {
    backgroundColor: '#fafafa',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  activityImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e0e0e0',
  },
  activityContent: {
    padding: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsRow: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  participantsRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  participantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  participantsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00C853',
    borderRadius: 3,
  },
  bottomSpace: {
    height: 20,
  },
});