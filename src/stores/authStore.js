// stores/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      authToken: null,
      isAuthenticated: false,
      lastLoginTime: null,
      verify: null,
      role: null,

      login: (userData, token, userId) => {
        if (!token || !userId) {
          console.error('Invalid login data');
          return;
        }

        const normalizedUser = {
          userId,
          nomor_hp: userData.nomor_hp,
          email: userData.email,
          name: userData.name,
          fullData: userData.fullData
        };
      
        set({
          user: normalizedUser,
          authToken: token,
          isAuthenticated: true,
          lastLoginTime: new Date().toISOString(),
          verify: userData.user_verify?.isverified || 0,
          role: userData.userRole?.role || 'user' // fallback role kalau undefined
        });

        // Set secure cookies
        if (typeof window !== 'undefined') {
          Cookies.set('authToken', token, {
            expires: 1,
            path: '/',
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production'
          });

          Cookies.set('userId', userId.toString(), {
            expires: 1,
            path: '/',
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production'
          });
        }
      },

      logout: () => {
        set({
          user: null,
          authToken: null,
          isAuthenticated: false,
          lastLoginTime: null,
        });

        if (typeof window !== 'undefined') {
          Cookies.remove('authToken', { path: '/' });
          Cookies.remove('userId', { path: '/' });
          localStorage.removeItem('auth-storage');
        }
      },

      checkAuth: () => {
        const state = get();
        return !!(
          state.isAuthenticated && 
          state.authToken && 
          state.user?.userId && 
          new Date(state.lastLoginTime || 0) > new Date(Date.now() - 86400000) // 24h
        );
      },

      updateUserProfile: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authToken: state.authToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastLoginTime: state.lastLoginTime,
        verify: state.verify,
        role: state.role
      }),
    }
  )
);

export default useAuthStore;