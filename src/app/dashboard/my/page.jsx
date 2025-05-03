"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';
import MutabaahReport from '../../../components/my/MutabaahReport';
import MutabaahHeader from '../../../components/my/MutabaahHeader';
import MutabaahForm, { DEFAULT_FORM_DATA } from '../../../components/my/MutabaahForm';
import { formatGregorianDate } from '../../../components/my/HijriDateConverter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MutabaahYaumiyahPage() {
  const router = useRouter();
  const { user, userId } = useAuthStore();
  
  // Date and time states
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateOptions, setDateOptions] = useState([]);

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headerBgColor, setHeaderBgColor] = useState('bg-green-600');
  const [showReportModal, setShowReportModal] = useState(false);

  // Form data
  const [formData, setFormData] = useState({...DEFAULT_FORM_DATA});

  // Generate date options for dropdown
  useEffect(() => {
    const generateDateOptions = () => {
      const options = [];
      const currentDate = new Date();
      
      // Add today and past 7 days
      for (let i = 0; i <= 7; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        options.push({
          value: dateString,
          label: formatGregorianDate(date)
        });
      }
      
      return options;
    };
    
    setDateOptions(generateDateOptions());
    checkExistingData(selectedDate);
  }, []);

  // Effect to update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Update header color based on date difference and haid status
  useEffect(() => {
    if (formData.haid) {
      setHeaderBgColor('bg-red-600');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate === today) {
      setHeaderBgColor('bg-green-600');
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    
    if (selectedDate === yesterdayFormatted) {
      setHeaderBgColor('bg-orange-500');
      return;
    }
    
    const selected = new Date(selectedDate);
    const todayDate = new Date();
    const diffTime = selected.getTime() - todayDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      setHeaderBgColor('bg-green-600');
    } else if (diffDays === -2) {
      setHeaderBgColor('bg-orange-500');
    } else {
      setHeaderBgColor('bg-amber-700');
    }
  }, [selectedDate, formData.haid]);

  // Check for existing data for the selected date
  const checkExistingData = async (date) => {
    try {
      const storageKey = `mutabaah_${user?.userId}_${date}`;
      const localData = localStorage.getItem(storageKey);
      
      if (localData) {
        const parsedData = JSON.parse(localData);
        setFormData(parsedData);
        toast.info('Data ditemukan dari penyimpanan lokal');
      } else {
        setFormData({
          ...DEFAULT_FORM_DATA,
          date: date
        });
      }
    } catch (error) {
      console.error('Error checking existing data:', error);
      setFormData({
        ...DEFAULT_FORM_DATA,
        date: date
      });
    }
  };

  // Handle date selection change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setFormData(prev => ({ ...prev, date: newDate }));
    checkExistingData(newDate);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
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
    } else if (['sholat_tahajud', 'tilawah_quran', 'terjemah_quran', 'shaum_sunnah', 
                'shodaqoh', 'dzikir_pagi_petang', 'menyimak_mq_pagi'].includes(field)) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      const numValue = Math.max(0, parseInt(value) || 0);
      setFormData(prev => ({
        ...prev,
        [field]: numValue
      }));
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
      
      const response = await fetch(`${API_URL}/users/input-my`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.userId, ...formData }),
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || result.error || 'Terjadi kesalahan server');
      }
      
      toast.success(result.message || 'Data berhasil disimpan!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
        toast.success('Data telah disimpan di browser Anda. Server database sedang tidak tersedia.');
        router.push('/dashboard');
      } else {
        toast.error(error.message || 'Gagal menyimpan data. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <MutabaahHeader 
          user={user} 
          selectedDate={selectedDate} 
          currentDateTime={currentDateTime} 
          headerBgColor={headerBgColor} 
          formData={formData} 
        />
        
        <MutabaahForm 
          formData={formData}
          dateOptions={dateOptions}
          selectedDate={selectedDate}
          isSubmitting={isSubmitting}
          onDateChange={handleDateChange}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onGenerateReport={() => setShowReportModal(true)}
          onRouteBack={handleRouteBack}
        />
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