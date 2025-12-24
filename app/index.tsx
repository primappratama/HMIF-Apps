import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Simple redirect based on auth state
    const timeout = setTimeout(() => {
      if (user) {
        console.log("User found, redirecting to tabs...");
        router.replace("/(tabs)");
      } else {
        console.log("No user, redirecting to login...");
        router.replace("/(auth)/login");
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
