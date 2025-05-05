import React, { useState, useEffect } from 'react';
import { quranApi } from '../../services/ApiQuran';
import useAuthStore from '../../stores/authStore';

const QuranBookmarkCard = ({ onContinueReading }) => {
  const [bookmark, setBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLatestBookmark();
  }, [user?.userId]);

  const fetchLatestBookmark = async () => {
    if (!user || !user.userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const latestBookmark = await quranApi.getLatestBookmark(user.userId);
      
      if (latestBookmark) {
        setBookmark(latestBookmark);
      }
    } catch (error) {
      console.error('Error fetching latest bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBookmarkInfo = () => {
    if (!bookmark) return '';
    
    if (bookmark.surah) {
      return `Surah ${bookmark.surah}${bookmark.ayah ? `, Ayat ${bookmark.ayah}` : ''}`;
    } else if (bookmark.page) {
      return `Halaman ${bookmark.page}`;
    } else if (bookmark.juz) {
      return `Juz ${bookmark.juz}`;
    }
    
    return 'Bacaan terakhir';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  const handleContinue = () => {
    if (!bookmark) return;
    
    if (typeof onContinueReading === 'function') {
      onContinueReading(bookmark);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 mb-5 animate-pulse">
        <div className="h-5 bg-blue-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-blue-100 rounded w-1/2 mb-3"></div>
        <div className="h-8 bg-blue-300 rounded w-1/3 ml-auto"></div>
      </div>
    );
  }

  if (!bookmark) {
    return null; // Don't show card if there's no bookmark
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-blue-800">Lanjutkan Membaca Al-Qur'an</h3>
          <p className="text-sm text-gray-700 mt-1">
            {formatBookmarkInfo()}
            {bookmark.timestamp && (
              <span className="text-gray-500 text-xs block mt-1">
                {formatDate(bookmark.timestamp)}
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={handleContinue}
          className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
};

export default QuranBookmarkCard;