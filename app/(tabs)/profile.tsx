import { LocationCard } from '@/components/location-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockLocations } from '@/data/locations';
import { useFavorites } from '@/hooks/use-favorites';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const cardBg = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const { favorites } = useFavorites();
  const router = useRouter();

  const favoriteLocations = mockLocations.filter(loc => favorites.includes(loc.id));

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={[tintColor, `${tintColor}80`]}
            style={styles.headerBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 1]}
          />
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color="#fff" />
              </View>
            </View>
            <ThemedText type="title" style={styles.name}>
              Alex Popescu
            </ThemedText>
            <ThemedText style={styles.email}>
              alex.popescu@example.com
            </ThemedText>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>{favoriteLocations.length}</ThemedText>
                <ThemedText style={styles.statLabel}>Favorite</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>0</ThemedText>
                <ThemedText style={styles.statLabel}>Rezervări</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>0</ThemedText>
                <ThemedText style={styles.statLabel}>Recenzii</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Locații Favorite</ThemedText>
            {favoriteLocations.length > 0 && (
              <Pressable onPress={() => router.push('/favorites')}>
                <ThemedText style={{ color: tintColor }}>Vezi toate</ThemedText>
              </Pressable>
            )}
          </View>
          
          {favoriteLocations.length > 0 ? (
            <View style={styles.cardsGrid}>
              {favoriteLocations.slice(0, 4).map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onPress={() => router.push({
                    pathname: '/location-details',
                    params: { locationId: location.id },
                  })}
                  distance={undefined}
                  variant="compact"
                />
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { borderColor: `${borderColor}20` }]}>
              <Ionicons name="heart-outline" size={48} color={`${borderColor}40`} />
              <ThemedText style={styles.emptyText}>
                Nu ai locații favorite încă
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Explorează harta și salvează locurile care îți plac!
              </ThemedText>
            </View>
          )}

          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <ThemedText type="subtitle">Istoric Rezervări</ThemedText>
          </View>
          
          <View style={[styles.emptyState, { borderColor: `${borderColor}20` }]}>
            <Ionicons name="calendar-outline" size={48} color={`${borderColor}40`} />
            <ThemedText style={styles.emptyText}>
              Nicio rezervare încă
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Rezervările tale vor apărea aici după ce contactezi locațiile.
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
    paddingBottom: 100,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 80,
    width: '100%',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'visible',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0a7ea4',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    marginBottom: 4,
    fontSize: 24,
  },
  email: {
    opacity: 0.6,
    fontSize: 15,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  contentContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
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
