import { LocationCard } from '@/components/location-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Toast } from '@/components/toast';
import { mockLocations } from '@/data/locations';
import { useAuth } from '@/hooks/use-auth';
import { useFavorites } from '@/hooks/use-favorites';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getReservations, type Reservation } from '@/utils/whatsapp-linking';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const cardBg = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const { favorites } = useFavorites();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });
  const [reservationsCount, setReservationsCount] = useState(0);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const favoriteLocations = mockLocations.filter(loc => favorites.includes(loc.id));

  useEffect(() => {
    loadReservationsCount();
  }, [user]);

  const loadReservationsCount = async () => {
    try {
      const key = user ? `reservations_${user.id}` : 'reservations_guest';
      
      // Clear old numeric format if exists
      const stored = await AsyncStorage.getItem(key);
      if (stored && !stored.startsWith('[')) {
        await AsyncStorage.removeItem(key);
      }
      
      const userReservations = await getReservations(user?.id);
      setReservations(userReservations);
      setReservationsCount(userReservations.length);
    } catch (error) {
      console.error('Failed to load reservations:', error);
      setReservations([]);
      setReservationsCount(0);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setToast({ visible: true, message: 'Deconectat cu succes', type: 'success' });
      setTimeout(() => {
        try {
          router.replace('/auth');
        } catch (navError) {
          console.error('Navigation error:', navError);
        }
      }, 1500);
    } catch (error) {
      console.error('Sign out error:', error);
      setToast({ visible: true, message: 'Nu s-a putut efectua deconectarea', type: 'error' });
    }
  };

  const handleChangeAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setToast({ visible: true, message: 'Permisiune necesară pentru galerie', type: 'error' });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setToast({ visible: true, message: 'Funcție disponibilă în curând', type: 'info' });
      }
    } catch (error) {
      setToast({ visible: true, message: 'Nu s-a putut selecta imaginea', type: 'error' });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
      
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
            <Pressable style={styles.avatarContainer} onPress={handleChangeAvatar}>
              <Image
                source={{ uri: user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'User')}&background=0a7ea4&color=fff` }}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color="#fff" />
              </View>
            </Pressable>
            <ThemedText type="title" style={styles.name}>
              {user?.user_metadata?.full_name || 'Utilizator'}
            </ThemedText>
            <ThemedText style={styles.email}>
              {user?.email || 'email@example.com'}
            </ThemedText>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>{favoriteLocations.length}</ThemedText>
                <ThemedText style={styles.statLabel}>Favorite</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>{reservationsCount}</ThemedText>
                <ThemedText style={styles.statLabel}>Rezervări</ThemedText>
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
          
          {reservations.length > 0 ? (
            <View style={styles.reservationsList}>
              {reservations.slice(0, 5).reverse().map((reservation, index) => {
                const reservationLocation = mockLocations.find(loc => loc.id === reservation.locationId);
                return (
                  <Pressable
                    key={`${reservation.locationId}-${reservation.timestamp}`}
                    style={[styles.reservationItem, { backgroundColor: cardBg, borderColor: `${borderColor}10` }]}
                    onPress={() => reservationLocation && router.push({
                      pathname: '/location-details',
                      params: { locationId: reservationLocation.id }
                    })}
                  >
                    <View style={[styles.reservationIcon, { backgroundColor: `${tintColor}15` }]}>
                      <Ionicons name="calendar" size={20} color={tintColor} />
                    </View>
                    <View style={styles.reservationInfo}>
                      <ThemedText style={styles.reservationName} numberOfLines={1}>
                        {reservation.locationName}
                      </ThemedText>
                      <ThemedText style={styles.reservationDate}>
                        {new Date(reservation.timestamp).toLocaleDateString('ro-RO', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={`${borderColor}40`} />
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={[styles.emptyState, { borderColor: `${borderColor}20` }]}>
              <Ionicons name="calendar-outline" size={48} color={`${borderColor}40`} />
              <ThemedText style={styles.emptyText}>
                Nicio rezervare încă
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Rezervările tale vor apărea aici după ce contactezi locațiile.
              </ThemedText>
            </View>
          )}

          <Pressable
            style={[styles.signOutButton, { borderColor: '#FF3B30' }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <ThemedText style={[styles.signOutText, { color: '#FF3B30' }]}>
              Deconectare
            </ThemedText>
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
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 32,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reservationsList: {
    gap: 12,
    marginBottom: 20,
  },
  reservationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  reservationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reservationInfo: {
    flex: 1,
  },
  reservationName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  reservationDate: {
    fontSize: 13,
    opacity: 0.6,
  },
});
