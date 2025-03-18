"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Components - menggunakan path relatif
import ProgressIndicator from '../../../components/ProgressIndicator';
import PersonalDataForm from '../../../components/PersonalDataForm';
import AddressContactForm from '../../../components/AddressContactForm';
import BannerSide from '../../../components/BannerSide';
import MobileFooter from '../../../components/MobileFooter';

// Utilities - menggunakan path relatif
import { validateStep1, validateStep2 } from '../../../utils/validators';

export default function SignUpPage() {
  const router = useRouter();
  
  // =========== STATE MANAGEMENT ===========
  const [signupStep, setSignupStep] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Signup form - Step 1 (Personal Data)
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState(''); // State golongan darah
  const [address, setAddress] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  
  // Signup form - Step 2 (Address & Contact) - dengan bahasa Indonesia
  const [kodePos, setKodePos] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [konfirmasiKataSandi, setKonfirmasiKataSandi] = useState('');
  const [persetujuanSyarat, setPersetujuanSyarat] = useState(false);
  
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
        setBloodType(parsedData.bloodType || '');
        setAddress(parsedData.address || '');
        setRt(parsedData.rt || '');
        setRw(parsedData.rw || '');
        
        // Step 2 data - dengan variabel bahasa Indonesia
        setKodePos(parsedData.postalCode || '');
        setKelurahan(parsedData.kelurahan || '');
        setKecamatan(parsedData.kecamatan || '');
        setKota(parsedData.city || '');
        setProvinsi(parsedData.province || '');
        setNomorTelepon(parsedData.phoneSignup || '');
      } catch (error) {
        console.error('Gagal mengurai data formulir tersimpan:', error);
      }
    }
  }, []);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const formData = {
      name, nik, birthPlace, birthDate, gender, bloodType, address, rt, rw,
      postalCode: kodePos, 
      kelurahan, 
      kecamatan, 
      city: kota, 
      province: provinsi, 
      phoneSignup: nomorTelepon
    };
    
    localStorage.setItem('signupFormData', JSON.stringify(formData));
  }, [name, nik, birthPlace, birthDate, gender, bloodType, address, rt, rw, 
      kodePos, kelurahan, kecamatan, kota, provinsi, nomorTelepon]);
  
  // Fungsi untuk memeriksa apakah NIK sudah terdaftar menggunakan localStorage saja
  const isNIKAlreadyRegistered = (nikValue) => {
    try {
      // Ambil data pengguna terdaftar dari localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Cari apakah ada pengguna dengan NIK yang sama
      return registeredUsers.some(user => user.nik === nikValue);
    } catch (error) {
      console.error('Error saat memeriksa NIK:', error);
      return false;
    }
  };
  
  // Form submissions
  function handleSignupStep1(e) {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validasi data dasar
    const baseErrors = validateStep1({
      name, nik, birthPlace, birthDate, gender, bloodType, address, rt, rw
    });
    
    // Validasi tambahan untuk NIK (cek apakah NIK sudah terdaftar)
    let errors = { ...baseErrors };
    
    // Hanya cek NIK jika format sudah benar
    if (!baseErrors.nik) {
      // Periksa NIK di localStorage
      const isNikRegistered = isNIKAlreadyRegistered(nik);
      
      if (isNikRegistered) {
        errors.nik = "NIK ini sudah terdaftar. Silakan gunakan NIK lain atau login dengan NIK ini";
      }
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      console.log('Personal Data:', { name, nik, birthPlace, birthDate, gender, bloodType, address, rt, rw });
      setSignupStep(2);
      setFormSubmitted(false);
    }
  }
  
  function handleSignupStep2(e) {
    e.preventDefault();
    setFormSubmitted(true);
    
    const errors = validateStep2({
      postalCode: kodePos, 
      kelurahan, 
      kecamatan, 
      city: kota, 
      province: provinsi, 
      phoneSignup: nomorTelepon, 
      passwordSignup: kataSandi, 
      confirmPassword: konfirmasiKataSandi, 
      termsAccepted: persetujuanSyarat
    });
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Periksa sekali lagi apakah NIK sudah terdaftar untuk mencegah race condition
      const isNikRegistered = isNIKAlreadyRegistered(nik);
      if (isNikRegistered) {
        setSignupStep(1);
        setFormErrors({ nik: "NIK ini sudah terdaftar. Silakan gunakan NIK lain atau login dengan NIK ini" });
        return;
      }
      
      // Complete user data
      const userData = {
        // Step 1 data
        name, 
        nik, 
        birthPlace, 
        birthDate, 
        gender, 
        bloodType, 
        address, 
        rt, 
        rw,
        // Step 2 data
        postalCode: kodePos, 
        kelurahan, 
        kecamatan, 
        city: kota, 
        province: provinsi, 
        phone: nomorTelepon, 
        password: kataSandi
      };
      
      console.log('Data pendaftaran lengkap:', userData);
      
      try {
        // Set loading state
        setIsLoadingData(true);
        
        // Simulasi proses pendaftaran
        setTimeout(() => {
          // Simpan data ke localStorage
          localStorage.setItem('registeredUsers', JSON.stringify([
            ...(JSON.parse(localStorage.getItem('registeredUsers') || '[]')),
            {
              ...userData,
              id: Date.now(),
              createdAt: new Date().toISOString()
            }
          ]));
          
          // Clear stored form data after successful registration
          localStorage.removeItem('signupFormData');
          
          // Show success message
          alert('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.');
          
          // Redirect to login page
          router.push('/login');
          
          // Set loading state back to false
          setIsLoadingData(false);
        }, 1500);
      } catch (error) {
        setIsLoadingData(false);
        console.error('Error selama pendaftaran:', error);
        alert('Terjadi kesalahan saat pendaftaran. Silakan coba lagi.');
      }
    }
  }
  
  // Function to go back to step 1 without clearing data
  function goBackToStep1() {
    setSignupStep(1);
    setFormSubmitted(false);
  }

  return (
    <div className="flex h-screen">
      {/* Form Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
            {signupStep === 1 ? "Daftar - Data Pribadi" : "Daftar - Data Alamat"}
          </h1>
          
          {/* Signup progress indicator */}
          <ProgressIndicator currentStep={signupStep} />
          
          {/* Signup Step 1 - Personal Data */}
          {signupStep === 1 && (
            <PersonalDataForm 
              formData={{ name, nik, birthPlace, birthDate, gender, bloodType, address, rt, rw }}
              setters={{ 
                setName, setNik, setBirthPlace, setBirthDate, 
                setGender, setBloodType, setAddress, setRt, setRw 
              }}
              formErrors={formErrors}
              formSubmitted={formSubmitted}
              handleSubmit={handleSignupStep1}
            />
          )}
          
          {/* Signup Step 2 - Address & Contact */}
          {signupStep === 2 && (
            <AddressContactForm
              formData={{ 
                kodePos, kelurahan, kecamatan, kota, provinsi,
                nomorTelepon, kataSandi, konfirmasiKataSandi, persetujuanSyarat
              }}
              setters={{ 
                setKodePos, setKelurahan, setKecamatan, setKota, setProvinsi,
                setNomorTelepon, setKataSandi, setKonfirmasiKataSandi, setPersetujuanSyarat
              }}
              passwordVisibility={{ 
                showPassword, setShowPassword, 
                showConfirmPassword, setShowConfirmPassword 
              }}
              formErrors={formErrors}
              formSubmitted={formSubmitted}
              isLoadingData={isLoadingData}
              goBackToStep1={goBackToStep1}
              handleSubmit={handleSignupStep2}
              postalCodeReadOnly={!!kelurahan && !!kecamatan && !!kota && !!provinsi}
            />
          )}
        </div>
      </div>
      
      {/* Banner Side */}
      <BannerSide signupStep={signupStep} />
      
      {/* Mobile-only footer for login link */}
      <MobileFooter />
    </div>
  );
}