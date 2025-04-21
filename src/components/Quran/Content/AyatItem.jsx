import React from 'react';

const AyatItem = ({ ayat, selectedSurah }) => {
  // Function to apply Tajwid highlighting matching the screenshot categories
  const renderArabicWithTajwid = (arabicText) => {
    // Tajwid rules organized by categories with colors matching the screenshot
    const tajwidRules = [
      // Nun Sukun & Tanwin Rules
      { regex: /نْ[ء]/g, rule: 'izhar', color: '#673AB7' }, // Izhar
      { regex: /نْ[يرملون]/g, rule: 'idgham', color: '#3F51B5' }, // Idgham
      { regex: /نْ[ب]/g, rule: 'iqlab', color: '#8BC34A' }, // Iqlab
      { regex: /نْ[^ءيرملونب]/g, rule: 'ikhfa', color: '#FF5722' }, // Ikhfa
      
      // Mim Sukun Rules
      { regex: /مْ[م]/g, rule: 'idgham-syafawi', color: '#00BCD4' }, // Idgham Syafawi
      { regex: /مْ[ب]/g, rule: 'ikhfa-syafawi', color: '#9E9E9E' }, // Ikhfa Syafawi
      { regex: /مْ[^مب]/g, rule: 'izhar-syafawi', color: '#607D8B' }, // Izhar Syafawi
      
      // Mad (Elongation) Rules
      { regex: /َا|ِي|ُو/g, rule: 'mad-thabii', color: '#4CAF50' }, // Mad Thabii
      { regex: /ٓ/g, rule: 'mad-lazim', color: '#009688' }, // Mad Lazim
      { regex: /ٰ/g, rule: 'mad-arid', color: '#CDDC39' }, // Mad Arid
      { regex: /ـَى/g, rule: 'mad-lin', color: '#03A9F4' }, // Mad Lin
      
      // Other Rules
      { regex: /[قطبجد]ْ/g, rule: 'qalqalah', color: '#FFC107' }, // Qalqalah
      { regex: /اللّٰهِ|اللّه|الله/g, rule: 'lafadz-allah', color: '#E91E63' }, // Lafadz Allah
      { regex: /ّ/g, rule: 'tashdid', color: '#FF9800' }, // Tashdid/Syaddah
      { regex: /ـ۠/g, rule: 'ghunnah', color: '#F44336' }, // Ghunnah
      { regex: /ْ/g, rule: 'sukun', color: '#9C27B0' }, // Sukun
      { regex: /ً|ٍ|ٌ/g, rule: 'tanwin', color: '#2196F3' }, // Tanwin
      { regex: /ۜ|ۛ|ۚ|ۖ|ۗ|ۙ|ۘ/g, rule: 'waqf', color: '#795548' }, // Waqf marks
    ];

    // Map to store already processed parts of text to avoid duplicates
    const processedMap = new Map();
    
    // Clone the text for processing
    let decoratedText = arabicText;
    let hasMatches = false;
    
    // Create spans for matches, starting from the most specific rules
    tajwidRules.forEach(({ regex, rule, color }) => {
      decoratedText = decoratedText.replace(regex, (match) => {
        // Check if this exact match has already been processed
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

  // Get user-friendly rule name for tooltip
  const getTajwidRuleName = (rule) => {
    switch(rule) {
      case 'izhar': return 'Izhar';
      case 'idgham': return 'Idgham';
      case 'iqlab': return 'Iqlab';
      case 'ikhfa': return 'Ikhfa';
      case 'idgham-syafawi': return 'Idgham Syafawi';
      case 'ikhfa-syafawi': return 'Ikhfa Syafawi';
      case 'izhar-syafawi': return 'Izhar Syafawi';
      case 'mad-thabii': return 'Mad Thabii';
      case 'mad-lazim': return 'Mad Lazim';
      case 'mad-arid': return 'Mad Arid';
      case 'mad-lin': return 'Mad Lin';
      case 'qalqalah': return 'Qalqalah';
      case 'lafadz-allah': return 'Lafadz Allah';
      case 'tashdid': return 'Tashdid';
      case 'ghunnah': return 'Ghunnah';
      case 'sukun': return 'Sukun';
      case 'tanwin': return 'Tanwin';
      case 'waqf': return 'Tanda Waqaf';
      default: return rule.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div className="ayat-item">
      <div className="flex items-start">
        <span className="ayat-number">
          {ayat.no_ayat}
        </span>
        <div className="flex-1">
          {ayat.surah_name && !selectedSurah && (
            <div className="mb-2">
              <span className="text-sm font-medium text-blue-800">{ayat.surah_name}</span>
            </div>
          )}
          {/* Fixed: Replace <p> with <div> to avoid nesting <div> inside <p> */}
          <div className="arab" dir="rtl" 
               dangerouslySetInnerHTML={{ __html: renderArabicWithTajwid(ayat.arab) }}>
          </div>
          {ayat.tafsir && <p className="translation">{ayat.tafsir}</p>}
        </div>
      </div>
    </div>
  );
};

export default AyatItem;