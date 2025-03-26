import React from 'react';

const ContentHeader = ({ surahDetails, surahList, selectedSurah, currentJuz, currentHal }) => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold mb-2">
        {surahDetails ? surahDetails.nm_surat : 
          (surahList.find(s => s.no_surat === parseInt(selectedSurah))?.nm_surat || 'Surah')}
      </h2>
      {surahDetails && (
        <p className="text-md text-gray-700 mb-2">{surahDetails.arti_surat}</p>
      )}
      <p className="text-sm text-gray-600">
        {currentJuz ? `Juz ${currentJuz}` : 'Juz -'} • {currentHal ? `Halaman ${currentHal}` : 'Halaman -'}
      </p>
    </div>
  );
};

export default ContentHeader;