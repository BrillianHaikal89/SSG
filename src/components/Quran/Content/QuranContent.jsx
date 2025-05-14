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
  fontSizeClass,
  showTranslation
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
          <h2 className="text-2xl font-bold mb-2 font-arabic">
            {surahDetails?.name_simple || ''}
          </h2>
          <p className="text-md text-gray-700 mb-2">
            {surahDetails?.translated_name.name || ''} • {surahDetails?.verses_count} Ayat
          </p>
          <p className="text-sm text-gray-600">
            Juz {surahDetails?.juz || '-'} • Halaman {surahDetails?.page || '-'}
          </p>
        </div>
        
        <TajwidGuide />
        
        {/* Ayat list */}
        <div className="space-y-6">
          {quranContent.map((ayat) => (
            <AyatItem 
              key={`${surahDetails.id}-${ayat.aya_number}`}
              ayat={ayat}
              surahNumber={surahDetails.id}
              fontSizeClass={fontSizeClass}
              showTranslation={showTranslation}
            />
          ))}
        </div>
      </div>
    );
  }
  
  return <EmptyState />;
};

export default QuranContent;