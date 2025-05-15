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
    <div className="min-h-screen bg-gray-100 relative">
      <Head>
        <style type="text/css" media="print">{`
          @page {
            size: 85mm 108mm landscape;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #front-card,
          #back-card,
          #front-card *,
          #back-card * {
            visibility: visible !important;
          }
          #front-card,
          #back-card {
            position: absolute;
            left: 0;
            width: 85mm !important;
            height: 54mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          #front-card {
            top: 0;
          }
          #back-card {
            top: 54mm;
          }
        `}</style>
      </Head>

      <header className="bg-blue-900 text-white shadow-lg print:hidden">
        <div className="container mx-auto px-4 py-4 relative">
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
          <div className="flex items-center justify-center">
            <Image src="/img/logossg_white.png" alt="Logo" width={40} height={40} className="mr-3" />
            <span className="text-xl font-bold tracking-tight">SANTRI SIAP GUNA</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 print:p-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 print:hidden text-gray-800">Kartu Peserta Digital</h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 cards-container"
          >
            <div className="flex flex-col md:flex-row gap-8 justify-center print:gap-0 print:justify-center">
              {/* Front Card */}
              <motion.div 
                id="front-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="front-card bg-blue-700 text-white rounded-xl overflow-hidden shadow-xl w-full md:w-[400px] md:h-[250px] aspect-[1.58/1] flex flex-col print:rounded-none print:shadow-none print:w-[85mm] print:h-[54mm] border border-blue-500"
              >
                <div className="flex h-full">
                  <div className="w-2/5 bg-blue-900 flex flex-col justify-center items-center py-3 px-3">
                    <div className="bg-white p-2 rounded-lg mb-2 front-qr shadow-md">
                      {qrcode ? (
                        <QRCode 
                          value={qrcode} 
                          size={120} 
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 animate-pulse rounded"></div>
                      )}
                    </div>
                    <p className="text-center text-xs font-medium text-blue-100">Scan untuk verifikasi</p>
                  </div>
                  <div className="w-3/5 pl-3 flex flex-col py-4 pr-3">
                    <div className="flex items-center">
                      <Image src="/img/logossg_white.png" alt="Logo" width={32} height={32} className="mr-2" />
                      <div>
                        <h3 className="text-lg font-bold leading-none tracking-wide">SANTRI SIAP</h3>
                        <h3 className="text-lg font-bold leading-none tracking-wide">GUNA</h3>
                        <p className="text-xs text-white font-medium">KARTU PESERTA</p>
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col justify-center mt-2">
                      <h2 className="text-xl font-bold mb-2 text-white">{user?.name}</h2>
                      <div className="space-y-2">
                        <div className="bg-blue-800 py-1.5 px-3 rounded-md text-sm font-medium">Peserta Angkatan 2025</div>
                        <div className="bg-blue-800 py-1.5 px-3 rounded-md text-sm font-medium">Pleton: {user?.pleton} / Grup {user?.grup}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Back Card */}
              <motion.div 
                id="back-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="back-card bg-white rounded-xl overflow-hidden shadow-xl w-full md:w-[400px] md:h-[250px] aspect-[1.58/1] flex flex-col print:rounded-none print:shadow-none print:w-[85mm] print:h-[54mm] border border-gray-200"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between px-4 pt-2 pb-1 border-b border-gray-100">
                    <Image src="/img/logo_ssg.png" alt="Logo SSG" width={80} height={22} />
                    <Image src="/img/logo_DT READY.png" alt="Logo DT" width={24} height={24} />
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

          {/* Tombol cetak */}
          <div className="flex justify-center mt-6 print:hidden">
            <button 
              onClick={handlePrint}
              disabled={isPrinting}
              className="bg-blue-800 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm"
            >
              {isPrinting ? "Menyiapkan..." : "Cetak Kartu"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
