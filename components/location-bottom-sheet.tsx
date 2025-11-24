import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/hooks/use-auth';
import { useFavorites } from '@/hooks/use-favorites';
import { useThemeColor } from '@/hooks/use-theme-color';
import { generateVibeDescription } from '@/services/ai-service';
import type { Location } from '@/types/location';
import { openWhatsAppChat } from '@/utils/whatsapp-linking';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';

interface LocationBottomSheetProps {
  location: Location | null;
  onSheetChange?: (isOpen: boolean) => void;
}

export const LocationBottomSheet = forwardRef<BottomSheet, LocationBottomSheetProps>(
  ({ location, onSheetChange }, ref) => {
    const [currentDescription, setCurrentDescription] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();
    const { user } = useAuth();

    const backgroundColor = useThemeColor({}, 'background');
    const tintColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'text');

    const snapPoints = useMemo(() => ['50%', '90%'], []);

    const handleGenerateVibe = async () => {
      if (!location) return;
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
      if (!location) return;
      try {
        await openWhatsAppChat({
          locationName: location.name,
          address: location.address,
          userId: user?.id,
          locationId: location.id,
        });
      } catch (error) {
        Alert.alert(
          'Eroare',
          error instanceof Error ? error.message : 'Nu am putut deschide WhatsApp',
          [{ text: 'OK' }]
        );
      }
    };

    const handleSheetChanges = useCallback((index: number) => {
      const isOpen = index !== -1;
      onSheetChange?.(isOpen);
      if (index === -1) {
        setCurrentDescription('');
      }
    }, [onSheetChange]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    if (!location) return null;

    const displayDescription = currentDescription || location.description;
    const locationIsFavorite = isFavorite(location.id);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: `${borderColor}40` }}
        backdropComponent={renderBackdrop}
        style={{ zIndex: 1000, elevation: 1000 }}
        containerStyle={{ zIndex: 1000, elevation: 1000 }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: location.imageUrl }}
              style={styles.image}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'transparent']}
              style={styles.gradient}
              locations={[0, 1]}
            />
            <Pressable
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(location.id)}
            >
              <Ionicons
                name={locationIsFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={locationIsFavorite ? '#FF3B30' : '#fff'}
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <ThemedText type="title" style={styles.title}>
                  {location.name}
                </ThemedText>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color="#fff" />
                  <ThemedText style={styles.ratingText}>{location.rating}</ThemedText>
                </View>
              </View>

              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={18} color={tintColor} />
                <ThemedText style={styles.address}>{location.address}</ThemedText>
              </View>

              <View style={styles.tagsRow}>
                <View style={[styles.tag, { backgroundColor: `${tintColor}15` }]}>
                  <ThemedText style={[styles.tagText, { color: tintColor }]}>
                    {location.type === 'cafe' ? '☕ Cafenea' : '🍽️ Restaurant'}
                  </ThemedText>
                </View>
                <View style={[styles.tag, { backgroundColor: '#FFB80015' }]}>
                  <ThemedText style={[styles.tagText, { color: '#FFB800' }]}>
                    Popular
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={[styles.descriptionCard, { backgroundColor, borderColor: `${borderColor}10` }]}>
              <View style={styles.descriptionHeader}>
                <ThemedText type="subtitle">Despre locație</ThemedText>
                {currentDescription && (
                  <LinearGradient
                    colors={['#FFB800', '#FF8A00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.aiBadge}
                    locations={[0, 1]}
                  >
                    <Ionicons name="sparkles" size={12} color="#fff" />
                    <ThemedText style={styles.aiBadgeText}>AI Vibe</ThemedText>
                  </LinearGradient>
                )}
              </View>
              <ThemedText style={styles.description}>{displayDescription}</ThemedText>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.vibeButton,
                { borderColor: tintColor },
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
                  <Ionicons name="sparkles-outline" size={20} color={tintColor} />
                  <ThemedText style={[styles.vibeButtonText, { color: tintColor }]}>
                    Generează Vibe cu AI
                  </ThemedText>
                </>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.reserveButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleReserve}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#fff" />
              <ThemedText style={styles.reserveButtonText}>Rezervă pe WhatsApp</ThemedText>
            </Pressable>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFB800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    opacity: 0.7,
  },
  address: {
    fontSize: 14,
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
  vibeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  vibeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#25D366',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
