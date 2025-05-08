"use client";

import React, { useState, useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';
import FormComponentBase from './FormComponentBase';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const HealthInfoForm = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { user } = useAuthStore();
  const [healthData, setHealthData] = useState({
    riwayat_penyakit: '',
    memiliki_disabilitas: '',
    kontak_darurat_nama: '',
    kontak_darurat_nomor: '',
    hubungan_darurat: ''
  });

  // Fetch health data
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/get-health?user_id=${user?.userId}`);
        const result = await response.json();
        
        if (result?.data) {
          setHealthData({
            riwayat_penyakit: result.data.riwayat_penyakit || '',
            memiliki_disabilitas: result.data.memiliki_disabilitas || '',
            kontak_darurat_nama: result.data.kontak_darurat_nama || '',
            kontak_darurat_nomor: result.data.kontak_darurat_nomor || '',
            hubungan_darurat: result.data.hubungan_darurat || ''
          });
          setUserData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch health data:', error);
      }
    };

    if (user?.userId) {
      fetchHealthData();
    }
  }, [user]);

  const hasAnyData = () => {
    return !!(
      userData?.riwayat_penyakit ||
      userData?.memiliki_disabilitas ||
      userData?.kontak_darurat_nama ||
      userData?.kontak_darurat_nomor ||
      userData?.hubungan_darurat
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setHealthData({
      riwayat_penyakit: '',
      memiliki_disabilitas: '',
      kontak_darurat_nama: '',
      kontak_darurat_nomor: '',
      hubungan_darurat: ''
    });
    setIsFormVisible(true);
    setIsEditing(true);
  };

  const saveData = async () => {
    try {
      const url = userData 
        ? `${API_URL}/users/edit-health`
        : `${API_URL}/users/create-health`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...healthData,
          user_id: user?.userId
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Data kesehatan berhasil disimpan');
        setIsEditing(false);
        setUserData(healthData);
      } else {
        toast.error(result.error || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHealthData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Render editable form content
  const renderEditableForm = () => (
    <>
      {/* Riwayat Penyakit */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Riwayat Penyakit
        </label>
        <input
          type="text"
          name="riwayat_penyakit"
          value={healthData.riwayat_penyakit}
          onChange={handleChange}
          placeholder="Masukkan riwayat penyakit jika ada"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Jika ada penyakit kronis/alergi</p>
      </div>
      
      {/* Disabilitas */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Apakah memiliki disabilitas?
        </label>
        <select
          name="memiliki_disabilitas"
          value={healthData.memiliki_disabilitas}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          Nama Kontak Darurat
        </label>
        <input
          type="text"
          name="kontak_darurat_nama"
          value={healthData.kontak_darurat_nama}
          onChange={handleChange}
          placeholder="Nama kontak darurat"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Nama orang yang bisa dihubungi jika darurat</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kontak Darurat No. HP
        </label>
        <input
          type="text"
          name="kontak_darurat_nomor"
          value={healthData.kontak_darurat_nomor}
          onChange={handleChange}
          placeholder="Nomor HP kontak darurat"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Orang yang bisa dihubungi jika darurat</p>
      </div>
      
      {/* Hubungan dengan Kontak Darurat */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hubungan dengan Kontak Darurat
        </label>
        <select
          name="hubungan_darurat"
          value={healthData.hubungan_darurat}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Pilih Hubungan --</option>
          <option value="Orang tua">Orang Tua</option>
          <option value="Saudara">Saudara</option>
          <option value="Pasangan">Pasangan</option>
          <option value="Anak">Anak</option>
          <option value="Kerabat">Kerabat</option>
          <option value="Teman">Teman</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">Untuk verifikasi hubungan</p>
      </div>
    </>
  );

  // Render read-only data content
  const renderDataDisplay = () => (
    <div className="overflow-x-auto -mx-3 md:mx-0">
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium text-xs md:text-sm text-gray-700 w-1/3">Riwayat Penyakit</td>
            <td className="py-2 px-3 text-xs md:text-sm">{userData?.riwayat_penyakit || '-'}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium text-xs md:text-sm text-gray-700">Memiliki Disabilitas</td>
            <td className="py-2 px-3 text-xs md:text-sm">{userData?.memiliki_disabilitas || '-'}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium text-xs md:text-sm text-gray-700">Nama Kontak Darurat</td>
            <td className="py-2 px-3 text-xs md:text-sm">{userData?.kontak_darurat_nama || '-'}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium text-xs md:text-sm text-gray-700">Kontak Darurat</td>
            <td className="py-2 px-3 text-xs md:text-sm">{userData?.kontak_darurat_nomor || '-'}</td>
          </tr>
          <tr>
            <td className="py-2 px-3 font-medium text-xs md:text-sm text-gray-700">Hubungan dengan Kontak Darurat</td>
            <td className="py-2 px-3 text-xs md:text-sm">{userData?.hubungan_darurat || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <FormComponentBase
      title="Data Kesehatan dan Darurat"
      subtitle="Informasi kesehatan dan kontak darurat"
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
}