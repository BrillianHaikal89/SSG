import React from 'react';
import SurahSelector from './SurahSelector';
import AyatSelector from './AyatSelector';
import SearchBar from './SearchBar';

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
  handleSearch
}) => {
  return (
    <div className="bg-blue-100 py-4 hidden sm:block sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Surah Selection */}
            <SurahSelector 
              value={selectedSurah}
              onChange={handleSurahChange}
              surahList={surahList}
              isMobile={false}
            />
            
            {/* Ayat Selection */}
            <AyatSelector 
              value={selectedAyat}
              onChange={handleAyatChange}
              ayatOptions={ayatOptions}
              disabled={!selectedSurah}
            />
          </div>
          
          {/* Display Options for Desktop */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={currentHal}
                onChange={handlePageChange}
                className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                aria-label="Select Page"
              >
                <option value="">Hal</option>
                {Array.from({ length: 604 }, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <select
                value={currentJuz}
                onChange={handleJuzChange}
                className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                aria-label="Select Juz"
              >
                <option value="">Juz</option>
                {Array.from({ length: 30 }, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            {/* Search Bar next to page selector */}
            <div className="w-64">
              <SearchBar 
                value={searchText}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopControls;