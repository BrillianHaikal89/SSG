import React from 'react';
import ContentHeader from './ContentHeader';
import AyatItem from './AyatItem';
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <ContentHeader 
          surahDetails={surahDetails}
          surahList={surahList}
          selectedSurah={selectedSurah}
          currentJuz={currentJuz}
          currentHal={currentHal}
        />
        
        <div className="space-y-6">
          {quranContent.map((ayat, index) => (
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