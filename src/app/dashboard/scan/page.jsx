// app/scan-qrcode/page.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CheckCircle, XCircle, RefreshCw, Clock, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define Hijri month names
const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulka'dah", "Dzulhijjah"
];

export default function QrCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState({
    gregorian: '',
    hijri: '',
    hijriDay: 0,
    hijriMonth: 0,
    hijriYear: 0
  });
  const scannerRef = useRef(null);

  // Calculate Hijri date from Gregorian date
  const calculateHijriDate = (gregorianDate) => {
    try {
      const date = new Date(gregorianDate);
      
      const day = date.getDate();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const year = date.getFullYear();
      
      let hDay = 1;
      let hMonthIndex = 10; // Default to Dzulka'dah
      const hYear = 1446; // Default to 1446 for 2025
      
      // Handle specific mappings for May 2025
      if (year === 2025 && month === 5) {
        const mayMapping = {
          1: 3, 2: 4, 3: 5, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10,
          9: 11, 10: 12, 11: 13, 12: 14, 13: 15, 14: 16,
          15: 17, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
          21: 23, 22: 24, 23: 25, 24: 26, 25: 27, 26: 28,
          27: 29, 28: 30, 29: 1, 30: 2, 31: 3
        };
        
        hDay = mayMapping[day] || day;
        
        // Transition to Dzulhijjah at the end of May
        if (day >= 29) {
          hMonthIndex = 11; // Dzulhijjah
        }
      }
      // Handle specific mappings for April 2025
      else if (year === 2025 && month === 4) {
        const aprilMapping = {
          1: 3, 2: 4, 3: 5, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10,
          9: 11, 10: 12, 11: 13, 12: 14, 13: 15, 14: 16,
          15: 17, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
          21: 23, 22: 24, 23: 25, 24: 26, 25: 27, 26: 28,
          27: 29, 28: 30, 29: 1, 30: 2
        };
        
        hDay = aprilMapping[day] || day;
        
        if (day >= 29) {
          hMonthIndex = 10; // Dzulka'dah
        } else {
          hMonthIndex = 9; // Syawal
        }
      }
      // Handle June 2025
      else if (year === 2025 && month === 6) {
        const juneMapping = {
          1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10,
          8: 11, 9: 12, 10: 13, 11: 14, 12: 15, 13: 16,
          14: 17, 15: 18, 16: 19, 17: 20, 18: 21, 19: 22,
          20: 23, 21: 24, 22: 25, 23: 26, 24: 27, 25: 28,
          26: 29, 27: 30, 28: 1, 29: 2, 30: 3
        };
        
        hDay = juneMapping[day] || day;
        
        if (day >= 28) {
          hMonthIndex = 0; // Muharram
          hYear = 1447; // New Hijri year starts
        } else {
          hMonthIndex = 11; // Dzulhijjah
        }
      }
      // For other months, use a simple approximation
      else {
        // Simple fallback - not as accurate but provides a reasonable estimate
        const offset = day % 30;
        hDay = offset + 1;
      }
      
      return {
        day: hDay,
        month: hMonthIndex,
        year: hYear,
        formatted: `${hDay} ${HIJRI_MONTHS[hMonthIndex]} ${hYear} H`
      };
    } catch (error) {
      console.error('Error calculating Hijri date:', error);
      return { 
        day: 7, 
        month: 10, 
        year: 1446, 
        formatted: "7 Dzulka'dah 1446 H" 
      };
    }
  };

  // Format day name in Indonesian
  const formatDayName = (date) => {
    const dayNames = {
      0: 'Ahad',
      1: 'Senin', 
      2: 'Selasa', 
      3: 'Rabu', 
      4: 'Kamis', 
      5: 'Jumat', 
      6: 'Sabtu'
    };
    
    return dayNames[date.getDay()];
  };

  // Format date in Indonesian
  const formatDate = (date) => {
    if (!date) return '';
    try {
      const dayName = formatDayName(date);
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleDateString('id-ID', { month: 'long' });
      const year = date.getFullYear();
      
      return `${dayName}, ${day} ${month} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  useEffect(() => {
    // Initialize and update the clock and date
    const updateDateTime = () => {
      const now = new Date();
      
      // Update time
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      
      // Update Gregorian date
      const gregorianDate = formatDate(now);
      
      // Update Hijri date
      const hijriDate = calculateHijriDate(now);
      
      setCurrentDate({
        gregorian: gregorianDate,
        hijri: hijriDate.formatted,
        hijriDay: hijriDate.day,
        hijriMonth: hijriDate.month,
        hijriYear: hijriDate.year
      });
    };

    // Update immediately and then every second
    updateDateTime();
    const clockInterval = setInterval(updateDateTime, 1000);

    // Clean up scanner and clock interval on component unmount
    return () => {
      clearInterval(clockInterval);
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
          scannerRef.current = null;
        } catch (error) {
          console.error("Error cleaning up scanner:", error);
        }
      }
    };
  }, []);

  const onScanSuccess = (decodedText) => {
    setScannedCode(decodedText);
    stopScanner();
    submitAttendance(decodedText);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
      scannerRef.current = null;
      setScanning(false);
    }
  };

  const startScanner = () => {
    setScannedCode(null);
    setScanResult(null);
    setScanning(true);

    // Short delay to ensure DOM is fully ready
    setTimeout(() => {
      const qrReaderElement = document.getElementById("qr-reader");
      
      if (!qrReaderElement) {
        console.error("QR reader element not found");
        setScanning(false);
        toast.error("Gagal memulai scanner. Silakan coba lagi.");
        return;
      }

      const config = {
        fps: 10,
        qrbox: 250,
      };

      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error("Error clearing existing scanner:", error);
        }
      }

      try {
        scannerRef.current = new Html5QrcodeScanner("qr-reader", config, false);
        scannerRef.current.render(onScanSuccess, (err) => {
          console.warn("QR scan error:", err);
        });
      } catch (error) {
        console.error("Error initializing QR scanner:", error);
        setScanning(false);
        toast.error("Gagal memulai scanner. Silakan coba lagi.");
      }
    }, 300);
  };

  const submitAttendance = async (qrcodeText) => {
    if (!qrcodeText) return;

    setSubmitting(true);
    setScanResult(null);

    try {
      const response = await fetch(`${API_URL}/users/presensi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrcode_text: qrcodeText }),
      });

      const data = await response.json();

      if (response.ok) {
        setScanResult({
          success: true,
          message: data.message,
        });
        toast.success(`${data.message}`);
      } else {
        setScanResult({
          success: false,
          message: data.message || 'Gagal mencatat presensi',
        });
        toast.error(data.message || `Gagal mencatat presensi`);
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setScanResult({
        success: false,
        message: `Error: ${error.message}`,
      });
      toast.error(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setScannedCode(null);
    setScanResult(null);
    startScanner();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Toaster position="top-center" />
      
      {/* Date and Time Display */}
      <div className="mb-4 text-center bg-blue-600 text-white py-4 rounded-lg shadow-lg">
        {/* Hijri Date */}
        <div className="mb-1">
          <div className="text-xl font-bold">{currentDate.hijriDay} {HIJRI_MONTHS[currentDate.hijriMonth]} {currentDate.hijriYear} H</div>
        </div>
        
        {/* Gregorian Date */}
        <div className="mb-2">
          <div className="text-lg">{currentDate.gregorian}</div>
        </div>
        
        {/* Real-time Clock */}
        <div className="flex items-center justify-center">
          <Clock className="mr-2" size={20} />
          <span className="text-2xl font-mono font-bold">{currentTime}</span>
        </div>
      </div>
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Scan QR Code</h1>
        <p className="text-gray-600">Pindai QR code untuk mencatat kehadiran</p>
      </div>

      {/* QR Scanner Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {!scanning && !scannedCode && !scanResult && (
          <div className="p-6 text-center">
            <button
              onClick={startScanner}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
            >
              <Camera size={20} className="mr-2" />
              Bismillah Scan QR Code
            </button>
          </div>
        )}

        {/* Always include the QR reader div in the DOM */}
        <div id="qr-reader-container" className={scanning ? "block p-4" : "hidden"}>
          <div className="mb-4 text-center text-sm text-gray-500">
            Posisikan QR code di dalam kotak
          </div>
          <div id="qr-reader" className="w-full"></div>
          <div className="text-center mt-4">
            <button
              onClick={stopScanner}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Batalkan
            </button>
          </div>
        </div>

        {scannedCode && !scanResult && (
          <div className="p-6">
            <div className="text-center mb-6">
              {submitting ? (
                <div className="flex items-center justify-center">
                  <RefreshCw size={48} className="animate-spin text-blue-500" />
                  <span className="ml-2 text-lg">Memproses...</span>
                </div>
              ) : (
                <>
                  <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
                  <h3 className="text-lg font-medium">QR Code Terdeteksi!</h3>
                  <p className="text-gray-500 break-all mt-2">{scannedCode}</p>
                </>
              )}
            </div>
          </div>
        )}

        {scanResult && (
          <div className="p-6">
            <div className="text-center mb-6">
              {scanResult.success ? (
                <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
              ) : (
                <XCircle size={48} className="mx-auto mb-2 text-red-500" />
              )}
              <h3 className={`text-lg font-medium ${scanResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {scanResult.success ? 'Berhasil!' : 'Gagal!'}
              </h3>
              <p className="text-gray-600 mt-2">{scanResult.message}</p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Scan QR Code Lain
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Petunjuk:</h3>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
          <li>Arahkan kamera ke QR code</li>
          <li>Tunggu hingga QR code terdeteksi</li>
          <li>Presensi akan dicatat secara otomatis</li>
        </ol>
      </div>
    </div>
  );
}