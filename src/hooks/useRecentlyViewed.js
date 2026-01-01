import { useEffect } from 'react';
import storage from '../utils/localStorage';

const useRecentlyViewed = (book) => {
  useEffect(() => {
    if (book) {
      storage.addToRecentlyViewed(book);
    }
  }, [book?.id]);

  const getRecentlyViewed = () => {
    return storage.getRecentlyViewed();
  };

  const clearRecentlyViewed = () => {
    storage.clearRecentlyViewed();
  };

  return {
    getRecentlyViewed,
    clearRecentlyViewed,
  };
};

export default useRecentlyViewed;
