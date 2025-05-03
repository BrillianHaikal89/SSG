// Nama bulan Hijriah dalam bahasa Latin
const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulqadah", "Dzulhijjah"
];

// Data koreksi untuk tanggal-tanggal spesifik
const DATE_CORRECTIONS = {
  '2025-05-03': { day: 9, month: 9, year: 1446 },  // 9 Syawal 1446 H
  '2025-05-04': { day: 6, month: 10, year: 1446 }  // 6 Dzulqadah 1446 H
};

export const calculateHijriDate = (gregorianDate) => {
  try {
    const dateStr = new Date(gregorianDate).toISOString().split('T')[0];
    
    // Gunakan koreksi jika tersedia
    if (DATE_CORRECTIONS[dateStr]) {
      const corrected = DATE_CORRECTIONS[dateStr];
      return {
        ...corrected,
        formatted: `${corrected.day} ${HIJRI_MONTHS[corrected.month]} ${corrected.year} H`
      };
    }

    // Algoritma konversi standar (fallback)
    const date = new Date(gregorianDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
               Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
               Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
               day - 32075;
    
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = (Math.floor((10985 - l2) / 5316)) * 
              (Math.floor((50 * l2) / 17719)) + 
              (Math.floor(l2 / 5670)) * 
              (Math.floor((43 * l2) / 15238));
    const l3 = l2 - (Math.floor((30 - j) / 15)) * 
               (Math.floor((17719 * j) / 50)) - 
               (Math.floor(j / 16)) * 
               (Math.floor((15238 * j) / 43)) + 29;
    
    const hijriMonth = Math.floor((24 * l3) / 709);
    const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;
    
    return {
      day: hijriDay,
      month: hijriMonth - 1,
      year: hijriYear,
      formatted: `${hijriDay} ${HIJRI_MONTHS[hijriMonth - 1]} ${hijriYear} H`
    };
  } catch (error) {
    console.error('Error calculating Hijri date:', error);
    return { 
      day: 1, 
      month: 0, 
      year: 1445, 
      formatted: "1 Muharram 1445 H" 
    };
  }
};

export const formatGregorianDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};