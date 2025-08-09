import React, { useState } from 'react';
import { 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Calendar,
  Settings,
  LogOut,
  Trophy
} from 'lucide-react';
import { ReservationGrid } from './ReservationGrid';
import { ReservationDialog } from './ReservationDialog';
import { PersonInfoDialog } from './PersonInfoDialog';
import { SettingsScreen } from './SettingsScreen';
import { ScoreboardScreen } from './ScoreboardScreen';
import { useAuth } from '../contexts/AuthContext';
import { useReservation } from '../contexts/ReservationContext';

interface ReservationScreenProps {
  onLogout: () => void;
}

export const ReservationScreen: React.FC<ReservationScreenProps> = ({ onLogout }) => {
  const { logout } = useAuth();
  const { getReservation, moveReservation } = useReservation();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pitchCount, setPitchCount] = useState(3);
  const [currentScreen, setCurrentScreen] = useState<'reservation' | 'settings' | 'scoreboard'>('reservation');
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [showPersonDialog, setShowPersonDialog] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    key: string;
    hour: string;
    pitchIndex: number;
    hasReservation: boolean;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Move mode state
  const [moveMode, setMoveMode] = useState(false);
  const [moveSource, setMoveSource] = useState<{
    key: string;
    reservation: any;
  } | null>(null);

  // Show move mode notification
  React.useEffect(() => {
    if (moveMode) {
      // This could be a toast notification in a real app
      console.log('Lütfen yeni gün/saha/saat kutusuna tıklayın. (Taşıma modu aktif)');
    }
  }, [moveMode]);

  // Screen navigation handlers
  const handleMenuSelect = (value: string) => {
    if (value === 'logout') {
      handleLogout();
    } else if (value === 'settings') {
      setCurrentScreen('settings');
    } else if (value === 'scoreboard') {
      setCurrentScreen('scoreboard');
    }
  };

  const handleBackToReservation = () => {
    setCurrentScreen('reservation');
  };

  // Show different screens based on currentScreen state
  if (currentScreen === 'settings') {
    return <SettingsScreen onBack={handleBackToReservation} />;
  }

  if (currentScreen === 'scoreboard') {
    return <ScoreboardScreen onBack={handleBackToReservation} />;
  }
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const changeDateByDays = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const changeDateByWeeks = (weeks: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (weeks * 7));
    setSelectedDate(newDate);
  };

  const handleCellClick = (key: string, hour: string, pitchIndex: number, hasReservation: boolean, event?: React.MouseEvent) => {
    if (moveMode && moveSource) {
      // Taşıma modunda yeni konum seçilince dialog aç
      const newDate = selectedDate.toISOString().substring(0, 10);
      
      // Önce taşımayı yap
      moveReservation(moveSource.key, key, newDate, hour, pitchIndex);
      
      // Sonra dialog'u aç (taşınan rezervasyonla)
      setTimeout(() => {
        setSelectedCell({ key, hour, pitchIndex, hasReservation: true });
        setShowReservationDialog(true);
      }, 100);
      
      // Taşıma modunu kapat
      setMoveMode(false);
      setMoveSource(null);
      return;
    }

    // Always show reservation dialog when clicking on cell (not person name)
    setSelectedCell({ key, hour, pitchIndex, hasReservation });
    setShowReservationDialog(true);
  };

  const handlePersonClick = (key: string, hour: string, pitchIndex: number) => {
    if (moveMode) return; // Don't show person dialog in move mode
    
    const reservation = getReservation(key);
    if (reservation) {
      setSelectedUser(reservation.user);
      setSelectedCell({ key, hour, pitchIndex, hasReservation: true });
      setShowPersonDialog(true);
    }
  };

  const handleStartMove = () => {
    if (selectedCell && selectedCell.hasReservation) {
      const reservation = getReservation(selectedCell.key);
      if (reservation) {
        setMoveSource({
          key: selectedCell.key,
          reservation
        });
        setMoveMode(true);
      }
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="h-screen bg-red-500 flex flex-col">
      {/* Header */}
      <div className="bg-white p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          {/* Menu */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-red-500 rounded-xl px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => handleMenuSelect(e.target.value)}
            >
              <option value="">☰</option>
              <option value="settings">Ayarlar</option>
              <option value="scoreboard">Skorboard</option>
              <option value="logout">Çıkış</option>
            </select>
          </div>

          {/* Pitch Count */}
          <select
            value={pitchCount}
            onChange={(e) => setPitchCount(Number(e.target.value))}
            className="bg-white border border-red-500 rounded-xl px-3 py-1 text-sm text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => changeDateByWeeks(-1)}
            className="p-1 bg-white border border-red-500 rounded-xl hover:bg-red-50 transition-colors"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => changeDateByDays(-1)}
            className="p-1 bg-white border border-red-500 rounded-xl hover:bg-red-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-1 bg-white border border-red-500 rounded-xl text-sm hover:bg-red-50 transition-colors min-w-[180px]"
          >
            {formatDate(selectedDate)}
          </button>
          <button
            onClick={() => changeDateByDays(1)}
            className="p-1 bg-white border border-red-500 rounded-xl hover:bg-red-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => changeDateByWeeks(1)}
            className="p-1 bg-white border border-red-500 rounded-xl hover:bg-red-50 transition-colors"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>

      {moveMode && (
        <div className="bg-orange-500 text-white p-2 text-center text-sm">
          Lütfen yeni gün/saha/saat kutusuna tıklayın. (Taşıma modu aktif)
        </div>
      )}

      {/* Reservation Grid */}
      <ReservationGrid
        selectedDate={selectedDate}
        pitchCount={pitchCount}
        onCellClick={handleCellClick}
        onPersonClick={handlePersonClick}
        changeMode={moveMode}
      />

      {/* Dialogs */}
      {selectedCell && (
        <ReservationDialog
          isOpen={showReservationDialog}
          onClose={() => {
            setShowReservationDialog(false);
            setSelectedCell(null);
          }}
          selectedDate={selectedDate}
          hour={selectedCell.hour}
          pitchIndex={selectedCell.pitchIndex}
          reservationKey={selectedCell.key}
          hasReservation={selectedCell.hasReservation}
          onStartMove={handleStartMove}
          moveMode={moveMode}
        />
      )}

      {selectedUser && (
        <PersonInfoDialog
          isOpen={showPersonDialog}
          onClose={() => {
            setShowPersonDialog(false);
            setSelectedUser(null);
            setSelectedCell(null);
          }}
          user={selectedUser}
          hour={selectedCell?.hour || ''}
          pitchIndex={selectedCell?.pitchIndex || 0}
        />
      )}
    </div>
  );
};