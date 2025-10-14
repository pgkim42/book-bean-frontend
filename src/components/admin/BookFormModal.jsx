import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../common/Button';

// BookRequestDto 기반 Validation Schema
const bookSchema = z.object({
  categoryId: z.number({ required_error: '카테고리는 필수입니다' }),
  isbn: z.string().max(20, 'ISBN은 20자 이하여야 합니다').optional().or(z.literal('')),
  title: z.string().min(1, '제목은 필수입니다').max(200, '제목은 200자 이하여야 합니다'),
  author: z.string().min(1, '저자는 필수입니다').max(100, '저자는 100자 이하여야 합니다'),
  publisher: z.string().max(100, '출판사는 100자 이하여야 합니다').optional().or(z.literal('')),
  publicationDate: z.string().optional().or(z.literal('')),
  originalPrice: z.number({ required_error: '정가는 필수입니다' }).min(0, '정가는 0원 이상이어야 합니다'),
  salePrice: z.number({ required_error: '판매가는 필수입니다' }).min(0, '판매가는 0원 이상이어야 합니다'),
  discountRate: z.number().min(0, '할인율은 0 이상이어야 합니다').max(100, '할인율은 100 이하여야 합니다').optional(),
  stockQuantity: z.number().min(0, '재고 수량은 0 이상이어야 합니다').optional(),
  description: z.string().optional().or(z.literal('')),
  pages: z.number().min(0, '페이지 수는 0 이상이어야 합니다').optional(),
  coverImageUrl: z.string().max(500, '표지 이미지 URL은 500자 이하여야 합니다').optional().or(z.literal('')),
});

const BookFormModal = ({ isOpen, onClose, onSubmit, initialData, categories }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData || {
      categoryId: '',
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

  const onSubmitForm = async (data) => {
    try {
      // 빈 문자열을 null로 변환
      const processedData = {
        ...data,
        isbn: data.isbn || null,
        publisher: data.publisher || null,
        publicationDate: data.publicationDate || null,
        description: data.description || null,
        coverImageUrl: data.coverImageUrl || null,
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
                    rows="4"
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

export default BookFormModal;
