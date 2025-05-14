import React, { useState, useEffect } from 'react';
import AyatItem from './AyatItem';
import TajwidGuide from './TajwidGuide';
import ContentLoader from '../LoadingStates/ContentLoader';
import EmptyState from '../LoadingStates/EmptyState';
import NextContentButton from './NextContentButton';

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
  handleContinueToNext,
  fontSizeClass,
  handleFontSizeChange,
  showTranslation,
  setShowTranslation,
  reciter,
  handleReciterChange,
  setCurrentAudio,
  currentAudio
}) => {
  const [currentPlayingAyat, setCurrentPlayingAyat] = useState(null);

  // Reciter options with working audio sources
  const reciters = [
    { 
      id: 'AbdulBaset', 
      name: 'Abdul Basit (Mujawwad)',
      baseUrl: 'https://download.quranicaudio.com/quran/abdul_baset_mujawwad/'
    },
    { 
      id: 'Husary', 
      name: 'Mahmoud Khalil Al-Husary',
      baseUrl: 'https://download.quranicaudio.com/quran/husary_mujawwad/'
    },
    { 
      id: 'Minshawi', 
      name: 'Mohamed Siddiq El-Minshawi',
      baseUrl: 'https://download.quranicaudio.com/quran/minshawi_mujawwad/'
    },
    { 
      id: 'Alafasy', 
      name: 'Mishary Rashid Alafasy',
      baseUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/'
    },
    { 
      id: 'Hudhaify', 
      name: 'Ali Abdur-Rahman al-Huthaify',
      baseUrl: 'https://download.quranicaudio.com/quran/hudhaify_64kbps/'
    }
  ];

  const cleanTranslation = (text) => {
    if (!text) return text;
    return text.replace(/<sup>\[\d+]<\/sup>/g, '');
  };

  const playAyat = (ayat) => {
    stopAudio();
    setCurrentPlayingAyat(ayat);
    
    const selectedReciter = reciters.find(r => r.id === reciter);
    if (!selectedReciter) return;
    
    const surahNumber = String(ayat.no_surat).padStart(3, '0');
    const ayatNumber = String(ayat.no_ayat).padStart(3, '0');
    const audioUrl = `${selectedReciter.baseUrl}${surahNumber}${ayatNumber}.mp3`;
    
    const audio = new Audio(audioUrl);
    
    audio.addEventListener('ended', () => {
      setCurrentPlayingAyat(null);
    });
    
    audio.play()
      .then(() => {
        setCurrentAudio(audio);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.removeEventListener('ended', () => {});
      setCurrentAudio(null);
    }
    setCurrentPlayingAyat(null);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [selectedSurah]);

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
    const showNextButton = isAtEndOfContent();
    const nextContent = showNextButton ? getNextContent() : null;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {surahDetails?.nm_surat || ''}
          </h2>
          {surahDetails && (
            <p className="text-md text-gray-700 mb-2">{cleanTranslation(surahDetails.arti_surat)}</p>
          )}
          <p className="text-sm text-gray-600">
            Juz {currentJuz || '-'} • Halaman {currentHal || '-'}
          </p>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Audio:</h3>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Qari:</span>
              <select
                value={reciter}
                onChange={(e) => handleReciterChange(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                {reciters.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Pengaturan Tampilan:</h3>
          
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Ukuran Teks:</span>
              <div className="flex bg-gray-100 rounded-md shadow-sm">
                <button
                  onClick={() => handleFontSizeChange('small')}
                  className={`px-3 py-1 text-xs rounded-l-md ${
                    fontSizeClass === 'small' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                  } transition-colors duration-200`}
                  aria-label="Ukuran kecil"
                >
                  Kecil
                </button>
                <button
                  onClick={() => handleFontSizeChange('medium')}
                  className={`px-3 py-1 text-xs ${
                    fontSizeClass === 'medium' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                  } transition-colors duration-200`}
                  aria-label="Ukuran sedang"
                >
                  Sedang
                </button>
                <button
                  onClick={() => handleFontSizeChange('large')}
                  className={`px-3 py-1 text-xs rounded-r-md ${
                    fontSizeClass === 'large' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                  } transition-colors duration-200`}
                  aria-label="Ukuran besar"
                >
                  Besar
                </button>
              </div>
            </div>
            
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
          <p className="text-xs text-gray-500">Pengaturan ini akan berlaku untuk semua ayat. Perubahan akan disimpan untuk kunjungan berikutnya.</p>
        </div>
        
        <TajwidGuide />
        
        <div className="space-y-6">
          {quranContent.map((ayat) => (
            <AyatItem 
              key={`${ayat.no_surat}-${ayat.no_ayat}`} 
              ayat={{
                ...ayat,
                tafsir: cleanTranslation(ayat.tafsir)
              }}
              selectedSurah={selectedSurah}
              fontSizeClass={fontSizeClass}
              showTranslation={showTranslation}
              isPlaying={currentPlayingAyat?.no_ayat === ayat.no_ayat}
              isCurrentPlaying={currentPlayingAyat?.no_ayat === ayat.no_ayat}
              onPlay={playAyat}
              onStop={stopAudio}
            />
          ))}
        </div>
        
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