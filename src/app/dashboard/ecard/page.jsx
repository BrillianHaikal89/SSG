"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import useAuthStore from '../../../stores/authStore';
import QRCode from "react-qr-code";
import { motion } from 'framer-motion';

export default function ECard() {
  const { user, loading, error, qrcode, fetchUserQRCode } = useAuthStore();
  const [isPrinting, setIsPrinting] = useState(false);

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
    }, 300);
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

  if (qrcode === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto">
          <div className="text-orange-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Belum Terdaftar</h2>
          <p className="text-gray-600 mb-6">Anda belum terdaftar sebagai peserta Santri Siap Guna.</p>
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">Kamu belum terdaftar sebagai peserta atau terjadi kesalahan saat memuat data.</p>
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
    <div className="min-h-screen bg-gray-100">
      {/* Header hanya ditampilkan saat tidak print */}
      <header className="bg-blue-900 text-white shadow-lg print:hidden">
        <div className="container mx-auto flex justify-between items-center px-4 py-4">
          <div className="flex items-center">
            <Image 
              src="/img/logossg_white.png" 
              alt="Santri Siap Guna Logo" 
              width={40} 
              height={40} 
              className="mr-3"
            />
            <span className="text-xl font-bold tracking-tight">SANTRI SIAP GUNA</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 print:p-0">
        <div className="max-w-4xl mx-auto">
          {/* Title - hide during print */}
          <h1 className="text-3xl font-bold text-center mb-12 print:hidden text-gray-800">Kartu Peserta</h1>
          
          {/* Card container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-8 justify-center print:gap-0 print:justify-between">
              {/* Front Card - Now in landscape orientation */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="print-card bg-blue-800 text-white rounded-xl overflow-hidden shadow-xl w-full md:w-[340px] md:h-[216px] aspect-[1.58/1] flex flex-col print:rounded-none print:shadow-none print:w-85mm print:h-54mm border border-blue-500"
              >
                <div className="flex h-full">
                  {/* Left side with QR code */}
                  <div className="w-2/5 bg-blue-900 flex flex-col justify-center items-center py-4 px-3">
                    <div className="bg-white p-2 rounded-lg mb-3 front-qr shadow-md">
                      {qrcode ? (
                        <QRCode 
                          value={qrcode} 
                          size={110} 
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="w-28 h-28 bg-gray-200 animate-pulse rounded"></div>
                      )}
                    </div>
                    
                  </div>
                  
                  {/* Right side with user info */}
                  <div className="w-3/5 pl-3 flex flex-col py-4 pr-3">
                    <div className="flex items-center">
                      <Image 
                        src="/img/logossg_white.png" 
                        alt="Logo" 
                        width={30} 
                        height={30} 
                        className="mr-2"
                      />
                      <div>
                        <h3 className="text-base font-bold leading-tight tracking-wide">SANTRI SIAP</h3>
                        <h3 className="text-base font-bold leading-tight tracking-wide">GUNA</h3>
                        <p className="text-xs text-white font-medium">KARTU PESERTA</p>
                      </div>
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-center mt-2">
                      <h2 className="text-xl font-bold mb-2 text-white">
                        {user?.name || "Muhamad Brillian Haikal"}
                      </h2>
                      
                      <div className="mt-1">
                        <div className="bg-blue-700 py-1 px-3 rounded-md mb-2 text-sm">
                          Peserta Angkatan 2025
                        </div>
                        <div className="bg-blue-700 py-1 px-3 rounded-md text-sm">
                          Pleton: 20 / Grup B
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card labels - only shown when not printing */}
              <div className="hidden md:flex flex-col justify-center items-center mx-4 print:hidden">
                <div className="bg-gray-300 h-px w-10 my-3"></div>
                <span className="text-sm text-gray-500 transform -rotate-90 font-medium">KARTU PESERTA</span>
                <div className="bg-gray-300 h-px w-10 my-3"></div>
              </div>
              
              {/* Back Card - Improved with better logo placement */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="print-card bg-white rounded-xl overflow-hidden shadow-xl w-full md:w-[340px] md:h-[216px] aspect-[1.58/1] flex flex-col print:rounded-none print:shadow-none print:w-85mm print:h-54mm border border-gray-200"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <Image 
                      src="/img/logo_ssg.png" 
                      alt="Santri Siap Guna Logo" 
                      width={80} 
                      height={25} 
                      className="h-auto"
                    />
                    <Image 
                      src="/img/logo_DT READY.png" 
                      alt="DT Logo" 
                      width={25} 
                      height={25} 
                    />
                  </div>
                  
                  <div className="text-center mt-1 mb-2">
                    <h3 className="text-sm font-bold text-blue-900">ATURAN PENGGUNAAN KARTU</h3>
                  </div>

                  <div className="flex-grow px-5">
                    <ol className="text-sm text-gray-700 pl-5 list-decimal">
                      <li className="mb-1">Kartu ini adalah identitas resmi peserta SSG</li>
                      <li className="mb-1">Wajib dibawa saat kegiatan SSG berlangsung</li>
                      <li className="mb-1">Tunjukkan QR code untuk presensi kehadiran</li>
                      <li className="mb-1">Segera laporkan kehilangan kartu kepada panitia</li>
                    </ol>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Instructions - hide when printing */}
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-5 rounded-lg mb-10 print:hidden shadow-sm">
            <h3 className="font-medium text-blue-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Instruksi Penggunaan:
            </h3>
            <p className="text-sm mt-2 pl-7">
              Kartu ini adalah identitas digital Anda sebagai peserta Santri Siap Guna. 
              Tunjukkan QR code saat diminta untuk presensi kehadiran. Anda dapat mencetak kartu ini
              dengan mengklik tombol "Cetak Kartu" di bawah.
            </p>
          </div>

          {/* Buttons - hide when printing */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden">
            <button 
              onClick={navigateBack}
              className="bg-gray-200 text-gray-800 py-3 px-8 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </button>
            <button 
              onClick={handlePrint}
              disabled={isPrinting}
              className="bg-blue-800 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center justify-center shadow-md"
            >
              {isPrinting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyiapkan...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak Kartu
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: 85mm 54mm landscape;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          /* Hide everything except the card being printed */
          body * {
            visibility: hidden;
          }
          .print-card,
          .print-card * {
            visibility: visible;
          }
          .print-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 85mm;
            height: 54mm;
            overflow: hidden;
            padding: 0;
            margin: 0;
            box-shadow: none !important;
            border: none !important;
          }
          /* Fix QR code printing */
          .front-qr {
            padding: 6px !important;
          }
          .front-qr svg {
            height: 80px !important;
            width: 80px !important;
          }
        }
      `}</style>
    </div>
  );
}