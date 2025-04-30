import React from 'react';
import Image from 'next/image';

const DashboardHeader = ({ 
  userData, 
  toggleMobileMenu,
  showNotification, 
  notificationMessage, 
  notificationType, 
  setShowNotification 
}) => {
  return (
    <header className="bg-white shadow-sm">
      {/* Kontainer dengan padding responsif */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header dengan flex responsif */}
        <div className="flex items-center justify-between py-4">
          {/* Mobile menu button - hanya tampil di mobile */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:bg-gray-100 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Logo - Hanya tampil di desktop */}
          <div className="hidden md:flex items-center">
            <Image 
              src="/img/logossg_white.png" 
              alt="Logo Santri Siap Guna" 
              width={40} 
              height={40} 
              className="mr-3"
            />
            <span className="text-xl font-bold text-gray-800">SANTRI SIAP GUNA</span>
          </div>

          {/* Kontainer profil dan notifikasi */}
          <div className="flex items-center space-x-4">
            {/* Notifikasi */}
            <div className="relative">
              <button className="text-gray-700 hover:bg-gray-100 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {userData.notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                    {userData.notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Profil */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{userData.name}</p>
                <p className="text-xs text-gray-500">{userData.level}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifikasi kustom */}
      {showNotification && (
        <div 
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 max-w-md w-full mx-4 ${
            notificationType === 'success' 
              ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
              : 'bg-red-50 text-red-800 border-l-4 border-red-500'
          }`}
        >
          <div className="flex items-center">
            {notificationType === 'success' ? (
              <svg className="h-6 w-6 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <div className="flex-grow">
              <p className="text-sm">{notificationMessage}</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;