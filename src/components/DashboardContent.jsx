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
    <main className="flex-1 overflow-y-auto py-4 px-4 md:px-6 pb-16 transition-all duration-300">
      {/* Progress MY Card */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
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

      {/* Jadwal and Search Row */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        {/* Jadwal Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm flex-grow">
          <div className="bg-blue-900 text-white p-4 w-48 flex flex-col justify-center">
            <h3 className="text-sm font-semibold">Jadwal Hari ini</h3>
            <p className="text-xs mt-1">Selasa, 18 Maret</p>
          </div>
          <div className="bg-blue-100 p-4 flex-grow">
            <h3 className="text-blue-900 font-medium text-sm">TUGAS</h3>
            <ol className="text-xs space-y-1 mt-2">
              <li>
                <span className="font-medium">1. Agama</span><br/>
                <span className="text-gray-700">Sholat Lima Waktu</span>
              </li>
              <li>
                <span className="font-medium">2. BTQ</span><br/>
                <span className="text-gray-700">Baca Surat An-naba</span>
              </li>
              <li>
                <span className="font-medium">3. Tataboga</span><br/>
                <span className="text-gray-700">Masak Telur</span>
              </li>
            </ol>
            <div className="mt-2 flex justify-end">
              <button className="bg-blue-900 text-white text-xs px-3 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Lihat Jadwal
              </button>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="flex flex-col w-full md:w-80">
          <div className="relative mb-3">
            <input 
              type="text" 
              placeholder="Pencarian..." 
              className="w-full bg-gray-100 rounded-lg px-4 py-2 pl-3 pr-10 focus:outline-none shadow-sm"
            />
            <button className="absolute right-3 top-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Pengumuman Section */}
      <div className="bg-orange-300 rounded-lg shadow-sm mb-4 p-4">
        <h3 className="font-bold text-sm">Pengumuman</h3>
        
        <div className="mt-2 p-3 bg-white rounded-lg mb-2">
          <p className="font-medium text-sm">Kerja Bakti Sosial</p>
          <p className="text-xs text-gray-700">Kegiatan Bakti Sosial di Masjid Agung Sumedang</p>
          <p className="text-xs text-gray-500 mt-1">15 Maret 2025</p>
        </div>
        
        <div className="mt-2 p-3 bg-white rounded-lg">
          <p className="font-medium text-sm">Kerja Bakti Sosial</p>
          <p className="text-xs text-gray-700">Kegiatan Bakti Sosial di Masjid Agung Sumedang</p>
          <p className="text-xs text-gray-500 mt-1">15 Maret 2025</p>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <h3 className="font-medium text-sm mb-4">Akses Cepat</h3>
        <div className="grid grid-cols-4 gap-4">
          {/* Rundown */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Rundown</span>
          </div>
          
          {/* Tugas */}
          <div className="flex flex-col items-center cursor-pointer" onClick={navigateToTugas}>
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Tugas</span>
          </div>
          
          {/* Al-Quran */}
          <div className="flex flex-col items-center cursor-pointer" onClick={navigateToAlQuran}>
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Al-Quran</span>
          </div>
          
          {/* BAP/LAJ */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">BAP/LAJ</span>
          </div>
          
          {/* Presensi */}
          <div className="flex flex-col items-center cursor-pointer" onClick={navigateToPresensi}>
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Presensi</span>
          </div>
          
          {/* Nilai */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Nilai</span>
          </div>
          
          {/* MY */}
          <div className="flex flex-col items-center cursor-pointer" onClick={navigateToMY}>
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">MY</span>
          </div>
          
          {/* E-Card */}
          <div className="flex flex-col items-center cursor-pointer" onClick={navigateToECard}>
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">E-Card</span>
          </div>

          {/* Peserta */}
          <div className="flex flex-col items-center cursor-pointer" onClick={navigateToPeserta}>
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Peserta</span>
          </div>

          {/* Scan QR (only for role 2a) - Placed next to Peserta */}
            <div className="flex flex-col items-center cursor-pointer" onClick={navigateToScan}>
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">Scan QR</span>
            </div>
        </div>
      </div>

      {/* Progress Al-Quran */}
      <div className="bg-green-50 rounded-lg shadow-sm mb-6 p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-medium">Progress Al-Quran</h2>
          </div>
          <button 
            className="bg-green-500 text-white px-4 py-1 rounded-lg text-sm font-medium"
            onClick={navigateToAlQuran}
          >
            Lanjutkan Membaca
          </button>
        </div>
        
        <div className="flex mb-2">
          <div className="grid grid-cols-3 gap-4 w-full">
            <div>
              <p className="text-xs text-gray-500">Juz</p>
              <p className="font-medium">{userData.quranProgress.juz}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Surat</p>
              <p className="font-medium">{userData.quranProgress.surah}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Halaman</p>
              <p className="font-medium">{userData.quranProgress.page}</p>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          Terakhir Dibaca: {userData.quranProgress.lastRead}
        </p>
      </div>
    </main>
  );
};

export default DashboardContent;