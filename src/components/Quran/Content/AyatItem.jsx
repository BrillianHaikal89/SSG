import React from 'react';

const AyatItem = ({ ayat, selectedSurah }) => {
  return (
    <div className="ayat-item">
      <div className="flex items-start">
        <span className="ayat-number">{ayat.no_ayat}</span>
        <div className="flex-1">
          {ayat.surah_name && !selectedSurah && (
            <div className="mb-2">
              <span className="text-sm font-medium text-blue-800">{ayat.surah_name}</span>
            </div>
          )}
          <p className="arab">{ayat.arab}</p>
          {ayat.tafsir && <p className="translation">{ayat.tafsir}</p>}
        </div>
      </div>
    </div>
  );
};

export default AyatItem;