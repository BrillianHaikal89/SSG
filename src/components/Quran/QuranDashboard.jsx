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
import { quranApi } from '../../services/ApiQuran';
import toast from 'react-hot-toast';

const QuranDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [bookmark, setBookmark] = useState(null);
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
    
    fetchSurahList,
    fetchSurahDetails,
    fetchAyat,
    fetchByPage,
    fetchJuz,
    searchQuran,
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
  
  // Check if there's a bookmark to continue from
  useEffect(() => {
    if (isClient) {
      checkForBookmarkToContinue();
    }
  }, [isClient]);

  // Function to check if there's a bookmark to continue from
  const checkForBookmarkToContinue = () => {
    try {
      // Check if there's a bookmark in sessionStorage
      const bookmarkData = sessionStorage.getItem('continue_quran_bookmark');
      
      if (bookmarkData) {
        // Remove it immediately to prevent multiple uses
        sessionStorage.removeItem('continue_quran_bookmark');
        
        // Parse the bookmark data
        const bookmark = JSON.parse(bookmarkData);
        
        // Navigate to the bookmark location
        navigateToBookmark(bookmark);
      } else {
        // If no sessionStorage bookmark, check if user is logged in
        // and fetch their latest bookmark from API
        fetchLatestBookmark();
      }
    } catch (error) {
      console.error('Error checking for bookmark:', error);
    }
  };

  // Fetch the latest bookmark from API
  const fetchLatestBookmark = async () => {
    if (!user || !user.userId) return;

    try {
      // Get the latest bookmark
      const latestBookmark = await quranApi.getLatestBookmark(user.userId);
      
      if (latestBookmark) {
        setBookmark(latestBookmark);
      }
    } catch (error) {
      console.error('Error fetching latest bookmark:', error);
    }
  };

  // Navigate to bookmark location
  const navigateToBookmark = (bookmark) => {
    if (!bookmark) return;
    
    try {
      // If we have surah information
      if (bookmark.surah) {
        // First load the surah
        const surahId = bookmark.surah.toString();
        handleSurahChange({ target: { value: surahId } });
        
        // If we also have ayah information, navigate to that specific ayah
        if (bookmark.ayah) {
          setTimeout(() => {
            handleAyatChange({ target: { value: bookmark.ayah.toString() } });
          }, 500); // Small delay to ensure surah is loaded first
        }
      } 
      // If we have page information
      else if (bookmark.page) {
        handlePageChange({ target: { value: bookmark.page.toString() } });
      }
      // If we have juz information
      else if (bookmark.juz) {
        handleJuzChange({ target: { value: bookmark.juz.toString() } });
      }
      
      toast.success('Melanjutkan dari terakhir dibaca');
    } catch (error) {
      console.error('Error navigating to bookmark:', error);
      toast.error('Gagal membuka bookmark');
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

      {/* Information Bar - Now positioned after controls */}
      <InfoBar />

      {/* Bookmark Continue Section */}
      {!selectedSurah && !currentHal && !currentJuz && bookmark && (
        <div className="container mx-auto px-3 py-3">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-blue-800">Lanjutkan Membaca</h3>
                <p className="text-sm text-gray-700 mt-1">
                  {bookmark.surah 
                    ? `Surah ${bookmark.surah}${bookmark.ayah ? `, Ayat ${bookmark.ayah}` : ''}` 
                    : bookmark.page 
                      ? `Halaman ${bookmark.page}` 
                      : `Juz ${bookmark.juz}`}
                </p>
              </div>
              <button 
                onClick={() => navigateToBookmark(bookmark)}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default QuranDashboard;