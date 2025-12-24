import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Student = {
  nim: string;
  name: string;
  angkatan: string;
  email: string;
  phone: string;
};

// Mock data mahasiswa
const studentsData: Student[] = [
  {
    nim: "2021001",
    name: "Ahmad Fauzi",
    angkatan: "2021",
    email: "ahmad.fauzi@student.ummi.ac.id",
    phone: "081234567890",
  },
  {
    nim: "2021002",
    name: "Siti Nurhaliza",
    angkatan: "2021",
    email: "siti.nurhaliza@student.ummi.ac.id",
    phone: "081234567891",
  },
  {
    nim: "2021003",
    name: "Budi Santoso",
    angkatan: "2021",
    email: "budi.santoso@student.ummi.ac.id",
    phone: "081234567892",
  },
  {
    nim: "2021004",
    name: "Rina Wijaya",
    angkatan: "2021",
    email: "rina.wijaya@student.ummi.ac.id",
    phone: "081234567893",
  },
  {
    nim: "2022001",
    name: "Dika Pratama",
    angkatan: "2022",
    email: "dika.pratama@student.ummi.ac.id",
    phone: "081234567894",
  },
  {
    nim: "2022002",
    name: "Maya Sari",
    angkatan: "2022",
    email: "maya.sari@student.ummi.ac.id",
    phone: "081234567895",
  },
  {
    nim: "2022003",
    name: "Rizky Firmansyah",
    angkatan: "2022",
    email: "rizky.f@student.ummi.ac.id",
    phone: "081234567896",
  },
  {
    nim: "2023001",
    name: "Fitri Handayani",
    angkatan: "2023",
    email: "fitri.h@student.ummi.ac.id",
    phone: "081234567897",
  },
  {
    nim: "2023002",
    name: "Andi Setiawan",
    angkatan: "2023",
    email: "andi.s@student.ummi.ac.id",
    phone: "081234567898",
  },
  {
    nim: "2024001",
    name: "Galih Permana",
    angkatan: "2024",
    email: "galih.p@student.ummi.ac.id",
    phone: "081234567899",
  },
  {
    nim: "2024002",
    name: "Hani Safitri",
    angkatan: "2024",
    email: "hani.s@student.ummi.ac.id",
    phone: "081234567800",
  },
];

export default function NimFinderScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowSuggestions(false);
      setSelectedStudent(null);
      return;
    }

    // Search by NIM or Name (live search)
    const results = studentsData.filter(
      (student) =>
        student.nim.toLowerCase().includes(query.toLowerCase()) ||
        student.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setShowSuggestions(true);
    setSelectedStudent(null);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery(student.nim);
    setShowSuggestions(false);
    setSearchResults([]);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedStudent(null);
    setShowSuggestions(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="search" size={24} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Cari Data Mahasiswa</Text>
            <Text style={styles.infoText}>
              Masukkan NIM atau nama untuk mencari data mahasiswa
            </Text>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Ketik NIM atau Nama..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
            />
            {searchQuery !== "" && (
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Suggestions */}
          {showSuggestions && searchResults.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>
                {searchResults.length} hasil ditemukan
              </Text>
              {searchResults.map((student) => (
                <TouchableOpacity
                  key={student.nim}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectStudent(student)}
                  activeOpacity={0.7}
                >
                  <View style={styles.suggestionLeft}>
                    <View style={styles.suggestionAvatar}>
                      <Ionicons name="person" size={20} color="#666" />
                    </View>
                    <View style={styles.suggestionInfo}>
                      <Text style={styles.suggestionName}>{student.name}</Text>
                      <Text style={styles.suggestionNim}>
                        NIM: {student.nim}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* No Results */}
          {showSuggestions &&
            searchResults.length === 0 &&
            searchQuery !== "" && (
              <View style={styles.noResultsContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
                <Text style={styles.noResultsTitle}>Tidak Ditemukan</Text>
                <Text style={styles.noResultsText}>
                  Mahasiswa dengan NIM atau nama "{searchQuery}" tidak ditemukan
                </Text>
              </View>
            )}
        </View>

        {/* Student Detail */}
        {selectedStudent && (
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Data Mahasiswa</Text>

            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <View style={styles.detailAvatar}>
                  <Ionicons name="person" size={40} color="#666" />
                </View>
                <View style={styles.angkatanBadge}>
                  <Text style={styles.angkatanText}>
                    Angkatan {selectedStudent.angkatan}
                  </Text>
                </View>
              </View>

              <View style={styles.detailBody}>
                <View style={styles.detailRow}>
                  <View style={styles.detailLabel}>
                    <Ionicons name="card-outline" size={18} color="#666" />
                    <Text style={styles.detailLabelText}>NIM</Text>
                  </View>
                  <Text style={styles.detailValue}>{selectedStudent.nim}</Text>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailLabel}>
                    <Ionicons name="person-outline" size={18} color="#666" />
                    <Text style={styles.detailLabelText}>Nama Lengkap</Text>
                  </View>
                  <Text style={styles.detailValue}>{selectedStudent.name}</Text>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailLabel}>
                    <Ionicons name="mail-outline" size={18} color="#666" />
                    <Text style={styles.detailLabelText}>Email</Text>
                  </View>
                  <Text style={styles.detailValue}>
                    {selectedStudent.email}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailLabel}>
                    <Ionicons name="call-outline" size={18} color="#666" />
                    <Text style={styles.detailLabelText}>No. Telepon</Text>
                  </View>
                  <Text style={styles.detailValue}>
                    {selectedStudent.phone}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Quick Search */}
        {!selectedStudent && !showSuggestions && (
          <View style={styles.quickSearchSection}>
            <Text style={styles.quickSearchTitle}>Pencarian Cepat</Text>
            <View style={styles.quickSearchGrid}>
              <TouchableOpacity
                style={styles.quickSearchButton}
                onPress={() => handleSearch("2021")}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.quickSearchText}>Angkatan 2021</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickSearchButton}
                onPress={() => handleSearch("2022")}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.quickSearchText}>Angkatan 2022</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickSearchButton}
                onPress={() => handleSearch("2023")}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.quickSearchText}>Angkatan 2023</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickSearchButton}
                onPress={() => handleSearch("2024")}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.quickSearchText}>Angkatan 2024</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#F0F8FF",
    margin: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D6EDFF",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#007AFF",
    lineHeight: 18,
    opacity: 0.8,
  },
  searchSection: {
    paddingHorizontal: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f0f0f0",
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    marginTop: 16,
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  suggestionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  suggestionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  suggestionNim: {
    fontSize: 13,
    color: "#666",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  detailSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  detailCard: {
    backgroundColor: "#fafafa",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  detailHeader: {
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 20,
  },
  detailAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  angkatanBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  angkatanText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  detailBody: {
    gap: 16,
  },
  detailRow: {
    gap: 8,
  },
  detailLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  detailLabelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    paddingLeft: 26,
  },
  quickSearchSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  quickSearchTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  quickSearchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickSearchButton: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  quickSearchText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  bottomSpace: {
    height: 40,
  },
});
