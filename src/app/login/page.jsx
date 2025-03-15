"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Form state untuk login
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Form state untuk pendaftaran - Step 1 (Data KTP)
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  
  // Form state untuk pendaftaran - Step 2 (Lokasi & Kontak)
  const [postalCode, setPostalCode] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [email, setEmail] = useState('');
  const [phoneSignup, setPhoneSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Contoh database wilayah Indonesia (untuk simulasi)
  const postalCodeData = {
    "40123": {
      kelurahan: "Sukajadi",
      kecamatan: "Sukajadi",
      city: "Bandung",
      province: "Jawa Barat"
    },
    "40124": {
      kelurahan: "Pasteur",
      kecamatan: "Sukajadi",
      city: "Bandung",
      province: "Jawa Barat"
    },
    "60234": {
      kelurahan: "Wonokromo",
      kecamatan: "Wonokromo",
      city: "Surabaya",
      province: "Jawa Timur"
    }
  };
  
  // Function untuk mengisi data otomatis berdasarkan kode pos
  const handlePostalCodeChange = (e) => {
    const code = e.target.value;
    setPostalCode(code);
    
    if (code.length === 5) {
      setIsLoadingData(true);
      
      // Simulasi loading data dari database
      setTimeout(() => {
        if (postalCodeData[code]) {
          setKelurahan(postalCodeData[code].kelurahan);
          setKecamatan(postalCodeData[code].kecamatan);
          setCity(postalCodeData[code].city);
          setProvince(postalCodeData[code].province);
        } else {
          // Reset fields jika kode pos tidak ditemukan
          setKelurahan('');
          setKecamatan('');
          setCity('');
          setProvince('');
        }
        setIsLoadingData(false);
      }, 500);
    }
  };
  
  // Validasi konfirmasi password
  const validatePasswords = () => {
    if (passwordSignup !== confirmPassword) {
      setPasswordError('Kata sandi tidak cocok');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  // Fungsi untuk login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login dengan:', { phoneNumber, password, rememberMe });
    // Implementasi login di sini
  };
  
  // Fungsi untuk sign up step 1
  const handleSignupStep1 = (e) => {
    e.preventDefault();
    console.log('Data KTP:', { name, nik, birthPlace, birthDate, gender, address, rt, rw });
    setSignupStep(2);
  };
  
  // Fungsi untuk sign up step 2 dan simpan data
  const handleSignupStep2 = async (e) => {
    e.preventDefault();
    
    // Validasi password
    if (!validatePasswords()) {
      return;
    }
    
    // Data pengguna lengkap
    const userData = {
      // Step 1 data
      name, nik, birthPlace, birthDate, gender, address, rt, rw,
      // Step 2 data
      postalCode, kelurahan, kecamatan, city, province, email, phone: phoneSignup, password: passwordSignup
    };
    
    console.log('Data pendaftaran lengkap:', userData);
    
    // Simulasi menyimpan ke database
    try {
      // Pada implementasi sesungguhnya, gunakan API route untuk menyimpan data
      // Contoh fetch ke API:
      /*
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        alert('Pendaftaran berhasil!');
        setIsLogin(true); // Kembali ke halaman login
      } else {
        const data = await response.json();
        alert(`Gagal mendaftar: ${data.message}`);
      }
      */
      
      // Simulasi pendaftaran berhasil
      alert('Pendaftaran berhasil!');
      setIsLogin(true); // Kembali ke halaman login
    } catch (error) {
      console.error('Error saat pendaftaran:', error);
      alert('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    }
  };
  
  // Fungsi untuk kembali ke step sebelumnya
  const goBackToStep1 = () => {
    setSignupStep(1);
  };
  
  // Toggle antara login dan daftar
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setSignupStep(1); // Reset ke step 1 jika beralih mode
    // Reset form saat beralih mode
    if (isLogin) {
      // Reset signup form fields
      setName('');
      setNik('');
      setBirthPlace('');
      setBirthDate('');
      setGender('');
      setAddress('');
      setRt('');
      setRw('');
      setPostalCode('');
      setKelurahan('');
      setKecamatan('');
      setCity('');
      setProvince('');
      setEmail('');
      setPhoneSignup('');
      setPasswordSignup('');
      setConfirmPassword('');
      setPasswordError('');
    } else {
      // Reset login form fields
      setPhoneNumber('');
      setPassword('');
      setRememberMe(false);
    }
  };
  
  // Login dengan social media
  const handleGoogleAuth = () => {
    console.log('Login dengan Google');
  };
  
  const handleFacebookAuth = () => {
    console.log('Login dengan Facebook');
  };

  // Field renderer for signup forms
  const renderField = (id, label, type, value, onChange, placeholder, required = true, maxLength, readOnly = false) => {
    return (
      <div className="mb-3">
        <label htmlFor={id} className="block text-xs font-medium text-gray-500 uppercase mb-1">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={id}
            required={required}
            value={value}
            onChange={onChange}
            rows={2}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm"
            placeholder={placeholder}
            maxLength={maxLength}
            readOnly={readOnly}
          />
        ) : type === 'select' ? (
          <select
            id={id}
            name={id}
            required={required}
            value={value}
            onChange={onChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : type === 'password' ? (id === 'passwordSignup' ? 'new-password' : 'current-password') : undefined}
            required={required}
            value={value}
            onChange={onChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm"
            placeholder={placeholder}
            maxLength={maxLength}
            readOnly={readOnly}
          />
        )}
      </div>
    );
  };
  
  // Render tooltip for fields that need explanation
  const renderFieldWithTooltip = (id, label, type, value, onChange, placeholder, tooltip, required = true, maxLength) => {
    return (
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <label htmlFor={id} className="block text-xs font-medium text-gray-500 uppercase">
            {label}
          </label>
          <div className="relative ml-1 group">
            <div className="cursor-help text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          </div>
        </div>
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : undefined}
          required={required}
          value={value}
          onChange={onChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm"
          placeholder={placeholder}
          maxLength={maxLength}
        />
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Form Side */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={isLogin ? "login" : `signup-step-${signupStep}`}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 overflow-y-auto"
        >
          <div className="w-full max-w-md">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
              {isLogin ? "Masuk" : (signupStep === 1 ? "Daftar - Akun" : "Daftar - Data Alamat")}
            </h1>
            
            {/* Social login hanya tampil pada halaman login */}
            {isLogin && (
              <>
                <div className="flex space-x-4 mb-8">
                  <button 
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
              </>
            )}
            
            {/* Step indicator untuk pendaftaran */}
            {!isLogin && (
              <div className="flex mb-4">
                <div className={`flex-1 text-center pb-2 relative ${signupStep >= 1 ? 'text-blue-800 font-medium' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 text-xs ${signupStep >= 1 ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                  <div className="text-xs md:text-sm">Data Pribadi</div>
                  <div className="absolute w-1/2 h-1 bg-gray-300 top-3 right-0 z-0"></div>
                </div>
                <div className={`flex-1 text-center pb-2 relative ${signupStep >= 2 ? 'text-blue-800 font-medium' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 text-xs ${signupStep >= 2 ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                  <div className="text-xs md:text-sm">Data Alamat</div>
                  <div className="absolute w-1/2 h-1 bg-gray-300 top-3 left-0 z-0"></div>
                </div>
              </div>
            )}
            
            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit}>
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
                
                <div className="mb-6">
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
                    <Link href="/forgot-password" className="font-medium text-gray-500 hover:text-gray-700">
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
            ) : (
              <>
                {/* Signup Step 1 - Data KTP */}
                {signupStep === 1 && (
                  <form onSubmit={handleSignupStep1} className="space-y-3">
                    <div className="bg-blue-50 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 text-blue-800">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </div>
                        <div className="ml-2">
                          <p className="text-xs text-blue-800">
                            Pastikan data yang Anda masukkan sesuai dengan KTP untuk memudahkan proses verifikasi.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {renderFieldWithTooltip(
                      'name', 
                      'Nama Lengkap', 
                      'text', 
                      name, 
                      (e) => setName(e.target.value), 
                      'Nama sesuai KTP', 
                      'Gunakan nama lengkap sesuai yang tertera pada KTP Anda, tanpa singkatan.',
                      true
                    )}
                    
                    {renderFieldWithTooltip(
                      'nik', 
                      'NIK', 
                      'text', 
                      nik, 
                      (e) => setNik(e.target.value), 
                      'Nomor NIK', 
                      'Nomor Induk Kependudukan (NIK) terdiri dari 16 digit angka yang tertera pada KTP Anda.',
                      true,
                      16
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {renderField(
                        'birthPlace', 
                        'Tempat Lahir', 
                        'text', 
                        birthPlace, 
                        (e) => setBirthPlace(e.target.value), 
                        'Tempat Lahir'
                      )}
                      
                      {renderField(
                        'birthDate', 
                        'Tanggal Lahir', 
                        'date', 
                        birthDate, 
                        (e) => setBirthDate(e.target.value), 
                        ''
                      )}
                    </div>
                    
                    {renderField(
                      'gender', 
                      'Jenis Kelamin', 
                      'select', 
                      gender, 
                      (e) => setGender(e.target.value), 
                      ''
                    )}
                    
                    {renderField(
                      'address', 
                      'Alamat (Sesuai KTP)', 
                      'textarea', 
                      address, 
                      (e) => setAddress(e.target.value), 
                      'Alamat Lengkap'
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {renderField(
                        'rt', 
                        'RT', 
                        'text', 
                        rt, 
                        (e) => setRt(e.target.value), 
                        'RT',
                        true,
                        3
                      )}
                      
                      {renderField(
                        'rw', 
                        'RW', 
                        'text', 
                        rw, 
                        (e) => setRw(e.target.value), 
                        'RW',
                        true,
                        3
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                      >
                        Lanjutkan
                      </button>
                    </div>
                  </form>
                )}
                
                {/* Signup Step 2 - Alamat & Data Kontak */}
                {signupStep === 2 && (
                  <form onSubmit={handleSignupStep2} className="space-y-3">
                    <div className="bg-blue-50 border-l-4 border-blue-800 p-2 mb-3">
                      <p className="text-xs text-blue-800">
                        Masukkan kode pos untuk mengisi data kelurahan, kecamatan, kota, dan provinsi secara otomatis.
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="postalCode" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                        Kode Pos
                      </label>
                      <div className="relative">
                        <input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          required
                          value={postalCode}
                          onChange={handlePostalCodeChange}
                          className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                          placeholder="Kode Pos"
                          maxLength={5}
                        />
                        {isLoadingData && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg className="animate-spin h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      {isLoadingData && (
                        <p className="text-xs text-blue-800 mt-1">Mengambil data wilayah...</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {renderField(
                        'kelurahan', 
                        'Kelurahan/Desa', 
                        'text', 
                        kelurahan, 
                        (e) => setKelurahan(e.target.value), 
                        'Kelurahan/Desa',
                        true,
                        null,
                        !!postalCodeData[postalCode]
                      )}
                      
                      {renderField(
                        'kecamatan', 
                        'Kecamatan', 
                        'text', 
                        kecamatan, 
                        (e) => setKecamatan(e.target.value), 
                        'Kecamatan',
                        true,
                        null,
                        !!postalCodeData[postalCode]
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {renderField(
                        'city', 
                        'Kabupaten/Kota', 
                        'text', 
                        city, 
                        (e) => setCity(e.target.value), 
                        'Kabupaten/Kota',
                        true,
                        null,
                        !!postalCodeData[postalCode]
                      )}
                      
                      {renderField(
                        'province', 
                        'Provinsi', 
                        'text', 
                        province, 
                        (e) => setProvince(e.target.value), 
                        'Provinsi',
                        true,
                        null,
                        !!postalCodeData[postalCode]
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 my-3 pt-3">
                      <h3 className="text-xs font-medium text-gray-700 mb-2">Data Kontak</h3>
                    </div>
                    
                    {renderField(
                      'email', 
                      'Email', 
                      'email', 
                      email, 
                      (e) => setEmail(e.target.value), 
                      'Email'
                    )}
                    
                    {renderField(
                      'phoneSignup', 
                      'Nomor HP', 
                      'tel', 
                      phoneSignup, 
                      (e) => setPhoneSignup(e.target.value), 
                      'Nomor HP'
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {renderField(
                        'passwordSignup', 
                        'Kata Sandi', 
                        'password', 
                        passwordSignup, 
                        (e) => setPasswordSignup(e.target.value), 
                        'Kata Sandi'
                      )}
                      
                      {renderField(
                        'confirmPassword', 
                        'Konfirmasi Kata Sandi', 
                        'password', 
                        confirmPassword, 
                        (e) => setConfirmPassword(e.target.value), 
                        'Konfirmasi Kata Sandi'
                      )}
                    </div>
                    
                    {passwordError && (
                      <div className="mt-1 text-sm text-red-600">
                        {passwordError}
                      </div>
                    )}
                    
                    <div className="flex items-center mt-3 mb-4">
                      <input
                        id="agree_terms"
                        name="agree_terms"
                        type="checkbox"
                        required
                        className="h-3 w-3 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
                      />
                      <label htmlFor="agree_terms" className="ml-2 block text-xs text-gray-700">
                        Saya menyetujui <Link href="/terms" className="text-blue-800 hover:underline">Syarat & Ketentuan</Link> serta <Link href="/privacy" className="text-blue-800 hover:underline">Kebijakan Privasi</Link>
                      </label>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={goBackToStep1}
                        className="w-1/2 flex justify-center py-3 px-4 border border-blue-800 rounded-md shadow-sm text-sm font-medium text-blue-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                      >
                        Kembali
                      </button>
                      
                      <button
                        type="submit"
                        className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                      >
                        Daftar
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Banner Side - Changes content based on mode */}
      <div className="hidden md:flex md:w-1/2 bg-blue-800 justify-center items-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "loginBanner" : `signupBanner-${signupStep}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {isLogin ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-2">Selamat datang</h2>
                <p className="text-white text-sm mb-6">Belum punya akun?</p>
                <button
                  onClick={toggleAuthMode}
                  className="inline-block py-2 px-6 border border-white rounded-full text-sm font-medium text-white hover:bg-white hover:text-blue-800 transition-colors"
                >
                  Daftar
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {signupStep === 1 ? "Gabung sekarang" : "Satu langkah lagi"}
                </h2>
                <p className="text-white text-sm mb-6">
                  {signupStep === 1 
                    ? "Lengkapi data diri Anda sesuai KTP" 
                    : "Lengkapi alamat dan data kontak Anda"}
                </p>
                <div className="mb-6">
                  <div className="flex justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${signupStep === 1 ? 'bg-white' : 'bg-white/50'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${signupStep === 2 ? 'bg-white' : 'bg-white/50'}`}></div>
                  </div>
                </div>
                <button
                  onClick={toggleAuthMode}
                  className="inline-block py-2 px-6 border border-white rounded-full text-sm font-medium text-white hover:bg-white hover:text-blue-800 transition-colors"
                >
                  Sudah punya akun? Masuk
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Mobile-only footer for switching modes */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-100 p-4 text-center">
        {isLogin ? (
          <p className="text-sm text-gray-600">
            Belum punya akun?{" "}
            <button 
              onClick={toggleAuthMode}
              className="text-blue-800 font-medium"
            >
              Daftar
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <button 
              onClick={toggleAuthMode}
              className="text-blue-800 font-medium"
            >
              Masuk
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;