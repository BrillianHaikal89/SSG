"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../components/navbar';

const HomePage = () => {
  // State to track viewport size
  const [isMobile, setIsMobile] = useState(false);
  
  // Effect to detect viewport size on mount and when window resizes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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
  
  // Function to handle smooth scrolling to the about section
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      // Get the height of the navbar for offset calculation
      const navbarHeight = 64;
      
      // Get the element's position relative to the viewport
      const aboutRect = aboutSection.getBoundingClientRect();
      
      // Calculate the absolute position of the element on the page
      const aboutPosition = aboutRect.top + window.pageYOffset;
      
      // Scroll to the element with offset for the navbar
      window.scrollTo({
        top: aboutPosition - navbarHeight,
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
          {/* Background image (bghome.png) - behind everything */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/img/bghome.png"
              alt="Background Pattern"
              fill
              priority
              style={{ 
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>
          
          {/* activity_home.png - on top of bghome.png */}
          <div className="absolute z-10 inset-0">
            {isMobile ? (
              // Mobile version positioned just above the "Baca Selengkapnya" button
              <div className="absolute bottom-24 left-0 right-0 h-2/5">
                <Image
                  src="/img/activity_home.png"
                  alt="Activity Home"
                  fill
                  priority
                  style={{ 
                    objectFit: 'contain',
                    objectPosition: 'center bottom'
                  }}
                />
              </div>
            ) : (
              // Desktop version covering the whole area
              <Image
                src="/img/activity_home.png"
                alt="Activity Home"
                fill
                priority
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            )}
          </div>
          
          {/* Blue pattern overlay */}
          <div className="absolute inset-0 z-20 opacity-80" 
               style={{ 
                 background: 'url(/img/blue-pattern.png)', 
                 backgroundSize: 'cover',
                 mixBlendMode: 'overlay'
               }}>
          </div>
          
          {/* Optional overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/10 z-30"></div>
          
          {/* Main heading content - adjusted position to center for mobile */}
          <div className="absolute z-40 inset-0 flex flex-col items-center" 
               style={{ paddingTop: isMobile ? '40vh' : '12vh' }}>
            <div className="text-center px-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={itemVariants}
                  className="mb-6"
                >
                  <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight`}>
                    <span className="text-white">Mengubah</span>
                    {isMobile ? ' ' : <br />}
                    <span className="text-amber-500">Kepribadian</span>
                    <span className="text-white"> Menjadi </span>
                    {isMobile ? ' ' : <br />}
                    <span className="text-amber-500">Lebih </span>
                    <span className="text-blue-950">Baik.</span>
                  </h1>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* "Baca Selengkapnya" button */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="absolute z-40 bottom-16 left-0 w-full flex justify-center"
          >
            <motion.button 
              variants={itemVariants}
              onClick={scrollToAbout}
              className="flex items-center space-x-2 bg-gray-300/30 backdrop-blur-sm text-white font-medium py-3 px-6 sm:px-8 rounded-full border border-white/20 cursor-pointer"
              type="button"
              aria-label="Baca selengkapnya"
            >
              <span>Baca Selengkapnya</span>
            </motion.button>
          </motion.div>
          
          {/* Removed the "Baca Selengkapnya" text from bottom left */}
        </div>

        {/* About Us section with orange-bordered image */}
        <section id="about" className="relative min-h-screen sm:h-screen flex flex-col pt-10 pb-12 px-6 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
          {/* About Us heading with improved positioning for mobile - moved higher */}
          <div className="relative z-10 -mt-4 mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black text-left">ABOUT US.</h2>
          </div>
          
          {/* Background pattern - hidden on mobile, visible on larger screens */}
          <div className="absolute inset-0 z-0 hidden sm:block">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-full h-full relative">
                <Image
                  src="/img/bgabout.png"
                  alt="Background Pattern"
                  fill
                  style={{ objectFit: 'contain', opacity: 0.85 }}
                />
              </div>
            </div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto w-full flex-grow flex items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-8 sm:gap-16">
                <div className="w-full sm:w-6/12">
                  <div className="mb-6 sm:mb-8">
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl ml-0">
                      Santri Siap Guna (SSG) Daarut Tauhiid merupakan sebuah program pendidikan dan latihan yang dirancang untuk membentuk generasi muda yang berkarakter BAKU (Baik dan Kuat), dengan fokus pada pemahaman dasar keislaman agar mampu mengenali diri dan juga Rabb-Nya.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl ml-0 sm:ml-10">
                      Santri Siap Guna (SSG) Daarut Tauhiid merupakan program pelatihan intensif yang memadukan aspek spiritual dan praktis. Dengan pendekatan komprehensif, kami menyiapkan generasi muda Muslim untuk menghadapi tantangan dunia modern sambil tetap berpegang pada nilai-nilai Islam yang kuat.
                    </p>
                  </div>
                </div>
                
                <div className="w-full sm:w-5/12 flex justify-center sm:justify-end mb-8 sm:mb-0">
                  <div className="relative w-4/5 sm:w-auto overflow-hidden sm:ml-auto" style={{ transform: 'scale(1.254)' }}>
                    {/* Orange border frame with image and name - hidden on mobile, visible on sm and up */}
                    <div className="hidden sm:block border-4 border-amber-500 p-2 sm:p-3">
                      <div className="relative overflow-hidden">
                        <Image
                          src="/img/aagym.png"
                          alt="KH. Abdullah Gymnastyar"
                          width={564}
                          height={702}
                          className="w-full h-auto"
                        />
                      </div>
                      {/* Name caption below the image */}
                      <div className="py-2 sm:py-3 text-center">
                        <p className="font-medium text-gray-800 text-base sm:text-lg">KH. Abdullah Gymnastyar</p>
                      </div>
                    </div>
                    
                    {/* Mobile version without orange border */}
                    <div className="block sm:hidden">
                      <div className="relative overflow-hidden">
                        <Image
                          src="/img/aagym.png"
                          alt="KH. Abdullah Gymnastyar"
                          width={564}
                          height={702}
                          className="w-full h-auto"
                        />
                      </div>
                      {/* Name caption below the image */}
                      <div className="py-2 sm:py-3 text-center">
                        <p className="font-medium text-gray-800 text-base sm:text-lg">KH. Abdullah Gymnastyar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>


      </main>
    </div>
  );
};

export default HomePage;