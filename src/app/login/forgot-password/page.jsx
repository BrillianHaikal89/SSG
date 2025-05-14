"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useAuthStore from '../../../stores/authStore';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function ForgotPasswordPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // State management
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Enter phone number, Step 2: Enter OTP, Step 3: New password
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [userId, setUserId] = useState(null);

  // Handle phone number submission
  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nomor_hp: phoneNumber.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim OTP');
      }

      setUserId(data.userId);
      setStep(2);
      startCountdown(120); // 2 minutes countdown
      toast.success('Kode OTP telah dikirim ke nomor HP Anda');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Terjadi kesalahan saat mengirim OTP');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle OTP input
  function handleOtpChange(index, value) {
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  }

  // Handle OTP verification
  async function handleOtpSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const otpCode = otp.join('');
      
      const response = await fetch(`${API_URL}/users/verify-forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId,
          otp: otpCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verifikasi OTP gagal');
      }

      setStep(3);
      toast.success('OTP berhasil diverifikasi, silakan buat password baru');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Terjadi kesalahan saat verifikasi OTP');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle password reset
  async function handlePasswordReset(e) {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      setPasswordError('Kata sandi harus minimal 8 karakter');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Kata sandi tidak sama');
      return;
    }
    
    setIsSubmitting(true);
    setPasswordError('');
    
    try {
      const response = await fetch(`${API_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId,
          newPassword: newPassword.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal reset password');
      }

      toast.success('Password berhasil direset!');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Terjadi kesalahan saat reset password');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Resend OTP function
  async function handleResendOtp() {
    try {
      const response = await fetch(`${API_URL}/users/resend-forgot-password-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim ulang OTP');
      }

      startCountdown(120); // Reset to 2 minutes
      toast.success('Kode OTP baru telah dikirim');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Gagal mengirim ulang OTP');
    }
  }

  // Countdown timer functions
  function startCountdown(seconds) {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  return (
    <div className="flex h-screen">
      {/* Form Side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
            Lupa Kata Sandi
          </h1>
          <p className="text-center text-gray-500 mb-8">
            {step === 1 && "Masukkan nomor HP yang terdaftar untuk reset kata sandi"}
            {step === 2 && "Masukkan kode OTP yang dikirimkan ke nomor HP Anda"}
            {step === 3 && "Buat kata sandi baru untuk akun Anda"}
          </p>
          
          {/* Step 1: Phone Number Form */}
          {step === 1 && (
            <form onSubmit={handlePhoneSubmit}>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Nomor HP
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                  placeholder="Masukkan nomor HP Anda"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim OTP'}
                </button>
              </div>
            </form>
          )}
          
          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-500 uppercase mb-3">
                  Kode OTP
                </label>
                <div className="flex space-x-2 justify-between">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-10 h-12 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-lg"
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-500 text-center">
                  {countdown > 0 ? (
                    `Kirim ulang dalam ${formatTime(countdown)}`
                  ) : (
                    <button 
                      type="button"
                      className="text-blue-800 font-medium"
                      onClick={handleResendOtp}
                    >
                      Kirim ulang OTP
                    </button>
                  )}
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || otp.some(digit => digit === '')}
                  className="w-2/3 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
              </div>
            </form>
          )}
          
          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                  placeholder="Minimal 8 karakter"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Konfirmasi Kata Sandi
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                  placeholder="Masukkan kembali kata sandi"
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600">
                    {passwordError}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses...' : 'Reset Kata Sandi'}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm font-medium text-blue-800 hover:text-blue-900">
              Kembali ke halaman login
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* Banner Side */}
      <div className="hidden md:flex md:w-1/2 bg-blue-900 justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Reset Kata Sandi</h2>
          <p className="text-white text-sm mb-6">Ikuti langkah-langkah untuk memperbarui kata sandi Anda</p>
          <Link
            href="/login"
            className="inline-block py-2 px-6 border border-white rounded-full text-sm font-medium text-white hover:bg-white hover:text-blue-800 transition-colors"
          >
            Masuk
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;