import React from 'react';

const DesktopControls = ({
  selectedSurah,
  handleSurahChange,
  surahList,
  selectedAyat,
  handleAyatChange,
  ayatOptions,
  currentHal,
  handlePageChange,
  currentJuz,
  handleJuzChange,
  searchText,
  handleSearchChange,
  handleSearch,
  lastBookmark,
  continueFromBookmark
}) => {
  return (
    <div className="hidden sm:block bg-white shadow-md p-4 mb-6 sticky top-0 z-10">
      <div className="flex flex-wrap items-center gap-4">
        {/* Surah selector */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="surah-select" className="block text-sm font-medium text-gray-700 mb-1">
            Surah
          </label>
          <select
            id="surah-select"
            value={selectedSurah}
            onChange={handleSurahChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Pilih Surah</option>
            {surahList.map((surah) => (
              <option key={surah.no_surat} value={surah.no_surat}>
                {surah.no_surat}. {surah.nm_surat} ({surah.arti_surat})
              </option>
            ))}
          </select>
        </div>

        {/* Ayat selector */}
        {selectedSurah && (
          <div className="flex-1 min-w-[120px]">
            <label htmlFor="ayat-select" className="block text-sm font-medium text-gray-700 mb-1">
              Ayat
            </label>
            <select
              id="ayat-select"
              value={selectedAyat}
              onChange={handleAyatChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Semua Ayat</option>
              {ayatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Ayat {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Juz selector */}
        <div className="flex-1 min-w-[100px]">
          <label htmlFor="juz-select" className="block text-sm font-medium text-gray-700 mb-1">
            Juz
          </label>
          <select
            id="juz-select"
            value={currentJuz}
            onChange={handleJuzChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Pilih Juz</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
              <option key={juz} value={juz}>
                Juz {juz}
              </option>
            ))}
          </select>
        </div>

        {/* Page selector */}
        <div className="flex-1 min-w-[120px]">
          <label htmlFor="page-select" className="block text-sm font-medium text-gray-700 mb-1">
            Halaman
          </label>
          <select
            id="page-select"
            value={currentHal}
            onChange={handlePageChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Pilih Halaman</option>
            {Array.from({ length: 604 }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                Halaman {page}
              </option>
            ))}
          </select>
        </div>

        {/* Search and Bookmark */}
        <div className="flex-1 min-w-[300px] flex gap-2">
          {/* Bookmark button */}
          {lastBookmark && (
            <button
              onClick={continueFromBookmark}
              className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-200 transition-colors whitespace-nowrap"
              title="Lanjutkan dari terakhir dibaca"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              <span className="hidden md:inline">Terakhir</span>
            </button>
          )}

          {/* Search input */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Cari dalam Al-Quran..."
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Cari
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DesktopControls;