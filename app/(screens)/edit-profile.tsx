import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const USERS_STORAGE_KEY = "@hmif_users";
const USER_DATA_KEY = "@hmif_user_data";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "", // Will load from storage
    angkatan: user?.angkatan || "",
  });

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (usersJson) {
        const users = JSON.parse(usersJson);
        const currentUser = users.find((u: any) => u.id === user?.id);
        if (currentUser) {
          setFormData({
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone || "",
            angkatan: currentUser.angkatan,
          });
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert("Error", "Nama lengkap harus diisi");
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "Email harus diisi");
      return;
    }
    if (!formData.angkatan.trim()) {
      Alert.alert("Error", "Angkatan harus diisi");
      return;
    }

    setLoading(true);

    try {
      // Update users storage
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (usersJson) {
        const users = JSON.parse(usersJson);
        const userIndex = users.findIndex((u: any) => u.id === user?.id);

        if (userIndex !== -1) {
          users[userIndex] = {
            ...users[userIndex],
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            angkatan: formData.angkatan,
          };

          await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

          // Update current user data
          await AsyncStorage.setItem(
            USER_DATA_KEY,
            JSON.stringify({
              id: user?.id,
              nim: user?.nim,
              name: formData.name,
              email: formData.email,
              angkatan: formData.angkatan,
              role: user?.role,
            })
          );

          Alert.alert("Sukses", "Profil berhasil diupdate", [
            {
              text: "OK",
              onPress: () => {
                // Logout to refresh user data
                Alert.alert(
                  "Login Ulang",
                  "Silakan login ulang untuk melihat perubahan",
                  [{ text: "OK", onPress: () => logout() }]
                );
              },
            },
          ]);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            {/* Avatar Placeholder */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={48} color="#666" />
              </View>
              <TouchableOpacity
                style={styles.changePhotoButton}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={16} color="#007AFF" />
                <Text style={styles.changePhotoText}>Ubah Foto</Text>
              </TouchableOpacity>
            </View>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap *</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#999"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                autoCapitalize="words"
              />
            </View>

            {/* NIM (Read only) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NIM</Text>
              <View style={[styles.input, styles.inputDisabled]}>
                <Text style={styles.inputDisabledText}>{user?.nim}</Text>
              </View>
              <Text style={styles.helperText}>NIM tidak dapat diubah</Text>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="nama@student.ummi.ac.id"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>No. Telepon</Text>
              <TextInput
                style={styles.input}
                placeholder="08xxxxxxxxxx"
                placeholderTextColor="#999"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                keyboardType="phone-pad"
              />
            </View>

            {/* Angkatan */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Angkatan *</Text>
              <TextInput
                style={styles.input}
                placeholder="2024"
                placeholderTextColor="#999"
                value={formData.angkatan}
                onChangeText={(text) =>
                  setFormData({ ...formData, angkatan: text })
                }
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  inputDisabled: {
    backgroundColor: "#fafafa",
    borderColor: "#f5f5f5",
  },
  inputDisabledText: {
    fontSize: 16,
    color: "#999",
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  saveButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: "#f0f0f0",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  bottomSpace: {
    height: 40,
  },
});
