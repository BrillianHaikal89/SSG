"use client";

import React, { useState, useEffect, useRef } from 'react';

const RequiredDocumentsForm = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [documents, setDocuments] = useState({
    ktp: null,
    pasFoto: null,
    suratIzin: null,
    suratSehat: null,
    buktiPembayaran: null
  });
  const [previews, setPreviews] = useState({
    ktp: null,
    pasFoto: null,
    suratIzin: null,
    suratSehat: null,
    buktiPembayaran: null
  });
  const [uploadingStatus, setUploadingStatus] = useState({
    ktp: false,
    pasFoto: false,
    suratIzin: false,
    suratSehat: false,
    buktiPembayaran: false
  });
  const fileInputRefs = {
    ktp: useRef(null),
    pasFoto: useRef(null),
    suratIzin: useRef(null),
    suratSehat: useRef(null),
    buktiPembayaran: useRef(null)
  };

  // Document type labels and descriptions
  const documentTypes = {
    ktp: {
      label: "KTP",
      description: "Unggah foto KTP/Kartu Pelajar",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB"
    },
    pasFoto: {
      label: "Pas Foto",
      description: "Unggah pas foto terbaru (3x4, latar belakang merah/biru)",
      formats: "JPG atau PNG",
      maxSize: "1MB"
    },
    suratIzin: {
      label: "Surat Izin Orang Tua/Wali",
      description: "Unggah surat izin yang telah ditandatangani",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB"
    },
    suratSehat: {
      label: "Surat Keterangan Sehat",
      description: "Unggah surat keterangan sehat dari dokter",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB"
    },
    buktiPembayaran: {
      label: "Bukti Pembayaran",
      description: "Unggah bukti transfer atau pembayaran",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB"
    }
  };

  // Load documents from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedDocuments = JSON.parse(localStorage.getItem('requiredDocuments') || '{}');
        
        // Initialize documents and previews based on stored data
        const initialDocuments = { ...documents };
        const initialPreviews = { ...previews };
        
        // For each document type, check if there's stored data
        Object.keys(documentTypes).forEach(type => {
          if (storedDocuments[type]) {
            initialDocuments[type] = {
              name: storedDocuments[type].name,
              type: storedDocuments[type].type,
              size: storedDocuments[type].size,
              uploadDate: storedDocuments[type].uploadDate
            };
            
            // If there's a data URL, use it for preview
            if (storedDocuments[type].dataUrl) {
              initialPreviews[type] = storedDocuments[type].dataUrl;
            }
          }
        });
        
        setDocuments(initialDocuments);
        setPreviews(initialPreviews);
      } catch (error) {
        console.error("Error loading documents:", error);
      }
    }
  }, []);

  // Handle file selection for a specific document type
  const handleFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Start uploading
    setUploadingStatus(prev => ({ ...prev, [documentType]: true }));
    
    // Create file preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      
      // Store file info and preview
      const docInfo = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        dataUrl: dataUrl
      };
      
      // Simulate upload delay
      setTimeout(() => {
        // Update documents state
        setDocuments(prev => ({
          ...prev,
          [documentType]: docInfo
        }));
        
        // Update preview
        setPreviews(prev => ({
          ...prev,
          [documentType]: dataUrl
        }));
        
        // Save to localStorage
        const currentDocs = JSON.parse(localStorage.getItem('requiredDocuments') || '{}');
        localStorage.setItem('requiredDocuments', JSON.stringify({
          ...currentDocs,
          [documentType]: docInfo
        }));
        
        // End uploading status
        setUploadingStatus(prev => ({ ...prev, [documentType]: false }));
      }, 1000);
    };
    
    reader.readAsDataURL(file);
  };

  // Handle document deletion for a specific type
  const handleDeleteDocument = (documentType) => {
    // Update states
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
    
    setPreviews(prev => ({
      ...prev,
      [documentType]: null
    }));
    
    // Update localStorage
    const currentDocs = JSON.parse(localStorage.getItem('requiredDocuments') || '{}');
    delete currentDocs[documentType];
    localStorage.setItem('requiredDocuments', JSON.stringify(currentDocs));
    
    // Clear file input
    if (fileInputRefs[documentType].current) {
      fileInputRefs[documentType].current.value = '';
    }
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Dokumen Wajib</h2>
          <p className="text-xs text-gray-500">Unggah dokumen-dokumen yang diperlukan</p>
        </div>
        <div className="flex space-x-2">
          <button 
            type="button"
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 transition-transform duration-200 ${isFormVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {isFormVisible ? 'Tutup' : 'Lihat Dokumen'}
          </button>
        </div>
      </div>
      
      {/* Collapsible Form Content */}
      <div className={`transition-all duration-300 overflow-hidden ${isFormVisible ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Document Upload Sections */}
            {Object.keys(documentTypes).map(docType => (
              <div key={docType} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-medium">{documentTypes[docType].label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{documentTypes[docType].description}</p>
                    <p className="text-xs text-gray-400">Format: {documentTypes[docType].formats} (Maks: {documentTypes[docType].maxSize})</p>
                  </div>
                  
                  {!documents[docType] && (
                    <label className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${uploadingStatus[docType] ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                      Unggah
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileChange(e, docType)} 
                        accept={docType === 'pasFoto' ? "image/jpeg,image/png" : "image/jpeg,image/png,application/pdf"}
                        ref={fileInputRefs[docType]}
                        disabled={uploadingStatus[docType]}
                      />
                    </label>
                  )}
                </div>
                
                {/* Uploading indicator */}
                {uploadingStatus[docType] && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Mengunggah...</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-full"></div>
                    </div>
                  </div>
                )}
                
                {/* Document preview/info */}
                {documents[docType] && !uploadingStatus[docType] && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        {/* Preview for image files */}
                        {previews[docType] && documents[docType].type.startsWith('image/') && (
                          <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0 border bg-white">
                            <img 
                              src={previews[docType]} 
                              alt={`Preview ${documentTypes[docType].label}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Icon for PDF files */}
                        {documents[docType].type === 'application/pdf' && (
                          <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-md mr-3 flex-shrink-0 border">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                            {documents[docType].name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(documents[docType].size)} • {new Date(documents[docType].uploadDate).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteDocument(docType)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequiredDocumentsForm;