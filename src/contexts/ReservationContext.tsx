import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Reservation, ReservationStatus } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ReservationContextType {
  users: User[];
  reservations: Map<string, Reservation>;
  addUser: (user: Omit<User, 'id'>) => void;
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateReservation: (key: string, reservation: Omit<Reservation, 'id'>) => void;
  deleteReservation: (key: string) => void;
  moveReservation: (oldKey: string, newKey: string, newDate: string, newHour: string, newPitchIndex: number) => void;
  getReservation: (key: string) => Reservation | undefined;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('efelerpark_users', [
    {
      id: '1',
      firstName: 'Mehmet',
      lastName: 'Ak',
      phone: '054322148798',
      role: 'admin',
      rating: 5,
      notes: 'Bu bir deneme notudur.'
    },
    {
      id: '2',
      firstName: 'Art',
      lastName: 'Bir',
      phone: '054312345670',
      role: 'user',
      rating: 4,
      notes: 'Test notu'
    }
  ]);

  const [reservationsData, setReservationsData] = useLocalStorage<[string, Reservation][]>('efelerpark_reservations', []);
  
  // Convert array back to Map for easier usage
  const reservations = new Map(reservationsData);
  
  const updateReservationsStorage = (newMap: Map<string, Reservation>) => {
    setReservationsData(Array.from(newMap.entries()));
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const addReservation = (reservationData: Omit<Reservation, 'id'>) => {
    const key = `${reservationData.date}-${reservationData.pitchIndex}-${reservationData.hour}`;
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(),
    };
    
    const newMap = new Map(reservations);
      newMap.set(key, newReservation);
    updateReservationsStorage(newMap);
  };

  const updateReservation = (key: string, reservationData: Omit<Reservation, 'id'>) => {
    const newMap = new Map(reservations);
      const existing = newMap.get(key);
      if (existing) {
        newMap.set(key, { ...reservationData, id: existing.id });
      }
    updateReservationsStorage(newMap);
  };

  const deleteReservation = (key: string) => {
    const newMap = new Map(reservations);
      newMap.delete(key);
    updateReservationsStorage(newMap);
  };

  const moveReservation = (oldKey: string, newKey: string, newDate: string, newHour: string, newPitchIndex: number) => {
    const newMap = new Map(reservations);
      const reservation = newMap.get(oldKey);
      if (reservation) {
        newMap.delete(oldKey);
        newMap.set(newKey, {
          ...reservation,
          date: newDate,
          hour: newHour,
          pitchIndex: newPitchIndex,
        });
      }
    updateReservationsStorage(newMap);
  };

  const getReservation = (key: string): Reservation | undefined => {
    return reservations.get(key);
  };

  return (
    <ReservationContext.Provider value={{
      users,
      reservations,
      addUser,
      addReservation,
      updateReservation,
      deleteReservation,
      moveReservation,
      getReservation,
    }}>
      {children}
    </ReservationContext.Provider>
  );
};