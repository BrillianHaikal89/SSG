import React from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';

const QuranBookmark = ({ currentPosition, surahDetails, surahList }) => {
  const { user } = useAuthStore();
  const [savedBookmarks, setSavedBookmarks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  React.useEffect(() => {
    // Load user's bookmarks when component mounts or user changes
    if (user) {
      fetchUserBookmarks();
    }
  }, [user]);

  const fetchUserBookmarks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/quran/bookmarks?user_id=${user.userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      
      const data = await response.json();
      setSavedBookmarks(data.bookmarks || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Gagal memuat bookmark');
    } finally {
      setLoading(false);
    }
  };

  const saveBookmark = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    if (!currentPosition) {
      toast.error('Tidak ada posisi bacaan yang aktif');
      return;
    }

    setLoading(true);
    try {
      const { surah, ayah, page, juz } = currentPosition;
      const surahName = surahDetails?.nm_surat || 
        surahList.find(s => s.no_surat === parseInt(surah))?.nm_surat || 
        `Surah ${surah}`;

      const response = await fetch(`${API_URL}/quran/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.userId,
          surah: surah,
          surah_name: surahName,
          ayah: ayah,
          page: page,
          juz: juz,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      toast.success(data.message || 'Bookmark berhasil disimpan');
      fetchUserBookmarks(); // Refresh the list
    } catch (error) {
      console.error('Error saving bookmark:', error);
      toast.error('Gagal menyimpan bookmark: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmark = async (bookmark) => {
    // This function would be used to navigate to the saved position
    if (!bookmark) return;
    
    toast.success(`Membuka Surah ${bookmark.surah_name} ayat ${bookmark.ayah}`);
    
    // You would implement navigation here, calling functions from the parent component
    // This should be passed down as props from QuranContent
    // onLoadBookmark(bookmark.surah, bookmark.ayah, bookmark.page, bookmark.juz);
  };

  const deleteBookmark = async (bookmarkId) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/quran/bookmark/${bookmarkId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete bookmark');
      }
      
      toast.success('Bookmark berhasil dihapus');
      fetchUserBookmarks(); // Refresh the list
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast.error('Gagal menghapus bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookmark-section mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-blue-900">Bookmark</h3>
        <button
          onClick={saveBookmark}
          disabled={loading || !currentPosition}
          className={`flex items-center px-3 py-2 rounded-md text-sm ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          <span>Simpan Posisi</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
        </div>
      ) : savedBookmarks.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto bg-white rounded-lg p-3 shadow-sm">
          {savedBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="flex justify-between items-center p-2 hover:bg-blue-50 rounded-md">
              <div className="flex-1">
                <button
                  onClick={() => loadBookmark(bookmark)}
                  className="text-left w-full"
                >
                  <div className="text-sm font-medium">{bookmark.surah_name}</div>
                  <div className="text-xs text-gray-600">
                    Ayat {bookmark.ayah} • Hal {bookmark.page} • Juz {bookmark.juz}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(bookmark.timestamp).toLocaleString()}
                  </div>
                </button>
              </div>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="text-red-600 hover:text-red-800 ml-2"
                aria-label="Hapus bookmark"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 bg-blue-50 rounded-lg">
          <p className="text-gray-600 text-sm">Belum ada bookmark tersimpan</p>
        </div>
      )}
    </div>
  );
};

export default QuranBookmark;