const STORAGE_KEYS = {
  WISHLIST: 'bookbean_wishlist',
  RECENTLY_VIEWED: 'bookbean_recently_viewed',
  SORT_PREFERENCE: 'bookbean_sort_preference',
};

const storage = {
  // 위시리스트
  getWishlist: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get wishlist from localStorage:', error);
      return [];
    }
  },

  setWishlist: (wishlist) => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Failed to set wishlist to localStorage:', error);
    }
  },

  addToWishlist: (bookId) => {
    const wishlist = storage.getWishlist();
    if (!wishlist.includes(bookId)) {
      wishlist.push(bookId);
      storage.setWishlist(wishlist);
    }
  },

  removeFromWishlist: (bookId) => {
    const wishlist = storage.getWishlist();
    const filtered = wishlist.filter((id) => id !== bookId);
    storage.setWishlist(filtered);
  },

  clearWishlist: () => {
    localStorage.removeItem(STORAGE_KEYS.WISHLIST);
  },

  isInWishlist: (bookId) => {
    const wishlist = storage.getWishlist();
    return wishlist.includes(bookId);
  },

  // 최근 본 상품
  getRecentlyViewed: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get recently viewed from localStorage:', error);
      return [];
    }
  },

  setRecentlyViewed: (items) => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to set recently viewed to localStorage:', error);
    }
  },

  addToRecentlyViewed: (book) => {
    const MAX_ITEMS = 20;
    let items = storage.getRecentlyViewed();

    // 중복 제거 (이미 있으면 제거)
    items = items.filter((item) => item.id !== book.id);

    // 맨 앞에 추가
    items.unshift({
      id: book.id,
      title: book.title,
      imageUrl: book.imageUrl,
      price: book.price,
      author: book.author,
      timestamp: Date.now(),
    });

    // 최대 개수 제한
    if (items.length > MAX_ITEMS) {
      items = items.slice(0, MAX_ITEMS);
    }

    storage.setRecentlyViewed(items);
  },

  clearRecentlyViewed: () => {
    localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
  },

  // 정렬 설정
  getSortPreference: () => {
    return localStorage.getItem(STORAGE_KEYS.SORT_PREFERENCE) || 'createdAt,desc';
  },

  setSortPreference: (sort) => {
    localStorage.setItem(STORAGE_KEYS.SORT_PREFERENCE, sort);
  },
};

export default storage;
