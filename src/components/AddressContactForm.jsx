import React from 'react';
import FormField from './FormField';
import InfoAlert from './InfoAlert';

const AddressContactForm = ({ 
  formData, 
  setters, 
  passwordVisibility,
  formErrors, 
  formSubmitted, 
  isLoadingData,
  goBackToStep1,
  handleSubmit,
  handleKodePosChange,
  addressFromStep1,
  handleSameAddressChange
}) => {
  const { 
    alamatDomisili, rtDomisili, rwDomisili, kodePosStep2, 
    kelurahanStep2, kecamatanStep2, kotaStep2, provinsiStep2,
    email, nomorHp, kataSandi, konfirmasiKataSandi, persetujuanSyarat,
    isSameAddress
  } = formData;
  
  const { 
    setAlamatDomisili, setRtDomisili, setRwDomisili, setKodePosStep2,
    setKelurahanStep2, setKecamatanStep2, setKotaStep2, setProvinsiStep2,
    setEmail, setNomorHp, setKataSandi, setKonfirmasiKataSandi, setPersetujuanSyarat,
    setIsSameAddress
  } = setters;
  
  const { 
    showPassword, setShowPassword, 
    showConfirmPassword, setShowConfirmPassword 
  } = passwordVisibility;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Daftar - Data Alamat</h1>
        
        {/* Progress Indicator */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-full max-w-md relative">
            <div className="h-1 bg-gray-300 absolute top-1/2 left-0 right-0 -translate-y-1/2"></div>
            <div className="flex justify-between">
              <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center z-10">1</div>
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center z-10">2</div>
            </div>
          </div>
          <div className="flex justify-between w-full max-w-md mt-1 text-xs">
            <span className="text-gray-400">Data Pribadi</span>
            <span className="text-blue-900 font-medium">Data Alamat</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <InfoAlert 
            message="Masukkan kode pos untuk mengisi data kelurahan, kecamatan, kota dan provinsi secara otomatis."
            bgColor="bg-blue-50"
            textColor="text-blue-800"
          />

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Same Address Checkbox */}
            <div className="flex items-start mb-2">
              <input
                id="isSameAddress"
                type="checkbox"
                checked={isSameAddress}
                onChange={handleSameAddressChange}
                className="mr-2 mt-1"
              />
              <label htmlFor="isSameAddress" className="text-sm">
                Alamat domisili sama dengan alamat KTP
              </label>
            </div>

            <FormField
              id="alamatDomisili"
              label="ALAMAT DOMISILI"
              type="textarea"
              placeholder="Alamat Sesuai Domisili"
              value={alamatDomisili}
              onChange={(e) => setAlamatDomisili(e.target.value)}
              formSubmitted={formSubmitted}
              formErrors={formErrors}
              readOnly={isSameAddress}
              additionalClassName={isSameAddress ? "bg-gray-100" : ""}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="rtDomisili"
                label="RT"
                type="text"
                placeholder="RT Domisili"
                value={rtDomisili}
                onChange={(e) => setRtDomisili(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={isSameAddress}
                additionalClassName={isSameAddress ? "bg-gray-100" : ""}
              />
              
              <FormField
                id="rwDomisili"
                label="RW"
                type="text"
                placeholder="RW Domisili"
                value={rwDomisili}
                onChange={(e) => setRwDomisili(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={isSameAddress}
                additionalClassName={isSameAddress ? "bg-gray-100" : ""}
              />
            </div>
            
            <FormField
              id="kodePosStep2"
              label="KODE POS"
              type="text"
              placeholder="Kode Pos Sesuai Domisili"
              value={kodePosStep2}
              onChange={handleKodePosChange}
              maxLength={5}
              formSubmitted={formSubmitted}
              formErrors={formErrors}
              readOnly={isSameAddress}
              additionalClassName={isSameAddress ? "bg-gray-100" : ""}
            />
            
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
                id="kelurahanStep2"
                label="KELURAHAN/DESA"
                type="text"
                placeholder="Kelurahan/Desa"
                value={kelurahanStep2}
                onChange={(e) => setKelurahanStep2(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={kelurahanStep2 || isSameAddress}
                additionalClassName={(kelurahanStep2 || isSameAddress) ? "bg-gray-100" : ""}
              />
              
              <FormField
                id="kecamatanStep2"
                label="KECAMATAN"
                type="text"
                placeholder="Kecamatan"
                value={kecamatanStep2}
                onChange={(e) => setKecamatanStep2(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={kecamatanStep2 || isSameAddress}
                additionalClassName={(kecamatanStep2 || isSameAddress) ? "bg-gray-100" : ""}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="kotaStep2"
                label="KABUPATEN/KOTA"
                type="text"
                placeholder="Kabupaten/Kota"
                value={kotaStep2}
                onChange={(e) => setKotaStep2(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={kotaStep2 || isSameAddress}
                additionalClassName={(kotaStep2 || isSameAddress) ? "bg-gray-100" : ""}
              />
              
              <FormField
                id="provinsiStep2"
                label="PROVINSI"
                type="text"
                placeholder="Provinsi"
                value={provinsiStep2}
                onChange={(e) => setProvinsiStep2(e.target.value)}
                formSubmitted={formSubmitted}
                formErrors={formErrors}
                readOnly={provinsiStep2 || isSameAddress}
                additionalClassName={(provinsiStep2 || isSameAddress) ? "bg-gray-100" : ""}
              />
            </div>

            <div className="border-t border-gray-200 my-6 pt-4">
              <h2 className="text-base font-medium mb-2">Data Kontak</h2>
            </div>
            
            <FormField
              id="email"
              label="EMAIL"
              type="email"
              placeholder="Email Aktif"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              formSubmitted={formSubmitted}
              formErrors={formErrors}
            />
            
            <FormField
              id="nomorHp"
              label="NOMOR HP"
              type="tel"
              placeholder="Nomor HP"
              value={nomorHp}
              onChange={(e) => setNomorHp(e.target.value.replace(/\D/g, '').slice(0, 13))}
              formSubmitted={formSubmitted}
              formErrors={formErrors}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-3">
                <label htmlFor="kataSandi" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  KATA SANDI <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="kataSandi"
                    type={showPassword ? "text" : "password"}
                    value={kataSandi}
                    onChange={(e) => setKataSandi(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${formSubmitted && formErrors.kataSandi ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm pr-10`}
                    placeholder="Kata Sandi"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {formSubmitted && formErrors.kataSandi && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.kataSandi}</p>
                )}
              </div>
              
              <div className="mb-3">
                <label htmlFor="konfirmasiKataSandi" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  KONFIRMASI KATA SANDI <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="konfirmasiKataSandi"
                    type={showConfirmPassword ? "text" : "password"}
                    value={konfirmasiKataSandi}
                    onChange={(e) => setKonfirmasiKataSandi(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${formSubmitted && formErrors.konfirmasiKataSandi ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm pr-10`}
                    placeholder="Konfirmasi Kata Sandi"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showConfirmPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {formSubmitted && formErrors.konfirmasiKataSandi && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.konfirmasiKataSandi}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start mt-4">
              <input
                id="persetujuanSyarat"
                type="checkbox"
                checked={persetujuanSyarat}
                onChange={(e) => setPersetujuanSyarat(e.target.checked)}
                className="mr-2 mt-1"
              />
              <label htmlFor="persetujuanSyarat" className="text-sm">
                Saya menyetujui <a href="#" className="text-blue-600">Syarat & Ketentuan</a> serta <a href="#" className="text-blue-600">Kebijakan Privasi</a>
              </label>
            </div>
            {formSubmitted && formErrors.persetujuanSyarat && (
              <p className="mt-1 text-xs text-red-500">{formErrors.persetujuanSyarat}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                onClick={goBackToStep1}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Kembali
              </button>
              
              <button
                type="submit"
                disabled={isLoadingData}
                className="w-full bg-blue-900 text-white py-3 rounded-md font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                Daftar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressContactForm;