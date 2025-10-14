import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../common/Button';

// CategoryRequestDto 기반 Validation Schema
const categorySchema = z.object({
  name: z.string().min(1, '카테고리명은 필수입니다'),
  description: z.string().optional().or(z.literal('')),
  displayOrder: z.number({ required_error: '표시 순서는 필수입니다' }),
});

const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      displayOrder: 0,
    },
  });

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
        description: data.description || null,
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* 헤더 */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {initialData ? '카테고리 수정' : '카테고리 등록'}
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
              {/* 카테고리명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리명 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  {...register('description')}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* 표시 순서 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  표시 순서 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('displayOrder', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.displayOrder && (
                  <p className="mt-1 text-sm text-red-600">{errors.displayOrder.message}</p>
                )}
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

export default CategoryFormModal;
