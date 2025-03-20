"use client";

import React, { useState } from 'react';

const Presensi = () => {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, date: 'Sabtu, 22 Maret 2025', status: 'Hadir' },
    { id: 2, date: 'Minggu, 23 Maret 2025', status: 'Hadir' },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date && status) {
      const newRecord = {
        id: attendanceRecords.length + 1,
        date: formatDate(date),
        status: status
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
      setDate('');
      setStatus('');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', options);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-center py-6">PRESENSI</h1>
      
      {/* Attendance Summary Card */}
      <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">Kehadiran</h2>
            <p className="font-bold">8 DARI 12 SESI</p>
          </div>
          <div className="flex space-x-8">
            <div className="text-center">
              <p className="font-semibold">Hadir</p>
              <p className="font-bold">6</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Sakit</p>
              <p className="font-bold">1</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Izin</p>
              <p className="font-bold">1</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Alpha</p>
              <p className="font-bold">0</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Buttons */}
      <div className="flex justify-between mb-4">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
          Rencana Kehadiran
        </button>
        <button 
          onClick={() => window.location.href = '/dashboard/presensi/detail'}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Lihat Detail Presensi
        </button>
      </div>
      
      {/* Attendance Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-yellow-500 text-black">
              <th className="py-3 px-4 border-b text-left w-16">No</th>
              <th className="py-3 px-4 border-b text-left">Hari dan Tanggal</th>
              <th className="py-3 px-4 border-b text-left">Keterangan</th>
              <th className="py-3 px-4 border-b text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{record.id}</td>
                <td className="py-3 px-4">{record.date}</td>
                <td className="py-3 px-4">{record.status}</td>
                <td className="py-3 px-4 text-center">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Attendance Form */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Pilih Tanggal, Hari dan Keterangan</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            {/* Date picker */}
            <div className="relative">
              <div 
                className="flex items-center bg-purple-50 p-2 rounded mb-2"
                onClick={toggleDatePicker}
              >
                <p className="text-lg font-medium mr-2">Pilih Tanggal</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              {showDatePicker && (
                <div className="bg-purple-50 p-4 rounded absolute top-12 left-0 z-10 w-64 shadow-lg">
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="mm/dd/yyyy"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={toggleDatePicker}
                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={toggleDatePicker}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Status buttons */}
            <div className="flex space-x-4 mt-4 justify-center">
              <button
                type="button"
                onClick={() => setStatus('Hadir')}
                className={`py-2 px-6 rounded ${status === 'Hadir' ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}
              >
                Hadir
              </button>
              <button
                type="button"
                onClick={() => setStatus('Sakit')}
                className={`py-2 px-6 rounded ${status === 'Sakit' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}
              >
                Sakit
              </button>
              <button
                type="button"
                onClick={() => setStatus('Izin')}
                className={`py-2 px-6 rounded ${status === 'Izin' ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white'}`}
              >
                Izin
              </button>
              <button
                type="button"
                onClick={() => setStatus('Telat')}
                className={`py-2 px-6 rounded ${status === 'Telat' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
              >
                Telat
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-8 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Presensi;