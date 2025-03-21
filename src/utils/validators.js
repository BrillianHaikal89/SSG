/**
<<<<<<< HEAD
 * Validates the first step of the signup form (Personal Data)
 * @param {Object} data - Form data for step 1
 * @returns {Object} - Validation errors (empty if no errors)
=======
 * Memvalidasi langkah pertama form pendaftaran (Data Pribadi)
 * @param {Object} data - Data formulir untuk langkah 1
 * @returns {Object} - Error validasi (kosong jika tidak ada error)
>>>>>>> e4729c3d41ac09e84dc10988fd1e49c3ab87948a
 */
export function validateStep1(data) {
    const errors = {};

<<<<<<< HEAD
    // Name validation
    if (!data.name || data.name.trim() === '') {
        errors.name = "Name is required";
    } else if (data.name.length < 3) {
        errors.name = "Name must be at least 3 characters";
    }

    // NIK validation
    if (!data.nik || data.nik.trim() === '') {
        errors.nik = "NIK is required";
    } else if (!/^\d{16}$/.test(data.nik)) {
        errors.nik = "NIK must be exactly 16 digits";
    }

    // Birth Place validation
    if (!data.birthPlace || data.birthPlace.trim() === '') {
        errors.birthPlace = "Birth place is required";
    }

    // Birth Date validation
    if (!data.birthDate) {
        errors.birthDate = "Birth date is required";
    } else {
        const birthDate = new Date(data.birthDate);
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 100); // 100 years ago

        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 17); // Must be at least 17 years old

        if (birthDate < minDate || birthDate > maxDate) {
            errors.birthDate = "Birth date must be between 17 and 100 years ago";
        }
    }

    // Gender validation
    if (!data.gender) {
        errors.gender = "Gender is required";
    }

    // Blood Type validation
    if (!data.bloodType) {
        errors.bloodType = "Blood type is required";
    }

    // Address validation
    if (!data.address || data.address.trim() === '') {
        errors.address = "Address is required";
    } else if (data.address.length < 5) {
        errors.address = "Address must be at least 5 characters";
    }

    // RT validation
    if (!data.rt || data.rt.trim() === '') {
        errors.rt = "RT is required";
    } else if (!/^\d{1,3}$/.test(data.rt)) {
        errors.rt = "RT must be 1-3 digits";
    }

    // RW validation
    if (!data.rw || data.rw.trim() === '') {
        errors.rw = "RW is required";
    } else if (!/^\d{1,3}$/.test(data.rw)) {
        errors.rw = "RW must be 1-3 digits";
=======
    // Validasi Nama
    if (!data.name || data.name.trim() === '') {
        errors.name = "Nama wajib diisi";
    } else if (data.name.length < 3) {
        errors.name = "Nama minimal 3 karakter";
    }

    // Validasi NIK
    if (!data.nik || data.nik.trim() === '') {
        errors.nik = "NIK wajib diisi";
    } else if (!/^\d{16}$/.test(data.nik)) {
        errors.nik = "NIK harus tepat 16 digit";
    }

    // Validasi Tempat Lahir
    if (!data.birthPlace || data.birthPlace.trim() === '') {
        errors.birthPlace = "Tempat lahir wajib diisi";
    }

    // Validasi Tanggal Lahir
    if (!data.birthDate) {
        errors.birthDate = "Tanggal lahir wajib diisi";
    } else {
        const birthDate = new Date(data.birthDate);
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 100); // 100 tahun yang lalu

        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 17); // Minimal berumur 17 tahun

        if (birthDate < minDate || birthDate > maxDate) {
            errors.birthDate = "Tanggal lahir harus antara 17 hingga 100 tahun yang lalu";
        }
    }

    // Validasi Jenis Kelamin
    if (!data.gender) {
        errors.gender = "Jenis kelamin wajib diisi";
    }

    // Validasi Golongan Darah
    if (!data.bloodType) {
        errors.bloodType = "Golongan darah wajib diisi";
    }

    // Validasi Alamat
    if (!data.address || data.address.trim() === '') {
        errors.address = "Alamat wajib diisi";
    } else if (data.address.length < 5) {
        errors.address = "Alamat minimal 5 karakter";
    }

    // Validasi RT
    if (!data.rt || data.rt.trim() === '') {
        errors.rt = "RT wajib diisi";
    } else if (!/^\d{1,3}$/.test(data.rt)) {
        errors.rt = "RT harus berupa 1-3 digit angka";
    }

    // Validasi RW
    if (!data.rw || data.rw.trim() === '') {
        errors.rw = "RW wajib diisi";
    } else if (!/^\d{1,3}$/.test(data.rw)) {
        errors.rw = "RW harus berupa 1-3 digit angka";
>>>>>>> e4729c3d41ac09e84dc10988fd1e49c3ab87948a
    }

    return errors;
}

