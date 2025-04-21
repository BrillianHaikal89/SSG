import React from 'react';
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
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setAddress(e.target.value)}
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
    </div>
  );
};

export default PersonalDataForm;