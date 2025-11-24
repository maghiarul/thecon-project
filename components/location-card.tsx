import { useThemeColor } from '@/hooks/use-theme-color';
import type { Location } from '@/types/location';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface LocationCardProps {
  location: Location;
  onPress: () => void;
  distance?: number | null;
}

export function LocationCard({ location, onPress, distance }: LocationCardProps) {
  const cardBg = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'text');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cardBg, borderColor: `${borderColor}20` },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: location.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <ThemedText type="subtitle" numberOfLines={1}>
          {location.name}
        </ThemedText>
        <ThemedText style={styles.address} numberOfLines={1}>
          {location.address}
        </ThemedText>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <ThemedText style={styles.ratingText}>{location.rating}</ThemedText>
          </View>
          <View style={styles.rightSection}>
            {distance !== undefined && distance !== null && (
              <ThemedText style={styles.distance}>
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </ThemedText>
            )}
            <ThemedText style={styles.type}>
              {location.type === 'cafe' ? '☕ Cafe' : '🍽️ Restaurant'}
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
    gap: 6,
  },
  address: {
    fontSize: 14,
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distance: {
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '600',
  },
  type: {
    fontSize: 13,
    opacity: 0.7,
  },
});
