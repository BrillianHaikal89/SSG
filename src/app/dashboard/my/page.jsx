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
  const [showReportModal, setShowReportModal] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);

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

  useEffect(() => {
    updateHeaderBgColor(formData.date);
  }, [formData.haid, formData.date]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(now);
      
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
      const updatedFormData = {
        ...formData,
        haid: newValue,
        ...(newValue ? {
          sholat_wajib: 0,
          sholat_tahajud: 0,
          sholat_dhuha: 0,
          sholat_rawatib: 0,
          sholat_sunnah_lainnya: 0
        } : {})
      };
      
      setFormData(updatedFormData);
      
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

  const fetchAllUserData = async () => {
    try {
      setLoadingReport(true);
      // In a real app, you would fetch from your API:
      // const response = await fetch(`${API_URL}/users/all-data?user_id=${user?.userId}`, {
      //   credentials: 'include',
      // });
      
      // For demo purposes, we'll use localStorage data
      const allData = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`mutabaah_${user?.userId}_`)) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            allData.push(data);
          } catch (e) {
            console.error('Error parsing data for key:', key);
          }
        }
      }
      
      // Sort by date descending
      allData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllUserData(allData);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error(error.message || 'Gagal mengambil data laporan');
    } finally {
      setLoadingReport(false);
    }
  };

  const handleGenerateReport = async () => {
    await fetchAllUserData();
    setShowReportModal(true);
  };

  const downloadReport = () => {
    // Create CSV content
    let csvContent = "Laporan Lengkap Mutaba'ah Yaumiyah\n\n";
    csvContent += `Nama,${user?.name || '-'}\n`;
    csvContent += `Tanggal Laporan,${new Date().toLocaleDateString('id-ID')}\n`;
    csvContent += `Total Data,${allUserData.length}\n\n`;

    // Add headers
    csvContent += "Tanggal,Sholat Wajib,Sholat Tahajud,Sholat Dhuha,Sholat Rawatib,Sholat Sunnah Lainnya,";
    csvContent += "Tilawah Quran,Terjemah Quran,Shaum Sunnah,Shodaqoh,Dzikir Pagi/Petang,";
    csvContent += "Istighfar (x100),Sholawat (x100),Menyimak MQ Pagi,Status Haid\n";

    // Add data rows
    allUserData.forEach(data => {
      csvContent += `${data.date},${data.sholat_wajib},${data.sholat_tahajud},${data.sholat_dhuha},`;
      csvContent += `${data.sholat_rawatib},${data.sholat_sunnah_lainnya},${data.tilawah_quran},`;
      csvContent += `${data.terjemah_quran},${data.shaum_sunnah},${data.shodaqoh},`;
      csvContent += `${data.dzikir_pagi_petang},${data.istighfar_1000x},${data.sholawat_100x},`;
      csvContent += `${data.menyimak_mq_pagi},${data.haid ? "Ya" : "Tidak"}\n`;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_mutabaah_${user?.name || 'user'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                Sedang berhalangan (haid/menstruasi) dan tidak dapat melaksanakan sholat
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
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">{item.label}</span>
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
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">1.2 Aktivitas Quran</h2>
            
            <div className="space-y-3 sm:space-y-4">
              {[
                { label: "Tilawah Quran (halaman)", field: "tilawah_quran", max: 100 },
                { label: "Terjemah Quran (halaman)", field: "terjemah_quran", max: 50 },
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
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">1.3 Aktivitas Sunnah</h2>
            
            <div className="space-y-3 sm:space-y-4">
              {[
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Laporan Lengkap Mutaba'ah Yaumiyah</h3>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Nama:</span>
                  <span>{user?.name || '-'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Data:</span>
                  <span>{allUserData.length} hari</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Tanggal Laporan:</span>
                  <span>{new Date().toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              {loadingReport ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {allUserData.length > 0 ? (
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sholat Wajib</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sholat Tahajud</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sholat Dhuha</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tilawah</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MQ Pagi</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Haid</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {allUserData.map((data, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(data.date).toLocaleDateString('id-ID')}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {data.sholat_wajib}/5
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {data.sholat_tahajud}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {data.sholat_dhuha}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {data.tilawah_quran} hlm
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {data.menyimak_mq_pagi}x
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {data.haid ? 'Ya' : 'Tidak'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-3">Statistik Ringkasan</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-sm text-blue-800">Sholat Wajib (Rata-rata)</div>
                            <div className="text-2xl font-bold text-blue-600">
                              {(
                                allUserData.reduce((sum, data) => sum + data.sholat_wajib, 0) / 
                                (allUserData.length || 1)
                              ).toFixed(1)}/5
                            </div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-sm text-green-800">Tilawah Quran (Total)</div>
                            <div className="text-2xl font-bold text-green-600">
                              {allUserData.reduce((sum, data) => sum + data.tilawah_quran, 0)} hlm
                            </div>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-sm text-purple-800">Hari Berhalangan</div>
                            <div className="text-2xl font-bold text-purple-600">
                              {allUserData.filter(data => data.haid).length} hari
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Tidak ada data laporan yang tersedia
                    </div>
                  )}
                </>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                {allUserData.length > 0 && (
                  <button
                    onClick={downloadReport}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download CSV
                  </button>
                )}
                <button
                  onClick={() => setShowReportModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}