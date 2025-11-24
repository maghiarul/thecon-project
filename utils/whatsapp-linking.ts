import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Platform } from 'react-native';

const BUSINESS_PHONE = '+40723456789';

export interface WhatsAppMessageOptions {
  locationName: string;
  address?: string;
  userId?: string;
  locationId?: string;
}

export function generateReservationMessage(options: WhatsAppMessageOptions): string {
  const { locationName, address } = options;
  
  let message = `Bună! Aș dori să fac o rezervare la ${locationName}`;
  
  if (address) {
    message += ` (${address})`;
  }
  
  message += '. Vă rog să mă contactați pentru detalii. Mulțumesc!';
  
  return encodeURIComponent(message);
}

export interface Reservation {
  locationId: string;
  locationName: string;
  address?: string;
  timestamp: number;
}

async function addReservation(options: WhatsAppMessageOptions): Promise<void> {
  if (!options.locationId) return;
  
  try {
    const key = options.userId ? `reservations_${options.userId}` : 'reservations_guest';
    const stored = await AsyncStorage.getItem(key);
    let reservations: Reservation[] = [];
    
    if (stored) {
      try {
        reservations = JSON.parse(stored);
        if (!Array.isArray(reservations)) {
          reservations = [];
        }
      } catch (parseError) {
        reservations = [];
      }
    }
    
    reservations.push({
      locationId: options.locationId,
      locationName: options.locationName,
      address: options.address,
      timestamp: Date.now(),
    });
    
    await AsyncStorage.setItem(key, JSON.stringify(reservations));
  } catch (error) {
    console.error('Failed to add reservation:', error);
  }
}

export async function getReservations(userId?: string): Promise<Reservation[]> {
  try {
    const key = userId ? `reservations_${userId}` : 'reservations_guest';
    const stored = await AsyncStorage.getItem(key);
    
    if (!stored) return [];
    
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (parseError) {
      console.error('Failed to parse reservations:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Failed to get reservations:', error);
    return [];
  }
}

export async function openWhatsAppChat(options: WhatsAppMessageOptions): Promise<void> {
  const message = generateReservationMessage(options);
  
  const whatsappURL = Platform.select({
    ios: `whatsapp://send?phone=${BUSINESS_PHONE}&text=${message}`,
    android: `whatsapp://send?phone=${BUSINESS_PHONE}&text=${message}`,
    default: `https://wa.me/${BUSINESS_PHONE.replace('+', '')}?text=${message}`,
  });

  try {
    const canOpen = await Linking.canOpenURL(whatsappURL);
    
    if (canOpen) {
      await Linking.openURL(whatsappURL);
      await addReservation(options);
    } else {
      const webURL = `https://wa.me/${BUSINESS_PHONE.replace('+', '')}?text=${message}`;
      await Linking.openURL(webURL);
      await addReservation(options);
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    throw new Error('Nu am putut deschide WhatsApp. Verifică dacă aplicația este instalată.');
  }
}
