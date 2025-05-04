// app/scan-qrcode/page.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CameraOff, LogIn, LogOut, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function QrCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [attendanceType, setAttendanceType] = useState('masuk'); // Default to 'masuk'
  const [scannedCode, setScannedCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);
  const scannerDivRef = useRef(null);

  // Initialize QR scanner
  useEffect(() => {
    startScanner();
  }, []);
  
  const onScanSuccess = (decodedText) => {
    setScannedCode(decodedText);
    stopScanner();
    submitAttendance(decodedText);
  };
  
  // Stop scanner
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

  // Start scanner
  const startScanner = () => {
    setScannedCode(null);
    setScanResult(null);
    setScanning(true);
  };

  // Handle attendance type selection
  const handleAttendanceTypeChange = (type) => {
    setAttendanceType(type);
  };

  // Submit attendance data
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
        toast.success(`${data.message} !`);
      } else {
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
  

  // Reset the form
  const resetForm = () => {
    setScannedCode(null);
    setScanResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Toaster position="top-center" />
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Scan QR Code Presensi</h1>
        <p className="text-gray-600">Pindai QR code untuk mencatat kehadiran</p>
      </div>

      {/* Attendance type selector */}
      <div className="mb-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleAttendanceTypeChange('masuk')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              attendanceType === 'masuk'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <LogIn size={20} className="mr-2" />
            Masuk
          </button>
          
          <button
            onClick={() => handleAttendanceTypeChange('keluar')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              attendanceType === 'keluar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <LogOut size={20} className="mr-2" />
            Keluar
          </button>
        </div>
      </div>

      {/* QR Scanner Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        

        {scanning && (
          <div className="p-4">
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
        )}

        {scannedCode && !scanResult && (
          <div className="p-6">
            <div className="text-center mb-6">
              <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
              <h3 className="text-lg font-medium">QR Code Terdeteksi!</h3>
              <p className="text-gray-500 break-all mt-2">{scannedCode}</p>
            </div>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Scan Ulang
              </button>
              
              <button
                onClick={submitAttendance}
                disabled={submitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={20} className="mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    Lakukan Presensi {attendanceType === 'masuk' ? 'Masuk' : 'Keluar'}
                  </>
                )}
              </button>
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