import React from 'react';
import FormField from './FormField';
import FormFieldWithTooltip from './FormFieldWithTooltip';
import InfoAlert from './InfoAlert';

const PersonalDataForm = ({ 
  formData, 
  setters, 
  formErrors, 
  formSubmitted, 
  handleSubmit 
}) => {
  const { name, nik, birthPlace, birthDate, gender, bloodType, address, rt, rw } = formData;
  const { 
    setName, setNik, setBirthPlace, setBirthDate, 
    setGender, setBloodType, setAddress, setRt, setRw 
  } = setters;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <InfoAlert message="Pastikan data yang Anda masukkan sesuai dengan KTP untuk memudahkan proses verifikasi." />
      
      <FormFieldWithTooltip
        id="name"
        label="Nama Lengkap"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama sesuai KTP"
        tooltip="Gunakan nama lengkap Anda seperti yang tertera pada kartu identitas, tanpa singkatan."
        formSubmitted={formSubmitted}
        formErrors={formErrors}
      />
      
      <FormFieldWithTooltip
        id="nik"
        label="NIK"
        type="text"
        value={nik}
        onChange={(e) => setNik(e.target.value)}
        placeholder="Nomor NIK"
        tooltip="Nomor Induk Kependudukan (NIK) terdiri dari 16 digit yang tertera pada kartu identitas Anda."
        maxLength={16}
        formSubmitted={formSubmitted}
        formErrors={formErrors}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="birthPlace"
          label="Tempat Lahir"
          type="text"
          value={birthPlace}
          onChange={(e) => setBirthPlace(e.target.value)}
          placeholder="Tempat Lahir"
          formSubmitted={formSubmitted}
          formErrors={formErrors}
        />
        
        <FormField
          id="birthDate"
          label="Tanggal Lahir"
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
          label="Jenis Kelamin"
          type="select"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder=""
          formSubmitted={formSubmitted}
          formErrors={formErrors}
          options={[
            { value: "", label: "Pilih Jenis Kelamin" },
            { value: "L", label: "Laki-laki" },
            { value: "P", label: "Perempuan" }
          ]}
        />
        
        {/* Blood Type field */}
        <FormField
          id="bloodType"
          label="Golongan Darah"
          type="select"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          placeholder=""
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
        label="Alamat (sesuai KTP)"
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
          onChange={(e) => setRt(e.target.value)}
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
          onChange={(e) => setRw(e.target.value)}
          placeholder="RW"
          maxLength={3}
          formSubmitted={formSubmitted}
          formErrors={formErrors}
        />
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
  );
};

export default PersonalDataForm;