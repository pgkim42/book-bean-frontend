'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import categoryService from '@/lib/services/categoryService';
import { formatDate } from '@/lib/utils/formatters';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Category type definition
interface Category {
  id: number;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Validation schema types
interface CategoryFormData {
  name: string;
  description?: string;  // optional to allow empty
  displayOrder: number;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData: Category | null;
}

// CategoryFormModal Component (Inline)
const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData }: CategoryFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        displayOrder: initialData.displayOrder,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        displayOrder: 0,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = '카테고리명은 필수입니다';
    }

    if (formData.displayOrder < 0) {
      newErrors.displayOrder = '표시 순서는 0 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const processedData: CategoryFormData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        displayOrder: formData.displayOrder,
      };
      await onSubmit(processedData);
      onClose();
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* 모달 */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 카테고리명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* 표시 순서 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  표시 순서 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.displayOrder ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.displayOrder && (
                  <p className="mt-1 text-sm text-red-500">{errors.displayOrder}</p>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? '처리중...' : initialData ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Categories Page
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      // API 응답 구조 맞추기: Category 타입 호환
      const categoryList = (response as Category[]) || [];
      setCategories(categoryList);
    } catch (error) {
      toast.error('카테고리 목록을 불러올 수 없습니다');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, data);
        toast.success('카테고리가 수정되었습니다');
      } else {
        await categoryService.createCategory(data);
        toast.success('카테고리가 등록되었습니다');
      }
      fetchCategories();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '$1';
      toast.error(errorMessage);
      throw error; // Keep modal open on error
    }
  };

  // 활성화/비활성화 토글 핸들러
  const handleToggleActive = async (id: number, name: string, activate: boolean) => {
    const action = activate ? '활성화' : '비활성화';
    if (window.confirm(`"${name}" 카테고리를 ${action}하시겠습니까?`)) {
      try {
        if (activate) {
          await categoryService.activateCategory(id);
        } else {
          await categoryService.deleteCategory(id);
        }
        toast.success(`카테고리가 ${action}되었습니다`);
        fetchCategories();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || `${action}에 실패했습니다`;
        toast.error(errorMessage);
      }
    }
  };

  // 진짜 삭제 핸들러
  const handleHardDelete = async (id: number, name: string) => {
    if (window.confirm(`"${name}" 카테고리를 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await categoryService.hardDeleteCategory(id);
        toast.success('카테고리가 삭제되었습니다');
        fetchCategories();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || '삭제에 실패했습니다';
        toast.error(errorMessage);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">카테고리 관리</h1>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>카테고리 등록</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-50 border-b border-amber-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  카테고리명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  설명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  순서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-amber-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.displayOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {category.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    {/* 수정 버튼 - 항상 활성화 */}
                    <button
                      onClick={() => handleOpenEditModal(category)}
                      className="text-amber-600 hover:text-amber-700 inline-flex items-center justify-center p-1 rounded hover:bg-amber-100 transition-colors"
                      title="수정"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* 활성화/비활성화 토글 버튼 */}
                    {category.isActive ? (
                      <button
                        onClick={() => handleToggleActive(category.id, category.name, false)}
                        className="text-gray-600 hover:text-gray-700 inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors"
                        title="비활성화"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleActive(category.id, category.name, true)}
                        className="text-green-600 hover:text-green-700 inline-flex items-center justify-center p-1 rounded hover:bg-green-100 transition-colors"
                        title="활성화"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    )}

                    {/* 진짜 삭제 버튼 - 비활성화 상태일 때만 활성화 */}
                    {!category.isActive ? (
                      <button
                        onClick={() => handleHardDelete(category.id, category.name)}
                        className="text-red-600 hover:text-red-700 inline-flex items-center justify-center p-1 rounded hover:bg-red-100 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="text-gray-300 inline-flex items-center justify-center p-1 rounded cursor-not-allowed"
                        title="비활성화 후 삭제 가능"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    등록된 카테고리가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 카테고리 등록/수정 모달 */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedCategory}
      />
    </div>
  );
}
