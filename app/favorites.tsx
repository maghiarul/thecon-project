import { LocationCard } from '@/components/location-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockLocations } from '@/data/locations';
import { useFavorites } from '@/hooks/use-favorites';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

  const favoriteLocations = mockLocations.filter(loc => favorites.includes(loc.id));

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Locații Favorite', headerBackTitle: 'Profil' }} />
      
      {favoriteLocations.length > 0 ? (
        <FlatList
          data={favoriteLocations}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.listColumnWrapper}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <LocationCard
              location={item}
              onPress={() => router.push({
                pathname: '/location-details',
                params: { locationId: item.id },
              })}
              variant="compact"
            />
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <ThemedText style={styles.emptyText}>Nu ai locații favorite</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  listColumnWrapper: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    opacity: 0.6,
  },
});