/**
<<<<<<< HEAD
 * Validates the second step of the signup form (Address & Contact)
 * @param {Object} data - Form data for step 2
 * @returns {Object} - Validation errors (empty if no errors)
=======
 * Memvalidasi langkah kedua form pendaftaran (Alamat & Kontak)
 * @param {Object} data - Data formulir untuk langkah 2
 * @returns {Object} - Error validasi (kosong jika tidak ada error)
>>>>>>> e4729c3d41ac09e84dc10988fd1e49c3ab87948a
 */
export function validateStep2(data) {
    const errors = {};

<<<<<<< HEAD
    // Postal Code validation
    if (!data.postalCode || data.postalCode.trim() === '') {
        errors.kodePos = "Postal code is required";
    } else if (!/^\d{5}$/.test(data.postalCode)) {
        errors.kodePos = "Postal code must be 5 digits";
    }

    // Kelurahan validation
    if (!data.kelurahan || data.kelurahan.trim() === '') {
        errors.kelurahan = "Kelurahan is required";
    }

    // Kecamatan validation
    if (!data.kecamatan || data.kecamatan.trim() === '') {
        errors.kecamatan = "Kecamatan is required";
    }

    // City validation
    if (!data.city || data.city.trim() === '') {
        errors.kota = "City is required";
    }

    // Province validation
    if (!data.province || data.province.trim() === '') {
        errors.provinsi = "Province is required";
    }

    // Phone validation
    if (!data.phoneSignup || data.phoneSignup.trim() === '') {
        errors.nomorTelepon = "Phone number is required";
    } else if (!/^08\d{8,11}$/.test(data.phoneSignup)) {
        errors.nomorTelepon = "Phone number must start with 08 and have 10-13 digits";
    }

    // Password validation
    if (!data.passwordSignup || data.passwordSignup.trim() === '') {
        errors.kataSandi = "Password is required";
    } else if (data.passwordSignup.length < 8) {
        errors.kataSandi = "Password must be at least 8 characters";
    }

    // Confirm Password validation
    if (!data.confirmPassword || data.confirmPassword.trim() === '') {
        errors.konfirmasiKataSandi = "Please confirm your password";
    } else if (data.confirmPassword !== data.passwordSignup) {
        errors.konfirmasiKataSandi = "Passwords do not match";
    }

    // Terms acceptance validation
    if (!data.termsAccepted) {
        errors.persetujuanSyarat = "You must accept the terms and conditions";
=======
    // Validasi Kode Pos
    if (!data.postalCode || data.postalCode.trim() === '') {
        errors.kodePos = "Kode pos wajib diisi";
    } else if (!/^\d{5}$/.test(data.postalCode)) {
        errors.kodePos = "Kode pos harus 5 digit angka";
    }

    // Validasi Kelurahan
    if (!data.kelurahan || data.kelurahan.trim() === '') {
        errors.kelurahan = "Kelurahan wajib diisi";
    }

    // Validasi Kecamatan
    if (!data.kecamatan || data.kecamatan.trim() === '') {
        errors.kecamatan = "Kecamatan wajib diisi";
    }

    // Validasi Kota
    if (!data.city || data.city.trim() === '') {
        errors.kota = "Kota/Kabupaten wajib diisi";
    }

    // Validasi Provinsi
    if (!data.province || data.province.trim() === '') {
        errors.provinsi = "Provinsi wajib diisi";
    }

    // Validasi Nomor Telepon
    if (!data.phoneSignup || data.phoneSignup.trim() === '') {
        errors.nomorTelepon = "Nomor telepon wajib diisi";
    } else if (!/^08\d{8,11}$/.test(data.phoneSignup)) {
        errors.nomorTelepon = "Nomor telepon harus diawali 08 dan memiliki 10-13 digit";
    }

    // Validasi Kata Sandi
    if (!data.passwordSignup || data.passwordSignup.trim() === '') {
        errors.kataSandi = "Kata sandi wajib diisi";
    } else if (data.passwordSignup.length < 8) {
        errors.kataSandi = "Kata sandi minimal 8 karakter";
    }

    // Validasi Konfirmasi Kata Sandi
    if (!data.confirmPassword || data.confirmPassword.trim() === '') {
        errors.konfirmasiKataSandi = "Konfirmasi kata sandi wajib diisi";
    } else if (data.confirmPassword !== data.passwordSignup) {
        errors.konfirmasiKataSandi = "Kata sandi tidak cocok";
    }

    // Validasi Persetujuan Syarat dan Ketentuan
    if (!data.termsAccepted) {
        errors.persetujuanSyarat = "Anda harus menyetujui syarat dan ketentuan";
>>>>>>> e4729c3d41ac09e84dc10988fd1e49c3ab87948a
    }

    return errors;
}