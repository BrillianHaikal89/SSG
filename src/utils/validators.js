/**
 * Validates the first step of the signup form (Personal Data)
 * @param {Object} data - Form data for step 1
 * @returns {Object} - Validation errors (empty if no errors)
 */
export function validateStep1(data) {
    const errors = {};

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
    }

    return errors;
}

/**
 * Validates the second step of the signup form (Address & Contact)
 * @param {Object} data - Form data for step 2
 * @returns {Object} - Validation errors (empty if no errors)
 */
export function validateStep2(data) {
    const errors = {};

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
    }

    return errors;
}