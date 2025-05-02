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
    
    // Fungsi untuk mengkonversi gambar ke base64
    const convertImageToBase64 = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.src = url;
      });
    };

    // Konversi semua gambar yang diperlukan
    Promise.all([
      convertImageToBase64('/img/logossg_white.png'),
      convertImageToBase64('/img/logo_santri_siap_guna_full.png'),
      convertImageToBase64('/img/logo_DT_READY.png')
    ]).then(([logoWhite, logoFull, logoDT]) => {
      const printWindow = window.open('', '_blank');
      
      // HTML untuk halaman cetak
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Kartu Peserta SSG</title>
            <style>
              @page {
                size: 85mm 54mm;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .print-container {
                width: 170mm;
                display: flex;
              }
              .card {
                width: 85mm;
                height: 54mm;
                position: relative;
                box-sizing: border-box;
                page-break-after: always;
              }
              .front {
                background: linear-gradient(to bottom right, #1e3a8a, #1e40af);
                color: white;
                display: flex;
              }
              .qr-section {
                width: 40%;
                background: #172554;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 5mm;
              }
              .qr-container {
                background: white;
                padding: 2mm;
                border-radius: 2mm;
                width: 30mm;
                height: 30mm;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .info-section {
                width: 60%;
                padding: 5mm;
                display: flex;
                flex-direction: column;
              }
              .back {
                background: white;
                padding: 5mm;
              }
              .rules-list {
                font-size: 9pt;
                padding-left: 15px;
              }
              .rules-list li {
                margin-bottom: 3mm;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <!-- Kartu Depan -->
              <div class="card front">
                <div class="qr-section">
                  <div class="qr-container">
                    ${qrcode ? `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 256 256">${new QRCode({value: qrcode}).svg()}</svg>` : ''}
                  </div>
                  <p style="font-size: 8pt; margin-top: 2mm; color: #bfdbfe;">Scan untuk verifikasi</p>
                </div>
                <div class="info-section">
                  <div style="display: flex; align-items: center; margin-bottom: 3mm;">
                    <img src="${logoWhite}" alt="Logo" style="width: 8mm; height: 8mm; margin-right: 2mm;"/>
                    <div>
                      <h1 style="font-size: 12pt; font-weight: bold; margin: 0; line-height: 1.1;">SANTRI SIAP</h1>
                      <h1 style="font-size: 12pt; font-weight: bold; margin: 0; line-height: 1.1;">GUNA</h1>
                      <p style="font-size: 8pt; margin-top: 1mm; color: #bfdbfe;">KARTU PESERTA</p>
                    </div>
                  </div>
                  <h2 style="font-size: 14pt; font-weight: bold; margin: 3mm 0;">${user?.name || "MUHAMAD BRILLIAN HAIKAL"}</h2>
                  <div style="margin-top: auto;">
                    <div style="background: rgba(255,255,255,0.1); padding: 2mm; border-radius: 2mm; margin-bottom: 2mm; font-size: 9pt;">
                      Peserta Angkatan 2025
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 2mm; border-radius: 2mm; font-size: 9pt;">
                      Pleton: 20 / Grup B
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Kartu Belakang -->
              <div class="card back">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3mm;">
                  <img src="${logoFull}" alt="Logo" style="height: 10mm;"/>
                  <img src="${logoDT}" alt="DT Logo" style="height: 8mm;"/>
                </div>
                <h3 style="text-align: center; font-size: 12pt; font-weight: bold; color: #1e3a8a; border-bottom: 1px solid #1e3a8a; padding-bottom: 1mm; margin-bottom: 3mm;">
                  ATURAN PENGGUNAAN KARTU
                </h3>
                <ol class="rules-list">
                  <li>Kartu ini adalah identitas resmi peserta SSG</li>
                  <li>Wajib dibawa saat kegiatan SSG berlangsung</li>
                  <li>Jaga kerahasiaan QR Code pada kartu</li>
                  <li>Laporkan segera jika kartu hilang</li>
                  <li>Kartu tidak boleh dipindahtangankan</li>
                </ol>
                <p style="text-align: center; font-size: 7pt; color: #6b7280; margin-top: 2mm;">
                  © 2025 Santri Siap Guna - All Rights Reserved
                </p>
              </div>
            </div>
            <script>
              setTimeout(() => {
                window.print();
                window.onafterprint = () => window.close();
              }, 300);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      setIsPrinting(false);
    }).catch((error) => {
      console.error('Error preparing print:', error);
      setIsPrinting(false);
      alert('Gagal memuat gambar untuk dicetak. Silakan coba lagi.');
    });
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
      <Head>
        <title>Kartu Peserta Santri Siap Guna</title>
        <meta name="description" content="Kartu identitas peserta Santri Siap Guna" />
      </Head>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg print:hidden">
        <div className="container mx-auto flex justify-between items-center px-4 py-4">
          <div className="flex items-center">
            <Image 
              src="/img/logossg_white.png" 
              alt="Santri Siap Guna Logo" 
              width={40} 
              height={40} 
              className="mr-3"
              priority
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
          <h1 className="text-3xl font-bold text-center mb-12 print:hidden text-gray-800">Kartu Peserta</h1>
          
          {/* Card Preview */}
          <div className="flex flex-col md:flex-row gap-8 justify-center mb-12 print:hidden">
            {/* Front Card Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl overflow-hidden shadow-xl w-full md:w-[340px] h-[216px] flex border-2 border-blue-700"
            >
              <div className="w-[40%] bg-blue-950 flex flex-col justify-center items-center py-4 px-3">
                <div className="bg-white p-2 rounded-lg shadow-md w-[120px] h-[120px] flex items-center justify-center">
                  {qrcode ? (
                    <QRCode 
                      value={qrcode} 
                      size={110} 
                      className="w-full h-auto"
                      bgColor="#ffffff"
                      fgColor="#1e3a8a"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-200 animate-pulse rounded"></div>
                  )}
                </div>
                <p className="text-xs text-blue-200 mt-2 text-center">Scan untuk verifikasi</p>
              </div>
              
              <div className="w-[60%] flex flex-col py-5 px-4">
                <div className="flex items-start mb-2">
                  <Image 
                    src="/img/logossg_white.png" 
                    alt="Logo" 
                    width={28} 
                    height={28} 
                    className="mr-2 mt-1"
                  />
                  <div>
                    <h3 className="text-lg font-bold leading-tight tracking-wide">SANTRI SIAP</h3>
                    <h3 className="text-lg font-bold leading-tight tracking-wide">GUNA</h3>
                    <p className="text-xs text-blue-100 font-medium mt-1">KARTU PESERTA</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {user?.name || "MUHAMAD BRILLIAN HAIKAL"}
                  </h2>
                  
                  <div className="mt-5 space-y-2">
                    <div className="bg-blue-600/80 py-1 px-3 rounded-md text-sm font-medium">
                      Peserta Angkatan 2025
                    </div>
                    <div className="bg-blue-600/80 py-1 px-3 rounded-md text-sm font-medium">
                      Pleton: 20 / Grup B
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Back Card Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-xl w-full md:w-[340px] h-[216px] flex flex-col border-2 border-gray-300"
            >
              <div className="flex h-full flex-col p-5 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <Image 
                    src="/img/logo_santri_siap_guna_full.png" 
                    alt="Santri Siap Guna Logo" 
                    width={120} 
                    height={50} 
                    className="h-auto"
                  />
                  <Image 
                    src="/img/logo_DT_READY.png" 
                    alt="DT Logo" 
                    width={30} 
                    height={30} 
                  />
                </div>
                
                <div className="text-center mt-4 mb-3">
                  <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-900 pb-1 inline-block">
                    ATURAN PENGGUNAAN KARTU
                  </h3>
                </div>

                <div className="flex-grow flex items-center">
                  <ol className="text-sm text-gray-800 pl-5 list-decimal space-y-2 font-medium leading-relaxed">
                    <li className="mb-2">Kartu ini adalah identitas resmi peserta SSG</li>
                    <li className="mb-2">Wajib dibawa saat kegiatan SSG berlangsung</li>
                    <li className="mb-2">Jaga kerahasiaan QR Code pada kartu</li>
                    <li className="mb-2">Laporkan segera jika kartu hilang</li>
                    <li>Kartu tidak boleh dipindahtangankan</li>
                  </ol>
                </div>
                
                <div className="text-center mt-2">
                  <p className="text-xs text-gray-500 font-medium">
                    © 2025 Santri Siap Guna - All Rights Reserved
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Print Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-5 rounded-lg mb-10 print:hidden shadow-sm max-w-2xl mx-auto">
            <h3 className="font-bold text-blue-800 flex items-center text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Petunjuk Cetak:
            </h3>
            <ul className="text-sm mt-2 pl-7 space-y-2 list-disc">
              <li>Klik tombol "Cetak Kartu" di bawah</li>
              <li>Pastikan ukuran kertas yang digunakan adalah 85mm x 54mm (ID Card size)</li>
              <li>Untuk hasil terbaik, gunakan kertas tebal (260-300gsm)</li>
              <li>Pastikan kedua sisi kartu terlihat di preview sebelum mencetak</li>
              <li>Jika ingin mencetak bolak-balik, atur printer ke mode duplex printing</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden max-w-md mx-auto">
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
              className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-3 px-8 rounded-lg font-medium hover:from-blue-900 hover:to-blue-800 transition-all flex items-center justify-center shadow-md"
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
    </div>
  );
}