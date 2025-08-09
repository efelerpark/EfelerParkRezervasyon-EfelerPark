export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'user';
  rating: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  date: string;
  hour: string;
  pitchIndex: number;
  user: User;
  status: 'beklet' | 'ön' | 'kesin';
  notes?: string;
}

export interface ReservationCell {
  key: string;
  date: string;
  hour: string;
  pitchIndex: number;
  reservation?: Reservation;
}

export type ReservationStatus = 'beklet' | 'ön' | 'kesin';

export interface AuthUser {
  phone: string;
  isAuthenticated: boolean;
}