"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../stores/authStore';

export default function SSGDashboardPage() {
  const router = useRouter();
  const { user, userId, logout, checkAuth, verify, role } = useAuthStore();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  // const { verify } = useAuthStore();

  useEffect(() => {
    if (verify === 0) {
      router.replace('/verify-otp');
    }
  }, [verify]);
  
  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // 'success' or 'error'
  
  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
    
    // Debug the current state when component mounts
    console.log("Dashboard page mounted, auth store state:", useAuthStore.getState());
  }, []);
  
  // Check authentication on component mount
  useEffect(() => {
    if (isClient) {
      // Check if authenticated using Zustand store
      const isAuthorized = checkAuth();
      console.log("Dashboard auth check result:", isAuthorized);
      
      if (!isAuthorized) {
        console.log("Not authenticated, redirecting to login from dashboard");
        router.push('/login');
        return;
      }
      
      // If authenticated, fetch user data
      fetchUserData();
    }
  }, [router, checkAuth, isClient]);

  // Effect to hide notification after some time
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Hide after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Fetch user data
  const fetchUserData = () => {
    try {
      // If we already have basic user data in the Zustand store, use it
      const storeUser = useAuthStore.getState().user;
      const userVerify = useAuthStore.getState().verify;
      const userRole = useAuthStore.getState().role;
      console.log("userVerify:", verify);
      console.log("user role:", role);

      
      // Extract name from store data - first try to get nomor_hp for display
      const userPhone = storeUser?.nomor_hp || '08212651023';
      const userName = storeUser?.name || storeUser?.name || "ilham";
      // Mock data - in a real app, this would come from an API call
      // Merge any existing user data from Zustand store with additional dashboard data
      setUserData({
        ...storeUser,
        name: userName, 
        phone: userPhone,
        level: 'Pleton 20',
        taskCompleted: 40,
        taskTotal: 50,
        completionRate: 70,
        notifications: 3,
        quranProgress: {
          juz: 5,
          surah: 'Al-Baqarah',
          page: 21,
          lastRead: '15 Maret 2025',
        }
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading user data:", error);
      setNotificationType('error');
      setNotificationMessage('Gagal memuat data pengguna. Silakan coba lagi.');
      setShowNotification(true);
      
      // Redirect after showing error
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  // Handle logout using Zustand store
  const handleLogout = () => {
    try {
      // Show success notification
      setNotificationType('success');
      setNotificationMessage('Logout berhasil! Mengalihkan ke halaman login...');
      setShowNotification(true);
      
      // Add a slight delay before clearing session and redirecting
      setTimeout(() => {
        // Call logout function from Zustand store
        logout();
        router.push('/login');
      }, 1500);
    } catch (error) {
      console.error("Error during logout process:", error);
      // Show error notification
      setNotificationType('error');
      setNotificationMessage('Gagal logout. Silakan coba lagi.');
      setShowNotification(true);
    }
  };
  
  // Navigation functions
  const navigateToProfile = () => {
    router.push('/dashboard/profile');
  };
  
  const navigateToPresensi = () => {
    router.push('/dashboard/presensi');
  };

  // Navigation function for Al-Quran
  const navigateToAlQuran = () => {
    router.push('/dashboard/Quran');
  };

  // If we're server-side or still loading, show a loading spinner
  if (!isClient || loading) {
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
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {/* Custom notification - Centered at top */}
      {showNotification && (
        <div 
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-lg z-50 flex items-center transition-all duration-300 ${
            notificationType === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'
          }`}
        >
          {notificationType === 'success' ? (
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{notificationMessage}</span>
          <button 
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowNotification(false)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Header with SANTRI SIAP GUNA */}
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
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => console.log('Notifications')}
                className="relative p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {userData.notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {userData.notifications}
                  </span>
                )}
              </button>
              <button 
                onClick={handleLogout}
                className="p-1 text-white hover:text-gray-200 transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Greeting Card - Now below SANTRI SIAP GUNA */}
      <div className="bg-orange-400 text-white p-4">
        <div className="container mx-auto px-4 py-2 flex items-center">
          <div className="flex-shrink-0 mr-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold text-xl">
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'M'}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Assalamu'alaikum, {userData.name}</h2>
            <p className="text-sm">{userData.level}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-4 pb-20">
        {/* Progress MY Card */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <h3 className="text-sm font-medium mb-2">Progres MY</h3>
          <div className="mb-2 flex justify-between text-xs text-gray-600">
            <span>Diselesaikan: {userData.taskCompleted}/{userData.taskTotal}</span>
            <span>{userData.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-orange-400 h-2.5 rounded-full" 
              style={{width: `${userData.completionRate}%`}}
            ></div>
          </div>
        </div>

        {/* Jadwal and Search Row */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* Jadwal Card */}
          <div className="flex rounded-lg overflow-hidden shadow-sm flex-grow">
            <div className="bg-blue-900 text-white p-4 w-48 flex flex-col justify-center">
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

          {/* Search Box */}
          <div className="flex flex-col w-full md:w-80">
            <div className="relative mb-3">
              <input 
                type="text" 
                placeholder="Pencarian..." 
                className="w-full bg-gray-100 rounded-lg px-4 py-2 pl-3 pr-10 focus:outline-none shadow-sm"
              />
              <button className="absolute right-3 top-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Pengumuman Section */}
        <div className="bg-orange-300 rounded-lg shadow-sm mb-4 p-4">
          <h3 className="font-bold text-sm">Pengumuman</h3>
          
          {/* First announcement */}
          <div className="mt-2 p-3 bg-white rounded-lg mb-2">
            <p className="font-medium text-sm">Kerja Bakti Sosial</p>
            <p className="text-xs text-gray-700">Kegiatan Bakti Sosial di Masjid Agung Sumedang</p>
            <p className="text-xs text-gray-500 mt-1">15 Maret 2025</p>
          </div>
          
          {/* Second announcement */}
          <div className="mt-2 p-3 bg-white rounded-lg">
            <p className="font-medium text-sm">Kerja Bakti Sosial</p>
            <p className="text-xs text-gray-700">Kegiatan Bakti Sosial di Masjid Agung Sumedang</p>
            <p className="text-xs text-gray-500 mt-1">15 Maret 2025</p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <h3 className="font-medium text-sm mb-4">Akses Cepat</h3>
          <div className="grid grid-cols-4 gap-4">
            {/* Rundown */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">Rundown</span>
            </div>
            
            {/* Tugas */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">Tugas</span>
            </div>
            
            {/* Al-Quran - Now clickable */}
            <div className="flex flex-col items-center cursor-pointer" onClick={navigateToAlQuran}>
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">Al-Quran</span>
            </div>
            
            {/* BAP/LAJ */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">BAP/LAJ</span>
            </div>
            
            {/* Presensi */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1 cursor-pointer" onClick={navigateToPresensi}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">Presensi</span>
            </div>
            
            {/* Nilai */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">Nilai</span>
            </div>
            
            {/* MY */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">MY</span>
            </div>
            
            {/* E-Card */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-orange-500 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">E-Card</span>
            </div>
          </div>
        </div>

        {/* Progress Al-Quran - Now clickable */}
        <div className="bg-green-50 rounded-lg shadow-sm mb-6 p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-lg font-medium">Progress Al-Quran</h2>
            </div>
            <button 
              className="bg-green-500 text-white px-4 py-1 rounded-lg text-sm font-medium"
              onClick={navigateToAlQuran}
            >
              Lanjutkan Membaca
            </button>
          </div>
          
          <div className="flex mb-2">
            <div className="grid grid-cols-3 gap-4 w-full">
              <div>
                <p className="text-xs text-gray-500">Juz</p>
                <p className="font-medium">{userData.quranProgress.juz}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Surat</p>
                <p className="font-medium">{userData.quranProgress.surah}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Halaman</p>
                <p className="font-medium">{userData.quranProgress.page}</p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            Terakhir Dibaca: {userData.quranProgress.lastRead}
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center px-4 py-2">
        <button className="flex flex-col items-center px-3 py-1 text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Beranda</span>
        </button>
        <button className="flex flex-col items-center px-3 py-1 text-gray-500" onClick={navigateToAlQuran}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs mt-1">Al-Quran</span>
        </button>
        <button className="flex flex-col items-center px-3 py-1 text-gray-500" onClick={navigateToPresensi}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Presensi</span>
        </button>
        <button className="flex flex-col items-center px-3 py-1 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-xs mt-1">Tugas</span>
        </button>
        <button className="flex flex-col items-center px-3 py-1 text-gray-500" onClick={navigateToProfile}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}