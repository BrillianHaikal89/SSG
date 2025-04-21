'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Gunakan ini di app/

import useAuthStore from '../../stores/authStore';

export default function VerifyOtpPage() {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter(); // ✅ Next.js app router
  const { user, login } = useAuthStore();

//   console.log('user', user);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:3333/api/users/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.userId,
          otp: otpCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verifikasi gagal');
      }

      // Update auth store: set user_verify jadi 1
      login(
        {
          ...user,
          user_verify: { isverified: 1 }
        },
        useAuthStore.getState().authToken,
        user.userId
      );

      setSuccessMessage('Berhasil verifikasi. Mengarahkan ke dashboard...');
      setTimeout(() => {
        router.push('/dashboard'); // ✅ Ini sekarang aman digunakan
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal verifikasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <form onSubmit={handleOtpSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Verifikasi OTP</h1>

        <input
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          placeholder="Masukkan kode OTP"
          className="w-full border p-2 rounded mb-4"
          required
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Kode'}
        </button>
      </form>
    </div>
  );
}
