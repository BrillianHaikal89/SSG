"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../stores/authStore';

const ProfileLayout = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { checkAuth } = useAuthStore();

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Check if user is logged in using Zustand store
      const isAuthenticated = checkAuth();
      
      if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        router.push('/login');
        return;
      }
      
      setLoading(false);
    }
  }, [router, checkAuth, isClient]);

  // Handle back button
  const handleBack = () => {
    router.push('/dashboard');
  };

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Memuat profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-900 text-white sticky top-0 z-10">
        <div className="container mx-auto px-3 py-2 md:px-4 md:py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/img/logossg_white.png" 
                alt="Logo Santri Siap Guna" 
                width={30} 
                height={30} 
                className="mr-2 md:w-36 md:h-36"
              />
              <h1 className="text-base md:text-xl font-bold">SANTRI SIAP GUNA</h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleBack}
                className="text-white p-1"
                aria-label="Kembali ke Dashboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
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
        className="flex-grow container mx-auto px-3 py-3 pb-16 md:px-4 md:py-6 md:pb-20"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default ProfileLayout;