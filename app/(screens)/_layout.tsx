import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ScreensLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '700',
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
              backgroundColor: '#f5f5f5',
              justifyContent: 'center',
              alignItems: 'center',
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
          title: 'Sejarah HMIF',
        }}
      />
      <Stack.Screen 
        name="finance"
        options={{
          title: 'Keuangan HMIF',
        }}
      />
      <Stack.Screen 
        name="nim-finder"
        options={{
          title: 'NIM Finder',
        }}
      />
      <Stack.Screen 
        name="kegiatan"
        options={{
          title: 'Kegiatan HMIF',
        }}
      />
      <Stack.Screen 
        name="news-detail"
        options={{
          title: 'Detail Berita',
        }}
      />
    </Stack>
  );
}