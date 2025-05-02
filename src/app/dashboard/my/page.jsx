"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MutabahYaumiyahPage() {
  const router = useRouter();
  const { user, userId } = useAuthStore();
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headerBgColor, setHeaderBgColor] = useState('bg-green-600');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [dateOptions, setDateOptions] = useState([]);

  useEffect(() => {
    const generateDateOptions = () => {
      const options = [];
      const currentDate = new Date();
      
      options.push({
        value: currentDate.toISOString().split('T')[0],
        label: formatDateForDisplay(currentDate)
      });
      
      for (let i = 1; i <= 7; i++) {
        const pastDate = new Date();
        pastDate.setDate(currentDate.getDate() - i);
        options.push({
          value: pastDate.toISOString().split('T')[0],
          label: formatDateForDisplay(pastDate)
        });
      }
      
      return options;
    };
    
    setDateOptions(generateDateOptions());
  }, []);

  const calculateDaysDifference = (dateString) => {
    const selected = new Date(dateString);
    selected.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today - selected;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const updateHeaderBgColor = (dateString) => {
    // Always check haid status first - if true, force red and prevent any other color
    if (formData.haid) {
      setHeaderBgColor('bg-red-600');
      return;
    }
    
    const daysDiff = calculateDaysDifference(dateString);
    
    if (daysDiff === 0) {
      setHeaderBgColor('bg-green-600');
    } else if (daysDiff <= 2) {
      setHeaderBgColor('bg-orange-500');
    } else {
      setHeaderBgColor('bg-amber-700');
    }
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const [formData, setFormData] = useState({
    date: today,
    sholat_wajib: 0,
    sholat_tahajud: 0,
    sholat_dhuha: 0,
    sholat_rawatib: 0,
    sholat_sunnah_lainnya: 0,
    tilawah_quran: 0,
    terjemah_quran: 0,
    shaum_sunnah: 0,
    shodaqoh: 0,
    dzikir_pagi_petang: 0,
    istighfar_1000x: 0,
    sholawat_100x: 0,
    menyimak_mq_pagi: 0,
    haid: false
  });

  // Update color whenever haid status or date changes
  useEffect(() => {
    updateHeaderBgColor(formData.date);
  }, [formData.haid, formData.date]);

  // Timer for updating clock - carefully managed to not interfere with header color
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(now);
      
      // Only update color if selected date is today AND haid is false
      if (!formData.haid && selectedDate === now.toISOString().split('T')[0]) {
        updateHeaderBgColor(selectedDate);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [selectedDate, formData.haid]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setFormData(prev => ({ ...prev, date: newDate }));
    checkExistingData(newDate);
  };
  
  const checkExistingData = async (date) => {
    try {
      const storageKey = `mutabaah_${user?.userId}_${date}`;
      const localData = localStorage.getItem(storageKey);
      
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          setFormData(parsedData);
          toast.info('Data ditemukan dari penyimpanan lokal');
          return;
        } catch (parseError) {
          console.error('Error parsing local data:', parseError);
        }
      }
      
      setFormData({
        date: date,
        sholat_wajib: 0,
        sholat_tahajud: 0,
        sholat_dhuha: 0,
        sholat_rawatib: 0,
        sholat_sunnah_lainnya: 0,
        tilawah_quran: 0,
        terjemah_quran: 0,
        shaum_sunnah: 0,
        shodaqoh: 0,
        dzikir_pagi_petang: 0,
        istighfar_1000x: 0,
        sholawat_100x: 0,
        menyimak_mq_pagi: 0,
        haid: false
      });
      
    } catch (error) {
      console.error('Error checking existing data:', error);
      setFormData({
        date: date,
        sholat_wajib: 0,
        sholat_tahajud: 0,
        sholat_dhuha: 0,
        sholat_rawatib: 0,
        sholat_sunnah_lainnya: 0,
        tilawah_quran: 0,
        terjemah_quran: 0,
        shaum_sunnah: 0,
        shodaqoh: 0,
        dzikir_pagi_petang: 0,
        istighfar_1000x: 0,
        sholawat_100x: 0,
        menyimak_mq_pagi: 0,
        haid: false
      });
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'haid') {
      const newValue = value;
      setFormData(prev => ({
        ...prev,
        [field]: newValue
      }));
      
      // Immediately force red color when checked
      // No need to update when unchecked as useEffect will handle it
      if (newValue) {
        setHeaderBgColor('bg-red-600');
      }
    } else {
      const numValue = Math.max(0, parseInt(value) || 0);
      setFormData(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleRouteBack = () => {
    router.push('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const storageKey = `mutabaah_${user?.userId}_${formData.date}`;
      localStorage.setItem(storageKey, JSON.stringify(formData));
      
      try {
        const response = await fetch(`${API_URL}/users/input-my`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user?.userId, ...formData }),
          credentials: 'include',
        });

        const responseText = await response.text();
        let result = {};
        
        if (responseText) {
          try {
            result = JSON.parse(responseText);
          } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
          }
        }
        
        if (!response.ok) {
          let errorMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
          
          if (result && typeof result === 'object') {
            errorMessage = result.message || result.error || errorMessage;
          }
          
          if (responseText.includes('ECONNREFUSED') || response.status === 500) {
            toast.success('Data telah disimpan di browser Anda. Server database sedang tidak tersedia.');
            router.push('/dashboard');
            return;
          }
          
          throw new Error(errorMessage);
        }
        
        toast.success(result.message || 'Data Mutabaah Yaumiyah berhasil disimpan!');
        router.push('/dashboard');
        
      } catch (apiError) {
        if (apiError.message.includes('Failed to fetch')) {
          toast.warning('Server tidak tersedia. Data telah disimpan sementara di browser Anda.');
          router.push('/dashboard');
          return;
        }
        toast.error(apiError.message || 'Gagal menyimpan data. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTextColorClass = () => 'text-white';

  const getStatusText = () => {
    const daysDiff = calculateDaysDifference(selectedDate);
    if (daysDiff === 0) return "Hari Ini";
    if (daysDiff === 1) return "Kemarin";
    if (daysDiff > 1) return `${daysDiff} hari yang lalu`;
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`p-4 sm:p-6 ${getTextColorClass()} ${headerBgColor}`}>
          <h1 className="text-xl sm:text-2xl font-bold text-center">Mutaba'ah Yaumiyah</h1>
          <p className="text-center text-sm sm:text-base mt-1">At-Taqwa dan As-Sunnah</p>
          <p className="text-center font-medium text-sm sm:text-base mt-1 truncate px-2">{user?.name || 'Pengguna'}</p>
          
          {currentDateTime && (
            <div className="text-center mt-2">
              <p className="text-xs sm:text-sm">{formatDate(currentDateTime)}</p>
              <p className="text-base sm:text-lg font-bold">{formatTime(currentDateTime)}</p>
              {calculateDaysDifference(selectedDate) > 0 && (
                <p className="text-white text-xs sm:text-sm font-medium mt-1">
                  {getStatusText()}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Pilih Tanggal Input:
            </label>
            <select
              value={selectedDate}
              onChange={handleDateChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
            >
              {dateOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs sm:text-sm text-gray-500 italic mt-1">
              Pilih tanggal untuk mengisi data Mutaba'ah Yaumiyah yang terlewat (hingga 7 hari ke belakang).
            </p>
          </div>

          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.haid}
                onChange={(e) => handleInputChange('haid', e.target.checked)}
                className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-red-600 rounded focus:ring-red-500" 
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-700">
                Sedang berhalangan (haid/menstruasi) dan tidak dapat melaksanakan sholat wajib dan sunnah
              </span>
            </label>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">1.1 Sholat Wajib dan Sunnah</h2>
            
            <div className="space-y-3 sm:space-y-4">
              {[
                { label: "Sholat Wajib 5 waktu", field: "sholat_wajib", max: 5 },
                { label: "Sholat Tahajud & atau Witir 3 rakaat/hari", field: "sholat_tahajud", max: 10 },
                { label: "Sholat Dhuha 4 rakaat", field: "sholat_dhuha", max: 8 },
                { label: "Sholat Rawatib 10 rakaat", field: "sholat_rawatib", max: 12 },
                { label: "Sholat Sunnah Lainnya 6 rakaat", field: "sholat_sunnah_lainnya", max: 10 },
                { label: "Tilawah Quran (halaman)", field: "tilawah_quran", max: 100 },
                { label: "Terjemah Quran (halaman)", field: "terjemah_quran", max: 50 },
                { label: "Shaum Sunnah (hari)", field: "shaum_sunnah", max: 5 },
                { label: "Shodaqoh (kali)", field: "shodaqoh", max: 5 },
                { label: "Dzikir Pagi/Petang (kali)", field: "dzikir_pagi_petang", max: 2 },
                { label: "Istighfar (x100)", field: "istighfar_1000x", max: 15 },
                { label: "Sholawat (x100)", field: "sholawat_100x", max: 15 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">{item.label}</span>
                  <input
                    type="number"
                    min="0"
                    max={item.max}
                    value={formData[item.field]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    className="shadow border rounded py-1 sm:py-2 px-2 sm:px-3 w-16 sm:w-20 text-gray-700 focus:outline-none focus:shadow-outline text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">2.1 Menyimak MQ Pagi</h2>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="font-medium text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">Aktifitas</h3>
                <p className="text-xs sm:text-sm text-gray-600">Menyimak MQ Pagi</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg flex items-center justify-between">
                <span className="font-medium text-xs sm:text-sm text-gray-700">Jumlah</span>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={formData.menyimak_mq_pagi}
                  onChange={(e) => handleInputChange('menyimak_mq_pagi', e.target.value)}
                  className="shadow border rounded py-1 sm:py-2 px-2 sm:px-3 w-16 sm:w-20 text-gray-700 focus:outline-none focus:shadow-outline text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-3 mt-6">
            <button
              onClick={handleRouteBack}
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              } text-white font-bold py-2 px-4 sm:px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 text-sm sm:text-base flex-1`}
            >
              Kembali
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } text-white font-bold py-2 px-4 sm:px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 text-sm sm:text-base flex-1`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}