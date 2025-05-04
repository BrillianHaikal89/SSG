"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * MutabaahReport Component
 * Displays and manages reporting functionality for Mutaba'ah Yaumiyah data
 * Updated to fetch data from API endpoint
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.user - User object containing user data
 * @param {Function} props.onClose - Function to call when closing the modal
 */
const MutabaahReport = ({ user, onClose }) => {
  // State management
  const [allUserData, setAllUserData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [year, setYear] = useState(new Date().getFullYear()); // Current year

  // Available months for selection
  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  // Generate years for dropdown (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);

  // Fetch user data when component mounts or when month/year changes
  useEffect(() => {
    if (user?.userId) {
      fetchIbadahData();
    }
  }, [user, month, year]);

  /**
   * Fetch ibadah data from API endpoint
   */
  const fetchIbadahData = async () => {
    try {
      setLoadingReport(true);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/users/get-ibadah-month?user_id=${user.userId}&month=${month}&year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          }
        });
      
      const result = await response.json();
      console.log("my", result);
      
      if (response.ok && result.status === 'success') {
        // Process and normalize the data from the API
        const processedData = Array.isArray(result.data) ? result.data : [result.data];
        
        // Ensure boolean fields are properly formatted
        const normalizedData = processedData.map(item => ({
          ...item,
          date: item.date || item.created_at, // Use appropriate date field
          sholat_wajib: Number(item.sholat_wajib) || 0,
          sholat_tahajud: Boolean(item.sholat_tahajud),
          sholat_dhuha: Number(item.sholat_dhuha) || 0,
          sholat_rawatib: Number(item.sholat_rawatib) || 0,
          sholat_sunnah_lainnya: Number(item.sholat_sunnah_lainnya) || 0,
          tilawah_quran: Boolean(item.tilawah_quran),
          terjemah_quran: Boolean(item.terjemah_quran),
          shaum_sunnah: Boolean(item.shaum_sunnah),
          shodaqoh: Boolean(item.shodaqoh),
          dzikir_pagi_petang: Boolean(item.dzikir_pagi_petang),
          istighfar_1000x: Number(item.istighfar_1000x) || 0,
          sholawat_100x: Number(item.sholawat_100x) || 0,
          menyimak_mq_pagi: Boolean(item.menyimak_mq_pagi),
          haid: Boolean(item.haid)
        }));
        
        // Sort by date descending
        normalizedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllUserData(normalizedData);
      } else {
        // Handle empty data case
        setAllUserData([]);
        if (result.status === 'not_found') {
          toast.info(result.message || 'Tidak ada data untuk periode yang dipilih');
        } else {
          toast.error(result.message || 'Gagal mengambil data laporan');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error(error.message || 'Gagal mengambil data laporan');
      setAllUserData([]);
    } finally {
      setLoadingReport(false);
    }
  };

  /**
   * Download report as CSV
   */
  const downloadReport = () => {
    try {
      // Create CSV content
      let csvContent = "Laporan Lengkap Mutaba'ah Yaumiyah\n\n";
      csvContent += `Nama,${user?.name || '-'}\n`;
      csvContent += `Periode,${months.find(m => m.value === month)?.label} ${year}\n`;
      csvContent += `Tanggal Laporan,${new Date().toLocaleDateString('id-ID')}\n`;
      csvContent += `Total Data,${allUserData.length}\n\n`;

      // Add headers
      csvContent += "Tanggal,Sholat Wajib,Sholat Tahajud,Sholat Dhuha,Sholat Rawatib,Sholat Sunnah Lainnya,";
      csvContent += "Tilawah Quran,Terjemah Quran,Shaum Sunnah,Shodaqoh,Dzikir Pagi/Petang,";
      csvContent += "Istighfar (x100),Sholawat (x100),Menyimak MQ Pagi,Status Haid\n";

      // Add data rows - with checkboxes shown as "Ya" or "Tidak"
      allUserData.forEach(data => {
        csvContent += `${new Date(data.date).toLocaleDateString('id-ID')},${data.sholat_wajib},${data.sholat_tahajud ? "Ya" : "Tidak"},${data.sholat_dhuha},`;
        csvContent += `${data.sholat_rawatib},${data.sholat_sunnah_lainnya},${data.tilawah_quran ? "Ya" : "Tidak"},`;
        csvContent += `${data.terjemah_quran ? "Ya" : "Tidak"},${data.shaum_sunnah ? "Ya" : "Tidak"},${data.shodaqoh ? "Ya" : "Tidak"},`;
        csvContent += `${data.dzikir_pagi_petang ? "Ya" : "Tidak"},${data.istighfar_1000x},${data.sholawat_100x},`;
        csvContent += `${data.menyimak_mq_pagi ? "Ya" : "Tidak"},${data.haid ? "Ya" : "Tidak"}\n`;
      });

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `laporan_mutabaah_${user?.name || 'user'}_${months.find(m => m.value === month)?.label}_${year}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Gagal mengunduh laporan');
    }
  };

  // Calculate statistics for the report summary
  const calculateStatistics = () => {
    const totalEntries = allUserData.length || 1;
    const avgSholatWajib = (
      allUserData.reduce((sum, data) => sum + Number(data.sholat_wajib), 0) / totalEntries
    ).toFixed(1);
    
    // Count completed days for checkbox items
    const tahajudDays = allUserData.filter(data => data.sholat_tahajud).length;
    const tilawahDays = allUserData.filter(data => data.tilawah_quran).length;
    const terjemahDays = allUserData.filter(data => data.terjemah_quran).length;
    const haidDays = allUserData.filter(data => data.haid).length;
    
    return { 
      avgSholatWajib, 
      tahajudDays, 
      tilawahDays, 
      terjemahDays, 
      haidDays
    };
  };

  const stats = calculateStatistics();

  // Handle month change
  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value, 10));
  };

  // Handle year change
  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value, 10));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Laporan Lengkap Mutaba'ah Yaumiyah</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Report Info */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Nama:</span>
              <span>{user?.name || '-'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Periode:</span>
              <div className="flex space-x-2">
                <select 
                  value={month}
                  onChange={handleMonthChange}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <select 
                  value={year}
                  onChange={handleYearChange}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
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

          {/* Report Content */}
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
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tilawah Quran</th>
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
                              {/* Display checkmark/X for boolean values */}
                              {data.sholat_tahajud ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-red-600">✗</span>
                              )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {data.tilawah_quran ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-red-600">✗</span>
                              )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {data.menyimak_mq_pagi ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-red-600">✗</span>
                              )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {data.haid ? 'Ya' : 'Tidak'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Report Statistics */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-lg mb-3">Statistik Ringkasan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-800">Sholat Wajib (Rata-rata)</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {stats.avgSholatWajib}/5
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-800">Tahajud (Hari)</div>
                        <div className="text-2xl font-bold text-green-600">
                          {stats.tahajudDays}/{allUserData.length}
                        </div>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-sm text-indigo-800">Tilawah Quran (Hari)</div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {stats.tilawahDays}/{allUserData.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada data laporan yang tersedia untuk periode {months.find(m => m.value === month)?.label} {year}
                </div>
              )}
            </>
          )}
          
          {/* Modal Footer */}
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
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
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
