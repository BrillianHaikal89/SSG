"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the ProfileForm component with no SSR to avoid hydration issues
const ProfileForm = dynamic(() => import('../../../components/ProfileForm'), { 
  ssr: false 
});

export default function ProfilePage() {
  return (
    <ProfileForm />
  );
}