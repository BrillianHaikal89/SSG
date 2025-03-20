"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DetailPresensi = () => {
  const router = useRouter();
  
  // Attendance history data
  const attendanceHistory = [
    { id: 1, session: "Sesi Ke 1", date: "Sabtu, 22 Maret 2025 - 04:30", status: "Hadir" },
    { id: 2, session: "Sesi Ke 2", date: "Minggu, 23 Maret 2025 - 04:15", status: "Hadir" },
    { id: 3, session: "Sesi Ke 3", date: "Sabtu, 29 Maret 2025 - 04:30", status: "Izin" },
    { id: 4, session: "Sesi Ke 4", date: "Minggu, 30 Maret 2025 - 04:15", status: "Hadir" },
    { id: 5, session: "Sesi Ke 5", date: "Sabtu, 6 Maret 2025 - 04:30", status: "Hadir" },
    { id: 6, session: "Sesi Ke 6", date: "Minggu, 7 Maret 2025 - 04:30", status: "Sakit" },
    { id: 7, session: "Sesi Ke 7", date: "Sabtu, 22 Maret 2025 - 04:30", status: "Hadir" },
    { id: 8, session: "Sesi Ke 8", date: "Minggu, 22 Maret 2025 - 04:30", status: "Hadir" },
  ];

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
      {/* Header */}
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/img/logossg_white.png" 
                alt="Logo Santri Siap Guna" 
                width={36} 
                height={36} 
                className="mr-2"
              />
              <h1 className="text-xl font-bold">SANTRI SIAP GUNA</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="bg-white text-blue-900 rounded-full h-8 w-8 flex items-center justify-center font-bold">
                M
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-6 pb-20">
        <h1 className="text-3xl font-bold text-center mb-8">DETAIL PRESENSI</h1>
        
        {/* Attendance History List */}
        <div className="space-y-2">
          {attendanceHistory.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-gray-200 rounded-lg py-2 px-4 mb-1">
                  <p className="font-medium">{item.session}</p>
                </div>
                <p className="text-sm pl-4">{item.date}</p>
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
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center px-4 py-2">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex flex-col items-center px-3 py-1 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Beranda</span>
        </button>
        <button 
          className="flex flex-col items-center px-3 py-1 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs mt-1">Al-Quran</span>
        </button>
        <button 
          className="flex flex-col items-center px-3 py-1 text-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Presensi</span>
        </button>
        <button 
          className="flex flex-col items-center px-3 py-1 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-xs mt-1">Tugas</span>
        </button>
        <button 
          onClick={() => router.push('/dashboard/profile')}
          className="flex flex-col items-center px-3 py-1 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default DetailPresensi;