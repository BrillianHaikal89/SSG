"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Named export to avoid ESLint warning
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

const DetailPresensi = () => {
  const router = useRouter();
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = typeof window !== 'undefined' ? localStorage.getItem('attendanceRecords') : null;
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setAttendanceHistory(parsedData.map((item, index) => ({
          id: item.id,
          session: `Sesi Ke ${index + 1}`,
          date: item.date,
          status: item.status,
          description: item.description,
          time: item.time || '',
          location: item.location || '',
          image: item.image || ''
        })));
      }
    } catch (error) {
      console.error('Error loading attendance data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Memuat data presensi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center">
          <Image 
            src="/icons/arrow-left.svg" 
            alt="Back" 
            width={24} 
            height={24}
            priority
          />
          <span className="ml-2">Kembali</span>
        </button>
        <h1 className="text-xl font-bold">Detail Presensi</h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-6 pb-20">
        <h1 className="text-3xl font-bold text-center mb-8">DETAIL PRESENSI</h1>
        
        {attendanceHistory.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Tidak ada data presensi</p>
            <Link href="/presensi" className="text-blue-600 underline mt-4 inline-block">
              Kembali ke halaman presensi
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {attendanceHistory.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/presensi/detail?id=${item.id}`)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg py-2 px-4">
                      <p className="font-medium">{item.session}</p>
                    </div>
                    <p className="text-sm pl-4 mt-1">{item.date}</p>
                    {item.time && <p className="text-sm pl-4">Waktu: {item.time}</p>}
                    {item.description && (
                      <p className="text-sm pl-4 text-gray-600 mt-1">Keterangan: {item.description}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    <button 
                      className={`${getStatusStyle(item.status)} py-2 px-6 rounded-lg text-sm`}
                      disabled
                    >
                      {item.status}
                    </button>
                  </div>
                </div>
                {item.image && (
                  <div className="mt-3">
                    <div className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                      <Image
                        src={item.image}
                        alt="Bukti presensi"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center px-4 py-2">
        <Link href="/" className="flex flex-col items-center p-2">
          <Image 
            src="/icons/home.svg" 
            alt="Home" 
            width={24} 
            height={24}
            priority
          />
          <span className="text-xs mt-1">Beranda</span>
        </Link>
        <Link href="/presensi" className="flex flex-col items-center p-2 text-blue-600">
          <Image 
            src="/icons/calendar-check.svg" 
            alt="Presensi" 
            width={24} 
            height={24}
            priority
          />
          <span className="text-xs mt-1">Presensi</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center p-2">
          <Image 
            src="/icons/user.svg" 
            alt="Profil" 
            width={24} 
            height={24}
            priority
          />
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </nav>
    </div>
  );
};

export default DetailPresensi;