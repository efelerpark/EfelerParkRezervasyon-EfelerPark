import React, { useState, useEffect } from 'react';
import { useReservation } from '../contexts/ReservationContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface StandaloneScoreboardProps {
  selectedDate?: Date;
  pitchIndex?: number;
}

export const StandaloneScoreboard: React.FC<StandaloneScoreboardProps> = ({ 
  selectedDate = new Date(), 
  pitchIndex = 0 
}) => {
  const { getReservation } = useReservation();
  const [showSeconds] = useLocalStorage('efelerpark_show_seconds', true);
  const [buttonDelay] = useLocalStorage('efelerpark_button_delay', 2);
  const [clockBgColor] = useLocalStorage('efelerpark_clock_bg_color', 'bg-red-600');
  const [counterTextColor] = useLocalStorage('efelerpark_counter_text_color', 'text-red-600');
  const [clockNumberColor] = useLocalStorage('efelerpark_clock_number_color', 'text-white');
  const [counterNumberColor] = useLocalStorage('efelerpark_counter_number_color', 'text-red-600');
  
  // Sayaç tuşları ayarları
  const [aBoxIncrementKey] = useLocalStorage('efelerpark_a_box_increment', 'Q');
  const [aBoxDecrementKey] = useLocalStorage('efelerpark_a_box_decrement', 'A');
  const [bBoxIncrementKey] = useLocalStorage('efelerpark_b_box_increment', 'P');
  const [bBoxDecrementKey] = useLocalStorage('efelerpark_b_box_decrement', 'L');
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [leftCounter, setLeftCounter] = useState(0);
  const [rightCounter, setRightCounter] = useState(0);
  const [lastCheckedHour, setLastCheckedHour] = useState<number>(-1);
  const [lastCheckedMinute, setLastCheckedMinute] = useState<number>(-1);

  // Audio context for beep sounds
  const playBeep = (frequency: number, duration: number, count: number = 1) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playSound = (index: number) => {
      if (index >= count) return;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      // Play next beep after a short delay
      if (index < count - 1) {
        setTimeout(() => playSound(index + 1), duration * 1000 + 200);
      }
    };
    
    playSound(0);
  };

  // Different beep sounds
  const beepSounds = {
    reservationEnd: () => playBeep(800, 0.3, 1), // 1 beep - reservation end
    reservationEndWithNext: () => playBeep(800, 0.3, 3), // 3 beeps - reservation end with next
    tenMinutesAfter: () => playBeep(1000, 0.5, 3), // 3 beeps - 10 minutes after
    thirtyMinutes: () => playBeep(600, 0.4, 2), // 2 beeps - 30 minutes into reservation
    increment: () => playBeep(1200, 0.1, 1), // High pitch - increment
    decrement: () => playBeep(400, 0.1, 1), // Low pitch - decrement
  };

  // Check for reservations and trigger alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      
      // Only check at the start of each minute
      if (currentSecond !== 0) return;
      
      // Avoid duplicate checks
      if (currentHour === lastCheckedHour && currentMinute === lastCheckedMinute) return;
      
      setLastCheckedHour(currentHour);
      setLastCheckedMinute(currentMinute);
      
      const dateStr = selectedDate.toISOString().substring(0, 10);
      const currentHourStr = `${currentHour.toString().padStart(2, '0')}:00`;
      const currentKey = `${dateStr}-${pitchIndex}-${currentHourStr}`;
      const currentReservation = getReservation(currentKey);
      
      // 1, 2, 3, 4: Reservation end checks (at minute 0 of next hour)
      if (currentMinute === 0) {
        const prevHour = currentHour === 0 ? 23 : currentHour - 1;
        const prevHourStr = `${prevHour.toString().padStart(2, '0')}:00`;
        const prevKey = `${dateStr}-${pitchIndex}-${prevHourStr}`;
        const prevReservation = getReservation(prevKey);
        
        if (prevReservation) {
          // Check if there's a reservation in current hour (next reservation)
          if (currentReservation) {
            // 2. Next reservation exists - 3 beeps
            beepSounds.reservationEndWithNext();
          } else {
            // 3. No next reservation - 1 beep
            beepSounds.reservationEnd();
          }
        }
      }
      
      // 4. 10 minutes after reservation end
      if (currentMinute === 10) {
        const prevHour = currentHour === 0 ? 23 : currentHour - 1;
        const prevHourStr = `${prevHour.toString().padStart(2, '0')}:00`;
        const prevKey = `${dateStr}-${pitchIndex}-${prevHourStr}`;
        const prevReservation = getReservation(prevKey);
        
        if (prevReservation && !currentReservation) {
          beepSounds.tenMinutesAfter();
        }
      }
      
      // 6. 30 minutes into current reservation
      if (currentMinute === 30 && currentReservation) {
        beepSounds.thirtyMinutes();
      }
    };

    checkAlarms();
  }, [currentTime, selectedDate, pitchIndex, getReservation, lastCheckedHour, lastCheckedMinute]);

  // Klavye kısayolları için event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      
      // A kutusu kısayolları (sağ sayaç - rightCounter)
      if (key === aBoxIncrementKey.toUpperCase()) {
        event.preventDefault();
        setRightCounter(prev => prev + 1);
      } else if (key === aBoxDecrementKey.toUpperCase()) {
        event.preventDefault();
        setRightCounter(prev => Math.max(0, prev - 1));
      }
      // B kutusu kısayolları (sol sayaç - leftCounter)
      else if (key === bBoxIncrementKey.toUpperCase()) {
        event.preventDefault();
        setLeftCounter(prev => prev + 1);
      } else if (key === bBoxDecrementKey.toUpperCase()) {
        event.preventDefault();
        setLeftCounter(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aBoxIncrementKey, aBoxDecrementKey, bBoxIncrementKey, bBoxDecrementKey]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden p-0 m-0">
      {/* Saat Kutusu */}
      <div className={`${clockBgColor} text-center flex flex-col justify-center rounded-xl mx-1 mt-1 mb-1`} style={{ height: 'calc(100vh - 140px)' }}>
        <div className={`${clockBgColor} text-center shadow-2xl flex flex-col justify-center rounded-xl h-full`}>
          <div className={`font-mono font-bold ${clockNumberColor} tracking-wider flex items-baseline justify-center`}>
            <span className="text-9xl sm:text-[10rem] md:text-[11rem] lg:text-[15rem] xl:text-[18rem]">
              {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {showSeconds && (
              <span className="text-[36px] sm:text-[48px] md:text-[80px] lg:text-[120px] xl:text-[144px] ml-2">
                {currentTime.getSeconds().toString().padStart(2, '0')}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Sayaç Kutuları - En Altta */}
      <div className="flex px-1 pb-1 space-x-1 justify-center items-end">
        {/* Sol Kutu */}
        <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[950px] h-[324px] sm:h-[375px] md:h-[406px] lg:h-[426px] xl:h-[426px] bg-white rounded-xl relative">
          {/* Sayı Göstergesi */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-[175px] sm:text-[245px] md:text-[315px] lg:text-[350px] xl:text-[403px] font-bold ${counterNumberColor}`}>{rightCounter.toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        {/* Sağ Kutu */}
        <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[950px] h-[324px] sm:h-[375px] md:h-[406px] lg:h-[426px] xl:h-[426px] bg-white rounded-xl relative">
          {/* Sayı Göstergesi */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-[175px] sm:text-[245px] md:text-[315px] lg:text-[350px] xl:text-[403px] font-bold ${counterNumberColor}`}>{leftCounter.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};