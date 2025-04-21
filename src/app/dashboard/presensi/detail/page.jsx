"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DetailPresensi = () => {
  const router = useRouter();
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('attendanceRecords');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAttendanceHistory(parsedData.map((item, index) => ({
        id: item.id,
        session: `Sesi Ke ${index + 1}`,
        date: item.date,
        status: item.status,
        description: item.description
      })));
    }
  }, []);

  // Function to get the appropriate status button style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Hadir":
        return "bg-green-500 text-white";
      case "Sakit":
        return "bg-red-500 text-white";
      case "Izin":
        return "bg-yellow-500 text-black";
      case "Telat":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header (tetap sama) */}
      <header className="bg-blue-900 text-white">
        {/* ... (kode header tetap sama) */}
      </header>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-6 pb-20">
        <h1 className="text-3xl font-bold text-center mb-8">DETAIL PRESENSI</h1>
        
        {/* Attendance History List */}
        <div className="space-y-2">
          {attendanceHistory.map((item, index) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-gray-200 rounded-lg py-2 px-4 mb-1">
                  <p className="font-medium">{`Sesi Ke ${index + 1}`}</p>
                </div>
                <p className="text-sm pl-4">{item.date}</p>
                {item.description && (
                  <p className="text-sm pl-4 text-gray-600">Keterangan: {item.description}</p>
                )}
              </div>
              <div className="ml-4">
                <button 
                  className={`${getStatusStyle(item.status)} py-2 px-8 rounded-lg`}
                  disabled
                >
                  {item.status}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation (tetap sama) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center px-4 py-2">
        {/* ... (kode navigasi tetap sama) */}
      </nav>
    </div>
  );
};

export default DetailPresensi;