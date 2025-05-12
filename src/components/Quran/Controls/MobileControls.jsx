import React from 'react';
import FontSizeSelector from '../Content/FontSizeSelector';

const MobileControls = ({
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
  lastBookmark
}) => {
  return (
    <div className="sm:hidden bg-white shadow-md p-3 mb-4 sticky top-0 z-10">
      <div className="flex flex-col gap-3">
        {/* Bookmark button */}
        {lastBookmark && (
          <button
            onClick={() => handleContinueToBookmark()}
            className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            Lanjutkan dari terakhir dibaca
          </button>
        )}

        {/* Surah selector */}
        <div>
          <label htmlFor="surah-select-mobile" className="block text-sm font-medium text-gray-700 mb-1">
            Surah
          </label>
          <select
            id="surah-select-mobile"
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
          <div>
            <label htmlFor="ayat-select-mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Ayat
            </label>
            <select
              id="ayat-select-mobile"
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
        <div>
          <label htmlFor="juz-select-mobile" className="block text-sm font-medium text-gray-700 mb-1">
            Juz
          </label>
          <select
            id="juz-select-mobile"
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
        <div>
          <label htmlFor="page-select-mobile" className="block text-sm font-medium text-gray-700 mb-1">
            Halaman
          </label>
          <select
            id="page-select-mobile"
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

        {/* Search */}
        <div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Cari dalam Al-Quran..."
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
            >
              Cari
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;