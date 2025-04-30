import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardContent from './DashboardContent';
import { motion } from 'framer-motion';
import { MenuAlt1Icon, XIcon } from '@heroicons/react/outline';

const DashboardMobile = ({
  userData, 
  loading,
  navigateToMY,
  navigateToProfile,
  navigateToPresensi,
  navigateToAlQuran,
  navigateToTugas,
  navigateToHome,
  navigateToECard,
  navigateToPeserta,
  handleLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Tutup menu saat layar diperbesar
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <DashboardHeader 
        userData={userData}
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        ></motion.div>
      )}
      
      <motion.nav
        initial={{ x: '-100%' }}
        animate={mobileMenuOpen ? { x: 0 } : { x: '-100%' }}
        transition={{ type: 'tween' }}
        className="fixed top-0 left-0 h-screen w-64 bg-white z-50 md:hidden overflow-y-auto"
      >
        <div className="px-4 py-6">
          <button 
            className="absolute top-2 right-2 p-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <XIcon className="h-6 w-6 text-gray-600" />  
          </button>

          {/* Menu items */}
          <div className="mt-6 flex flex-col">
            {/* Navigasi ke /dashboard */}
            <button 
              onClick={navigateToHome}
              className="mb-2 text-left px-4 py-2 rounded-md hover:bg-blue-100"
            >
              Beranda
            </button>
            
            {/* Navigasi ke /dashboard/my */}
            <button 
              onClick={navigateToMY}
              className="mb-2 text-left px-4 py-2 rounded-md hover:bg-blue-100"
            >
              Mutaba'ah Yaumiyah
            </button>
            
            {/* Navigasi ke /dashboard/alquran */}
            <button 
              onClick={navigateToAlQuran} 
              className="mb-2 text-left px-4 py-2 rounded-md hover:bg-blue-100"
            >
              Al-Quran
            </button>
            
            {/* Navigasi ke /dashboard/presensi */}
            <button 
              onClick={navigateToPresensi}
              className="mb-2 text-left px-4 py-2 rounded-md hover:bg-blue-100"
            >
              Presensi
            </button>
            
            {/* Navigasi ke /dashboard/tugas */}
            <button 
              onClick={navigateToTugas}
              className="mb-2 text-left px-4 py-2 rounded-md hover:bg-blue-100"
            >
              Tugas
            </button>

            {/* Navigasi ke /dashboard/ecard */}
            <button 
              onClick={navigateToECard}
              className="mb-2 text-left px-4 py-2 rounded-md hover:bg-blue-100"
            >
              E-Card  
            </button>
            
            {/* Navigasi ke /dashboard/peserta */}
            <button 
              onClick={navigateToPeserta}
              className="mb-2 text-left px-4 py-2 rounded-md hover:bg-blue-100"  
            >
              Peserta  
            </button>
            
            {/* Navigasi ke /dashboard/profile */}
            <button 
              onClick={navigateToProfile}
              className="mb-2 text-left px-4 py-2 rounded-md hover:bg-blue-100"
            >
              Profil
            </button>
            
            {/* Tombol Logout */}
            <button 
              onClick={handleLogout}
              className="mt-auto text-left px-4 py-2 rounded-md hover:bg-blue-100 text-red-700"
            >
              Logout
            </button>
          </div>
        </div>  
      </motion.nav>

      <main className="flex-grow py-4 px-2">
        <DashboardContent 
          userData={userData}
          navigateToMY={navigateToMY}
          navigateToPresensi={navigateToPresensi}
          navigateToTugas={navigateToTugas}
          navigateToProfile={navigateToProfile}
        />
      </main>

      <footer className="bg-blue-800 text-white text-center py-4">
        &copy; {new Date().getFullYear()} Santri Siap Guna  
      </footer>
    </div>  
  );
};

export default DashboardMobile;