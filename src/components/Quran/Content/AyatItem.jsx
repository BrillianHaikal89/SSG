import React, { useEffect } from 'react';
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

  // Handle footnote clicks
  useEffect(() => {
    const handleFootnoteClick = (e) => {
      if (e.target.classList.contains('footnote-link')) {
        e.preventDefault();
        const num = e.target.getAttribute('data-footnote');
        window.reactFootnotes?.showFootnote(parseInt(num));
      }
    };

    // Attach to window for inline handlers
    window.handleFootnoteClick = handleFootnoteClick;

    return () => {
      delete window.handleFootnoteClick;
    };
  }, []);

  // Get font size classes
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

  // Render Arabic with Tajwid highlighting
  const renderArabicWithTajwid = (arabicText) => {
    const tajwidRules = [
      // ... (keep your existing tajwid rules)
    ];

    const processedMap = new Map();
    let decoratedText = arabicText;
    
    tajwidRules.forEach(({ regex, rule, color }) => {
      decoratedText = decoratedText.replace(regex, (match) => {
        if (processedMap.has(match + rule)) {
          return processedMap.get(match + rule);
        }
        
        const span = `<span class="tajwid-${rule}" style="color:${color}" title="${getTajwidRuleName(rule)}">${match}</span>`;
        processedMap.set(match + rule, span);
        return span;
      });
    });

    return decoratedText;
  };

  const getTajwidRuleName = (rule) => {
    const ruleNames = {
      // ... (keep your existing rule names)
    };
    return ruleNames[rule] || rule.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const saveBookmark = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
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

      if (!response.ok) throw new Error('Network response was not ok');

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
      toast.error('Gagal menyimpan bookmark: ' + error.message);
    }
  };

  return (
    <div className="ayat-item mb-6 pb-6 border-b border-gray-100 last:border-0">
      <div className="flex items-start">
        <span className="ayat-number flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full mr-3 mt-1 text-sm font-medium">
          {ayat.no_ayat}
        </span>
        <div className="flex-1">
          {ayat.surah_name && !selectedSurah && (
            <div className="mb-2">
              <span className="text-sm font-medium text-blue-800">{ayat.surah_name}</span>
            </div>
          )}
          
          <div 
            className={`arab ${getArabicFontSizeClass(fontSizeClass)} mb-3 leading-loose`}
            dir="rtl" 
            dangerouslySetInnerHTML={{ __html: renderArabicWithTajwid(ayat.arab) }}
          />
          
          {ayat.tafsir && showTranslation && (
            <div 
              className={`translation mt-2 ${getTranslationFontSizeClass(fontSizeClass)} text-gray-700`}
              dangerouslySetInnerHTML={{ __html: ayat.tafsir }}
              onClick={(e) => window.handleFootnoteClick(e)}
            />
          )}
          
          <div className="mt-3 flex justify-between items-center">
            <button 
              onClick={saveBookmark}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors"
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