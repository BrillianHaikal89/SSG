"use client";

import React from 'react';

const DEFAULT_FORM_DATA = {
  date: new Date().toISOString().split('T')[0],
  sholat_wajib: 0,
  sholat_tahajud: false,
  sholat_dhuha: 0,
  sholat_rawatib: 0,
  sholat_sunnah_lainnya: 0,
  tilawah_quran: false,
  terjemah_quran: false,
  shaum_sunnah: false,
  shodaqoh: false,
  dzikir_pagi_petang: false,
  istighfar_1000x: 0,
  sholawat_100x: 0,
  menyimak_mq_pagi: false,
  haid: false
};

const MutabaahFormSections = ({ 
  formData, 
  handleInputChange, 
  headerBgColor,
  isSubmitting 
}) => {
  // Input sections data for rendering
  const sholatSection = [
    { label: "Sholat Wajib 5 waktu", field: "sholat_wajib", max: 5, type: "number" },
    { label: "Sholat Tahajud & atau Witir 3 rakaat/hari", field: "sholat_tahajud", type: "checkbox" },
    { label: "Sholat Dhuha 4 rakaat", field: "sholat_dhuha", max: 8, type: "number" },
    { label: "Sholat Rawatib 10 rakaat", field: "sholat_rawatib", max: 12, type: "number" },
    { label: "Sholat Sunnah Lainnya 6 rakaat", field: "sholat_sunnah_lainnya", max: 10, type: "number" },
  ];

  const quranSection = [
    { label: "Tilawah Quran (1 Halaman)", field: "tilawah_quran", type: "checkbox" },
    { label: "Terjemah Quran (1 Halaman)", field: "terjemah_quran", type: "checkbox" },
  ];

  const sunnahSection = [
    { label: "Shaum Sunnah (3x/bulan)", field: "shaum_sunnah", type: "checkbox" },
    { label: "Shodaqoh Maal", field: "shodaqoh", type: "checkbox" },
    { label: "Dzikir Pagi/Petang", field: "dzikir_pagi_petang", type: "checkbox" },
    { label: "Istighfar (x100)", field: "istighfar_1000x", max: 15, type: "number" },
    { label: "Sholawat (x100)", field: "sholawat_100x", max: 15, type: "number" },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Haid Checkbox */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.haid}
            onChange={(e) => handleInputChange('haid', e.target.checked)}
            className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-red-600 rounded focus:ring-red-500" 
          />
          <span className="ml-2 text-xs sm:text-sm text-gray-700">
            Sedang berhalangan (haid/menstruasi) dan tidak dapat melaksanakan sholat
          </span>
        </label>
      </div>

      {/* Sholat Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">
          1.1 Sholat Wajib dan Sunnah
        </h2>
        
        <div className="space-y-3 sm:space-y-4">
          {sholatSection.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">{item.label}</span>
              
              {item.type === "checkbox" ? (
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData[item.field]}
                    onChange={(e) => handleInputChange(item.field, e.target.checked)}
                    className={`form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500 ${
                      formData.haid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={formData.haid && item.field === 'sholat_tahajud'}
                  />
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  max={item.max}
                  value={formData[item.field]}
                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                  className={`shadow border rounded py-1 sm:py-2 px-2 sm:px-3 w-16 sm:w-20 text-gray-700 focus:outline-none focus:shadow-outline text-sm ${
                    formData.haid ? 'bg-gray-200 cursor-not-allowed' : ''
                  }`}
                  disabled={formData.haid}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quran Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">
          1.2 Aktivitas Quran
        </h2>
        
        <div className="space-y-3 sm:space-y-4">
          {quranSection.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">{item.label}</span>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData[item.field]}
                  onChange={(e) => handleInputChange(item.field, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sunnah Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">
          1.3 Aktivitas Sunnah
        </h2>
        
        <div className="space-y-3 sm:space-y-4">
          {sunnahSection.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-700 flex-1 pr-2">{item.label}</span>
              
              {item.type === "checkbox" ? (
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData[item.field]}
                    onChange={(e) => handleInputChange(item.field, e.target.checked)}
                    className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                  />
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  max={item.max}
                  value={formData[item.field]}
                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                  className="shadow border rounded py-1 sm:py-2 px-2 sm:px-3 w-16 sm:w-20 text-gray-700 focus:outline-none focus:shadow-outline text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MQ Pagi Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 border-b pb-2">
          2.1 Menyimak MQ Pagi
        </h2>
        
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-700">Menyimak MQ Pagi</span>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={formData.menyimak_mq_pagi}
              onChange={(e) => handleInputChange('menyimak_mq_pagi', e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutabaahFormSections;