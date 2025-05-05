// app/scan-qrcode/page.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CheckCircle, XCircle, RefreshCw, Clock, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function QrCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState({
    gregorian: '',
    hijri: '',
    hijriDay: '',
    hijriMonth: '',
    hijriYear: ''
  });
  const scannerRef = useRef(null);

  // Convert to Hijri date
  const gregorianToHijri = (date) => {
    // Get Gregorian date components
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Formula to estimate Hijri date (approximate calculation)
    // This is a simplified conversion - for precise conversion a full library would be better
    const hijriYear = Math.floor((year - 622) * (33/32));
    
    // Define Hijri month names in Arabic
    const hijriMonths = [
      "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", 
      "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", 
      "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];
    
    // Adjust this calculation for a more accurate estimate
    // This is a very rough approximation
    const dayOfYear = Math.floor((month * 30.5) + day);
    const hijriDayOfYear = (dayOfYear + 10) % 354; // Approximate offset
    const hijriMonth = Math.floor(hijriDayOfYear / 29.5);
    const hijriDay = Math.floor(hijriDayOfYear % 29.5) + 1;
    
    // Return the estimated Hijri date components
    return {
      day: hijriDay,
      month: hijriMonths[hijriMonth % 12],
      year: hijriYear,
      fullDate: `${hijriDay} ${hijriMonths[hijriMonth % 12]} ${hijriYear} H`
    };
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
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const gregorianDate = now.toLocaleDateString('id-ID', options);
      
      // Update Hijri date
      const hijriDate = gregorianToHijri(now);
      
      setCurrentDate({
        gregorian: gregorianDate,
        hijri: hijriDate.fullDate,
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
        // Set to immediately open camera
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
        // Start with camera on
        startScanningAutomatically: true
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
      <div className="mb-4 text-center bg-green-600 text-white py-4 rounded-lg shadow-lg">
        {/* Hijri Date */}
        <div className="mb-1">
          <div className="text-xl font-bold">{currentDate.hijriDay} {currentDate.hijriMonth} {currentDate.hijriYear} H</div>
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