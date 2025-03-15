"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/navbar';

const HomePage = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  // Function to handle smooth scrolling with improved mobile support
  const scrollToProfile = () => {
    if (typeof window !== "undefined" && profileRef.current) {
      const navbarHeight = 64;
      const profileRect = profileRef.current.getBoundingClientRect();
      const profilePosition = profileRect.top + window.pageYOffset;
      window.scrollTo({
        top: profilePosition - navbarHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen font-poppins overflow-x-hidden">
      {/* Header with navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        {/* Hero section - full screen with background image */}
        <div id="home" className="relative w-full h-screen overflow-hidden">
          {/* Background image replacing the gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/img/bghome.png"
              alt="Background"
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          {/* Optional overlay to ensure text readability if needed */}
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          
          {/* Main heading content - centered vertically, left-aligned */}
          <div className="absolute z-30 inset-0 flex flex-col justify-center px-12 md:px-20 lg:px-24">
            <div className="max-w-4xl">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={itemVariants}
                  className="mb-6"
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="text-white">Mengubah</span><br />
                    <span className="text-amber-500">Kepribadian</span><br />
                    <span className="text-white">Menjadi </span>
                    <span className="text-amber-500">Lebih </span>
                    <span className="text-blue-900">Baik.</span>
                  </h1>
                  <div className="mt-6">
                    <p className="text-xl md:text-2xl font-bold text-blue-900">
                      Program Pendidikan dan Latihan
                    </p>
                    <p className="text-base md:text-lg mt-2 text-white">
                      yang dirancang untuk membentuk generasi muda<br />
                      yang berkarakter <span className="text-amber-500 font-bold">BAKU</span>
                      <span className="text-white"> (</span>
                      <span className="text-amber-500 font-bold">Baik</span>
                      <span className="text-white"> & </span>
                      <span className="text-amber-500 font-bold">Kuat</span>
                      <span className="text-white">).</span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Call to action button - bottom left aligned */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="absolute z-30 bottom-16 left-0 w-full px-12 md:px-20 lg:px-24"
          >
            <div className="max-w-4xl">
              <motion.button 
                variants={itemVariants}
                onClick={scrollToProfile}
                className="flex items-center space-x-2 bg-gray-300/30 backdrop-blur-sm text-white font-medium py-3 px-8 rounded-full border border-white/20 cursor-pointer"
                type="button"
                aria-label="Baca profil selengkapnya"
              >
                <span>Baca Selengkapnya</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Profile section - unchanged */}
        <section id="profile" ref={profileRef} className="py-10 px-4 md:px-20 scroll-mt-16">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Profil Lengkap</h2>
            
            <div className="bg-white shadow-lg rounded-xl p-5 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="md:w-1/3">
                  <div className="relative h-72 w-full md:h-96 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src="/img/aagym.png" 
                      alt="KH. Abdullah Gymnastyar"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-3 md:mb-4 text-gray-800">KH. Abdullah Gymnastyar</h3>
                  
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                    KH. Abdullah Gymnastyar, yang lebih dikenal dengan panggilan Aa Gym, adalah seorang pendakwah, pengusaha, dan pendiri Pesantren Daarut Tauhid di Bandung, Jawa Barat. Beliau lahir di Bandung pada 29 Januari 1962.
                  </p>
                  
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                    Aa Gym dikenal dengan pendekatan dakwahnya yang moderat dan menyejukkan. Konsep Manajemen Qolbu yang beliau kembangkan telah menginspirasi banyak orang untuk memperbaiki kualitas diri, baik dalam hubungan dengan Allah SWT maupun dalam bermuamalah dengan sesama manusia.
                  </p>
                  
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                    Selain aktif berdakwah, beliau juga seorang pengusaha sukses yang mengelola berbagai unit usaha di bawah naungan Koperasi Pondok Pesantren Daarut Tauhid. Melalui pendekatan bisnis yang berbasis nilai-nilai Islam, beliau menunjukkan bahwa kesuksesan dunia dan akhirat dapat diraih secara bersamaan.
                  </p>
                  
                  <div className="mt-4 md:mt-6">
                    <h4 className="font-semibold mb-2 text-gray-800">Kontribusi:</h4>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm md:text-base">
                      <li>Pendiri Pesantren Daarut Tauhid</li>
                      <li>Pengembang konsep Manajemen Qolbu</li>
                      <li>Penulis berbagai buku motivasi dan keagamaan</li>
                      <li>Pembina berbagai kegiatan sosial dan pendidikan</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;