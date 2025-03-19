import React, { useState } from "react";

/**
 * Component untuk menangani input kode pos dan pengisian alamat otomatis
 */
const KodePosForm = ({ 
  kodePos, 
  setKodePos, 
  setKelurahan, 
  setKecamatan, 
  setKota, 
  setProvinsi
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Handler untuk input kode pos
  const handleKodePosChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '').substring(0, 5);
    
    // Update kode pos state
    setKodePos(newValue);
    
    // Reset pesan jika panjang kode pos berubah
    if (newValue.length !== 5) {
      setError(null);
      setSuccess(false);
    }
    
    // Jika kode pos 5 digit, cari datanya
    if (newValue.length === 5) {
      fetchKodePos(newValue);
    }
  };
  
  // Fungsi untuk mengambil data dari server
  const fetchKodePos = async (kodePosValue) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // API call langsung ke server
      const response = await fetch(`http://localhost:3333/api/users/kodepos?kode_pos=${kodePosValue}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Data kode pos dari server:", data);
        
        // Debugging: log struktur data yang diterima
        console.log("Kelurahan:", data.kelurahan_desa);
        console.log("Kecamatan:", data.kecamatan);
        console.log("Kota:", data.kabupaten_kota);
        console.log("Provinsi:", data.provinsi);
        
        // Periksa apakah field ada dan isi dengan benar
        // Gunakan nilai fallback jika properti tidak ada
        
        // Kelurahan - coba beberapa kemungkinan nama properti
        if (data.kelurahan_desa !== undefined) {
          setKelurahan(data.kelurahan_desa);
        } else if (data.kelurahan !== undefined) {
          setKelurahan(data.kelurahan);
        } else if (data.desa !== undefined) {
          setKelurahan(data.desa);
        } else {
          setKelurahan("");
        }
        
        // Kecamatan
        setKecamatan(data.kecamatan || "");
        
        // Kota - coba beberapa kemungkinan nama properti
        if (data.kabupaten_kota !== undefined) {
          setKota(data.kabupaten_kota);
        } else if (data.kota !== undefined) {
          setKota(data.kota);
        } else if (data.kabupaten !== undefined) {
          setKota(data.kabupaten);
        } else {
          setKota("");
        }
        
        // Provinsi
        setProvinsi(data.provinsi || "");
        
        // Set status sukses hanya jika setidaknya ada satu field terisi
        if (data.kelurahan_desa || data.kelurahan || data.kecamatan || 
            data.kabupaten_kota || data.kota || data.provinsi) {
          setSuccess(true);
        } else {
          setError("Format data kode pos tidak sesuai. Harap isi alamat secara manual.");
        }
      } else {
        // Jika server merespon dengan error
        console.error(`Server responded with status: ${response.status}`);
        setError("Data kode pos tidak ditemukan. Harap isi alamat secara manual.");
        
        // Reset field alamat jika kode pos tidak ditemukan
        setKelurahan("");
        setKecamatan("");
        setKota("");
        setProvinsi("");
      }
    } catch (error) {
      console.error("Error fetching postal code data:", error);
      setError("Gagal terhubung ke server. Silakan isi alamat secara manual.");
      
      // Reset field alamat jika terjadi error
      setKelurahan("");
      setKecamatan("");
      setKota("");
      setProvinsi("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <div className="mb-3">
        <label htmlFor="kodePos" className="block text-xs font-medium text-gray-500 uppercase mb-1">
          KODE POS <span className="text-red-500">*</span>
        </label>
        <input
          id="kodePos"
          type="text"
          value={kodePos || ""}
          onChange={handleKodePosChange}
          placeholder="Masukkan 5 digit kode pos"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm"
          maxLength="5"
          disabled={loading}
        />
      </div>
      
      {loading && (
        <div className="mb-3 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-md border border-gray-100 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Mencari data kode pos...
        </div>
      )}
      
      {error && (
        <div className="mb-3 px-3 py-2 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
          {error}
        </div>
      )}
      
      {success && !error && !loading && (
        <div className="mb-3 px-3 py-2 bg-green-50 text-green-700 text-sm rounded-md border border-green-100">
          Data kode pos berhasil ditemukan!
        </div>
      )}
    </div>
  );
};

export default KodePosForm;