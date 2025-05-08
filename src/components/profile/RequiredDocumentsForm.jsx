"use client";

import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RequiredDocumentsForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user, role } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on component mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Document configuration
  const DOCUMENT_TYPES = {
    ktp: {
      id: 'ktp',
      label: "KTP",
      description: "Upload foto KTP/Kartu Pelajar",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB",
      backendType: "ktp",
      accept: "image/*,application/pdf"
    },
    pasFoto: {
      id: 'pasFoto',
      label: "Pas Foto",
      description: "Upload pas foto terbaru (3x4)",
      formats: "JPG atau PNG",
      maxSize: "1MB",
      backendType: "pas_foto",
      accept: "image/*"
    },
    suratIzin: {
      id: 'suratIzin',
      label: "Surat Izin",
      description: "Upload surat izin orang tua/wali",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB",
      backendType: "surat_izin",
      accept: "image/*,application/pdf"
    },
    suratSehat: {
      id: 'suratSehat',
      label: "Surat Sehat",
      description: "Upload surat keterangan sehat",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB",
      backendType: "surat_kesehatan",
      accept: "image/*,application/pdf"
    },
    buktiPembayaran: {
      id: 'buktiPembayaran',
      label: "Bukti Bayar",
      description: "Upload bukti pembayaran",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB",
      backendType: "bukti_pembayaran",
      accept: "image/*,application/pdf"
    },
    tandaTangan: {
      id: 'tandaTangan',
      label: "Tanda Tangan",
      description: "Upload tanda tangan digital",
      formats: "JPG atau PNG",
      maxSize: "1MB",
      backendType: "digital_signature",
      accept: "image/*"
    }
  };

  const DOCUMENT_ORDER = ['ktp', 'pasFoto', 'suratIzin', 'suratSehat', 'buktiPembayaran', 'tandaTangan'];
  const currentDocType = DOCUMENT_ORDER[currentStep];

  // Initialize state
  const initialState = DOCUMENT_ORDER.reduce((acc, docType) => {
    acc[docType] = null;
    return acc;
  }, {});

  const [documents, setDocuments] = useState(initialState);
  const [previews, setPreviews] = useState(initialState);
  const fileInputRef = useRef(null);

  // Load existing documents
  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        const res = await fetch(`${API_URL}/users/user-files?userId=${user.userId}`);
        if (!res.ok) throw new Error("Gagal mengambil data dokumen");

        const data = await res.json();
        const initialPreviews = { ...initialState };
        const initialDocuments = { ...initialState };

        if (data.files && Array.isArray(data.files)) {
          data.files.forEach(file => {
            const docMap = {
              'ktp': 'ktp',
              'pas_foto': 'pasFoto',
              'surat_izin': 'suratIzin',
              'surat_kesehatan': 'suratSehat',
              'bukti_pembayaran': 'buktiPembayaran',
              'digital_signature': 'tandaTangan'
            };

            const frontendType = docMap[file.file_type];
            if (frontendType) {
              initialPreviews[frontendType] = file.drive_link;
              initialDocuments[frontendType] = {
                name: file.file_name,
                type: file.file_name.endsWith('.pdf') ? 'application/pdf' : 'image/*',
                size: file.file_size || 0,
                url: file.drive_link
              };
            }
          });

          setPreviews(initialPreviews);
          setDocuments(initialDocuments);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    if (user?.userId) fetchUserDocuments();
  }, [user]);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (currentDocType === 'pasFoto' && !file.type.startsWith('image/')) {
      toast.error("Pas Foto harus berupa gambar");
      return;
    }

    if (currentDocType === 'tandaTangan' && !file.type.startsWith('image/')) {
      toast.error("Tanda tangan harus berupa gambar");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setDocuments(prev => ({ ...prev, [currentDocType]: file }));
      setPreviews(prev => ({ ...prev, [currentDocType]: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle document delete
  const handleDeleteDocument = () => {
    setDocuments(prev => ({ ...prev, [currentDocType]: null }));
    setPreviews(prev => ({ ...prev, [currentDocType]: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form submission
  const handleSubmit = async () => {
    const missingDocs = DOCUMENT_ORDER.filter(docType => !documents[docType]);
    if (missingDocs.length > 0) {
      setCurrentStep(DOCUMENT_ORDER.indexOf(missingDocs[0]));
      toast.error(`Lengkapi dokumen ${DOCUMENT_TYPES[missingDocs[0]].label} terlebih dahulu`);
      return;
    }

    const formData = new FormData();
    DOCUMENT_ORDER.forEach(docType => {
      if (documents[docType]) formData.append('files', documents[docType]);
    });

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/users/upload-files?id=${user.userId}`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        toast.success("Semua dokumen berhasil dikirim!");
        setDocuments(initialState);
        setPreviews(initialState);
        setCurrentStep(0);
      } else {
        const error = await response.json();
        toast.error(error.message || "Gagal mengupload dokumen");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengupload");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Stepper - Mobile shows only numbers */}
      <div className="flex justify-between mb-6 overflow-x-auto pb-2">
        {DOCUMENT_ORDER.map((docType, index) => (
          <div 
            key={docType} 
            className="flex flex-col items-center min-w-[40px] cursor-pointer"
            onClick={() => setCurrentStep(index)}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                ${index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </div>
            {!isMobile && (
              <span className="text-xs mt-1 text-center whitespace-nowrap">
                {DOCUMENT_TYPES[docType].label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Current Document Content */}
      <div className="border rounded-lg p-4 mb-6 bg-white shadow-sm">
        {isMobile ? (
          <>
            <h3 className="text-md font-medium mb-2">{DOCUMENT_TYPES[currentDocType].label}</h3>
            <p className="text-sm text-gray-600 mb-3">{DOCUMENT_TYPES[currentDocType].description}</p>
          </>
        ) : (
          <div className="mb-4">
            <h3 className="text-md font-medium">{DOCUMENT_TYPES[currentDocType].label}</h3>
            <p className="text-xs text-gray-500 mt-1">{DOCUMENT_TYPES[currentDocType].description}</p>
            <p className="text-xs text-gray-400">Format: {DOCUMENT_TYPES[currentDocType].formats} (Maks: {DOCUMENT_TYPES[currentDocType].maxSize})</p>
          </div>
        )}

        {!documents[currentDocType] ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={DOCUMENT_TYPES[currentDocType].accept}
              className="hidden"
              id="document-upload"
            />
            <label 
              htmlFor="document-upload"
              className={`block w-full py-2 px-3 text-center rounded-md text-white
                ${isMobile ? 'bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isMobile ? 'Upload File' : 'Unggah Dokumen'}
            </label>
          </>
        ) : (
          <div className={`${isMobile ? 'bg-gray-50 p-3 rounded border' : 'bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm'}`}>
            <div className={`flex ${isMobile ? 'flex-col sm:flex-row' : 'flex-row'} items-start sm:items-center justify-between gap-3 mb-3`}>
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
                  <p className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-800 truncate`}>
                    {documents[currentDocType].name}
                  </p>
                  <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
                    {formatFileSize(documents[currentDocType].size)} • {new Date().toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={handleDeleteDocument}
                className={`${isMobile ? 'self-end' : ''} p-1 hover:bg-red-100 rounded-full text-red-500 hover:text-red-700`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            {previews[currentDocType] && (
              <div className="mt-2">
                {documents[currentDocType].type.startsWith('image/') ? (
                  <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <img 
                      src={previews[currentDocType]} 
                      className="w-full h-auto max-h-64 object-contain mx-auto" 
                      alt={DOCUMENT_TYPES[currentDocType].label}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-center">
                    <span className="text-gray-400">Dokumen PDF</span>
                  </div>
                )}
                
                <div className="mt-3 flex justify-center">
                  <a 
                    href={previews[currentDocType]} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md"
                  >
                    Lihat Dokumen
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
        <button
          onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 order-2 sm:order-1"
        >
          Kembali
        </button>
        
        {currentStep < DOCUMENT_ORDER.length - 1 ? (
          <button
            onClick={() => {
              if (documents[currentDocType]) {
                setCurrentStep(prev => prev + 1);
              } else {
                toast.error(`Harap upload ${DOCUMENT_TYPES[currentDocType].label} terlebih dahulu`);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md order-1 sm:order-2"
          >
            Lanjut
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 ${isSubmitting ? 'bg-green-700' : 'bg-green-600'} text-white rounded-md flex items-center justify-center order-1 sm:order-2`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </>
            ) : "Kirim Semua Dokumen"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RequiredDocumentsForm;