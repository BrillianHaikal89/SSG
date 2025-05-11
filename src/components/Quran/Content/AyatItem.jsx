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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuthStore();

  // Check if this ayat is bookmarked when component mounts
  useEffect(() => {
    checkBookmarkStatus();
  }, [ayat.no_ayat, selectedSurah]);

  // Get appropriate CSS classes based on font size - with improved mobile sizing
  const getArabicFontSizeClass = (size) => {
    switch (size) {
      case 'small':
        return 'text-xl sm:text-xl';
      case 'medium':
        return 'text-2xl sm:text-2xl';
      case 'large':
        return 'text-3xl sm:text-3xl';
      default:
        return 'text-2xl sm:text-2xl';
    }
  };

  const getTranslationFontSizeClass = (size) => {
    switch (size) {
      case 'small':
        return 'text-xs sm:text-xs';
      case 'medium':
        return 'text-sm sm:text-sm';
      case 'large':
        return 'text-base sm:text-base';
      default:
        return 'text-sm sm:text-sm';
    }
  };

  const renderArabicWithTajwid = (arabicText) => {
    const tajwidRules = [
      // Nun Sukun & Tanwin Rules
      { regex: /نْ[ء]/g, rule: 'izhar', color: '#673AB7' },
      { regex: /نْ[يرملون]/g, rule: 'idgham', color: '#3F51B5' },
      { regex: /نْ[ب]/g, rule: 'iqlab', color: '#8BC34A' },
      { regex: /نْ[^ءيرملونب]/g, rule: 'ikhfa', color: '#FF5722' },
      
      // Mim Sukun Rules
      { regex: /مْ[م]/g, rule: 'idgham-syafawi', color: '#00BCD4' },
      { regex: /مْ[ب]/g, rule: 'ikhfa-syafawi', color: '#9E9E9E' },
      { regex: /مْ[^مب]/g, rule: 'izhar-syafawi', color: '#607D8B' },
      
      // Mad Rules
      { regex: /َا|ِي|ُو/g, rule: 'mad-thabii', color: '#4CAF50' },
      { regex: /ٓ/g, rule: 'mad-lazim', color: '#009688' },
      { regex: /ٰ/g, rule: 'mad-arid', color: '#CDDC39' },
      { regex: /ـَى/g, rule: 'mad-lin', color: '#03A9F4' },
      
      // Other Rules
      { regex: /[قطبجد]ْ/g, rule: 'qalqalah', color: '#FFC107' },
      { regex: /اللّٰهِ|اللّه|الله/g, rule: 'lafadz-allah', color: '#E91E63' },
      { regex: /ّ/g, rule: 'tashdid', color: '#FF9800' },
      { regex: /ـ۠/g, rule: 'ghunnah', color: '#F44336' },
      { regex: /ْ/g, rule: 'sukun', color: '#9C27B0' },
      { regex: /ً|ٍ|ٌ/g, rule: 'tanwin', color: '#2196F3' },
      { regex: /ۜ|ۛ|ۚ|ۖ|ۗ|ۙ|ۘ/g, rule: 'waqf', color: '#795548' },
    ];

    const processedMap = new Map();
    let decoratedText = arabicText;
    let hasMatches = false;
    
    tajwidRules.forEach(({ regex, rule, color }) => {
      decoratedText = decoratedText.replace(regex, (match) => {
        if (processedMap.has(match + rule)) {
          return processedMap.get(match + rule);
        }
        
        hasMatches = true;
        const span = `<span class="tajwid-${rule}" style="color:${color}" title="${getTajwidRuleName(rule)}">${match}</span>`;
        processedMap.set(match + rule, span);
        return span;
      });
    });

    return decoratedText;
  };

  const getTajwidRuleName = (rule) => {
    const ruleNames = {
      'izhar': 'Izhar',
      'idgham': 'Idgham',
      'iqlab': 'Iqlab',
      'ikhfa': 'Ikhfa',
      'idgham-syafawi': 'Idgham Syafawi',
      'ikhfa-syafawi': 'Ikhfa Syafawi',
      'izhar-syafawi': 'Izhar Syafawi',
      'mad-thabii': 'Mad Thabii',
      'mad-lazim': 'Mad Lazim',
      'mad-arid': 'Mad Arid',
      'mad-lin': 'Mad Lin',
      'qalqalah': 'Qalqalah',
      'lafadz-allah': 'Lafadz Allah',
      'tashdid': 'Tashdid',
      'ghunnah': 'Ghunnah',
      'sukun': 'Sukun',
      'tanwin': 'Tanwin',
      'waqf': 'Tanda Waqaf'
    };
    return ruleNames[rule] || rule.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Check if this ayat is already bookmarked
  const checkBookmarkStatus = async () => {
    if (!user || !user.userId) return;
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${API_URL}/quran/bookmark/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.userId,
          surah: selectedSurah || ayat.surah_name,
          ayah: ayat.no_ayat
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isBookmarked || false);
        if (data.bookmark) {
          setBookmark(data.bookmark);
        }
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const saveBookmark = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      // Show loading toast
      const loadingToast = toast.loading('Menyimpan bookmark...');
      
      const response = await fetch(`${API_URL}/quran/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.userId,
          surah: selectedSurah || ayat.surah_name,
          ayah: ayat.no_ayat,
          page: ayat.no_hal,
          juz: ayat.no_juz
        })
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      toast.success(data.message || 'Bookmark berhasil disimpan');
      
      // Update state to show bookmark is active
      setIsBookmarked(true);
      setBookmark({
        surah: selectedSurah || ayat.surah_name,
        ayah: ayat.no_ayat,
        page: ayat.no_hal,
        juz: ayat.no_juz
      });
    } catch (error) {
      console.error('Error saving bookmark:', error);
      toast.error('Gagal menyimpan bookmark: ' + error.message);
    }
  };

  const removeBookmark = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      // Show loading toast
      const loadingToast = toast.loading('Menghapus bookmark...');
      
      const response = await fetch(`${API_URL}/quran/bookmark/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.userId,
          surah: selectedSurah || ayat.surah_name,
          ayah: ayat.no_ayat
        })
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      toast.success(data.message || 'Bookmark berhasil dihapus');
      
      // Update state to show bookmark is inactive
      setIsBookmarked(false);
      setBookmark(null);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Gagal menghapus bookmark: ' + error.message);
    }
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark();
    } else {
      saveBookmark();
    }
  };

  return (
    <div className="ayat-item mb-8">
      <div className="flex items-start">
        <span className="ayat-number flex items-center justify-center min-w-8 h-8 mr-3 bg-blue-100 text-blue-900 rounded-full text-sm font-medium mt-1">
          {ayat.no_ayat}
        </span>
        <div className="flex-1">
          {ayat.surah_name && !selectedSurah && (
            <div className="mb-2">
              <span className="text-sm font-medium text-blue-800">{ayat.surah_name}</span>
            </div>
          )}
          
          {/* Add explicit width control for mobile display */}
          <div 
            className={`arab ${getArabicFontSizeClass(fontSizeClass)} w-full overflow-hidden break-words`} 
            dir="rtl" 
            dangerouslySetInnerHTML={{ __html: renderArabicWithTajwid(ayat.arab) }}
          />
          
          {ayat.tafsir && showTranslation && (
            <p className={`translation mt-2 ${getTranslationFontSizeClass(fontSizeClass)} text-gray-700`}>
              {ayat.tafsir}
            </p>
          )}
          
          <div className="mt-3">
            <button 
              onClick={toggleBookmark}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors duration-200 ${
                isBookmarked 
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              aria-label={isBookmarked ? "Hapus bookmark" : "Simpan bookmark"}
            >
              {isBookmarked ? (
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