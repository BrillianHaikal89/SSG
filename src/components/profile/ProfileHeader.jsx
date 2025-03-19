"use client";

import React, { useState, useEffect } from 'react';

const ProfileHeader = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Get user data from localStorage or sessionStorage
        const storedUserData = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
        
        setUserData({
          name: storedUserData.name || 'Muhammad Brilian Haikal',
          level: storedUserData.level || 'Pleton 20',
          email: storedUserData.email || 'brilian@example.com',
          phone: storedUserData.phone || '081234567890',
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserData({
          name: 'Pengguna',
          level: 'Pleton 20',
          email: 'user@example.com',
          phone: '081234567890',
        });
      }
    }
  }, []);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 p-6">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl mb-3">
          {userData?.name?.charAt(0) || 'U'}
        </div>
        <h2 className="text-xl font-medium">{userData?.name}</h2>
        <p className="text-sm text-gray-600 mb-1">{userData?.level}</p>
        <p className="text-sm text-gray-600 mb-1">{userData?.email}</p>
        <p className="text-sm text-gray-600">{userData?.phone}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;