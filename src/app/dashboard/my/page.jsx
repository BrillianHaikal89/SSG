"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';
import MutabaahReport from '../../../components/my/MutabaahReport';
import MutabaahHeader from '../../../components/my/MutabaahHeader';
import MutabaahForm, { DEFAULT_FORM_DATA } from '../../../components/my/MutabaahForm';
import { calculateHijriDate, formatGregorianDate } from '../../../components/my/HijriDateConverter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MutabaahYaumiyahPage() {
  const router = useRouter();
  const { user, userId } = useAuthStore();
  
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateOptions, setDateOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headerBgColor, setHeaderBgColor] = useState('bg-green-600');
  const [showReportModal, setShowReportModal] = useState(false);
  const [formData, setFormData] = useState({...DEFAULT_FORM_DATA});

  useEffect(() => {
    const generateDateOptions = () => {
      const options = [];
      const currentDate = new Date();
      
      for (let i = 0; i <= 7; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const hijriDate = calculateHijriDate(dateString).formatted;
        
        options.push({
          value: dateString,
          label: formatGregorianDate(dateString),
          hijriDate: hijriDate
        });
      }
      
      return options;
    };
    
    setDateOptions(generateDateOptions());
    checkExistingData(selectedDate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (formData.haid) {
      setHeaderBgColor('bg-red-600');
      return;
    }
    
    const today = new Date();
    const selected = new Date(selectedDate);
    
    today.setHours(12, 0, 0, 0);
    selected.setHours(12, 0, 0, 0);
    
    const diffDays = Math.round((selected - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) setHeaderBgColor('bg-green-600');
    else if (diffDays === -1) setHeaderBgColor('bg-orange-500');
    else if (diffDays < -1) setHeaderBgColor('bg-amber-700');
    else setHeaderBgColor('bg-green-600');
  }, [selectedDate, formData.haid]);

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

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setFormData(prev => ({ ...prev, date: newDate }));
    checkExistingData(newDate);
  };

  const handleInputChange = (field, value) => {
    if (field === 'haid') {
      const updatedFormData = {
        ...formData,
        haid: value,
        ...(value ? {
          sholat_wajib: 0,
          sholat_tahajud: false,
          sholat_dhuha: 0,
          sholat_rawatib: 0,
          sholat_sunnah_lainnya: 0
        } : {})
      };
      setFormData(updatedFormData);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

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

      if (!response.ok) throw new Error('Gagal menyimpan data');
      
      toast.success('Data berhasil disimpan!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Terjadi kesalahan');
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
          onRouteBack={() => router.push('/dashboard')}
        />
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