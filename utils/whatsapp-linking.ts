import { Linking, Platform } from 'react-native';

const BUSINESS_PHONE = '+40723456789';

export interface WhatsAppMessageOptions {
  locationName: string;
  address?: string;
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
    } else {
      const webURL = `https://wa.me/${BUSINESS_PHONE.replace('+', '')}?text=${message}`;
      await Linking.openURL(webURL);
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    throw new Error('Nu am putut deschide WhatsApp. Verifică dacă aplicația este instalată.');
  }
}
