export interface ItineraryDay {
  day: number;
  title: string;
  summary: string;
}

export interface UmrahPackage {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration_days: number;
  duration_nights: number;
  thumbnail: string;
  gallery: string[];
  airline: string;
  makkah_hotel: string;
  madinah_hotel: string;
  included_facilities: string[];
  excluded_facilities: string[];
  itinerary: ItineraryDay[];
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  next_departure_date?: string | null;
  available_departures_count?: number;
}

export interface Departure {
  id: number;
  package_id: number;
  package_name?: string;
  package_slug?: string;
  departure_date: string;
  return_date: string;
  quota: number;
  status: 'open' | 'limited' | 'full' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: number;
  package_id: number;
  departure_id: number;
  full_name: string;
  phone: string;
  email: string | null;
  participant_count: number;
  message: string | null;
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateRegistrationInput {
  packageId: number;
  departureId: number;
  fullName: string;
  phone: string;
  email?: string;
  participantCount: number;
  message?: string;
}
