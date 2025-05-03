// Nama bulan Hijriah dalam bahasa Latin
const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulqaidah", "Dzulhijjah"
];

// Fungsi konversi Gregorian ke Hijriah yang lebih akurat
export const calculateHijriDate = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    
    // Algoritma konversi Umm al-Qura (versi sederhana)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Koreksi untuk tahun kabisat
    const k = Math.floor((year - 1969) / 4);
    const jd = Math.floor((1461 * (year + 4800 + k)) / 4) +
               Math.floor((367 * (month - 2 - 12 * k)) / 12) -
               Math.floor((3 * Math.floor((year + 4900 + k) / 100)) / 4) +
               day - 32075;
    
    // Konversi JD ke Hijriah
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
      month: hijriMonth - 1, // zero-based index
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

// Format tanggal Gregorian
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