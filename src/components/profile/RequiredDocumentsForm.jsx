"use client";

import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const RequiredDocumentsForm = () => {``
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const docTypesOrder = ['ktp', 'pasFoto', 'suratIzin', 'suratSehat', 'buktiPembayaran'];
  const currentDocType = docTypesOrder[currentStep];
  const { user } = useAuthStore();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      maxSize: "2MB",
      backendType: "ktp" // Backend field name
    },
    pasFoto: {
      label: "Pas Foto",
      description: "Unggah pas foto terbaru (3x4, latar belakang merah/biru)",
      formats: "JPG atau PNG",
      maxSize: "1MB",
      backendType: "pas_foto" // Backend field name
    },
    suratIzin: {
      label: "Surat Izin Orang Tua/Wali",
      description: "Unggah surat izin yang telah ditandatangani",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB",
      backendType: "surat_izin" // Backend field name
    },
    suratSehat: {
      label: "Surat Keterangan Sehat",
      description: "Unggah surat keterangan sehat dari dokter",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB",
      backendType: "surat_kesehatan" // Backend field name
    },
    buktiPembayaran: {
      label: "Bukti Pembayaran",
      description: "Unggah bukti transfer atau pembayaran",
      formats: "JPG, PNG, atau PDF",
      maxSize: "2MB",
      backendType: "bukti_pembayaran" // Backend field name
    }
  };

  const handleSubmit = async () => {
    // Validasi final
    const missingDocs = docTypesOrder.filter(docType => !documents[docType]);
  
    if (missingDocs.length > 0) {
      toast.error(`Masih ada dokumen yang belum diupload: ${missingDocs.map(d => documentTypes[d].label).join(', ')}`);
      setCurrentStep(docTypesOrder.indexOf(missingDocs[0]));
      return;
    }
  
    const formData = new FormData();
    formData.append('id', user.userId);
  
    // Add all files to formData with the same field name "files"
    // The order matches the expected order in the backend
    docTypesOrder.forEach(docType => {
      if (documents[docType]) {
        // Append all files with the same field name 'files'
        formData.append('files', documents[docType]);
      }
    });
  
    // Debug: Lihat isi FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? 
        `${value.name} (${value.size} bytes)` : 
        value);
    }
  
    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:3333/api/users/upload-files", {
        method: "POST",
        body: formData
      });
  
      setIsSubmitting(false);

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "Semua dokumen berhasil dikirim!");
        
        // Clear localStorage and state after successful submission
        localStorage.removeItem('requiredDocuments');
        setDocuments({
          ktp: null,
          pasFoto: null,
          suratIzin: null,
          suratSehat: null,
          buktiPembayaran: null
        });
        setPreviews({
          ktp: null,
          pasFoto: null,
          suratIzin: null,
          suratSehat: null,
          buktiPembayaran: null
        });
        setCurrentStep(0);
      } else {
        throw new Error(await response.text());
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Terjadi kesalahan saat mengupload");
      setIsSubmitting(false);
    }
  };

 // Load documents from localStorage on component mount
useEffect(() => {
  const fetchUserDocuments = async () => {
    try {
      const res = await fetch(`http://localhost:3333/api/users/user-files?userId=${user.userId}`);
      if (!res.ok) throw new Error("Gagal mengambil data dokumen");

      const data = await res.json();
      const initialPreviews = { ...previews };
      const initialDocuments = { ...documents };

      // Periksa apakah respons memiliki array 'files'
      if (data.files && Array.isArray(data.files)) {
        // Loop melalui files yang diterima dari API
        data.files.forEach(file => {
          // Mapping dari backend file_type ke docType di frontend
          const backendToFrontendMap = {
            'ktp': 'ktp',
            'pas_foto': 'pasFoto',
            'surat_izin': 'suratIzin',
            'surat_kesehatan': 'suratSehat',
            'bukti_pembayaran': 'buktiPembayaran'
          };

          const frontendDocType = backendToFrontendMap[file.file_type];
          
          if (frontendDocType) {
            initialPreviews[frontendDocType] = file.drive_link;
            initialDocuments[frontendDocType] = {
              name: file.file_name,
              type: file.file_name.endsWith('.pdf') ? 'application/pdf' : 
                   file.file_name.endsWith('.png') ? 'image/png' : 
                   file.file_name.endsWith('.jpg') || file.file_name.endsWith('.jpeg') ? 'image/jpeg' : 
                   'application/octet-stream',
              fromServer: true,
              url: file.drive_link
            };
          }
        });

        setPreviews(initialPreviews);
        setDocuments(initialDocuments);
      }
    } catch (err) {
      console.error("Fetch document error:", err);
    }
  };

  // Panggil fetchUserDocuments jika user sudah login
  if (user?.userId) {
    fetchUserDocuments();
  }
}, [user]);
  

  const handleFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
  
      // Store the actual File object in documents state
      setDocuments(prev => ({ 
        ...prev, 
        [documentType]: file
      }));
      
      setPreviews(prev => ({ ...prev, [documentType]: dataUrl }));
  
      // Save to localStorage
      const currentDocs = JSON.parse(localStorage.getItem('requiredDocuments') || '{}');
      localStorage.setItem('requiredDocuments', JSON.stringify({
        ...currentDocs,
        [documentType]: {
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString(),
          dataUrl: dataUrl
        }
      }));
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
    <div className="p-4">
      {/* Stepper Indicator */}
      <div className="flex justify-between mb-6">
        {docTypesOrder.map((docType, index) => (
          <div key={docType} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200'} 
                ${index === currentStep ? 'ring-2 ring-blue-300' : ''}`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-center">
              {documentTypes[docType].label}
            </span>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-md font-medium">{documentTypes[currentDocType].label}</h3>
            <p className="text-xs text-gray-500 mt-1">{documentTypes[currentDocType].description}</p>
            <p className="text-xs text-gray-400">Format: {documentTypes[currentDocType].formats} (Maks: {documentTypes[currentDocType].maxSize})</p>
          </div>
          
          {!documents[currentDocType] && (
            <label className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${uploadingStatus[currentDocType] ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Unggah
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
        </div>
        
        {/* Uploading indicator */}
        {uploadingStatus[currentDocType] && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Mengunggah...</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}
        
        {/* Document preview/info */}
        {documents[currentDocType] && (
          <div className="mt-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                {previews[currentDocType] && documents[currentDocType].type.startsWith('image/') && (
                  <img 
                    src={previews[currentDocType]} 
                    className="w-12 h-12 rounded-md mr-3" 
                    alt={documentTypes[currentDocType].label}
                  />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {documents[currentDocType].name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(documents[currentDocType].size)} • 
                    {new Date().toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              {previews[currentDocType] && (
  <div className="mt-4">
    {typeof previews[currentDocType] === 'string' && (
      <a href={previews[currentDocType]} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
        Lihat Dokumen
      </a>
    )}
  </div>
)}

              <button 
                onClick={() => handleDeleteDocument(currentDocType)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Kembali
        </button>
        
        {currentStep < docTypesOrder.length - 1 ? (
          <button
            onClick={() => {
              if (documents[currentDocType]) {
                setCurrentStep(prev => prev + 1);
              } else {
                toast.error(`Harap upload ${documentTypes[currentDocType].label} terlebih dahulu`);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Lanjut
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!documents[currentDocType] || isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 flex items-center justify-center"
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