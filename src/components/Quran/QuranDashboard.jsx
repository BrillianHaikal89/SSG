"use client";

import React, { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import InfoBar from '../Layout/InfoBar';
import MobileControls from './Controls/MobileControls';
import DesktopControls from './Controls/DesktopControls';
import QuranContent from './Content/QuranContent';
import useQuran from '../../hooks/useQuran';
import '../../app/styles/quran-styles.css';

const QuranDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fontSizeClass, setFontSizeClass] = useState('medium');
  const [showTranslation, setShowTranslation] = useState(true);
  
  const {
    surahList,
    selectedSurah,
    selectedAyat,
    quranContent,
    surahDetails,
    loading,
    error,
    currentJuz,
    currentHal,
    handleSurahChange,
    handleAyatChange,
    generateAyatOptions
  } = useQuran();

  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => setIsMobile(window.innerWidth < 640);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleFontSizeChange = (size) => {
    setFontSizeClass(size);
  };

  if (!isClient) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <Header />
      
      {isMobile ? (
        <MobileControls 
          selectedSurah={selectedSurah}
          handleSurahChange={handleSurahChange}
          surahList={surahList}
          selectedAyat={selectedAyat}
          handleAyatChange={handleAyatChange}
          ayatOptions={generateAyatOptions()}
        />
      ) : (
        <DesktopControls 
          selectedSurah={selectedSurah}
          handleSurahChange={handleSurahChange}
          surahList={surahList}
          selectedAyat={selectedAyat}
          handleAyatChange={handleAyatChange}
          ayatOptions={generateAyatOptions()}
        />
      )}

      <InfoBar />

      <div className="flex-grow container mx-auto px-3 py-4">
        <QuranContent 
          loading={loading}
          error={error}
          quranContent={quranContent}
          surahDetails={surahDetails}
          fontSizeClass={fontSizeClass}
          showTranslation={showTranslation}
        />
      </div>
    </div>
  );
};

export default QuranDashboard;