import React from 'react';
import { X, Star } from 'lucide-react';
import { User } from '../types';

interface PersonInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  hour: string;
  pitchIndex: number;
}

export const PersonInfoDialog: React.FC<PersonInfoDialogProps> = ({
  isOpen,
  onClose,
  user,
  hour,
  pitchIndex,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            {hour} | Saha: {pitchIndex + 1}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {user.firstName} {user.lastName} ({user.role})
          </h2>
          
          {user.rating > 0 && (
            <div className="flex items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < user.rating 
                      ? 'text-orange-500 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          <p className="text-gray-600 mb-4">{user.phone}</p>

          {user.notes && (
            <div className="border border-red-300 rounded-lg p-3 bg-red-50">
              <p className="text-gray-700 italic text-sm">
                {user.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};