import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

const languages: Language[] = [
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
  },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "su", name: "Sundanese", nativeName: "Basa Sunda", flag: "☀️" },
];

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState("id");

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
    // TODO: Implement actual language change logic
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="language" size={24} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Pilih Bahasa</Text>
            <Text style={styles.infoText}>
              Aplikasi akan menggunakan bahasa yang Anda pilih
            </Text>
          </View>
        </View>

        {/* Language List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bahasa Tersedia</Text>

          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageItem,
                selectedLanguage === language.code && styles.languageItemActive,
              ]}
              onPress={() => handleSelectLanguage(language.code)}
              activeOpacity={0.7}
            >
              <View style={styles.languageLeft}>
                <View style={styles.flagBox}>
                  <Text style={styles.flag}>{language.flag}</Text>
                </View>
                <View style={styles.languageContent}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNative}>
                    {language.nativeName}
                  </Text>
                </View>
              </View>
              {selectedLanguage === language.code && (
                <Ionicons name="checkmark-circle" size={24} color="#00C853" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={20} color="#FF9500" />
          <Text style={styles.noteText}>
            Saat ini aplikasi hanya mendukung Bahasa Indonesia. Bahasa lain akan
            segera tersedia.
          </Text>
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
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#F0F8FF",
    margin: 24,
    marginBottom: 8,
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
  section: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  languageItemActive: {
    backgroundColor: "#F0FFF4",
    borderColor: "#00C853",
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  flagBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  flag: {
    fontSize: 28,
  },
  languageContent: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 13,
    color: "#666",
  },
  noteCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    marginHorizontal: 24,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#FF9500",
    lineHeight: 18,
  },
  bottomSpace: {
    height: 40,
  },
});
