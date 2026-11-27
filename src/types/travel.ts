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
}

export interface RegistrationPayload {
  packageId: number;
  departureId: number;
  fullName: string;
  phone: string;
  email?: string;
  participantCount: number;
  message?: string;
}

export interface RegistrationResponseData {
  registrationId: number;
  packageName: string;
  departureDate: string;
  participantCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  errors?: Record<string, string[]>;
}
