import { useState, useEffect } from 'react';
import { quranApi } from '../services/ApiQuran';

const useQuran = () => {
    const [surahList, setSurahList] = useState([]);
    const [selectedSurah, setSelectedSurah] = useState("");
    const [selectedAyat, setSelectedAyat] = useState("");
    const [quranContent, setQuranContent] = useState([]);
    const [surahDetails, setSurahDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [currentHal, setCurrentHal] = useState("");
    const [currentJuz, setCurrentJuz] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [lastBookmark, setLastBookmark] = useState(null);

    useEffect(() => {
        fetchSurahList();
        loadLastBookmark();
    }, []);

    const fetchSurahList = async() => {
        setLoading(true);
        setError(null);
        try {
            const data = await quranApi.getSurahList();
            setSurahList(data);
        } catch (error) {
            setError('Gagal memuat daftar surah');
        } finally {
            setLoading(false);
        }
    };

    const fetchSurahDetails = async(surahId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await quranApi.getSurahDetails(surahId);
            setSurahDetails(data);
            if (data.ayahs ? .length > 0) {
                setCurrentJuz(data.ayahs[0].no_juz ? .toString() || "");
                setCurrentHal(data.ayahs[0].no_hal ? .toString() || "");
            }
        } catch (error) {
            setError('Gagal memuat detail surah');
        } finally {
            setLoading(false);
        }
    };

    const fetchAyat = async(surahId, ayatId = null) => {
        setLoading(true);
        setError(null);
        try {
            const data = await quranApi.getAyat(surahId, ayatId);
            setQuranContent(data);
            if (data ? .length > 0) {
                setCurrentJuz(data[0].no_juz ? .toString() || "");
                setCurrentHal(data[0].no_hal ? .toString() || "");
            }
            window.scrollTo(0, 0);
        } catch (error) {
            setError('Gagal memuat ayat');
        } finally {
            setLoading(false);
        }
    };

    const fetchByPage = async(pageId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await quranApi.getPageVerses(pageId);
            setQuranContent(data);
            setSelectedSurah("");
            setSelectedAyat("");
            setCurrentHal(pageId.toString());
            if (data ? .length > 0) {
                setCurrentJuz(data[0].no_juz ? .toString() || "");
                setSurahDetails({
                    nm_surat: data[0].surah_name || `Halaman ${pageId}`,
                    arti_surat: `Halaman ${pageId}`
                });
            }
            window.scrollTo(0, 0);
        } catch (error) {
            setError('Gagal memuat halaman');
        } finally {
            setLoading(false);
        }
    };

    const fetchJuz = async(juzId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await quranApi.getJuzVerses(juzId);
            setQuranContent(data);
            setCurrentJuz(juzId.toString());
            setSelectedSurah("");
            setSelectedAyat("");
            if (data ? .length > 0) {
                setCurrentHal(data[0].no_hal ? .toString() || "");
                setSurahDetails({
                    nm_surat: `Juz ${juzId}`,
                    arti_surat: data[0].surah_name ? `Dimulai dari ${data[0].surah_name}` : ""
                });
            }
            window.scrollTo(0, 0);
        } catch (error) {
            setError('Gagal memuat juz');
        } finally {
            setLoading(false);
        }
    };

    const searchQuran = async(searchQuery) => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const data = await quranApi.searchQuran(searchQuery);
            setQuranContent(data);
            setSurahDetails({
                nm_surat: `Hasil Pencarian`,
                arti_surat: `"${searchQuery}" (${data.length} hasil)`
            });
            window.scrollTo(0, 0);
        } catch (error) {
            setError('Gagal melakukan pencarian');
        } finally {
            setLoading(false);
        }
    };

    const loadLastBookmark = async() => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/quran/bookmark/latest`);
            if (!response.ok) throw new Error('Gagal memuat bookmark');
            const data = await response.json();
            if (data ? .surah && data ? .ayah) {
                setLastBookmark(data);
            }
        } catch (error) {
            console.error('Error loading bookmark:', error);
        }
    };

    const continueFromBookmark = async() => {
        if (!lastBookmark) return;
        try {
            await fetchAyat(lastBookmark.surah, lastBookmark.ayah);
            setSelectedSurah(lastBookmark.surah);
            setSelectedAyat(lastBookmark.ayah);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error continuing from bookmark:', error);
        }
    };

    const generateAyatOptions = () => {
        if (!selectedSurah) return [];
        const surah = surahList.find(s => s.no_surat === parseInt(selectedSurah));
        if (!surah) return [];
        return Array.from({ length: surah.jml_ayat }, (_, i) => ({
            value: (i + 1).toString(),
            label: (i + 1).toString()
        }));
    };

    const handleSurahChange = (e) => {
        const surahId = e.target.value;
        setSelectedSurah(surahId);
        setSelectedAyat("");
        if (surahId) {
            fetchSurahDetails(surahId);
            fetchAyat(surahId);
        } else {
            setQuranContent([]);
            setSurahDetails(null);
        }
    };

    const handleAyatChange = (e) => {
        const ayatId = e.target.value;
        setSelectedAyat(ayatId);
        if (selectedSurah && ayatId) {
            fetchAyat(selectedSurah, ayatId);
        } else if (selectedSurah) {
            fetchAyat(selectedSurah);
        }
    };

    const handleJuzChange = (e) => {
        const juzId = e.target.value;
        if (!juzId) return;
        setCurrentJuz(juzId);
        fetchJuz(juzId);
    };

    const handlePageChange = (e) => {
        const pageId = e.target.value;
        if (!pageId) return;
        setCurrentHal(pageId);
        fetchByPage(pageId);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchText.trim()) searchQuran(searchText);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isAtEndOfContent = () => {
        if (!quranContent ? .length) return false;
        const lastItem = quranContent[quranContent.length - 1];

        if (selectedSurah && surahDetails) {
            return lastItem.no_ayat === surahDetails.jml_ayat;
        } else if (currentHal) {
            return !quranContent.some(item =>
                item.no_hal === lastItem.no_hal && item.no_ayat > lastItem.no_ayat
            );
        } else if (currentJuz) {
            return !quranContent.some(item =>
                item.no_juz === lastItem.no_juz &&
                (item.no_surat > lastItem.no_surat ||
                    (item.no_surat === lastItem.no_surat && item.no_ayat > lastItem.no_ayat))
            );
        }
        return false;
    };

    const getNextContent = () => {
        if (selectedSurah) {
            const nextSurahId = parseInt(selectedSurah) + 1;
            const nextSurah = surahList.find(s => s.no_surat === nextSurahId);
            if (nextSurah) return {
                type: 'surah',
                item: { id: nextSurahId, name: nextSurah.nm_surat }
            };
        } else if (currentHal) {
            const pageNum = parseInt(currentHal);
            if (pageNum < 604) return {
                type: 'page',
                item: { number: pageNum + 1 }
            };
        } else if (currentJuz) {
            const juzNum = parseInt(currentJuz);
            if (juzNum < 30) return {
                type: 'juz',
                item: { number: juzNum + 1 }
            };
        }
        return null;
    };

    const handleContinueToNext = () => {
        const nextContent = getNextContent();
        if (!nextContent) return;

        switch (nextContent.type) {
            case 'surah':
                setSelectedSurah(nextContent.item.id.toString());
                setSelectedAyat("");
                fetchSurahDetails(nextContent.item.id);
                fetchAyat(nextContent.item.id);
                break;
            case 'page':
                fetchByPage(nextContent.item.number);
                break;
            case 'juz':
                fetchJuz(nextContent.item.number);
                break;
            default:
                break;
        }
    };

    return {
        surahList,
        selectedSurah,
        selectedAyat,
        quranContent,
        surahDetails,
        loading,
        error,
        searchText,
        currentHal,
        currentJuz,
        showScrollTop,
        lastBookmark,

        fetchAyat,
        generateAyatOptions,
        handleSurahChange,
        handleAyatChange,
        handleJuzChange,
        handlePageChange,
        handleSearchChange,
        handleSearch,
        scrollToTop,
        setShowScrollTop,
        loadLastBookmark,
        continueFromBookmark,

        isAtEndOfContent,
        getNextContent,
        handleContinueToNext
    };
};

export default useQuran;