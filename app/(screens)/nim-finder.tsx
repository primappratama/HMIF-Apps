import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

// Mock data mahasiswa
const studentsData = [
  {
    nim: '2021001',
    name: 'Ahmad Fauzi',
    angkatan: '2021',
    email: 'ahmad.fauzi@student.ummi.ac.id',
    phone: '081234567890',
    status: 'Aktif',
  },
  {
    nim: '2021002',
    name: 'Budi Santoso',
    angkatan: '2021',
    email: 'budi.santoso@student.ummi.ac.id',
    phone: '081234567891',
    status: 'Aktif',
  },
  {
    nim: '2022001',
    name: 'Citra Dewi',
    angkatan: '2022',
    email: 'citra.dewi@student.ummi.ac.id',
    phone: '081234567892',
    status: 'Aktif',
  },
  {
    nim: '2022002',
    name: 'Dedi Kurniawan',
    angkatan: '2022',
    email: 'dedi.kurniawan@student.ummi.ac.id',
    phone: '081234567893',
    status: 'Aktif',
  },
  {
    nim: '2023001',
    name: 'Eka Putri',
    angkatan: '2023',
    email: 'eka.putri@student.ummi.ac.id',
    phone: '081234567894',
    status: 'Aktif',
  },
  {
    nim: '2024001',
    name: 'Fajar Ramadhan',
    angkatan: '2024',
    email: 'fajar.ramadhan@student.ummi.ac.id',
    phone: '081234567895',
    status: 'Aktif',
  },
];

export default function NimFinderScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Mohon masukkan NIM');
      return;
    }

    const result = studentsData.find(
      student => student.nim.toLowerCase() === searchQuery.toLowerCase()
    );

    setSearchResult(result);
    setIsSearched(true);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResult(null);
    setIsSearched(false);
  };

  const handleQuickSearch = (nim: string) => {
    setSearchQuery(nim);
    setIsSearched(false);
    setSearchResult(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}>
            <Ionicons name="information-circle" size={24} color="#007AFF" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Cari Data Mahasiswa</Text>
            <Text style={styles.infoText}>
              Masukkan NIM untuk mencari data mahasiswa Informatika UMMI
            </Text>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchSection}>
          <Text style={styles.label}>Nomor Induk Mahasiswa (NIM)</Text>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Contoh: 2021001"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardType="numeric"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.searchButtonText}>Cari Mahasiswa</Text>
          </TouchableOpacity>
        </View>

        {/* Search Result */}
        {isSearched && (
          <View style={styles.resultSection}>
            {searchResult ? (
              <View style={styles.resultCard}>
                {/* Header */}
                <View style={styles.resultHeader}>
                  <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={40} color="#666" />
                  </View>
                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{searchResult.status}</Text>
                  </View>
                </View>

                {/* Info */}
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{searchResult.name}</Text>
                  <Text style={styles.resultNim}>NIM: {searchResult.nim}</Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Details */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconBox}>
                      <Ionicons name="school" size={20} color="#000" />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Angkatan</Text>
                      <Text style={styles.detailValue}>{searchResult.angkatan}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIconBox}>
                      <Ionicons name="mail" size={20} color="#000" />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Email</Text>
                      <Text style={styles.detailValue}>{searchResult.email}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIconBox}>
                      <Ionicons name="call" size={20} color="#000" />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>No. Telepon</Text>
                      <Text style={styles.detailValue}>{searchResult.phone}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.notFoundCard}>
                <View style={styles.notFoundIcon}>
                  <Ionicons name="alert-circle-outline" size={64} color="#999" />
                </View>
                <Text style={styles.notFoundTitle}>Data Tidak Ditemukan</Text>
                <Text style={styles.notFoundText}>
                  NIM "{searchQuery}" tidak terdaftar dalam database mahasiswa HMIF
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Example NIMs */}
        <View style={styles.examplesSection}>
          <Text style={styles.examplesTitle}>Contoh NIM yang Tersedia:</Text>
          <View style={styles.examplesGrid}>
            {['2021001', '2022001', '2023001', '2024001'].map((nim) => (
              <TouchableOpacity
                key={nim}
                style={styles.exampleChip}
                onPress={() => handleQuickSearch(nim)}
                activeOpacity={0.7}
              >
                <Text style={styles.exampleText}>{nim}</Text>
              </TouchableOpacity>
            ))}
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    margin: 24,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6EDFF',
  },
  infoIconBox: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#007AFF',
    lineHeight: 18,
    opacity: 0.8,
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#000',
    borderRadius: 14,
    paddingVertical: 16,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  resultSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: '#fafafa',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00C853',
  },
  resultInfo: {
    marginBottom: 20,
  },
  resultName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  resultNim: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  detailIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  notFoundCard: {
    backgroundColor: '#fafafa',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  notFoundIcon: {
    marginBottom: 20,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  notFoundText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  examplesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  exampleChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  exampleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  bottomSpace: {
    height: 20,
  },
});