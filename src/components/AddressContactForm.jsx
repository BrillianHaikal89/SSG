import React from 'react';
import FormField from './FormField';
import PasswordField from './PasswordField';
import InfoAlert from './InfoAlert';
import KodePosForm from './KodePosForm';

const AddressContactForm = ({ 
  formData, 
  setters, 
  passwordVisibility,
  formErrors, 
  formSubmitted, 
  isLoadingData,
  goBackToStep1,
  handleSubmit
}) => {
  const { 
    kodePos, kelurahan, kecamatan, kota, provinsi,
    nomorTelepon, kataSandi, konfirmasiKataSandi, persetujuanSyarat
  } = formData;
  
  const { 
    setKodePos, setKelurahan, setKecamatan, setKota, setProvinsi,
    setNomorTelepon, setKataSandi, setKonfirmasiKataSandi, setPersetujuanSyarat
  } = setters;
  
  const { 
    showPassword, setShowPassword, 
    showConfirmPassword, setShowConfirmPassword 
  } = passwordVisibility;

  // Fungsi untuk cek apakah field alamat harus dibaca saja
  // Jangan set read-only jika nilai kosong
  const isFieldReadOnly = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <InfoAlert message="Masukkan kode pos untuk mengisi data kelurahan, kecamatan, kota, dan provinsi secara otomatis." />
      
      {/* Address Section */}
      <div className="mb-4">
        <KodePosForm
          kodePos={kodePos}
          setKodePos={setKodePos}
          setKelurahan={setKelurahan}
          setKecamatan={setKecamatan}
          setKota={setKota}
          setProvinsi={setProvinsi}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="kelurahan"
            label="Kelurahan"
            type="text"
            value={kelurahan}
            onChange={(e) => setKelurahan(e.target.value)}
            placeholder="Kelurahan"
            formSubmitted={formSubmitted}
            formErrors={formErrors}
            // Biarkan field dapat diedit meskipun terisi otomatis
            readOnly={false}
            additionalClassName={isFieldReadOnly(kelurahan) ? "bg-gray-50" : ""}
          />
          
          <FormField
            id="kecamatan"
            label="Kecamatan"
            type="text"
            value={kecamatan}
            onChange={(e) => setKecamatan(e.target.value)}
            placeholder="Kecamatan"
            formSubmitted={formSubmitted}
            formErrors={formErrors}
            // Biarkan field dapat diedit meskipun terisi otomatis
            readOnly={false}
            additionalClassName={isFieldReadOnly(kecamatan) ? "bg-gray-50" : ""}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="kota"
            label="Kota/Kabupaten"
            type="text"
            value={kota}
            onChange={(e) => setKota(e.target.value)}
            placeholder="Kota/Kabupaten"
            formSubmitted={formSubmitted}
            formErrors={formErrors}
            // Biarkan field dapat diedit meskipun terisi otomatis
            readOnly={false}
            additionalClassName={isFieldReadOnly(kota) ? "bg-gray-50" : ""}
          />
          
          <FormField
            id="provinsi"
            label="Provinsi"
            type="text"
            value={provinsi}
            onChange={(e) => setProvinsi(e.target.value)}
            placeholder="Provinsi"
            formSubmitted={formSubmitted}
            formErrors={formErrors}
            // Biarkan field dapat diedit meskipun terisi otomatis
            readOnly={false}
            additionalClassName={isFieldReadOnly(provinsi) ? "bg-gray-50" : ""}
          />
        </div>
      </div>
      
      {/* Divider between Postal Code and Contact Data */}
      <div className="border-t border-gray-300 my-4"></div>
      
      {/* Contact Data Section */}
      <div className="mt-4">
        <h3 className="text-md font-medium text-gray-700 mb-3">Informasi Kontak</h3>
        
        <FormField
          id="nomorTelepon"
          label="Nomor Telepon"
          type="tel"
          value={nomorTelepon}
          onChange={(e) => setNomorTelepon(e.target.value)}
          placeholder="Contoh: 08123456789"
          formSubmitted={formSubmitted}
          formErrors={formErrors}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <PasswordField
            id="kataSandi"
            label="Kata Sandi"
            value={kataSandi}
            onChange={(e) => setKataSandi(e.target.value)}
            placeholder="Minimal 8 karakter"
            isVisible={showPassword}
            setIsVisible={setShowPassword}
            formSubmitted={formSubmitted}
            formErrors={formErrors}
          />
          
          <PasswordField
            id="konfirmasiKataSandi"
            label="Konfirmasi Kata Sandi"
            value={konfirmasiKataSandi}
            onChange={(e) => setKonfirmasiKataSandi(e.target.value)}
            placeholder="Ulangi kata sandi"
            isVisible={showConfirmPassword}
            setIsVisible={setShowConfirmPassword}
            formSubmitted={formSubmitted}
            formErrors={formErrors}
          />
        </div>
      </div>
      
      <div className="flex items-start my-3">
        <div className="flex items-center h-5">
          <input
            id="persetujuanSyarat"
            name="persetujuanSyarat"
            type="checkbox"
            checked={persetujuanSyarat}
            onChange={(e) => setPersetujuanSyarat(e.target.checked)}
            className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
          />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="persetujuanSyarat" className="font-medium text-gray-700">
            Saya menyetujui <a href="#" className="text-blue-800">syarat dan ketentuan</a>
          </label>
          {formSubmitted && formErrors.persetujuanSyarat && (
            <p className="mt-1 text-xs text-red-500">{formErrors.persetujuanSyarat}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-3 pt-2">
        <button
          type="button"
          onClick={goBackToStep1}
          className="py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 md:w-1/3"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={isLoadingData}
          className="w-full md:w-2/3 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-70"
        >
          {isLoadingData ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          ) : (
            "Daftar Sekarang"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressContactForm;