"use client";

import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MobileDocumentsForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user, role } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Document configuration
  const DOCUMENT_TYPES = {
    ktp: {
      id: 'ktp',
      label: "KTP",
      description: "Upload foto KTP/Kartu Pelajar",
      accept: "image/*,application/pdf"
    },
    pasFoto: {
      id: 'pasFoto',
      label: "Pas Foto",
      description: "Upload pas foto 3x4",
      accept: "image/*"
    },
    suratIzin: {
      id: 'suratIzin',
      label: "Surat Ijin",
      description: "Upload surat izin orang tua/wali",
      accept: "image/*,application/pdf"
    },
    suratSehat: {
      id: 'suratSehat',
      label: "Surat Sehat",
      description: "Upload surat keterangan sehat",
      accept: "image/*,application/pdf"
    },
    buktiPembayaran: {
      id: 'buktiPembayaran',
      label: "Bukti Bayar",
      description: "Upload bukti pembayaran",
      accept: "image/*,application/pdf"
    },
    tandaTangan: {
      id: 'tandaTangan',
      label: "Tanda Tangan",
      description: "Upload tanda tangan",
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      toast.error(`Lengkapi dokumen terlebih dahulu`);
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
        toast.error("Gagal mengupload dokumen");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengupload");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      {/* Simplified Stepper - Only Numbers */}
      <div className="flex justify-between mb-6">
        {DOCUMENT_ORDER.map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                ${index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setCurrentStep(index)}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Current Document */}
      <div className="border rounded-lg p-4 mb-4 bg-white">
        <h3 className="font-medium mb-1">{DOCUMENT_TYPES[currentDocType].label}</h3>
        <p className="text-sm text-gray-600 mb-3">{DOCUMENT_TYPES[currentDocType].description}</p>
        
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
              className="block w-full py-2 px-3 bg-blue-500 text-white text-center rounded-md"
            >
              Upload File
            </label>
          </>
        ) : (
          <div className="bg-gray-50 p-3 rounded border">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium">{documents[currentDocType].name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(documents[currentDocType].size)}
                </p>
              </div>
              <button 
                onClick={handleDeleteDocument}
                className="text-red-500 p-1"
              >
                Hapus
              </button>
            </div>
            
            {previews[currentDocType] && (
              <div className="mt-2">
                {documents[currentDocType].type.startsWith('image/') ? (
                  <img 
                    src={previews[currentDocType]} 
                    className="w-full max-h-40 object-contain"
                    alt="Document preview"
                  />
                ) : (
                  <div className="bg-white p-2 flex justify-center">
                    <span className="text-gray-400">PDF Document</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-2">
        <button
          onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
          disabled={currentStep === 0}
          className="py-2 px-4 bg-gray-200 rounded-md flex-1 disabled:opacity-50"
        >
          Kembali
        </button>
        
        {currentStep < DOCUMENT_ORDER.length - 1 ? (
          <button
            onClick={() => documents[currentDocType] ? setCurrentStep(prev => prev + 1) : toast.error("Upload dokumen terlebih dahulu")}
            className="py-2 px-4 bg-blue-500 text-white rounded-md flex-1"
          >
            Lanjut
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="py-2 px-4 bg-green-600 text-white rounded-md flex-1 disabled:opacity-50"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Semua"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RequiredDocumentsForm;