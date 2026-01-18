'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import bookService from '@/lib/services/bookService';
import categoryService from '@/lib/services/categoryService';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { BOOK_STATUS } from '@/lib/utils/constants';
import { clsx } from 'clsx';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// BookRequestDto 기반 Validation Schema
const bookSchema = z.object({
  categoryId: z.number({ message: '카테고리는 필수입니다' }),
  isbn: z.string().max(20, 'ISBN은 20자 이하여야 합니다').optional().or(z.literal('')),
  title: z.string().min(1, '제목은 필수입니다').max(200, '제목은 200자 이하여야 합니다'),
  author: z.string().min(1, '저자는 필수입니다').max(100, '저자는 100자 이하여야 합니다'),
  publisher: z.string().max(100, '출판사는 100자 이하여야 합니다').optional().or(z.literal('')),
  publicationDate: z.string().optional().or(z.literal('')),
  originalPrice: z.number({ message: '정가는 필수입니다' }).min(0, '정가는 0원 이상이어야 합니다'),
  salePrice: z.number({ message: '판매가는 필수입니다' }).min(0, '판매가는 0원 이상이어야 합니다'),
  discountRate: z.number().min(0, '할인율은 0 이상이어야 합니다').max(100, '할인율은 100 이하여야 합니다').optional(),
  stockQuantity: z.number().min(0, '재고 수량은 0 이상이어야 합니다').optional(),
  description: z.string().optional().or(z.literal('')),
  pages: z.number().min(0, '페이지 수는 0 이상이어야 합니다').optional(),
  coverImageUrl: z.string().max(500, '표지 이미지 URL은 500자 이하여야 합니다').optional().or(z.literal('')),
});

type BookFormData = z.infer<typeof bookSchema>;
type Book = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  salePrice: number;
  stockQuantity: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  createdAt: string;
  categoryId: number;
  isbn?: string;
  publicationDate?: string;
  originalPrice?: number;
  discountRate?: number;
  description?: string;
  pages?: number;
  coverImageUrl?: string;
};

type Category = {
  id: number;
  name: string;
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* 이전 버튼 */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className={clsx(
          'p-2 rounded-lg border transition-colors',
          currentPage === 0
            ? 'border-gray-300 text-gray-300 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* 페이지 번호 */}
      {startPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            1
          </button>
          {startPage > 1 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            'px-4 py-2 rounded-lg border transition-colors',
            page === currentPage
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          )}
        >
          {page + 1}
        </button>
      ))}

      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        className={clsx(
          'p-2 rounded-lg border transition-colors',
          currentPage === totalPages - 1
            ? 'border-gray-300 text-gray-300 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// BookFormModal Component
interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => Promise<void>;
  initialData: Book | null;
  categories: Category[];
}

const BookFormModal = ({ isOpen, onClose, onSubmit, initialData, categories }: BookFormModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData || {
      categoryId: 0,
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      publicationDate: '',
      originalPrice: 0,
      salePrice: 0,
      discountRate: 0,
      stockQuantity: 0,
      description: '',
      pages: 0,
      coverImageUrl: '',
    },
  });

  const originalPrice = watch('originalPrice');
  const salePrice = watch('salePrice');

  // 할인율 자동 계산
  useEffect(() => {
    if (originalPrice > 0 && salePrice > 0 && salePrice < originalPrice) {
      const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
      setValue('discountRate', discount);
    } else if (salePrice >= originalPrice) {
      setValue('discountRate', 0);
    }
  }, [originalPrice, salePrice, setValue]);

  // initialData 변경 시 폼 리셋
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmitForm = async (data: BookFormData) => {
    try {
      // 빈 문자열을 undefined로 변환 (BookFormData 타입 호환)
      const processedData: BookFormData = {
        ...data,
        isbn: data.isbn || undefined,
        publisher: data.publisher || undefined,
        publicationDate: data.publicationDate || undefined,
        description: data.description || undefined,
        coverImageUrl: data.coverImageUrl || undefined,
        discountRate: data.discountRate || 0,
        stockQuantity: data.stockQuantity || 0,
        pages: data.pages || 0,
      };
      await onSubmit(processedData);
      reset();
      onClose();
    } catch (error) {
      // 에러는 부모 컴포넌트에서 처리
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* 모달 */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* 헤더 */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {initialData ? '도서 수정' : '도서 등록'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 카테고리 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('categoryId', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">선택하세요</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                  )}
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                  <input
                    {...register('isbn')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.isbn && (
                    <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>
                  )}
                </div>

                {/* 제목 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* 저자 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    저자 <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('author')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.author && (
                    <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
                  )}
                </div>

                {/* 출판사 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">출판사</label>
                  <input
                    {...register('publisher')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.publisher && (
                    <p className="mt-1 text-sm text-red-600">{errors.publisher.message}</p>
                  )}
                </div>

                {/* 출판일 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">출판일</label>
                  <input
                    {...register('publicationDate')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.publicationDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.publicationDate.message}</p>
                  )}
                </div>

                {/* 페이지 수 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">페이지 수</label>
                  <input
                    {...register('pages', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.pages && (
                    <p className="mt-1 text-sm text-red-600">{errors.pages.message}</p>
                  )}
                </div>

                {/* 정가 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    정가 <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('originalPrice', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.originalPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.originalPrice.message}</p>
                  )}
                </div>

                {/* 판매가 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    판매가 <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('salePrice', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.salePrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.salePrice.message}</p>
                  )}
                </div>

                {/* 할인율 (자동 계산) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">할인율 (%)</label>
                  <input
                    {...register('discountRate', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                  {errors.discountRate && (
                    <p className="mt-1 text-sm text-red-600">{errors.discountRate.message}</p>
                  )}
                </div>

                {/* 재고 수량 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">재고 수량</label>
                  <input
                    {...register('stockQuantity', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.stockQuantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.stockQuantity.message}</p>
                  )}
                </div>

                {/* 표지 이미지 URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    표지 이미지 URL
                  </label>
                  <input
                    {...register('coverImageUrl')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.coverImageUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.coverImageUrl.message}</p>
                  )}
                </div>

                {/* 설명 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '처리중...' : initialData ? '수정' : '등록'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Books Page
export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
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
      // API 응답 구조: api.ts 인터셉터가 response.data를 반환하므로 response가 곧 data
      const pageData = (response as any)?.data || response;
      setBooks(pageData?.content || []);
      setTotalPages(pageData?.totalPages || 0);
    } catch (error) {
      toast.error('도서 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      const categoryData = (response as any)?.data || response;
      setCategories(categoryData || []);
    } catch (error) {
      toast.error('카테고리 목록을 불러올 수 없습니다');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSubmit = async (data: BookFormData) => {
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
      const message = error instanceof Error ? error.message : '도서 저장에 실패했습니다';
      toast.error(message);
      throw error; // 모달이 닫히지 않도록
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`"${title}" 도서를 삭제하시겠습니까?`)) {
      try {
        await bookService.deleteBook(id);
        toast.success('도서가 삭제되었습니다');
        fetchBooks();
      } catch (error: any) {
        toast.error(error.message || '도서 삭제에 실패했습니다');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
                  <span className={book.stockQuantity <= 5 ? 'text-red-600 font-bold' : ''}>
                    {book.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={clsx(
                      'px-2 py-1 text-xs rounded-full',
                      book.status === 'AVAILABLE'
                        ? 'bg-green-100 text-green-800'
                        : book.status === 'OUT_OF_STOCK'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
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
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id, book.title)}
                    className="text-red-600 hover:text-red-900"
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
}
