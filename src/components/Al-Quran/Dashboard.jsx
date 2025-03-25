"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Dashboard = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // State for selected surah and ayat
  const [selectedSurah, setSelectedSurah] = useState("");
  const [selectedAyat, setSelectedAyat] = useState("");
  const [searchText, setSearchText] = useState("");
  const [quranContent, setQuranContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentHal, setCurrentHal] = useState(1);
  const [currentJuz, setCurrentJuz] = useState(1);
  
  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Dummy data for Surah selection
  const surahList = [
    { id: 1, name: "Al-Fatihah", arabicName: "الفاتحة", totalAyat: 7 },
    { id: 2, name: "Al-Baqarah", arabicName: "البقرة", totalAyat: 286 },
    { id: 3, name: "Ali 'Imran", arabicName: "آل عمران", totalAyat: 200 },
    { id: 4, name: "An-Nisa", arabicName: "النساء", totalAyat: 176 },
    { id: 5, name: "Al-Ma'idah", arabicName: "المائدة", totalAyat: 120 },
    { id: 6, name: "Al-An'am", arabicName: "الأنعام", totalAyat: 165 },
    { id: 7, name: "Al-A'raf", arabicName: "الأعراف", totalAyat: 206 },
    { id: 8, name: "Al-Anfal", arabicName: "الأنفال", totalAyat: 75 },
    { id: 9, name: "At-Tawbah", arabicName: "التوبة", totalAyat: 129 },
    { id: 10, name: "Yunus", arabicName: "يونس", totalAyat: 109 },
  ];
  
  // Generate ayat options based on selected surah
  const generateAyatOptions = () => {
    if (!selectedSurah) return [];
    
    const selectedSurahData = surahList.find(s => s.id === parseInt(selectedSurah));
    if (!selectedSurahData) return [];
    
    const ayatOptions = [];
    for (let i = 1; i <= selectedSurahData.totalAyat; i++) {
      ayatOptions.push({ value: i.toString(), label: i.toString() });
    }
    return ayatOptions;
  };
  
  // Handle surah selection change
  const handleSurahChange = (e) => {
    setSelectedSurah(e.target.value);
    // Reset selected ayat when surah changes
    setSelectedAyat("");
  };
  
  // Handle ayat selection change
  const handleAyatChange = (e) => {
    setSelectedAyat(e.target.value);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      console.log(`Searching for: ${searchText}`);
      // Implement actual search functionality here
    }
  };
  
  // Handle back to dashboard
  const navigateToDashboard = () => {
    router.push('/dashboard');
  };
  
  // Handle page change
  const handlePageChange = (e) => {
    setCurrentHal(parseInt(e.target.value));
  };
  
  // Handle juz change
  const handleJuzChange = (e) => {
    setCurrentJuz(parseInt(e.target.value));
  };
  
  // Fetch Quran content (simulated)
  useEffect(() => {
    if (selectedSurah && selectedAyat) {
      setLoading(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // This is placeholder content - replace with actual API call
        if (selectedSurah === "1") {
          const arabicText = `
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

          ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ

          ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

          مَٰلِكِ يَوْمِ ٱلدِّينِ

          إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ

          ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ

          صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ
          `;
          setQuranContent(arabicText);
        } else if (selectedSurah === "2") {
          const arabicText = `
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

          الٓمٓ

          ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ

          ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ

          وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْءَاخِرَةِ هُمْ يُوقِنُونَ

          أُو۟لَٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُو۟لَٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ
          `;
          setQuranContent(arabicText);
        } else {
          setQuranContent(`بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\n[Surah content for ${selectedSurah}:${selectedAyat} would appear here]`);
        }
        
        // Update juz and hal based on selection
        // For this example, we're setting mock values based on the surah
        setCurrentJuz(Math.ceil(parseInt(selectedSurah) / 3));
        setCurrentHal(parseInt(selectedSurah) * 2);
        
        setLoading(false);
      }, 800);
    }
  }, [selectedSurah, selectedAyat]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/img/logossg_white.png" 
                alt="Logo Santri Siap Guna" 
                width={36} 
                height={36} 
                className="mr-2"
              />
              <h1 className="text-xl font-bold">SANTRI SIAP GUNA</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={navigateToDashboard}
                className="text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Controls */}
      <div className="bg-blue-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              {/* Surah Selection */}
              <div className="relative">
                <select
                  value={selectedSurah}
                  onChange={handleSurahChange}
                  className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                >
                  <option value="">Pilih Surat</option>
                  {surahList.map(surah => (
                    <option key={surah.id} value={surah.id}>
                      {surah.id}. {surah.name} ({surah.arabicName})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              
              {/* Ayat Selection */}
              <div className="relative">
                <select
                  value={selectedAyat}
                  onChange={handleAyatChange}
                  disabled={!selectedSurah}
                  className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 disabled:bg-gray-200 disabled:text-gray-500"
                >
                  <option value="">Ayat</option>
                  {generateAyatOptions().map(ayat => (
                    <option key={ayat.value} value={ayat.value}>
                      {ayat.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="w-full sm:w-auto flex-1 sm:max-w-md px-2">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder="Cari Kata di Al-Qur'an"
                  className="flex-1 appearance-none border rounded-l py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            {/* Display Options */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={currentHal}
                  onChange={handlePageChange}
                  className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                >
                  <option value="">Hal</option>
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={currentJuz}
                  onChange={handleJuzChange}
                  className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                >
                  <option value="">Juz</option>
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Bar */}
      <div className="bg-gray-200 py-1">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm font-medium text-gray-700">
            Teks Bahasa Arab Berdasarkan Quran Kemenag
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : selectedSurah && selectedAyat ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {surahList.find(s => s.id === parseInt(selectedSurah))?.name || 'Surah'}
              </h2>
              <p className="text-sm text-gray-600">
                Juz {currentJuz} • Halaman {currentHal}
              </p>
            </div>
            <div className="text-right text-2xl leading-loose rtl" dir="rtl">
              {quranContent.split('\n').map((line, index) => (
                <p key={index} className={`mb-4 ${line.trim() ? '' : 'hidden'}`}>
                  {line.trim()}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-900 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl font-medium text-gray-700 mb-2">Pilih Surat dan Ayat</h2>
            <p className="text-gray-500 text-center">
              Silakan pilih surat dan ayat untuk mulai membaca Al-Qur'an
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center px-4 py-2">
        <button 
          onClick={navigateToDashboard}
          className="flex flex-col items-center px-3 py-1 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Beranda</span>
        </button>
        <button 
          className="flex flex-col items-center px-3 py-1 text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs mt-1">Al-Quran</span>
        </button>
        <button 
          className="flex flex-col items-center px-3 py-1 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Presensi</span>
        </button>
        <button 
          className="flex flex-col items-center px-3 py-1 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-xs mt-1">Tugas</span>
        </button>
        <button 
          className="flex flex-col items-center px-3 py-1 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;