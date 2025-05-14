import { useState, useEffect } from 'react';
import {
    getSurahList,
    getSurahDetail,
    getAyat,
    getTafsir
} from '../services/quranKemenag';

const useQuran = () => {
    const [surahList, setSurahList] = useState([]);
    const [selectedSurah, setSelectedSurah] = useState('1');
    const [selectedAyat, setSelectedAyat] = useState(null);
    const [quranContent, setQuranContent] = useState([]);
    const [surahDetails, setSurahDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentJuz, setCurrentJuz] = useState(null);
    const [currentHal, setCurrentHal] = useState(null);

    useEffect(() => {
        const fetchSurahList = async() => {
            try {
                setLoading(true);
                const data = await getSurahList();
                setSurahList(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSurahList();
    }, []);

    useEffect(() => {
        const fetchSurahData = async() => {
            if (!selectedSurah) return;

            try {
                setLoading(true);
                setError(null);

                const [detailData, ayatData] = await Promise.all([
                    getSurahDetail(selectedSurah),
                    getAyat(selectedSurah)
                ]);

                // Add tafsir to each ayat
                const ayatWithTafsir = await Promise.all(
                    ayatData.map(async(ayat) => {
                        const tafsirData = await getTafsir(selectedSurah, ayat.aya_number);
                        return {
                            ...ayat,
                            tafsir: tafsirData ? .tafsir || ''
                        };
                    })
                );

                setSurahDetails(detailData);
                setQuranContent(ayatWithTafsir);
                setCurrentJuz(detailData.juz);
                setCurrentHal(detailData.page);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSurahData();
    }, [selectedSurah]);

    const handleSurahChange = (surahId) => {
        setSelectedSurah(surahId);
        setSelectedAyat(null);
    };

    const handleAyatChange = (ayatNumber) => {
        setSelectedAyat(ayatNumber);
    };

    const generateAyatOptions = () => {
        if (!quranContent || quranContent.length === 0) return [];
        return quranContent.map(ayat => ({
            value: ayat.aya_number,
            label: `Ayat ${ayat.aya_number}`
        }));
    };

    return {
        surahList,
        selectedSurah,
        selectedAyat,
        quranContent,
        surahDetails,
        loading,
        error,
        currentJuz,
        currentHal,
        handleSurahChange,
        handleAyatChange,
        generateAyatOptions
    };
};

export default useQuran;