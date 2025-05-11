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
  const { user } = useAuthStore();
  const [processedArabic, setProcessedArabic] = useState('');

  // Font size classes with responsive adjustments
  const getArabicFontSizeClass = (size) => {
    switch (size) {
      case 'small': return 'text-xl md:text-2xl';
      case 'medium': return 'text-2xl md:text-3xl';
      case 'large': return 'text-3xl md:text-4xl';
      default: return 'text-2xl md:text-3xl';
    }
  };

  const getTranslationFontSizeClass = (size) => {
    switch (size) {
      case 'small': return 'text-xs md:text-sm';
      case 'medium': return 'text-sm md:text-base';
      case 'large': return 'text-base md:text-lg';
      default: return 'text-sm md:text-base';
    }
  };

  // Process Arabic text with tajwid highlighting
  useEffect(() => {
    const processArabicText = () => {
      if (!ayat?.arab) return '';

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

      let result = ayat.arab;
      const processedIndices = new Set();
      
      tajwidRules.forEach(({ regex, rule, color }) => {
        const ruleName = getTajwidRuleName(rule);
        let match;
        
        // Reset regex lastIndex for global regex
        regex.lastIndex = 0;
        
        while ((match = regex.exec(ayat.arab)) !== null) {
          const matchedText = match[0];
          const startIndex = match.index;
          const endIndex = startIndex + matchedText.length;
          
          // Skip if any part of this match has already been processed
          let skip = false;
          for (let i = startIndex; i < endIndex; i++) {
            if (processedIndices.has(i)) {
              skip = true;
              break;
            }
          }
          if (skip) continue;
          
          // Mark these indices as processed
          for (let i = startIndex; i < endIndex; i++) {
            processedIndices.add(i);
          }
          
          const replacement = `<span class="tajwid-${rule}" style="color:${color}" title="${ruleName}">${matchedText}</span>`;
          result = result.substring(0, startIndex) + replacement + result.substring(endIndex);
          
          // Adjust the regex lastIndex since we modified the string
          regex.lastIndex = startIndex + replacement.length;
        }
      });

      return result;
    };

    setProcessedArabic(processArabicText());
  }, [ayat]);

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
          user_id: user.userId,
          surah: selectedSurah || ayat.surah_name,
          ayah: ayat.no_ayat,
          page: ayat.no_hal,
          juz: ayat.no_juz
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan bookmark');
      }

      const data = await response.json();
      toast.success(data.message || 'Bookmark berhasil disimpan');
      setBookmark({
        surah: selectedSurah || ayat.surah_name,
        ayah: ayat.no_ayat,
        page: ayat.no_hal,
        juz: ayat.no_juz
      });
    } catch (error) {
      console.error('Error saving bookmark:', error);
      toast.error(error.message || 'Gagal menyimpan bookmark');
    }
  };

  return (
    <div className="ayat-item mb-6 pb-6 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full">
          {ayat.no_ayat}
        </div>
        
        <div className="flex-1">
          {ayat.surah_name && !selectedSurah && (
            <div className="mb-3">
              <span className="text-sm font-medium text-blue-800 bg-blue-50 px-2 py-1 rounded">
                {ayat.surah_name}
              </span>
            </div>
          )}
          
          <div 
            className={`arab ${getArabicFontSizeClass(fontSizeClass)} leading-loose mb-3`} 
            dir="rtl" 
            style={{ fontFamily: "'Lateef', 'Scheherazade New', serif" }}
            dangerouslySetInnerHTML={{ __html: processedArabic }}
          />
          
          {ayat.tafsir && showTranslation && (
            <p className={`translation mt-3 ${getTranslationFontSizeClass(fontSizeClass)} text-gray-700`}>
              {ayat.tafsir}
            </p>
          )}
          
          <div className="mt-4">
            <button 
              onClick={saveBookmark}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm transition-colors"
            >
              {bookmark ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-600">
                    <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clipRule="evenodd" />
                  </svg>
                  <span>Tersimpan</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  <span>Simpan Bookmark</span>
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