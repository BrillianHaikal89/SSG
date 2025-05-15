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
  const [activeCard, setActiveCard] = useState('front');

  useEffect(() => {
    fetchUserQRCode();
  }, [fetchUserQRCode]);

  const navigateBack = () => {
    window.history.back();
  };

  const handlePrint = (cardSide) => {
    setActiveCard(cardSide);
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
      }, 500);
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
        <div className="container mx-auto px-4 py-4 relative">
          {/* Tombol kembali di kiri */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <button 
              onClick={navigateBack}
              className="text-white"
              aria-label="Kembali ke dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
          
          {/* Santri Siap Guna di tengah */}
          <div className="flex items-center justify-center">
            <Image 
              src="/img/logossg_white.png" 
              alt="Santri Siap Guna Logo" 
              width={40} 
              height={40} 
              className="mr-3"
            />
            <span className="text-xl font-bold tracking-tight">SANTRI SIAP GUNA</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 print:p-0">
        <div className="max-w-4xl mx-auto">
          {/* Title - hide during print */}
          <h1 className="text-3xl font-bold text-center mb-8 print:hidden text-gray-800">Kartu Peserta Digital</h1>
          
          {/* Card container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 cards-container"
          >
            <div className="flex flex-col md:flex-row gap-8 justify-center print:gap-0 print:justify-center">
              {/* Front Card - Now in landscape orientation */}
              <motion.div 
                id="front-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`front-card bg-blue-700 text-white rounded-xl overflow-hidden shadow-xl w-full md:w-[400px] md:h-[250px] aspect-[1.58/1] flex flex-col print:rounded-none print:shadow-none print:w-[85mm] print:h-[54mm] border border-blue-500 ${activeCard === 'back' ? 'print:hidden' : ''}`}
              >
                <div className="flex h-full">
                  {/* Left side with QR code */}
                  <div className="w-2/5 bg-blue-900 flex flex-col justify-center items-center py-3 px-3">
                    <div className="bg-white p-2 rounded-lg mb-2 front-qr shadow-md qrcode-container">
                      {qrcode ? (
                        <QRCode 
                          value={qrcode} 
                          size={120} 
                          className="w-full h-auto qrcode-image"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 animate-pulse rounded"></div>
                      )}
                    </div>
                    <p className="text-center text-xs font-medium text-blue-100">Scan untuk verifikasi</p>
                  </div>
                  
                  {/* Right side with user info */}
                  <div className="w-3/5 pl-3 flex flex-col py-4 pr-3">
                    <div className="flex items-center">
                      <Image 
                        src="/img/logossg_white.png" 
                        alt="Logo" 
                        width={32} 
                        height={32} 
                        className="mr-2"
                      />
                      <div>
                        <h3 className="text-lg font-bold leading-none tracking-wide">SANTRI SIAP</h3>
                        <h3 className="text-lg font-bold leading-none tracking-wide">GUNA</h3>
                        <p className="text-xs text-white font-medium">KARTU PESERTA</p>
                      </div>
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-center mt-2">
                      <h2 className="text-xl font-bold mb-2 text-white">
                        {user?.name || "MUHAMAD BRILLIAN HAIKAL"}
                      </h2>
                      
                      <div className="space-y-2">
                        <div className="bg-blue-800 py-1.5 px-3 rounded-md text-sm font-medium">
                          Peserta Angkatan 2025
                        </div>
                        <div className="bg-blue-800 py-1.5 px-3 rounded-md text-sm font-medium">
                          Pleton: {user?.pleton || "20"} / Grup {user?.grup || "B"}
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
                id="back-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={`back-card bg-white rounded-xl overflow-hidden shadow-xl w-full md:w-[400px] md:h-[250px] aspect-[1.58/1] flex flex-col print:rounded-none print:shadow-none print:w-[85mm] print:h-[54mm] border border-gray-200 ${activeCard === 'front' ? 'print:hidden' : ''}`}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between px-4 pt-2 pb-1 border-b border-gray-100">
                    <Image 
                      src="/img/logo_ssg.png" 
                      alt="Santri Siap Guna Logo" 
                      width={80} 
                      height={22} 
                      className="h-auto"
                    />
                    <Image 
                      src="/img/logo_DT READY.png" 
                      alt="DT Logo" 
                      width={24} 
                      height={24} 
                    />
                  </div>
                  
                  <div className="text-center my-1">
                    <h3 className="text-sm font-bold text-blue-900">ATURAN PENGGUNAAN KARTU</h3>
                  </div>

                  <div className="flex-grow px-4 overflow-visible pb-1">
                    <ol className="text-xs text-gray-800 list-decimal ml-4 mt-0 space-y-0.5">
                      <li className="font-medium leading-tight">Kartu ini adalah identitas resmi peserta SSG</li>
                      <li className="font-medium leading-tight">Wajib dibawa saat kegiatan SSG berlangsung</li>
                      <li className="font-medium leading-tight">Tunjukkan QR code untuk presensi kehadiran</li>
                      <li className="font-medium leading-tight">Segera laporkan kehilangan kartu kepada<br/>panitia</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 py-1.5 px-4 text-xs text-blue-800 font-semibold text-center border-t border-blue-100">
                    Kartu ini hanya berlaku selama program Santri Siap Guna 2025
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Instructions - hide when printing */}
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-5 rounded-lg mb-8 print:hidden shadow-sm">
            <h3 className="font-medium text-blue-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Instruksi Penggunaan:
            </h3>
            <p className="text-sm mt-2 pl-7">
              Kartu ini adalah identitas digital Anda sebagai peserta Santri Siap Guna. 
              Tunjukkan QR code saat diminta untuk presensi kehadiran. Untuk mencetak kartu,
              gunakan tombol "Cetak Depan" atau "Cetak Belakang" di bawah.
            </p>
          </div>

          {/* Buttons - hide when printing */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 print:hidden">
            {/* Print Buttons */}
            <button 
              onClick={() => handlePrint('front')}
              disabled={isPrinting}
              className="bg-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center justify-center shadow-sm"
            >
              {isPrinting && activeCard === 'front' ? (
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
                  Cetak Depan
                </>
              )}
            </button>
            
            <button 
              onClick={() => handlePrint('back')}
              disabled={isPrinting}
              className="bg-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center shadow-sm"
            >
              {isPrinting && activeCard === 'back' ? (
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
                  Cetak Belakang
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
            margin: 0mm;
            padding: 0mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Hide everything except the card being printed */
          body * {
            visibility: hidden;
            position: absolute;
            left: -9999px;
          }
          
          /* Show selected card container */
          .cards-container,
          .cards-container * {
            position: static;
            visibility: hidden;
          }
          
          /* Front card specific styling */
          .front-card {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 85mm !important;
            height: 54mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            background-color: #1d4ed8 !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            display: ${activeCard === 'front' ? 'flex !important' : 'none !important'};
            visibility: ${activeCard === 'front' ? 'visible !important' : 'hidden !important'};
          }
          
          /* Back card specific styling */
          .back-card {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 85mm !important;
            height: 54mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            background-color: white !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            display: ${activeCard === 'back' ? 'flex !important' : 'none !important'};
            visibility: ${activeCard === 'back' ? 'visible !important' : 'hidden !important'};
          }
          
          /* Make sure all children of the active card are visible */
          .front-card * {
            visibility: ${activeCard === 'front' ? 'visible !important' : 'hidden !important'};
            display: ${activeCard === 'front' ? 'initial !important' : 'none !important'};
            position: initial !important;
          }
          
          .back-card * {
            visibility: ${activeCard === 'back' ? 'visible !important' : 'hidden !important'};
            display: ${activeCard === 'back' ? 'initial !important' : 'none !important'};
            position: initial !important;
          }
          
          /* Keep flex layouts intact */
          .front-card > div,
          .back-card > div,
          .front-card .flex,
          .back-card .flex {
            display: flex !important;
          }
          
          .front-card .flex-col,
          .back-card .flex-col {
            flex-direction: column !important;
          }
          
          /* Make sure QR code displays properly */
          .front-card .qrcode-container {
            background-color: white !important;
            padding: 8px !important;
            margin-bottom: 8px !important;
            border-radius: 4px !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          
          .front-card .qrcode-image {
            width: 100% !important;
            height: auto !important;
            max-width: 90px !important;
            display: block !important;
          }
          
          /* Fix background colors in print */
          .front-card .bg-blue-900 {
            background-color: #1e3a8a !important;
          }
          
          .front-card .bg-blue-800 {
            background-color: #1e40af !important;
          }
          
          .back-card .bg-blue-50 {
            background-color: #eff6ff !important;
          }
          
          /* Fix list styling in back card */
          .back-card ol {
            display: block !important;
            list-style-type: decimal !important;
            padding-left: 16px !important;
          }
          
          .back-card li {
            display: list-item !important;
            color: #1f2937 !important;
          }
          
          /* Fix layout */
          .h-full {
            height: 100% !important;
          }
          
          .flex-grow {
            flex-grow: 1 !important;
          }
          
          .w-2\/5 {
            width: 40% !important;
          }
          
          .w-3\/5 {
            width: 60% !important;
          }
        }
      `}</style>
    </div>
  );
}