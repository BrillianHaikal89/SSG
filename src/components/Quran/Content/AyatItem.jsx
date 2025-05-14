import React, { useState } from 'react';
import useAuthStore from '../../../stores/authStore';
import toast from 'react-hot-toast';

const AyatItem = ({ 
  ayat,
  surahNumber,
  fontSizeClass = 'medium',
  showTranslation = true
}) => {
  const [bookmark, setBookmark] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const { user } = useAuthStore();

  const toggleAudio = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const newAudio = new Audio(
        `https://verses.quran.com/AbdulBaset/Mujawwad/mp3/${String(surahNumber).padStart(3, '0')}${String(ayat.aya_number).padStart(3, '0')}.mp3`
      );
      
      newAudio.play()
        .then(() => {
          setAudio(newAudio);
          setIsPlaying(true);
          newAudio.onended = () => setIsPlaying(false);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          toast.error('Gagal memutar audio');
        });
    }
  };

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

  const saveBookmark = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${API_URL}/quran/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.userId,
          surah: surahNumber,
          ayah: ayat.aya_number,
          page: ayat.page_number,
          juz: ayat.juz_number
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      toast.success(data.message || 'Bookmark berhasil disimpan');
      setBookmark({
        surah: surahNumber,
        ayah: ayat.aya_number,
        page: ayat.page_number,
        juz: ayat.juz_number
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
          {ayat.aya_number}
        </span>
        <div className="flex-1">
          <div 
            className={`arab ${getArabicFontSizeClass(fontSizeClass)} font-arabic`} 
            dir="rtl"
          >
            {ayat.aya_text}
          </div>
          
          {showTranslation && ayat.tafsir && (
            <div className={`translation mt-2 ${getTranslationFontSizeClass(fontSizeClass)}`}>
              <p className="font-semibold">Tafsir Ayat {ayat.aya_number}:</p>
              <p>{ayat.tafsir}</p>
            </div>
          )}
          
          <div className="mt-2 flex gap-2">
            <button 
              onClick={toggleAudio}
              className={`px-2 py-1 ${isPlaying ? 'bg-red-500' : 'bg-green-500'} text-white rounded text-sm flex items-center gap-1`}
            >
              {isPlaying ? 'Berhenti' : 'Dengarkan'}
            </button>
            
            <button 
              onClick={saveBookmark}
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm flex items-center gap-1"
            >
              {bookmark ? 'Tersimpan' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AyatItem;