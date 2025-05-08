"use client";

import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RequiredDocumentsForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const docTypesOrder = ['ktp', 'pasFoto', 'suratIzin', 'suratSehat', 'buktiPembayaran', 'digitalSignature'];
  const currentDocType = docTypesOrder[currentStep];
  const { user, role } = useAuthStore();

  // Check if mobile on component mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical breakpoint for mobile
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // [Keep all your existing state and functions here...]
  // (All the useState, useRef, and handler functions remain exactly the same)

  /* Mobile Layout */
  if (isMobile) {
    return (
      <div className="p-4 max-w-md mx-auto">
        {/* Simplified Stepper - Numbers Only */}
        <div className="flex justify-between mb-6">
          {docTypesOrder.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="border rounded-lg p-4 mb-6 bg-white shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-md font-medium">{documentTypes[currentDocType].label}</h3>
              <p className="text-xs text-gray-500 mt-1">{documentTypes[currentDocType].description}</p>
              <p className="text-xs text-gray-400">Format: {documentTypes[currentDocType].formats} (Maks: {documentTypes[currentDocType].maxSize})</p>
            </div>
            
            {!documents[currentDocType] && currentDocType !== 'digitalSignature' && (
              <label className={`inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${uploadingStatus[currentDocType] ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Unggah Dokumen
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(e, currentDocType)} 
                  accept={currentDocType === 'pasFoto' ? "image/jpeg,image/png" : "image/jpeg,image/png,application/pdf"}
                  ref={fileInputRefs[currentDocType]}
                  disabled={uploadingStatus[currentDocType]}
                />
              </label>
            )}

            {/* Digital Signature for Mobile */}
            {currentDocType === 'digitalSignature' && !documents.digitalSignature && (
              <div className="mt-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-48 border border-gray-300 bg-white rounded cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  
                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={clearSignature}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={saveSignature}
                      disabled={!signatureExists}
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white ${signatureExists ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                      Simpan Tanda Tangan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Document preview */}
            {documents[currentDocType] && (
              <div className="mt-3">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                        {documents[currentDocType].type.startsWith('image/') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {documents[currentDocType].name || 'Document'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(documents[currentDocType].size)}
                        </p>
                      </div>
                    </div>
                    
                    {role === '0a' && (
                      <button 
                        onClick={() => handleDeleteDocument(currentDocType)}
                        className="p-1 hover:bg-red-100 rounded-full text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {previews[currentDocType] && documents[currentDocType].type.startsWith('image/') && (
                    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white mt-2">
                      <img 
                        src={previews[currentDocType]} 
                        className="w-full h-auto max-h-48 object-contain mx-auto" 
                        alt="Document preview"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 flex-1"
          >
            Kembali
          </button>
          
          {currentStep < docTypesOrder.length - 1 ? (
            <button
              onClick={() => {
                if (documents[currentDocType]) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  toast.error(`Harap upload dokumen terlebih dahulu`);
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex-1"
            >
              Lanjut
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!documents[currentDocType] || isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 flex-1 flex items-center justify-center"
            >
              {isSubmitting ? 'Mengirim...' : "Kirim"}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* Desktop Layout */
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Original desktop layout code goes here */}
      {/* [Keep your original desktop layout code exactly as it was] */}
    </div>
  );
};

export default RequiredDocumentsForm;