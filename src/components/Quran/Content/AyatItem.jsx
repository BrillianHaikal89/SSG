// components/Quran/Content/AyatItem.jsx
import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../stores/authStore';
import toast from 'react-hot-toast';

const AyatItem = ({ 
  ayat, 
  selectedSurah, 
  fontSizeClass = 'medium',
  showTranslation = true 
}) => {
  const [bookmark, setBookmark] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const { user } = useAuthStore();

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [audio]);

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        playAudio();
      }
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    if (audio) {
      audio.pause();
      audio.removeEventListener('ended', handleAudioEnd);
    }

    const newAudio = new Audio(
      `https://verses.quran.com/AbdulBaset/Mujawwad/mp3/${String(ayat.nomor_surah).padStart(3, '0')}${String(ayat.nomor_ayat).padStart(3, '0')}.mp3`
    );
    
    newAudio.addEventListener('ended', handleAudioEnd);
    newAudio.play()
      .then(() => {
        setAudio(newAudio);
        setIsPlaying(true);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Gagal memutar audio');
      });
  };

  // Get appropriate CSS classes based on font size
  const getArabicFontSizeClass = (size) => {
    switch (size) {
      case 'small': return 'text-xl';
      case 'medium': return 'text-2xl';
      case 'large': return 'text-3xl';
      default: return 'text-2xl';
    }
  };

  const getTranslationFontSizeClass = (size) => {
    switch (size) {
      case 'small': return 'text-xs';
      case 'medium': return 'text-sm';
      case 'large': return 'text-base';
      default: return 'text-sm';
    }
  };

  const renderArabicWithTajwid = (arabicText) => {
    // ... (keep the same tajwid rules implementation)
    return arabicText; // For simplicity, keeping the same implementation
  };

  const saveBookmark = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quran/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.userId,
          surah: selectedSurah || ayat.nomor_surah,
          ayah: ayat.nomor_ayat,
          page: ayat.page,
          juz: ayat.juz
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      toast.success(data.message || 'Bookmark berhasil disimpan');
      setBookmark({
        surah: selectedSurah || ayat.nomor_surah,
        ayah: ayat.nomor_ayat,
        page: ayat.page,
        juz: ayat.juz
      });
    } catch (error) {
      console.error('Error saving bookmark:', error);
      toast.error('Gagal menyimpan bookmark: ' + error.message);
    }
  };

  return (
    <div className="ayat-item">
      <div className="flex items-start">
        <span className="ayat-number">
          {ayat.nomor_ayat}
        </span>
        <div className="flex-1">
          {ayat.surah_name && !selectedSurah && (
            <div className="mb-2">
              <span className="text-sm font-medium text-blue-800">{ayat.surah_name}</span>
            </div>
          )}
          
          <div 
            className={`arab ${getArabicFontSizeClass(fontSizeClass)}`} 
            dir="rtl" 
            dangerouslySetInnerHTML={{ __html: renderArabicWithTajwid(ayat.teks_arab) }}
          />
          
          {ayat.teks_terjemahan && showTranslation && (
            <p className={`translation mt-2 ${getTranslationFontSizeClass(fontSizeClass)}`}>
              {ayat.teks_terjemahan}
            </p>
          )}
          
          <div className="mt-2 flex gap-2">
            <button 
              onClick={toggleAudio}
              className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              {isPlaying ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                  </svg>
                  <span>Berhenti</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  <span>Dengarkan</span>
                </>
              )}
            </button>
            
            <button 
              onClick={saveBookmark}
              className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              {bookmark ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clipRule="evenodd" />
                  </svg>
                  <span>Tersimpan</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AyatItem;