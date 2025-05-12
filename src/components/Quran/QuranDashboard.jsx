"use client";

import React, { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import InfoBar from '../Layout/InfoBar';
import MobileControls from './Controls/MobileControls';
import DesktopControls from './Controls/DesktopControls';
import QuranContent from './Content/QuranContent';
import useQuran from '../../hooks/useQuran';
import useAuthStore from '../../stores/authStore';
import '../../app/styles/quran-styles.css';

const QuranDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fontSizeClass, setFontSizeClass] = useState('medium');
  const [showTranslation, setShowTranslation] = useState(true);
  const [footnotes, setFootnotes] = useState([]);
  const [footnotesLoading, setFootnotesLoading] = useState(false);
  const [footnotesError, setFootnotesError] = useState(null);
  const { user } = useAuthStore();
  
  const {
    surahList,
    selectedSurah,
    selectedAyat,
    quranContent,
    surahDetails,
    loading,
    error,
    searchText,
    currentHal,
    currentJuz,
    showScrollTop,
    
    // Methods
    fetchAyat,
    generateAyatOptions,
    handleSurahChange,
    handleAyatChange,
    handleJuzChange,
    handlePageChange,
    handleSearchChange,
    handleSearch,
    scrollToTop,
    setShowScrollTop,
    
    // Continue functionality
    isAtEndOfContent,
    getNextContent,
    handleContinueToNext
  } = useQuran();

  // Fetch footnotes data
  const fetchFootnotes = async () => {
    setFootnotesLoading(true);
    setFootnotesError(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/quran/footnotes`);
      if (!response.ok) {
        throw new Error('Gagal memuat catatan kaki');
      }
      const data = await response.json();
      setFootnotes(data);
    } catch (err) {
      console.error('Error fetching footnotes:', err);
      setFootnotesError(err.message);
    } finally {
      setFootnotesLoading(false);
    }
  };

  // Handle client-side rendering and responsive layout
  useEffect(() => {
    setIsClient(true);
    
    // Check if mobile view based on screen width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Run on mount
    checkIsMobile();
    
    // Set up event listeners
    window.addEventListener('resize', checkIsMobile);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load settings from localStorage
    const savedFontSize = localStorage.getItem('quranFontSize');
    if (savedFontSize) {
      setFontSizeClass(savedFontSize);
    }
    
    const savedShowTranslation = localStorage.getItem('quranShowTranslation');
    if (savedShowTranslation !== null) {
      setShowTranslation(savedShowTranslation === 'true');
    }
    
    // Fetch footnotes when component mounts
    fetchFootnotes();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setShowScrollTop]);
  
  // Save font settings to localStorage when they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('quranFontSize', fontSizeClass);
      localStorage.setItem('quranShowTranslation', showTranslation.toString());
    }
  }, [fontSizeClass, showTranslation, isClient]);
  
  // Handle font size change
  const handleFontSizeChange = (size) => {
    setFontSizeClass(size);
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
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Header */}
      <Header />

      {/* Mobile Controls */}
      <MobileControls 
        selectedSurah={selectedSurah}
        handleSurahChange={handleSurahChange}
        surahList={surahList}
        selectedAyat={selectedAyat}
        handleAyatChange={handleAyatChange}
        ayatOptions={generateAyatOptions()}
        currentHal={currentHal}
        handlePageChange={handlePageChange}
        currentJuz={currentJuz}
        handleJuzChange={handleJuzChange}
        searchText={searchText}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      />

      {/* Desktop Controls */}
      <DesktopControls 
        selectedSurah={selectedSurah}
        handleSurahChange={handleSurahChange}
        surahList={surahList}
        selectedAyat={selectedAyat}
        handleAyatChange={handleAyatChange}
        ayatOptions={generateAyatOptions()}
        currentHal={currentHal}
        handlePageChange={handlePageChange}
        currentJuz={currentJuz}
        handleJuzChange={handleJuzChange}
        searchText={searchText}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      />

      {/* Information Bar */}
      <InfoBar />

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-3 py-4">
        {footnotesError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
            <p>Catatan kaki tidak tersedia: {footnotesError}</p>
          </div>
        )}
        
        <QuranContent 
          loading={loading || footnotesLoading}
          error={error || footnotesError}
          quranContent={quranContent}
          surahDetails={surahDetails}
          surahList={surahList}
          selectedSurah={selectedSurah}
          currentJuz={currentJuz}
          currentHal={currentHal}
          isAtEndOfContent={isAtEndOfContent}
          getNextContent={getNextContent}
          handleContinueToNext={handleContinueToNext}
          fontSizeClass={fontSizeClass}
          handleFontSizeChange={handleFontSizeChange}
          showTranslation={showTranslation}
          setShowTranslation={setShowTranslation}
          footnotes={footnotes}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 p-2 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-800 transition-colors z-10"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default QuranDashboard;