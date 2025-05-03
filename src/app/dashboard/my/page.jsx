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
  const [lastRefreshDate, setLastRefreshDate] = useState('');

  /**
   * Check if two dates are the same day
   * @param {Date} date1 - First date to compare
   * @param {Date} date2 - Second date to compare
   * @returns {boolean} - True if dates are the same day
   */
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  /**
   * Check if a date string is today
   * @param {string} dateString - Date string to check in YYYY-MM-DD format
   * @returns {boolean} - True if date is today
   */
  const isToday = (dateString) => {
    try {
      const now = new Date();
      const currentDateString = now.toISOString().split('T')[0];
      return dateString === currentDateString;
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
      // Create date objects with no time component
      const now = new Date();
      const todayString = now.toISOString().split('T')[0];
      
      // Direct check for today
      if (dateString === todayString) {
        return 0; // It's today
      }
      
      // Direct check for yesterday
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      if (dateString === yesterdayString) {
        return -1; // It's exactly yesterday
      }
      
      // For other dates, calculate difference
      const selected = new Date(dateString);
      selected.setHours(0, 0, 0, 0);
      
      const today = new Date(todayString);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = selected.getTime() - today.getTime();
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
    
    // Important: Get the actual current date for comparison
    const now = new Date();
    const currentDateString = now.toISOString().split('T')[0];
    
    // If the selected date is today's date, ALWAYS show green regardless of any other factors
    if (dateString === currentDateString) {
      setHeaderBgColor('bg-green-600'); // Today is always green when on time
      return;
    }
    
    // Handle all other cases normally
    // Check if it's yesterday
    if (isYesterday(dateString)) {
      setHeaderBgColor('bg-orange-500'); // Yesterday is orange (1 day late)
      return;
    }
    
    // For other dates, calculate day difference
    const daysDiff = calculateDaysDifference(dateString);
    
    // Log for debugging
    console.log('Date difference calculation:', {
      dateString,
      currentDateString,
      isToday: dateString === currentDateString,
      isYesterday: isYesterday(dateString),
      daysDiff
    });
    
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
   * Generate date options for dropdown
   * @returns {Array} - Array of date options
   */
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

  /**
   * Get selected date info for display
   * @returns {Object} - Object containing day name and full date
   */
  const getSelectedDateInfo = () => {
    try {
      // Always use current date time for display in header
      const fullDate = currentDateTime ? formatDate(currentDateTime) : '';
      return { fullDate };
    } catch (error) {
      console.error('Error getting selected date info:', error);
      return { fullDate: '' };
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
        
        // Only update Hijri date if not today
        if (!isToday(newDate)) {
          updateHijriDate(selectedDate);
        }
      }
      
      // Update header color immediately after changing the date
      updateHeaderBgColor(newDate);
      
      // Check for existing data
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
        } else {
          // Restore appropriate color when unchecking haid
          updateHeaderBgColor(formData.date);
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
          
          // Update header color after loading data
          updateHeaderBgColor(date);
          
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
      
      // Update header color for default data
      updateHeaderBgColor(date);
      
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
  
  /**
   * Force a complete refresh of date-related states
   */
  const forceRefreshDateInfo = () => {
    const now = new Date();
    const todayString = now.toISOString().split('T')[0];
    
    // Only set if selected date is today or on initial page load
    if (isToday(selectedDate) || !lastRefreshDate) {
      setSelectedDate(todayString);
      setFormData(prev => ({ ...prev, date: todayString }));
    }
    
    // Always update these regardless of selected date
    setCurrentDateTime(now);
    setSelectedDateTime(now);
    updateHijriDate(now);
    setDateOptions(generateDateOptions());
    
    // Update header color if not in haid state
    if (!formData.haid) {
      updateHeaderBgColor(formData.date);
    }
    
    // Remember when we did the refresh
    setLastRefreshDate(todayString);
    
    // Log for debugging
    console.log('Forced refresh date info:', {
      now: now.toISOString(),
      todayString,
      isToday: isToday(formData.date)
    });
  };

  // Generate date options for dropdown on component mount
  useEffect(() => {
    // Force full date refresh on mount
    forceRefreshDateInfo();
    
    // Set initial state with today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    setSelectedDate(todayString);
    setFormData(prev => ({ ...prev, date: todayString }));
    
    // Check for existing data for today
    checkExistingData(todayString);
    
    // Clear all cached data for debugging (uncomment if needed)
    /*
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(`mutabaah_${user?.userId}_`)) {
        localStorage.removeItem(key);
      }
    }
    */
  }, []);

  // Effect to update current time and handle date changes
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const currentDateString = now.toISOString().split('T')[0];
        const previousDateString = currentDateTime ? currentDateTime.toISOString().split('T')[0] : '';
        
        // Always update current time display
        setCurrentDateTime(now);
        
        // Check if the day has changed (by comparing date strings)
        const dayChanged = currentDateString !== previousDateString;
        
        // Check if it's near midnight or just after midnight for more frequent updates
        const isNearMidnight = now.getHours() === 23 && now.getMinutes() >= 59 && now.getSeconds() >= 50;
        const isJustAfterMidnight = now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() <= 10;
        const shouldForceRefresh = isNearMidnight || isJustAfterMidnight;
        
        // If day has changed OR we're near midnight OR this is the first render
        if (dayChanged || shouldForceRefresh || !previousDateString) {
          console.log('Day changed or force refresh needed', {
            dayChanged, 
            isNearMidnight, 
            isJustAfterMidnight,
            now: now.toISOString()
          });
          
          // Do a complete refresh of date-related states
          forceRefreshDateInfo();
        }
      } catch (error) {
        console.error('Error updating time:', error);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [currentDateTime]);

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
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Pilih Tanggal
            </label>
            <select
              value={selectedDate}
              onChange={handleDateChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            >
              {dateOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Form Sections */}
          <MutabaahFormSections 
            formData={formData}
            handleInputChange={handleInputChange}
            headerBgColor={headerBgColor}
            isSubmitting={isSubmitting}
          />

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
            <button
              onClick={handleRouteBack}
              className="flex-1 sm:flex-none border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline"
              type="button"
            >
              Kembali
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handleGenerateReport}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                type="button"
              >
                Lihat Laporan
              </button>
              
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 ${
                  isSubmitting ? 'bg-green-400' : headerBgColor
                } hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <MutabaahReport 
          user={user}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}