import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './use-auth';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (locationId: string) => void;
  isFavorite: (locationId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    try {
      const key = user ? `favorites_${user.id}` : 'favorites_guest';
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      const key = user ? `favorites_${user.id}` : 'favorites_guest';
      await AsyncStorage.setItem(key, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const toggleFavorite = (locationId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (locationId: string) => {
    return favorites.includes(locationId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
