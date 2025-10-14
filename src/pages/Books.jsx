import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import BookCard from '../components/book/BookCard';
import CategoryFilter from '../components/book/CategoryFilter';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Loading from '../components/common/Loading';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(12);

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, searchKeyword, currentPage]);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const params = {
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc',
      };

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && books.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold mb-2">도서 목록</h1>
        <p className="text-gray-600">다양한 책을 만나보세요</p>
      </div>

      {/* 검색 바 */}
      <SearchBar onSearch={handleSearch} placeholder="제목 또는 저자로 검색" />

      {/* 카테고리 필터 */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-t-lg"></div>
              <div className="bg-gray-100 h-32 rounded-b-lg"></div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">도서가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
  );
};

export default Books;
