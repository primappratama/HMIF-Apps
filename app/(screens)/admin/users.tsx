import { useAuth } from "@/context/AuthContext";
import {
  deleteUser,
  getAllUsers,
  getUserStats,
  updateUserRole,
  User,
  UserRole,
} from "@/services/auth.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserManagementScreen() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("anggota");
  const [saving, setSaving] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    pengurus: 0,
    anggota: 0,
  });

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat user");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getUserStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalVisible(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    if (newRole === selectedUser.role) {
      Alert.alert("Info", "Role tidak berubah");
      return;
    }

    setSaving(true);

    try {
      await updateUserRole(selectedUser.id, newRole);
      Alert.alert(
        "Sukses",
        `Role ${selectedUser.name} berhasil diubah menjadi ${getRoleLabel(
          newRole
        )}`
      );
      setModalVisible(false);
      loadUsers();
      loadStats();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      "Hapus User",
      `Apakah Anda yakin ingin menghapus ${user.name}?\n\nData user akan dihapus permanen.`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(user.id);
              Alert.alert("Sukses", "User berhasil dihapus");
              loadUsers();
              loadStats();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "pengurus":
        return "Pengurus";
      case "anggota":
        return "Anggota";
      default:
        return role;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "#00C853";
      case "pengurus":
        return "#007AFF";
      case "anggota":
        return "#666";
      default:
        return "#666";
    }
  };

  const getRoleBgColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "#E8F5E9";
      case "pengurus":
        return "#E3F2FD";
      case "anggota":
        return "#f5f5f5";
      default:
        return "#f5f5f5";
    }
  };

  if (currentUser?.role !== "admin") {
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
          <Text style={styles.loadingText}>Memuat user...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="people" size={18} color="#007AFF" />
            </View>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="shield-checkmark" size={18} color="#00C853" />
            </View>
            <Text style={styles.statLabel}>Admin</Text>
          </View>
          <Text style={[styles.statValue, { color: "#00C853" }]}>
            {stats.admin}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="people-circle" size={18} color="#007AFF" />
            </View>
            <Text style={styles.statLabel}>Pengurus</Text>
          </View>
          <Text style={[styles.statValue, { color: "#007AFF" }]}>
            {stats.pengurus}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: "#f5f5f5" }]}>
              <Ionicons name="person" size={18} color="#666" />
            </View>
            <Text style={styles.statLabel}>Anggota</Text>
          </View>
          <Text style={styles.statValue}>{stats.anggota}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Users List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daftar User ({users.length})</Text>

          {users.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Belum ada user</Text>
            </View>
          ) : (
            <View style={styles.usersList}>
              {users.map((user) => (
                <View key={user.id} style={styles.userCard}>
                  {/* User Avatar */}
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={24} color="#666" />
                  </View>

                  {/* User Info */}
                  <View style={styles.userInfo}>
                    <View style={styles.userHeader}>
                      <Text style={styles.userName}>{user.name}</Text>
                      {user.id === "admin-001" && (
                        <View style={styles.superAdminBadge}>
                          <Ionicons name="star" size={10} color="#FFD700" />
                          <Text style={styles.superAdminText}>Super Admin</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.userEmail}>{user.email}</Text>

                    <View style={styles.userMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="card-outline" size={12} color="#666" />
                        <Text style={styles.metaText}>{user.nim}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="calendar-outline"
                          size={12}
                          color="#666"
                        />
                        <Text style={styles.metaText}>
                          Angkatan {user.angkatan}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.roleBadge,
                        { backgroundColor: getRoleBgColor(user.role) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          { color: getRoleColor(user.role) },
                        ]}
                      >
                        {getRoleLabel(user.role)}
                      </Text>
                    </View>
                  </View>

                  {/* Actions */}
                  {user.id !== "admin-001" && (
                    <View style={styles.userActions}>
                      <TouchableOpacity
                        onPress={() => handleChangeRole(user)}
                        style={styles.actionButton}
                      >
                        <Ionicons
                          name="create-outline"
                          size={16}
                          color="#007AFF"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteUser(user)}
                        style={styles.actionButton}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#FF3B30"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Change Role Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ubah Role User</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* User Info */}
              {selectedUser && (
                <View style={styles.selectedUserInfo}>
                  <View style={styles.selectedUserAvatar}>
                    <Ionicons name="person" size={32} color="#666" />
                  </View>
                  <View>
                    <Text style={styles.selectedUserName}>
                      {selectedUser.name}
                    </Text>
                    <Text style={styles.selectedUserEmail}>
                      {selectedUser.email}
                    </Text>
                  </View>
                </View>
              )}

              {/* Role Selector */}
              <View style={styles.roleSelector}>
                <Text style={styles.roleSelectorLabel}>Pilih Role Baru:</Text>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    newRole === "admin" && styles.roleOptionActive,
                    newRole === "admin" && {
                      backgroundColor: "#E8F5E9",
                      borderColor: "#00C853",
                    },
                  ]}
                  onPress={() => setNewRole("admin")}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={24}
                    color={newRole === "admin" ? "#00C853" : "#666"}
                  />
                  <View style={styles.roleOptionContent}>
                    <Text
                      style={[
                        styles.roleOptionTitle,
                        newRole === "admin" && { color: "#00C853" },
                      ]}
                    >
                      Admin
                    </Text>
                    <Text style={styles.roleOptionDesc}>
                      Full access ke semua fitur
                    </Text>
                  </View>
                  {newRole === "admin" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#00C853"
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    newRole === "pengurus" && styles.roleOptionActive,
                    newRole === "pengurus" && {
                      backgroundColor: "#E3F2FD",
                      borderColor: "#007AFF",
                    },
                  ]}
                  onPress={() => setNewRole("pengurus")}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="people-circle"
                    size={24}
                    color={newRole === "pengurus" ? "#007AFF" : "#666"}
                  />
                  <View style={styles.roleOptionContent}>
                    <Text
                      style={[
                        styles.roleOptionTitle,
                        newRole === "pengurus" && { color: "#007AFF" },
                      ]}
                    >
                      Pengurus
                    </Text>
                    <Text style={styles.roleOptionDesc}>
                      Akses terbatas untuk pengurus
                    </Text>
                  </View>
                  {newRole === "pengurus" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#007AFF"
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    newRole === "anggota" && styles.roleOptionActive,
                    newRole === "anggota" && {
                      backgroundColor: "#f5f5f5",
                      borderColor: "#666",
                    },
                  ]}
                  onPress={() => setNewRole("anggota")}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="person"
                    size={24}
                    color={newRole === "anggota" ? "#666" : "#999"}
                  />
                  <View style={styles.roleOptionContent}>
                    <Text
                      style={[
                        styles.roleOptionTitle,
                        newRole === "anggota" && { color: "#666" },
                      ]}
                    >
                      Anggota
                    </Text>
                    <Text style={styles.roleOptionDesc}>
                      Akses standar untuk anggota
                    </Text>
                  </View>
                  {newRole === "anggota" && (
                    <Ionicons name="checkmark-circle" size={20} color="#666" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveRole}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
                )}
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  statHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    letterSpacing: -0.3,
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
  usersList: {
    gap: 10,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.2,
  },
  superAdminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  superAdminText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FF9500",
  },
  userEmail: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  userMeta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
  },
  userActions: {
    flexDirection: "row",
    gap: 6,
  },
  actionButton: {
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
    maxHeight: "80%",
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
  selectedUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  selectedUserAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedUserName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  selectedUserEmail: {
    fontSize: 13,
    color: "#666",
  },
  roleSelector: {
    gap: 12,
    marginBottom: 24,
  },
  roleSelectorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  roleOptionActive: {
    borderWidth: 2,
  },
  roleOptionContent: {
    flex: 1,
  },
  roleOptionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginBottom: 2,
  },
  roleOptionDesc: {
    fontSize: 12,
    color: "#999",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
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
