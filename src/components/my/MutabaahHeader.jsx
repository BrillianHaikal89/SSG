"use client";

import React, { useEffect, useState } from 'react';
import { calculateHijriDate, formatGregorianDate } from './HijriDateConverter';

const MutabaahHeader = ({ 
  user, 
  selectedDate, 
  currentDateTime, 
  headerBgColor, 
  formData 
}) => {
  const [hijriDate, setHijriDate] = useState("");
  const [statusText, setStatusText] = useState("");
  
  useEffect(() => {
    const updateDateInfo = () => {
      try {
        // Update Hijri date
        const hijri = calculateHijriDate(selectedDate);
        setHijriDate(hijri.formatted);
        
        // Update status
        const today = new Date();
        const selected = new Date(selectedDate);
        
        // Normalize to noon to avoid timezone issues
        today.setHours(12, 0, 0, 0);
        selected.setHours(12, 0, 0, 0);
        
        const diffDays = Math.round((selected - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) setStatusText("Hari Ini");
        else if (diffDays === -1) setStatusText("Kemarin");
        else if (diffDays < 0) setStatusText(`${Math.abs(diffDays)} Hari Lalu`);
        else setStatusText(`${diffDays} Hari Mendatang`);
      } catch (error) {
        console.error('Error updating date info:', error);
      }
    };
    
    updateDateInfo();
  }, [selectedDate]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`p-4 sm:p-6 ${headerBgColor} text-white`}>
      <h1 className="text-xl sm:text-2xl font-bold text-center">Mutaba'ah Yaumiyah</h1>
      <p className="text-center text-sm sm:text-base mt-1">At-Taqwa dan As-Sunnah</p>
      <p className="text-center font-medium text-sm sm:text-base mt-1 truncate px-2">
        {user?.name || 'Pengguna'}
      </p>
      
      <div className="flex justify-center mt-1">
        <div className="bg-white/20 rounded-full px-3 py-1 text-xs">
          <span className="font-medium">{hijriDate}</span>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <p className="text-xs sm:text-sm">
          {formatGregorianDate(selectedDate)}
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
    </div>
  );
};

export default MutabaahHeader;