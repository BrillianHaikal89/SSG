// src/utils/validators.js

// Validate Step 1 form fields
export const validateStep1 = (formData) => {
    const { name, nik, birthPlace, birthDate, gender, bloodType, address, rt, rw } = formData;
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
    if (!bloodType) errors.bloodType = 'Golongan darah wajib dipilih';
    if (!address.trim()) errors.address = 'Alamat wajib diisi';
    if (!rt.trim()) errors.rt = 'RT wajib diisi';
    if (!rw.trim()) errors.rw = 'RW wajib diisi';

    return errors;
};

// Validate Step 2 form fields
export const validateStep2 = (formData) => {
    const {
        postalCode,
        kelurahan,
        kecamatan,
        city,
        province,
        phoneSignup,
        passwordSignup,
        confirmPassword,
        termsAccepted
    } = formData;

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

    return errors;
};