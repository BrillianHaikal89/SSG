import React, { useState } from 'react';
import AyatItem from './AyatItem';
import TajwidGuide from './TajwidGuide';
import ContentLoader from '../LoadingStates/ContentLoader';
import EmptyState from '../LoadingStates/EmptyState';
import NextContentButton from './NextContentButton';
import FontSizeSelector from './FontSizeSelector';

const QuranContent = ({
  loading,
  error,
  quranContent,
  surahDetails,
  surahList,
  selectedSurah,
  currentJuz,
  currentHal,
  isAtEndOfContent,
  getNextContent,
  handleContinueToNext
}) => {
  const [globalArabicFontSize, setGlobalArabicFontSize] = useState('medium');
  const [globalTranslationFontSize, setGlobalTranslationFontSize] = useState('medium');
  const [showTranslation, setShowTranslation] = useState(true);

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }
  
  if (loading) {
    return <ContentLoader />;
  }
  
  if (quranContent && quranContent.length > 0) {
    // Check if we're at the end of content and get the next content item
    const showNextButton = isAtEndOfContent();
    const nextContent = showNextButton ? getNextContent() : null;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Surah header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {surahDetails?.nm_surat || ''}
          </h2>
          {surahDetails && (
            <p className="text-md text-gray-700 mb-2">{surahDetails.arti_surat}</p>
          )}
          <p className="text-sm text-gray-600">
            Juz {currentJuz || '-'} • Halaman {currentHal || '-'}
          </p>
        </div>
        
        {/* Global settings */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Pengaturan Tampilan:</h3>
          
          <div className="flex flex-wrap gap-4 mb-3">
            <FontSizeSelector 
              title="Ukuran Arab" 
              currentSize={globalArabicFontSize} 
              onChange={setGlobalArabicFontSize} 
            />
            <FontSizeSelector 
              title="Ukuran Terjemahan" 
              currentSize={globalTranslationFontSize} 
              onChange={setGlobalTranslationFontSize} 
            />
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tampilkan Terjemahan:</span>
              <div className="relative inline-block w-10 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="toggle-translation"
                  checked={showTranslation} 
                  onChange={() => setShowTranslation(!showTranslation)} 
                  className="sr-only"
                />
                <label 
                  htmlFor="toggle-translation"
                  className={`block h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in 
                    ${showTranslation ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span 
                    className={`block h-4 w-4 ml-1 mt-1 rounded-full transition-transform duration-200 ease-in transform 
                    ${showTranslation ? 'translate-x-4 bg-white' : 'bg-white'}`} 
                  />
                </label>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">Pengaturan akan berlaku untuk semua ayat. Anda juga dapat mengatur font secara individual pada setiap ayat.</p>
        </div>
        
        {/* Tajwid guide */}
        <TajwidGuide />
        
        {/* Ayat list with Tajwid highlighting */}
        <div className="space-y-6">
          {quranContent.map((ayat) => (
            <AyatItem 
              key={`${ayat.no_surat}-${ayat.no_ayat}`} 
              ayat={ayat}
              selectedSurah={selectedSurah}
              defaultArabicSize={globalArabicFontSize}
              defaultTranslationSize={globalTranslationFontSize}
              defaultShowTranslation={showTranslation}
            />
          ))}
        </div>
        
        {/* Next Content Button */}
        {showNextButton && nextContent && (
          <NextContentButton
            currentType={nextContent.type}
            nextItem={nextContent.item}
            onContinue={handleContinueToNext}
          />
        )}
      </div>
    );
  }
  
  return <EmptyState />;
};

export default QuranContent;