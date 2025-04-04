import React from 'react';
import AyatItem from './AyatItem';
import TajwidGuide from './TajwidGuide';
import ContentLoader from '../LoadingStates/ContentLoader';
import EmptyState from '../LoadingStates/EmptyState';

const QuranContent = ({
  loading,
  error,
  quranContent,
  surahDetails,
  surahList,
  selectedSurah,
  currentJuz,
  currentHal
}) => {
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
        
        {/* Tajwid guide - exactly as in the screenshot */}
        <TajwidGuide />
        
        {/* Ayat list with Tajwid highlighting */}
        <div className="space-y-6">
          {quranContent.map((ayat) => (
            <AyatItem 
              key={`${ayat.no_surat}-${ayat.no_ayat}`} 
              ayat={ayat}
              selectedSurah={selectedSurah}
            />
          ))}
        </div>
      </div>
    );
  }
  
  return <EmptyState />;
};

export default QuranContent;