"use client";

import React from 'react';

const FormComponentBase = ({ 
  title, 
  subtitle, 
  isFormVisible, 
  setIsFormVisible, 
  isEditing, 
  onEdit, 
  onAddNew, 
  onSave, 
  hasData,
  children 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="p-3 md:p-4 border-b">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-2 md:mb-0">
            <h2 className="text-base md:text-lg font-medium">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              type="button"
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs md:text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 md:h-4 md:w-4 mr-1 transition-transform duration-200 ${isFormVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {isFormVisible ? 'Tutup' : 'Lihat Data'}
            </button>
            
            {isFormVisible && !isEditing && (
              <>
                <button 
                  type="button"
                  onClick={onEdit}
                  className={`${!hasData ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded-md text-xs md:text-sm flex items-center`}
                  disabled={!hasData}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
                
                <button 
                  type="button"
                  onClick={onAddNew}
                  className={`${hasData ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded-md text-xs md:text-sm flex items-center`}
                  disabled={hasData}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah
                </button>
              </>
            )}
            
            {isEditing && (
              <button 
                type="button"
                onClick={onSave}
                className="bg-green-500 text-white px-3 py-1 rounded-md text-xs md:text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Selesai
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Collapsible Form Content */}
      <div className={`transition-all duration-300 overflow-hidden ${isFormVisible || isEditing ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-3 md:p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormComponentBase;