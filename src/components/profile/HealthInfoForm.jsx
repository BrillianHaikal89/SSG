"use client";

import React, { useState, useEffect } from 'react';

const HealthInfoForm = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [healthData, setHealthData] = useState({
    riwayatPenyakit: '',
    memilikiDisabilitas: '',
    kontakDarurat: '',
    hubunganKontakDarurat: ''
  });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Get user data from localStorage or sessionStorage
        const storedUserData = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
        
        // Set userData with existing health data
        const userHealth = {
          riwayatPenyakit: storedUserData.riwayatPenyakit || '',
          memilikiDisabilitas: storedUserData.memilikiDisabilitas || '',
          kontakDarurat: storedUserData.kontakDarurat || '',
          hubunganKontakDarurat: storedUserData.hubunganKontakDarurat || ''
        };
        
        setUserData(userHealth);

        // Pre-fill the form if data exists
        setHealthData({
          riwayatPenyakit: storedUserData.riwayatPenyakit || '',
          memilikiDisabilitas: storedUserData.memilikiDisabilitas || '',
          kontakDarurat: storedUserData.kontakDarurat || '',
          hubunganKontakDarurat: storedUserData.hubunganKontakDarurat || ''
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Set default data if there's an error
        setUserData({
          riwayatPenyakit: '',
          memilikiDisabilitas: '',
          kontakDarurat: '',
          hubunganKontakDarurat: ''
        });
      }
    }
  }, []);

  // Check if user has any health data
  const hasAnyData = () => {
    return !!(
      userData?.riwayatPenyakit || 
      userData?.memilikiDisabilitas || 
      userData?.kontakDarurat ||
      userData?.hubunganKontakDarurat
    );
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle add new data
  const handleAddNew = () => {
    // Clear form data for new entry
    setHealthData({
      riwayatPenyakit: '',
      memilikiDisabilitas: '',
      kontakDarurat: '',
      hubunganKontakDarurat: ''
    });
    
    // Set isFormVisible to true if it's not already
    if (!isFormVisible) {
      setIsFormVisible(true);
    }
    
    // Enable editing mode
    setIsEditing(true);
  };

  // Handle save directly
  const saveData = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        riwayatPenyakit: healthData.riwayatPenyakit,
        memilikiDisabilitas: healthData.memilikiDisabilitas,
        kontakDarurat: healthData.kontakDarurat,
        hubunganKontakDarurat: healthData.hubunganKontakDarurat
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update the user data state with new values
      setUserData({
        ...userData,
        riwayatPenyakit: healthData.riwayatPenyakit,
        memilikiDisabilitas: healthData.memilikiDisabilitas,
        kontakDarurat: healthData.kontakDarurat,
        hubunganKontakDarurat: healthData.hubunganKontakDarurat
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving health data:", error);
      alert('Gagal menyimpan data kesehatan. Silakan coba lagi.');
    }
  };

  // Handle input changes with auto-save
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const newHealthData = {
      ...healthData,
      [name]: value
    };
    
    setHealthData(newHealthData);
    
    // Auto-save after 500ms of no typing
    const saveTimeout = setTimeout(() => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        [name]: value
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update userData as well
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }, 500);
    
    // Clear timeout on next input change
    return () => clearTimeout(saveTimeout);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Data Kesehatan dan Darurat</h2>
          <p className="text-xs text-gray-500">Informasi kesehatan dan kontak darurat</p>
        </div>
        <div className="flex space-x-2">
          <button 
            type="button"
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 transition-transform duration-200 ${isFormVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {isFormVisible ? 'Tutup' : 'Lihat Data'}
          </button>
          
          {isFormVisible && !isEditing && (
            <>
              <button 
                type="button"
                onClick={handleEdit}
                className={`${!hasAnyData() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded-md text-sm flex items-center`}
                disabled={!hasAnyData()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
              
              <button 
                type="button"
                onClick={handleAddNew}
                className={`${hasAnyData() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded-md text-sm flex items-center`}
                disabled={hasAnyData()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah
              </button>
            </>
          )}
          
          {isEditing && (
            <button 
              type="button"
              onClick={saveData}
              className="bg-green-500 text-white px-3 py-1 rounded-md text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Selesai
            </button>
          )}
        </div>
      </div>
      
      {/* Collapsible Form Content */}
      <div className={`transition-all duration-300 overflow-hidden ${isFormVisible || isEditing ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {isEditing ? (
          // Editable Form
          <div className="p-4">
            {/* Riwayat Penyakit */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Riwayat Penyakit
              </label>
              <input
                type="text"
                name="riwayatPenyakit"
                value={healthData.riwayatPenyakit}
                onChange={handleChange}
                placeholder="Masukkan riwayat penyakit jika ada"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Jika ada penyakit kronis/alergi</p>
            </div>
            
            {/* Disabilitas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apakah memiliki disabilitas?
              </label>
              <select
                name="memilikiDisabilitas"
                value={healthData.memilikiDisabilitas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih --</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Untuk persiapan fasilitas khusus</p>
            </div>
            
            {/* Kontak Darurat */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kontak Darurat
              </label>
              <input
                type="text"
                name="kontakDarurat"
                value={healthData.kontakDarurat}
                onChange={handleChange}
                placeholder="Nama + Nomor HP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Orang yang bisa dihubungi jika darurat</p>
            </div>
            
            {/* Hubungan dengan Kontak Darurat */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hubungan dengan Kontak Darurat
              </label>
              <select
                name="hubunganKontakDarurat"
                value={healthData.hubunganKontakDarurat}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Hubungan --</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Saudara">Saudara</option>
                <option value="Pasangan">Pasangan</option>
                <option value="Anak">Anak</option>
                <option value="Kerabat">Kerabat</option>
                <option value="Teman">Teman</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Untuk verifikasi hubungan</p>
            </div>
          </div>
        ) : (
          // Data Display (Read-only)
          <div className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium text-sm text-gray-700 w-1/3">Riwayat Penyakit</td>
                  <td className="py-3 px-2 text-sm">{userData?.riwayatPenyakit || '-'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium text-sm text-gray-700">Memiliki Disabilitas</td>
                  <td className="py-3 px-2 text-sm">{userData?.memilikiDisabilitas || '-'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium text-sm text-gray-700">Kontak Darurat</td>
                  <td className="py-3 px-2 text-sm">{userData?.kontakDarurat || '-'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-medium text-sm text-gray-700">Hubungan dengan Kontak Darurat</td>
                  <td className="py-3 px-2 text-sm">{userData?.hubunganKontakDarurat || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthInfoForm;