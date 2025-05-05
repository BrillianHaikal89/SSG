// app/scan-qrcode/page.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function QrCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize and update the clock
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    // Update immediately and then every second
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

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
      
      {/* Real-time Clock Display */}
      <div className="mb-4 text-center bg-blue-600 text-white py-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-center">
          <Clock className="mr-2" size={20} />
          <span className="text-2xl font-mono font-bold">{currentTime}</span>
        </div>
      </div>
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Scan QR Code Presensi</h1>
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
              Mulai Scan QR Code
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