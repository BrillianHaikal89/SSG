"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';
import MutabaahReport from '../../../components/my/MutabaahReport';
import MutabaahFormSections from '../../../components/my/MutabaahFormSections';
import { 
  HIJRI_MONTHS, 
  calculateHijriDate, 
  getHijriDate, 
  formatHijriDate, 
  formatDate, 
  formatTime 
} from '../../../components/my/HijriDateUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Default form data structure
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

  /**
   * Check if a date string is today
   * @param {string} dateString - Date string to check in YYYY-MM-DD format
   * @returns {boolean} - True if date is today
   */
  const isToday = (dateString) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return dateString === today;
    } catch (error) {
      console.error('Error checking if date is today:', error);
      return false;
    }
  };

  /**
   * Check if a date string is yesterday
   * @param {string} dateString - Date string to check in YYYY-MM-DD format
   * @returns {boolean} - True if date is yesterday
   */
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

  /**
   * Calculate days difference between selected date and today
   * @param {string} dateString - Date string to compare
   * @returns {number} - Number of days difference
   */
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

  /**
   * Update Hijri date state safely
   * @param {Date} date - Date to calculate Hijri from
   */
  const updateHijriDate = (date) => {
    try {
      const hijri = getHijriDate(date);
      setHijriDate(hijri);
    } catch (error) {
      console.error('Failed to update Hijri date:', error);
      setHijriDate(""); // Set empty string for other dates on error
    }
  };

  /**
   * Update header background color based on date difference and haid status
   * @param {string} dateString - Selected date string
   */
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

  /**
   * Format date for display in dropdown
   * @param {Date} date - Date to format
   * @returns {string} - Formatted date string
   */
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

  /**
   * Get selected date info for display
   * @returns {Object} - Object containing day name and full date
   */
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

  /**
   * Get text to display date status
   * @returns {string} - Status text
   */
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

  /**
   * Handle date selection change
   * @param {Event} e - Change event
   */
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

  /**
   * Handle form input changes
   * @param {string} field - Field to update
   * @param {any} value - New value
   */
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

  /**
   * Check for existing data for the selected date
   * @param {string} date - Date to check
   */
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

  /**
   * Navigation to dashboard
   */
  const handleRouteBack = () => {
    router.push('/dashboard');
  };

  /**
   * Submit form data
   * @param {Event} e - Form submit event
   */
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

  /**
   * Generate and open report modal
   */
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
              <p className="text-xs sm:text-sm">{getSelectedDateInfo().fullDate || 'Loading...'}</p>
              <p className="text-base sm:text-lg font-bold">{formatTime(currentDateTime)}</p>
              {getStatusText() && (
                <p className="text-white text-xs sm:text-sm font-medium mt-1 bg-white/20 px-2 py-1 rounded-full inline-block">
                  {getStatusText()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Date Selector */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray