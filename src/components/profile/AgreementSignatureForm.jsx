"use client";

import React, { useState, useEffect, useRef } from 'react';

const AgreementSignatureForm = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [agreement, setAgreement] = useState({
    agreed: false,
    signature: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Load agreement data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedAgreement = JSON.parse(localStorage.getItem('agreementData') || '{}');
        
        if (storedAgreement) {
          setAgreement({
            agreed: storedAgreement.agreed || false,
            signature: storedAgreement.signature || null
          });
          
          if (storedAgreement.signaturePreview) {
            setSignaturePreview(storedAgreement.signaturePreview);
          }
        }
      } catch (error) {
        console.error("Error loading agreement data:", error);
      }
    }
  }, []);

  // Handle agreement checkbox change
  const handleAgreementChange = (e) => {
    const isChecked = e.target.checked;
    
    setAgreement(prev => ({
      ...prev,
      agreed: isChecked
    }));
    
    // Save to localStorage
    const currentData = JSON.parse(localStorage.getItem('agreementData') || '{}');
    localStorage.setItem('agreementData', JSON.stringify({
      ...currentData,
      agreed: isChecked
    }));
  };

  // Handle signature file selection
  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Start uploading
    setIsUploading(true);
    
    // Create file preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      
      // Store file info and preview
      const signatureInfo = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
      };
      
      // Simulate upload delay
      setTimeout(() => {
        // Update signature state
        setAgreement(prev => ({
          ...prev,
          signature: signatureInfo
        }));
        
        // Update preview
        setSignaturePreview(dataUrl);
        
        // Save to localStorage
        localStorage.setItem('agreementData', JSON.stringify({
          agreed: agreement.agreed,
          signature: signatureInfo,
          signaturePreview: dataUrl
        }));
        
        // End uploading status
        setIsUploading(false);
      }, 1000);
    };
    
    reader.readAsDataURL(file);
  };

  // Handle signature deletion
  const handleDeleteSignature = () => {
    setAgreement(prev => ({
      ...prev,
      signature: null
    }));
    
    setSignaturePreview(null);
    
    // Update localStorage
    const currentData = JSON.parse(localStorage.getItem('agreementData') || '{}');
    delete currentData.signature;
    delete currentData.signaturePreview;
    localStorage.setItem('agreementData', JSON.stringify(currentData));
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
          <h2 className="text-lg font-medium">Persetujuan & Tanda Tangan</h2>
          <p className="text-xs text-gray-500">Konfirmasi persetujuan dan tanda tangan digital</p>
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
            {isFormVisible ? 'Tutup' : 'Lihat'}
          </button>
        </div>
      </div>
      
      {/* Collapsible Form Content */}
      <div className={`transition-all duration-300 overflow-hidden ${isFormVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4">
          <div className="space-y-6">
            {/* Agreement Checkbox */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-start">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="agreement-checkbox"
                    name="agreement"
                    type="checkbox"
                    checked={agreement.agreed}
                    onChange={handleAgreementChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreement-checkbox" className="font-medium text-gray-700">
                    Saya bersedia mengikuti aturan Diklat SSG
                  </label>
                  <p className="text-gray-500 text-xs">
                    Dengan mencentang kotak ini, saya menyatakan bahwa saya telah membaca, memahami, dan setuju untuk mengikuti semua aturan dan ketentuan yang berlaku selama Diklat Santri Siap Guna.
                  </p>
                  <p className="text-red-500 text-xs mt-1">
                    *Wajib dicentang sebelum submit
                  </p>
                </div>
              </div>
            </div>
            
            {/* Digital Signature */}
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-medium mb-2">Tanda tangan digital</h3>
              <p className="text-xs text-gray-500 mb-3">
                Silakan unggah gambar tanda tangan Anda atau gunakan layanan e-signature. Tanda tangan ini akan digunakan sebagai bukti persetujuan Anda terhadap persyaratan program.
              </p>
              <p className="text-xs text-gray-400 mb-4">Format: JPG, PNG (Maks: 1MB)</p>
              
              {!agreement.signature && !isUploading && (
                <label className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium cursor-pointer bg-blue-500 hover:bg-blue-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Unggah Tanda Tangan
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleSignatureChange} 
                    accept="image/jpeg,image/png"
                    ref={fileInputRef}
                  />
                </label>
              )}
              
              {/* Uploading indicator */}
              {isUploading && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Mengunggah tanda tangan...</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-full"></div>
                  </div>
                </div>
              )}
              
              {/* Signature preview */}
              {agreement.signature && signaturePreview && !isUploading && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-2">Tanda tangan Anda:</p>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                    <div className="flex items-center">
                      <div className="w-32 h-16 rounded border bg-white overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={signaturePreview} 
                          alt="Tanda tangan digital" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                          {agreement.signature.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(agreement.signature.size)} • {new Date(agreement.signature.uploadDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleDeleteSignature}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Untuk legalitas pernyataan
                  </p>
                </div>
              )}
            </div>
            
            {/* Submit button - would connect to your form submission in a real app */}
            <div className="flex justify-center">
              <button
                type="button"
                disabled={!agreement.agreed || !agreement.signature}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  agreement.agreed && agreement.signature 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Simpan & Lanjutkan
              </button>
            </div>
            
            {/* Help text */}
            {(!agreement.agreed || !agreement.signature) && (
              <p className="text-xs text-center text-gray-500">
                Anda harus mencentang persetujuan dan mengunggah tanda tangan untuk melanjutkan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementSignatureForm;