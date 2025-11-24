import { LocationCard } from '@/components/location-card';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockLocations } from '@/data/locations';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeInRight } from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const featuredLocations = mockLocations
    .filter(loc => loc.rating >= 4.7)
    .slice(0, 3);

  const handleExplorePress = () => {
    router.push('/(tabs)/explore');
  };

  const handleFavoritesPress = () => {
    router.push('/(tabs)/profile');
  };

  const handleLocationPress = (locationId: string) => {
    router.push({
      pathname: '/location-details',
      params: { locationId },
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <LinearGradient
          colors={['#A1CEDC', '#0a7ea4']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 1]}
        />
      }>
      <Animated.View entering={FadeIn.duration(800).delay(200)}>
        <ThemedView style={styles.welcomeContainer}>
          <ThemedText type="title" style={styles.welcomeTitle}>
            Descoperă România
          </ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Găsește cele mai bune cafenele și restaurante din țară
          </ThemedText>
        </ThemedView>
      </Animated.View>

      <Animated.View entering={FadeInLeft.duration(600).delay(400)} style={styles.statsContainer}>
        <View style={[styles.statCard, { borderColor: `${textColor}15` }]}>
          <Ionicons name="location" size={32} color={tintColor} />
          <ThemedText type="defaultSemiBold" style={styles.statNumber}>20+</ThemedText>
          <ThemedText style={styles.statLabel}>Locații</ThemedText>
        </View>
        <View style={[styles.statCard, { borderColor: `${textColor}15` }]}>
          <Ionicons name="restaurant" size={32} color={tintColor} />
          <ThemedText type="defaultSemiBold" style={styles.statNumber}>2</ThemedText>
          <ThemedText style={styles.statLabel} numberOfLines={1}>Categorii</ThemedText>
        </View>
        <View style={[styles.statCard, { borderColor: `${textColor}15` }]}>
          <Ionicons name="map" size={32} color={tintColor} />
          <ThemedText type="defaultSemiBold" style={styles.statNumber}>13</ThemedText>
          <ThemedText style={styles.statLabel}>Orașe</ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(600).delay(600)}>
        <ThemedView style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Locații Recomandate</ThemedText>
            <Ionicons name="star" size={20} color="#FFB800" />
          </View>
          <ThemedText style={[styles.sectionDescription, { color: iconColor }]}>
            Cele mai bine cotate locuri din selecția noastră
          </ThemedText>
        </ThemedView>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScroll}
      >
        {featuredLocations.map((location, index) => (
          <View key={location.id}>
            <LocationCard
              location={location}
              onPress={() => handleLocationPress(location.id)}
              variant="compact"
              style={{ width: 160, marginRight: 12, minWidth: 0, maxWidth: '100%' }}
              index={index}
            />
          </View>
        ))}
      </ScrollView>

      <Animated.View entering={FadeInRight.duration(600).delay(800)} style={styles.ctaContainer}>
        <Pressable
          style={[styles.ctaButton, styles.primaryButton, { backgroundColor: tintColor }]}
          onPress={handleExplorePress}>
          <Ionicons name="map" size={20} color="#000" />
          <ThemedText style={styles.ctaButtonText}>Explorează Harta</ThemedText>
        </Pressable>
        
        <Pressable
          style={[styles.ctaButton, styles.secondaryButton, { borderColor: tintColor }]}
          onPress={handleFavoritesPress}>
          <Ionicons name="heart" size={20} color={tintColor} />
          <ThemedText style={[styles.ctaButtonSecondaryText, { color: tintColor }]}>
            Vezi Favorite
          </ThemedText>
        </Pressable>
      </Animated.View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    width: '100%',
    height: '100%',
  },
  welcomeContainer: {
    gap: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'center',
  },
  sectionContainer: {
    gap: 4,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionDescription: {
    fontSize: 14,
  },
  cardsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  ctaContainer: {
    gap: 12,
    marginTop: 24,
    marginBottom: 100,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderWidth: 2,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  ctaButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
