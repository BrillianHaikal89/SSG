// components/my/MutabaahReport.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MutabaahReport = ({ user, onClose }) => {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filteredData, setFilteredData] = useState([]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/users/report-my?user_id=${user.userId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data laporan');
        }

        const data = await response.json();
        setReportData(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast.error(error.message || 'Gagal mengambil data laporan');
        
        // Try to get data from localStorage as fallback
        const localData = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith(`mutabaah_${user.userId}_`)) {
            const item = JSON.parse(localStorage.getItem(key));
            localData.push(item);
          }
        }
        
        if (localData.length > 0) {
          setReportData(localData);
          setFilteredData(localData);
          toast.success('Menampilkan data dari penyimpanan lokal');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.userId) {
      fetchReportData();
    }
  }, [user]);

  // Filter data based on date range
  useEffect(() => {
    if (reportData.length > 0) {
      const filtered = reportData.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredData(filtered);
    }
  }, [dateRange, reportData]);

  // Calculate summary statistics
  const calculateStats = () => {
    const stats = {
      totalDays: filteredData.length,
      sholatWajib: { total: 0, perfectDays: 0 },
      sholatTahajud: { total: 0 },
      sholatDhuha: { total: 0 },
      tilawahQuran: { total: 0 },
      dzikirPagiPetang: { total: 0 }
    };

    filteredData.forEach(item => {
      stats.sholatWajib.total += item.sholat_wajib || 0;
      if (item.sholat_wajib === 5) stats.sholatWajib.perfectDays++;
      
      if (item.sholat_tahajud) stats.sholatTahajud.total++;
      if (item.sholat_dhuha > 0) stats.sholatDhuha.total += item.sholat_dhuha;
      if (item.tilawah_quran) stats.tilawahQuran.total++;
      if (item.dzikir_pagi_petang) stats.dzikirPagiPetang.total++;
    });

    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Laporan Mutaba'ah Yaumiyah</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Date Range Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data untuk rentang tanggal yang dipilih
            </div>
          ) : (
            <>
              {/* Summary Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-3">Ringkasan Aktivitas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded shadow">
                    <div className="text-sm text-gray-500">Total Hari</div>
                    <div className="text-2xl font-bold">{stats.totalDays}</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <div className="text-sm text-gray-500">Sholat Wajib 5x</div>
                    <div className="text-2xl font-bold">{stats.sholatWajib.perfectDays} <span className="text-sm">hari</span></div>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <div className="text-sm text-gray-500">Sholat Tahajud</div>
                    <div className="text-2xl font-bold">{stats.sholatTahajud.total} <span className="text-sm">hari</span></div>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <div className="text-sm text-gray-500">Tilawah Quran</div>
                    <div className="text-2xl font-bold">{stats.tilawahQuran.total} <span className="text-sm">hari</span></div>
                  </div>
                </div>
              </div>

              {/* Detailed Report */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Detail Aktivitas Harian</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-4 py-3">Tanggal</th>
                        <th className="px-4 py-3">Sholat Wajib</th>
                        <th className="px-4 py-3">Tahajud</th>
                        <th className="px-4 py-3">Dhuha</th>
                        <th className="px-4 py-3">Tilawah</th>
                        <th className="px-4 py-3">Dzikir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(item.date)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 ${item.sholat_wajib === 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.sholat_wajib || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {item.sholat_tahajud ? (
                              <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-800 text-center leading-6">✓</span>
                            ) : (
                              <span className="inline-block w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-center leading-6">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {item.sholat_dhuha > 0 ? (
                              <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800">{item.sholat_dhuha}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {item.tilawah_quran ? (
                              <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-800 text-center leading-6">✓</span>
                            ) : (
                              <span className="inline-block w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-center leading-6">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {item.dzikir_pagi_petang ? (
                              <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-800 text-center leading-6">✓</span>
                            ) : (
                              <span className="inline-block w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-center leading-6">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutabaahReport;