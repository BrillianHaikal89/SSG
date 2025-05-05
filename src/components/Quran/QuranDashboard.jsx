"use client";

import React, { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import BottomNavigation from '../Layout/BottomNavigation';
import InfoBar from '../Layout/InfoBar';
import MobileControls from './Controls/MobileControls';
import DesktopControls from './Controls/DesktopControls';
import QuranContent from './Content/QuranContent';
import useQuran from '../../hooks/useQuran';
import useAuthStore from '../../stores/authStore';
import toast, { Toaster } from 'react-hot-toast';

const QuranDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
    
    // New continue functionality
    isAtEndOfContent,
    getNextContent,
    handleContinueToNext
  } = useQuran();
  
  // Handle bookmark navigation
  const handleLoadBookmark = (surah, ayah, page, juz) => {
    // If surah is provided, navigate to that surah and ayat
    if (surah) {
      handleSurahChange({ target: { value: surah } });
      if (ayah) {
        handleAyatChange({ target: { value: ayah } });
      }
    }
    // If page is provided, navigate to that page
    else if (page) {
      handlePageChange({ target: { value: page } });
    }
    // If juz is provided, navigate to that juz
    else if (juz) {
      handleJuzChange({ target: { value: juz } });
    }
    
    toast.success('Berhasil memuat posisi bookmark');
    scrollToTop();
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
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Set up scroll listener for back-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setShowScrollTop]);
  
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
    <div className="flex flex-col min-h-screen bg-blue-100">
      {/* Toaster for notifications */}
      <Toaster position="top-center" />
      
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

      {/* Information Bar - Positioned after controls */}
      <InfoBar />

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-3 py-4">
        <QuranContent 
          loading={loading}
          error={error}
          quranContent={quranContent}
          surahDetails={surahDetails}
          surahList={surahList}
          selectedSurah={selectedSurah}
          currentJuz={currentJuz}
          currentHal={currentHal}
          isAtEndOfContent={isAtEndOfContent}
          getNextContent={getNextContent}
          handleContinueToNext={handleContinueToNext}
          onLoadBookmark={handleLoadBookmark}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 p-2 bg-blue-900 text-white rounded-full shadow-lg"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default QuranDashboard;