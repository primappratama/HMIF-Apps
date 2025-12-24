import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Member = {
  id: string;
  name: string;
  position: string;
  division?: string;
  image: string;
  nim: string;
  email: string;
};

const organizationData = {
  inti: [
    {
      id: "1",
      name: "Ahmad Fauzi",
      position: "Ketua Umum",
      image:
        "https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=000&color=fff&size=200",
      nim: "2021001",
      email: "ahmad.fauzi@student.ummi.ac.id",
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      position: "Wakil Ketua",
      image:
        "https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=007AFF&color=fff&size=200",
      nim: "2021002",
      email: "siti.nurhaliza@student.ummi.ac.id",
    },
    {
      id: "3",
      name: "Budi Santoso",
      position: "Sekretaris",
      image:
        "https://ui-avatars.com/api/?name=Budi+Santoso&background=00C853&color=fff&size=200",
      nim: "2021003",
      email: "budi.santoso@student.ummi.ac.id",
    },
    {
      id: "4",
      name: "Rina Wijaya",
      position: "Bendahara",
      image:
        "https://ui-avatars.com/api/?name=Rina+Wijaya&background=FF9500&color=fff&size=200",
      nim: "2021004",
      email: "rina.wijaya@student.ummi.ac.id",
    },
  ],
  divisions: [
    {
      id: "5",
      name: "Dika Pratama",
      position: "Koordinator",
      division: "Divisi Akademik",
      image:
        "https://ui-avatars.com/api/?name=Dika+Pratama&background=9C27B0&color=fff&size=200",
      nim: "2022001",
      email: "dika.pratama@student.ummi.ac.id",
    },
    {
      id: "6",
      name: "Maya Sari",
      position: "Koordinator",
      division: "Divisi Media & Informasi",
      image:
        "https://ui-avatars.com/api/?name=Maya+Sari&background=E91E63&color=fff&size=200",
      nim: "2022002",
      email: "maya.sari@student.ummi.ac.id",
    },
    {
      id: "7",
      name: "Rizky Firmansyah",
      position: "Koordinator",
      division: "Divisi Pengembangan SDM",
      image:
        "https://ui-avatars.com/api/?name=Rizky+Firmansyah&background=3F51B5&color=fff&size=200",
      nim: "2022003",
      email: "rizky.f@student.ummi.ac.id",
    },
    {
      id: "8",
      name: "Fitri Handayani",
      position: "Koordinator",
      division: "Divisi Kewirausahaan",
      image:
        "https://ui-avatars.com/api/?name=Fitri+Handayani&background=009688&color=fff&size=200",
      nim: "2022004",
      email: "fitri.h@student.ummi.ac.id",
    },
    {
      id: "9",
      name: "Andi Setiawan",
      position: "Koordinator",
      division: "Divisi Hubungan Masyarakat",
      image:
        "https://ui-avatars.com/api/?name=Andi+Setiawan&background=FF5722&color=fff&size=200",
      nim: "2022005",
      email: "andi.s@student.ummi.ac.id",
    },
  ],
};

export default function OrganizationScreen() {
  const [selectedTab, setSelectedTab] = useState<"inti" | "divisions">("inti");

  const renderMemberCard = (member: Member, isCore?: boolean) => (
    <View
      key={member.id}
      style={[styles.memberCard, isCore && styles.coreCard]}
    >
      <Image source={{ uri: member.image }} style={styles.memberImage} />

      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>

        <View style={styles.positionBadge}>
          <Text style={styles.positionText}>{member.position}</Text>
        </View>

        {member.division && (
          <View style={styles.divisionContainer}>
            <Ionicons name="briefcase-outline" size={14} color="#007AFF" />
            <Text style={styles.memberDivision}>{member.division}</Text>
          </View>
        )}

        <View style={styles.memberContact}>
          <View style={styles.contactItem}>
            <Ionicons name="card-outline" size={14} color="#666" />
            <Text style={styles.contactText}>{member.nim}</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={14} color="#666" />
            <Text style={styles.contactText} numberOfLines={1}>
              {member.email}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="people" size={32} color="#000" />
        </View>
        <Text style={styles.headerTitle}>Struktur Organisasi</Text>
        <Text style={styles.headerSubtitle}>HMIF UMMI Periode 2024/2025</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "inti" && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab("inti")}
          activeOpacity={0.7}
        >
          {/* <Ionicons
            name="shield-checkmark"
            size={18}
            color={selectedTab === "inti" ? "#fff" : "#666"}
          /> */}
          <Text
            style={[
              styles.tabText,
              selectedTab === "inti" && styles.tabTextActive,
            ]}
          >
            BPH
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "divisions" && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab("divisions")}
          activeOpacity={0.7}
        >
          {/* <Ionicons
            name="grid"
            size={18}
            color={selectedTab === "divisions" ? "#fff" : "#666"}
          /> */}
          <Text
            style={[
              styles.tabText,
              selectedTab === "divisions" && styles.tabTextActive,
            ]}
          >
            Kepala Departemen
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {selectedTab === "inti"
            ? organizationData.inti.map((member) =>
                renderMemberCard(member, true)
              )
            : organizationData.divisions.map((member) =>
                renderMemberCard(member)
              )}
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
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    gap: 8,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  tabButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 24,
    gap: 16,
  },
  memberCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  coreCard: {
    backgroundColor: "#F0F8FF",
    borderColor: "#D6EDFF",
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
  },
  memberInfo: {
    flex: 1,
    gap: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.3,
  },
  positionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  positionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  divisionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  memberDivision: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
    flex: 1,
  },
  memberContact: {
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  bottomSpace: {
    height: 40,
  },
});
