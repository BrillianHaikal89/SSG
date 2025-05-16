"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DetailPresensi = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back Button Only */}
      <button 
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex items-center p-2"
      >
        <Image 
          src="/icons/arrow-left.svg" 
          alt="Back" 
          width={20} 
          height={20}
        />
      </button>

      {/* Centered Coming Soon Message */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Fitur Sedang Dalam Pengembangan
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Mohon maaf, fitur ini belum tersedia saat ini. Kami sedang bekerja untuk menyelesaikannya secepat mungkin.
        </p>
      </div>
    </div>
  );
};

export default DetailPresensi;