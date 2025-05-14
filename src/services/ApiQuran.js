// services/ApiQuran.js
import axios from 'axios';

const API_BASE_URL = 'https://quran-api.santrikoding.com/api';

const api = axios.create({
    baseURL: API_BASE_URL
});

export const quranApi = {
    // Get list of all surahs
    getSurahList: async() => {
        try {
            const response = await api.get('/surah');
            return response.data;
        } catch (error) {
            console.error("Error fetching surah list:", error);
            throw error;
        }
    },

    // Get surah details including metadata
    getSurahDetails: async(surahId) => {
        try {
            const response = await api.get(`/surah/${surahId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching surah details:", error);
            throw error;
        }
    },

    // Get specific ayat or range of ayat
    getAyat: async(surahId, ayatId = null) => {
        try {
            let url = `/surah/${surahId}/ayat`;
            if (ayatId) {
                url += `/${ayatId}`;
            }
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching ayat:", error);
            throw error;
        }
    },

    // Get verses by page number
    getPageVerses: async(pageId) => {
        try {
            const response = await api.get(`/page/${pageId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching page:", error);
            throw error;
        }
    },

    // Get verses by juz
    getJuzVerses: async(juzId) => {
        try {
            const response = await api.get(`/juz/${juzId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching juz:", error);
            throw error;
        }
    },

    // Search the Quran
    searchQuran: async(query) => {
        try {
            const response = await api.get(`/cari/${query}`);
            return response.data;
        } catch (error) {
            console.error("Error searching Quran:", error);
            throw error;
        }
    }
};

export default api;