"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

function SSGDashboardPage() {
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
    
    // Get user data from localStorage or sessionStorage
    const storedUserData = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
    
    // Set sample data for demonstration
    setUserData({
      ...storedUserData,
      name: storedUserData.name || 'Santri User',
      profileImage: null, // Will display initial if null
      level: 'Tahfidz Level 2',
      points: 750,
      taskCompleted: 34,
      taskTotal: 50,
      completionRate: 68, // percentage
      nextClass: 'Tafsir Al-Quran',
      nextClassTime: 'Senin, 18 Mar 2025 - 08:00 WIB',
      notifications: 3,
      quranProgress: {
        juz: 5,
        surah: 'Al-Maidah',
        page: 106,
        lastRead: '15 Mar 2025',
      },
      assignments: [
        { id: 1, title: 'Hafalan Surat Al-Mulk', deadline: '20 Mar 2025', status: 'pending', type: 'hafalan' },
        { id: 2, title: 'Tugas Fiqih Muamalah', deadline: '18 Mar 2025', status: 'pending', type: 'tugas' },
        { id: 3, title: 'Praktikum Bahasa Arab', deadline: '17 Mar 2025', status: 'completed', type: 'praktikum' },
      ],
      schedules: [
        { id: 1, title: 'Tahsin Al-Quran', day: 'Senin', time: '08:00 - 09:30', location: 'Ruang Tahfidz 2' },
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
          title: 'Jadwal Ujian Akhir Semester', 
          content: 'Ujian Akhir Semester akan dilaksanakan pada tanggal 25-30 April 2025.', 
          date: '15 Mar 2025',
          priority: 'high'
        },
        { 
          id: 2, 
          title: 'Kegiatan Bakti Sosial', 
          content: 'Kegiatan bakti sosial akan diadakan pada hari Sabtu, 23 Maret 2025 di Desa Sukamaju.', 
          date: '12 Mar 2025',
          priority: 'medium' 
        },
      ],
      quickLinks: [
        { id: 1, title: 'Jadwal', icon: 'calendar' },
        { id: 2, title: 'Materi', icon: 'book' },
        { id: 3, title: 'Hafalan', icon: 'quran' },
        { id: 4, title: 'Tugas', icon: 'task' },
        { id: 5, title: 'Absensi', icon: 'check' },
        { id: 6, title: 'Nilai', icon: 'star' },
        { id: 7, title: 'Perpustakaan', icon: 'library' },
        { id: 8, title: 'Konsultasi', icon: 'chat' },
      ]
    });
    
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

  // Navigation handler for profile
  function navigateToProfile() {
    console.log('Navigate to profile');
    // Implement profile navigation
    // router.push('/profile');
  }

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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

  // Format date as Indonesian format
  function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      <header className="bg-green-700 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Santri Siap Guna</h1>
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
                className="flex items-center"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-700 font-bold">
                  {userData.name.charAt(0)}
                </div>
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
        className="flex-grow container mx-auto px-4 py-6 pb-20"
      >
        {/* Welcome and Progress Card */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="bg-green-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-700 font-bold text-xl mr-4">
                {userData.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-medium">Assalamu'alaikum, {userData.name}</h2>
                <p className="text-sm text-green-100">{userData.level}</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Progress Tugas</h3>
            <div className="mb-2 flex justify-between text-xs text-gray-600">
              <span>Diselesaikan: {userData.taskCompleted}/{userData.taskTotal}</span>
              <span>{userData.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{width: `${userData.completionRate}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Class Alert */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Kelas berikutnya: <span className="font-medium">{userData.nextClass}</span>
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                {userData.nextClassTime}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <h2 className="text-lg font-medium mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-4 gap-4">
            {userData.quickLinks.map((link) => (
              <button key={link.id} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-2">
                  {renderIcon(link.icon)}
                </div>
                <span className="text-xs text-gray-600">{link.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quran Progress */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <h2 className="text-lg font-medium mb-4">Progres Al-Quran</h2>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-4">
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
              <p className="text-xs text-gray-500 mt-2">
                Terakhir dibaca: {userData.quranProgress.lastRead}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
              Lanjutkan Membaca
            </button>
          </div>
        </div>

        {/* Assignments Section */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Tugas & Hafalan</h2>
            <button className="text-green-700 text-sm">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {userData.assignments.map((assignment) => (
              <div key={assignment.id} className={`border-l-4 ${
                assignment.status === 'completed' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-yellow-500 bg-white'
              } p-3 rounded shadow-sm`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{assignment.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Deadline: {assignment.deadline}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    assignment.status === 'completed' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {assignment.status === 'completed' ? 'Selesai' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Jadwal Kelas</h2>
            <button className="text-green-700 text-sm">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {userData.schedules.map((schedule) => (
              <div key={schedule.id} className="bg-white p-3 border border-gray-200 rounded shadow-sm">
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-700 p-2 rounded-lg mr-3 w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{schedule.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {schedule.day}, {schedule.time}
                    </p>
                    <p className="text-xs text-gray-500">
                      {schedule.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <h2 className="text-lg font-medium mb-4">Pengumuman</h2>
          <div className="space-y-4">
            {userData.announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className={`border-l-4 ${
                  announcement.priority === 'high' 
                    ? 'border-red-500' 
                    : 'border-yellow-500'
                } p-3 rounded shadow-sm`}
              >
                <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Aktivitas Terakhir</h2>
            <button className="text-green-700 text-sm">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {userData.activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-3">
                    {activity.type === 'achievement' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    )}
                    {activity.type === 'task' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    )}
                    {activity.type === 'attendance' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{activity.title}</h3>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    +{activity.points} poin
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around items-center px-4 py-2">
        <button 
          onClick={() => setActiveTab('beranda')}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'beranda' ? 'text-green-700' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Beranda</span>
        </button>
        <button 
          onClick={() => setActiveTab('quran')}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'quran' ? 'text-green-700' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs mt-1">Al-Quran</span>
        </button>
        <button 
          onClick={() => setActiveTab('jadwal')}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'jadwal' ? 'text-green-700' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Jadwal</span>
        </button>
        <button 
          onClick={() => setActiveTab('tugas')}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'tugas' ? 'text-green-700' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-xs mt-1">Tugas</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center px-3 py-1 ${activeTab === 'profile' ? 'text-green-700' : 'text-gray-500'}`}
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

export default SSGDashboardPage;