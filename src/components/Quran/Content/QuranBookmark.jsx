import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../stores/authStore';
import toast from 'react-hot-toast';

const QuranBookmark = ({ onNavigateToBookmark }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user || !user.userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${API_URL}/quran/bookmarks/${user.userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }

      const data = await response.json();
      setBookmarks(data.bookmarks || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError('Gagal memuat bookmark');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkClick = (bookmark) => {
    if (onNavigateToBookmark) {
      onNavigateToBookmark(bookmark);
    }
  };

  const removeBookmark = async (bookmarkId) => {
    if (!user || !user.userId) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const loadingToast = toast.loading('Menghapus bookmark...');
      
      const response = await fetch(`${API_URL}/quran/bookmark/${bookmarkId}/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.userId
        })
      });

      toast.dismiss(loadingToast);
      
      if (!response.ok) {
        throw new Error('Failed to remove bookmark');
      }

      const data = await response.json();
      toast.success(data.message || 'Bookmark berhasil dihapus');
      
      // Refresh bookmarks list
      fetchBookmarks();
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Gagal menghapus bookmark');
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Bookmark Saya</h3>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Bookmark Saya</h3>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchBookmarks}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">Bookmark Saya</h3>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-gray-500">Belum ada bookmark tersimpan</p>
          <p className="text-sm text-gray-400 mt-1">Klik tombol "Simpan" pada ayat untuk menyimpan bookmark</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="flex items-center justify-between p-3 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => handleBookmarkClick(bookmark)}
              >
                <p className="font-medium text-blue-900">{bookmark.surah_name || bookmark.surah}</p>
                <p className="text-sm text-gray-600">
                  Ayat {bookmark.ayah}, Juz {bookmark.juz}, Hal {bookmark.page}
                </p>
                {bookmark.created_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(bookmark.created_at).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => removeBookmark(bookmark.id)}
                className="p-1.5 text-red-500 hover:bg-red-100 rounded"
                aria-label="Hapus bookmark"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuranBookmark;