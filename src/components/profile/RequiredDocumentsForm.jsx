"use client";

import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../stores/authStore';

// Jika menggunakan toast, pastikan sudah terinstall
// import toast from 'react-hot-toast';
// Alternatif jika tidak ingin install package baru
const toast = {
  success: (msg) => console.log('Success:', msg),
  error: (msg) => console.log('Error:', msg)
};

const RequiredDocumentsForm = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const docTypesOrder = ['ktp', 'pasFoto', 'suratIzin', 'suratSehat', 'buktiPembayaran', 'digitalSignature'];
  const currentDocType = docTypesOrder[currentStep];
  const { user, role } = useAuthStore();
  const [documents, setDocuments] = useState({
    ktp: null,
    pasFoto: null,
    suratIzin: null,
    suratSehat: null,
    buktiPembayaran: null,
    digitalSignature: null
  });
  const [previews, setPreviews] = useState({
    ktp: null,
    pasFoto: null,
    suratIzin: null,
    suratSehat: null,
    buktiPembayaran: null,
    digitalSignature: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs untuk file inputs
  const fileInputRefs = {
    ktp: useRef(null),
    pasFoto: useRef(null),
    suratIzin: useRef(null),
    suratSehat: useRef(null),
    buktiPembayaran: useRef(null),
    digitalSignature: useRef(null)
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
      description: "Unggah pas foto terbaru",
      formats: "JPG atau PNG",
      maxSize: "1MB"
    },
    suratIzin: {
      label: "Surat Izin",
      description: "Unggah surat izin yang ditandatangani",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB"
    },
    suratSehat: {
      label: "Surat Sehat",
      description: "Unggah surat keterangan sehat dari dokter",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB"
    },
    buktiPembayaran: {
      label: "Bukti Bayar",
      description: "Unggah bukti transfer atau pembayaran",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB"
    },
    digitalSignature: {
      label: "Tanda Tangan",
      description: "Unggah file tanda tangan Anda",
      formats: "JPG atau PNG",
      maxSize: "1MB"
    }
  };

  // Load documents from API on component mount
  useEffect(() => {
    try {
      const fetchUserDocuments = async () => {
        if (!user?.userId) return;
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
          console.warn("API URL tidak tersedia, menggunakan data contoh");
          return;
        }
        
        try {
          const response = await fetch(`${API_URL}/users/user-files?userId=${user.userId}`);
          if (!response.ok) return;
          
          const data = await response.json();
          
          if (data.files && Array.isArray(data.files)) {
            const tempDocuments = { ...documents };
            const tempPreviews = { ...previews };
            
            data.files.forEach(file => {
              const backendToFrontendMap = {
                'ktp': 'ktp',
                'pas_foto': 'pasFoto',
                'surat_izin': 'suratIzin',
                'surat_kesehatan': 'suratSehat',
                'bukti_pembayaran': 'buktiPembayaran',
                'tertanda': 'digitalSignature'
              };
              
              const frontendDocType = backendToFrontendMap[file.file_type];
              
              if (frontendDocType) {
                tempPreviews[frontendDocType] = file.drive_link;
                tempDocuments[frontendDocType] = {
                  name: file.file_name,
                  type: 'application/octet-stream', // Simplified to avoid errors
                  fromServer: true,
                  url: file.drive_link
                };
              }
            });
            
            setPreviews(tempPreviews);
            setDocuments(tempDocuments);
          }
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      };
      
      fetchUserDocuments();
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [user]);
    
  const handleFileChange = (e, documentType) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // Store the file object
          setDocuments(prev => ({
            ...prev,
            [documentType]: file
          }));
          
          setPreviews(prev => ({
            ...prev,
            [documentType]: event.target.result
          }));
        } catch (error) {
          console.error("Error setting file data:", error);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        console.error("File reading error");
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling file:", error);
      setIsUploading(false);
    }
  };

  // Handle document deletion for a specific type
  const handleDeleteDocument = (documentType) => {
    try {
      // Update states
      setDocuments(prev => ({
        ...prev,
        [documentType]: null
      }));
      
      setPreviews(prev => ({
        ...prev,
        [documentType]: null
      }));
      
      // Clear file input
      if (fileInputRefs[documentType]?.current) {
        fileInputRefs[documentType].current.value = '';
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Simplified submit function
  const handleSubmit = async () => {
    try {
      const missingDocs = docTypesOrder.filter(docType => !documents[docType]);
      
      if (missingDocs.length > 0) {
        alert(`Masih ada dokumen yang belum diupload: ${missingDocs.map(d => documentTypes[d].label).join(', ')}`);
        setCurrentStep(docTypesOrder.indexOf(missingDocs[0]));
        return;
      }
      
      setIsSubmitting(true);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        alert("URL API tidak ditemukan");
        setIsSubmitting(false);
        return;
      }
      
      const formData = new FormData();
      docTypesOrder.forEach(docType => {
        if (documents[docType]) {
          formData.append('files', documents[docType]);
        }
      });
      
      const response = await fetch(`${API_URL}/users/upload-files?id=${user?.userId}`, {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        alert("Semua dokumen berhasil dikirim!");
        
        // Reset state
        setDocuments({
          ktp: null,
          pasFoto: null,
          suratIzin: null,
          suratSehat: null,
          buktiPembayaran: null,
          digitalSignature: null
        });
        setPreviews({
          ktp: null,
          pasFoto: null,
          suratIzin: null,
          suratSehat: null,
          buktiPembayaran: null,
          digitalSignature: null
        });
        setCurrentStep(0);
      } else {
        alert("Gagal mengupload dokumen. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576) + ' MB';
  };

  // Safety check
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md mb-4 p-4">
        <p className="text-center">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-2 md:mb-0">
            <h2 className="text-lg font-medium">Dokumen Persyaratan</h2>
            <p className="text-sm text-gray-500">Unggah dokumen yang diperlukan</p>
          </div>
          <div>
            <button 
              type="button"
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 transition-transform duration-200 ${isFormVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {isFormVisible ? 'Tutup' : 'Lihat'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Collapsible Content */}
      <div className={`transition-all duration-300 overflow-hidden ${isFormVisible ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4">
          {/* Stepper - simplified for mobile */}
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max justify-between">
              {docTypesOrder.map((docType, index) => (
                <div key={docType} className="flex flex-col items-center mx-2">
                  <button 
                    onClick={() => setCurrentStep(index)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
                      ${index === currentStep ? 'bg-blue-500 text-white' : 
                        documents[docTypesOrder[index]] ? 'bg-green-500 text-white' : 
                        'bg-gray-200 text-gray-500'}
                    `}
                  >
                    {documents[docTypesOrder[index]] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </button>
                  <span className="text-xs mt-1 text-center">
                    {documentTypes[docType].label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Document upload section */}
          <div className="border rounded-lg p-4 mb-4 mt-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h3 className="text-md font-medium">{documentTypes[currentDocType].label}</h3>
                <p className="text-sm text-gray-500 mt-1">{documentTypes[currentDocType].description}</p>
                <p className="text-xs text-gray-400">Format: {documentTypes[currentDocType].formats} (Maks: {documentTypes[currentDocType].maxSize})</p>
              </div>
              
              <div>
                {!documents[currentDocType] && (
                  <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                    Unggah
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, currentDocType)} 
                      accept="image/jpeg,image/png,application/pdf"
                      ref={fileInputRefs[currentDocType]}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {/* Uploading indicator */}
            {isUploading && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Mengunggah...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
                </div>
              </div>
            )}
            
            {/* Document preview/info */}
            {documents[currentDocType] && (
              <div className="mt-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {/* Icon sesuai dengan tipe file */}
                      <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {documents[currentDocType].name || `Document-${currentDocType}.${documents[currentDocType].type?.includes('pdf') ? 'pdf' : 'jpg'}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {documents[currentDocType].size ? formatFileSize(documents[currentDocType].size) : ''} • {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteDocument(currentDocType)}
                      className="p-1 hover:bg-red-100 rounded-full text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Preview section - simplified */}
                  {previews[currentDocType] && (
                    <div className="mt-3">
                      {/* View Document Button */}
                      <div className="flex justify-center">
                        <a 
                          href={previews[currentDocType]} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Lihat Dokumen
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-200 rounded-md text-sm disabled:opacity-50"
            >
              Kembali
            </button>
            
            {currentStep < docTypesOrder.length - 1 ? (
              <button
                onClick={() => {
                  if (documents[currentDocType]) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    alert(`Harap upload ${documentTypes[currentDocType].label} terlebih dahulu`);
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
              >
                Lanjut
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!documents[currentDocType] || isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </>
                ) : "Kirim Semua"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequiredDocumentsForm;