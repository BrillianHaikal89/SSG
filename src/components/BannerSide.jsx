import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const BannerSide = ({ signupStep }) => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-blue-900 justify-center items-center p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={`signupBanner-${signupStep}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            {signupStep === 1 ? "Gabung sekarang" : "Satu langkah lagi"}
          </h2>
          <p className="text-white text-sm mb-6">
            {signupStep === 1 
              ? "Lengkapi data diri Anda sesuai dengan KTP" 
              : "Lengkapi alamat dan data kontak Anda"}
          </p>
          <div className="mb-6">
            <div className="flex justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${signupStep === 1 ? 'bg-white' : 'bg-white/50'}`}></div>
              <div className={`w-3 h-3 rounded-full ${signupStep === 2 ? 'bg-white' : 'bg-white/50'}`}></div>
            </div>
          </div>
          <Link href="/login">
            <button
              type="button"
              className="inline-block py-2 px-6 border border-white rounded-full text-sm font-medium text-white hover:bg-white hover:text-blue-800 transition-colors"
            >
              Sudah punya akun? Masuk
            </button>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BannerSide;