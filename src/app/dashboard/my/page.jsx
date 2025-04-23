"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';

export default function MutabahYaumiyahPage() {
  const router = useRouter();
  const { user, userId } = useAuthStore();
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // State for selected date
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Generate past 7 days dates for selection
  const [dateOptions, setDateOptions] = useState([]);

  useEffect(() => {
    // Generate array of past 7 days + today
    const generateDateOptions = () => {
      const options = [];
      const currentDate = new Date();
      
      // Add today
      options.push({
        value: currentDate.toISOString().split('T')[0],
        label: formatDateForDisplay(currentDate)
      });
      
      // Add past 7 days
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
    menyimak_mq_pagi: 0
  });

  // Update current date and time only on client-side
  useEffect(() => {
    // Only run on client-side
    setCurrentDateTime(new Date());

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
    
    // Check for existing data
    checkExistingData(newDate);
  };
  
  // Function to check if data exists for selected date
  const checkExistingData = async (date) => {
    try {
      // First check localStorage for offline data
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
      
      // Reset form but keep the date
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
        menyimak_mq_pagi: 0
      });
      
    } catch (error) {
      console.error('Error checking existing data:', error);
      
      // In case of error, reset the form but keep the date
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
        menyimak_mq_pagi: 0
      });
    }
  };

  const handleInputChange = (field, value) => {
    // Convert input to number and ensure it's not negative
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleRouteBack = () => {
    router.push('/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return; // Prevent multiple submissions
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to localStorage as a fallback
      const storageKey = `mutabaah_${user?.userId}_${formData.date}`;
      localStorage.setItem(storageKey, JSON.stringify(formData));
      
      try {
        const requestData = {
          user_id: user?.userId,
          ...formData
        };
        
        console.log("Submitting data:", requestData);
        
        const response = await fetch('http://localhost:3333/api/users/input-my', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          credentials: 'include',
        });

        console.log("Response status:", response.status);
        
        let result = {};
        let responseText = '';
        
        try {
          // First try to get the response as text
          responseText = await response.text();
          console.log("Raw response:", responseText);
          
          // Try to parse as JSON if possible
          if (responseText) {
            try {
              result = JSON.parse(responseText);
              console.log("Parsed JSON result:", result);
            } catch (jsonError) {
              console.error("Failed to parse JSON:", jsonError);
              // Keep the result as empty object, text is already saved
            }
          }
        } catch (responseError) {
          console.error("Error getting response:", responseError);
        }
        
        if (!response.ok) {
          // If we get here, there was an HTTP error
          console.error('Server returned error status:', response.status);
          
          // Try to get a message from the response
          let errorMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
          
          if (result && typeof result === 'object') {
            if (result.message) {
              errorMessage = result.message;
            } else if (result.error) {
              errorMessage = result.error;
            }
          }
          
          // Check if it's a database error
          if (responseText.includes('ECONNREFUSED') || 
              responseText.includes('database') ||
              response.status === 500) {
            toast.success('Data telah disimpan di browser Anda. Server database sedang tidak tersedia.');
            router.push('/dashboard');
            return;
          }
          
          throw new Error(errorMessage);
        }
        
        // Success path
        toast.success(result.message || 'Data Mutabaah Yaumiyah berhasil disimpan!');
        router.push('/dashboard');
        
      } catch (apiError) {
        // Handle network errors or failed requests
        console.error('API call error:', apiError);
        
        if (apiError.message.includes('Failed to fetch') || 
            apiError.message.includes('NetworkError') ||
            apiError.message.includes('Network request failed')) {
          toast.warning('Server tidak tersedia. Data telah disimpan sementara di browser Anda.');
          router.push('/dashboard');
          return;
        }
        
        throw apiError; // Re-throw for the outer catch block
      }
      
    } catch (error) {
      console.error('Complete error:', error);
      toast.error(error.message || 'Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time with leading zeros
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
  };

  // Format date in Indonesian locale
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Mutaba'ah Yaumiyah</h1>
          <p className="text-center mt-2">At-Taqwa dan As-Sunnah</p>
          <p className="text-center font-medium mt-1">{user?.name || 'Pengguna'}</p>
          
          {/* Real-time Date and Time */}
          {currentDateTime && (
            <div className="text-center mt-2">
              <p className="text-sm">{formatDate(currentDateTime)}</p>
              <p className="text-lg font-bold">{formatTime(currentDateTime)}</p>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Pilih Tanggal Input:
            </label>
            <select
              value={selectedDate}
              onChange={handleDateChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {dateOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 italic mt-1">
              Pilih tanggal untuk mengisi data Mutaba'ah Yaumiyah yang terlewat (hingga 7 hari ke belakang).
            </p>
          </div>

          {/* Bagian 1.1 - Sholat Wajib dan Sunnah */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-green-700 border-b pb-2">1.1 Sholat Wajib dan Sunnah</h2>
            
            <div className="space-y-4">
              {[
                { label: "Sholat Wajib 5 waktu", field: "sholat_wajib", max: 5 },
                { label: "Sholat Tahajud & atau Witir 3 rakaat/hari", field: "sholat_tahajud", max: 10 },
                { label: "Sholat Dhuha 4 rakaat", field: "sholat_dhuha", max: 8 },
                { label: "Sholat Rawatib 10 rakaat", field: "sholat_rawatib", max: 12 },
                { label: "Sholat Sunnah Lainnya 6 rakaat", field: "sholat_sunnah_lainnya", max: 10 },
                { label: "Tilawah Quran (halaman)", field: "tilawah_quran", max: 100 },
                { label: "Terjemah Quran (halaman)", field: "terjemah_quran", max: 50 },
                { label: "Shaum Sunnah (hari)", field: "shaum_sunnah", max: 5 },
                { label: "Shadaqah Masjid (kali)", field: "shodaqoh", max: 5 },
                { label: "Dzikir Pagi/Petang (kali)", field: "dzikir_pagi_petang", max: 2 },
                { label: "Istighfar (x100)", field: "istighfar_1000x", max: 15 },
                { label: "Sholawat (x100)", field: "sholawat_100x", max: 15 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item.label}</span>
                  <input
                    type="number"
                    min="0"
                    max={item.max}
                    value={formData[item.field]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    className="shadow border rounded py-2 px-3 w-20 text-gray-700 focus:outline-none focus:shadow-outline"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bagian 2.1 - Menyimak MQ Pagi */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-green-700 border-b pb-2">2.1 Menyimak MQ Pagi</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Aktifitas</h3>
                <p className="text-gray-600">Menyimak MQ Pagi</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <span className="font-medium text-gray-700">Jumlah</span>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={formData.menyimak_mq_pagi}
                  onChange={(e) => handleInputChange('menyimak_mq_pagi', e.target.value)}
                  className="shadow border rounded py-2 px-3 w-20 text-gray-700 focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 mr-8`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>

            <button
              onClick={handleRouteBack}
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              } text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150`}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}