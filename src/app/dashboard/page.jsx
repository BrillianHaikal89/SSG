"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SSGDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('beranda');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch user data from localStorage on component mount
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.push('/login');
      return;
    }
    
    try {
      // Get user data from localStorage or sessionStorage
      const storedUserData = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
      
      console.log("Retrieved user data:", storedUserData); // Debug log
      
      // Set user data with proper name handling
      setUserData({
        name: storedUserData.name || 'Muhammad Brilian Haikal', // Fallback if name is missing
        level: storedUserData.level || 'Pleton 20',
        taskCompleted: 40,
        taskTotal: 50,
        completionRate: 70, // percentage
        notifications: 3,
        quranProgress: {
          juz: 5,
          surah: 'Al-Baqarah',
          page: 21,
          lastRead: '15 Maret 2025',
        },
        assignments: [
          { id: 1, title: 'Agama', subtitle: 'Sholat Lima Waktu', deadline: '20 Mar 2025', status: 'pending', type: 'hafalan' },
          { id: 2, title: 'BTQ', subtitle: 'Baca Surat An-naba', deadline: '18 Mar 2025', status: 'pending', type: 'tugas' },
          { id: 3, title: 'Tataboga', subtitle: 'Masak Telur', deadline: '17 Mar 2025', status: 'completed', type: 'praktikum' },
        ],
        schedules: [
          { id: 1, title: 'Tahsin Al-Quran', day: 'Selasa', time: '08:00 - 09:30', location: 'Ruang Tahfidz 2' },
          { id: 2, title: 'Fiqih Muamalah', day: 'Selasa', time: '10:00 - 11:30', location: 'Ruang Belajar A3' },
          { id: 3, title: 'Bahasa Arab', day: 'Rabu', time: '13:00 - 14:30', location: 'Lab Bahasa' },
          { id: 4, title: 'Tafsir Al-Quran', day: 'Kamis', time: '08:00 - 09:30', location: 'Aula Utama' },
        ],
        activities: [
          { id: 1, type: 'achievement', title: 'Menyelesaikan Hafalan Juz 5', date: '14 Mar 2025', points: 100 },
          { id: 2, type: 'task', title: 'Mengumpulkan Tugas Fiqih', date: '10 Mar 2025', points: 25 },
          { id: 3, type: 'attendance', title: 'Hadir Kelas Tahsin', date: '08 Mar 2025', points: 10 },
        ],
        announcements: [
          { 
            id: 1, 
            title: 'Kerja Bakti Sosial', 
            content: 'Kegiatan Bakti Sosial di Masjid Agung Sumedang', 
            date: '15 Mar 2025',
            priority: 'high'
          }
        ],
        quickLinks: [
          { id: 1, title: 'Rundown', icon: 'calendar' },
          { id: 2, title: 'Tugas', icon: 'task' },
          { id: 3, title: 'Al-Quran', icon: 'quran' },
          { id: 4, title: 'BAP/LAJ', icon: 'star' },
          { id: 5, title: 'Absensi', icon: 'check' },
          { id: 6, title: 'Nilai', icon: 'star' },
          { id: 7, title: 'MY', icon: 'library' },
          { id: 8, title: 'E-Card', icon: 'chat' },
        ]
      });
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Set default data if there's an error
      setUserData({
        name: 'Pengguna',
        level: 'Pleton 20',
        // ... other default data
      });
    }
    
    setLoading(false);
  }, [router]);

  // Handle logout
  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    
    // Redirect to login page
    router.push('/login');
  };
  
  // Handle navigation to profile
  const navigateToProfile = () => {
    router.push('/dashboard/profile');
  };

  // Render the appropriate icon for quick links
  function renderIcon(iconName) {
    switch(iconName) {
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'book':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'quran':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'task':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'check':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'star':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'library':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        );
      case 'chat':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/img/logossg_white.png" 
                alt="Logo Santri Siap Guna" 
                width={36} 
                height={36} 
                className="mr-2"
              />
              <h1 className="text-xl font-bold">SANTRI SIAP GUNA</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => console.log('Notifications')}
                className="relative p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {userData.notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {userData.notifications}
                  </span>
                )}
              </button>
              <button 
                onClick={navigateToProfile}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold cursor-pointer transition-transform hover:scale-105"
              >
                {userData.name.charAt(0)}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-grow container mx-auto px-4 py-4 pb-20"
      >
        {/* Welcome and Progress Card */}
        <div className="bg-yellow-400 rounded-lg shadow-md mb-4">
          <div className="p-4 rounded-t-lg">
            <div className="flex items-center">
              <button 
                onClick={navigateToProfile} 
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-yellow-500 font-bold text-xl mr-4 cursor-pointer transition-transform hover:scale-105"
              >
                {userData.name.charAt(0)}
              </button>
              <div>
                <h2 className="text-lg font-medium">Assalamu'alaikum, {userData.name}</h2>
                <p className="text-sm">{userData.level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress MY */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4">
          <h3 className="text-sm font-medium mb-2">Progress MY</h3>
          <div className="mb-2 flex justify-between text-xs text-gray-600">
            <span>Diselesaikan: {userData.taskCompleted}/{userData.taskTotal}</span>
            <span>{userData.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-yellow-400 h-2.5 rounded-full" 
              style={{width: `${userData.completionRate}%`}}
            ></div>
          </div>
        </div>

        {/* Jadwal, search and pengumuman section - unified as in the image */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* Left section - Jadwal */}
          <div className="flex rounded-lg overflow-hidden shadow-md flex-grow">
            <div className="bg-blue-900 text-white p-4 w-40">
              <h3 className="text-sm font-semibold">Jadwal Hari ini</h3>
              <p className="text-xs mt-1">Selasa, 18 Maret</p>
            </div>
            <div className="bg-blue-100 p-4 flex-grow">
              <h3 className="text-blue-900 font-medium text-sm">TUGAS</h3>
              <ol className="text-xs space-y-1 mt-2">
                <li>
                  <span className="font-medium">1. Agama</span><br/>
                  <span className="text-gray-700">Sholat Lima Waktu</span>
                </li>
                <li>
                  <span className="font-medium">2. BTQ</span><br/>
                  <span className="text-gray-700">Baca Surat An-naba</span>
                </li>
                <li>
                  <span className="font-medium">3. Tataboga</span><br/>
                  <span className="text-gray-700">Masak Telur</span>
                </li>
              </ol>
              <div className="mt-2 flex justify-end">
                <button className="bg-blue-900 text-white text-xs px-3 py-1 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Lihat Jadwal
                </button>
              </div>
            </div>
          </div>

          {/* Right section - Search and Pengumuman */}
          <div className="flex flex-col w-full md:w-80">
            {/* Search bar */}
            <div className="relative mb-3">
              <input 
                type="text" 
                placeholder="Cari apa kita lek" 
                className="w-full bg-white rounded-lg px-4 py-2 pl-3 pr-10 focus:outline-none shadow-md"
              />
              <button className="absolute right-3 top-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Pengumuman */}
            <div className="bg-yellow-100 rounded-lg shadow-md p-3">
              <h3 className="font-bold text-sm">Pengumuman</h3>
              <div className="mt-1 p-3 bg-white rounded-lg">
                <p className="font-medium text-sm">Kerja Bakti Sosial</p>
                <p className="text-xs text-gray-700">Kegiatan Bakti Sosial di Masjid Agung Sumedang</p>
                <p className="text-xs text-gray-500 mt-1">15 Maret 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <h2 className="text-lg font-medium mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-4 gap-4">
            {userData.quickLinks.map((link) => (
              <div key={link.id} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-1">
                  {renderIcon(link.icon)}
                </div>
                <span className="text-xs text-gray-600">{link.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quran Progress */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-medium">Progress Al-Quran</h2>
          </div>
          <div className="flex">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Juz</p>
                <p className="font-medium">5</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Surat</p>
                <p className="font-medium">Al-Baqarah</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Halaman</p>
                <p className="font-medium">21</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Terakhir Dibaca: 15 Maret 2025
          </p>
          <div className="mt-4 flex justify-center">
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-medium">
              Lanjutkan Membaca
            </button>
          </div>
        </div>
      </motion.main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center px-4 py-2">
        <button 
          onClick={() => setActiveTab('beranda')}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'beranda' ? 'text-blue-700' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Beranda</span>
        </button>
        <button 
          onClick={() => setActiveTab('quran')}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'quran' ? 'text-blue-700' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs mt-1">Al-Quran</span>
        </button>
        <button 
          onClick={() => setActiveTab('jadwal')}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'jadwal' ? 'text-blue-700' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Jadwal</span>
        </button>
        <button 
          onClick={() => setActiveTab('tugas')}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'tugas' ? 'text-blue-700' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-xs mt-1">Tugas</span>
        </button>
        <button 
          onClick={() => navigateToProfile()}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'profile' ? 'text-blue-700' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}