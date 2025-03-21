"use client";

import React, { useState, useEffect } from 'react';

const PersonalInfoForm = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    pendidikanTerakhir: '',
    pekerjaan: '',
    organisasi: '',
    motivasi: ''
  });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Get user data from localStorage or sessionStorage
        const storedUserData = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
        
        // Set userData with existing profile data
        const userProfile = {
          pendidikanTerakhir: storedUserData.pendidikanTerakhir || '',
          pekerjaan: storedUserData.pekerjaan || '',
          organisasi: storedUserData.organisasi || '',
          motivasi: storedUserData.motivasi || ''
        };
        
        setUserData(userProfile);

        // Pre-fill the form if data exists
        setFormData({
          pendidikanTerakhir: storedUserData.pendidikanTerakhir || '',
          pekerjaan: storedUserData.pekerjaan || '',
          organisasi: storedUserData.organisasi || '',
          motivasi: storedUserData.motivasi || ''
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Set default data if there's an error
        setUserData({
          pendidikanTerakhir: '',
          pekerjaan: '',
          organisasi: '',
          motivasi: ''
        });
      }
    }
  }, []);

  // Check if user has any personal data
  const hasAnyData = () => {
    return !!(
      userData?.pendidikanTerakhir || 
      userData?.pekerjaan || 
      userData?.motivasi
    );
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle add new data
  const handleAddNew = () => {
    // Clear form data for new entry
    setFormData({
      pendidikanTerakhir: '',
      pekerjaan: '',
      organisasi: '',
      motivasi: ''
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
        pendidikanTerakhir: formData.pendidikanTerakhir,
        pekerjaan: formData.pekerjaan,
        organisasi: formData.organisasi,
        motivasi: formData.motivasi
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update the user data state with new values
      setUserData({
        ...userData,
        pendidikanTerakhir: formData.pendidikanTerakhir,
        pekerjaan: formData.pekerjaan,
        organisasi: formData.organisasi,
        motivasi: formData.motivasi
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert('Gagal menyimpan data diri. Silakan coba lagi.');
    }
  };

  // Handle input changes with auto-save
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
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
          <h2 className="text-lg font-medium">Data Diri</h2>
          <p className="text-xs text-gray-500">Lengkapi data diri Anda</p>
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
            {/* Pendidikan Terakhir */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pendidikan Terakhir
              </label>
              <select
                name="pendidikanTerakhir"
                value={formData.pendidikanTerakhir}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Pilih Pendidikan --</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Untuk klasifikasi peserta</p>
            </div>
            
            {/* Pekerjaan */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pekerjaan
              </label>
              <input
                type="text"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                placeholder="Masukkan pekerjaan Anda"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Jika bekerja atau wirausaha</p>
            </div>
            
            {/* Organisasi yang Diikuti */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organisasi yang Diikuti
              </label>
              <input
                type="text"
                name="organisasi"
                value={formData.organisasi}
                onChange={handleChange}
                placeholder="Masukkan organisasi yang Anda ikuti"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Jika aktif dalam komunitas/LSM/masjid</p>
            </div>
            
            {/* Motivasi Mengikuti Diklat */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivasi Mengikuti Diklat
              </label>
              <textarea
                name="motivasi"
                value={formData.motivasi}
                onChange={handleChange}
                placeholder="Jelaskan motivasi Anda mengikuti diklat"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Untuk memahami niat peserta</p>
            </div>
          </div>
        ) : (
          // Data Display (Read-only)
          <div className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium text-sm text-gray-700 w-1/3">Pendidikan Terakhir</td>
                  <td className="py-3 px-2 text-sm">{userData?.pendidikanTerakhir || '-'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium text-sm text-gray-700">Pekerjaan</td>
                  <td className="py-3 px-2 text-sm">{userData?.pekerjaan || '-'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium text-sm text-gray-700">Organisasi yang Diikuti</td>
                  <td className="py-3 px-2 text-sm">{userData?.organisasi || '-'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-medium text-sm text-gray-700 align-top">Motivasi Mengikuti Diklat</td>
                  <td className="py-3 px-2 text-sm">{userData?.motivasi || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoForm;