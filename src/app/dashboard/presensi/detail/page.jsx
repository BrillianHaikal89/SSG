"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const PresensiDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [attendanceDetail, setAttendanceDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) {
      router.push('/presensi');
      return;
    }

    const savedData = localStorage.getItem('attendanceRecords');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const foundItem = parsedData.find(item => item.id === id);
      
      if (foundItem) {
        setAttendanceDetail({
          ...foundItem,
          session: `Sesi Ke ${parsedData.findIndex(item => item.id === id) + 1}`
        });
      } else {
        router.push('/presensi');
      }
    }
    setIsLoading(false);
  }, [searchParams, router]);

  // Function to get the appropriate status style
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Memuat data...</p>
      </div>
    );
  }

  if (!attendanceDetail) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p>Data presensi tidak ditemukan</p>
        <Link href="/presensi" className="mt-4 text-blue-600 underline">
          Kembali ke daftar presensi
        </Link>
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
          />
          <span className="ml-2">Kembali</span>
        </button>
        <h1 className="text-xl font-bold">Detail Presensi</h1>
        <div className="w-8"></div> {/* Spacer untuk balance layout */}
      </header>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-6 pb-20">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{attendanceDetail.session}</h2>
            <span className={`${getStatusStyle(attendanceDetail.status)} py-1 px-4 rounded-full text-sm`}>
              {attendanceDetail.status}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-gray-500 text-sm">Tanggal</h3>
              <p className="text-lg">{attendanceDetail.date}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-sm">Waktu Presensi</h3>
              <p className="text-lg">{attendanceDetail.time || '-'}</p>
            </div>

            {attendanceDetail.location && (
              <div>
                <h3 className="text-gray-500 text-sm">Lokasi</h3>
                <p className="text-lg">{attendanceDetail.location}</p>
              </div>
            )}

            {attendanceDetail.description && (
              <div>
                <h3 className="text-gray-500 text-sm">Keterangan</h3>
                <p className="text-lg whitespace-pre-line">{attendanceDetail.description}</p>
              </div>
            )}

            {attendanceDetail.image && (
              <div>
                <h3 className="text-gray-500 text-sm mb-2">Bukti Presensi</h3>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={attendanceDetail.image}
                    alt="Bukti presensi"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Link 
            href="/presensi" 
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Daftar Presensi
          </Link>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center px-4 py-2">
        <button className="flex flex-col items-center p-2">
          <Image src="/icons/home.svg" alt="Home" width={24} height={24} />
          <span className="text-xs mt-1">Beranda</span>
        </button>
        <button className="flex flex-col items-center p-2 text-blue-600">
          <Image src="/icons/calendar-check.svg" alt="Presensi" width={24} height={24} />
          <span className="text-xs mt-1">Presensi</span>
        </button>
        <button className="flex flex-col items-center p-2">
          <Image src="/icons/user.svg" alt="Profil" width={24} height={24} />
          <span className="text-xs mt-1">Profil</span>
        </button>
      </nav>
    </div>
  );
};

export default PresensiDetail;