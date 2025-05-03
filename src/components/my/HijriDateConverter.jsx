// Hijri month names
const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

// Updated Hijri date calculation with more accurate conversion
export const calculateHijriDate = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    const adjustment = 1; // Adjustment factor for more accurate conversion
    
    // Get the Gregorian date components
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Convert Gregorian to Julian day
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    let jd = day + Math.floor((153 * m + 2) / 5) + 
             365 * y + Math.floor(y / 4) - 
             Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Adjust for Islamic calendar (approximate)
    jd = jd - adjustment;
    const l = Math.floor((jd - 1948440 + 10646) / 10631);
    const jd1 = jd - 1948440 + 10646 - l * 10631;
    const yearH = Math.floor(jd1 / 354) + 1 + l * 30;
    const monthH = Math.min(12, Math.ceil((jd1 - Math.floor((354 * (yearH - l * 30 - 1) + 3) / 10)) / 29.5) + 1);
    const dayH = jd1 - 29 * (monthH - 1) - Math.floor((6 + (monthH - 1)) / 11) - 
                Math.floor((354 * (yearH - l * 30 - 1) + 3) / 10) + 1;
    
    return {
      day: dayH,
      month: monthH - 1, // zero-based for array
      year: yearH,
      formatted: `${dayH} ${HIJRI_MONTHS[monthH - 1]} ${yearH} H`
    };
  } catch (error) {
    console.error('Error calculating Hijri date:', error);
    return { 
      day: 1, 
      month: 0, 
      year: 1446, 
      formatted: "1 Muharram 1446 H" 
    };
  }
};

// Format Hijri date for display
export const formatHijriDate = (hijriString) => {
  if (!hijriString) return '';
  
  // If it's already a formatted string from our calculation function
  if (hijriString.includes('H')) {
    return hijriString;
  }
  
  try {
    // Convert Arabic numerals to Latin
    const arabicToLatinNumerals = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    
    let latinNumerals = hijriString;
    for (const [arabic, latin] of Object.entries(arabicToLatinNumerals)) {
      latinNumerals = latinNumerals.replace(new RegExp(arabic, 'g'), latin);
    }
    
    // Replace Arabic text with English
    latinNumerals = latinNumerals
      .replace(/ذو القعدة/, "Dhu al-Qi'dah")
      .replace(/ذو الحجة/, "Dhu al-Hijjah")
      .replace(/هـ/, "H");
    
    return latinNumerals;
  } catch (error) {
    console.error('Error formatting Hijri date:', error);
    return hijriString;
  }
};

// Format Gregorian date
export const formatGregorianDate = (date) => {
  if (!date) return '';
  try {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};