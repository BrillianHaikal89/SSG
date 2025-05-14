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
  const [playbackQueue, setPlaybackQueue] = useState([]);
  const [isPlayingSurah, setIsPlayingSurah] = useState(false);

  // Function to remove footnotes from translation
  const cleanTranslation = (text) => {
    if (!text) return text;
    return text.replace(/<sup>\[\d+]<\/sup>/g, '');
  };

  // Reciter options
  const reciters = [
    { id: 'AbdulBaset', name: 'Abdul Basit (Mujawwad)' },
    { id: 'Husary', name: 'Mahmoud Khalil Al-Husary' },
    { id: 'Minshawi', name: 'Mohamed Siddiq El-Minshawi' },
    { id: 'Alafasy', name: 'Mishary Rashid Alafasy' },
    { id: 'Hudhaify', name: 'Ali Abdur-Rahman al-Huthaify' }
  ];

  const playAyat = (ayat) => {
    stopAudio();
    setCurrentPlayingAyat(ayat);
    
    const audio = new Audio(
      `https://verses.quran.com/${reciter}/Mujawwad/mp3/${String(ayat.no_surat).padStart(3, '0')}${String(ayat.no_ayat).padStart(3, '0')}.mp3`
    );
    
    audio.addEventListener('ended', () => {
      setCurrentPlayingAyat(null);
      playNextInQueue();
    });
    
    audio.play()
      .then(() => {
        setCurrentAudio(audio);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });
  };

  const playSurah = () => {
    if (!quranContent || quranContent.length === 0) return;
    
    setIsPlayingSurah(true);
    setPlaybackQueue(quranContent);
    playAyat(quranContent[0]);
  };

  const playNextInQueue = () => {
    if (playbackQueue.length > 0) {
      const nextQueue = [...playbackQueue];
      nextQueue.shift(); // Remove the first item
      setPlaybackQueue(nextQueue);
      
      if (nextQueue.length > 0) {
        playAyat(nextQueue[0]);
      } else {
        setIsPlayingSurah(false);
      }
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.removeEventListener('ended', () => {});
      setCurrentAudio(null);
    }
    setCurrentPlayingAyat(null);
    setPlaybackQueue([]);
    setIsPlayingSurah(false);
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
        {/* Surah header */}
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
        
        {/* Audio controls */}
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
            
            <button
              onClick={isPlayingSurah ? stopAudio : playSurah}
              className={`px-4 py-2 rounded-md text-white text-sm ${isPlayingSurah ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isPlayingSurah ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Hentikan Surah
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Putar Seluruh Surah
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Font size controls */}
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
        
        {/* Tajwid guide */}
        <TajwidGuide />
        
        {/* Ayat list with Tajwid highlighting */}
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
              reciter={reciter}
              isPlaying={currentPlayingAyat?.no_ayat === ayat.no_ayat}
              isCurrentPlaying={currentPlayingAyat?.no_ayat === ayat.no_ayat}
              onPlay={playAyat}
              onStop={stopAudio}
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