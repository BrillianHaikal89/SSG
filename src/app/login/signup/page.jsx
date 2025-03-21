"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Utilities
import { validateStep1, validateStep2 } from '../../../utils/validators';

// Create component wrappers to safely handle the additionalClassName issue
const SafeComponentWrapper = (Component) => {
  return function WrappedComponent(props) {
    // Ensure additionalClassName is always defined
    const safeProps = { 
      ...props, 
      additionalClassName: props.additionalClassName || '',
      className: props.className || ''
    };
    
    return <Component {...safeProps} />;
  };
};

// Dynamically import components with the wrapper
const ProgressIndicator = dynamic(() => 
  import('../../../components/ProgressIndicator').then(mod => SafeComponentWrapper(mod.default)), 
  { ssr: false }
);

const PersonalDataForm = dynamic(() => 
  import('../../../components/PersonalDataForm').then(mod => SafeComponentWrapper(mod.default)),
  { ssr: false }
);

const AddressContactForm = dynamic(() => 
  import('../../../components/AddressContactForm').then(mod => SafeComponentWrapper(mod.default)),
  { ssr: false }
);

const BannerSide = dynamic(() => 
  import('../../../components/BannerSide').then(mod => SafeComponentWrapper(mod.default)),
  { ssr: false }
);

const MobileFooter = dynamic(() => 
  import('../../../components/MobileFooter').then(mod => SafeComponentWrapper(mod.default)),
  { ssr: false }
);

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
  const [bloodType, setBloodType] = useState('');
  const [address, setAddress] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  
  // Signup form - Step 2 (Address & Contact)
  const [kodePos, setKodePos] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [konfirmasiKataSandi, setKonfirmasiKataSandi] = useState('');
  const [persetujuanSyarat, setPersetujuanSyarat] = useState(false);
  
  // Add fetchKodePos function
  const fetchKodePos = async (postalCode) => {
    if (!postalCode || postalCode.length !== 5) {
      return null;
    }
    
    setIsLoadingData(true);
    
    try {
      // Try the first API endpoint
      let response = await fetch(`http://localhost:3333/api/location/postal-code/${postalCode}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      // If first endpoint fails with 404, try alternative endpoint
      if (response.status === 404) {
        console.log('First endpoint returned 404, trying alternative endpoint');
        response = await fetch(`http://localhost:3333/api/lokasi/kode-pos/${postalCode}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        // Check for different possible response structures
        const locationData = data.data || data.result || data;
        
        if (locationData) {
          // Update form with location data, handling different possible field names
          setKelurahan(locationData.kelurahan_desa || locationData.kelurahan || locationData.desa || '');
          setKecamatan(locationData.kecamatan || '');
          setKota(locationData.kabupaten_kota || locationData.kota || locationData.kabupaten || '');
          setProvinsi(locationData.provinsi || '');
          return locationData;
        }
      } else {
        console.error('Error fetching postal code data:', response.status, response.statusText);
      }
      return null;
    } catch (error) {
      console.error('Error fetching postal code data:', error);
      return null;
    } finally {
      setIsLoadingData(false);
    }
  };
  
  // Handle postal code change
  const handleKodePosChange = async (e) => {
    const postalCode = e.target.value.trim();
    setKodePos(postalCode);
    
    // Only fetch data if the postal code is complete (5 digits)
    if (postalCode.length === 5) {
      try {
        const result = await fetchKodePos(postalCode);
        
        if (!result) {
          // If no data was found for this postal code, clear the location fields and show an error
          setKelurahan('');
          setKecamatan('');
          setKota('');
          setProvinsi('');
          setFormErrors(prev => ({
            ...prev,
            kodePos: "Kode pos tidak ditemukan. Silakan masukkan kode pos yang valid atau isi data lokasi secara manual."
          }));
        } else {
          // Clear any previous postal code error if the lookup was successful
          setFormErrors(prev => {
            const newErrors = {...prev};
            delete newErrors.kodePos;
            return newErrors;
          });
        }
      } catch (error) {
        console.error("Error in handleKodePosChange:", error);
        setFormErrors(prev => ({
          ...prev,
          kodePos: "Terjadi kesalahan saat mengambil data lokasi. Silakan isi data lokasi secara manual."
        }));
      }
    } else if (postalCode.length > 0 && postalCode.length < 5) {
      // Show a hint that kode pos should be 5 digits
      setFormErrors(prev => ({
        ...prev,
        kodePos: postalCode.length < 5 ? "Kode pos harus 5 digit." : null
      }));
      
      // Clear address fields if postal code is incomplete
      setKelurahan('');
      setKecamatan('');
      setKota('');
      setProvinsi('');
    } else {
      // Clear kodePos error if field is empty
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.kodePos;
        return newErrors;
      });
      
      // Clear address fields if postal code is empty
      setKelurahan('');
      setKecamatan('');
      setKota('');
      setProvinsi('');
    }
  };
  
  // Periksa apakah NIK sudah terdaftar
  const isNIKAlreadyRegistered = async (nikValue) => {
    try {
      // Call API untuk verifikasi NIK
      const response = await fetch('http://localhost:3333/api/users/check-nik', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ nik: nikValue }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.exists; // Return true jika NIK sudah terdaftar
      } else if (response.status === 400) {
        // Jika backend mengembalikan pesan error NIK sudah terdaftar
        const errorData = await response.json();
        return errorData.message && errorData.message.includes('NIK sudah terdaftar');
      }
      
      return false;
    } catch (error) {
      console.error('Error saat memeriksa NIK:', error);
      return false;
    }
  };
  
  // Handler form submission
  async function handleSignupStep1(e) {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validasi data dasar
    const baseErrors = validateStep1({
      name, nik, birthPlace, birthDate, gender, bloodType, address, rt, rw
    });
    
    // Validasi tambahan untuk NIK (cek apakah sudah terdaftar)
    let errors = { ...baseErrors };
   
   // Hanya cek NIK jika format sudah benar
   if (!baseErrors.nik) {
     try {
       const isNikRegistered = await isNIKAlreadyRegistered(nik);
       
       if (isNikRegistered) {
         errors.nik = "NIK ini sudah terdaftar. Silakan gunakan NIK lain atau login dengan NIK ini";
       }
     } catch (error) {
       // Tangani error saat pemeriksaan NIK
       console.error('Error saat memeriksa NIK:', error);
     }
   }
   
   setFormErrors(errors);
   
   if (Object.keys(errors).length === 0) {
     console.log('Data Pribadi tervalidasi, lanjut ke langkah 2');
     setSignupStep(2);
     setFormSubmitted(false);
   }
 }
 
 async function handleSignupStep2(e) {
   e.preventDefault();
   setFormSubmitted(true);
   
   // Validasi data langkah 2
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
     // Periksa NIK sekali lagi untuk mencegah race condition
     try {
       const isNikRegistered = await isNIKAlreadyRegistered(nik);
       if (isNikRegistered) {
         setSignupStep(1);
         setFormErrors({ nik: "NIK ini sudah terdaftar. Silakan gunakan NIK lain atau login dengan NIK ini" });
         return;
       }
       
       // Siapkan data pengguna lengkap
       const userData = {
         // Data langkah 1
         nama_lengkap: name,
         nik: nik,
         tempat_lahir: birthPlace,
         tanggal_lahir: birthDate,
         jenis_kelamin: gender === 'L' ? 'Laki-laki' : 'Perempuan',
         alamat: address,
         rt: rt,
         rw: rw,
         // Data langkah 2
         kode_pos: kodePos,
         kelurahan_desa: kelurahan,
         kecamatan: kecamatan,
         kabupaten_kota: kota,
         provinsi: provinsi,
         nomor_hp: nomorTelepon,
         password: kataSandi,
         golongan_darah: bloodType,
         // Nilai default untuk agama sesuai schema
         agama: 'Islam'
       };
       
       // Set loading state
       setIsLoadingData(true);
       
       // Kirim data ke server
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
         // Tampilkan pesan sukses
         alert('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.');
         
         // Redirect ke halaman login
         router.push('/login');
       } else {
         if (response.status === 400 && responseData.message && responseData.message.includes('NIK sudah terdaftar')) {
           setSignupStep(1);
           setFormErrors({ nik: "NIK ini sudah terdaftar. Silakan gunakan NIK lain atau login dengan NIK ini" });
         } else if (response.status === 400 && responseData.message && responseData.message.includes('Nomor HP sudah terdaftar')) {
           setFormErrors({ nomorTelepon: "Nomor HP ini sudah terdaftar. Silakan gunakan nomor HP lain atau login." });
         } else {
           // Tampilkan error server
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
 }
 
 // Fungsi untuk kembali ke langkah 1 tanpa menghapus data
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
         
         {/* Indikator progres pendaftaran */}
         {typeof window !== 'undefined' && <ProgressIndicator currentStep={signupStep} />}
         
         {/* Tampilkan error server jika ada */}
         {formErrors.server && (
           <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
             {formErrors.server}
           </div>
         )}
         
         {/* Langkah 1 Pendaftaran - Data Pribadi */}
         {signupStep === 1 && typeof window !== 'undefined' && (
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
         
         {/* Langkah 2 Pendaftaran - Data Alamat & Kontak */}
         {signupStep === 2 && typeof window !== 'undefined' && (
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
             postalCodeReadOnly={false}
             handleKodePosChange={handleKodePosChange}
             fetchKodePos={fetchKodePos}
           />
         )}
       </div>
     </div>
     
     {/* Banner Side */}
     {typeof window !== 'undefined' && <BannerSide signupStep={signupStep} />}
     
     {/* Mobile-only footer for login link */}
     {typeof window !== 'undefined' && <MobileFooter />}
   </div>
 );
}