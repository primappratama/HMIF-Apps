import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function ScreensLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
        headerShadowVisible: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#f5f5f5",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 8,
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="history"
        options={{
          title: "Sejarah HMIF",
        }}
      />
      <Stack.Screen
        name="organization"
        options={{
          title: "Struktur Organisasi",
        }}
      />
      <Stack.Screen
        name="finance"
        options={{
          title: "Keuangan HMIF",
        }}
      />
      <Stack.Screen
        name="nim-finder"
        options={{
          title: "NIM Finder",
        }}
      />
      <Stack.Screen
        name="kegiatan"
        options={{
          title: "Kegiatan HMIF",
        }}
      />
      <Stack.Screen
        name="kegiatan-form"
        options={{
          title: "Form Kegiatan",
        }}
      />
      <Stack.Screen
        name="news-detail"
        options={{
          title: "Detail Berita",
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profil",
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: "Ganti Password",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifikasi",
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Kebijakan Privasi",
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: "Bahasa",
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: "Tentang Aplikasi",
        }}
      />
      <Stack.Screen
        name="calendar"
        options={{
          title: "Kalender Kegiatan",
        }}
      />
      <Stack.Screen
        name="admin-dashboard"
        options={{ title: "Admin Dashboard" }}
      />
    </Stack>
  );
}
