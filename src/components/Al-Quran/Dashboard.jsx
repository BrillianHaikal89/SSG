"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333/api';

const Dashboard = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // State for Quran data
  const [surahList, setSurahList] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState("");
  const [selectedAyat, setSelectedAyat] = useState("");
  const [quranContent, setQuranContent] = useState([]);
  const [surahDetails, setSurahDetails] = useState(null);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentHal, setCurrentHal] = useState(1);
  const [currentJuz, setCurrentJuz] = useState(1);
  
  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Fetch list of surahs on component mount
  useEffect(() => {
    if (isClient) {
      fetchSurahList();
    }
  }, [isClient]);
  
  // Fetch surah list from the API
  const fetchSurahList = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/quran/surahs`);
      
      if (response.status === 200) {
        setSurahList(response.data);
      } else {
        setError('Failed to fetch surah list');
        // Fall back to hardcoded dummy data if API fails
        setSurahList([
          { no_surat: 1, nm_surat: "Al-Fatihah", arti_surat: "Pembukaan", jml_ayat: 7 },
          { no_surat: 2, nm_surat: "Al-Baqarah", arti_surat: "Sapi Betina", jml_ayat: 286 },
          // Add more fallback data here if needed
        ]);
      }
    } catch (error) {
      console.error("Error fetching surah list:", error);
      setError('Failed to connect to the server. Please try again later.');
      
      // Fallback to hardcoded data
      setSurahList([
        { no_surat: 1, nm_surat: "Al-Fatihah", arti_surat: "Pembukaan", jml_ayat: 7 },
        { no_surat: 2, nm_surat: "Al-Baqarah", arti_surat: "Sapi Betina", jml_ayat: 286 },
        { no_surat: 3, nm_surat: "Ali 'Imran", arti_surat: "Keluarga Imran", jml_ayat: 200 },
        { no_surat: 4, nm_surat: "An-Nisa", arti_surat: "Wanita", jml_ayat: 176 },
        { no_surat: 5, nm_surat: "Al-Ma'idah", arti_surat: "Hidangan", jml_ayat: 120 },
        { no_surat: 6, nm_surat: "Al-An'am", arti_surat: "Binatang Ternak", jml_ayat: 165 },
        { no_surat: 7, nm_surat: "Al-A'raf", arti_surat: "Tempat Tertinggi", jml_ayat: 206 },
        { no_surat: 8, nm_surat: "Al-Anfal", arti_surat: "Harta Rampasan Perang", jml_ayat: 75 },
        { no_surat: 9, nm_surat: "At-Tawbah", arti_surat: "Pengampunan", jml_ayat: 129 },
        { no_surat: 10, nm_surat: "Yunus", arti_surat: "Nabi Yunus", jml_ayat: 109 },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch surah details including metadata
  const fetchSurahDetails = async (surahId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/quran/surah/${surahId}`);
      
      if (response.status === 200) {
        setSurahDetails(response.data);
        
        // Update juz and page information
        if (response.data.ayahs && response.data.ayahs.length > 0) {
          setCurrentJuz(response.data.ayahs[0].no_juz || 1);
          setCurrentHal(response.data.ayahs[0].no_hal || 1);
        }
      } else {
        setError('Failed to fetch surah details');
      }
    } catch (error) {
      console.error("Error fetching surah details:", error);
      setError('Failed to load surah details');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch specific ayat or range of ayat
  const fetchAyat = async (surahId, ayatId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${API_BASE_URL}/quran/surah/${surahId}/ayat`;
      if (ayatId) {
        url += `/${ayatId}`;
      }
      
      const response = await axios.get(url);
      
      if (response.status === 200) {
        // Format the data for display
        setQuranContent(response.data);
        
        // Update juz and page if data is available
        if (response.data && response.data.length > 0) {
          setCurrentJuz(response.data[0].no_juz || 1);
          setCurrentHal(response.data[0].no_hal || 1);
        }
      } else {
        setError('Failed to fetch Quranic verses');
      }
    } catch (error) {
      console.error("Error fetching ayat:", error);
      setError('Failed to load Quranic verses');
      
      // Fallback for testing - showing a sample verse
      if (surahId === "1") {
        setQuranContent([{
          no_surat: 1,
          no_ayat: 1,
          arab: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
          tafsir: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
        }]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch verses by juz
  const fetchJuz = async (juzId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/quran/juz/${juzId}`);
      
      if (response.status === 200) {
        setQuranContent(response.data);
        
        // Update the current juz
        setCurrentJuz(juzId);
        
        // Update the first page from returned data
        if (response.data && response.data.length > 0) {
          setCurrentHal(response.data[0].no_hal || 1);
        }
      } else {
        setError('Failed to fetch juz data');
      }
    } catch (error) {
      console.error("Error fetching juz:", error);
      setError('Failed to load juz data');
    } finally {
      setLoading(false);
    }
  };
  
  // Search the Quran for specific text
  const searchQuran = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/quran/search`, {
        params: { q: searchQuery }
      });
      
      if (response.status === 200) {
        setQuranContent(response.data);
      } else {
        setError('Search failed');
      }
    } catch (error) {
      console.error("Error searching Quran:", error);
      setError('Failed to complete search');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate ayat options based on selected surah
  const generateAyatOptions = () => {
    if (!selectedSurah) return [];
    
    const surah = surahList.find(s => s.no_surat === parseInt(selectedSurah));
    if (!surah) return [];
    
    const ayatOptions = [];
    for (let i = 1; i <= surah.jml_ayat; i++) {
      ayatOptions.push({ value: i.toString(), label: i.toString() });
    }
    return ayatOptions;
  };
  
  // Handle surah selection change
  const handleSurahChange = (e) => {
    const surahId = e.target.value;
    setSelectedSurah(surahId);
    setSelectedAyat("");
    
    if (surahId) {
      // Fetch surah details
      fetchSurahDetails(surahId);
      // Fetch all ayahs of the surah
      fetchAyat(surahId);
    } else {
      // Clear content if no surah is selected
      setQuranContent([]);
      setSurahDetails(null);
    }
  };
  
  // Handle ayat selection change
  const handleAyatChange = (e) => {
    const ayatId = e.target.value;
    setSelectedAyat(ayatId);
    
    if (selectedSurah && ayatId) {
      // Fetch specific ayat
      fetchAyat(selectedSurah, ayatId);
    } else if (selectedSurah) {
      // If no specific ayat is selected, fetch all ayahs of the surah
      fetchAyat(selectedSurah);
    }
  };
  
  // Handle juz selection
  const handleJuzChange = (e) => {
    const juzId = e.target.value;
    setCurrentJuz(parseInt(juzId));
    
    if (juzId) {
      fetchJuz(juzId);
    }
  };
  
  // Handle page selection
  const handlePageChange = (e) => {
    const pageId = e.target.value;
    setCurrentHal(parseInt(pageId));
    
    // In a real implementation, we would fetch verses by page number
    // For now, we'll just update the state
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      searchQuran(searchText);
    }
  };
  
  // Handle back to dashboard
  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

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
                    <option key={surah.no_surat} value={surah.no_surat}>
                      {surah.no_surat}. {surah.nm_surat} ({surah.arti_surat})
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
                  {Array.from({ length: 604 }, (_, i) => (
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
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : quranContent && quranContent.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {surahDetails ? surahDetails.nm_surat : 
                  (surahList.find(s => s.no_surat === parseInt(selectedSurah))?.nm_surat || 'Surah')}
              </h2>
              {surahDetails && (
                <p className="text-md text-gray-700 mb-2">{surahDetails.arti_surat}</p>
              )}
              <p className="text-sm text-gray-600">
                Juz {currentJuz} • Halaman {currentHal}
              </p>
            </div>
            
            <div className="space-y-6">
              {quranContent.map((ayat, index) => (
                <div key={`${ayat.no_surat}-${ayat.no_ayat}`} className="ayat-item">
                  <div className="flex items-start">
                    <span className="ayat-number">{ayat.no_ayat}</span>
                    <div className="flex-1">
                      <p className="arab">{ayat.arab}</p>
                      {ayat.tafsir && <p className="translation">{ayat.tafsir}</p>}
                    </div>
                  </div>
                </div>
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