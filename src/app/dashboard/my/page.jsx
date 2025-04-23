"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';

export default function MutabahYaumiyahPage() {
  const router = useRouter();
  const { user, userId } = useAuthStore();
  const today = new Date().toISOString().split('T')[0];

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
    menyimak_mq_pagi: 0
  });

  const handleInputChange = (field, value) => {
    // Convert input to number and ensure it's not negative
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleRouteBacke = () =>{
    router.push('/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3333/api/users/input-my', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.userId,
          ...formData
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan data');
      }
      
      toast.success(result.message || 'Data Mutabaah Yaumiyah berhasil disimpan!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Gagal menyimpan data');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Mutaba'ah Yaumiyah</h1>
          <p className="text-center mt-2">At-Taqwa dan As-Sunnah</p>
          <p className="text-center font-medium mt-1">{user?.name || 'Pengguna'}</p>
        </div>

        <div className="p-6">
          {/* Form Tanggal */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Tanggal
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Bagian 1.1 - Sholat Wajib dan Sunnah */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-green-700 border-b pb-2">1.1 Sholat Wajib dan Sunnah</h2>
            
            <div className="space-y-4">
              {[
                { label: "Sholat Wajib 5 waktu", field: "sholat_wajib", max: 5 },
                { label: "Sholat Tahajud & atau Witir 3 rakaat/hari", field: "sholat_tahajud", max: 10 },
                { label: "Sholat Dhuha 4 rakaat", field: "sholat_dhuha", max: 8 },
                { label: "Sholat Rawatib 10 rakaat", field: "sholat_rawatib", max: 12 },
                { label: "Sholat Sunnah Lainnya 6 rakaat", field: "sholat_sunnah_lainnya", max: 10 },
                { label: "Tilawah Quran (halaman)", field: "tilawah_quran", max: 100 },
                { label: "Terjemah Quran (halaman)", field: "terjemah_quran", max: 50 },
                { label: "Shaum Sunnah (hari)", field: "shaum_sunnah", max: 5 },
                { label: "Shadaqah Masjid (kali)", field: "shodaqoh", max: 5 },
                { label: "Dzikir Pagi/Petang (kali)", field: "dzikir_pagi_petang", max: 2 },
                { label: "Istighfar (x100)", field: "istighfar_1000x", max: 15 },
                { label: "Sholawat (x100)", field: "sholawat_100x", max: 15 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item.label}</span>
                  <input
                    type="number"
                    min="0"
                    max={item.max}
                    value={formData[item.field]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    className="shadow border rounded py-2 px-3 w-20 text-gray-700 focus:outline-none focus:shadow-outline"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bagian 2.1 - Menyimak MQ Pagi */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-green-700 border-b pb-2">2.1 Menyimak MQ Pagi</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Aktifitas</h3>
                <p className="text-gray-600">Menyimak MQ Pagi</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <span className="font-medium text-gray-700">Jumlah</span>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={formData.menyimak_mq_pagi}
                  onChange={(e) => handleInputChange('menyimak_mq_pagi', e.target.value)}
                  className="shadow border rounded py-2 px-3 w-20 text-gray-700 focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 mr-8"
            >
              Simpan
            </button>

            <button
              onClick={handleRouteBacke}
              className="bg-red-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150"
            >
              kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}