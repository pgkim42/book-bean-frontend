import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import bookService from '../../services/bookService';
import categoryService from '../../services/categoryService';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import BookFormModal from '../../components/admin/BookFormModal';
import { formatPrice, formatDate } from '../../utils/formatters';
import { BOOK_STATUS } from '../../utils/constants';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const pageSize = 20;

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [currentPage]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await bookService.getAllBooks({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc',
      });
      setBooks(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      toast.error('도서 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      toast.error('카테고리 목록을 불러올 수 없습니다');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedBook) {
        await bookService.updateBook(selectedBook.id, data);
        toast.success('도서가 수정되었습니다');
      } else {
        await bookService.createBook(data);
        toast.success('도서가 등록되었습니다');
      }
      fetchBooks();
    } catch (error) {
      toast.error(error.message || '도서 저장에 실패했습니다');
      throw error; // 모달이 닫히지 않도록
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`"${title}" 도서를 삭제하시겠습니까?`)) {
      try {
        await bookService.deleteBook(id);
        toast.success('도서가 삭제되었습니다');
        fetchBooks();
      } catch (error) {
        toast.error(error.message || '도서 삭제에 실패했습니다');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">도서 관리</h1>
        <Button
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>도서 등록</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">도서명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">저자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">판매가</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">재고</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">등록일</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="font-medium">{book.title}</div>
                  <div className="text-gray-500">{book.publisher}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(book.salePrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={book.stockQuantity <= 5 ? 'text-gray-900 font-bold' : ''}>
                    {book.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      book.status === 'AVAILABLE'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {BOOK_STATUS[book.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(book.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => handleOpenEditModal(book)}
                    className="text-gray-800 hover:text-gray-900 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id, book.title)}
                    className="text-gray-900 hover:text-gray-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* 도서 등록/수정 모달 */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedBook}
        categories={categories}
      />
    </div>
  );
};

export default AdminBooks;
