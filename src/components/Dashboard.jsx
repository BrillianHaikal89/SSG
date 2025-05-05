import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Notification from './Notification';
import QuranBookmarkCard from '../app/dashboard/Quran/QuranBookmarkCard';

const Dashboard = ({
  userData,
  loading,
  handleLogout,
  navigateToScan,
  navigateToMY,
  navigateToPeserta,
  navigateToProfile,
  navigateToECard,
  navigateToPresensi,
  navigateToAlQuran,
  navigateToTugas,
  navigateToHome,
  showNotification,
  notificationMessage,
  notificationType,
  setShowNotification
}) => {
  const handleContinueReading = (bookmark) => {
    // Navigate to Al-Quran page with bookmark data
    navigateToAlQuran(bookmark);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header with user info */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/img/logossg_white.png" 
                alt="SSG Logo" 
                width={36} 
                height={36} 
                className="h-9 w-9 mr-3"
              />
              <div>
                <h1 className="text-lg font-bold uppercase tracking-wide">DASHBOARD</h1>
                <p className="text-xs text-blue-200">Santri Siap Guna</p>
              </div>
            </div>
            <div className="flex items-center">
              <div 
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold cursor-pointer"
                onClick={navigateToProfile}
              >
                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-4">
        <div className="container mx-auto">
          {/* User greeting card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mb-5"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Assalamu'alaikum, {userData?.name || 'Santri'}</h2>
                <p className="text-gray-600 text-sm">{userData?.level || 'Peserta SSG'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </motion.div>

          {/* Quran Bookmark Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <QuranBookmarkCard onContinueReading={handleContinueReading} />
          </motion.div>

          {/* Menu grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-5"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {/* Menu Item: Al-Qur'an */}
              <div 
                onClick={() => navigateToAlQuran()}
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center cursor-pointer transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                  <span className="text-lg">📖</span>
                </div>
                <span className="text-sm font-medium">Al-Qur'an</span>
              </div>

              {/* Menu Item: Kartu Digital */}
              <div 
                onClick={navigateToECard}
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center cursor-pointer transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                  <span className="text-lg">💳</span>
                </div>
                <span className="text-sm font-medium">Kartu Digital</span>
              </div>

              {/* Menu Item: Presensi */}
              <div 
                onClick={navigateToPresensi}
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center cursor-pointer transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                  <span className="text-lg">📝</span>
                </div>
                <span className="text-sm font-medium">Presensi</span>
              </div>

              {/* Menu Item: Scan */}
              <div 
                onClick={navigateToScan}
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center cursor-pointer transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                  <span className="text-lg">📷</span>
                </div>
                <span className="text-sm font-medium">Scan QR</span>
              </div>

              {/* Menu Item: Mutabaah Yaumiyah */}
              <div 
                onClick={navigateToMY}
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center cursor-pointer transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                  <span className="text-lg">📊</span>
                </div>
                <span className="text-sm font-medium">Mutabaah</span>
              </div>

              {/* Menu Item: Tugas */}
              <div 
                onClick={navigateToTugas}
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center cursor-pointer transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                  <span className="text-lg">📚</span>
                </div>
                <span className="text-sm font-medium">Tugas</span>
              </div>

              {/* Menu Item: Peserta */}
              <div 
                onClick={navigateToPeserta}
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center cursor-pointer transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                  <span className="text-lg">👥</span>
                </div>
                <span className="text-sm font-medium">Peserta</span>
              </div>

              {/* Menu Item: Profile */}
              <div 
                onClick={navigateToProfile}
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center cursor-pointer transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                  <span className="text-lg">👤</span>
                </div>
                <span className="text-sm font-medium">Profil</span>
              </div>
            </div>
          </motion.div>

          {/* Progress Statistics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 mb-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Progres Bacaan Al-Qur'an</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Juz</span>
                  <span className="text-sm font-medium text-gray-700">{userData?.quranProgress?.juz || 0}/30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((userData?.quranProgress?.juz || 0) / 30) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <span>Terakhir dibaca: </span>
                <span className="font-medium ml-1">
                  {userData?.quranProgress?.surah || 'Belum ada'} ({userData?.quranProgress?.lastRead || '-'})
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between">
            <button 
              onClick={navigateToHome}
              className="flex flex-col items-center py-1 px-4 text-blue-900"
            >
              <span className="text-lg">🏠</span>
              <span className="text-xs mt-1">Home</span>
            </button>
            <button 
              onClick={() => navigateToAlQuran()}
              className="flex flex-col items-center py-1 px-4 text-blue-900"
            >
              <span className="text-lg">📖</span>
              <span className="text-xs mt-1">Qur'an</span>
            </button>
            <button 
              onClick={navigateToPresensi}
              className="flex flex-col items-center py-1 px-4 text-blue-900"
            >
              <span className="text-lg">📝</span>
              <span className="text-xs mt-1">Presensi</span>
            </button>
            <button 
              onClick={navigateToProfile}
              className="flex flex-col items-center py-1 px-4 text-blue-900"
            >
              <span className="text-lg">👤</span>
              <span className="text-xs mt-1">Profil</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Notification */}
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;