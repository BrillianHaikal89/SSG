"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Components
import ProfileHeader from '../../../components/profile/ProfileHeader';
import ProfileLayout from '../../../components/profile/ProfileLayout';
import PersonalInfoForm from '../../../components/profile/PersonalInfoForm';
import HealthInfoForm from '../../../components/profile/HealthInfoForm';
import AgreementSignatureForm from '../../../components/profile/AgreementSignatureForm';

// Dynamic import with SSR disabled
const RequiredDocumentsForm = dynamic(
  () => import('../../../components/profile/RequiredDocumentsForm'),
  { ssr: false }
);

// Error boundary component
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error("Caught error:", error);
      setHasError(true);
      return true; // Prevents default error handler
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="bg-white rounded-lg shadow-md mb-4 p-4">
        <h3 className="text-lg font-medium text-red-600">Error Loading Documents</h3>
        <p className="text-gray-600">
          Komponen dokumen tidak dapat dimuat saat ini. Silakan segarkan halaman atau coba lagi nanti.
        </p>
      </div>
    );
  }

  return children;
}

// Main Profile Page component
const ProfilePage = () => {
  // Existing code...
  
  return (
    <ProfileLayout>
      <ProfileHeader userData={userData} />
      <PersonalInfoForm initialData={userData} />
      <HealthInfoForm initialData={userData} />
      
      {/* Wrap problematic component in ErrorBoundary */}
      <ErrorBoundary>
        <RequiredDocumentsForm initialData={userData} />
      </ErrorBoundary>
      
      <AgreementSignatureForm initialData={userData} />
    </ProfileLayout>
  );
};

export default ProfilePage;