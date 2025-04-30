import React, { useState } from 'react';
import FormField from './FormField';
import InfoAlert from './InfoAlert';

const PersonalDataForm = ({ 
  formData, 
  setters, 
  formErrors, 
  formSubmitted, 
  isLoadingData,
  handleSubmit,
  handleKodePosChange
}) => {
  const { 
    name, nik, birthPlace, birthDate, gender, bloodType, 
    address, rt, rw, kodePos, kelurahan, kecamatan, kota, provinsi 
  } = formData;
  
  const { 
    setName, setNik, setBirthPlace, setBirthDate, setGender, setBloodType,
    setAddress, setRt, setRw, setKodePos, setKelurahan, setKecamatan, setKota, setProvinsi
  } = setters;

  // State untuk modal pencarian
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handler untuk mengubah nama menjadi uppercase
  const handleNameChange = (e) => {
    setName(e.target.value.toUpperCase());
  };

  // Handler untuk mengubah alamat menjadi uppercase
  const handleAddressChange = (e) => {
    setAddress(e.target.value.toUpperCase());
  };
  
  // Membuka modal pencarian
  const openSearchModal = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchModal(true);
  };
  
  // Handle pencarian alamat
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // Simulasi pencarian - dalam implementasi nyata, ini akan memanggil API
    setTimeout(() => {
      // Data contoh - dalam kasus nyata, ini akan datang dari respons API
      const mockResults = [
        { kelurahan: 'KEBON KOSONG', kecamatan: 'KEMAYORAN', kota: 'JAKARTA PUSAT', provinsi: 'DKI JAKARTA', kodePos: '10630' },
        { kelurahan: 'KEBON MELATI', kecamatan: 'TANAH ABANG', kota: 'JAKARTA PUSAT', provinsi: 'DKI JAKARTA', kodePos: '10230' },
        { kelurahan: 'KEBON JERUK', kecamatan: 'KEBON JERUK', kota: 'JAKARTA BARAT', provinsi: 'DKI JAKARTA', kodePos: '11530' },
      ].filter(item => {
        const term = searchTerm.toUpperCase();
        // Cari berdasarkan kelurahan, kecamatan, atau kota (diutamakan dalam urutan ini)
        return (
          item.kelurahan.toUpperCase().includes(term) || 
          item.kecamatan.toUpperCase().includes(term) || 
          item.kota.toUpperCase().includes(term)
        );
      });
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 800);
  };
  
  // Mengisi data dari hasil pencarian
  const fillAddressData = (result) => {
    setKelurahan(result.kelurahan);
    setKecamatan(result.kecamatan);
    setKota(result.kota);
    setProvinsi(result.provinsi);
    setKodePos(result.kodePos);
    setShowSearchModal(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Daftar - Data Pribadi</h1>
        
        {/* Progress Indicator */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-full max-w-md relative">
            <div className="h-1 bg-gray-300 absolute top-1/2 left-0 right-0 -translate-y-1/2"></div>
            <div className="flex justify-between">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center z-10">1</div>
              <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center z-10">2</div>
            </div>
          </div>
          <div className="flex justify-between w-full max-w-md mt-1 text-xs">
            <span className="text-blue-900 font-medium">Data Pribadi</span>
            <span className="text-gray-400">Data Alamat</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <InfoAlert 
            message="Pastikan Data yang Anda masukkan sesuai dengan KTP dan memudahkan proses verifikasi."
            bgColor="bg-blue-50"
            textColor="text-blue-800"
          />

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <FormField
              id="name"
              label="NAMA LENGKAP"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Nama sesuai KTP"
              formSubmitted={formSubmitted}
              formErrors={formErrors}
            />
            
            <FormField
              id="nik"
              label="NIK"
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="Nomor NIK"
              maxLength={16}
              formSubmitted={formSubmitted}
              formErrors={formErrors}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="birthPlace"
                label="TEMPAT LAHIR"
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="Tempat Lahir"
                formSubmitted={formSubmitted}
                formErrors={formErrors}
              />
              
              <FormField
                id="birthDate"
                label="TANGGAL LAHIR"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder=""
                formSubmitted={formSubmitted}
                formErrors={formErrors}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="gender"
                label="JENIS KELAMIN"
                type="select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                options={[
                  { value: "", label: "Pilih Jenis Kelamin" },
                  { value: "L", label: "Laki-laki" },
                  { value: "P", label: "Perempuan" }
                ]}
              />
              
              <FormField
                id="bloodType"
                label="GOLONGAN DARAH"
                type="select"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                options={[
                  { value: "", label: "Pilih Golongan Darah" },
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                  { value: "AB", label: "AB" },
                  { value: "O", label: "O" },
                  { value: "unknown", label: "Tidak Tahu" }
                ]}
              />
            </div>
            
            <FormField
              id="address"
              label="ALAMAT (SESUAI KTP)"
              type="textarea"
              value={address}
              onChange={handleAddressChange}
              placeholder="Alamat Lengkap"
              formSubmitted={formSubmitted}
              formErrors={formErrors}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="rt"
                label="RT"
                type="text"
                value={rt}
                onChange={(e) => setRt(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="RT"
                maxLength={3}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
              />
              
              <FormField
                id="rw"
                label="RW"
                type="text"
                value={rw}
                onChange={(e) => setRw(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="RW"
                maxLength={3}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
              />
            </div>
            
            <div className="relative mb-3">
              <FormField
                id="kodePos"
                label="KODE POS"
                type="text"
                placeholder="Kode Pos KTP"
                value={kodePos}
                onChange={handleKodePosChange}
                maxLength={5}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
              />
              <button
                type="button"
                onClick={() => openSearchModal()}
                className="absolute right-3 top-9 text-blue-700 hover:text-blue-900 p-1 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {isLoadingData && (
              <div className="mb-3 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-md border border-gray-100 flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mencari data kode pos...
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="kelurahan"
                label="KELURAHAN/DESA"
                type="text"
                placeholder="Kelurahan/Desa"
                value={kelurahan}
                onChange={(e) => setKelurahan(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={kelurahan ? true : false}
                additionalClassName={kelurahan ? "bg-gray-100" : ""}
              />
              
              <FormField
                id="kecamatan"
                label="KECAMATAN"
                type="text"
                placeholder="Kecamatan"
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={kecamatan ? true : false}
                additionalClassName={kecamatan ? "bg-gray-100" : ""}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="kota"
                label="KABUPATEN/KOTA"
                type="text"
                placeholder="Kabupaten/Kota"
                value={kota}
                onChange={(e) => setKota(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={kota ? true : false}
                additionalClassName={kota ? "bg-gray-100" : ""}
              />
              
              <FormField
                id="provinsi"
                label="PROVINSI"
                type="text"
                placeholder="Provinsi"
                value={provinsi}
                onChange={(e) => setProvinsi(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={provinsi ? true : false}
                additionalClassName={provinsi ? "bg-gray-100" : ""}
              />
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-md font-medium hover:bg-blue-800 transition-colors"
              >
                Lanjutkan
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Modal Pencarian */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Cari Alamat
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-2 text-sm text-gray-600">
              <p>Masukkan kelurahan/desa, kecamatan, atau kabupaten/kota</p>
            </div>
            
            <div className="flex mb-4">
              <input
                type="text"
                className="flex-grow border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cari alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-900 text-white px-4 py-2 rounded-r-md hover:bg-blue-800"
              >
                Cari
              </button>
            </div>
            
            <div className="mt-4 max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="flex justify-center py-4">
                  <svg className="animate-spin h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : searchResults.length === 0 && searchTerm ? (
                <p className="text-center text-gray-500 py-4">Tidak ada data yang ditemukan</p>
              ) : (
                <ul className="divide-y">
                  {searchResults.map((result, index) => (
                    <li key={index} className="py-2">
                      <button
                        onClick={() => fillAddressData(result)}
                        className="w-full text-left hover:bg-gray-50 p-2 rounded"
                      >
                        <div className="font-medium">{result.kelurahan}</div>
                        <div className="text-sm text-gray-600">
                          <span>{result.kecamatan}, </span>
                          <span>{result.kota}, </span>
                          <span>{result.provinsi} - {result.kodePos}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDataForm;