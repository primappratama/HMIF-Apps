import { useAuth } from "@/context/AuthContext";
import {
  createMember,
  deleteMember,
  getAllMembers,
  getDivisions,
  OrganizationMember,
  reorderMembers,
  updateMember,
} from "@/services/organization.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrganizationManagementScreen() {
  const { user } = useAuth();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<OrganizationMember | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [division, setDivision] = useState("Ketua");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [nim, setNim] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const divisions = getDivisions();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await getAllMembers();
      setMembers(data);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat anggota");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setEditMode(false);
    setSelectedMember(null);
    setName("");
    setPosition("");
    setDivision("Ketua");
    setPhoto("");
    setEmail("");
    setNim("");
    setPhone("");
    setModalVisible(true);
  };

  const handleEditMember = (member: OrganizationMember) => {
    setEditMode(true);
    setSelectedMember(member);
    setName(member.name);
    setPosition(member.position);
    setDivision(member.division);
    setPhoto(member.photo);
    setEmail(member.email);
    setNim(member.nim);
    setPhone(member.phone);
    setModalVisible(true);
  };

  const handleSaveMember = async () => {
    if (!name.trim() || !position.trim() || !email.trim() || !nim.trim()) {
      Alert.alert("Error", "Nama, jabatan, email, dan NIM harus diisi");
      return;
    }

    // Generate photo URL if empty
    const photoUrl =
      photo.trim() ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=007AFF&color=fff&size=200`;

    setSaving(true);

    try {
      if (editMode && selectedMember) {
        await updateMember(selectedMember.id, {
          name,
          position,
          division,
          photo: photoUrl,
          email,
          nim,
          phone,
        });
        Alert.alert("Sukses", "Anggota berhasil diupdate");
      } else {
        await createMember(
          name,
          position,
          division,
          photoUrl,
          email,
          nim,
          phone
        );
        Alert.alert("Sukses", "Anggota berhasil ditambahkan");
      }

      setModalVisible(false);
      loadMembers();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = (member: OrganizationMember) => {
    Alert.alert(
      "Hapus Anggota",
      `Apakah Anda yakin ingin menghapus ${member.name} dari struktur organisasi?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMember(member.id);
              Alert.alert("Sukses", "Anggota berhasil dihapus");
              loadMembers();
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus anggota");
            }
          },
        },
      ]
    );
  };

  const handleMoveUp = async (member: OrganizationMember) => {
    if (member.order === 1) return;
    try {
      await reorderMembers(member.id, member.order - 1);
      loadMembers();
    } catch (error) {
      Alert.alert("Error", "Gagal mengubah urutan");
    }
  };

  const handleMoveDown = async (member: OrganizationMember) => {
    if (member.order === members.length) return;
    try {
      await reorderMembers(member.id, member.order + 1);
      loadMembers();
    } catch (error) {
      Alert.alert("Error", "Gagal mengubah urutan");
    }
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
          <Text style={styles.loadingText}>Memuat struktur organisasi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{members.length}</Text>
          <Text style={styles.statLabel}>Total Pengurus</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {new Set(members.map((m) => m.division)).size}
          </Text>
          <Text style={styles.statLabel}>Divisi</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Members List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Struktur Organisasi</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMember}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {members.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Belum ada anggota</Text>
              <Text style={styles.emptySubtext}>
                Tap tombol Tambah untuk menambahkan pengurus
              </Text>
            </View>
          ) : (
            <View style={styles.membersList}>
              {members.map((member, index) => (
                <View key={member.id} style={styles.memberCard}>
                  {/* Order Badge */}
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderText}>#{member.order}</Text>
                  </View>

                  {/* Member Photo */}
                  <Image
                    source={{ uri: member.photo }}
                    style={styles.memberPhoto}
                  />

                  {/* Member Info */}
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberPosition}>{member.position}</Text>
                    <View style={styles.divisionBadge}>
                      <Text style={styles.divisionText}>{member.division}</Text>
                    </View>

                    <View style={styles.memberMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="mail-outline" size={12} color="#666" />
                        <Text style={styles.metaText}>{member.email}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="card-outline" size={12} color="#666" />
                        <Text style={styles.metaText}>{member.nim}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.memberActions}>
                    <View style={styles.orderActions}>
                      <TouchableOpacity
                        onPress={() => handleMoveUp(member)}
                        disabled={member.order === 1}
                        style={[
                          styles.orderButton,
                          member.order === 1 && styles.orderButtonDisabled,
                        ]}
                      >
                        <Ionicons
                          name="chevron-up"
                          size={16}
                          color={member.order === 1 ? "#ccc" : "#007AFF"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleMoveDown(member)}
                        disabled={member.order === members.length}
                        style={[
                          styles.orderButton,
                          member.order === members.length &&
                            styles.orderButtonDisabled,
                        ]}
                      >
                        <Ionicons
                          name="chevron-down"
                          size={16}
                          color={
                            member.order === members.length ? "#ccc" : "#007AFF"
                          }
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.editActions}>
                      <TouchableOpacity
                        onPress={() => handleEditMember(member)}
                        style={styles.iconButton}
                      >
                        <Ionicons
                          name="create-outline"
                          size={16}
                          color="#FF9500"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteMember(member)}
                        style={styles.iconButton}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#FF3B30"
                        />
                      </TouchableOpacity>
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
                {editMode ? "Edit Anggota" : "Tambah Anggota"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Lengkap</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Position */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Jabatan</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Ketua Umum"
                  value={position}
                  onChangeText={setPosition}
                  autoCapitalize="words"
                />
              </View>

              {/* Division */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Divisi</Text>
                <View style={styles.divisionGrid}>
                  {divisions.map((div) => (
                    <TouchableOpacity
                      key={div}
                      style={[
                        styles.divisionChip,
                        division === div && styles.divisionChipActive,
                      ]}
                      onPress={() => setDivision(div)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.divisionChipText,
                          division === div && styles.divisionChipTextActive,
                        ]}
                      >
                        {div}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* NIM */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NIM</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan NIM"
                  value={nim}
                  onChangeText={setNim}
                  keyboardType="numeric"
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="nama@ummi.ac.id"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>No. Telepon (Opsional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="08123456789"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Photo URL */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>URL Foto (Opsional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/photo.jpg"
                  value={photo}
                  onChangeText={setPhoto}
                  autoCapitalize="none"
                  keyboardType="url"
                />
                <Text style={styles.inputHint}>
                  Kosongkan untuk generate foto otomatis
                </Text>
              </View>

              {/* Preview */}
              {(photo.trim() !== "" || name.trim() !== "") && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Preview Foto</Text>
                  <Image
                    source={{
                      uri:
                        photo.trim() ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          name
                        )}&background=007AFF&color=fff&size=200`,
                    }}
                    style={styles.previewPhoto}
                  />
                </View>
              )}

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveMember}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editMode ? "Update Anggota" : "Tambah Anggota"}
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
    letterSpacing: -0.3,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#000",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 13,
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
  membersList: {
    gap: 12,
  },
  memberCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    position: "relative",
  },
  orderBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  orderText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  memberPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  memberInfo: {
    marginBottom: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  memberPosition: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  divisionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 12,
  },
  divisionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  memberMeta: {
    gap: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
  memberActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  orderActions: {
    flexDirection: "row",
    gap: 6,
  },
  orderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  orderButtonDisabled: {
    opacity: 0.3,
  },
  editActions: {
    flexDirection: "row",
    gap: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
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
    marginBottom: 20,
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
  inputHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  divisionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  divisionChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#f5f5f5",
  },
  divisionChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  divisionChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
  },
  divisionChipTextActive: {
    color: "#fff",
  },
  previewPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
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
