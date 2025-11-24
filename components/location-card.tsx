import { useFavorites } from '@/hooks/use-favorites';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Location } from '@/types/location';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

interface LocationCardProps {
  location: Location;
  onPress: () => void;
  distance?: number | null;
  variant?: 'default' | 'compact';
  style?: StyleProp<ViewStyle>;
}

export function LocationCard({ location, onPress, distance, variant = 'default', style }: LocationCardProps) {
  const cardBg = useThemeColor({}, 'background');
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(location.id);

  const isCompact = variant === 'compact';

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(location.id);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isCompact && styles.cardCompact,
        { backgroundColor: cardBg, shadowColor: '#000' },
        style,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: location.imageUrl }}
          style={[styles.image, isCompact && styles.imageCompact]}
          contentFit="cover"
          transition={200}
        />
        <View style={[styles.badgeContainer, isCompact && styles.badgeContainerCompact]}>
          <View style={styles.typeBadge}>
            <ThemedText style={styles.typeText}>
              {location.type === 'cafe' ? '☕' : '🍽️'}
            </ThemedText>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#fff" />
            <ThemedText style={styles.ratingText}>{location.rating}</ThemedText>
          </View>
        </View>
        
        <Pressable 
          style={[styles.favoriteButton, isCompact && styles.favoriteButtonCompact]}
          onPress={handleFavoritePress}
          hitSlop={8}
        >
          <Ionicons 
            name={favorite ? "heart" : "heart-outline"} 
            size={18} 
            color={favorite ? "#FF3B30" : "#000"} 
          />
        </Pressable>
      </View>
      
      <View style={[styles.content, isCompact && styles.contentCompact]}>
        <View style={styles.headerRow}>
          <ThemedText type={isCompact ? 'defaultSemiBold' : 'subtitle'} numberOfLines={1} style={styles.title}>
            {location.name}
          </ThemedText>
          {distance !== undefined && distance !== null && (
            <ThemedText style={styles.distance}>
              {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
            </ThemedText>
          )}
        </View>
        
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <ThemedText style={styles.address} numberOfLines={1}>
            {location.address}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardCompact: {
    marginHorizontal: 0,
    marginVertical: 8,
    flex: 1,
    minWidth: '48%',
    maxWidth: '48%',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageCompact: {
    height: 140,
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeContainerCompact: {
    top: 8,
    left: 8,
    right: 8,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButtonCompact: {
    bottom: 8,
    right: 8,
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    gap: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  contentCompact: {
    padding: 12,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.6,
  },
  address: {
    fontSize: 13,
    flex: 1,
  },
});
