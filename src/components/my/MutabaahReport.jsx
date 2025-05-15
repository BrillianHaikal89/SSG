"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import { format, subDays, subWeeks, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulka'dah", "Dzulhijjah"
];

const MutabaahReport = ({ user, onClose }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredData, setFilteredData] = useState([]);

  const isFemale = user?.fullData?.jenis_kelamin === "0";

  useEffect(() => {
    const loadData = () => {
      try {
        const allData = [];
        const now = new Date();
        
        // Load data from localStorage for the past year
        for (let i = 0; i < 365; i++) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          const storageKey = `mutabaah_${user?.userId}_${dateString}`;
          const localData = localStorage.getItem(storageKey);
          
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              allData.push({
                ...parsedData,
                date: dateString,
                dateObj: new Date(dateString)
              });
            } catch (error) {
              console.error('Error parsing data for', dateString, error);
            }
          }
        }
        
        setReportData(allData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading report data:', error);
        toast.error('Gagal memuat data laporan');
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  useEffect(() => {
    if (!reportData.length) return;

    let filtered = [];

    switch (timeRange) {
      case 'day':
        filtered = reportData.filter(item => 
          isSameDay(new Date(item.date), selectedDate
        );
        break;
      case 'week':
        const weekStart = startOfWeek(selectedWeek, { locale: id });
        const weekEnd = endOfWeek(selectedWeek, { locale: id });
        filtered = reportData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= weekStart && itemDate <= weekEnd;
        });
        break;
      case 'month':
        const monthStart = startOfMonth(selectedMonth);
        const monthEnd = endOfMonth(selectedMonth);
        filtered = reportData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= monthStart && itemDate <= monthEnd;
        });
        break;
      case 'year':
        filtered = reportData.filter(item => 
          new Date(item.date).getFullYear() === selectedYear
        );
        break;
      default:
        filtered = reportData;
    }

    setFilteredData(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [reportData, timeRange, selectedDate, selectedWeek, selectedMonth, selectedYear]);

  const calculateHijriDate = (gregorianDate) => {
    try {
      const date = new Date(gregorianDate);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      let hDay = 1;
      let hMonthIndex = 10;
      const hYear = 1446;
      
      if (year === 2025 && month === 5) {
        const mayMapping = {
          1: 3, 2: 4, 3: 5, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10,
          9: 11, 10: 12, 11: 13, 12: 14, 13: 15, 14: 16,
          15: 17, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
          21: 23, 22: 24, 23: 25, 24: 26, 25: 27, 26: 28,
          27: 29, 28: 30, 29: 1, 30: 2, 31: 3
        };
        
        hDay = mayMapping[day] || day;
        
        if (day >= 29) {
          hMonthIndex = 11;
        }
      }
      else if (year === 2025 && month === 4) {
        const aprilMapping = {
          1: 3, 2: 4, 3: 5, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10,
          9: 11, 10: 12, 11: 13, 12: 14, 13: 15, 14: 16,
          15: 17, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
          21: 23, 22: 24, 23: 25, 24: 26, 25: 27, 26: 28,
          27: 29, 28: 30, 29: 1, 30: 2
        };
        
        hDay = aprilMapping[day] || day;
        
        if (day >= 29) {
          hMonthIndex = 10;
        } else {
          hMonthIndex = 9;
        }
      }
      else {
        const offset = day % 30;
        hDay = offset + 1;
      }
      
      return `${hDay} ${HIJRI_MONTHS[hMonthIndex]} ${hYear} H`;
    } catch (error) {
      console.error('Error calculating Hijri date:', error);
      return "1 Muharram 1446 H";
    }
  };

  const formatGregorianDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, dd MMMM yyyy', { locale: id });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const getDayName = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE', { locale: id });
    } catch (error) {
      console.error('Error getting day name:', error);
      return '';
    }
  };

  const renderSholatCell = (value, haid) => {
    if (haid) return <span className="text-red-500">-</span>;
    return value > 0 ? <span className="text-green-600">{value}</span> : <span className="text-red-500">0</span>;
  };

  const renderCheckboxCell = (value) => {
    return value ? (
      <span className="text-green-600">✓</span>
    ) : (
      <span className="text-red-500">✗</span>
    );
  };

  const renderDualCell = (value, completed, max) => {
    if (completed) return <span className="text-green-600">{max}</span>;
    return value > 0 ? <span className="text-blue-600">{value}</span> : <span className="text-red-500">0</span>;
  };

  const calculateStats = () => {
    if (!filteredData.length) return null;

    const stats = {
      totalDays: filteredData.length,
      sholatWajib: 0,
      sholatTahajud: 0,
      sholatDhuha: 0,
      sholatRawatib: 0,
      tilawahQuran: 0,
      terjemahQuran: 0,
      shaumSunnah: 0,
      dzikir: 0,
      istighfar: 0,
      sholawat: 0,
      mqPagi: 0,
      kajianAlHikam: 0,
      kajianMarifatullah: 0,
      haidDays: 0
    };

    filteredData.forEach(item => {
      if (item.haid) stats.haidDays++;
      if (!item.haid) {
        stats.sholatWajib += item.sholat_wajib || 0;
        if (item.sholat_tahajud) stats.sholatTahajud++;
        stats.sholatDhuha += item.sholat_dhuha || 0;
        stats.sholatRawatib += item.sholat_rawatib || 0;
      }
      if (item.tilawah_quran) stats.tilawahQuran++;
      if (item.terjemah_quran) stats.terjemahQuran++;
      if (!item.haid && item.shaum_sunnah) stats.shaumSunnah++;
      if (item.dzikir_pagi_petang) stats.dzikir++;
      stats.istighfar += item.istighfar_1000x || 0;
      stats.sholawat += item.sholawat_100x || 0;
      if (item.menyimak_mq_pagi) stats.mqPagi++;
      if (item.kajian_al_hikam) stats.kajianAlHikam++;
      if (item.kajian_marifatullah) stats.kajianMarifatullah++;
    });

    return stats;
  };

  const stats = calculateStats();

  const renderTimeRangeSelector = () => {
    switch (timeRange) {
      case 'day':
        return (
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="border rounded px-2 py-1"
          />
        );
      case 'week':
        return (
          <input
            type="week"
            value={format(selectedWeek, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedWeek(new Date(e.target.value))}
            className="border rounded px-2 py-1"
          />
        );
      case 'month':
        return (
          <input
            type="month"
            value={format(selectedMonth, 'yyyy-MM')}
            onChange={(e) => setSelectedMonth(new Date(e.target.value))}
            className="border rounded px-2 py-1"
          />
        );
      case 'year':
        return (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Laporan Mutaba'ah Yaumiyah</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Waktu:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="day">Harian</option>
                <option value="week">Mingguan</option>
                <option value="month">Bulanan</option>
                <option value="year">Tahunan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Periode:</label>
              {renderTimeRangeSelector()}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p>Memuat data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-8 text-center">
            <p>Tidak ada data untuk periode yang dipilih</p>
          </div>
        ) : (
          <div className="p-4">
            {stats && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Statistik</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Total Hari</p>
                    <p className="text-xl font-bold">{stats.totalDays}</p>
                  </div>
                  {isFemale && (
                    <div className="bg-white p-3 rounded shadow">
                      <p className="text-sm text-gray-500">Hari Haid</p>
                      <p className="text-xl font-bold">{stats.haidDays}</p>
                    </div>
                  )}
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Sholat Wajib</p>
                    <p className="text-xl font-bold">{stats.sholatWajib}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Sholat Tahajud</p>
                    <p className="text-xl font-bold">{stats.sholatTahajud}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Tilawah Quran</p>
                    <p className="text-xl font-bold">{stats.tilawahQuran}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Dzikir</p>
                    <p className="text-xl font-bold">{stats.dzikir}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Istighfar</p>
                    <p className="text-xl font-bold">{stats.istighfar}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Sholawat</p>
                    <p className="text-xl font-bold">{stats.sholawat}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hijriah</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sholat Wajib</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahajud</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dhuha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rawatib</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tilawah</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terjemah</th>
                    {isFemale && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Haid</th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dzikir</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Istighfar</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sholawat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MQ Pagi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {formatGregorianDate(item.date)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {calculateHijriDate(item.date)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {renderSholatCell(item.sholat_wajib, item.haid)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {item.haid ? (
                          <span className="text-red-500">-</span>
                        ) : (
                          renderCheckboxCell(item.sholat_tahajud)
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {renderSholatCell(item.sholat_dhuha, item.haid)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {renderSholatCell(item.sholat_rawatib, item.haid)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {renderCheckboxCell(item.tilawah_quran)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {renderCheckboxCell(item.terjemah_quran)}
                      </td>
                      {isFemale && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                          {renderCheckboxCell(item.haid)}
                        </td>
                      )}
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {renderCheckboxCell(item.dzikir_pagi_petang)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {renderDualCell(item.istighfar_1000x, item.istighfar_completed, 1000)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {renderDualCell(item.sholawat_100x, item.sholawat_completed, 100)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        {renderCheckboxCell(item.menyimak_mq_pagi)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MutabaahReport;