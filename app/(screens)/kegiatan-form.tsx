import { useAuth } from "@/context/AuthContext";
import {
  createKegiatan,
  getKegiatanById,
  updateKegiatan,
} from "@/services/kegiatan.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

type StatusType = "mendatang" | "berlangsung" | "selesai";

export default function KegiatanFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const isEdit = !!params.id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    status: "mendatang" as StatusType,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    participants: "0",
    maxParticipants: "50",
    description: "",
  });

  useEffect(() => {
    if (isEdit) {
      loadKegiatan();
    }
  }, []);

  const loadKegiatan = async () => {
    try {
      const kegiatan = await getKegiatanById(params.id as string);
      if (kegiatan) {
        setFormData({
          title: kegiatan.title,
          category: kegiatan.category,
          date: kegiatan.date,
          time: kegiatan.time,
          location: kegiatan.location,
          status: kegiatan.status,
          image: kegiatan.image,
          participants: kegiatan.participants.toString(),
          maxParticipants: kegiatan.maxParticipants.toString(),
          description: kegiatan.description,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Gagal memuat data kegiatan");
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert("Error", "Judul kegiatan harus diisi");
      return;
    }
    if (!formData.category.trim()) {
      Alert.alert("Error", "Kategori harus diisi");
      return;
    }
    if (!formData.date.trim()) {
      Alert.alert("Error", "Tanggal harus diisi");
      return;
    }
    if (!formData.time.trim()) {
      Alert.alert("Error", "Waktu harus diisi");
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert("Error", "Lokasi harus diisi");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Deskripsi harus diisi");
      return;
    }

    setLoading(true);

    try {
      const kegiatanData = {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        status: formData.status,
        image: formData.image,
        participants: parseInt(formData.participants) || 0,
        maxParticipants: parseInt(formData.maxParticipants) || 50,
        description: formData.description,
        createdBy: user?.id || "", // ← Tambahkan ini
      };

      if (isEdit) {
        await updateKegiatan(params.id as string, kegiatanData);
        Alert.alert("Sukses", "Kegiatan berhasil diupdate", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await createKegiatan(kegiatanData, user?.id || "");
        Alert.alert("Sukses", "Kegiatan berhasil ditambahkan", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan kegiatan");
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
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Judul Kegiatan *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Workshop React Native"
                placeholderTextColor="#999"
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kategori *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Workshop, Seminar, Competition"
                placeholderTextColor="#999"
                value={formData.category}
                onChangeText={(text) =>
                  setFormData({ ...formData, category: text })
                }
              />
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tanggal *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 15 Desember 2024"
                placeholderTextColor="#999"
                value={formData.date}
                onChangeText={(text) =>
                  setFormData({ ...formData, date: text })
                }
              />
            </View>

            {/* Time */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Waktu *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 09:00 - 16:00 WIB"
                placeholderTextColor="#999"
                value={formData.time}
                onChangeText={(text) =>
                  setFormData({ ...formData, time: text })
                }
              />
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lokasi *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Lab Komputer Gedung A"
                placeholderTextColor="#999"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
              />
            </View>

            {/* Status */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === "mendatang" &&
                      styles.statusButtonActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, status: "mendatang" })
                  }
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.status === "mendatang" &&
                        styles.statusButtonTextActive,
                    ]}
                  >
                    Akan Datang
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === "berlangsung" &&
                      styles.statusButtonActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, status: "berlangsung" })
                  }
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.status === "berlangsung" &&
                        styles.statusButtonTextActive,
                    ]}
                  >
                    Berlangsung
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === "selesai" && styles.statusButtonActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, status: "selesai" })
                  }
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.status === "selesai" &&
                        styles.statusButtonTextActive,
                    ]}
                  >
                    Selesai
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Participants */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Peserta Saat Ini</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#999"
                  value={formData.participants}
                  onChangeText={(text) =>
                    setFormData({ ...formData, participants: text })
                  }
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Maks Peserta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="50"
                  placeholderTextColor="#999"
                  value={formData.maxParticipants}
                  onChangeText={(text) =>
                    setFormData({ ...formData, maxParticipants: text })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Image URL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL Gambar</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#999"
                value={formData.image}
                onChangeText={(text) =>
                  setFormData({ ...formData, image: text })
                }
                autoCapitalize="none"
              />
              <Text style={styles.helperText}>
                Gunakan URL gambar dari Unsplash atau sumber lainnya
              </Text>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Deskripsi *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Deskripsi lengkap tentang kegiatan..."
                placeholderTextColor="#999"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {loading
                  ? "Menyimpan..."
                  : isEdit
                  ? "Update Kegiatan"
                  : "Tambah Kegiatan"}
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
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  statusButtonTextActive: {
    color: "#fff",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  submitButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
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
