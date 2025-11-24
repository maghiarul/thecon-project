import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockLocations } from '@/data/locations';
import { useFavorites } from '@/hooks/use-favorites';
import { useThemeColor } from '@/hooks/use-theme-color';
import { generateVibeDescription } from '@/services/ai-service';
import { openWhatsAppChat } from '@/utils/whatsapp-linking';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function LocationDetailsScreen() {
  const params = useLocalSearchParams<{ locationId: string }>();
  const router = useRouter();
  const [currentDescription, setCurrentDescription] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'text');

  const location = mockLocations.find(loc => loc.id === params.locationId);

  if (!location) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Locația nu a fost găsită</ThemedText>
      </ThemedView>
    );
  }

  const displayDescription = currentDescription || location.description;

  const handleGenerateVibe = async () => {
    setIsGenerating(true);
    try {
      const newDescription = await generateVibeDescription(location);
      setCurrentDescription(newDescription);
    } catch (error) {
      Alert.alert(
        'Eroare',
        error instanceof Error ? error.message : 'Nu am putut genera descrierea',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReserve = async () => {
    try {
      await openWhatsAppChat({
        locationName: location.name,
        address: location.address,
      });
    } catch (error) {
      Alert.alert(
        'Eroare',
        error instanceof Error ? error.message : 'Nu am putut deschide WhatsApp',
        [{ text: 'OK' }]
      );
    }
  };

  const locationIsFavorite = isFavorite(location.id);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.topButtons}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <View style={[styles.closeButtonInner, { backgroundColor }]}>
            <Ionicons name="close" size={28} color={tintColor} />
          </View>
        </Pressable>
        <Pressable 
          style={styles.favoriteButton} 
          onPress={() => toggleFavorite(location.id)}
        >
          <View style={[styles.favoriteButtonInner, { backgroundColor }]}>
            <Ionicons 
              name={locationIsFavorite ? "heart" : "heart-outline"} 
              size={26} 
              color={locationIsFavorite ? "#FF3B30" : tintColor} 
            />
          </View>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: location.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <ThemedText type="title" style={styles.title}>
                {location.name}
              </ThemedText>
              <View style={styles.rating}>
                <Ionicons name="star" size={20} color="#FFB800" />
                <ThemedText style={styles.ratingText}>{location.rating}</ThemedText>
              </View>
            </View>
            
            <View style={styles.addressRow}>
              <Ionicons name="location" size={18} color={tintColor} />
              <ThemedText style={styles.address}>{location.address}</ThemedText>
            </View>

            <View style={styles.typeTag}>
              <ThemedText style={styles.typeText}>
                {location.type === 'cafe' ? '☕ Cafenea' : '🍽️ Restaurant'}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.descriptionCard, { backgroundColor, borderColor: `${borderColor}20` }]}>
            <View style={styles.descriptionHeader}>
              <ThemedText type="subtitle">Descriere</ThemedText>
              {currentDescription && (
                <View style={styles.aiBadge}>
                  <Ionicons name="sparkles" size={14} color="#FFB800" />
                  <ThemedText style={styles.aiBadgeText}>AI Generated</ThemedText>
                </View>
              )}
            </View>
            <ThemedText style={styles.description}>{displayDescription}</ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.vibeButton,
              { backgroundColor: `${tintColor}20`, borderColor: tintColor },
              pressed && styles.buttonPressed,
              isGenerating && styles.buttonDisabled,
            ]}
            onPress={handleGenerateVibe}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <ActivityIndicator size="small" color={tintColor} />
                <ThemedText style={[styles.vibeButtonText, { color: tintColor }]}>
                  Se generează...
                </ThemedText>
              </>
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color={tintColor} />
                <ThemedText style={[styles.vibeButtonText, { color: tintColor }]}>
                  Generează Descriere Vibe
                </ThemedText>
              </>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.reserveButton,
              { backgroundColor: '#25D366' },
              pressed && styles.buttonPressed,
            ]}
            onPress={handleReserve}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#fff" />
            <ThemedText style={styles.reserveButtonText}>Rezervă</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topButtons: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  closeButton: {
    zIndex: 10,
  },
  closeButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteButton: {
    zIndex: 10,
  },
  favoriteButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 320,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  title: {
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  address: {
    fontSize: 15,
    opacity: 0.7,
    flex: 1,
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#00000010',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FFB80020',
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB800',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.85,
  },
  vibeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  vibeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
