"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const DetailPresensi = () => {
  const router = useRouter();

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

      {/* Main Content - Coming Soon Message */}
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Image
            src="/images/under-construction.svg"
            alt="Coming Soon"
            width={300}
            height={300}
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Fitur Sedang Dalam Pengembangan</h2>
          <p className="text-gray-600 mb-6">
            Mohon maaf, fitur detail presensi saat ini belum tersedia. Kami sedang bekerja untuk menyediakan fitur ini secepatnya.
          </p>
          <button
            onClick={() => router.push('/presensi')}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Halaman Presensi
          </button>
        </div>
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