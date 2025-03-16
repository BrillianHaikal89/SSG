"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

function SignInPage() {
  const router = useRouter();
  
  // =========== STATE MANAGEMENT ===========
  // Login form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  
  // Load Cloudflare Turnstile script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // Social login handlers
  function handleGoogleAuth() {
    console.log('Login with Google');
  }
  
  function handleFacebookAuth() {
    console.log('Login with Facebook');
  }
  
  // Form submissions
  function handleLoginSubmit(e) {
    e.preventDefault();
    console.log('Login with:', { phoneNumber, password, rememberMe });
    // Implement login logic here including the turnstile token
  }

  // Navigation handler for signup button
  function navigateToSignup() {
    router.push('/login/signup');
  }

  return (
    <div className="flex h-screen">
      {/* Form Side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
            Masuk
          </h1>
          
          {/* Social login options */}
          <div className="flex space-x-4 mb-8">
            <button 
              type="button"
              onClick={handleGoogleAuth}
              className="flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" 
                  fill="#4285F4"/>
              </svg>
              Google
            </button>
            
            <button 
              type="button"
              onClick={handleFacebookAuth}
              className="flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" 
                  fill="#1877F2"/>
              </svg>
              Facebook
            </button>
          </div>
          
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                atau masuk dengan nomor HP
              </span>
            </div>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} action="/login" method="POST">
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                Nomor HP
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                placeholder="Nomor HP"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                placeholder="Kata Sandi"
              />
            </div>
            
            {/* Cloudflare Turnstile */}
            <div className="mb-4">
              <div className="cf-turnstile" data-sitekey="0x4AAAAAABBBnsl2yEqRVvMU"></div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                  Ingat Saya
                </label>
              </div>
              
              <div className="text-sm">
                <Link href="/login/forgot-password" className="font-medium text-gray-500 hover:text-gray-700">
                  Lupa Kata Sandi?
                </Link>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Masuk
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      
      {/* Banner Side */}
      <div className="hidden md:flex md:w-1/2 bg-blue-800 justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Selamat datang</h2>
          <p className="text-white text-sm mb-6">Belum punya akun?</p>
          <button
            type="button"
            onClick={navigateToSignup}
            className="inline-block py-2 px-6 border border-white rounded-full text-sm font-medium text-white hover:bg-white hover:text-blue-800 transition-colors"
          >
            Daftar
          </button>
        </motion.div>
      </div>
      
      {/* Mobile-only footer for switching modes */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-100 p-4 text-center border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Belum punya akun?{" "}
          <button 
            type="button"
            onClick={navigateToSignup}
            className="text-blue-800 font-medium"
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;