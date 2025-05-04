"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';
// Import the report component
import MutabaahReport from '../../../components/my/MutabaahReport';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Hijri month names
const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

// Default form data structure
const DEFAULT_FORM_DATA = {
  date: new Date().toISOString().split('T')[0],
  sholat_wajib: 0,
  sholat_tahajud: false, // Changed to boolean for checkbox
  sholat_dhuha: 0,
  sholat_rawatib: 0,
  sholat_sunnah_lainnya: 0,
  tilawah_quran: false, // Changed to boolean for checkbox (1 Halaman)
  terjemah_quran: false, // Changed to boolean for checkbox (1 Halaman)
  shaum_sunnah: false, // Changed to boolean for checkbox (3x/bulan)
  shodaqoh: false, // Changed to boolean for checkbox
  dzikir_pagi_petang: false, // Changed to boolean for checkbox
  istighfar_1000x: 0,
  sholawat_100x: 0,
  menyimak_mq_pagi: false, // Changed to boolean for checkbox
  haid: false
};

export default function MutabaahYaumiyahPage() {
  const router = useRouter();
  const { user, userId } = useAuthStore();
  
  // Date and time states
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [hijriDate, setHijriDate] = useState("");
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headerBgColor, setHeaderBgColor] = useState('bg-green-600');
  const [showReportModal, setShowReportModal] = useState(false);

  // Form data
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [dateOptions, setDateOptions] = useState([]);
  const [formData, setFormData] = useState({...DEFAULT_FORM_DATA});

  // Calculate Hijri date from Gregorian date
  const calculateHijriDate = (gregorianDate) => {
    try {
      const date = new Date(gregorianDate);
      
      // Julian day calculation
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      // Simplified and more accurate Hijri calculation
      const jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
                Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
                Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
                day - 32075;
      
      // Convert to Islamic date
      const shift1 = 8.01/60;
      const z = jd + shift1;
      const a = Math.floor((z + 0.5) * 0.97253);
      const d = Math.floor((a - 0.5) / 354);
      const e = z + 0.5 - 354 * d - Math.floor(d / 30) * d;
      const g = Math.floor(e * 30.6);
      const h = e - Math.floor(g * 0.0328);
      
      const islamicMonth = g;
      const islamicDay = Math.floor(h + 0.5);
      const islamicYear = d + 16;
      
      return {
        day: islamicDay,
        month: islamicMonth,
        year: islamicYear,
        formatted: `${islamicDay} ${HIJRI_MONTHS[islamicMonth]} ${islamicYear} H`
      };
    } catch (error) {
      console.error('Error calculating Hijri date:', error);
      return { 
        day: 1, 
        month: 0, 
        year: 1446, 
        formatted: "1 Muharram 1446 H" 
      };
    }
  };

  // Get Hijri date from Gregorian date using browser API or fallback
  const getHijriDate = (date) => {
    try {
      // Try using Intl.DateTimeFormat first if browser supports it
      if (typeof Intl !== 'undefined' && 
          Intl.DateTimeFormat && 
          Intl.DateTimeFormat.supportedLocalesOf(['ar-SA-u-ca-islamic']).length > 0) {
        
        const options = {
          calendar: 'islamic',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        };
        
        return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', options).format(date);
      } else {
        // Fallback to our algorithm
        return calculateHijriDate(date).formatted;
      }
    } catch (error) {
      console.error('Error getting Hijri date:', error);
      return calculateHijriDate(date).formatted;
    }
  };

  // Format Hijri date for display - Latin numerals only
  const formatHijriDate = (hijriString) => {
    if (!hijriString) return '';
    
    // If it's already a formatted string from our calculation function
    if (hijriString.includes('H')) {
      return hijriString;
    }
    
    try {
      // Convert Arabic numerals to Latin
      const arabicToLatinNumerals = {
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
        '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
      };
      
      let latinNumerals = hijriString;
      for (const [arabic, latin] of Object.entries(arabicToLatinNumerals)) {
        latinNumerals = latinNumerals.replace(new RegExp(arabic, 'g'), latin);
      }
      
      // Replace Arabic text with English
      latinNumerals = latinNumerals.replace(/ذو القعدة/, "Dhu al-Qi'dah");
      latinNumerals = latinNumerals.replace(/هـ/, "H");
      
      return latinNumerals;
    } catch (error) {
      console.error('Error formatting Hijri date:', error);
      return hijriString; // Return original if formatting fails
    }
  };

  // Format date for display in UI
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

  // Format time for display in UI
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

  // Check if a date string is today
  const isToday = (dateString) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return dateString === today;
    } catch (error) {
      console.error('Error checking if date is today:', error);
      return false;
    }
  };

  // Check if a date string is yesterday
  const isYesterday = (dateString) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toISOString().split('T')[0];
      return dateString === yesterdayFormatted;
    } catch (error) {
      console.error('Error checking if date is yesterday:', error);
      return false;
    }
  };

  // Calculate days difference between selected date and today
  const calculateDaysDifference = (dateString) => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const todayFormatted = today.toISOString().split('T')[0];
      
      // Direct check for today
      if (dateString === todayFormatted) {
        return 0; // It's today
      }
      
      // Direct check for yesterday
      if (isYesterday(dateString)) {
        return -1; // It's exactly yesterday
      }
      
      // For dates before yesterday, calculate exact difference
      // Create dates at noon to avoid timezone issues
      const selected = new Date(dateString + 'T12:00:00');
      const todayNoon = new Date(todayFormatted + 'T12:00:00');
      
      const diffTime = selected.getTime() - todayNoon.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('Error calculating days difference:', error);
      return 0;
    }
  };

  // Update Hijri date state safely
  const updateHijriDate = (date) => {
    try {
      const hijri = getHijriDate(date);
      setHijriDate(hijri);
    } catch (error) {
      console.error('Failed to update Hijri date:', error);
      setHijriDate(""); // Set empty string for other dates on error
    }
  };

  // Update header background color based on date difference and haid status
  const updateHeaderBgColor = (dateString) => {
    // If menstruation status is active, always show red header
    if (formData.haid) {
      setHeaderBgColor('bg-red-600');
      return;
    }
    
    // Check if it's today
    if (isToday(dateString)) {
      setHeaderBgColor('bg-green-600'); // Today is always green
      return;
    }
    
    // Check if it's yesterday
    if (isYesterday(dateString)) {
      setHeaderBgColor('bg-orange-500'); // Yesterday is orange (1 day late)
      return;
    }
    
    // For other dates, calculate day difference
    const daysDiff = calculateDaysDifference(dateString);
    
    if (daysDiff > 0) {
      // Future date (green)
      setHeaderBgColor('bg-green-600');
    } else if (daysDiff === -2) {
      // 2 days late (orange)
      setHeaderBgColor('bg-orange-500');
    } else {
      // 3 or more days late (brown)
      setHeaderBgColor('bg-amber-700');
    }
  };

  // Format date for display in dropdown
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

  // Get selected date info for display
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

  // Get text to display date status
  const getStatusText = () => {
    // Direct check for today
    if (isToday(selectedDate)) {
      return "Tepat Waktu";
    }
    
    // Direct check for yesterday
    if (isYesterday(selectedDate)) {
      return "Terlambat 1 hari";
    }
    
    // Get days difference
    const daysDiff = calculateDaysDifference(selectedDate);
    
    // Future date
    if (daysDiff > 0) {
      return `${daysDiff} hari ke depan`;
    }
    
    // Past date (more than yesterday)
    const lateDays = Math.abs(daysDiff);
    return `Terlambat ${lateDays} hari`;
  };

  // Handle date selection change
  const handleDateChange = (e) => {
    try {
      const newDate = e.target.value;
      setSelectedDate(newDate);
      setFormData(prev => ({ ...prev, date: newDate }));
      
      // Update selected date time for Hijri date calculation
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

  // Handle form input changes
  const handleInputChange = (field, value) => {
    try {
      if (field === 'haid') {
        const newValue = value;
        const updatedFormData = {
          ...formData,
          haid: newValue,
          ...(newValue ? {
            sholat_wajib: 0,
            sholat_tahajud: false, // Updated to boolean for checkbox
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
        // Handle checkbox fields (boolean values)
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      } else {
        // Handle number fields
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

  // Check for existing data for the selected date
  const checkExistingData = async (date) => {
    try {
      const storageKey = `mutabaah_${user?.userId}_${date}`;
      const localData = localStorage.getItem(storageKey);
      
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          
          // Handle legacy data format (convert numbers to booleans for checkbox fields)
          const convertedData = {
            ...parsedData,
            sholat_tahajud: parsedData.sholat_tahajud ? true : parsedData.sholat_tahajud === 0 ? false : Boolean(parsedData.sholat_tahajud),
            tilawah_quran: parsedData.tilawah_quran ? true : parsedData.tilawah_quran === 0 ? false : Boolean(parsedData.tilawah_quran),
            terjemah_quran: parsedData.terjemah_quran ? true : parsedData.terjemah_quran === 0 ? false : Boolean(parsedData.terjemah_quran),
            shaum_sunnah: parsedData.shaum_sunnah ? true : parsedData.shaum_sunnah === 0 ? false : Boolean(parsedData.shaum_sunnah),
            shodaqoh: parsedData.shodaqoh ? true : parsedData.shodaqoh === 0 ? false : Boolean(parsedData.shodaqoh),
            dzikir_pagi_petang: parsedData.dzikir_pagi_petang ? true : parsedData.dzikir_pagi_petang === 0 ? false : Boolean(parsedData.dzikir_pagi_petang), 
            menyimak_mq_pagi: parsedData.menyimak_mq_pagi ? true : parsedData.menyimak_mq_pagi === 0 ? false : Boolean(parsedData.menyimak_mq_pagi)
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

  // Navigation to dashboard
  const handleRouteBack = () => {
    router.push('/dashboard');
  };

  // Submit form data
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

  // Generate and open report modal
  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  // Generate date options for dropdown
  useEffect(() => {
    const generateDateOptions = () => {
      try {
        const options = [];
        const currentDate = new Date();
        const todayString = currentDate.toISOString().split('T')[0];
        
        options.push({
          value: todayString,
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
    
    // Set initial state with today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    setSelectedDate(todayString);
    setFormData(prev => ({ ...prev, date: todayString }));
    setSelectedDateTime(today);
    updateHijriDate(today);
  }, []);

  // Update header color and hijri date when form data changes
  useEffect(() => {
    updateHeaderBgColor(formData.date);
  }, [formData.haid, formData.date]);

  // Effect to update current time and date
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        setCurrentDateTime(now);
        
        // Get today's date in YYYY-MM-DD format
        const todayString = now.toISOString().split('T')[0];
        
        // Check if the selected date is not today, and update if needed
        if (selectedDate !== todayString && isToday(formData.date)) {
          setSelectedDate(todayString);
          setFormData(prev => ({ ...prev, date: todayString }));
          setSelectedDateTime(now);
          updateHijriDate(now);
        }
        
        if (!formData.haid) {
          updateHeaderBgColor(formData.date);
        }
      } catch (error) {
        console.error('Error updating time:', error);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [selectedDate, formData.haid, formData.date]);

  // Effect to update selected date time and hijri date when form date changes
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

  // Input sections data for rendering
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
    { label: "Istighfar (x100)", field: "istighfar_1000x", max: 15, type: "number" },
    { label: "Sholawat (x100)", field: "sholawat_100x", max: 15, type: "number" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className={`p-4 sm:p-6 ${headerBgColor} text-white`}>
          <h1 className="text-xl sm:text-2xl font-bold text-center">Mutaba'ah Yaumiyah</h1>
          <p className="text-center text-sm sm:text-base mt-1">At-Taqwa dan As-Sunnah</p>
          <p className="text-center font-medium text-sm sm:text-base mt-1 truncate px-2">{user?.name || 'Pengguna'}</p>
          
          {/* Hijri and Gregorian dates below the name */}
          <div className="flex justify-center mt-1">
            <div className="bg-white/20 rounded-full px-3 py-1 text-xs text-white">
              <span className="font-medium">{formatHijriDate(hijriDate) || '...'}</span>
            </div>
          </div>
          
          {currentDateTime && (
            <div className="text-center mt-2">
              <p className="text-xs sm:text-sm">{formatDate(currentDateTime)}</p>
              <p className="text-base sm:text-lg font-bold">{formatTime(currentDateTime)}</p>
              {getStatusText() && (
                <p className="text-white text-xs sm:text-sm font-medium mt-1 bg-white/20 px-2 py-1 rounded-full inline-block">
                  {getStatusText()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Main Form */}
        <div className="p-4 sm:p-6">
          {/* Date Selector */}
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

          {/* Haid Checkbox */}
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

          {/* Sholat Section */}
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

          {/* Quran Section */}
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

          {/* Sunnah Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">
              1.3 Aktivitas Sunnah
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {sunnahSection.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">{item.label}</span>
                  
                  {item.type === "checkbox" ? (
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData[item.field]}
                        onChange={(e) => handleInputChange(item.field, e.target.checked)}
                        className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                      />
                    </div>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max={item.max}
                      value={formData[item.field]}
                      onChange={(e) => handleInputChange(item.field, e.target.value)}
                      className="shadow border rounded py-1 sm:py-2 px-2 sm:px-3 w-16 sm:w-20 text-gray-700 focus:outline-none focus:shadow-outline text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* MQ Pagi Section */}
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

          {/* Action Buttons */}
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

      {/* Use Report Component here */}
      {showReportModal && (
        <MutabaahReport 
          user={user} 
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
}