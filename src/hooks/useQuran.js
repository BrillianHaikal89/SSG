import { useState, useEffect } from 'react';
import { quranApi } from '../services/ApiQuran';
import { useSearchParams } from 'next/navigation';

const useQuran = () => {
    // URL search parameters
    const searchParams = useSearchParams();

    // State for Quran data
    const [surahList, setSurahList] = useState([]);
    const [selectedSurah, setSelectedSurah] = useState("");
    const [selectedAyat, setSelectedAyat] = useState("");
    const [quranContent, setQuranContent] = useState([]);
    const [surahDetails, setSurahDetails] = useState(null);

    // UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [currentHal, setCurrentHal] = useState("");
    const [currentJuz, setCurrentJuz] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    // Fetch list of surahs on hook initialization
    useEffect(() => {
        fetchSurahList();
    }, []);

    // Parse URL parameters and load content when component mounts
    useEffect(() => {
        if (!initialLoadComplete && surahList.length > 0) {
            const surahParam = searchParams.get('surah');
            const ayatParam = searchParams.get('ayat');
            const pageParam = searchParams.get('page');
            const juzParam = searchParams.get('juz');
            const isBookmark = searchParams.get('bookmark') === 'true';

            if (isBookmark) {
                if (surahParam) {
                    setSelectedSurah(surahParam);
                    fetchSurahDetails(surahParam);

                    if (ayatParam) {
                        setSelectedAyat(ayatParam);
                        fetchAyat(surahParam, ayatParam);
                    } else {
                        fetchAyat(surahParam);
                    }
                } else if (pageParam) {
                    setCurrentHal(pageParam);
                    fetchByPage(pageParam);
                } else if (juzParam) {
                    setCurrentJuz(juzParam);
                    fetchJuz(juzParam);
                }
            }

            setInitialLoadComplete(true);
        }
    }, [searchParams, surahList, initialLoadComplete]);

    // Fetch surah list from the API
    const fetchSurahList = async() => {
        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getSurahList();
            setSurahList(data);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch surah list');
        } finally {
            setLoading(false);
        }
    };

    // Fetch surah details including metadata
    const fetchSurahDetails = async(surahId) => {
        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getSurahDetails(surahId);
            setSurahDetails(data);

            if (data.ayahs && data.ayahs.length > 0) {
                setCurrentJuz(data.ayahs[0].no_juz ? data.ayahs[0].no_juz.toString() : "");
                setCurrentHal(data.ayahs[0].no_hal ? data.ayahs[0].no_hal.toString() : "");
            }
        } catch (error) {
            console.error(error);
            setError('Failed to fetch surah details');
        } finally {
            setLoading(false);
        }
    };

    // Fetch specific ayat or range of ayat
    const fetchAyat = async(surahId, ayatId = null) => {
        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getAyat(surahId, ayatId);
            setQuranContent(data);

            if (data && data.length > 0) {
                setCurrentJuz(data[0].no_juz ? data[0].no_juz.toString() : "");
                setCurrentHal(data[0].no_hal ? data[0].no_hal.toString() : "");
            }

            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch Quranic verses');
        } finally {
            setLoading(false);
        }
    };

    // Fetch ayahs by page number
    const fetchByPage = async(pageId) => {
        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getPageVerses(pageId);
            setQuranContent(data);
            setSelectedSurah("");
            setSelectedAyat("");
            setCurrentHal(pageId.toString());

            if (data && data.length > 0) {
                setCurrentJuz(data[0].no_juz ? data[0].no_juz.toString() : "");
            }

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

            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            setError('Failed to load page data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch verses by juz
    const fetchJuz = async(juzId) => {
        setLoading(true);
        setError(null);

        try {
            const data = await quranApi.getJuzVerses(juzId);
            setQuranContent(data);
            setCurrentJuz(juzId.toString());
            setSelectedSurah("");
            setSelectedAyat("");

            if (data && data.length > 0) {
                setCurrentHal(data[0].no_hal ? data[0].no_hal.toString() : "");
            }

            setSurahDetails({
                nm_surat: `Juz ${juzId}`,
                arti_surat: data && data.length > 0 ?
                    `Dimulai dari ${data[0].surah_name || ''}` : ""
            });

            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            setError('Failed to load juz data');
        } finally {
            setLoading(false);
        }
    };

    // Search the Quran for specific text
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
            console.error(error);
            setError('Failed to complete search');
        } finally {
            setLoading(false);
        }
    };

    // Generate ayat options based on selected surah
    const generateAyatOptions = () => {
        if (!selectedSurah) return [];

        const surah = surahList.find(s => s.no_surat === parseInt(selectedSurah));
        if (!surah) return [];

        const ayatOptions = [];
        for (let i = 1; i <= surah.jml_ayat; i++) {
            ayatOptions.push({ value: i.toString(), label: i.toString() });
        }
        return ayatOptions;
    };

    // Handle surah selection change
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

    // Handle ayat selection change
    const handleAyatChange = (e) => {
        const ayatId = e.target.value;
        setSelectedAyat(ayatId);

        if (selectedSurah && ayatId) {
            fetchAyat(selectedSurah, ayatId);
        } else if (selectedSurah) {
            fetchAyat(selectedSurah);
        }
    };

    // Handle juz selection
    const handleJuzChange = (e) => {
        const juzId = e.target.value;
        if (!juzId) return;

        setCurrentJuz(juzId);
        fetchJuz(juzId);
    };

    // Handle page selection
    const handlePageChange = (e) => {
        const pageId = e.target.value;
        if (!pageId) return;

        setCurrentHal(pageId);
        fetchByPage(pageId);
    };

    // Navigate to previous page
    const goToPreviousPage = () => {
        const current = parseInt(currentHal) || 1;
        if (current > 1) {
            const prevPage = current - 1;
            setCurrentHal(prevPage.toString());
            fetchByPage(prevPage.toString());
        }
    };

    // Navigate to next page
    const goToNextPage = () => {
        const current = parseInt(currentHal) || 1;
        if (current < 604) {
            const nextPage = current + 1;
            setCurrentHal(nextPage.toString());
            fetchByPage(nextPage.toString());
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchText.trim()) {
            searchQuran(searchText);
        }
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Check if the current content is at the last item (surah, page or juz)
    const isAtEndOfContent = () => {
        if (!quranContent || quranContent.length === 0) return false;

        const lastItem = quranContent[quranContent.length - 1];

        if (selectedSurah && surahDetails) {
            return lastItem.no_ayat === surahDetails.jml_ayat;
        } else if (currentHal) {
            return quranContent.filter(item =>
                item.no_hal === lastItem.no_hal &&
                item.no_ayat > lastItem.no_ayat
            ).length === 0;
        } else if (currentJuz) {
            return quranContent.filter(item =>
                item.no_juz === lastItem.no_juz &&
                (item.no_surat > lastItem.no_surat ||
                    (item.no_surat === lastItem.no_surat && item.no_ayat > lastItem.no_ayat))
            ).length === 0;
        }

        return false;
    };

    // Determine the next content to navigate to
    const getNextContent = () => {
        if (selectedSurah) {
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
            const pageNum = parseInt(currentHal);
            if (pageNum < 604) {
                return {
                    type: 'page',
                    item: {
                        number: pageNum + 1
                    }
                };
            }
        } else if (currentJuz) {
            const juzNum = parseInt(currentJuz);
            if (juzNum < 30) {
                return {
                    type: 'juz',
                    item: {
                        number: juzNum + 1
                    }
                };
            }
        }

        return null;
    };

    // Handle navigation to next content (surah, page, juz)
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

        // Continue functionality
        isAtEndOfContent,
        getNextContent,
        handleContinueToNext
    };
};

export default useQuran;