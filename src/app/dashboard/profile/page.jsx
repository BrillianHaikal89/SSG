"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import ProfileHeader from '../../../components/profile/ProfileHeader';
import ProfileLayout from '../../../components/profile/ProfileLayout';
import PersonalInfoForm from '../../../components/profile/PersonalInfoForm';
import HealthInfoForm from '../../../components/profile/HealthInfoForm';
import RequiredDocumentsForm from '../../../components/profile/RequiredDocumentsForm';
import AgreementSignatureForm from '../../../components/profile/AgreementSignatureForm';

// Use dynamic import with no SSR to prevent hydration issues
const ProfilePage = () => {
  return (
    <ProfileLayout>
      <ProfileHeader />
      <PersonalInfoForm />
      <HealthInfoForm />
      <RequiredDocumentsForm />
      <AgreementSignatureForm />
    </ProfileLayout>
  );
};

export default ProfilePage;