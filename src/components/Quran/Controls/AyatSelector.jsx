import React from 'react';

const AyatSelector = ({ value, onChange, ayatOptions, disabled }) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="block w-full h-10 appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 disabled:bg-gray-200 disabled:text-gray-500"
        aria-label="Select Ayat"
      >
        <option value="">Ayat</option>
        {ayatOptions.map(ayat => (
          <option key={ayat.value} value={ayat.value}>
            {ayat.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
};

export default AyatSelector;