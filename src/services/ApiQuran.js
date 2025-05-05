import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL
});

export const quranApi = {
    // Get list of all surahs
    getSurahList: async() => {
        try {
            const response = await api.get('/quran/surahs');
            return response.data;
        } catch (error) {
            console.error("Error fetching surah list:", error);
            // Fallback data in case API fails
            return [
                { no_surat: 1, nm_surat: "Al-Fatihah", arti_surat: "Pembukaan", jml_ayat: 7 },
                { no_surat: 2, nm_surat: "Al-Baqarah", arti_surat: "Sapi Betina", jml_ayat: 286 },
                { no_surat: 3, nm_surat: "Ali 'Imran", arti_surat: "Keluarga Imran", jml_ayat: 200 },
                { no_surat: 4, nm_surat: "An-Nisa", arti_surat: "Wanita", jml_ayat: 176 },
                { no_surat: 5, nm_surat: "Al-Ma'idah", arti_surat: "Hidangan", jml_ayat: 120 },
                { no_surat: 6, nm_surat: "Al-An'am", arti_surat: "Binatang Ternak", jml_ayat: 165 },
                { no_surat: 7, nm_surat: "Al-A'raf", arti_surat: "Tempat Tertinggi", jml_ayat: 206 },
                { no_surat: 8, nm_surat: "Al-Anfal", arti_surat: "Harta Rampasan Perang", jml_ayat: 75 },
                { no_surat: 9, nm_surat: "At-Tawbah", arti_surat: "Pengampunan", jml_ayat: 129 },
                { no_surat: 10, nm_surat: "Yunus", arti_surat: "Nabi Yunus", jml_ayat: 109 },
            ];
        }
    },

    // Get surah details including metadata
    getSurahDetails: async(surahId) => {
        try {
            const response = await api.get(`/quran/surah/${surahId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching surah details:", error);
            throw error;
        }
    },

    // Get specific ayat or range of ayat
    getAyat: async(surahId, ayatId = null) => {
        try {
            let url = `/quran/surah/${surahId}/ayat`;
            if (ayatId) {
                url += `/${ayatId}`;
            }

            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching ayat:", error);

            // Return fallback data for testing
            if (surahId === "1") {
                return [{
                    no_surat: 1,
                    no_ayat: 1,
                    arab: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
                    tafsir: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
                }];
            }

            throw error;
        }
    },

    // Get verses by page number
    getPageVerses: async(pageId) => {
        try {
            const response = await api.get(`/quran/page/${pageId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching page:", error);
            throw error;
        }
    },

    // Get verses by juz
    getJuzVerses: async(juzId) => {
        try {
            const response = await api.get(`/quran/juz/${juzId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching juz:", error);
            throw error;
        }
    },

    // Search the Quran
    searchQuran: async(query) => {
        try {
            const response = await api.get(`/quran/search`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            console.error("Error searching Quran:", error);
            throw error;
        }
    },

    // Save bookmark
    saveBookmark: async(bookmarkData) => {
        try {
            const response = await api.post('/quran/bookmark', bookmarkData);
            return response.data;
        } catch (error) {
            console.error("Error saving bookmark:", error);

            // For offline fallback, save to localStorage
            try {
                const key = `quran_bookmark_${bookmarkData.user_id}`;
                const existingBookmarks = JSON.parse(localStorage.getItem(key) || '[]');

                // Add timestamp
                const bookmark = {
                    ...bookmarkData,
                    timestamp: new Date().toISOString()
                };

                // Check if we already have this bookmark
                const existingIndex = existingBookmarks.findIndex(b =>
                    b.surah === bookmark.surah &&
                    b.ayah === bookmark.ayah
                );

                if (existingIndex >= 0) {
                    // Update existing
                    existingBookmarks[existingIndex] = bookmark;
                } else {
                    // Add new
                    existingBookmarks.push(bookmark);
                }

                // Sort by timestamp (newest first)
                existingBookmarks.sort((a, b) =>
                    new Date(b.timestamp) - new Date(a.timestamp)
                );

                localStorage.setItem(key, JSON.stringify(existingBookmarks));

                return { success: true, message: 'Bookmark disimpan secara lokal' };
            } catch (localError) {
                console.error("Error saving bookmark to localStorage:", localError);
                throw error; // Throw the original error
            }
        }
    },

    // Get all bookmarks for a user
    getUserBookmarks: async(userId) => {
        try {
            const response = await api.get(`/quran/bookmark/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching bookmarks:", error);

            // Fallback to localStorage
            try {
                const key = `quran_bookmark_${userId}`;
                const bookmarks = JSON.parse(localStorage.getItem(key) || '[]');
                return bookmarks;
            } catch (localError) {
                console.error("Error fetching bookmarks from localStorage:", localError);
                return [];
            }
        }
    },

    // Get latest bookmark for a user
    getLatestBookmark: async(userId) => {
        try {
            const response = await api.get(`/quran/bookmark/latest/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching latest bookmark:", error);

            // Fallback to localStorage
            try {
                const key = `quran_bookmark_${userId}`;
                const bookmarks = JSON.parse(localStorage.getItem(key) || '[]');

                // Sort by timestamp (newest first)
                bookmarks.sort((a, b) =>
                    new Date(b.timestamp) - new Date(a.timestamp)
                );

                // Return the first one (most recent)
                return bookmarks.length > 0 ? bookmarks[0] : null;
            } catch (localError) {
                console.error("Error fetching latest bookmark from localStorage:", localError);
                return null;
            }
        }
    }
};

export default api;