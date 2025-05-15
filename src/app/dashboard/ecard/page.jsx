"use client";

import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import useAuthStore from '../../../stores/authStore';
import QRCode from "react-qr-code";
import { motion } from 'framer-motion';

export default function ECard() {
  const { user, loading, error, qrcode, fetchUserQRCode } = useAuthStore();
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    fetchUserQRCode();
  }, [fetchUserQRCode]);

  const navigateBack = () => {
    window.history.back();
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin h-12 w-12 mx-auto border-b-2 border-blue-800 rounded-full mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data kartu...</p>
        </div>
      </div>
    );
  }

  if (qrcode === null || error) {
    const isError = error !== null;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto">
          <div className={`${isError ? 'text-red-500' : 'text-orange-500'} mb-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isError ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"} />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {isError ? 'Terjadi Kesalahan' : 'Belum Terdaftar'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isError ? 'Kamu belum terdaftar sebagai peserta atau terjadi kesalahan saat memuat data.' : 'Anda belum terdaftar sebagai peserta Santri Siap Guna.'}
          </p>
          <button 
            onClick={navigateBack} 
            className="bg-blue-800 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-900 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" ref={printRef}>
      <Head>
        <style type="text/css" media="print">{`
          @page {
            size: 85mm 108mm landscape;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #front-card, #back-card,
          #front-card * , #back-card * {
            visibility: visible !important;
          }
          #front-card {
            position: absolute;
            top: 0;
            left: 0;
          }
          #back-card {
            position: absolute;
            top: 54mm;
            left: 0;
          }
        `}</style>
      </Head>

      <header className="bg-blue-900 text-white shadow-lg print:hidden">
        <div className="container mx-auto px-4 py-4 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <button onClick={navigateBack} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center">
            <Image src="/img/logossg_white.png" alt="Logo" width={40} height={40} className="mr-3" />
            <span className="text-xl font-bold tracking-tight">SANTRI SIAP GUNA</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 print:p-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 print:hidden">Kartu Peserta Digital</h1>

          <div className="flex flex-col md:flex-row gap-8 justify-center print:gap-0 print:justify-center">
            {/* Front Card */}
            <div id="front-card" className="bg-blue-700 text-white rounded-xl w-[85mm] h-[54mm] flex overflow-hidden">
              <div className="w-2/5 bg-blue-900 flex justify-center items-center p-3">
                <div className="bg-white p-2 rounded mb-2">
                  <QRCode value={qrcode} size={100} />
                </div>
              </div>
              <div className="w-3/5 p-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold">SANTRI SIAP GUNA</h3>
                  <p className="text-xs">KARTU PESERTA</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-sm">Angkatan 2025</p>
                  <p className="text-sm">Pleton: {user?.pleton} / Grup: {user?.grup}</p>
                </div>
              </div>
            </div>

            {/* Back Card */}
            <div id="back-card" className="bg-white rounded-xl w-[85mm] h-[54mm] flex flex-col justify-between p-4">
              <div className="text-center">
                <h3 className="text-sm font-bold text-blue-900">ATURAN PENGGUNAAN KARTU</h3>
              </div>
              <ol className="text-xs text-gray-800 list-decimal ml-4 space-y-1">
                <li>Kartu ini adalah identitas resmi peserta SSG</li>
                <li>Wajib dibawa saat kegiatan SSG berlangsung</li>
                <li>Tunjukkan QR code untuk presensi</li>
                <li>Segera laporkan kehilangan kartu kepada panitia</li>
              </ol>
              <div className="text-center text-xs text-blue-800 font-semibold">
                Kartu ini hanya berlaku selama program SSG 2025
              </div>
            </div>
          </div>

          {/* Tips - hidden on print */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg my-8 print:hidden">
            <h3 className="font-medium mb-1">Tips Mencetak:</h3>
            <ul className="text-sm list-disc ml-6">
              <li>Gunakan kertas tebal (210-300gsm)</li>
              <li>Pengaturan tanpa margin</li>
              <li>Ukuran: 85mm × 54mm (landscape)</li>
              <li>Cetak warna</li>
            </ul>
          </div>

          {/* Button - hidden on print */}
          <div className="flex justify-center print:hidden">
            <button 
              onClick={handlePrint}
              disabled={isPrinting}
              className="bg-blue-800 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm print:hidden"
            >
              {isPrinting ? "Menyiapkan..." : "Cetak Kartu"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
