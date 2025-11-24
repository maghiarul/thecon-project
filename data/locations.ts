import type { Location } from '@/types/location';

const inferType = (name: string, description: string): 'cafe' | 'restaurant' => {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  if (lowerName.includes('coffee') || lowerName.includes('café') || lowerName.includes('cafe') || 
      lowerName.includes('tea') || lowerDesc.includes('coffee') || lowerDesc.includes('espresso')) {
    return 'cafe';
  }
  return 'restaurant';
};

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'The Literary Coffee House \'Citadel\'',
    address: 'Str. Academiei, Nr. 15, Bucharest',
    coordinates: {
      latitude: 44.4363,
      longitude: 26.1018,
    },
    imageUrl: 'https://images.unsplash.com/photo-1435224654926-ecc9f7fa028c',
    description: 'A quiet place, ideal for reading and study sessions. Excellent espresso.',
    rating: 4.8,
    type: 'cafe',
  },
  {
    id: '2',
    name: 'Restaurant \'The Old Inn\'',
    address: 'Piața Unirii, Nr. 4, Cluj-Napoca',
    coordinates: {
      latitude: 46.7709,
      longitude: 23.5891,
    },
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    description: 'Traditional Romanian dishes, generous servings, and live folk music.',
    rating: 4.5,
    type: 'restaurant',
  },
  {
    id: '3',
    name: 'The Global Wok Bistro',
    address: 'Bulevardul Eroilor, Nr. 8, Timișoara',
    coordinates: {
      latitude: 45.7537,
      longitude: 21.2257,
    },
    imageUrl: 'https://images.unsplash.com/photo-1505483531331-fc3cf89fd382',
    description: 'Fast and tasty Asian food, a favorite among Polytechnic students.',
    rating: 4.2,
    type: 'restaurant',
  },
  {
    id: '4',
    name: 'Café \'New World\'',
    address: 'Str. Lăpușneanu, Nr. 12, Iași',
    coordinates: {
      latitude: 47.1601,
      longitude: 27.5794,
    },
    imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f',
    description: 'Modern design, perfect for a relaxed brunch. They have the best cakes.',
    rating: 4.7,
    type: 'cafe',
  },
  {
    id: '5',
    name: 'Pizzeria \'Il Drago\'',
    address: 'Str. Nicolae Bălcescu, Nr. 20, Brașov',
    coordinates: {
      latitude: 45.6429,
      longitude: 25.5888,
    },
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    description: 'Wood-fired oven pizza, authentic Italian ingredients. Excellent for groups.',
    rating: 4.6,
    type: 'restaurant',
  },
  {
    id: '6',
    name: 'Vegan Restaurant \'The Green Garden\'',
    address: 'Splaiul Independenței, Nr. 300, Bucharest',
    coordinates: {
      latitude: 44.4379,
      longitude: 26.0463,
    },
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    description: 'Healthy, plant-based options. Fresh smoothies and delicious cream soups.',
    rating: 4.9,
    type: 'restaurant',
  },
  {
    id: '7',
    name: 'Coffee Shop \'By The Faculty\'',
    address: 'Str. Observatorului, Nr. 17, Cluj-Napoca',
    coordinates: {
      latitude: 46.7570,
      longitude: 23.5786,
    },
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    description: 'Strategic location near the campus. Quick and affordable student lunch menu.',
    rating: 4.0,
    type: 'cafe',
  },
  {
    id: '8',
    name: 'Burger Shack',
    address: 'Calea Moșilor, Nr. 250, Bucharest',
    coordinates: {
      latitude: 44.4449,
      longitude: 26.1103,
    },
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    description: 'The best artisanal burgers in town, featuring Black Angus beef.',
    rating: 4.4,
    type: 'restaurant',
  },
  {
    id: '9',
    name: 'Tea House \'Sunset\'',
    address: 'Str. George Enescu, Nr. 3, Sibiu',
    coordinates: {
      latitude: 45.7958,
      longitude: 24.1528,
    },
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    description: 'An oasis of calm with over 50 types of tea and ambient music.',
    rating: 4.7,
    type: 'cafe',
  },
  {
    id: '10',
    name: 'Restaurant Pescaresc \'The Sea\'',
    address: 'Bulevardul Mamaia, Nr. 200, Constanța',
    coordinates: {
      latitude: 44.1751,
      longitude: 28.6367,
    },
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    description: 'Fresh fish and seafood specialties, with a view of the sea.',
    rating: 4.5,
    type: 'restaurant',
  },
  {
    id: '11',
    name: 'Bistro \'At The Forest\'',
    address: 'Aleea Parcului, Nr. 7, Oradea',
    coordinates: {
      latitude: 47.0506,
      longitude: 21.9161,
    },
    imageUrl: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3',
    description: 'International menu, green terrace. Ideal for a romantic dinner.',
    rating: 4.3,
    type: 'restaurant',
  },
  {
    id: '12',
    name: 'Gaming Coffee Shop \'Restart\'',
    address: 'Strada Vasile Alecsandri, Nr. 5, Galați',
    coordinates: {
      latitude: 45.4385,
      longitude: 28.0559,
    },
    imageUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    description: 'Board games, consoles, and coffee. An excellent place for socializing.',
    rating: 4.1,
    type: 'cafe',
  },
  {
    id: '13',
    name: 'Trattoria \'Bella Vita\'',
    address: 'Bulevardul Carol I, Nr. 18, Craiova',
    coordinates: {
      latitude: 44.3297,
      longitude: 23.8000,
    },
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
    description: 'Homemade pasta and Italian wines. Mediterranean atmosphere.',
    rating: 4.6,
    type: 'restaurant',
  },
  {
    id: '14',
    name: 'Bread and Coffee',
    address: 'Strada Republicii, Nr. 10, Ploiești',
    coordinates: {
      latitude: 44.9450,
      longitude: 26.0315,
    },
    imageUrl: 'https://images.unsplash.com/photo-1435224654926-ecc9f7fa028c',
    description: 'Artisanal bakery with specialty coffees. Ideal for breakfast.',
    rating: 4.8,
    type: 'cafe',
  },
  {
    id: '15',
    name: 'Fast-Food \'Döner King\'',
    address: 'Calea Șagului, Nr. 55, Timișoara',
    coordinates: {
      latitude: 45.7275,
      longitude: 21.2188,
    },
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    description: 'Döner Kebab and Shawarma. Quick and filling option after classes.',
    rating: 3.9,
    type: 'restaurant',
  },
  {
    id: '16',
    name: 'Restaurant \'The Citadel\'',
    address: 'Strada Mureșenilor, Nr. 1, Târgu Mureș',
    coordinates: {
      latitude: 46.5459,
      longitude: 24.5623,
    },
    imageUrl: 'https://images.unsplash.com/photo-1505483531331-fc3cf89fd382',
    description: 'Traditional Transylvanian food, next to the Medieval Citadel.',
    rating: 4.4,
    type: 'restaurant',
  },
  {
    id: '17',
    name: 'Smoothie Bar \'Energy\'',
    address: 'Bulevardul 1 Decembrie 1918, Nr. 100, Alba Iulia',
    coordinates: {
      latitude: 46.0683,
      longitude: 23.5855,
    },
    imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f',
    description: 'Smoothies, natural juices, and acai bowls for an energy boost.',
    rating: 4.9,
    type: 'cafe',
  },
  {
    id: '18',
    name: 'Restaurant \'Grandma\'s House\'',
    address: 'Strada Republicii, Nr. 45, Brașov',
    coordinates: {
      latitude: 45.6425,
      longitude: 25.5880,
    },
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    description: 'Fixed (lunch) menu, cheap and tasty, just like home.',
    rating: 4.3,
    type: 'restaurant',
  },
  {
    id: '19',
    name: 'Irish Pub \'The Shamrock\'',
    address: 'Strada Universității, Nr. 9, Iași',
    coordinates: {
      latitude: 47.1633,
      longitude: 27.5790,
    },
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    description: 'Craft beer, quiz nights, and live sports. Popular student spot.',
    rating: 4.5,
    type: 'restaurant',
  },
  {
    id: '20',
    name: 'Coffee Shop \'Zen\'',
    address: 'Strada Dorobanților, Nr. 80, Cluj-Napoca',
    coordinates: {
      latitude: 46.7770,
      longitude: 23.6067,
    },
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    description: 'Minimalist design, specialty coffee, and relaxing background music.',
    rating: 4.7,
    type: 'cafe',
  },
];
