"use client";

import React, { useEffect, useState } from 'react';
import ProfileHeader from '../../../components/profile/ProfileHeader';
import ProfileLayout from '../../../components/profile/ProfileLayout';
import PersonalInfoForm from '../../../components/profile/PersonalInfoForm';
// Import dengan dynamic untuk menghindari error SSR
import dynamic from 'next/dynamic';
import AgreementSignatureForm from '../../../components/profile/AgreementSignatureForm';
import useAuthStore from '../../../stores/authStore';

// Gunakan dynamic import untuk komponen HealthInfoForm yang bermasalah
const HealthInfoForm = dynamic(() => import('../../../components/profile/HealthInfoForm'), {
  ssr: false,
});

// Gunakan dynamic import untuk RequiredDocumentsForm (yang baru saja kita perbaiki)
const RequiredDocumentsForm = dynamic(() => import('../../../components/profile/RequiredDocumentsForm'), {
  ssr: false,
});

const ProfilePage = () => {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [userData, setUserData] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check authentication status
  useEffect(() => {
    if (isClient) {
      const isAuthenticated = checkAuth();
      
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      // Get user data from Zustand store
      const authUser = useAuthStore.getState().user;
      setUserData(authUser);
      setLoading(false);
    }
  }, [router, checkAuth, isClient]);

  // Error boundary fallback rendering
  if (!isClient) {
    return null; // Return nothing during SSR to prevent hydration errors
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Safety check - jika userData tidak ada, tampilkan error message
  if (!userData) {
    return (
      <ProfileLayout>
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-medium text-red-500">Error Loading User Data</h2>
          <p className="text-gray-600">Unable to load user data. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Refresh Page
          </button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      {/* Pastikan semua komponen menerima data yang valid */}
      <ProfileHeader userData={userData} />
      <PersonalInfoForm initialData={userData} />
      <HealthInfoForm initialData={userData} />
      <RequiredDocumentsForm initialData={userData} />
      <AgreementSignatureForm initialData={userData} />
    </ProfileLayout>
  );
};

export default ProfilePage;