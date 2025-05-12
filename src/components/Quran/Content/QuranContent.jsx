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
  footnotes // Data catatan kaki dari API
}) => {
  const [activeFootnote, setActiveFootnote] = useState(null);
  const [currentFootnoteContent, setCurrentFootnoteContent] = useState('');

  // Fungsi untuk memproses teks dengan catatan kaki yang bisa diklik
  const processTranslation = (text) => {
    if (!text) return text;
    
    return text.replace(/<sup>\[(\d+)]<\/sup>/g, (match, num) => {
      return `<sup><a href="#footnote-${num}" 
                class="text-blue-600 hover:underline cursor-pointer footnote-link"
                data-footnote="${num}"
                onclick="event.preventDefault(); window.reactFootnotes?.showFootnote(${num})"
              >[${num}]</a></sup>`;
    });
  };

  // Fungsi untuk menampilkan catatan kaki
  const showFootnote = (num) => {
    const footnote = footnotes?.find(fn => fn.no_foot === parseInt(num));
    if (footnote) {
      setActiveFootnote(num);
      setCurrentFootnoteContent(footnote.t_foot);
    }
  };

  // Expose function to window untuk inline onclick handlers
  useEffect(() => {
    window.reactFootnotes = { showFootnote };
    return () => {
      delete window.reactFootnotes;
    };
  }, [footnotes]);

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
      <div className="bg-white rounded-lg shadow-md p-4 relative">
        {/* Popup Catatan Kaki */}
        {activeFootnote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold">Catatan Kaki [{activeFootnote}]</h3>
                <button 
                  onClick={() => setActiveFootnote(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  aria-label="Tutup"
                >
                  &times;
                </button>
              </div>
              <div className="prose text-gray-700">
                <p>{currentFootnoteContent}</p>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setActiveFootnote(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Surah */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {surahDetails?.nm_surat || ''}
          </h2>
          {surahDetails && (
            <div>
              <p 
                className="text-md text-gray-700 mb-2" 
                dangerouslySetInnerHTML={{ __html: processTranslation(surahDetails.arti_surat) }} 
              />
            </div>
          )}
          <p className="text-sm text-gray-600">
            Juz {currentJuz || '-'} • Halaman {currentHal || '-'}
          </p>
        </div>
        
        {/* Pengaturan Tampilan */}
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
        
        {/* Panduan Tajwid */}
        <TajwidGuide />
        
        {/* Daftar Ayat */}
        <div className="space-y-6">
          {quranContent.map((ayat) => (
            <div key={`${ayat.no_surat}-${ayat.no_ayat}`}>
              <AyatItem 
                ayat={{
                  ...ayat,
                  tafsir: processTranslation(ayat.tafsir)
                }}
                selectedSurah={selectedSurah}
                fontSizeClass={fontSizeClass}
                showTranslation={showTranslation}
              />
            </div>
          ))}
        </div>
        
        {/* Tombol Lanjut */}
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