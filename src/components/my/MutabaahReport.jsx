"use client";

import React from 'react';
import { formatGregorianDate } from './HijriDateConverter';

const MutabaahReport = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Laporan Mutaba'ah Yaumiyah</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="font-medium">Nama: {user?.name || 'Pengguna'}</p>
          <p className="text-sm text-gray-600">Tanggal: {formatGregorianDate(new Date())}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-center text-gray-700">
            Fitur laporan sedang dalam pengembangan. Akan segera hadir dalam versi berikutnya.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default MutabaahReport;