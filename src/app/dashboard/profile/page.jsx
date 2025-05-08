"use client";

import React, { useEffect, useState } from 'react';
import ProfileHeader from '../../../components/profile/ProfileHeader';
import ProfileLayout from '../../../components/profile/ProfileLayout';
import PersonalInfoForm from '../../../components/profile/PersonalInfoForm';
import HealthInfoForm from '../../../components/profile/HealthInfoForm';
import RequiredDocumentsForm from '../../../components/profile/RequiredDocumentsForm';
import AgreementSignatureForm from '../../../components/profile/AgreementSignatureForm';
import useAuthStore from '../../../stores/authStore';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [userData, setUserData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side rendering and authentication
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
    }
  }, [router, checkAuth, isClient]);

  if (!isClient || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileLayout>
      {/* Pass user data to components */}
      <ProfileHeader userData={userData} />
      <PersonalInfoForm initialData={userData} />
      <HealthInfoForm initialData={userData} />
      <RequiredDocumentsForm initialData={userData} />
      <AgreementSignatureForm initialData={userData} />
    </ProfileLayout>
  );
};

export default ProfilePage;