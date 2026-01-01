'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import bookService from '@/lib/services/bookService';
import { formatPrice } from '@/lib/utils/formatters';
import { BOOK_STATUS } from '@/lib/utils/constants';

// 임시 컴포넌트들 - 추후 별도 파일로 분리
const BookCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/4" />
  </div>
);

const BookCard = ({ book }: { book: any }) => (
  <a
    href={`/books/${book.id}`}
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
  >
    <div className="relative">
      {book.imageUrl ? (
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      {book.status !== 'AVAILABLE' && (
        <span className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
          {BOOK_STATUS[book.status]}
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
      <div className="flex items-center gap-2">
        {book.discountRate > 0 && (
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(book.originalPrice)}
          </span>
        )}
        <span className="font-bold text-gray-900">{formatPrice(book.salePrice)}</span>
      </div>
    </div>
  </a>
);

const SearchBar = ({ onSearch, placeholder }: { onSearch: (keyword: string) => void; placeholder: string }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </form>
  );
};

const SortDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const options = [
    { value: 'createdAt,desc', label: '최신순' },
    { value: 'createdAt,asc', label: '오래된순' },
    { value: 'salePrice,asc', label: '가격 낮은순' },
    { value: 'salePrice,desc', label: '가격 높은순' },
    { value: 'title,asc', label: '제목순' },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const CategoryFilter = ({ selectedCategory, onSelectCategory }: {
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}) => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(0, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        이전
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg border ${
            currentPage === page
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        다음
      </button>
    </div>
  );
};

const FilterSidebar = ({ priceRange, minRating, onPriceRangeChange, onMinRatingChange, onReset, isMobile, onClose }: any) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isMobile ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">필터</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">가격대</h3>
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-600">최소 가격</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">최대 가격</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">최소 평점</h3>
          <div className="space-y-2">
            {[null, 4, 3, 2, 1].map((rating) => (
              <label key={rating || 0} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => onMinRatingChange(rating)}
                  className="w-4 h-4"
                />
                <span>{rating ? `${rating}점 이상` : '전체'}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={onReset}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
};

const FilterTags = ({ priceRange, minRating, onRemovePriceRange, onRemoveRating }: any) => {
  const hasPriceFilter = priceRange.min > 0 || priceRange.max < 100000;
  const hasRatingFilter = minRating !== null;

  if (!hasPriceFilter && !hasRatingFilter) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {hasPriceFilter && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
          가격: {priceRange.min.toLocaleString()}원 - {priceRange.max.toLocaleString()}원
          <button onClick={onRemovePriceRange} className="hover:text-primary-900">×</button>
        </span>
      )}
      {hasRatingFilter && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
          {minRating}점 이상
          <button onClick={onRemoveRating} className="hover:text-primary-900">×</button>
        </span>
      )}
    </div>
  );
};

// Books Page
export default function BooksPage() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('category') ? parseInt(searchParams.get('category')!) : null
  );
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt,desc');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0,
    max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 100000,
  });
  const [minRating, setMinRating] = useState<number | null>(
    searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : null
  );

  const [currentPage, setCurrentPage] = useState(
    searchParams.get('page') ? parseInt(searchParams.get('page')!) : 0
  );
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    fetchBooks();
    updateURL();
  }, [selectedCategory, searchKeyword, currentPage, sortBy, priceRange, minRating]);

  const updateURL = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory.toString());
    if (searchKeyword) params.set('search', searchKeyword);
    if (currentPage > 0) params.set('page', currentPage.toString());
    if (sortBy !== 'createdAt,desc') params.set('sort', sortBy);
    if (priceRange.min > 0) params.set('minPrice', priceRange.min.toString());
    if (priceRange.max < 100000) params.set('maxPrice', priceRange.max.toString());
    if (minRating !== null) params.set('minRating', minRating.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/books?${queryString}` : '/books';
    window.history.replaceState(null, '', newUrl);
  };

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page: currentPage,
        size: pageSize,
        sort: sortBy,
      };

      if (priceRange.min > 0) params.minPrice = priceRange.min;
      if (priceRange.max < 100000) params.maxPrice = priceRange.max;
      if (minRating !== null) params.minRating = minRating;

      let response: any;
      if (searchKeyword) {
        response = await bookService.searchBooks(searchKeyword, params);
      } else if (selectedCategory) {
        response = await bookService.getBooksByCategory(selectedCategory, params);
      } else {
        response = await bookService.getAllBooks(params);
      }

      setBooks(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
    } catch (err: any) {
      setError(err.message || '도서 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSearchKeyword('');
    setCurrentPage(0);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setSelectedCategory(null);
    setCurrentPage(0);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(0);
  };

  const handlePriceRangeChange = (newRange: { min: number; max: number }) => {
    setPriceRange(newRange);
    setCurrentPage(0);
  };

  const handleMinRatingChange = (rating: number | null) => {
    setMinRating(rating);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setPriceRange({ min: 0, max: 100000 });
    setMinRating(null);
    setCurrentPage(0);
  };

  const handleRemovePriceRange = () => {
    setPriceRange({ min: 0, max: 100000 });
    setCurrentPage(0);
  };

  const handleRemoveRating = () => {
    setMinRating(null);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex gap-6">
      <FilterSidebar
        priceRange={priceRange}
        minRating={minRating}
        onPriceRangeChange={handlePriceRangeChange}
        onMinRatingChange={handleMinRatingChange}
        onReset={handleResetFilters}
      />

      {showMobileFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <FilterSidebar
            priceRange={priceRange}
            minRating={minRating}
            onPriceRangeChange={handlePriceRangeChange}
            onMinRatingChange={handleMinRatingChange}
            onReset={handleResetFilters}
            isMobile
            onClose={() => setShowMobileFilter(false)}
          />
        </div>
      )}

      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">도서 목록</h1>
            <p className="text-gray-600">다양한 책을 만나보세요</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Filter className="w-4 h-4" />
              필터
            </button>
            <SortDropdown value={sortBy} onChange={handleSortChange} />
          </div>
        </div>

        <SearchBar onSearch={handleSearch} placeholder="제목 또는 저자로 검색" />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        <FilterTags
          priceRange={priceRange}
          minRating={minRating}
          onRemovePriceRange={handleRemovePriceRange}
          onRemoveRating={handleRemoveRating}
        />

        {error && (
          <div className="bg-gray-100 border border-gray-300 text-gray-900 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {searchKeyword && (
          <div className="text-sm text-gray-600">
            "{searchKeyword}" 검색 결과: {books.length}권
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">도서가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
