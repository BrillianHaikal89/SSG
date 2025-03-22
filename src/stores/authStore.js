// stores/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

// Create authentication store with persistence
const useAuthStore = create(
    persist(
        (set, get) => ({
            // User data
            user: null,
            authToken: null,
            userId: null,
            isAuthenticated: false,
            lastLoginTime: null,

            // Login action
            login: (userData, token, id) => {
                console.log("Storing login data:", { userData, token, id });

                // Set auth data in store
                set({
                    user: userData,
                    authToken: token,
                    userId: id,
                    isAuthenticated: true,
                    lastLoginTime: new Date().toISOString(),
                });

                // Also set in cookies for SSR/middleware access
                if (typeof window !== 'undefined') {
                    Cookies.set('authToken', token, {
                        expires: 7, // 7 days
                        path: '/',
                        sameSite: 'Lax'
                    });

                    Cookies.set('userId', id, {
                        expires: 7, // 7 days
                        path: '/',
                        sameSite: 'Lax'
                    });
                }
            },

            // Logout action
            logout: () => {
                console.log("Logging out");

                // Clear auth data from store
                set({
                    user: null,
                    authToken: null,
                    userId: null,
                    isAuthenticated: false,
                    lastLoginTime: null,
                });

                // Clear cookies
                if (typeof window !== 'undefined') {
                    Cookies.remove('authToken', { path: '/' });
                    Cookies.remove('userId', { path: '/' });
                }
            },

            // Check if user is authenticated
            checkAuth: () => {
                const state = get();
                const isValid = !!(state.isAuthenticated && state.authToken && state.userId);
                return isValid;
            },

            // Update user profile
            updateUserProfile: (userData) => set((state) => ({
                user: state.user ? {...state.user, ...userData } : userData,
            })),
        }), {
            name: 'auth-storage', // unique name for localStorage
            storage: createJSONStorage(() => {
                // Only use localStorage in browser environment
                return typeof window !== 'undefined' ? localStorage : null;
            }),

            // Only store essential authentication data
            partialize: (state) => ({
                authToken: state.authToken,
                userId: state.userId,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                lastLoginTime: state.lastLoginTime
            }),
        }
    )
);

export default useAuthStore;