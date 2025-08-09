import React from 'react';
import { useReservation } from '../contexts/ReservationContext';

interface ReservationGridProps {
  selectedDate: Date;
  pitchCount: number;
  onCellClick: (key: string, hour: string, pitchIndex: number, hasReservation: boolean) => void;
  onPersonClick: (key: string, hour: string, pitchIndex: number) => void;
  changeMode: boolean;
}

export const ReservationGrid: React.FC<ReservationGridProps> = ({
  selectedDate,
  pitchCount,
  onCellClick,
  onPersonClick,
  changeMode,
}) => {
  const { getReservation } = useReservation();
  
  const hours = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padLeft(2, '0')}:00`
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'beklet':
        return 'bg-yellow-200';
      case 'ön':
        return 'bg-orange-300';
      case 'kesin':
        return 'bg-green-300';
      default:
        return 'bg-white';
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().substring(0, 10);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${pitchCount}, 1fr)` }}>
        {hours.map((hour, hourIndex) =>
          Array.from({ length: pitchCount }, (_, pitchIndex) => {
            const key = `${formatDate(selectedDate)}-${pitchIndex}-${hour}`;
            const reservation = getReservation(key);
            const hasReservation = !!reservation;
            
            return (
              <div
                key={key}
                onClick={() => onCellClick(key, hour, pitchIndex, hasReservation)}
                className={`
                  m-0.5 h-11 rounded cursor-pointer border transition-all duration-200
                  ${getStatusColor(reservation?.status)}
                  ${changeMode ? 'border-orange-500 border-2' : 'border-gray-200'}
                  hover:shadow-md hover:scale-105
                `}
              >
                <div className="p-1 text-xs">
                  <div className="text-gray-600">{hour}</div>
                  {reservation && (
                    <div className="flex items-center space-x-1 mt-1">
                      <span 
                        className="text-blue-600 font-semibold truncate cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPersonClick(key, hour, pitchIndex);
                        }}
                      >
                        {reservation.user.firstName} {reservation.user.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};