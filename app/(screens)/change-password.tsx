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

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    // Validation
    if (!formData.currentPassword) {
      Alert.alert("Error", "Password lama harus diisi");
      return;
    }
    if (!formData.newPassword) {
      Alert.alert("Error", "Password baru harus diisi");
      return;
    }
    if (formData.newPassword.length < 6) {
      Alert.alert("Error", "Password baru minimal 6 karakter");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "Konfirmasi password tidak cocok");
      return;
    }
    if (formData.currentPassword === formData.newPassword) {
      Alert.alert("Error", "Password baru harus berbeda dengan password lama");
      return;
    }

    setLoading(true);

    try {
      // Get users from storage
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (usersJson) {
        const users = JSON.parse(usersJson);
        const userIndex = users.findIndex((u: any) => u.id === user?.id);

        if (userIndex !== -1) {
          // Verify current password
          if (users[userIndex].password !== formData.currentPassword) {
            Alert.alert("Error", "Password lama tidak sesuai");
            setLoading(false);
            return;
          }

          // Update password
          users[userIndex].password = formData.newPassword;
          await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

          Alert.alert(
            "Sukses",
            "Password berhasil diubah. Silakan login ulang.",
            [
              {
                text: "OK",
                onPress: () => logout(),
              },
            ]
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", "Gagal mengubah password");
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
            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark" size={24} color="#FF9500" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Keamanan Akun</Text>
                <Text style={styles.infoText}>
                  Pastikan password baru Anda kuat dan mudah diingat
                </Text>
              </View>
            </View>

            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password Lama *</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan password lama"
                  placeholderTextColor="#999"
                  value={formData.currentPassword}
                  onChangeText={(text) =>
                    setFormData({ ...formData, currentPassword: text })
                  }
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={
                      showCurrentPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password Baru *</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#999"
                  value={formData.newPassword}
                  onChangeText={(text) =>
                    setFormData({ ...formData, newPassword: text })
                  }
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Konfirmasi Password Baru *</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ulangi password baru"
                  placeholderTextColor="#999"
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    setFormData({ ...formData, confirmPassword: text })
                  }
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View style={styles.requirementsCard}>
              <Text style={styles.requirementsTitle}>
                Persyaratan Password:
              </Text>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    formData.newPassword.length >= 6
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={formData.newPassword.length >= 6 ? "#00C853" : "#ccc"}
                />
                <Text style={styles.requirementText}>Minimal 6 karakter</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    formData.newPassword === formData.confirmPassword &&
                    formData.confirmPassword
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    formData.newPassword === formData.confirmPassword &&
                    formData.confirmPassword
                      ? "#00C853"
                      : "#ccc"
                  }
                />
                <Text style={styles.requirementText}>Password cocok</Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleChangePassword}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Mengubah Password..." : "Ubah Password"}
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
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FFE0B2",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF9500",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#FF9500",
    lineHeight: 18,
    opacity: 0.8,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  eyeButton: {
    padding: 4,
  },
  requirementsCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
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
