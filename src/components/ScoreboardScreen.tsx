import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ScoreboardScreenProps {
  onBack: () => void;
}

export const ScoreboardScreen: React.FC<ScoreboardScreenProps> = ({ onBack }) => {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Klavye kısayolları için event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      
      // A kutusu kısayolları (sol sayaç)
      if (key === aBoxIncrementKey.toUpperCase()) {
        event.preventDefault();
        setLeftCounter(prev => prev + 1);
      } else if (key === aBoxDecrementKey.toUpperCase()) {
        event.preventDefault();
        setLeftCounter(prev => Math.max(0, prev - 1));
      }
      // B kutusu kısayolları (sağ sayaç)
      else if (key === bBoxIncrementKey.toUpperCase()) {
        event.preventDefault();
        setRightCounter(prev => prev + 1);
      } else if (key === bBoxDecrementKey.toUpperCase()) {
        event.preventDefault();
        setRightCounter(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aBoxIncrementKey, aBoxDecrementKey, bBoxIncrementKey, bBoxDecrementKey]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden p-0 m-0">
      {/* Header with back button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onBack}
          className="p-2 text-white hover:bg-gray-800 rounded-lg transition-all duration-300 bg-gray-700 bg-opacity-50"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Saat Kutusu */}
      <div className={`${clockBgColor} text-center flex flex-col justify-center rounded-xl mx-1 mt-1 mb-1`} style={{ height: 'calc(100vh - 140px)' }}>
        {/* Canlı Saat */}
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
            <span className={`text-[175px] sm:text-[245px] md:text-[315px] lg:text-[350px] xl:text-[403px] font-bold ${counterNumberColor}`}>{leftCounter.toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        {/* Sağ Kutu */}
        <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[950px] h-[324px] sm:h-[375px] md:h-[406px] lg:h-[426px] xl:h-[426px] bg-white rounded-xl relative">
          {/* Sayı Göstergesi */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-[175px] sm:text-[245px] md:text-[315px] lg:text-[350px] xl:text-[403px] font-bold ${counterNumberColor}`}>{rightCounter.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};