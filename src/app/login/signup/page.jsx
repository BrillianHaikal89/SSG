"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalDataForm from '../../../components/PersonalDataForm';
import AddressContactForm from '../../../components/AddressContactForm';

const SignupPage = () => {
  const router = useRouter();
  
  // State for controlling step
  const [signupStep, setSignupStep] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Personal Data (Step 1)
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [address, setAddress] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  const [kodePos, setKodePos] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  
  // Address & Contact Data (Step 2)
  const [alamatDomisili, setAlamatDomisili] = useState('');
  const [rtDomisili, setRtDomisili] = useState('');
  const [rwDomisili, setRwDomisili] = useState('');
  const [kodePosStep2, setKodePosStep2] = useState('');
  const [kelurahanStep2, setKelurahanStep2] = useState('');
  const [kecamatanStep2, setKecamatanStep2] = useState('');
  const [kotaStep2, setKotaStep2] = useState('');
  const [provinsiStep2, setProvinsiStep2] = useState('');
  const [email, setEmail] = useState('');
  const [nomorHp, setNomorHp] = useState('');
  const [aktivasi, setAktivasi] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [konfirmasiKataSandi, setKonfirmasiKataSandi] = useState('');
  const [persetujuanSyarat, setPersetujuanSyarat] = useState(false);
  
  // Handle postal code lookup (reusable function)
  const handleKodePosLookup = async (postalCode, setters) => {
    if (!postalCode || postalCode.length !== 5) {
      // Clear address fields if postal code is incomplete
      setters.setKelurahan('');
      setters.setKecamatan('');
      setters.setKota('');
      setters.setProvinsi('');
      return;
    }
    
    try {
      setIsLoadingData(true);
      
      // Fetch data from the server
      const response = await fetch(`http://localhost:3333/api/users/kodepos?kode_pos=${postalCode}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Fill form with received data
        setters.setKelurahan(data.kelurahan || "");
        setters.setKecamatan(data.kecamatan || "");
        setters.setKota(data.kota || "");
        setters.setProvinsi(data.provinsi || "");
        
        // Clear any previous error
        setFormErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[setters.errorKey];
          return newErrors;
        });
      } else {
        console.error(`Server responded with status: ${response.status}`);
        setFormErrors(prev => ({
          ...prev,
          [setters.errorKey]: "Data kode pos tidak ditemukan. Harap isi alamat secara manual."
        }));
      }
    } catch (error) {
      console.error('Error fetching postal code data:', error);
      setFormErrors(prev => ({
        ...prev,
        [setters.errorKey]: "Gagal terhubung ke server. Silakan isi alamat secara manual."
      }));
    } finally {
      setIsLoadingData(false);
    }
  };
  
  // Handle Step 1 submission (Personal Data)
  const handleStep1Submit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Basic validation
    const errors = {};
    if (!name) errors.name = "Nama lengkap harus diisi";
    if (!nik || nik.length !== 16) errors.nik = "NIK harus 16 digit";
    if (!birthPlace) errors.birthPlace = "Tempat lahir harus diisi";
    if (!birthDate) errors.birthDate = "Tanggal lahir harus diisi";
    if (!gender) errors.gender = "Jenis kelamin harus dipilih";
    if (!bloodType) errors.bloodType = "Golongan darah harus dipilih";
    if (!address) errors.address = "Alamat harus diisi";
    if (!rt) errors.rt = "RT harus diisi";
    if (!rw) errors.rw = "RW harus diisi";
    if (!kodePos || kodePos.length !== 5) errors.kodePos = "Kode pos harus 5 digit";
    if (!kelurahan) errors.kelurahan = "Kelurahan/desa harus diisi";
    if (!kecamatan) errors.kecamatan = "Kecamatan harus diisi";
    if (!kota) errors.kota = "Kabupaten/Kota harus diisi";
    if (!provinsi) errors.provinsi = "Provinsi harus diisi";
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Proceed to step 2
      setSignupStep(2);
      setFormSubmitted(false);
    }
  };
  
  // Handle Step 2 submission (Address & Contact)
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Basic validation
    const errors = {};
    if (!alamatDomisili) errors.alamatDomisili = "Alamat domisili harus diisi";
    if (!rtDomisili) errors.rtDomisili = "RT domisili harus diisi";
    if (!rwDomisili) errors.rwDomisili = "RW domisili harus diisi";
    if (!kodePosStep2 || kodePosStep2.length !== 5) errors.kodePosStep2 = "Kode pos harus 5 digit";
    if (!kelurahanStep2) errors.kelurahanStep2 = "Kelurahan harus diisi";
    if (!kecamatanStep2) errors.kecamatanStep2 = "Kecamatan harus diisi";
    if (!kotaStep2) errors.kotaStep2 = "Kabupaten/Kota harus diisi";
    if (!provinsiStep2) errors.provinsiStep2 = "Provinsi harus diisi";
    if (!email) errors.email = "Email harus diisi";
    if (!nomorHp) errors.nomorHp = "Nomor HP harus diisi";
    if (!aktivasi) errors.aktivasi = "Aktivasi harus diisi";
    if (!kataSandi) errors.kataSandi = "Kata sandi harus diisi";
    if (kataSandi !== konfirmasiKataSandi) errors.konfirmasiKataSandi = "Konfirmasi kata sandi tidak cocok";
    if (!persetujuanSyarat) errors.persetujuanSyarat = "Anda harus menyetujui syarat dan ketentuan";
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        setIsLoadingData(true);
        
        // Prepare user data for registration
        const userData = {
          // Personal data
          nama_lengkap: name,
          nik: nik,
          tempat_lahir: birthPlace,
          tanggal_lahir: birthDate,
          jenis_kelamin: gender === 'L' ? 'Laki-laki' : 'Perempuan',
          golongan_darah: bloodType,
          alamat: address,
          rt: rt,
          rw: rw,
          kode_pos: kodePos,
          kelurahan_desa: kelurahan,
          kecamatan: kecamatan,
          kabupaten_kota: kota,
          provinsi: provinsi,
          // Address & contact data
          alamat_domisili: alamatDomisili,
          rt_domisili: rtDomisili,
          rw_domisili: rwDomisili,
          kode_pos_domisili: kodePosStep2,
          kelurahan_desa_domisili: kelurahanStep2,
          kecamatan_domisili: kecamatanStep2,
          kabupaten_kota_domisili: kotaStep2,
          provinsi_domisili: provinsiStep2,
          email: email,
          nomor_hp: nomorHp,
          aktivasi: aktivasi,
          password: kataSandi,
          // Default values
          agama: 'Islam'
        };
        
        // Send registration request to server
        const response = await fetch('http://localhost:3333/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
          // Registration successful
          alert('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.');
          router.push('/login');
        } else {
          // Handle registration errors
          if (response.status === 400 && responseData.message && responseData.message.includes('NIK sudah terdaftar')) {
            setSignupStep(1);
            setFormErrors({ nik: "NIK ini sudah terdaftar. Silakan gunakan NIK lain atau login dengan NIK ini" });
          } else if (response.status === 400 && responseData.message && responseData.message.includes('Nomor HP sudah terdaftar')) {
            setFormErrors({ nomorHp: "Nomor HP ini sudah terdaftar. Silakan gunakan nomor HP lain atau login." });
          } else {
            setFormErrors({ 
              server: responseData.message || responseData.error || 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.' 
            });
          }
        }
      } catch (error) {
        console.error('Error saat pendaftaran:', error);
        setFormErrors({ 
          server: 'Gagal terhubung ke server. Silakan coba lagi nanti.' 
        });
      } finally {
        setIsLoadingData(false);
      }
    }
  };
  
  // Go back to step 1
  const goBackToStep1 = () => {
    setSignupStep(1);
    setFormSubmitted(false);
  };
  
  // Handle postal code change for Step 1
  const handleKodePosChangeStep1 = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '').substring(0, 5);
    setKodePos(newValue);
    
    handleKodePosLookup(newValue, {
      setKelurahan,
      setKecamatan,
      setKota,
      setProvinsi,
      errorKey: 'kodePos'
    });
  };
  
  // Handle postal code change for Step 2
  const handleKodePosChangeStep2 = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '').substring(0, 5);
    setKodePosStep2(newValue);
    
    handleKodePosLookup(newValue, {
      setKelurahan: setKelurahanStep2,
      setKecamatan: setKecamatanStep2,
      setKota: setKotaStep2,
      setProvinsi: setProvinsiStep2,
      errorKey: 'kodePosStep2'
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Side */}
      <div className="w-full md:w-1/2 overflow-y-auto">
        {signupStep === 1 ? (
          <PersonalDataForm 
            formData={{ 
              name, nik, birthPlace, birthDate, gender, bloodType, 
              address, rt, rw, kodePos, kelurahan, kecamatan, kota, provinsi 
            }}
            setters={{ 
              setName, setNik, setBirthPlace, setBirthDate, setGender, setBloodType,
              setAddress, setRt, setRw, setKodePos, setKelurahan, setKecamatan, setKota, setProvinsi
            }}
            formErrors={formErrors}
            formSubmitted={formSubmitted}
            isLoadingData={isLoadingData}
            handleSubmit={handleStep1Submit}
            handleKodePosChange={handleKodePosChangeStep1}
          />
        ) : (
          <AddressContactForm 
            formData={{ 
              alamatDomisili, rtDomisili, rwDomisili, kodePosStep2, 
              kelurahanStep2, kecamatanStep2, kotaStep2, provinsiStep2,
              email, nomorHp, aktivasi, kataSandi, konfirmasiKataSandi, persetujuanSyarat
            }}
            setters={{ 
              setAlamatDomisili, setRtDomisili, setRwDomisili, setKodePosStep2,
              setKelurahanStep2, setKecamatanStep2, setKotaStep2, setProvinsiStep2,
              setEmail, setNomorHp, setAktivasi, setKataSandi, setKonfirmasiKataSandi, setPersetujuanSyarat
            }}
            passwordVisibility={{
              showPassword, setShowPassword,
              showConfirmPassword, setShowConfirmPassword
            }}
            formErrors={formErrors}
            formSubmitted={formSubmitted}
            isLoadingData={isLoadingData}
            goBackToStep1={goBackToStep1}
            handleSubmit={handleStep2Submit}
            handleKodePosChange={handleKodePosChangeStep2}
          />
        )}
      </div>
      
      {/* Right side - Blue banner */}
      <div className="hidden md:flex md:w-1/2 bg-blue-900 justify-center items-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {signupStep === 1 ? "Gabung Sekarang" : "Satu Langkah Lagi"}
          </h2>
          <p className="text-white text-sm mb-6">
            {signupStep === 1 
              ? "Lengkapi data diri anda sesuai KTP" 
              : "Lengkapi alamat dan kontak anda"}
          </p>
          
          <div className="flex justify-center space-x-2 mb-8">
            <div className={`w-3 h-3 rounded-full ${signupStep === 1 ? 'bg-white' : 'bg-white/50'}`}></div>
            <div className={`w-3 h-3 rounded-full ${signupStep === 2 ? 'bg-white' : 'bg-white/50'}`}></div>
          </div>
          
          <button
            type="button"
            className="inline-block py-2 px-6 border border-white rounded-full text-sm font-medium text-white hover:bg-white hover:text-blue-800 transition-colors"
            onClick={() => router.push('/login')}
          >
            Sudah punya akun? Masuk
          </button>
        </div>
      </div>
      
      {/* Mobile-only footer for login link */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-100 p-4 text-center border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Sudah punya akun?{" "}
          <button 
            type="button"
            className="text-blue-800 font-medium"
            onClick={() => router.push('/login')}
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;