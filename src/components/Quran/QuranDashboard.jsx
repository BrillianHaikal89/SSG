"use client";

import React, { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import InfoBar from '../Layout/InfoBar';
import MobileControls from './Controls/MobileControls';
import DesktopControls from './Controls/DesktopControls';
import QuranContent from './Content/QuranContent';
import useQuran from '../../hooks/useQuran';
import useAuthStore from '../../stores/authStore';
import '../../app/styles/quran-styles.css'; // Import the custom CSS

const QuranDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fontSizeClass, setFontSizeClass] = useState('medium'); // One size control for all text
  const [showTranslation, setShowTranslation] = useState(true);
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
    lastReadPage,
    
    // Methods
    fetchSurahList,
    fetchAyat,
    fetchByPage,
    generateAyatOptions,
    handleSurahChange,
    handleAyatChange,
    handleJuzChange,
    handlePageChange,
    goToPreviousPage,
    goToNextPage,
    handleSearchChange,
    handleSearch,
    scrollToTop,
    setShowScrollTop,
    loadLastReadPage,
    
    // Continue functionality
    isAtEndOfContent,
    getNextContent,
    handleContinueToNext
  } = useQuran();
  
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
    
    // Load font settings from localStorage if available
    const savedFontSize = localStorage.getItem('quranFontSize');
    if (savedFontSize) {
      setFontSizeClass(savedFontSize);
    }
    
    const savedShowTranslation = localStorage.getItem('quranShowTranslation');
    if (savedShowTranslation !== null) {
      setShowTranslation(savedShowTranslation === 'true');
    }
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setShowScrollTop]);
  
  // Check if we should load the last read page
  useEffect(() => {
    if (isClient && !selectedSurah && !selectedAyat && !currentHal && !currentJuz && quranContent.length === 0 && !loading) {
      // If no content is loaded and we're not in the process of loading anything,
      // let's show the "last read" notification
      
      // We'll let the user decide if they want to continue reading from where they left off
      // rather than loading it automatically
    }
  }, [isClient, selectedSurah, selectedAyat, currentHal, currentJuz, quranContent, loading]);
  
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
      {/* Header dengan tombol kembali di kiri */}
      <Header title="Al-Qur'an" showBackButton={true} />

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
        {/* Last Read Banner - only show when no content is loaded yet */}
        {lastReadPage && quranContent.length === 0 && !loading && !error && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-blue-500">
                <svg className="h-5 w-5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Lanjutkan Membaca</h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>Terakhir Anda membaca Al-Qur'an di halaman {lastReadPage}.</p>
                  <button 
                    onClick={loadLastReadPage} 
                    className="mt-2 py-1 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Lanjutkan membaca dari halaman {lastReadPage}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Navigation Buttons - always show when a page is selected */}
        {currentHal && (
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentHal === "1"}
              className={`flex items-center space-x-1 py-1 px-3 rounded ${
                currentHal === "1" 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Halaman Sebelumnya</span>
            </button>
            
            <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
              Halaman {currentHal} dari 604
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={currentHal === "604"}
              className={`flex items-center space-x-1 py-1 px-3 rounded ${
                currentHal === "604" 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <span>Halaman Berikutnya</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        
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
          fontSizeClass={fontSizeClass}
          handleFontSizeChange={handleFontSizeChange}
          showTranslation={showTranslation}
          setShowTranslation={setShowTranslation}
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