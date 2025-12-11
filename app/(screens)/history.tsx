import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

type TabType = 'himpunan' | 'angkatan' | 'ldk';

// Mock data Ketua Himpunan
const ketuaHimpunan = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    period: '2024-2025',
    year: '2024',
    photo: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&size=200&background=000&color=fff',
    achievements: 'Meningkatkan partisipasi mahasiswa sebesar 40% melalui program mentoring dan workshop rutin. Berhasil mengadakan Workshop AI, Hackathon 2024, dan Mentoring Program.',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    period: '2023-2024',
    year: '2023',
    photo: 'https://ui-avatars.com/api/?name=Budi+Santoso&size=200&background=000&color=fff',
    achievements: 'Mengadakan 15 workshop teknologi dan seminar nasional dengan total 500+ peserta. Program unggulan meliputi Web Dev Workshop, Mobile Dev Series, dan Seminar Nasional.',
  },
  {
    id: '3',
    name: 'Citra Dewi',
    period: '2022-2023',
    year: '2022',
    photo: 'https://ui-avatars.com/api/?name=Citra+Dewi&size=200&background=000&color=fff',
    achievements: 'Membangun website HMIF pertama dan sistem informasi akademik berbasis web. Menciptakan Database Mahasiswa yang terintegrasi.',
  },
  {
    id: '4',
    name: 'Dedi Pratama',
    period: '2021-2022',
    year: '2021',
    photo: 'https://ui-avatars.com/api/?name=Dedi+Pratama&size=200&background=000&color=fff',
    achievements: 'Menjalin kerjasama dengan 5 perusahaan IT untuk program magang mahasiswa. Menyelenggarakan Bootcamp UI/UX dan Career Fair.',
  },
];

// Mock data Ketua Angkatan
const ketuaAngkatan = [
  {
    id: '1',
    name: 'Eka Putri Maharani',
    period: 'Angkatan 2024',
    year: '2024',
    photo: 'https://ui-avatars.com/api/?name=Eka+Putri&size=200&background=000&color=fff',
    achievements: 'Koordinasi kegiatan penerimaan mahasiswa baru dengan 85 peserta. Menyelenggarakan OSPEK 2024, Gathering Angkatan, dan Study Group.',
  },
  {
    id: '2',
    name: 'Fajar Ramadhan',
    period: 'Angkatan 2023',
    year: '2023',
    photo: 'https://ui-avatars.com/api/?name=Fajar+Ramadhan&size=200&background=000&color=fff',
    achievements: 'Kompetisi programming antar angkatan dengan 12 tim peserta. Mengadakan Workshop Git dan Tech Talk untuk mahasiswa.',
  },
  {
    id: '3',
    name: 'Gita Permata Sari',
    period: 'Angkatan 2022',
    year: '2022',
    photo: 'https://ui-avatars.com/api/?name=Gita+Sari&size=200&background=000&color=fff',
    achievements: 'Study tour Jakarta & Bandung mengunjungi 7 perusahaan teknologi. Mengadakan Company Visit dan Networking Event.',
  },
  {
    id: '4',
    name: 'Hendra Kusuma',
    period: 'Angkatan 2021',
    year: '2021',
    photo: 'https://ui-avatars.com/api/?name=Hendra+Kusuma&size=200&background=000&color=fff',
    achievements: 'Membangun solidaritas angkatan melalui berbagai kegiatan sosial seperti Bakti Sosial, Donor Darah, dan Penggalangan Dana.',
  },
];

