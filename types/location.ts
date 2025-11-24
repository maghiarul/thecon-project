export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  imageUrl: string;
  description: string;
  rating: number;
  type: 'restaurant' | 'cafe';
}
