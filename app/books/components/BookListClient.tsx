'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import bookService from '@/lib/services/bookService';
import type { Book, BookListParams } from '@/lib/types';

// Components
import BookCard from '@/components/book/BookCard';
import BookCardSkeleton from '@/components/book/BookCardSkeleton';
import BookSearchBar from '@/components/book/BookSearchBar';
import SortDropdown from '@/components/filter/SortDropdown';
import CategoryFilter from '@/components/filter/CategoryFilter';
import FilterSidebar from '@/components/filter/FilterSidebar';
import FilterTags from '@/components/filter/FilterTags';
import Pagination from '@/components/filter/Pagination';

interface PriceRange {
  min: number;
  max: number;
}

interface BookListClientProps {
  initialBooks: Book[];
  initialTotalPages: number;
}

/**
 * 도서 목록 페이지의 인터랙티브한 부분 (클라이언트 컴포넌트)
 * - 검색, 필터, 정렬, 페이지네이션 등 사용자 인터랙션 처리
 * - 초기 데이터는 서버 컴포넌트에서 받아서 첫 렌더링 최적화
 */
export default function BookListClient({ initialBooks, initialTotalPages }: BookListClientProps) {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('category') ? parseInt(searchParams.get('category')!) : null
  );
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt,desc');
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0,
    max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 100000,
  });
  const [minRating, setMinRating] = useState<number | null>(
    searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : null
  );

  const [currentPage, setCurrentPage] = useState(
    searchParams.get('page') ? parseInt(searchParams.get('page')!) : 0
  );
  const [totalPages, setTotalPages] = useState(initialTotalPages);
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
      const params: BookListParams = {
        page: currentPage,
        size: pageSize,
        sort: sortBy,
      };

      if (priceRange.min > 0) params.minPrice = priceRange.min;
      if (priceRange.max < 100000) params.maxPrice = priceRange.max;
      if (minRating !== null) params.minRating = minRating;

      let response;
      if (searchKeyword) {
        response = await bookService.searchBooks(searchKeyword, params);
      } else if (selectedCategory) {
        response = await bookService.getBooksByCategory(selectedCategory, params);
      } else {
        response = await bookService.getAllBooks(params);
      }

      const pageData = response?.data || response;
      setBooks(pageData?.content || []);
      setTotalPages(pageData?.totalPages || 0);
    } catch (err) {
      console.error('도서 목록 조회 실패:', err);
      const message = err instanceof Error ? err.message : '도서 목록을 불러오는데 실패했습니다';
      setError(message);
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

  const handlePriceRangeChange = (newRange: PriceRange) => {
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            priceRange={priceRange}
            minRating={minRating}
            onPriceRangeChange={handlePriceRangeChange}
            onMinRatingChange={handleMinRatingChange}
            onReset={handleResetFilters}
          />
        </div>

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
              <p className="text-warm-600">다양한 책을 만나보세요</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-warm-300 rounded-xl hover:border-primary-500 transition-colors"
              >
                <Filter className="w-4 h-4" />
                필터
              </button>
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>
          </div>

          <BookSearchBar onSearch={handleSearch} placeholder="제목 또는 저자로 검색" />

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
            <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {searchKeyword && (
            <div className="text-sm text-warm-600">
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
              <p className="text-warm-500 text-lg">도서가 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
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
    </div>
  );
}
