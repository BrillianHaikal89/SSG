"use client";

import React, { useEffect, useState } from 'react';
import { formatGregorianDate, calculateHijriDate, formatHijriDate } from './HijriDateConverter';

const MutabaahHeader = ({ 
  user, 
  selectedDate, 
  currentDateTime, 
  headerBgColor, 
  formData 
}) => {
  const [hijriDate, setHijriDate] = useState("");
  const [statusText, setStatusText] = useState("");
  
  // Calculate days difference between selected date and today
  const calculateDaysDifference = (dateString) => {
    try {
      const today = new Date();
      const todayFormatted = today.toISOString().split('T')[0];
      
      if (dateString === todayFormatted) {
        return 0;
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toISOString().split('T')[0];
      if (dateString === yesterdayFormatted) {
        return -1;
      }
      
      const selected = new Date(dateString + 'T12:00:00');
      const todayNoon = new Date(todayFormatted + 'T12:00:00');
      
      const diffTime = selected.getTime() - todayNoon.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('Error calculating days difference:', error);
      return 0;
    }
  };

  // Update Hijri date when selected date changes
  useEffect(() => {
    try {
      const date = new Date(selectedDate);
      const hijri = calculateHijriDate(date);
      setHijriDate(hijri.formatted);
    } catch (error) {
      console.error('Failed to update Hijri date:', error);
      setHijriDate("");
    }
  }, [selectedDate]);

  // Update status text when date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate === today) {
      setStatusText("Tepat Waktu");
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    if (selectedDate === yesterdayFormatted) {
      setStatusText("Terlambat 1 hari");
      return;
    }
    
    const daysDiff = calculateDaysDifference(selectedDate);
    if (daysDiff > 0) {
      setStatusText(`${daysDiff} hari ke depan`);
    } else {
      const lateDays = Math.abs(daysDiff);
      setStatusText(`Terlambat ${lateDays} hari`);
    }
  }, [selectedDate]);

  // Format time for display
  const formatTime = (date) => {
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

  return (
    <div className={`p-4 sm:p-6 ${headerBgColor} text-white`}>
      <h1 className="text-xl sm:text-2xl font-bold text-center">Mutaba'ah Yaumiyah</h1>
      <p className="text-center text-sm sm:text-base mt-1">At-Taqwa dan As-Sunnah</p>
      <p className="text-center font-medium text-sm sm:text-base mt-1 truncate px-2">
        {user?.name || 'Pengguna'}
      </p>
      
      {/* Hijri and Gregorian dates below the name */}
      <div className="flex justify-center mt-1">
        <div className="bg-white/20 rounded-full px-3 py-1 text-xs text-white">
          <span className="font-medium">{formatHijriDate(hijriDate) || '...'}</span>
        </div>
      </div>
      
      {currentDateTime && (
        <div className="text-center mt-2">
          <p className="text-xs sm:text-sm">
            {formatGregorianDate(new Date(selectedDate)) || 'Loading...'}
          </p>
          <p className="text-base sm:text-lg font-bold">
            {formatTime(currentDateTime)}
          </p>
          {statusText && (
            <p className="text-white text-xs sm:text-sm font-medium mt-1 bg-white/20 px-2 py-1 rounded-full inline-block">
              {statusText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MutabaahHeader;