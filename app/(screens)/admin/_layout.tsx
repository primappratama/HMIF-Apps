import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "700",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="banner" options={{ title: "Manage Banner" }} />
      <Stack.Screen name="news" options={{ title: "Manage Berita" }} />
      <Stack.Screen name="finance" options={{ title: "Manage Keuangan" }} />
      <Stack.Screen
        name="organization"
        options={{ title: "Manage Pengurus" }}
      />
      <Stack.Screen name="users" options={{ title: "Manage Users" }} />
      <Stack.Screen
        name="notification"
        options={{ title: "Send Notification" }}
      />
      <Stack.Screen name="settings" options={{ title: "App Settings" }} />
    </Stack>
  );
}
