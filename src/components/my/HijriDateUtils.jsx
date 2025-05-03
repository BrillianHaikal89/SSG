"use client";

// Hijri month names
export const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

/**
 * Calculate Hijri date from Gregorian date
 * @param {Date} gregorianDate - Gregorian date to convert
 * @returns {Object} - Hijri date details
 */
export const calculateHijriDate = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    
    // Julian day calculation
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Simplified and more accurate Hijri calculation
    const jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
              Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
              Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
              day - 32075;
    
    // Convert to Islamic date
    const shift1 = 8.01/60;
    const z = jd + shift1;
    const a = Math.floor((z + 0.5) * 0.97253);
    const d = Math.floor((a - 0.5) / 354);
    const e = z + 0.5 - 354 * d - Math.floor(d / 30) * d;
    const g = Math.floor(e * 30.6);
    const h = e - Math.floor(g * 0.0328);
    
    const islamicMonth = g;
    const islamicDay = Math.floor(h + 0.5);
    const islamicYear = d + 16;
    
    return {
      day: islamicDay,
      month: islamicMonth,
      year: islamicYear,
      formatted: `${islamicDay} ${HIJRI_MONTHS[islamicMonth]} ${islamicYear} H`
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

/**
 * Get Hijri date from Gregorian date using browser API or fallback
 * @param {Date} date - Gregorian date to convert
 * @returns {string} - Formatted Hijri date 
 */
export const getHijriDate = (date) => {
  try {
    // Try using Intl.DateTimeFormat first if browser supports it
    if (typeof Intl !== 'undefined' && 
        Intl.DateTimeFormat && 
        Intl.DateTimeFormat.supportedLocalesOf(['ar-SA-u-ca-islamic']).length > 0) {
      
      const options = {
        calendar: 'islamic',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', options).format(date);
    } else {
      // Fallback to our algorithm
      return calculateHijriDate(date).formatted;
    }
  } catch (error) {
    console.error('Error getting Hijri date:', error);
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
    
    // Replace Arabic text with English
    latinNumerals = latinNumerals.replace(/ذو القعدة/, "Dhu al-Qi'dah");
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