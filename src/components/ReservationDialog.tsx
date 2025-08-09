import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Edit, UserPlus, Calendar, Clock, MapPin } from 'lucide-react';
import { User } from '../types';
import { useReservation } from '../contexts/ReservationContext';
import { formatTurkishDateTime } from '../utils/dateHelpers';

type ReservationStatus = 'beklet' | 'ön' | 'kesin';

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  hour: string;
  pitchIndex: number;
  reservationKey: string;
  hasReservation: boolean;
  onStartMove?: () => void;
  moveMode?: boolean;
}

export const ReservationDialog: React.FC<ReservationDialogProps> = ({
  isOpen,
  onClose,
  selectedDate,
  hour,
  pitchIndex,
  reservationKey,
  hasReservation,
  onStartMove,
  moveMode = false,
}) => {
  const { users, addUser, addReservation, updateReservation, deleteReservation, getReservation } = useReservation();
  
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  // New user form
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    notes: '',
    rating: 0,
  });

  useEffect(() => {
    if (hasReservation) {
      const reservation = getReservation(reservationKey);
      if (reservation) {
        setSelectedUserId(reservation.user.id);
        setSelectedStatus(reservation.status);
        setNotes(reservation.notes || '');
      }
    } else {
      setSelectedUserId('');
      setSelectedStatus('');
      setNotes('');
    }
  }, [hasReservation, reservationKey, getReservation]);

  const handleSave = () => {
    if (!selectedUserId || !selectedStatus) return;

    const user = users.find(u => u.id === selectedUserId);
    if (!user) return;

    const reservationData = {
      date: selectedDate.toISOString().substring(0, 10),
      hour,
      pitchIndex,
      user,
      status: selectedStatus as ReservationStatus,
      notes,
    };

    if (hasReservation) {
      updateReservation(reservationKey, reservationData);
    } else {
      addReservation(reservationData);
    }

    onClose();
  };

  const handleDelete = () => {
    deleteReservation(reservationKey);
    onClose();
  };

  const handleAddUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.phone) return;

    addUser({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: 'user',
      rating: newUser.rating,
      notes: newUser.notes,
    });

    setNewUser({
      firstName: '',
      lastName: '',
      phone: '',
      notes: '',
      rating: 0,
    });
    setShowAddUser(false);
  };

  const getStatusLabel = (status: ReservationStatus) => {
    switch (status) {
      case 'beklet': return 'Beklet';
      case 'ön': return 'Ön Rez.';
      case 'kesin': return 'Kesin Rez.';
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'beklet': return 'bg-yellow-500';
      case 'ön': return 'bg-orange-500';
      case 'kesin': return 'bg-green-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Rezervasyon Bilgileri</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="text-purple-500" size={16} />
            <span>{formatTurkishDateTime(selectedDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="text-red-500" size={16} />
            <span>Saha: {pitchIndex + 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-500" size={16} />
            <span>Saat: {hour}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Not"
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none"
              rows={2}
            />
            <button
              onClick={() => setShowAddUser(true)}
              className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <UserPlus size={20} />
            </button>
          </div>

          {showAddUser && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Yeni Kişi Ekle</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Ad"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Soyad"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
              <input
                type="tel"
                placeholder="Telefon"
                value={newUser.phone}
                onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded mb-3"
              />
              <input
                type="text"
                placeholder="Not"
                value={newUser.notes}
                onChange={(e) => setNewUser(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded mb-3"
              />
              <div className="flex items-center space-x-2 mb-3">
                <span>Yıldız:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewUser(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${star <= newUser.rating ? 'text-orange-500' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          <div className="border border-gray-400 rounded-lg max-h-48 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                  selectedUserId === user.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-blue-800">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {user.phone} ({user.role})
                    </div>
                    {user.rating > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < user.rating ? 'text-orange-500' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className={`p-1 rounded-full ${
                      selectedUserId === user.id ? 'text-green-500' : 'text-gray-400'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            {(['beklet', 'ön', 'kesin'] as ReservationStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  selectedStatus === status
                    ? `${getStatusColor(status)} text-white`
                    : `border-2 border-gray-300 text-gray-700 hover:bg-gray-50`
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <button
              onClick={handleSave}
              disabled={!selectedUserId || !selectedStatus}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedUserId && selectedStatus
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              <span>Kaydet</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              <Trash2 size={16} />
              <span>Sil</span>
            </button>

            {hasReservation && !moveMode && (
              <button
                onClick={() => {
                  onStartMove?.();
                  onClose();
                }}
                className="flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
              >
                <Edit size={16} />
              </button>
            )}

            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              <X size={16} />
              <span>İptal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};