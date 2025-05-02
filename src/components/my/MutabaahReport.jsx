"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

const MutabaahReport = ({ user, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hijriMonth, setHijriMonth] = useState("");
  const [hijriYear, setHijriYear] = useState("");

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const calculateHijriDate = (gregorianDate) => {
    try {
      const date = new Date(gregorianDate);
      date.setHours(12, 0, 0, 0);
      
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      let jd = Math.floor((365.25 * (year + 4716)) + Math.floor((30.6001 * (month + 1))) + day - 1524.5);
      
      if (date > new Date(1582, 9, 4)) {
        const a = Math.floor(year / 100);
        jd = jd + 2 - a + Math.floor(a / 4);
      }
      
      const b = Math.floor(((jd - 1867216.25) / 36524.25));
      const c = jd + b - Math.floor(b / 4) + 1525;
      const days = Math.floor(jd - 1948084);
      const hijriYear = Math.floor((days * 30 + 10646) / 10631);
      const daysInYear = Math.floor(((hijriYear - 1) * 10631 + 10646) / 30);
      const dayOfYear = days - daysInYear;
      const daysPassed = dayOfYear;
      const hijriMonth = Math.min(Math.floor(daysPassed / 29.53), 11);
      const hijriDay = Math.floor(daysPassed - (hijriMonth * 29.53)) + 1;
      
      return {
        day: Math.round(hijriDay),
        month: hijriMonth,
        year: hijriYear,
        formatted: `${Math.round(hijriDay)} ${HIJRI_MONTHS[hijriMonth]} ${hijriYear} H`
      };
    } catch (error) {
      console.error('Error calculating Hijri date:', error);
      return { 
        day: 1, 
        month: 0, 
        year: 1443, 
        formatted: "1 Muharram 1443 H" 
      };
    }
  };

  const getHijriMonthYear = (dateString) => {
    try {
      const hijriDate = calculateHijriDate(dateString);
      return {
        month: hijriDate.month,
        year: hijriDate.year,
        formatted: `${HIJRI_MONTHS[hijriDate.month]} ${hijriDate.year} H`
      };
    } catch (error) {
      console.error('Error getting Hijri month year:', error);
      return {
        month: 0,
        year: 1443,
        formatted: "Muharram 1443 H"
      };
    }
  };

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/users/report-my?userId=${user.userId}&month=${selectedMonth}&year=${selectedYear}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();
      setReportData(data);

      // Calculate Hijri month and year from the first date in the report
      if (data.length > 0) {
        const hijriInfo = getHijriMonthYear(data[0].date);
        setHijriMonth(hijriInfo.month);
        setHijriYear(hijriInfo.year);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Gagal memuat data laporan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user, selectedMonth, selectedYear]);

  const calculatePercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const calculateMonthlyStats = () => {
    const stats = {
      sholat_wajib: { total: 0, max: 0 },
      sholat_tahajud: { total: 0, max: 0 },
      sholat_dhuha: { total: 0, max: 0 },
      sholat_rawatib: { total: 0, max: 0 },
      tilawah_quran: { total: 0, max: 0 },
      terjemah_quran: { total: 0, max: 0 },
      shaum_sunnah: { total: 0, max: 0 },
      dzikir_pagi_petang: { total: 0, max: 0 },
      menyimak_mq_pagi: { total: 0, max: 0 }
    };

    reportData.forEach(entry => {
      stats.sholat_wajib.total += entry.sholat_wajib || 0;
      stats.sholat_wajib.max += 5;
      
      stats.sholat_tahajud.total += entry.sholat_tahajud ? 1 : 0;
      stats.sholat_tahajud.max += 1;
      
      stats.sholat_dhuha.total += entry.sholat_dhuha || 0;
      stats.sholat_dhuha.max += 4;
      
      stats.sholat_rawatib.total += entry.sholat_rawatib || 0;
      stats.sholat_rawatib.max += 12;
      
      stats.tilawah_quran.total += entry.tilawah_quran ? 1 : 0;
      stats.tilawah_quran.max += 1;
      
      stats.terjemah_quran.total += entry.terjemah_quran ? 1 : 0;
      stats.terjemah_quran.max += 1;
      
      stats.shaum_sunnah.total += entry.shaum_sunnah ? 1 : 0;
      stats.shaum_sunnah.max += 1;
      
      stats.dzikir_pagi_petang.total += entry.dzikir_pagi_petang ? 1 : 0;
      stats.dzikir_pagi_petang.max += 1;
      
      stats.menyimak_mq_pagi.total += entry.menyimak_mq_pagi ? 1 : 0;
      stats.menyimak_mq_pagi.max += 1;
    });

    return stats;
  };

  const monthlyStats = calculateMonthlyStats();

  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: new Date(2000, i, 1).toLocaleDateString('id-ID', { month: 'long' })
    }));
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => ({
      value: currentYear - i,
      label: currentYear - i
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-700">Laporan Mutaba'ah Yaumiyah</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  {generateMonthOptions().map((month) => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  {generateYearOptions().map((year) => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-md mb-4">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Periode:</span> {new Date(selectedYear, selectedMonth - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                {hijriMonth !== "" && hijriYear !== "" && (
                  <span className="ml-2">({HIJRI_MONTHS[hijriMonth]} {hijriYear} H)</span>
                )}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : reportData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data mutabaah untuk periode ini
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-green-700">Statistik Bulanan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Sholat Wajib</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${calculatePercentage(monthlyStats.sholat_wajib.total, monthlyStats.sholat_wajib.max)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-700">
                        {calculatePercentage(monthlyStats.sholat_wajib.total, monthlyStats.sholat_wajib.max)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {monthlyStats.sholat_wajib.total} dari {monthlyStats.sholat_wajib.max} waktu
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Sholat Tahajud</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${calculatePercentage(monthlyStats.sholat_tahajud.total, monthlyStats.sholat_tahajud.max)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-700">
                        {calculatePercentage(monthlyStats.sholat_tahajud.total, monthlyStats.sholat_tahajud.max)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {monthlyStats.sholat_tahajud.total} dari {monthlyStats.sholat_tahajud.max} hari
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tilawah Quran</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${calculatePercentage(monthlyStats.tilawah_quran.total, monthlyStats.tilawah_quran.max)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-700">
                        {calculatePercentage(monthlyStats.tilawah_quran.total, monthlyStats.tilawah_quran.max)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {monthlyStats.tilawah_quran.total} dari {monthlyStats.tilawah_quran.max} hari
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4 text-green-700">Detail Harian</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sholat Wajib</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahajud</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tilawah</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MQ Pagi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((entry, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(entry.date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {entry.sholat_wajib || 0}/5
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {entry.sholat_tahajud ? '✓' : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {entry.tilawah_quran ? '✓' : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {entry.menyimak_mq_pagi ? '✓' : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
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