import React, { useState, useEffect } from 'react';
import { Settings, ArrowLeft, Clock, Timer, Save, Edit, Trophy, Monitor, Type, Info, FileText, Trash2, Keyboard, Check } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [showSeconds, setShowSeconds] = useLocalStorage('efelerpark_show_seconds', true);
  const [buttonDelay, setButtonDelay] = useLocalStorage('efelerpark_button_delay', 2);
  const [shortcutKey, setShortcutKey] = useLocalStorage('efelerpark_shortcut_key', 'Space');
  const [decrementKey, setDecrementKey] = useLocalStorage('efelerpark_decrement_key', 'X');
  
  // A ve B kutuları için kısayol tuşları
  const [aBoxIncrementKey, setABoxIncrementKey] = useLocalStorage('efelerpark_a_box_increment', 'Q');
  const [aBoxDecrementKey, setABoxDecrementKey] = useLocalStorage('efelerpark_a_box_decrement', 'A');
  const [bBoxIncrementKey, setBBoxIncrementKey] = useLocalStorage('efelerpark_b_box_increment', 'P');
  const [bBoxDecrementKey, setBBoxDecrementKey] = useLocalStorage('efelerpark_b_box_decrement', 'L');
  
  // Skorboard ayarları
  const [counterBgWidth, setCounterBgWidth] = useLocalStorage('efelerpark_counter_bg_width', 950);
  const [counterBgHeight, setCounterBgHeight] = useLocalStorage('efelerpark_counter_bg_height', 426);
  const [clockBgWidth, setClockBgWidth] = useLocalStorage('efelerpark_clock_bg_width', 100);
  const [clockBgHeight, setClockBgHeight] = useLocalStorage('efelerpark_clock_bg_height', 140);
  const [clockFontWidth, setClockFontWidth] = useLocalStorage('efelerpark_clock_font_width', 18);
  const [clockFontHeight, setClockFontHeight] = useLocalStorage('efelerpark_clock_font_height', 18);
  
  // Sayaç font ayarları
  const [counterFontWidth, setCounterFontWidth] = useLocalStorage('efelerpark_counter_font_width', 403);
  const [counterFontHeight, setCounterFontHeight] = useLocalStorage('efelerpark_counter_font_height', 403);
  
  // A ve B kutusu sayaç değerleri
  const [aBoxCounter, setABoxCounter] = useLocalStorage('efelerpark_a_box_counter', 0);
  const [bBoxCounter, setBBoxCounter] = useLocalStorage('efelerpark_b_box_counter', 0);
  
  // Skorboard renk ayarları
  const [clockBgColor, setClockBgColor] = useLocalStorage('efelerpark_clock_bg_color', 'bg-red-600');
  const [clockNumberColor, setClockNumberColor] = useLocalStorage('efelerpark_clock_number_color', 'text-white');
  const [counterTextColor, setCounterTextColor] = useLocalStorage('efelerpark_counter_text_color', 'text-red-600');
  const [counterNumberColor, setCounterNumberColor] = useLocalStorage('efelerpark_counter_number_color', 'text-red-600');
  
  // Renk slider değerleri (0-8 arası index)
  const [clockBgColorIndex, setClockBgColorIndex] = useLocalStorage('efelerpark_clock_bg_color_index', 0);
  const [clockNumberColorIndex, setClockNumberColorIndex] = useLocalStorage('efelerpark_clock_number_color_index', 8);
  const [counterTextColorIndex, setCounterTextColorIndex] = useLocalStorage('efelerpark_counter_text_color_index', 0);
  const [counterNumberColorIndex, setCounterNumberColorIndex] = useLocalStorage('efelerpark_counter_number_color_index', 0);
  
  // Aktif renk ayarı (hangi buton seçili)
  const [activeColorSetting, setActiveColorSetting] = useState<'clockBg' | 'clockNumber' | 'counterText' | 'counterNumber' | null>(null);
  
  // Renk paleti
  const colorPalette = [
    { bg: 'bg-red-600', text: 'text-red-600', name: 'Kırmızı', emoji: '🔴' },
    { bg: 'bg-blue-600', text: 'text-blue-600', name: 'Mavi', emoji: '🔵' },
    { bg: 'bg-green-600', text: 'text-green-600', name: 'Yeşil', emoji: '🟢' },
    { bg: 'bg-purple-600', text: 'text-purple-600', name: 'Mor', emoji: '🟣' },
    { bg: 'bg-orange-600', text: 'text-orange-600', name: 'Turuncu', emoji: '🟠' },
    { bg: 'bg-pink-600', text: 'text-pink-600', name: 'Pembe', emoji: '🩷' },
    { bg: 'bg-yellow-600', text: 'text-yellow-600', name: 'Sarı', emoji: '🟡' },
    { bg: 'bg-gray-600', text: 'text-gray-600', name: 'Gri', emoji: '⚫' },
    { bg: 'bg-white', text: 'text-white', name: 'Beyaz', emoji: '⚪' }
  ];
  
  // Notlar için state
  const [notes, setNotes] = useLocalStorage('efelerpark_notes', '');
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  
  const [settingsPressed, setSettingsPressed] = useState(false);
  const [secondsPressed, setSecondsPressed] = useState(false);
  const [savePressed, setSavePressed] = useState(false);
  const [saveCountersPressed, setSaveCountersPressed] = useState(false);
  const [changePressed, setChangePressed] = useState(false);
  const [infoPressed, setInfoPressed] = useState(false);
  const [editNotesPressed, setEditNotesPressed] = useState(false);
  const [deleteNotesPressed, setDeleteNotesPressed] = useState(false);
  
  // Renk seçim modal state
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Klavye dialog state'leri
  const [showKeyboardDialog, setShowKeyboardDialog] = useState(false);
  const [currentKeyInput, setCurrentKeyInput] = useState<'aIncrement' | 'aDecrement' | 'bIncrement' | 'bDecrement' | null>(null);
  const [currentInputIndex, setCurrentInputIndex] = useState(0); // 0: aIncrement, 1: aDecrement, 2: bIncrement, 3: bDecrement
  const [virtualKeyboard, setVirtualKeyboard] = useState('');

  // Klavye kısayolları için event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      
      // A kutusu kısayolları
      if (key === aBoxIncrementKey.toUpperCase()) {
        event.preventDefault();
        setABoxCounter(prev => prev + 1);
      } else if (key === aBoxDecrementKey.toUpperCase()) {
        event.preventDefault();
        setABoxCounter(prev => Math.max(0, prev - 1));
      }
      // B kutusu kısayolları
      else if (key === bBoxIncrementKey.toUpperCase()) {
        event.preventDefault();
        setBBoxCounter(prev => prev + 1);
      } else if (key === bBoxDecrementKey.toUpperCase()) {
        event.preventDefault();
        setBBoxCounter(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aBoxIncrementKey, aBoxDecrementKey, bBoxIncrementKey, bBoxDecrementKey, setABoxCounter, setBBoxCounter]);

  const handleSettingsClick = () => {
    alert('Ayarlar butonuna tıklandı!');
  };

  const toggleSeconds = () => {
    setShowSeconds(!showSeconds);
  };

  const handleSave = () => {
    alert('Ayarlar kaydedildi!');
  };

  const handleSaveCounters = () => {
    alert('Sayaç değerleri kaydedildi!');
  };

  const handleChange = () => {
    alert('Değişiklik moduna geçildi!');
  };

  const handleShortcutKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1); // Son karakteri al
    if (value) {
      setShortcutKey(value.toUpperCase());
    }
  };

  const handleDecrementKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1); // Son karakteri al
    if (value) {
      setDecrementKey(value.toUpperCase());
    }
  };

  const handleABoxIncrementKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1);
    if (value) {
      setABoxIncrementKey(value.toUpperCase());
    }
  };

  const handleABoxDecrementKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1);
    if (value) {
      setABoxDecrementKey(value.toUpperCase());
    }
  };

  const handleBBoxIncrementKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1);
    if (value) {
      setBBoxIncrementKey(value.toUpperCase());
    }
  };

  const handleBBoxDecrementKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1);
    if (value) {
      setBBoxDecrementKey(value.toUpperCase());
    }
  };

  // Renk slider fonksiyonları
  const handleColorSliderChange = (direction: 'left' | 'right') => {
    if (!activeColorSetting) return;
    
    const updateColorIndex = (currentIndex: number) => {
      let newIndex;
      if (direction === 'left') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : 8;
      } else {
        newIndex = currentIndex < 8 ? currentIndex + 1 : 0;
      }
      return newIndex;
    };
    
    switch (activeColorSetting) {
      case 'clockBg':
        const newClockBgIndex = updateColorIndex(clockBgColorIndex);
        setClockBgColorIndex(newClockBgIndex);
        setClockBgColor(colorPalette[newClockBgIndex].bg);
        break;
      case 'clockNumber':
        const newClockNumberIndex = updateColorIndex(clockNumberColorIndex);
        setClockNumberColorIndex(newClockNumberIndex);
        setClockNumberColor(colorPalette[newClockNumberIndex].text);
        break;
      case 'counterText':
        const newCounterTextIndex = updateColorIndex(counterTextColorIndex);
        setCounterTextColorIndex(newCounterTextIndex);
        setCounterTextColor(colorPalette[newCounterTextIndex].text);
        break;
      case 'counterNumber':
        const newCounterNumberIndex = updateColorIndex(counterNumberColorIndex);
        setCounterNumberColorIndex(newCounterNumberIndex);
        setCounterNumberColor(colorPalette[newCounterNumberIndex].text);
        break;
    }
  };

  const handleInfoClick = () => {
    setTempNotes(notes);
    setShowNotesDialog(true);
  };

  const handleSaveNotes = () => {
    setNotes(tempNotes);
    setShowNotesDialog(false);
  };

  const handleDeleteNotes = () => {
    setTempNotes('');
    setNotes('');
    setShowNotesDialog(false);
  };

  const handleKeyboardClick = (inputType: 'aIncrement' | 'aDecrement' | 'bIncrement' | 'bDecrement') => {
    setCurrentKeyInput(inputType);
    // Set current input index for navigation
    const inputMap = { 'aIncrement': 0, 'aDecrement': 1, 'bIncrement': 2, 'bDecrement': 3 };
    setCurrentInputIndex(inputMap[inputType]);
    setVirtualKeyboard('');
    setShowKeyboardDialog(true);
  };

  const handleVirtualKeyPress = (key: string) => {
    setVirtualKeyboard(key);
    // Immediately update the input field
    switch (currentKeyInput) {
      case 'aIncrement':
        setABoxIncrementKey(key.toUpperCase());
        break;
      case 'aDecrement':
        setABoxDecrementKey(key.toUpperCase());
        break;
      case 'bIncrement':
        setBBoxIncrementKey(key.toUpperCase());
        break;
      case 'bDecrement':
        setBBoxDecrementKey(key.toUpperCase());
        break;
    }
  };

  const handleNavigateInput = (direction: 'left' | 'right') => {
    const inputTypes = ['aIncrement', 'aDecrement', 'bIncrement', 'bDecrement'] as const;
    let newIndex = currentInputIndex;
    
    if (direction === 'left') {
      newIndex = currentInputIndex > 0 ? currentInputIndex - 1 : 3;
    } else {
      newIndex = currentInputIndex < 3 ? currentInputIndex + 1 : 0;
    }
    
    setCurrentInputIndex(newIndex);
    setCurrentKeyInput(inputTypes[newIndex]);
    setVirtualKeyboard('');
  };

  const handleKeyboardSave = () => {
    // Changes are already saved immediately when key is pressed
    setShowKeyboardDialog(false);
    setCurrentKeyInput(null);
    setVirtualKeyboard('');
    // Reset currentInputIndex to -1 so all inputs return to default color
    setCurrentInputIndex(-1);
  };

  return (
    <div className="min-h-screen bg-red-500 flex flex-col">
      {/* Header */}
      <div className="bg-red-500 p-4 flex items-center">
        {/* İnfo Butonu - Sol Üst */}
        <button
          onClick={handleInfoClick}
          className={`p-2 rounded-lg transition-colors mr-3 ${
            infoPressed ? 'bg-red-600 text-white' : 'text-transparent hover:text-white hover:bg-red-600'
          }`}
          onMouseDown={() => setInfoPressed(true)}
          onMouseUp={() => setInfoPressed(false)}
          onMouseLeave={() => setInfoPressed(false)}
          onTouchStart={() => setInfoPressed(true)}
          onTouchEnd={() => setInfoPressed(false)}
        >
          <Info size={24} />
        </button>
        
        <button
          onClick={onBack}
          className="p-2 text-white hover:bg-red-600 rounded-lg transition-all duration-300 mr-3"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">Ayarlar</h1>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Genel Ayarlar */}
        <div className="p-4">
          <h2 className="text-white font-semibold mb-2 text-sm">Genel Ayarlar</h2>
          <div className="flex items-center space-x-2">
            {/* Saat İkonu - Tıklanabilir (Saniye Açık/Kapalı) */}
            <button
              onClick={toggleSeconds}
              className={`p-1.5 rounded-lg transition-colors ${
                showSeconds 
                  ? 'bg-white text-red-500' 
                  : 'bg-red-600 text-white border border-white'
              }`}
              title={`Saniye: ${showSeconds ? 'Açık' : 'Kapalı'}`}
            >
              <Clock size={16} />
            </button>

            {/* Bekleme Süresi */}
            <div className="flex items-center space-x-0.5">
              <input
                type="number"
                min="1"
                max="10"
                value={buttonDelay}
                onChange={(e) => setButtonDelay(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-7 h-7 text-center text-xs font-bold bg-white text-red-500 border border-white rounded focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            {/* Kaydet Butonu - Bekleme Süresi Yanında */}
            <button
              onClick={handleSave}
              className={`p-1.5 rounded-lg transition-colors border border-red-500 ${
                savePressed ? 'bg-red-500' : 'bg-white'
              }`}
              onMouseDown={() => setSavePressed(true)}
              onMouseUp={() => setSavePressed(false)}
              onMouseLeave={() => setSavePressed(false)}
              onTouchStart={() => setSavePressed(true)}
              onTouchEnd={() => setSavePressed(false)}
            >
              <Save 
                size={16} 
                className={`${savePressed ? 'text-white' : 'text-red-500'}`} 
              />
            </button>

            {/* Değiştir Butonu - Sadece İkon */}
            <button
              onClick={handleChange}
              className={`p-1.5 rounded-lg transition-colors border border-red-500 ${
                changePressed ? 'bg-red-500' : 'bg-white'
              }`}
              onMouseDown={() => setChangePressed(true)}
              onMouseUp={() => setChangePressed(false)}
              onMouseLeave={() => setChangePressed(false)}
              onTouchStart={() => setChangePressed(true)}
              onTouchEnd={() => setChangePressed(false)}
            >
              <Edit 
                size={16} 
                className={`${changePressed ? 'text-white' : 'text-red-500'}`} 
              />
            </button>
          </div>
        </div>

        {/* A ve B Kutuları */}
        <div className="px-4 pb-3">
          <h2 className="text-white font-semibold mb-2 text-sm">Sayaç Tuşları</h2>
          
          {/* A Kutusu */}
          <div className="mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium w-4 text-white">A:</span>
              <input
                type="text"
                value={aBoxIncrementKey}
                onChange={handleABoxIncrementKeyChange}
                placeholder="Q"
                maxLength={1}
                className={`w-8 h-6 text-center text-xs font-bold border rounded focus:outline-none focus:ring-1 uppercase transition-colors duration-300 ${
                  currentInputIndex === 0 && showKeyboardDialog
                    ? 'bg-blue-200 border-blue-400 text-blue-800 focus:ring-blue-400' 
                    : 'bg-white border-white text-red-500 focus:ring-white'
                }`}
              />
              <input
                type="text"
                value={aBoxDecrementKey}
                onChange={handleABoxDecrementKeyChange}
                placeholder="A"
                maxLength={1}
                className={`w-8 h-6 text-center text-xs font-bold border rounded focus:outline-none focus:ring-1 uppercase transition-colors duration-300 ${
                  currentInputIndex === 1 && showKeyboardDialog
                    ? 'bg-blue-200 border-blue-400 text-blue-800 focus:ring-blue-400' 
                    : 'bg-white border-white text-red-500 focus:ring-white'
                }`}
              />
              <button
                onClick={() => handleKeyboardClick('aIncrement')}
                className="p-1.5 bg-white text-red-500 rounded hover:bg-gray-100 transition-colors"
              >
                <Keyboard size={14} />
              </button>
            </div>
          </div>
          
          {/* B Kutusu */}
          <div className="mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium w-4 text-white">B:</span>
              <input
                type="text"
                value={bBoxIncrementKey}
                onChange={handleBBoxIncrementKeyChange}
                placeholder="P"
                maxLength={1}
                className={`w-8 h-6 text-center text-xs font-bold border rounded focus:outline-none focus:ring-1 uppercase transition-colors duration-300 ${
                  currentInputIndex === 2 && showKeyboardDialog
                    ? 'bg-green-200 border-green-400 text-green-800 focus:ring-green-400' 
                    : 'bg-white border-white text-red-500 focus:ring-white'
                }`}
              />
              <input
                type="text"
                value={bBoxDecrementKey}
                onChange={handleBBoxDecrementKeyChange}
                placeholder="L"
                maxLength={1}
                className={`w-8 h-6 text-center text-xs font-bold border rounded focus:outline-none focus:ring-1 uppercase transition-colors duration-300 ${
                  currentInputIndex === 3 && showKeyboardDialog
                    ? 'bg-green-200 border-green-400 text-green-800 focus:ring-green-400' 
                    : 'bg-white border-white text-red-500 focus:ring-white'
                }`}
              />
              <button
                onClick={() => handleKeyboardClick('bIncrement')}
                className="p-1.5 bg-white text-red-500 rounded hover:bg-gray-100 transition-colors"
              >
                <Keyboard size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Skorboard Ayarları */}
        <div className="px-4 pb-3">
          {/* Skorboard Ayarları Başlık */}
          <div className="mb-3">
            <h3 className="text-white text-xs font-medium">Skorboard Ayarları</h3>
          </div>
          
          {/* Skorboard Ayarları - Yan Yana */}
          <div className="flex space-x-3">
            {/* Sol Kolon */}
            <div className="flex-1">
              {/* Arka Plan Boyutları - Birleşik */}
              <div className="mb-3">
                <h3 className="text-white text-xs mb-1.5 flex items-center">
                  <Monitor size={14} className="mr-1" />
                  Arka Plan
                </h3>
                <div className="space-y-1.5">
                  {/* Sayaç Arka Plan */}
                  <div className="flex items-center space-x-1.5">
                    <div className="flex items-center space-x-0.5">
                      <span className="text-white text-xs">En:</span>
                      <input
                        type="number"
                        min="100"
                        max="2000"
                        value={counterBgWidth}
                        onChange={(e) => setCounterBgWidth(Math.max(100, Math.min(2000, parseInt(e.target.value) || 100)))}
                        className="w-12 h-6 text-center text-xs font-bold bg-white text-red-500 border border-white rounded focus:outline-none focus:ring-1 focus:ring-white"
                      />
                    </div>
                    <div className="flex items-center space-x-0.5">
                      <span className="text-white text-xs">Boy:</span>
                      <input
                        type="number"
                        min="100"
                        max="1000"
                        value={counterBgHeight}
                        onChange={(e) => setCounterBgHeight(Math.max(100, Math.min(1000, parseInt(e.target.value) || 100)))}
                        className="w-12 h-6 text-center text-xs font-bold bg-white text-red-500 border border-white rounded focus:outline-none focus:ring-1 focus:ring-white"
                      />
                    </div>
                  </div>

                  {/* Saat Arka Plan */}
                  <div className="flex items-center space-x-1.5">
                    <div className="flex items-center space-x-0.5">
                      <span className="text-white text-xs">En:</span>
                      <input
                        type="number"
                        min="50"
                        max="200"
                        value={clockBgWidth}
                        onChange={(e) => setClockBgWidth(Math.max(50, Math.min(200, parseInt(e.target.value) || 50)))}
                        className="w-12 h-6 text-center text-xs font-bold bg-white text-red-500 border border-white rounded focus:outline-none focus:ring-1 focus:ring-white"
                      />
                    </div>
                    <div className="flex items-center space-x-0.5">
                      <span className="text-white text-xs">Boy:</span>
                      <input
                        type="number"
                        min="50"
                        max="500"
                        value={clockBgHeight}
                        onChange={(e) => setClockBgHeight(Math.max(50, Math.min(500, parseInt(e.target.value) || 50)))}
                        className="w-12 h-6 text-center text-xs font-bold bg-white text-red-500 border border-white rounded focus:outline-none focus:ring-1 focus:ring-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Saat Font Boyutları */}
              <div className="mb-3">
                <h3 className="text-white text-xs mb-1.5 flex items-center">
                  <Type size={14} className="mr-1" />
                  Saat Font Boyutu
                </h3>
                <div className="flex items-center space-x-1.5">
                  <div className="flex items-center space-x-0.5">
                    <span className="text-white text-xs">En:</span>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={clockFontWidth}
                      onChange={(e) => setClockFontWidth(Math.max(5, Math.min(50, parseInt(e.target.value) || 5)))}
                      className="w-12 h-6 text-center text-xs font-bold bg-white text-red-500 border border-white rounded focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                  <div className="flex items-center space-x-0.5">
                    <span className="text-white text-xs">Boy:</span>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={clockFontHeight}
                      onChange={(e) => setClockFontHeight(Math.max(5, Math.min(50, parseInt(e.target.value) || 5)))}
                      className="w-12 h-6 text-center text-xs font-bold bg-white text-red-500 border border-white rounded focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sayaç Font Boyutları */}
              <div className="mb-3">
                <h3 className="text-white text-xs mb-1.5 flex items-center">
                  <Type size={14} className="mr-1" />
                  Sayaç Font Boyutu
                </h3>
                <div className="flex items-center space-x-1.5">
                  <div className="flex items-center space-x-0.5">
                    <span className="text-white text-xs">En:</span>
                    <input
                      type="number"
                      min="50"
                      max="800"
                      value={counterFontWidth}
                      onChange={(e) => setCounterFontWidth(Math.max(50, Math.min(800, parseInt(e.target.value) || 50)))}
                      className="w-12 h-6 text-center text-xs font-bold bg-white text-red-500 border border-white rounded focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                  <div className="flex items-center space-x-0.5">
                    <span className="text-white text-xs">Boy:</span>
                    <input
                      type="number"
                      min="50"
                      max="800"
                      value={counterFontHeight}
                      onChange={(e) => setCounterFontHeight(Math.max(50, Math.min(800, parseInt(e.target.value) || 50)))}
                      className="w-12 h-6 text-center text-xs font-bold bg-white text-red-500 border border-white rounded focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Renk Ayarları */}
          <div className="mb-3">
            <h3 className="text-white text-xs mb-1.5 flex items-center">
              🎨 Renk Ayarları
            </h3>
            
            {/* 4 Tikli Buton */}
            <div className="flex space-x-4 mb-2">
              <button
                onClick={() => {
                  setActiveColorSetting(activeColorSetting === 'clockBg' ? null : 'clockBg');
                  if (activeColorSetting !== 'clockBg') {
                    setShowColorPicker(true);
                  }
                }}
                className={`w-6 h-6 rounded text-xs transition-all duration-200 flex items-center justify-center ${
                  activeColorSetting === 'clockBg' 
                    ? 'bg-white text-red-500 ring-2 ring-white scale-110' 
                    : 'bg-red-600 text-white hover:scale-105'
                }`}
                title="Saat Arka Plan"
              >
                {activeColorSetting === 'clockBg' && (
                  <span style={{ fontSize: '16px', lineHeight: '16px' }}>✓</span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveColorSetting(activeColorSetting === 'clockNumber' ? null : 'clockNumber');
                  if (activeColorSetting !== 'clockNumber') {
                    setShowColorPicker(true);
                  }
                }}
                className={`w-6 h-6 rounded text-xs transition-all duration-200 flex items-center justify-center ${
                  activeColorSetting === 'clockNumber' 
                    ? 'bg-white text-red-500 ring-2 ring-white scale-110' 
                    : 'bg-red-600 text-white hover:scale-105'
                }`}
                title="Saat Sayısı"
              >
                {activeColorSetting === 'clockNumber' && (
                  <span style={{ fontSize: '16px', lineHeight: '16px' }}>✓</span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveColorSetting(activeColorSetting === 'counterText' ? null : 'counterText');
                  if (activeColorSetting !== 'counterText') {
                    setShowColorPicker(true);
                  }
                }}
                className={`w-6 h-6 rounded text-xs transition-all duration-200 flex items-center justify-center ${
                  activeColorSetting === 'counterText' 
                    ? 'bg-white text-red-500 ring-2 ring-white scale-110' 
                    : 'bg-red-600 text-white hover:scale-105'
                }`}
                title="Sayaç Yazı"
              >
                {activeColorSetting === 'counterText' && (
                  <span style={{ fontSize: '16px', lineHeight: '16px' }}>✓</span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveColorSetting(activeColorSetting === 'counterNumber' ? null : 'counterNumber');
                  if (activeColorSetting !== 'counterNumber') {
                    setShowColorPicker(true);
                  }
                }}
                className={`w-6 h-6 rounded text-xs transition-all duration-200 flex items-center justify-center ${
                  activeColorSetting === 'counterNumber' 
                    ? 'bg-white text-red-500 ring-2 ring-white scale-110' 
                    : 'bg-red-600 text-white hover:scale-105'
                }`}
                title="Sayaç Sayı"
              >
                {activeColorSetting === 'counterNumber' && (
                  <span style={{ fontSize: '16px', lineHeight: '16px' }}>✓</span>
                )}
              </button>
            </div>
            
            {/* Renk Bordları */}
            {activeColorSetting && (
              <div className="space-y-2">
                {/* Sol/Sağ Ok Butonları */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleColorSliderChange('left')}
                    className="w-6 h-6 bg-white text-red-500 rounded text-xs font-bold hover:bg-gray-100 transition-colors"
                  >
                    ←
                  </button>
                  
                  {/* Renk Bordları */}
                  <div className="flex-1 flex space-x-1">
                    {colorPalette.map((color, index) => {
                      let isActive = false;
                      switch (activeColorSetting) {
                        case 'clockBg':
                          isActive = index === clockBgColorIndex;
                          break;
                        case 'clockNumber':
                          isActive = index === clockNumberColorIndex;
                          break;
                        case 'counterText':
                          isActive = index === counterTextColorIndex;
                          break;
                        case 'counterNumber':
                          isActive = index === counterNumberColorIndex;
                          break;
                      }
                      
                      return (
                        <div
                          key={index}
                          className={`flex-1 h-4 rounded transition-all duration-200 ${
                            activeColorSetting === 'clockBg' || activeColorSetting === 'counterText'
                              ? color.bg
                              : `bg-white ${color.text}`
                          } ${
                            isActive 
                              ? 'ring-2 ring-white scale-110' 
                              : 'hover:scale-105'
                          } ${
                            color.bg === 'bg-white' ? 'border border-gray-300' : ''
                          }`}
                          title={color.name}
                        />
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handleColorSliderChange('right')}
                    className="w-6 h-6 bg-white text-red-500 rounded text-xs font-bold hover:bg-gray-100 transition-colors"
                  >
                    →
                  </button>
                </div>
                
                {/* Seçili Renk Göstergesi */}
                <div className="text-center">
                  <span className="text-white text-xs">
                    {activeColorSetting === 'clockBg' && colorPalette[clockBgColorIndex].name}
                    {activeColorSetting === 'clockNumber' && colorPalette[clockNumberColorIndex].name}
                    {activeColorSetting === 'counterText' && colorPalette[counterTextColorIndex].name}
                    {activeColorSetting === 'counterNumber' && colorPalette[counterNumberColorIndex].name}
                  </span>
                </div>
              </div>
            )}
            </div>
        </div>
      </div>

      {/* Notlar Dialog */}
      {showNotesDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FileText className="text-red-500" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Notlar</h2>
              </div>
              <button
                onClick={() => setShowNotesDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Notlarınızı buraya yazın..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <div className="flex space-x-2">
                {/* Kaydet Butonu */}
                <button
                  onClick={handleSaveNotes}
                  className={`p-3 rounded-lg transition-colors ${
                    editNotesPressed ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                  onMouseDown={() => setEditNotesPressed(true)}
                  onMouseUp={() => setEditNotesPressed(false)}
                  onMouseLeave={() => setEditNotesPressed(false)}
                  onTouchStart={() => setEditNotesPressed(true)}
                  onTouchEnd={() => setEditNotesPressed(false)}
                >
                  <Save size={20} />
                </button>
                {/* Sil Butonu */}
                <button
                  onClick={handleDeleteNotes}
                  className={`p-3 rounded-lg transition-colors ${
                    deleteNotesPressed ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                  onMouseDown={() => setDeleteNotesPressed(true)}
                  onMouseUp={() => setDeleteNotesPressed(false)}
                  onMouseLeave={() => setDeleteNotesPressed(false)}
                  onTouchStart={() => setDeleteNotesPressed(true)}
                  onTouchEnd={() => setDeleteNotesPressed(false)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Klavye Dialog */}
      {showKeyboardDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Keyboard className="text-red-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Tuş Seç</h2>
              </div>
              <button
                onClick={() => setShowKeyboardDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            {/* Seçilen tuş göstergesi */}
            <div className="mb-4 text-center">
              <div className={`rounded-lg p-4 ${
                (currentKeyInput === 'aIncrement' || currentKeyInput === 'aDecrement')
                  ? 'bg-blue-100 border-2 border-blue-300'
                  : 'bg-green-100 border-2 border-green-300'
              }`}>
                <div className="text-sm text-gray-600 mb-2">
                  {currentKeyInput === 'aIncrement' && 'A Kutusu - Artır'}
                  {currentKeyInput === 'aDecrement' && 'A Kutusu - Azalt'}
                  {currentKeyInput === 'bIncrement' && 'B Kutusu - Artır'}
                  {currentKeyInput === 'bDecrement' && 'B Kutusu - Azalt'}
                </div>
                <span className={`text-2xl font-bold ${
                  (currentKeyInput === 'aIncrement' || currentKeyInput === 'aDecrement')
                    ? 'text-blue-600'
                    : 'text-green-600'
                }`}>
                  {virtualKeyboard || '?'}
                </span>
              </div>
            </div>

            {/* Navigasyon Okları */}
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => handleNavigateInput('left')}
                className={`p-3 text-white rounded-lg transition-colors ${
                  (currentKeyInput === 'aIncrement' || currentKeyInput === 'aDecrement')
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                ←
              </button>
              <button
                onClick={() => handleNavigateInput('right')}
                className={`p-3 text-white rounded-lg transition-colors ${
                  (currentKeyInput === 'aIncrement' || currentKeyInput === 'aDecrement')
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                →
              </button>
            </div>

            {/* Sanal Klavye */}
            <div className="space-y-2">
              {/* Sayılar */}
              <div className="flex justify-center space-x-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleVirtualKeyPress(key)}
                    className={`w-8 h-8 text-sm font-bold rounded transition-colors ${
                      virtualKeyboard === key 
                        ? ((currentKeyInput === 'aIncrement' || currentKeyInput === 'aDecrement')
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white')
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* Harfler - Üst sıra */}
              <div className="flex justify-center space-x-1">
                {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleVirtualKeyPress(key)}
                    className={`w-8 h-8 text-sm font-bold rounded transition-colors ${
                      virtualKeyboard === key 
                        ? ((currentKeyInput === 'aIncrement' || currentKeyInput === 'aDecrement')
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white')
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* Harfler - Orta sıra */}
              <div className="flex justify-center space-x-1">
                {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleVirtualKeyPress(key)}
                    className={`w-8 h-8 text-sm font-bold rounded transition-colors ${
                      virtualKeyboard === key 
                        ? ((currentKeyInput === 'aIncrement' || currentKeyInput === 'aDecrement')
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white')
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* Harfler - Alt sıra */}
              <div className="flex justify-center space-x-1">
                {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleVirtualKeyPress(key)}
                    className={`w-8 h-8 text-sm font-bold rounded transition-colors ${
                      virtualKeyboard === key 
                        ? ((currentKeyInput === 'aIncrement' || currentKeyInput === 'aDecrement')
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white')
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Kaydet butonu - Sağ alt köşede */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleKeyboardSave}
                className="p-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renk Seçim Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Renk Seç</h2>
              <button
                onClick={() => setShowColorPicker(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            {/* Renk Paleti - 9x9 Grid */}
            <div className="flex-1 grid grid-cols-9 gap-2 p-4">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleColorSliderChange('right'); // Rengi değiştir
                    setShowColorPicker(false); // Modal'ı kapat
                  }}
                  className={`w-full h-full rounded-lg transition-all duration-200 hover:scale-110 ${
                    activeColorSetting === 'clockBg' || activeColorSetting === 'counterText'
                      ? color.bg
                      : `bg-white ${color.text}`
                  } ${
                    color.bg === 'bg-white' ? 'border-2 border-gray-300' : 'border-2 border-transparent'
                  }`}
                  title={color.name}
                />
              ))}
            </div>

            {/* Kapatma Butonu */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowColorPicker(false)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};