// Mock data Ketua Pelaksana LDK
const ketuaLDK = [
  {
    id: '1',
    name: 'Indra Wijaya',
    period: 'LDK 2024',
    year: '2024',
    photo: 'https://ui-avatars.com/api/?name=Indra+Wijaya&size=200&background=000&color=fff',
    achievements: 'LDK di Gunung Gede dengan 120 peserta, tema "Digital Leadership". Menyelenggarakan Leadership Training, Team Building, dan Outbound.',
  },
  {
    id: '2',
    name: 'Julia Kartika',
    period: 'LDK 2023',
    year: '2023',
    photo: 'https://ui-avatars.com/api/?name=Julia+Kartika&size=200&background=000&color=fff',
    achievements: 'LDK di Cipanas dengan 100 peserta, tema "Tech Innovation". Program meliputi Innovation Workshop, Motivasi Speaker, dan Camping.',
  },
  {
    id: '3',
    name: 'Kurniawan Adi',
    period: 'LDK 2022',
    year: '2022',
    photo: 'https://ui-avatars.com/api/?name=Kurniawan+Adi&size=200&background=000&color=fff',
    achievements: 'LDK di Puncak dengan 95 peserta, tema "Future Ready". Kegiatan Character Building, Public Speaking, dan Adventure.',
  },
];

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('himpunan');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getData = () => {
    switch (activeTab) {
      case 'himpunan':
        return ketuaHimpunan;
      case 'angkatan':
        return ketuaAngkatan;
      case 'ldk':
        return ketuaLDK;
      default:
        return [];
    }
  };

  const renderTimelineItem = (item: any, index: number, isLast: boolean) => {
    const isExpanded = expandedId === item.id;
    const isLatest = index === 0 && activeTab === 'himpunan';
    
    return (
      <View key={item.id} style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
          <View style={styles.timelineDotOuter}>
            <View style={styles.timelineDot} />
          </View>
          {!isLast && <View style={styles.timelineLine} />}
        </View>

        <TouchableOpacity 
          style={styles.timelineCard}
          activeOpacity={0.9}
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.yearBadge}>
              <Ionicons name="calendar" size={12} color="#fff" />
              <Text style={styles.yearText}>{item.year}</Text>
            </View>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#999" 
            />
          </View>

          <View style={styles.leaderSection}>
            <View style={styles.photoWrapper}>
              <Image 
                source={{ uri: item.photo }} 
                style={styles.leaderPhoto}
              />
              {isLatest && <View style={styles.photoOverlay} />}
            </View>
            <View style={styles.leaderDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.leaderName}>{item.name}</Text>
                {isLatest && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentText}>Aktif</Text>
                  </View>
                )}
              </View>
              <View style={styles.periodRow}>
                <Ionicons name="briefcase-outline" size={14} color="#666" />
                <Text style={styles.period}>{item.period}</Text>
              </View>
            </View>
          </View>

          {isExpanded && (
            <View style={styles.descriptionContainer}>
              <View style={styles.divider} />
              <Text style={styles.description}>{item.achievements}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === 'himpunan' && styles.tabActive]}
            onPress={() => setActiveTab('himpunan')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="shield" 
              size={18} 
              color={activeTab === 'himpunan' ? '#fff' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'himpunan' && styles.tabTextActive]}>
              Ketua Himpunan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'angkatan' && styles.tabActive]}
            onPress={() => setActiveTab('angkatan')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="people" 
              size={18} 
              color={activeTab === 'angkatan' ? '#fff' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'angkatan' && styles.tabTextActive]}>
              Ketua Angkatan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'ldk' && styles.tabActive]}
            onPress={() => setActiveTab('ldk')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="flag" 
              size={18} 
              color={activeTab === 'ldk' ? '#fff' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'ldk' && styles.tabTextActive]}>
              Ketua LDK
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timeline}>
          {getData().map((item, index) => 
            renderTimelineItem(item, index, index === getData().length - 1)
          )}
        </View>
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
  tabsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabsContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
  },
  tabActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  timeline: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  timelineLeft: {
    width: 40,
    alignItems: 'center',
    paddingTop: 8,
  },
  timelineDotOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 8,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginLeft: 12,
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  yearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  leaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  photoWrapper: {
    position: 'relative',
  },
  leaderPhoto: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00C853',
    borderWidth: 3,
    borderColor: '#fff',
  },
  leaderDetails: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  leaderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.3,
  },
  currentBadge: {
    backgroundColor: '#00C853',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  currentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  period: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  bottomSpace: {
    height: 20,
  },
});