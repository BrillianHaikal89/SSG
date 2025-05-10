"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulka'dah", "Dzulhijjah"
];

const MutabaahReport = ({ user, onClose }) => {
  // State Management
  const [allUserData, setAllUserData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // Data Options
  const months = [
    { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' }, { value: 4, label: 'April' },
    { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' }, { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' }, { value: 12, label: 'Desember' }
  ];

  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 5 + i);
  const isFemale = user?.gender === 'female';

  // Fetch Data
  useEffect(() => {
    if (user?.userId) fetchIbadahData();
  }, [user, month, year]);

  const fetchIbadahData = async () => {
    try {
      setLoadingReport(true);
      const response = await fetch(
        `/api/get-ibadah-data?user_id=${user.userId}&month=${month}&year=${year}`
      );
      
      if (!response.ok) throw new Error('Gagal mengambil data');
      
      const result = await response.json();
      setAllUserData(normalizeData(result.data));
    } catch (error) {
      toast.error(error.message);
      setAllUserData([]);
    } finally {
      setLoadingReport(false);
    }
  };

  const normalizeData = (data) => {
    return (Array.isArray(data) ? data : [data]).map(item => ({
      ...item,
      date: item.date || item.created_at,
      sholat_wajib: Number(item.sholat_wajib) || 0,
      sholat_tahajud: item.sholat_tahajud ? 1 : 0,
      sholat_dhuha: Number(item.sholat_dhuha) || 0,
      sholat_rawatib: Number(item.sholat_rawatib) || 0,
      tilawah_quran: item.tilawah_quran ? 1 : 0,
      terjemah_quran: item.terjemah_quran ? 1 : 0,
      shaum_sunnah: item.shaum_sunnah ? 1 : 0,
      shodaqoh: item.shodaqoh ? 1 : 0,
      dzikir_pagi_petang: item.dzikir_pagi_petang ? 1 : 0,
      istighfar_1000x: Number(item.istighfar_1000x) || 0,
      istighfar_completed: item.istighfar_completed || false,
      sholawat_100x: Number(item.sholawat_100x) || 0,
      sholawat_completed: item.sholawat_completed || false,
      menyimak_mq_pagi: item.menyimak_mq_pagi ? 1 : 0,
      kajian_al_hikam: item.kajian_al_hikam ? 1 : 0,
      kajian_marifatullah: item.kajian_marifatullah ? 1 : 0,
      haid: item.haid ? 1 : 0
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Download CSV
  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      toast.loading('Menyiapkan laporan...');

      const response = await fetch('/api/my/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { name: user?.name || 'User', isFemale },
          period: { month, year },
          data: allUserData
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mengunduh');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mutabaah-${user?.name || 'user'}-${month}-${year}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success('Laporan berhasil diunduh!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsDownloading(false);
      toast.dismiss();
    }
  };

  // Statistics Calculation
  const calculateStatistics = () => {
    if (allUserData.length === 0) return {
      avgSholatWajib: '0.0',
      tahajudDays: 0,
      tilawahDays: 0,
      dhuhaDays: 0,
      shaumDays: 0,
      haidDays: 0
    };

    const totalDays = allUserData.length;
    return {
      avgSholatWajib: (allUserData.reduce((sum, d) => sum + d.sholat_wajib, 0) / totalDays,
      tahajudDays: allUserData.filter(d => d.sholat_tahajud).length,
      tilawahDays: allUserData.filter(d => d.tilawah_quran).length,
      dhuhaDays: allUserData.filter(d => d.sholat_dhuha).length,
      shaumDays: allUserData.filter(d => d.shaum_sunnah).length,
      haidDays: allUserData.filter(d => d.haid).length
    };
  };

  const stats = calculateStatistics();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Laporan Mutaba'ah</h3>
            <button onClick={onClose} disabled={isDownloading} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {loadingReport ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : allUserData.length > 0 ? (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sholat Wajib</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahajud</th>
                      {isFemale && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Haid</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allUserData.map((item, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {item.sholat_wajib}/5
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {item.sholat_tahajud ? '✓' : '✗'}
                        </td>
                        {isFemale && (
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {item.haid ? '✗' : '✓'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-800">Rata-rata Sholat Wajib</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.avgSholatWajib.toFixed(1)}/5
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-800">Hari Tahajud</div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.tahajudDays}/{allUserData.length}
                  </div>
                </div>
                {isFemale && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-sm text-red-800">Hari Haid</div>
                    <div className="text-2xl font-bold text-red-600">
                      {stats.haidDays}/{allUserData.length}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data untuk periode ini
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {allUserData.length > 0 && (
              <button
                onClick={downloadReport}
                disabled={loadingReport || isDownloading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isDownloading ? 'Mengunduh...' : 'Download CSV'}
              </button>
            )}
            <button
              onClick={onClose}
              disabled={isDownloading}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
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