import React, { useState } from 'react';
import { Eye, EyeOff, Megaphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { login } = useAuth();
  const [phone, setPhone] = useState('0-532-214-87-98');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    const success = login(phone.trim(), password.trim());
    if (success) {
      onLogin();
    } else {
      setError('Numara veya şifre yanlış!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Hoşgeldiniz! 👋
          </h1>
          <p className="text-gray-300 text-lg">
            Efeler Park Halısaha
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <Megaphone className="text-pink-500 mr-2" size={28} />
          <h2 className="text-pink-500 font-bold text-xl">
            Duyurular
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-700 rounded-xl flex items-center overflow-hidden">
            <div className="px-3 py-4">
              <img 
                src="https://flagcdn.com/w40/tr.png" 
                alt="TR" 
                className="w-6 h-4"
              />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent text-white text-lg px-3 py-4 outline-none placeholder-gray-400"
              placeholder="0-532-214-87-98"
            />
          </div>

          <div className="bg-gray-700 rounded-xl flex items-center overflow-hidden">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent text-white text-lg px-4 py-4 outline-none placeholder-gray-400"
              placeholder="••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-4 py-4 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="text-left mb-6">
          <button className="text-gray-400 hover:text-white transition-colors">
            Şifremi Unuttum
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
        >
          Giriş Yap
        </button>

        <div className="text-center mt-6">
          <p className="text-red-400 text-sm">
            sürüm: 05.08.2025 04:09
          </p>
        </div>
      </div>
    </div>
  );
};