import { LocationCard } from '@/components/location-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockLocations } from '@/data/locations';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Location } from '@/types/location';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoLocation from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Keyboard, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

type ViewMode = 'map' | 'list';
type FilterType = 'all' | 'cafe' | 'restaurant';

export default function ExploreScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'text');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const location = await ExpoLocation.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);
        
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...coords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      } else {
        Alert.alert(
          'Acces Locație',
          'Pentru a vedea distanțele până la locații și pentru o experiență mai bună, activează accesul la locație.',
          [
            { text: 'Mai târziu', style: 'cancel' },
            { 
              text: 'Setări', 
              onPress: () => ExpoLocation.requestForegroundPermissionsAsync()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredLocations = mockLocations
    .filter((location) => {
      const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           location.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || location.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .map((location) => ({
      ...location,
      distance: userLocation 
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            location.coordinates.latitude,
            location.coordinates.longitude
          )
        : null,
    }))
    .sort((a, b) => {
      if (searchQuery && a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return 0;
    });

  const handleLocationPress = (location: Location) => {
    router.push({
      pathname: '/location-details',
      params: { locationId: location.id },
    });
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'map' ? 'list' : 'map');
  };

  const handleSearchResultPress = (location: Location & { distance: number | null }) => {
    setShowSearchResults(false);
    setSearchQuery('');
    Keyboard.dismiss();
    handleLocationPress(location);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowSearchResults(text.length > 0);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.headerContainer, { backgroundColor }]}>
        <View style={[styles.searchBar, { backgroundColor: `${borderColor}08`, borderColor: `${borderColor}15` }]}>
          <Ionicons name="search" size={20} color={`${borderColor}60`} />
          <TextInput
            style={[styles.searchInput, { color: borderColor }]}
            placeholder="Caută locații..."
            placeholderTextColor={`${borderColor}40`}
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => { setSearchQuery(''); setShowSearchResults(false); }}>
              <Ionicons name="close-circle" size={20} color={`${borderColor}60`} />
            </Pressable>
          )}
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContainer}
        >
          {[
            { value: 'all', label: 'Toate', icon: 'apps' },
            { value: 'cafe', label: 'Cafenele', icon: 'cafe' },
            { value: 'restaurant', label: 'Restaurante', icon: 'restaurant' },
          ].map((filter) => (
            <Pressable
              key={filter.value}
              style={[
                styles.filterChip,
                filterType === filter.value 
                  ? { backgroundColor: tintColor, borderColor: tintColor } 
                  : { backgroundColor: 'transparent', borderColor: `${borderColor}20` }
              ]}
              onPress={() => setFilterType(filter.value as FilterType)}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={16} 
                color={filterType === filter.value ? '#fff' : borderColor} 
              />
              <ThemedText 
                style={[
                  styles.filterLabel, 
                  { color: filterType === filter.value ? '#fff' : borderColor }
                ]}
              >
                {filter.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {showSearchResults && searchQuery.length > 0 && filteredLocations.length > 0 && (
        <View style={[styles.searchResults, { backgroundColor, borderColor: `${borderColor}20` }]}>
          <FlatList
            data={filteredLocations.slice(0, 5)}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.searchResultItem,
                  pressed && styles.searchResultPressed,
                ]}
                onPress={() => handleSearchResultPress(item)}
              >
                <View style={styles.searchResultLeft}>
                  <Ionicons 
                    name={item.type === 'cafe' ? 'cafe' : 'restaurant'} 
                    size={24} 
                    color={tintColor} 
                  />
                  <View style={styles.searchResultText}>
                    <ThemedText style={styles.searchResultName} numberOfLines={1}>
                      {item.name}
                    </ThemedText>
                    <ThemedText style={styles.searchResultAddress} numberOfLines={1}>
                      {item.address}
                    </ThemedText>
                  </View>
                </View>
                {item.distance !== null && (
                  <ThemedText style={styles.searchResultDistance}>
                    {item.distance < 1 ? `${Math.round(item.distance * 1000)}m` : `${item.distance.toFixed(1)}km`}
                  </ThemedText>
                )}
              </Pressable>
            )}
          />
        </View>
      )}

      {viewMode === 'map' ? (
        <>
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.latitude || 45.4353,
              longitude: userLocation?.longitude || 28.0080,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                coordinate={location.coordinates}
                onPress={() => handleLocationPress(location)}
                tracksViewChanges={false}
              />
            ))}
          </MapView>
          
          <Pressable
            style={({ pressed }) => [
              styles.toggleButton,
              { 
                backgroundColor: tintColor,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              },
              pressed && styles.togglePressed,
            ]}
            onPress={toggleViewMode}
          >
            <Ionicons
              name="list"
              size={24}
              color="#fff"
            />
          </Pressable>
        </>
      ) : (
        <>
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.listColumnWrapper}
            key="grid-2"
            renderItem={({ item }) => (
              <LocationCard
                location={item}
                onPress={() => handleLocationPress(item)}
                distance={item.distance}
                variant="compact"
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          
          <Pressable
            style={({ pressed }) => [
              styles.toggleButton,
              { 
                backgroundColor: tintColor,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              },
              pressed && styles.togglePressed,
            ]}
            onPress={toggleViewMode}
          >
            <Ionicons
              name="map"
              size={24}
              color="#fff"
            />
          </Pressable>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 12,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButton: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  togglePressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  map: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  listColumnWrapper: {
    justifyContent: 'space-between',
  },
  searchResults: {
    position: 'absolute',
    top: 130,
    left: 16,
    right: 16,
    maxHeight: 300,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 100,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchResultPressed: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  searchResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  searchResultText: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  searchResultAddress: {
    fontSize: 13,
    opacity: 0.6,
  },
  searchResultDistance: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
});
