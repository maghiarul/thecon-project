import { LocationCard } from '@/components/location-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockLocations } from '@/data/locations';
import { useFavorites } from '@/hooks/use-favorites';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const cardBg = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const { favorites } = useFavorites();
  const router = useRouter();

  const favoriteLocations = mockLocations.filter(loc => favorites.includes(loc.id));

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { borderColor: tintColor }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
          <ThemedText type="title" style={styles.name}>
            Alex Popescu
          </ThemedText>
          <ThemedText style={styles.email}>
            alex.popescu@example.com
          </ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg, borderColor: `${borderColor}20` }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={24} color={tintColor} />
            <ThemedText type="subtitle">Favorite</ThemedText>
          </View>
          {favoriteLocations.length > 0 ? (
            <View>
              {favoriteLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onPress={() => router.push({
                    pathname: '/location-details',
                    params: { locationId: location.id },
                  })}
                  distance={undefined}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={48} color={`${borderColor}40`} />
              <ThemedText style={styles.emptyText}>
                Nu ai locații favorite încă
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Apasă pe ❤️ pentru a salva locurile tale preferate
              </ThemedText>
            </View>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: cardBg, borderColor: `${borderColor}20` }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={24} color={tintColor} />
            <ThemedText type="subtitle">Istoric Rezervări</ThemedText>
          </View>
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={`${borderColor}40`} />
            <ThemedText style={styles.emptyText}>
              Nicio rezervare încă
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Rezervările tale vor apărea aici
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginBottom: 4,
  },
  email: {
    opacity: 0.6,
    fontSize: 15,
  },
  section: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 4,
    textAlign: 'center',
  },
});
