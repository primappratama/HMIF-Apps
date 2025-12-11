import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function NewsDetailScreen() {
  const params = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Image */}
        <Image 
          source={{ uri: params.image as string }} 
          style={styles.featuredImage}
        />

        {/* Content */}
        <View style={styles.articleContent}>
          {/* Header */}
          <View style={styles.articleHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{params.category}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="time-outline" size={14} color="#999" />
              <Text style={styles.dateText}>{params.date}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{params.title}</Text>

          {/* Author & Stats */}
          <View style={styles.metaContainer}>
            <View style={styles.authorContainer}>
              <View style={styles.authorAvatar}>
                <Ionicons name="person" size={16} color="#666" />
              </View>
              <Text style={styles.authorText}>Admin HMIF</Text>
            </View>
            <View style={styles.statsContainer}>
              <Ionicons name="eye-outline" size={16} color="#999" />
              <Text style={styles.statsText}>1.2k views</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Article Body */}
          <Text style={styles.body}>
            {params.excerpt}
            {'\n\n'}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            {'\n\n'}
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            {'\n\n'}
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>Tags:</Text>
            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>HMIF</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Teknologi</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Mahasiswa</Text>
              </View>
            </View>
          </View>
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  featuredImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#e0e0e0',
  },
  articleContent: {
    padding: 24,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    lineHeight: 34,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
    marginBottom: 24,
  },
  tagsContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  bottomSpace: {
    height: 20,
  },
});