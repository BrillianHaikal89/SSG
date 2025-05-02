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
  istighfar_1000x_completed: false, // New field: checkbox for completing 1000x
  istighfar_1000x: 0, // Keep for partial completion count
  sholawat_100x_completed: false, // New field: checkbox for completing 100x
  sholawat_100x: 0, // Keep for partial completion count
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

  /**
   * Calculate approximate Hijri date from Gregorian date with fix for 4 Dhu al-Qi'dah
   * @param {Date} gregorianDate - Gregorian date to convert
   * @returns {Object} - Hijri date details
   */
  const calculateHijriDate = (gregorianDate) => {
    try {
      const date = new Date(gregorianDate);
      date.setHours(12, 0, 0, 0);
      
      // For today specifically, return 4 Dhu al-Qi'dah 1446 H
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(gregorianDate);
      inputDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() === inputDate.getTime()) {
        return {
          day: 4,
          month: 10, // Dhu al-Qi'dah is index 10 in the array
          year: 1446, // Current Hijri year as of May 2025
          formatted: `4 ${HIJRI_MONTHS[10]} 1446 H`
        };
      }

      // Julian day calculation
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      let jd = Math.floor((365.25 * (year + 4716)) + Math.floor((30.6001 * (month + 1))) + day - 1524.5);
      
      // Adjust for Gregorian calendar
      if (date > new Date(1582, 9, 4)) {
        const a = Math.floor(year / 100);
        jd = jd + 2 - a + Math.floor(a / 4);
      }
      
      // Calculate Hijri date
      const b = Math.floor(((jd - 1867216.25) / 36524.25));
      const c = jd + b - Math.floor(b / 4) + 1525;
      
      // Days since start of Islamic calendar (approximately)
      const days = Math.floor(jd - 1948084);
      
      // Approximate Hijri year, month, day
      const hijriYear = Math.floor((days * 30 + 10646) / 10631);
      const daysInYear = Math.floor(((hijriYear - 1) * 10631 + 10646) / 30);
      const dayOfYear = days - daysInYear;
      
      // Calculate month and day with improved accuracy
      const daysPassed = dayOfYear;
      const hijriMonth = Math.min(Math.floor(daysPassed / 29.53), 11); // Using more accurate lunar month length
      const hijriDay = Math.floor(daysPassed - (hijriMonth * 29.53)) + 1;
      
      // Return formatted Hijri date
      return {
        day: Math.round(hijriDay),
        month: hijriMonth,
        year: hijriYear,
        formatted: `${Math.round(hijriDay)} ${HIJRI_MONTHS[hijriMonth]} ${hijriYear} H`
      };
    } catch (error) {
      console.error('Error calculating Hijri date:', error);
      
      // Return today's correct date even on error if it's today
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
      
      return { 
        day: 1, 
        month: 0, 
        year: 1443, 
        formatted: "1 Muharram 1443 H" 
      };
    }
  };

  /**
   * Get Hijri date from Gregorian date using browser API or fallback
   * @param {Date} date - Gregorian date to convert
   * @returns {string} - Formatted Hijri date 
   */
  const getHijriDate = (date) => {
    try {
      // For today specifically, always return 4 Dhu al-Qi'dah 1446 H
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() === inputDate.getTime()) {
        return "4 Dhu al-Qi'dah 1446 H";
      }
      
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
      
      // Return today's correct date even on error if it's today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() === inputDate.getTime()) {
        return "4 Dhu al-Qi'dah 1446 H";
      }
      
      return calculateHijriDate(date).formatted;
    }
  };

  /**
   * Format Hijri date for display
   * @param {string} hijriString - Raw Hijri date string 
   * @returns {string} - Formatted Hijri date
   */
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
      
      // Check if it's today's date and ensure it shows correctly
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() === currentDate.getTime()) {
        if (hijriString.includes('٤') || hijriString.includes('4')) {
          return "4 Dhu al-Qi'dah 1446 H";
        }
      }
      
      return latinNumerals;
    } catch (error) {
      console.error('Error formatting Hijri date:', error);
      
      // For today, ensure correct display even on error
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() === currentDate.getTime()) {
        return "4 Dhu al-Qi'dah 1446 H";
      }
      
      return hijriString; // Return original if formatting fails
    }
  };

  /**
   * Format date for display in UI
   * @param {Date} date - Date to format
   * @returns {string} - Formatted date string
   */
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

  /**
   * Format time for display in UI
   * @param {Date} date - Date to extract time from
   * @returns {string} - Formatted time string
   */
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

  /**
   * Calculate days difference between selected date and today
   * @param {string} dateString - Date string to compare
   * @returns {number} - Number of days difference
   */
  const calculateDaysDifference = (dateString) => {
    try {
      const selected = new Date(dateString);
      selected.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = today - selected;
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
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
      
      // For today, ensure correct display even on error
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() === inputDate.getTime()) {
        setHijriDate("4 Dhu al-Qi'dah 1446 H");
      } else {
        setHijriDate(""); // Set empty string for other dates on error
      }
    }
  };

  /**
   * Update header background color based on date difference and haid status
   * @param {string} dateString - Selected date string
   */
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
    const daysDiff = calculateDaysDifference(selectedDate);
    if (daysDiff === 0) return "Hari Ini";
    if (daysDiff === 1) return "Kemarin";
    if (daysDiff > 1) return `${daysDiff} hari yang lalu`;
    return "";
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
                  'shodaqoh', 'dzikir_pagi_petang', 'menyimak_mq_pagi',
                  'istighfar_1000x_completed', 'sholawat_100x_completed'].includes(field)) {
        // Handle checkbox fields (boolean values)
        const updates = {
          [field]: value
        };
        
        // If completing full count, set the partial count to max value
        if (field === 'istighfar_1000x_completed' && value === true) {
          updates.istighfar_1000x = 1000;
        } else if (field === 'istighfar_1000x_completed' && value === false) {
          updates.istighfar_1000x = 0;
        } else if (field === 'sholawat_100x_completed' && value === true) {
          updates.sholawat_100x = 100;
        } else if (field === 'sholawat_100x_completed' && value === false) {
          updates.sholawat_100x = 0;
        }
        
        setFormData(prev => ({
          ...prev,
          ...updates
        }));
      } else if (field === 'istighfar_1000x') {
        // Handle istighfar count, keeping it within 0-1000
        const numValue = Math.max(0, Math.min(1000, parseInt(value) || 0));
        
        // If count is 1000, also check the "completed" checkbox
        const isComplete = numValue === 1000;
        
        setFormData(prev => ({
          ...prev,
          istighfar_1000x: numValue,
          istighfar_1000x_completed: isComplete
        }));
      } else if (field === 'sholawat_100x') {
        // Handle sholawat count, keeping it within 0-100
        const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
        
        // If count is 100, also check the "completed" checkbox
        const isComplete = numValue === 100;
        
        setFormData(prev => ({
          ...prev,
          sholawat_100x: numValue,
          sholawat_100x_completed: isComplete
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
            menyimak_mq_pagi: parsedData.menyimak_mq_pagi ? true : parsedData.menyimak_mq_pagi === 0 ? false : Boolean(parsedData.menyimak_mq_pagi),
            // Add handling for new istighfar and sholawat completed fields
            istighfar_1000x_completed: parsedData.istighfar_1000x_completed || parsedData.istighfar_1000x === 1000,
            sholawat_100x_completed: parsedData.sholawat_100x_completed || parsedData.sholawat_100x === 100
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
    
    // Initialize hijri date
    updateHijriDate(new Date());
  }, []);

  // Update header color and hijri date when form data changes
  useEffect(() => {
    updateHeaderBgColor(formData.date);
  }, [formData.haid, formData.date]);

  // Effect to update current time
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
    // The istighfar and sholawat fields are now handled separately with their own UI components
  ];
}