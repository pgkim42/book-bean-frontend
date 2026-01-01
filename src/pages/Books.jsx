import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import bookService from '../services/bookService';
import BookCard from '../components/book/BookCard';
import BookCardSkeleton from '../components/book/BookCardSkeleton';
import CategoryFilter from '../components/book/CategoryFilter';
import SearchBar from '../components/common/SearchBar';
import SortDropdown from '../components/common/SortDropdown';
import FilterSidebar from '../components/filter/FilterSidebar';
import FilterTags from '../components/filter/FilterTags';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // URL 쿼리 파라미터에서 상태 초기화
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') ? parseInt(searchParams.get('category')) : null
  );
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt,desc');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : 0,
    max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : 100000,
  });
  const [minRating, setMinRating] = useState(
    searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')) : null
  );

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(
    searchParams.get('page') ? parseInt(searchParams.get('page')) : 0
  );
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(12);

  useEffect(() => {
    fetchBooks();
    updateURL();
  }, [selectedCategory, searchKeyword, currentPage, sortBy, priceRange, minRating]);

  const updateURL = () => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchKeyword) params.search = searchKeyword;
    if (currentPage > 0) params.page = currentPage;
    if (sortBy !== 'createdAt,desc') params.sort = sortBy;
    if (priceRange.min > 0) params.minPrice = priceRange.min;
    if (priceRange.max < 100000) params.maxPrice = priceRange.max;
    if (minRating !== null) params.minRating = minRating;
    setSearchParams(params);
  };

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const params = {
        page: currentPage,
        size: pageSize,
        sort: sortBy,
      };

      // 가격 필터 추가
      if (priceRange.min > 0) params.minPrice = priceRange.min;
      if (priceRange.max < 100000) params.maxPrice = priceRange.max;

      // 평점 필터 추가
      if (minRating !== null) params.minRating = minRating;

      if (searchKeyword) {
        // 검색
        response = await bookService.searchBooks(searchKeyword, params);
      } else if (selectedCategory) {
        // 카테고리 필터
        response = await bookService.getBooksByCategory(selectedCategory, params);
      } else {
        // 전체 목록
        response = await bookService.getAllBooks(params);
      }

      setBooks(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      setError(err.message || '도서 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchKeyword('');
    setCurrentPage(0);
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    setSelectedCategory(null);
    setCurrentPage(0);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(0);
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
    setCurrentPage(0);
  };

  const handleMinRatingChange = (rating) => {
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex gap-6">
      {/* 필터 사이드바 (데스크톱) */}
      <FilterSidebar
        priceRange={priceRange}
        minRating={minRating}
        onPriceRangeChange={handlePriceRangeChange}
        onMinRatingChange={handleMinRatingChange}
        onReset={handleResetFilters}
      />

      {/* 필터 모달 (모바일) */}
      {showMobileFilter && (
        <FilterSidebar
          priceRange={priceRange}
          minRating={minRating}
          onPriceRangeChange={handlePriceRangeChange}
          onMinRatingChange={handleMinRatingChange}
          onReset={handleResetFilters}
          isMobile
          onClose={() => setShowMobileFilter(false)}
        />
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">도서 목록</h1>
            <p className="text-gray-600">다양한 책을 만나보세요</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowMobileFilter(true)}
              variant="outline"
              className="lg:hidden flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              필터
            </Button>
            <SortDropdown value={sortBy} onChange={handleSortChange} />
          </div>
        </div>

        {/* 검색 바 */}
        <SearchBar onSearch={handleSearch} placeholder="제목 또는 저자로 검색" />

        {/* 카테고리 필터 */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* 적용된 필터 태그 */}
        <FilterTags
          priceRange={priceRange}
          minRating={minRating}
          onRemovePriceRange={handleRemovePriceRange}
          onRemoveRating={handleRemoveRating}
        />

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-gray-100 border border-gray-300 text-gray-900 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 검색 결과 정보 */}
        {searchKeyword && (
          <div className="text-sm text-gray-600">
            "{searchKeyword}" 검색 결과: {books.length}권
          </div>
        )}

        {/* 도서 목록 */}
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
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Books;
