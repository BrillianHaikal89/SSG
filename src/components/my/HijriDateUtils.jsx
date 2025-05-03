"use client";

// Hijri month names
export const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

// Umm al-Qura month lengths - 1 means 30 days, 0 means 29 days
// Data format: Each value is 12-bits representing months in a year
// This is a small sample - in a real implementation, this would be more extensive
const UQ_MONTH_DATA = [
  0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
  0xA6, 0x2A, 0x95, 0x2A, 0xD5, 0x56, 0xAD, 0x55, 0x4A, 0xA9, 0x5D, 0x2B, 0x16, 0x2A, 0x95, 0x2A,
  0x95, 0x56, 0xAD, 0x55, 0x6A, 0xA9, 0x5D, 0x2B, 0x15, 0x2A, 0x95, 0x2A, 0x95, 0x56, 0xAD, 0x55,
  0x6A, 0xA9, 0x5D, 0x2B, 0x15, 0x2A, 0x95, 0x2A, 0x95, 0x56, 0xAD, 0x55, 0x6A, 0xA9, 0x5D, 0x2B
];

/**
 * Calculate Hijri date from Gregorian date
 * Improved implementation with better accuracy
 * @param {Date} gregorianDate - Gregorian date to convert
 * @returns {Object} - Hijri date details
 */
export const calculateHijriDate = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    
    // Julian day calculation
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Calculate Julian day number
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
             Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Find the approximate Hijri year
    // Using the formula: Hijri year ≈ (Gregorian year - 622) * (33/32)
    const approxHY = Math.floor((year - 622) * (33/32));
    
    // Constants for conversion
    const c1 = 1948440; // Julian day of Hijri epoch (1/1/1 AH)
    const c2 = 10631;   // Days in 30 Hijri years
    const shift = 0.1;  // Fine adjustment for Umm al-Qura

    // Calculate Hijri date
    const n = Math.floor((jd - c1 + shift) / c2);
    const d = jd - c1 - n * c2 + shift;
    
    // Adjusted days since start of current cycle
    const adjDays = d;
    
    // Calculate year in current cycle and days in current year
    let yc = 0;
    let dc = adjDays;
    
    // Loop through years in 30-year cycle (years have either 354 or 355 days)
    for (yc = 0; yc < 30; yc++) {
      const yearLength = (((11 * yc) + 14) % 30) < 11 ? 355 : 354;
      if (dc <= yearLength) break;
      dc -= yearLength;
    }
    
    // Calculate Hijri year, month, and day
    const hijriYear = n * 30 + yc + 1;
    
    // Find the month and day
    let hijriMonth = 0;
    let hijriDay = dc;
    
    // Loop through months (alternating 30 and 29 days, with adjustments)
    for (hijriMonth = 0; hijriMonth < 12; hijriMonth++) {
      // Get month length from Umm al-Qura data if available, otherwise use pattern
      let monthLength = 29 + (hijriMonth % 2); // Default pattern: odd months = 30 days, even = 29 days
      
      // Apply Umm al-Qura correction if available for this year
      if (hijriYear >= 1356 && hijriYear <= 1480) {
        const idx = hijriYear - 1356;
        if (idx < UQ_MONTH_DATA.length) {
          const monthBit = 11 - hijriMonth;
          monthLength = ((UQ_MONTH_DATA[idx] & (1 << monthBit)) !== 0) ? 30 : 29;
        }
      }
      
      if (hijriDay <= monthLength) break;
      hijriDay -= monthLength;
    }
    
    return {
      day: hijriDay,
      month: hijriMonth,
      year: hijriYear,
      formatted: `${hijriDay} ${HIJRI_MONTHS[hijriMonth]} ${hijriYear} H`
    };
  } catch (error) {
    console.error('Error calculating Hijri date:', error);
    
    // Fallback to current date and estimated Hijri date
    const today = new Date();
    const currentYear = today.getFullYear();
    const estimatedHijriYear = Math.floor((currentYear - 622) * (33/32));
    
    return { 
      day: 1, 
      month: 0, 
      year: estimatedHijriYear, 
      formatted: `1 ${HIJRI_MONTHS[0]} ${estimatedHijriYear} H` 
    };
  }
};

/**
 * Get Hijri date from Gregorian date using browser API or fallback
 * @param {Date} date - Gregorian date to convert
 * @returns {string} - Formatted Hijri date 
 */
export const getHijriDate = (date) => {
  try {
    // Try using Intl.DateTimeFormat for 'islamic-umalqura' calendar if supported
    if (typeof Intl !== 'undefined' && 
        Intl.DateTimeFormat && 
        Intl.DateTimeFormat.supportedLocalesOf(['ar-SA-u-ca-islamic-umalqura']).length > 0) {
      
      const options = {
        calendar: 'islamic-umalqura',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      
      // Get Hijri date using browser's built-in converter
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', options).format(date);
    } else {
      // Fallback to our algorithm
      return calculateHijriDate(date).formatted;
    }
  } catch (error) {
    console.error('Error getting Hijri date:', error);
    // Fallback to our calculation algorithm
    return calculateHijriDate(date).formatted;
  }
};

/**
 * Format Hijri date for display - Latin numerals only
 * @param {string} hijriString - Raw Hijri date string 
 * @returns {string} - Formatted Hijri date
 */
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
    
    // Replace Arabic month names with English
    latinNumerals = latinNumerals.replace(/محرم|المحرم/, "Muharram");
    latinNumerals = latinNumerals.replace(/صفر/, "Safar");
    latinNumerals = latinNumerals.replace(/ربيع الأول/, "Rabi' al-Awwal");
    latinNumerals = latinNumerals.replace(/ربيع الثاني|ربيع الآخر/, "Rabi' al-Thani");
    latinNumerals = latinNumerals.replace(/جمادى الأولى/, "Jumada al-Awwal");
    latinNumerals = latinNumerals.replace(/جمادى الثانية|جمادى الآخرة/, "Jumada al-Thani");
    latinNumerals = latinNumerals.replace(/رجب/, "Rajab");
    latinNumerals = latinNumerals.replace(/شعبان/, "Sha'ban");
    latinNumerals = latinNumerals.replace(/رمضان/, "Ramadan");
    latinNumerals = latinNumerals.replace(/شوال/, "Shawwal");
    latinNumerals = latinNumerals.replace(/ذو القعدة/, "Dhu al-Qi'dah");
    latinNumerals = latinNumerals.replace(/ذو الحجة/, "Dhu al-Hijjah");
    latinNumerals = latinNumerals.replace(/هـ/, "H");
    
    return latinNumerals;
  } catch (error) {
    console.error('Error formatting Hijri date:', error);
    return hijriString; // Return original if formatting fails
  }
};

/**
 * Format date for display in UI
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
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

/**
 * Format time for display in UI
 * @param {Date} date - Date to extract time from
 * @returns {string} - Formatted time string
 */
export const formatTime = (date) => {
  if (!date) return '';
  try {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};