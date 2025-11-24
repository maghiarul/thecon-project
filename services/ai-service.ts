import type { Location } from '@/types/location';

const CREATIVE_STYLES = [
  'vibrant și captivant',
  'warm și primitor',
  'modern și sofisticat',
  'autentic și cald',
  'elegant și rafinat',
];

const CAFE_TEMPLATES = [
  'Un spațiu perfect unde aromele de cafea proaspăt măcinată se împletesc cu atmosfera relaxantă. Locul ideal pentru o pauză de relaxare sau o întâlnire cu prietenii.',
  'Aici, fiecare ceașcă de cafea spune o poveste. Un refugiu urban unde pasiunea pentru cafea de calitate se simte în fiecare detaliu.',
  'Un colț de liniște în inima orașului, unde cafeaua excepțională întâlnește designul modern. Locul tău preferat pentru productivitate sau conversații memorabile.',
];

const RESTAURANT_TEMPLATES = [
  'O experiență culinară care îți va rămâne în minte. Fiecare fel de mâncare este pregătit cu pasiune, iar atmosfera te invită să savurezi fiecare moment.',
  'Aici, mâncarea devine artă, iar fiecare masă se transformă într-o sărbătoare a gusturilor autentice. Un loc unde tradițiile întâlnesc inovația.',
  'Descoperă o destinație gastronomică unde ingredientele de calitate și tehnicile rafinate creează o simfonie de arome. Perfect pentru orice ocazie specială.',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateCreativeDescription(location: Location): string {
  const style = getRandomElement(CREATIVE_STYLES);
  const template = location.type === 'cafe' 
    ? getRandomElement(CAFE_TEMPLATES)
    : getRandomElement(RESTAURANT_TEMPLATES);
  
  return `${template} ${location.name} te așteaptă într-o ambianță ${style}.`;
}

export async function generateVibeDescription(location: Location): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const description = generateCreativeDescription(location);
        resolve(description);
      } catch (error) {
        reject(new Error('Nu am putut genera descrierea. Încearcă din nou.'));
      }
    }, 2000);
  });
}

export interface AIServiceConfig {
  apiKey?: string;
  model?: string;
}

export function configureAIService(config: AIServiceConfig): void {
  console.log('AI Service configured:', config);
}
