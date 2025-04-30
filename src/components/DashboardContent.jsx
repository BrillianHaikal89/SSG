import React from 'react';
import useAuthStore from '../stores/authStore';

const DashboardContent = ({ 
  userData, 
  navigateToMY, 
  navigateToPresensi,
  navigateToTugas,
  navigateToAlQuran,
  navigateToProfile,
  navigateToECard,
  navigateToPeserta,
  navigateToScan
}) => {
  const { role } = useAuthStore();
  
  return (
    <main className="flex-1 overflow-y-auto py-4 px-2 md:px-4 lg:px-6 pb-16 transition-all duration-300">
      {/* Kontainer utama dengan grid responsif */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Progress MY Card - Responsif */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium mb-2">Progres MY</h3>
          <div className="mb-2 flex justify-between text-xs text-gray-600">
            <span>Diselesaikan: {userData.taskCompleted}/{userData.taskTotal}</span>
            <span>{userData.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-orange-400 h-2.5 rounded-full" 
              style={{width: `${userData.completionRate}%`}}
            ></div>
          </div>
        </div>

        {/* Jadwal dan Search - Responsif */}
        <div className="md:col-span-2 lg:col-span-2 flex flex-col md:flex-row gap-4">
          {/* Jadwal Card */}
          <div className="flex-grow bg-blue-900 text-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-semibold">Jadwal Hari ini</h3>
                <p className="text-xs mt-1">Selasa, 18 Maret</p>
              </div>
              <button 
                className="bg-white text-blue-900 px-3 py-1 rounded-full text-xs"
                onClick={() => console.log('Lihat Jadwal')}
              >
                Lihat Detail
              </button>
            </div>
            
            <div className="space-y-2">
              {[
                { title: "Agama", detail: "Sholat Lima Waktu" },
                { title: "BTQ", detail: "Baca Surat An-naba" },
                { title: "Tataboga", detail: "Masak Telur" }
              ].map((item, index) => (
                <div key={index} className="bg-blue-800 rounded-lg p-2">
                  <h4 className="text-xs font-medium">{item.title}</h4>
                  <p className="text-xs text-blue-200">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search Box - Mobile Friendly */}
          <div className="w-full md:w-64 lg:w-80">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Pencarian..." 
                className="w-full bg-gray-100 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Pengumuman Section - Responsive Grid */}
        <div className="bg-orange-300 rounded-lg shadow-sm p-4 md:col-span-2 lg:col-span-3">
          <h3 className="font-bold text-sm mb-3">Pengumuman</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Kerja Bakti Sosial", detail: "Kegiatan Bakti Sosial di Masjid Agung Sumedang", date: "15 Maret 2025" },
              { title: "Kerja Bakti Sosial", detail: "Kegiatan Bakti Sosial di Masjid Agung Sumedang", date: "15 Maret 2025" },
              { title: "Kerja Bakti Sosial", detail: "Kegiatan Bakti Sosial di Masjid Agung Sumedang", date: "15 Maret 2025" }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-3">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-gray-700">{item.detail}</p>
                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Akses Cepat - Responsive Grid */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:col-span-2 lg:col-span-3">
          <h3 className="font-medium text-sm mb-4">Akses Cepat</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {[
              { icon: "calendar", label: "Rundown", action: () => {} },
              { icon: "tasks", label: "Tugas", action: navigateToTugas },
              { icon: "quran", label: "Al-Quran", action: navigateToAlQuran },
              { icon: "check", label: "Presensi", action: navigateToPresensi },
              { icon: "user", label: "Profile", action: navigateToProfile },
              { icon: "qr", label: "Scan QR", action: navigateToScan, roleRequired: '2a' },
              { icon: "card", label: "E-Card", action: navigateToECard, roleRequired: '1a' },
              { icon: "users", label: "Peserta", action: navigateToPeserta, roleRequired: '0a' }
            ].filter(item => !item.roleRequired || role === item.roleRequired).map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={item.action}
              >
                <div className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center text-orange-500 mb-1">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    {item.icon === "calendar" && (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    )}
                    {/* Tambahkan icon lain sesuai kebutuhan */}
                  </svg>
                </div>
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;