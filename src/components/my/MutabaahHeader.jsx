"use client";

// Hijri month names
export const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

// First day of Hijri months for 1446 (2025) in Gregorian calendar
// Based on official Umm al-Qura calendar
const HIJRI_1446_MONTHS_START = {
  // Month number: [start day, start month, end day, end month] - months are 0-indexed
  0: [4, 6, 3, 7],     // Muharram: July 4, 2024 - August 3, 2024
  1: [4, 7, 1, 8],     // Safar: August 4, 2024 - September 1, 2024
  2: [2, 8, 1, 9],     // Rabi' al-Awwal: September 2, 2024 - October 1, 2024
  3: [2, 9, 31, 9],    // Rabi' al-Thani: October 2, 2024 - October 31, 2024
  4: [1, 10, 29, 10],  // Jumada al-Awwal: November 1, 2024 - November 29, 2024
  5: [30, 10, 29, 11], // Jumada al-Thani: November 30, 2024 - December 29, 2024
  6: [30, 11, 28, 0],  // Rajab: December 30, 2024 - January 28, 2025
  7: [29, 0, 27, 1],   // Sha'ban: January 29, 2025 - February 27, 2025
  8: [28, 1, 28, 2],   // Ramadan: February 28, 2025 - March 28, 2025
  9: [29, 2, 28, 3],   // Shawwal: March 29, 2025 - April 28, 2025
  10: [29, 3, 27, 4],  // Dhu al-Qi'dah: April 29, 2025 - May 27, 2025
  11: [28, 4, 26, 5]   // Dhu al-Hijjah: May 28, 2025 - June 26, 2025
};

/**
 * Calculate Hijri date from Gregorian date using Umm al-Qura calendar
 * @param {Date} gregorianDate - Gregorian date to convert
 * @returns {Object} - Hijri date details
 */
export const calculateHijriDate = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    
    // Get date components
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const day = date.getDate();
    
    // Special case for 1446 Hijri (2024-2025)
    if (year === 2024 || year === 2025) {
      // Check which Hijri month we're in
      let hijriMonth = -1;
      let hijriDay = 0;
      let hijriYear = 1446;
      
      // Check each month range
      for (let m = 0; m < 12; m++) {
        const [startDay, startMonth, endDay, endMonth] = HIJRI_1446_MONTHS_START[m];
        
        const startYear = startMonth > 5 ? 2024 : 2025;
        const endYear = endMonth > 5 ? 2024 : 2025;
        
        const startDate = new Date(startYear, startMonth, startDay);
        const endDate = new Date(endYear, endMonth, endDay);
        
        // Add one day to endDate to make the comparison inclusive
        endDate.setDate(endDate.getDate() + 1);
        
        if (date >= startDate && date < endDate) {
          hijriMonth = m;
          
          // Calculate days since start of Hijri month
          const diffTime = date.getTime() - startDate.getTime();
          hijriDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
          break;
        }
      }
      
      // Handle special case for end of year
      if (hijriMonth === -1 && month === 5 && day >= 27) {
        hijriMonth = 0; // Muharram
        hijriYear = 1447;
        
        // Calculate days since start of Muharram 1447
        const startDate = new Date(2025, 5, 27); // June 27, 2025
        const diffTime = date.getTime() - startDate.getTime();
        hijriDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
      
      if (hijriMonth !== -1) {
        return {
          day: hijriDay,
          month: hijriMonth,
          year: hijriYear,
          formatted: `${hijriDay} ${HIJRI_MONTHS[hijriMonth]} ${hijriYear} H`
        };
      }
    }
    
    // Fallback to algorithmic calculation for other years
    return fallbackHijriCalculation(date);
  } catch (error) {
    console.error('Error calculating Hijri date:', error);
    // Fallback to basic calculation
    return fallbackHijriCalculation(gregorianDate);
  }
};

/**
 * Fallback calculation for dates outside the hardcoded range
 * @param {Date} gregorianDate - Gregorian date
 * @returns {Object} - Hijri date details
 */
const fallbackHijriCalculation = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    
    // Julian day calculation
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
              Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
              Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
              day - 32075;
    
    // Umm al-Qura adjustment
    const l = jd - 1948440;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + 
              Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * l2) / 50) - 
               Math.floor(l2 / 16) * Math.floor((15238 * l2) / 43) + 29;
    
    const hijriMonth = Math.floor((24 * l3) / 709);
    const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;
    
    return {
      day: hijriDay,
      month: hijriMonth,
      year: hijriYear,
      formatted: `${hijriDay} ${HIJRI_MONTHS[hijriMonth]} ${hijriYear} H`
    };
  } catch (error) {
    console.error('Error in fallback Hijri calculation:', error);
    return { 
      day: 1, 
      month: 0, 
      year: 1446, 
      formatted: "1 Muharram 1446 H" 
    };
  }
};

/**
 * Get Hijri date from Gregorian date using browser API or calculation
 * @param {Date} date - Gregorian date to convert
 * @returns {string} - Formatted Hijri date 
 */
export const getHijriDate = (date) => {
  try {
    // Try using Intl.DateTimeFormat first if browser supports it
    if (typeof Intl !== 'undefined' && 
        Intl.DateTimeFormat && 
        Intl.DateTimeFormat.supportedLocalesOf(['ar-SA-u-ca-islamic-umalqura']).length > 0) {
      
      const options = {
        calendar: 'islamic-umalqura',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      
      const dateString = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', options).format(date);
      console.log('Browser API Hijri date:', dateString);
      return dateString;
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