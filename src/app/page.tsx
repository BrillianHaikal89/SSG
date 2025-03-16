"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../components/navbar';

const HomePage = () => {
  // No longer need profileRef since we removed the profile section
  
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
          <div className="absolute z-30 inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-20 lg:px-24">
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
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="text-white">Mengubah</span><br />
                    <span className="text-amber-500">Kepribadian</span><br />
                    <span className="text-white">Menjadi </span>
                    <span className="text-amber-500">Lebih </span>
                    <span className="text-blue-950">Baik.</span>
                  </h1>
                  <div className="mt-6">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-950">
                      Program Pendidikan dan Latihan
                    </p>
                    <p className="text-sm sm:text-base md:text-lg mt-2 text-white">
                      yang dirancang untuk membentuk generasi muda<br className="hidden sm:block" />
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
            className="absolute z-30 bottom-16 left-0 w-full px-6 sm:px-8 md:px-20 lg:px-24"
          >
            <div className="max-w-4xl">
              <motion.button 
                variants={itemVariants}
                onClick={scrollToAbout}
                className="flex items-center space-x-2 bg-gray-300/30 backdrop-blur-sm text-white font-medium py-3 px-6 sm:px-8 rounded-full border border-white/20 cursor-pointer"
                type="button"
                aria-label="Baca selengkapnya"
              >
                <span>Baca Selengkapnya</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* About Us section with orange-bordered image */}
        <section id="about" className="relative min-h-screen sm:h-screen flex flex-col py-12 px-6 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
          {/* About Us heading at the top left */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 text-black text-left z-10">ABOUT US.</h2>
          
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
                    {/* Orange border frame with image and name */}
                    <div className="border-4 border-amber-500 p-2 sm:p-3">
                      <div className="relative overflow-hidden bg-white">
                        <Image
                          src="/img/aagym.png"
                          alt="KH. Abdullah Gymnastyar"
                          width={564}
                          height={702}
                          className="w-full h-auto"
                        />
                      </div>
                      {/* Name caption below the image */}
                      <div className="bg-white py-2 sm:py-3 text-center">
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