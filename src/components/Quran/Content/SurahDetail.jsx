import React, { useState, useEffect } from 'react';
import AyatItem from './AyatItem';

const SurahDetail = ({ surahData }) => {
  const [isPlayingSurah, setIsPlayingSurah] = useState(false);
  const [currentPlayingAyat, setCurrentPlayingAyat] = useState(null);
  
  // Auto-scroll to current playing ayat
  useEffect(() => {
    if (currentPlayingAyat) {
      const element = document.getElementById(`ayat-${currentPlayingAyat}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentPlayingAyat]);

  const handlePlaySurah = (ayatNumber) => {
    setIsPlayingSurah(true);
    setCurrentPlayingAyat(ayatNumber);
  };
  
  const handleStopSurah = () => {
    setIsPlayingSurah(false);
    setCurrentPlayingAyat(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{surahData.name}</h1>
        <p className="text-gray-600 mt-2">{surahData.verses.length} Ayat</p>
      </div>
      
      <div className="space-y-4">
        {surahData.verses.map((ayat, index) => (
          <AyatItem
            key={ayat.id}
            ayat={ayat}
            selectedSurah={surahData.name}
            isPlayingSurah={isPlayingSurah}
            currentPlayingAyat={currentPlayingAyat}
            onPlaySurah={handlePlaySurah}
            onStopSurah={handleStopSurah}
            surahAudioQueue={surahData.verses}
            isLastAyat={index === surahData.verses.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;