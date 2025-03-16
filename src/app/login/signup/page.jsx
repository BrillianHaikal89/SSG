"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

function SignUpPage() {
  const router = useRouter();
  
  // =========== STATE MANAGEMENT ===========
  const [signupStep, setSignupStep] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Signup form - Step 1 (Personal Data)
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  
  // Signup form - Step 2 (Address & Contact)
  const [postalCode, setPostalCode] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [phoneSignup, setPhoneSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Load data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem('signupFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Step 1 data
        setName(parsedData.name || '');
        setNik(parsedData.nik || '');
        setBirthPlace(parsedData.birthPlace || '');
        setBirthDate(parsedData.birthDate || '');
        setGender(parsedData.gender || '');
        setAddress(parsedData.address || '');
        setRt(parsedData.rt || '');
        setRw(parsedData.rw || '');
        
        // Step 2 data
        setPostalCode(parsedData.postalCode || '');
        setKelurahan(parsedData.kelurahan || '');
        setKecamatan(parsedData.kecamatan || '');
        setCity(parsedData.city || '');
        setProvince(parsedData.province || '');
        setPhoneSignup(parsedData.phoneSignup || '');
      } catch (error) {
        console.error('Failed to parse saved form data:', error);
      }
    }
  }, []);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const formData = {
      name, nik, birthPlace, birthDate, gender, address, rt, rw,
      postalCode, kelurahan, kecamatan, city, province, phoneSignup
    };
    
    localStorage.setItem('signupFormData', JSON.stringify(formData));
  }, [name, nik, birthPlace, birthDate, gender, address, rt, rw, 
      postalCode, kelurahan, kecamatan, city, province, phoneSignup]);
  
  // Validate Step 1 form fields
  const validateStep1 = () => {
    const errors = {};
    
    if (!name.trim()) errors.name = 'Nama lengkap wajib diisi';
    if (!nik.trim()) errors.nik = 'NIK wajib diisi';
    else if (nik.length !== 16 || !/^\d+$/.test(nik)) errors.nik = 'NIK harus terdiri dari 16 digit angka';
    
    if (!birthPlace.trim()) errors.birthPlace = 'Tempat lahir wajib diisi';
    if (!birthDate) errors.birthDate = 'Tanggal lahir wajib diisi';
    else {
      const birthDateObj = new Date(birthDate);
      const today = new Date();
      const minAgeDate = new Date(today);
      minAgeDate.setFullYear(today.getFullYear() - 17); // Minimum 17 years old
      
      if (birthDateObj > minAgeDate) {
        errors.birthDate = 'Anda harus berusia minimal 17 tahun';
      }
    }
    
    if (!gender) errors.gender = 'Jenis kelamin wajib dipilih';
    if (!address.trim()) errors.address = 'Alamat wajib diisi';
    if (!rt.trim()) errors.rt = 'RT wajib diisi';
    if (!rw.trim()) errors.rw = 'RW wajib diisi';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate Step 2 form fields
  const validateStep2 = () => {
    const errors = {};
    
    if (!postalCode.trim()) errors.postalCode = 'Kode pos wajib diisi';
    else if (postalCode.length !== 5 || !/^\d+$/.test(postalCode)) errors.postalCode = 'Kode pos harus terdiri dari 5 digit angka';
    
    if (!kelurahan.trim()) errors.kelurahan = 'Kelurahan/Desa wajib diisi';
    if (!kecamatan.trim()) errors.kecamatan = 'Kecamatan wajib diisi';
    if (!city.trim()) errors.city = 'Kabupaten/Kota wajib diisi';
    if (!province.trim()) errors.province = 'Provinsi wajib diisi';
    
    if (!phoneSignup.trim()) errors.phoneSignup = 'Nomor HP wajib diisi';
    else if (!/^08\d{8,11}$/.test(phoneSignup)) {
      errors.phoneSignup = 'Nomor HP harus diawali dengan 08 dan terdiri dari 10-13 digit';
    }
    
    if (!passwordSignup) errors.passwordSignup = 'Kata sandi wajib diisi';
    else if (passwordSignup.length < 8) {
      errors.passwordSignup = 'Kata sandi minimal 8 karakter';
    } else if (!/[A-Z]/.test(passwordSignup) || !/[a-z]/.test(passwordSignup) || !/[0-9]/.test(passwordSignup)) {
      errors.passwordSignup = 'Kata sandi harus mengandung huruf besar, huruf kecil, dan angka';
    }
    
    if (!confirmPassword) errors.confirmPassword = 'Konfirmasi kata sandi wajib diisi';
    else if (passwordSignup !== confirmPassword) {
      errors.confirmPassword = 'Kata sandi tidak cocok';
    }
    
    if (!termsAccepted) {
      errors.termsAccepted = 'Anda harus menyetujui syarat dan ketentuan';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Form submissions
  function handleSignupStep1(e) {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateStep1()) {
      console.log('Personal Data:', { name, nik, birthPlace, birthDate, gender, address, rt, rw });
      setSignupStep(2);
      setFormSubmitted(false);
    }
  }
  
  async function handleSignupStep2(e) {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateStep2()) {
      // Complete user data
      const userData = {
        // Step 1 data
        name, nik, birthPlace, birthDate, gender, address, rt, rw,
        // Step 2 data
        postalCode, kelurahan, kecamatan, city, province, phone: phoneSignup, password: passwordSignup
      };
      
      console.log('Complete registration data:', userData);
      
      try {
        // Simulate API call
        setIsLoadingData(true);
        
        // Simulate successful registration with a delay
        setTimeout(() => {
          setIsLoadingData(false);
          // Clear stored form data after successful registration
          localStorage.removeItem('signupFormData');
          
          // Show success message
          alert('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.');
          
          // Redirect to login page
          router.push('/signin');
        }, 1500);
      } catch (error) {
        setIsLoadingData(false);
        console.error('Error during registration:', error);
        alert('Terjadi kesalahan saat pendaftaran. Silakan coba lagi.');
      }
    }
  }
  
  // Function to go back to step 1 without clearing data
  function goBackToStep1() {
    setSignupStep(1);
    setFormSubmitted(false);
  }
  
  // Sample Indonesian region database (for simulation)
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
  
  // Autofill location data based on postal code
  function handlePostalCodeChange(e) {
    const code = e.target.value;
    setPostalCode(code);
    
    if (code.length === 5) {
      setIsLoadingData(true);
      
      // Simulate loading data from database
      setTimeout(() => {
        if (postalCodeData[code]) {
          setKelurahan(postalCodeData[code].kelurahan);
          setKecamatan(postalCodeData[code].kecamatan);
          setCity(postalCodeData[code].city);
          setProvince(postalCodeData[code].province);
        } else {
          // Reset fields if postal code not found
          setKelurahan('');
          setKecamatan('');
          setCity('');
          setProvince('');
        }
        setIsLoadingData(false);
      }, 500);
    }
  }

  // Helper component for rendering form fields
  function renderField(id, label, type, value, onChange, placeholder, required = true, maxLength, readOnly = false) {
    const hasError = formSubmitted && formErrors[id];
    
    return (
      <div className="mb-3">
        <label htmlFor={id} className="block text-xs font-medium text-gray-500 uppercase mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={id}
            required={required}
            value={value}
            onChange={onChange}
            rows={2}
            className={`appearance-none block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm`}
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
            className={`appearance-none block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm`}
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
            className={`appearance-none block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm`}
            placeholder={placeholder}
            maxLength={maxLength}
            readOnly={readOnly}
          />
        )}
        {hasError && (
          <p className="mt-1 text-xs text-red-500">{formErrors[id]}</p>
        )}
      </div>
    );
  }
  
  // Helper component for rendering fields with tooltips
  function renderFieldWithTooltip(id, label, type, value, onChange, placeholder, tooltip, required = true, maxLength) {
    const hasError = formSubmitted && formErrors[id];
    
    return (
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <label htmlFor={id} className="block text-xs font-medium text-gray-500 uppercase">
            {label} {required && <span className="text-red-500">*</span>}
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
          className={`appearance-none block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm`}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        {hasError && (
          <p className="mt-1 text-xs text-red-500">{formErrors[id]}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Form Side */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`signup-step-${signupStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 overflow-y-auto"
        >
          <div className="w-full max-w-md">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
              {signupStep === 1 ? "Daftar - Data Pribadi" : "Daftar - Data Alamat"}
            </h1>
            
            {/* Signup progress indicator */}
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
            
            {/* Signup Step 1 - Personal Data */}
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
            
            {/* Signup Step 2 - Address & Contact */}
            {signupStep === 2 && (
              <form onSubmit={handleSignupStep2} className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-800 p-2 mb-3">
                  <p className="text-xs text-blue-800">
                    Masukkan kode pos untuk mengisi data kelurahan, kecamatan, kota, dan provinsi secara otomatis.
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="postalCode" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Kode Pos <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      required
                      value={postalCode}
                      onChange={handlePostalCodeChange}
                      className={`appearance-none block w-full px-3 py-3 border ${formSubmitted && formErrors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800`}
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
                  {formSubmitted && formErrors.postalCode && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.postalCode}</p>
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
                
                <div className="flex items-center mt-3 mb-4">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                    className={`h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded ${formSubmitted && formErrors.termsAccepted ? 'border-red-500' : ''}`}
                  />
                  <label htmlFor="termsAccepted" className="ml-2 block text-xs text-gray-700">
                    Saya menyetujui <Link href="/terms" className="text-blue-800 hover:underline">Syarat & Ketentuan</Link> serta <Link href="/privacy" className="text-blue-800 hover:underline">Kebijakan Privasi</Link>
                  </label>
                </div>
                {formSubmitted && formErrors.termsAccepted && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.termsAccepted}</p>
                )}
                
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
                    disabled={isLoadingData}
                    className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {isLoadingData ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                      </>
                    ) : 'Daftar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Banner Side - Changes content based on mode */}
      <div className="hidden md:flex md:w-1/2 bg-blue-800 justify-center items-center p-8">
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
                ? "Lengkapi data diri Anda sesuai KTP" 
                : "Lengkapi alamat dan data kontak Anda"}
            </p>
            <div className="mb-6">
              <div className="flex justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${signupStep === 1 ? 'bg-white' : 'bg-white/50'}`}></div>
                <div className={`w-3 h-3 rounded-full ${signupStep === 2 ? 'bg-white' : 'bg-white/50'}`}></div>
              </div>
            </div>
            <Link href="/signin">
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
      
      {/* Mobile-only footer for switching modes */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-100 p-4 text-center border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/signin">
            <button 
              type="button"
              className="text-blue-800 font-medium"
            >
              Masuk
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;