"use client";

import React, { useState, useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';
import FormComponentBase from './FormComponentsBase';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PersonalInfoForm = () => {
  const { user } = useAuthStore();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    pendidikanTerakhir: '',
    pekerjaan: '',
    organisasi: '',
    motivasi: ''
  });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = user?.userId;
      if (userId) {
        fetchEducationData(userId);
      }
    }
  }, [user]);
  
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
    setIsCreating(false);
  };  

  // Handle add new data
  const handleAddNew = () => {
    setFormData({
      pendidikanTerakhir: '',
      pekerjaan: '',
      organisasi: '',
      motivasi: ''
    });
  
    setIsFormVisible(true);
    setIsEditing(true);
    setIsCreating(true);
  };

  // Handle save directly
  const saveData = async () => {
    try {
      const userId = user?.userId;
      const url = isCreating
        ? `${API_URL}/users/create-education`
        : `${API_URL}/users/edit-education`;
  
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          pendidikan_terakhir: formData.pendidikanTerakhir,
          pekerjaan: formData.pekerjaan,
          organisasi: formData.organisasi,
          motivasi: formData.motivasi
        })
      });
  
      if (!response.ok) throw new Error('Gagal menyimpan data');
  
      toast.success('Data berhasil disimpan!');
      setUserData(formData);
      setIsEditing(false);
      setIsCreating(false);
  
    } catch (err) {
      toast.error('Gagal menyimpan data ke server.');
    }
  };
    
  const fetchEducationData = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/get-education?id=${userId}`);
      if (!res.ok) throw new Error('Gagal ambil data');
      const data = await res.json();
  
      const fetchedData = {
        pendidikanTerakhir: data.pendidikan_terakhir || '',
        pekerjaan: data.pekerjaan || '',
        organisasi: data.organisasi || '',
        motivasi: data.motivasi || ''
      };
  
      setUserData(fetchedData);
      setFormData(fetchedData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Render editable form content
  const renderEditableForm = () => (
    <>
      {/* Pendidikan Terakhir */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pendidikan Terakhir
        </label>
        <select
          name="pendidikanTerakhir"
          value={formData.pendidikanTerakhir}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          required
        ></textarea>
        <p className="text-xs text-gray-500 mt-1">Untuk memahami niat peserta</p>
      </div>
    </>
  );

  // Render read-only data content
  const renderDataDisplay = () => (
    <div className="overflow-x-auto -mx-3 md:mx-0">
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium text-xs md:text-sm text-gray-700 w-1/3">Pendidikan Terakhir</td>
            <td className="py-2 px-3 text-xs md:text-sm">{userData?.pendidikanTerakhir || '-'}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium text-xs md:text-sm text-gray-700">Pekerjaan</td>
            <td className="py-2 px-3 text-xs md:text-sm">{userData?.pekerjaan || '-'}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium text-xs md:text-sm text-gray-700">Organisasi yang Diikuti</td>
            <td className="py-2 px-3 text-xs md:text-sm">{userData?.organisasi || '-'}</td>
          </tr>
          <tr>
            <td className="py-2 px-3 font-medium text-xs md:text-sm text-gray-700 align-top">Motivasi Mengikuti Diklat</td>
            <td className="py-2 px-3 text-xs md:text-sm">{userData?.motivasi || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <FormComponentBase
      title="Data Diri"
      subtitle="Lengkapi data diri Anda"
      isFormVisible={isFormVisible}
      setIsFormVisible={setIsFormVisible}
      isEditing={isEditing}
      onEdit={handleEdit}
      onAddNew={handleAddNew}
      onSave={saveData}
      hasData={hasAnyData()}
    >
      {isEditing ? renderEditableForm() : renderDataDisplay()}
    </FormComponentBase>
  );
};

export default PersonalInfoForm;