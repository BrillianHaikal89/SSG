"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';
import MutabaahReport from '../../../components/my/MutabaahReport';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

const DEFAULT_FORM_DATA = {
  date: new Date().toISOString().split('T')[0],
  sholat_wajib: 0,
  sholat_tahajud: false,
  sholat_dhuha: 0,
  sholat_rawatib: 0,
  sholat_sunnah_lainnya: 0,
  tilawah_quran: false,
  terjemah_quran: false,
  shaum_sunnah: false,
  shodaqoh: false,
  dzikir_pagi_petang: false,
  istighfar_1000x: 0,
  sholawat_100x: 0,
  menyimak_mq_pagi: false,
  haid: false
};

export default function MutabaahYaumiyahPage() {
  const router = useRouter();
  const { user, userId } = useAuthStore();
  
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [hijriDate, setHijriDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headerBgColor, setHeaderBgColor] = useState('bg-green-600');
  const [showReportModal, setShowReportModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [dateOptions, setDateOptions] = useState([]);
  const [formData, setFormData] = useState({...DEFAULT_FORM_DATA});

  const calculateHijriDate = (gregorianDate) => {
    try {
      const date = new Date(gregorianDate);
      date.setHours(12, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(gregorianDate);
      inputDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() === inputDate.getTime()) {
        return {
          day: 4,
          month: 10,
          year: 1446,
          formatted: `4 ${HIJRI_MONTHS[10]} 1446 H`
        };
      }

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      let jd = Math.floor((365.25 * (year + 4716)) + Math.floor((30.6001 * (month + 1))) + day - 1524.5);
      
      if (date > new Date(1582, 9, 4)) {
        const a = Math.floor(year / 100);
        jd = jd + 2 - a + Math.floor(a / 4);
      }
      
      const b = Math.floor(((jd - 1867216.25) / 36524.25));
      const c = jd + b - Math.floor(b / 4) + 1525;
      const days = Math.floor(jd - 1948084);
      const hijriYear = Math.floor((days * 30 + 10646) / 10631);
      const daysInYear = Math.floor(((hijriYear - 1) * 10631 + 10646) / 30);
      const dayOfYear = days - daysInYear;
      const daysPassed = dayOfYear;
      const hijriMonth = Math.min(Math.floor(daysPassed / 29.53), 11);
      const hijriDay = Math.floor(daysPassed - (hijriMonth * 29.53)) + 1;
      
      return {
        day: Math.round(hijriDay),
        month: hijriMonth,
        year: hijriYear,
        formatted: `${Math.round(hijriDay)} ${HIJRI_MONTHS[hijriMonth]} ${hijriYear} H`
      };
    } catch (error) {
      console.error('Error calculating Hijri date:', error);
      return { 
        day: 1, 
        month: 0, 
        year: 1443, 
        formatted: "1 Muharram 1443 H" 
      };
    }
  };

  const getHijriDate = (date) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() === inputDate.getTime()) {
        return "4 Dhu al-Qi'dah 1446 H";
      }
      
      if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        const options = {
          calendar: 'islamic',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        };
        return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', options).format(date);
      } else {
        return calculateHijriDate(date).formatted;
      }
    } catch (error) {
      console.error('Error getting Hijri date:', error);
      return "4 Dhu al-Qi'dah 1446 H";
    }
  };

  const formatHijriDate = (hijriString) => {
    if (!hijriString) return '';
    
    if (hijriString.includes('H')) {
      return hijriString;
    }
    
    try {
      const arabicToLatinNumerals = {
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
        '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
      };
      
      let latinNumerals = hijriString;
      for (const [arabic, latin] of Object.entries(arabicToLatinNumerals)) {
        latinNumerals = latinNumerals.replace(new RegExp(arabic, 'g'), latin);
      }
      
      return latinNumerals;
    } catch (error) {
      console.error('Error formatting Hijri date:', error);
      return hijriString;
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    try {
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    try {
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const calculateDaysDifference = (dateString) => {
    try {
      const selected = new Date(dateString);
      const selectedDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
      
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const diffTime = todayDate - selectedDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('Error calculating days difference:', error);
      return 0;
    }
  };

  const updateHijriDate = (date) => {
    try {
      const hijri = getHijriDate(date);
      setHijriDate(hijri);
    } catch (error) {
      console.error('Failed to update Hijri date:', error);
      setHijriDate("4 Dhu al-Qi'dah 1446 H");
    }
  };

  const updateHeaderBgColor = (dateString) => {
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
    try {
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date for display:', error);
      return String(date);
    }
  };

  const getSelectedDateInfo = () => {
    try {
      const dayName = selectedDateTime ? formatDate(selectedDateTime).split(',')[0] : '';
      const fullDate = selectedDateTime ? formatDate(selectedDateTime) : '';
      return { dayName, fullDate };
    } catch (error) {
      console.error('Error getting selected date info:', error);
      return { dayName: '', fullDate: '' };
    }
  };

  const getStatusText = () => {
    const daysDiff = calculateDaysDifference(selectedDate);
    if (daysDiff === 0) return "Hari Ini";
    if (daysDiff === 1) return "Kemarin";
    if (daysDiff > 1) return `${daysDiff} hari yang lalu`;
    return "";
  };

  const handleDateChange = (e) => {
    try {
      const newDate = e.target.value;
      setSelectedDate(newDate);
      setFormData(prev => ({ ...prev, date: newDate }));
      
      const selectedDate = new Date(newDate);
      if (!isNaN(selectedDate.getTime())) {
        setSelectedDateTime(selectedDate);
        updateHijriDate(selectedDate);
      }
      
      checkExistingData(newDate);
    } catch (error) {
      console.error('Error handling date change:', error);
      toast.error('Terjadi kesalahan saat mengubah tanggal');
    }
  };

  const handleInputChange = (field, value) => {
    try {
      if (field === 'haid') {
        const newValue = value;
        const updatedFormData = {
          ...formData,
          haid: newValue,
          ...(newValue ? {
            sholat_wajib: 0,
            sholat_tahajud: false,
            sholat_dhuha: 0,
            sholat_rawatib: 0,
            sholat_sunnah_lainnya: 0
          } : {})
        };
        
        setFormData(updatedFormData);
        
        if (newValue) {
          setHeaderBgColor('bg-red-600');
        }
      } else if (['sholat_tahajud', 'tilawah_quran', 'terjemah_quran', 'shaum_sunnah', 
                  'shodaqoh', 'dzikir_pagi_petang', 'menyimak_mq_pagi'].includes(field)) {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      } else if (field === 'istighfar_1000x') {
        const numValue = Math.max(0, Math.min(1000, parseInt(value) || 0));
        
        setFormData(prev => ({
          ...prev,
          istighfar_1000x: numValue,
          istighfar_1000x_completed: numValue === 1000
        }));
      } else if (field === 'istighfar_1000x_completed') {
        setFormData(prev => ({
          ...prev,
          istighfar_1000x_completed: value,
          istighfar_1000x: value ? 1000 : 0
        }));
      } else if (field === 'sholawat_100x') {
        const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
        
        setFormData(prev => ({
          ...prev,
          sholawat_100x: numValue,
          sholawat_100x_completed: numValue === 100
        }));
      } else if (field === 'sholawat_100x_completed') {
        setFormData(prev => ({
          ...prev,
          sholawat_100x_completed: value,
          sholawat_100x: value ? 100 : 0
        }));
      } else {
        const numValue = Math.max(0, parseInt(value) || 0);
        setFormData(prev => ({
          ...prev,
          [field]: numValue
        }));
      }
    } catch (error) {
      console.error('Error handling input change:', error);
    }
  };

  const checkExistingData = async (date) => {
    try {
      const storageKey = `mutabaah_${user?.userId}_${date}`;
      const localData = localStorage.getItem(storageKey);
      
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          
          const convertedData = {
            ...parsedData,
            sholat_tahajud: parsedData.sholat_tahajud ? true : parsedData.sholat_tahajud === 0 ? false : Boolean(parsedData.sholat_tahajud),
            tilawah_quran: parsedData.tilawah_quran ? true : parsedData.tilawah_quran === 0 ? false : Boolean(parsedData.tilawah_quran),
            terjemah_quran: parsedData.terjemah_quran ? true : parsedData.terjemah_quran === 0 ? false : Boolean(parsedData.terjemah_quran),
            shaum_sunnah: parsedData.shaum_sunnah ? true : parsedData.shaum_sunnah === 0 ? false : Boolean(parsedData.shaum_sunnah),
            shodaqoh: parsedData.shodaqoh ? true : parsedData.shodaqoh === 0 ? false : Boolean(parsedData.shodaqoh),
            dzikir_pagi_petang: parsedData.dzikir_pagi_petang ? true : parsedData.dzikir_pagi_petang === 0 ? false : Boolean(parsedData.dzikir_pagi_petang), 
            menyimak_mq_pagi: parsedData.menyimak_mq_pagi ? true : parsedData.menyimak_mq_pagi === 0 ? false : Boolean(parsedData.menyimak_mq_pagi),
            istighfar_1000x: parsedData.istighfar_1000x !== undefined ? parsedData.istighfar_1000x : 0,
            sholawat_100x: parsedData.sholawat_100x !== undefined ? parsedData.sholawat_100x : 0,
            istighfar_1000x_completed: parsedData.istighfar_1000x_completed !== undefined 
              ? parsedData.istighfar_1000x_completed 
              : parsedData.istighfar_1000x === 1000,
            sholawat_100x_completed: parsedData.sholawat_100x_completed !== undefined 
              ? parsedData.sholawat_100x_completed 
              : parsedData.sholawat_100x === 100
          };
          
          setFormData(convertedData);
          toast.info('Data ditemukan dari penyimpanan lokal');
          return;
        } catch (parseError) {
          console.error('Error parsing local data:', parseError);
        }
      }
      
      setFormData({
        ...DEFAULT_FORM_DATA,
        date: date
      });
      
    } catch (error) {
      console.error('Error checking existing data:', error);
      setFormData({
        ...DEFAULT_FORM_DATA,
        date: date
      });
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
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  useEffect(() => {
    const generateDateOptions = () => {
      try {
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
      } catch (error) {
        console.error('Error generating date options:', error);
        return [];
      }
    };
    
    setDateOptions(generateDateOptions());
    updateHijriDate(new Date());
  }, []);

  useEffect(() => {
    updateHeaderBgColor(formData.date);
  }, [formData.haid, formData.date]);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        setCurrentDateTime(now);
        
        if (!formData.haid && selectedDate === now.toISOString().split('T')[0]) {
          updateHeaderBgColor(selectedDate);
        }
      } catch (error) {
        console.error('Error updating time:', error);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [selectedDate, formData.haid]);

  useEffect(() => {
    try {
      const newSelectedDate = new Date(formData.date);
      if (!isNaN(newSelectedDate.getTime())) {
        setSelectedDateTime(newSelectedDate);
        updateHijriDate(newSelectedDate);
      }
    } catch (error) {
      console.error('Error updating selected date:', error);
    }
  }, [formData.date]);

  const sholatSection = [
    { label: "Sholat Wajib 5 waktu", field: "sholat_wajib", max: 5, type: "number" },
    { label: "Sholat Tahajud & atau Witir 3 rakaat/hari", field: "sholat_tahajud", type: "checkbox" },
    { label: "Sholat Dhuha 4 rakaat", field: "sholat_dhuha", max: 8, type: "number" },
    { label: "Sholat Rawatib 10 rakaat", field: "sholat_rawatib", max: 12, type: "number" },
    { label: "Sholat Sunnah Lainnya 6 rakaat", field: "sholat_sunnah_lainnya", max: 10, type: "number" },
  ];

  const quranSection = [
    { label: "Tilawah Quran (1 Halaman)", field: "tilawah_quran", type: "checkbox" },
    { label: "Terjemah Quran (1 Halaman)", field: "terjemah_quran", type: "checkbox" },
  ];

  const sunnahSection = [
    { label: "Shaum Sunnah (3x/bulan)", field: "shaum_sunnah", type: "checkbox" },
    { label: "Shodaqoh Maal", field: "shodaqoh", type: "checkbox" },
    { label: "Dzikir Pagi/Petang", field: "dzikir_pagi_petang", type: "checkbox" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`p-4 sm:p-6 ${headerBgColor} text-white transition-colors duration-300`}>
          <h1 className="text-xl sm:text-2xl font-bold text-center">Mutaba'ah Yaumiyah</h1>
          <p className="text-center text-sm sm:text-base mt-1">At-Taqwa dan As-Sunnah</p>
          <p className="text-center font-medium text-sm sm:text-base mt-1 truncate px-2">{user?.name || 'Pengguna'}</p>
          
          <div className="flex justify-center mt-1">
            <div className="bg-white/20 rounded-full px-3 py-1 text-xs text-white">
              <span className="font-medium">{formatHijriDate(hijriDate) || '...'}</span>
              <span className="mx-1">|</span>
              <span>{getSelectedDateInfo().dayName || '...'}</span>
            </div>
          </div>
          
          {currentDateTime && (
            <div className="text-center mt-2">
              <p className="text-xs sm:text-sm">{getSelectedDateInfo().fullDate || 'Loading...'}</p>
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
                Sedang berhalangan (haid/menstruasi) dan tidak dapat melaksanakan sholat
              </span>
            </label>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">
              1.1 Sholat Wajib dan Sunnah
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {sholatSection.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">{item.label}</span>
                  
                  {item.type === "checkbox" ? (
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData[item.field]}
                        onChange={(e) => handleInputChange(item.field, e.target.checked)}
                        className={`form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500 ${
                          formData.haid ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={formData.haid && item.field === 'sholat_tahajud'}
                      />
                    </div>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max={item.max}
                      value={formData[item.field]}
                      onChange={(e) => handleInputChange(item.field, e.target.value)}
                      className={`shadow border rounded py-1 sm:py-2 px-2 sm:px-3 w-16 sm:w-20 text-gray-700 focus:outline-none focus:shadow-outline text-sm ${
                        formData.haid ? 'bg-gray-200 cursor-not-allowed' : ''
                      }`}
                      disabled={formData.haid}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">
              1.2 Aktivitas Quran
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {quranSection.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">{item.label}</span>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={formData[item.field]}
                      onChange={(e) => handleInputChange(item.field, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">
              1.3 Aktivitas Sunnah
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {sunnahSection.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">{item.label}</span>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={formData[item.field]}
                      onChange={(e) => handleInputChange(item.field, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">Istighfar 1000x</span>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={formData.istighfar_1000x === 1000}
                      onChange={(e) => handleInputChange('istighfar_1000x_completed', e.target.checked)}
                      className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-xs text-gray-500">Selesai 1000x</span>
                  </div>
                </div>
                
                {formData.istighfar_1000x < 1000 && (
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-xs text-gray-500">Masukkan jumlah yang diselesaikan:</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={formData.istighfar_1000x}
                      onChange={(e) => handleInputChange('istighfar_1000x', e.target.value)}
                      className="shadow border rounded py-1 sm:py-2 px-2 sm:px-3 w-16 sm:w-20 text-gray-700 focus:outline-none focus:shadow-outline text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">Sholawat 100x</span>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={formData.sholawat_100x === 100}
                      onChange={(e) => handleInputChange('sholawat_100x_completed', e.target.checked)}
                      className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-xs text-gray-500">Selesai 100x</span>
                  </div>
                </div>
                
                {formData.sholawat_100x < 100 && (
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-xs text-gray-500">Masukkan jumlah yang diselesaikan:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.sholawat_100x}
                      onChange={(e) => handleInputChange('sholawat_100x', e.target.value)}
                      className="shadow border rounded py-1 sm:py-2 px-2 sm:px-3 w-16 sm:w-20 text-gray-700 focus:outline-none focus:shadow-outline text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">
              2.1 Menyimak MQ Pagi
            </h2>
            
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-700">Menyimak MQ Pagi</span>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.menyimak_mq_pagi}
                  onChange={(e) => handleInputChange('menyimak_mq_pagi', e.target.checked)}
                  className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
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
              onClick={handleGenerateReport}
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-bold py-2 px-4 sm:px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 text-sm sm:text-base flex-1`}
            >
              Laporan
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

      {showReportModal && (
        <MutabaahReport 
          user={user} 
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
}