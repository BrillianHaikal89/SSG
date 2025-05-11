import { useState, useEffect, useCallback } from 'react';
import { quranApi } from '../services/ApiQuran';

const useQuran = () => {
    // State for Quran data
    const [surahList, setSurahList] = useState([]);
    const [selectedSurah, setSelectedSurah] = useState("");
    const [selectedAyat, setSelectedAyat] = useState("");
    const [quranContent, setQuranContent] = useState([]);
    const [surahDetails, setSurahDetails] = useState(null);

    // UI states - initially set as empty strings to show placeholder text
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [currentHal, setCurrentHal] = useState("");
    const [currentJuz, setCurrentJuz] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [lastReadPage, setLastReadPage] = useState(null);

    // Fetch list of surahs on hook initialization
    useEffect(() => {
        fetchSurahList();

        // Load last read page from localStorage
        const savedPage = localStorage.getItem('lastReadPage');
        if (savedPage) {
            setLastReadPage(savedPage);
        }
    }, []);

    // Fetch surah list from the API
    const fetchSurahList = useCallback(async() => {
        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getSurahList();
            setSurahList(data);
        } catch (error) {
            console.error(error);
            setError('Gagal memuat daftar surah');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch surah details including metadata
    const fetchSurahDetails = useCallback(async(surahId) => {
        if (!surahId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getSurahDetails(surahId);
            setSurahDetails(data);

            // Update juz and page information
            if (data.ayahs && data.ayahs.length > 0) {
                setCurrentJuz(data.ayahs[0].no_juz ? data.ayahs[0].no_juz.toString() : "");
                setCurrentHal(data.ayahs[0].no_hal ? data.ayahs[0].no_hal.toString() : "");
            }
        } catch (error) {
            console.error(error);
            setError('Gagal memuat detail surah');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch specific ayat or range of ayat
    const fetchAyat = useCallback(async(surahId, ayatId = null) => {
        if (!surahId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getAyat(surahId, ayatId);

            // Format the data for display
            setQuranContent(data);

            // Update juz and page if data is available
            if (data && data.length > 0) {
                setCurrentJuz(data[0].no_juz ? data[0].no_juz.toString() : "");
                setCurrentHal(data[0].no_hal ? data[0].no_hal.toString() : "");
            }

            // Scroll to top after loading new content
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            setError('Gagal memuat ayat Al-Quran');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch ayahs by page number
    const fetchByPage = useCallback(async(pageId) => {
        if (!pageId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getPageVerses(pageId);

            if (!data || data.length === 0) {
                throw new Error('Tidak ada data untuk halaman ini');
            }

            setQuranContent(data);

            // Clear surah and ayat selections as we're now viewing by page
            setSelectedSurah("");
            setSelectedAyat("");

            // Update current page
            setCurrentHal(pageId.toString());

            // Save as last read page
            localStorage.setItem('lastReadPage', pageId.toString());
            setLastReadPage(pageId.toString());

            // Update juz if first ayah has juz information
            if (data && data.length > 0) {
                setCurrentJuz(data[0].no_juz ? data[0].no_juz.toString() : "");
            }

            // Update page title to show first surah on this page
            if (data && data.length > 0 && data[0].surah_name) {
                setSurahDetails({
                    nm_surat: data[0].surah_name,
                    arti_surat: `Halaman ${pageId}`
                });
            } else {
                setSurahDetails({
                    nm_surat: `Halaman ${pageId}`,
                    arti_surat: ""
                });
            }

            // Scroll to top after loading new content
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            setError('Gagal memuat data halaman');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch verses by juz
    const fetchJuz = useCallback(async(juzId) => {
        if (!juzId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getJuzVerses(juzId);

            if (!data || data.length === 0) {
                throw new Error('Tidak ada data untuk Juz ini');
            }

            setQuranContent(data);

            // Update the current juz
            setCurrentJuz(juzId.toString());

            // Clear surah and ayat selections as we're now viewing by juz
            setSelectedSurah("");
            setSelectedAyat("");

            // Update the first page from returned data
            if (data && data.length > 0) {
                const pageNumber = data[0].no_hal ? data[0].no_hal.toString() : "";
                setCurrentHal(pageNumber);

                // Also save as last read page
                if (pageNumber) {
                    localStorage.setItem('lastReadPage', pageNumber);
                    setLastReadPage(pageNumber);
                }
            }

            // Update page title to show juz number
            setSurahDetails({
                nm_surat: `Juz ${juzId}`,
                arti_surat: data && data.length > 0 ?
                    `Dimulai dari ${data[0].surah_name || ''}` : ""
            });

            // Scroll to top after loading new content
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            setError('Gagal memuat data Juz');
        } finally {
            setLoading(false);
        }
    }, []);

    // Search the Quran for specific text
    const searchQuran = useCallback(async(searchQuery) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.searchQuran(searchQuery);

            if (!data || data.length === 0) {
                setQuranContent([]);
                setSurahDetails({
                    nm_surat: `Hasil Pencarian`,
                    arti_surat: `"${searchQuery}" (0 hasil)`
                });
                throw new Error('Tidak ditemukan hasil untuk pencarian ini');
            }

            setQuranContent(data);

            // Update page title to show search results
            setSurahDetails({
                nm_surat: `Hasil Pencarian`,
                arti_surat: `"${searchQuery}" (${data.length} hasil)`
            });

            // If results found, update current hal and juz from first result
            if (data.length > 0) {
                if (data[0].no_hal) {
                    setCurrentHal(data[0].no_hal.toString());
                }
                if (data[0].no_juz) {
                    setCurrentJuz(data[0].no_juz.toString());
                }
            }

            // Scroll to top after loading new content
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            setError('Pencarian tidak ditemukan: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Generate ayat options based on selected surah
    const generateAyatOptions = useCallback(() => {
        if (!selectedSurah) return [];

        const surah = surahList.find(s => s.no_surat === parseInt(selectedSurah));
        if (!surah) return [];

        const ayatOptions = [];
        for (let i = 1; i <= surah.jml_ayat; i++) {
            ayatOptions.push({ value: i.toString(), label: i.toString() });
        }
        return ayatOptions;
    }, [selectedSurah, surahList]);

    // Handle surah selection change
    const handleSurahChange = useCallback((e) => {
        const surahId = e.target.value;
        setSelectedSurah(surahId);
        setSelectedAyat("");

        // Reset current hal and juz when switching to surah view
        setCurrentHal("");
        setCurrentJuz("");

        if (surahId) {
            // Fetch surah details
            fetchSurahDetails(surahId);
            // Fetch all ayahs of the surah
            fetchAyat(surahId);
        } else {
            // Clear content if no surah is selected
            setQuranContent([]);
            setSurahDetails(null);
        }
    }, [fetchSurahDetails, fetchAyat]);

    // Handle ayat selection change
    const handleAyatChange = useCallback((e) => {
        const ayatId = e.target.value;
        setSelectedAyat(ayatId);

        if (selectedSurah && ayatId) {
            // Fetch specific ayat
            fetchAyat(selectedSurah, ayatId);
        } else if (selectedSurah) {
            // If no specific ayat is selected, fetch all ayahs of the surah
            fetchAyat(selectedSurah);
        }
    }, [selectedSurah, fetchAyat]);

    // Handle juz selection
    const handleJuzChange = useCallback((e) => {
        const juzId = e.target.value;
        if (!juzId) {
            setCurrentJuz("");
            return;
        }

        // Reset other selection types
        setSelectedSurah("");
        setSelectedAyat("");
        setCurrentHal("");

        setCurrentJuz(juzId); // Store as string to maintain empty state
        fetchJuz(juzId);
    }, [fetchJuz]);

    // Handle page selection
    const handlePageChange = useCallback((e) => {
        const pageId = e.target.value;
        if (!pageId) {
            setCurrentHal("");
            return;
        }

        // Reset other selection types
        setSelectedSurah("");
        setSelectedAyat("");
        setCurrentJuz("");

        setCurrentHal(pageId); // Store as string to maintain empty state
        fetchByPage(pageId);
    }, [fetchByPage]);

    // Navigate to previous page
    const goToPreviousPage = useCallback(() => {
        const current = parseInt(currentHal) || 1;
        if (current > 1) {
            const prevPage = current - 1;
            setCurrentHal(prevPage.toString());

            // Reset other selection types
            setSelectedSurah("");
            setSelectedAyat("");
            setCurrentJuz("");

            fetchByPage(prevPage.toString());
        }
    }, [currentHal, fetchByPage]);

    // Navigate to next page
    const goToNextPage = useCallback(() => {
        const current = parseInt(currentHal) || 1;
        if (current < 604) { // 604 is the total number of pages in standard Quran
            const nextPage = current + 1;
            setCurrentHal(nextPage.toString());

            // Reset other selection types
            setSelectedSurah("");
            setSelectedAyat("");
            setCurrentJuz("");

            fetchByPage(nextPage.toString());
        }
    }, [currentHal, fetchByPage]);

    // Load last read page
    const loadLastReadPage = useCallback(() => {
        if (lastReadPage) {
            fetchByPage(lastReadPage);
        }
    }, [lastReadPage, fetchByPage]);

    // Handle search input change
    const handleSearchChange = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    // Handle search submission
    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (searchText.trim()) {
            // Reset all other selection methods when searching
            setSelectedSurah("");
            setSelectedAyat("");
            setCurrentHal("");
            setCurrentJuz("");

            searchQuran(searchText);
        }
    }, [searchText, searchQuran]);

    // Scroll to top function
    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    // Check if the current content is at the last item (surah, page or juz)
    const isAtEndOfContent = useCallback(() => {
        if (!quranContent || quranContent.length === 0) return false;

        // Get the last item in current content
        const lastItem = quranContent[quranContent.length - 1];

        if (selectedSurah && surahDetails) {
            // For surah view, check if we're at the last ayat
            return lastItem.no_ayat === surahDetails.jml_ayat;
        } else if (currentHal) {
            // For page view, simply check if it's the last page
            return parseInt(currentHal) >= 604;
        } else if (currentJuz) {
            // For juz view, check if it's the last juz
            return parseInt(currentJuz) >= 30;
        }

        return false;
    }, [quranContent, selectedSurah, surahDetails, currentHal, currentJuz]);

    // Determine the next content to navigate to
    const getNextContent = useCallback(() => {
        if (selectedSurah) {
            // For surah view, get the next surah
            const currentSurahId = parseInt(selectedSurah);
            const nextSurahId = currentSurahId + 1;

            const nextSurah = surahList.find(s => s.no_surat === nextSurahId);
            if (nextSurah) {
                return {
                    type: 'surah',
                    item: {
                        id: nextSurahId,
                        name: nextSurah.nm_surat,
                        number: nextSurahId
                    }
                };
            }
        } else if (currentHal) {
            // For page view, get the next page
            const pageNum = parseInt(currentHal);
            if (pageNum < 604) { // 604 is the total number of pages in standard Quran
                return {
                    type: 'page',
                    item: {
                        number: pageNum + 1
                    }
                };
            }
        } else if (currentJuz) {
            // For juz view, get the next juz
            const juzNum = parseInt(currentJuz);
            if (juzNum < 30) { // 30 is the total number of juz in Quran
                return {
                    type: 'juz',
                    item: {
                        number: juzNum + 1
                    }
                };
            }
        }

        return null;
    }, [selectedSurah, surahList, currentHal, currentJuz]);

    // Handle navigation to next content (surah, page, juz)
    const handleContinueToNext = useCallback(() => {
        const nextContent = getNextContent();
        if (!nextContent) return;

        // Navigate based on content type
        switch (nextContent.type) {
            case 'surah':
                setSelectedSurah(nextContent.item.id.toString());
                setSelectedAyat("");
                setCurrentHal("");
                setCurrentJuz("");
                fetchSurahDetails(nextContent.item.id);
                fetchAyat(nextContent.item.id);
                break;
            case 'page':
                setSelectedSurah("");
                setSelectedAyat("");
                setCurrentJuz("");
                setCurrentHal(nextContent.item.number.toString());
                fetchByPage(nextContent.item.number);
                break;
            case 'juz':
                setSelectedSurah("");
                setSelectedAyat("");
                setCurrentHal("");
                setCurrentJuz(nextContent.item.number.toString());
                fetchJuz(nextContent.item.number);
                break;
            default:
                break;
        }
    }, [getNextContent, fetchSurahDetails, fetchAyat, fetchByPage, fetchJuz]);

    return {
        // State
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
        lastReadPage,

        // Methods
        fetchSurahList,
        fetchSurahDetails,
        fetchAyat,
        fetchByPage,
        fetchJuz,
        searchQuran,
        generateAyatOptions,
        handleSurahChange,
        handleAyatChange,
        handleJuzChange,
        handlePageChange,
        goToPreviousPage,
        goToNextPage,
        handleSearchChange,
        handleSearch,
        scrollToTop,
        setShowScrollTop,
        loadLastReadPage,

        // Continue functionality
        isAtEndOfContent,
        getNextContent,
        handleContinueToNext
    };
};

export default useQuran;