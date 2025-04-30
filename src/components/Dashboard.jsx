import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardContent from './DashboardContent';

const Dashboard = ({ 
  userData, 
  loading, 
  navigateToScan,
  handleLogout,
  navigateToMY,
  navigateToProfile,
  navigateToPresensi,
  navigateToAlQuran,
  navigateToTugas,
  navigateToHome,
  navigateToECard,
  navigateToPeserta,
  showNotification,
  notificationMessage,
  notificationType,
  setShowNotification
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl">
          <svg className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <DashboardSidebar 
        userData={userData}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        mobileMenuOpen={mobileMenuOpen}
        handleLogout={handleLogout}
        navigateToHome={navigateToHome}
        navigateToMY={navigateToMY}
        navigateToAlQuran={navigateToAlQuran}
        navigateToPresensi={navigateToPresensi}
        navigateToTugas={navigateToTugas}
        navigateToProfile={navigateToProfile}
        navigateToScan={navigateToScan}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader 
          userData={userData}
          toggleMobileMenu={toggleMobileMenu}
          showNotification={showNotification}
          notificationMessage={notificationMessage}
          notificationType={notificationType}
          setShowNotification={setShowNotification}
        />

        <DashboardContent 
          userData={userData}
          navigateToMY={navigateToMY}
          navigateToPresensi={navigateToPresensi}
          navigateToTugas={navigateToTugas}
          navigateToAlQuran={navigateToAlQuran}
          navigateToProfile={navigateToProfile}
          navigateToECard={navigateToECard}
          navigateToPeserta={navigateToPeserta}
          navigateToScan={navigateToScan}
        />
      </div>
    </div>
  );
};

export default Dashboard;