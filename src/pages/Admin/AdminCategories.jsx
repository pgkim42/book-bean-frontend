import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import categoryService from '../../services/categoryService';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import CategoryFormModal from '../../components/admin/CategoryFormModal';
import { formatDate } from '../../utils/formatters';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      toast.error('카테고리 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (data) => {
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
      toast.error(error.message || '카테고리 저장에 실패했습니다');
      throw error; // 모달이 닫히지 않도록
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) {
      try {
        await categoryService.deleteCategory(id);
        toast.success('카테고리가 삭제되었습니다');
        fetchCategories();
      } catch (error) {
        toast.error(error.message || '카테고리 삭제에 실패했습니다');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">카테고리 관리</h1>
        <Button
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>카테고리 등록</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">설명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">순서</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">등록일</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
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
                    className={`px-2 py-1 text-xs rounded-full ${
                      category.isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {category.isActive ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(category.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => handleOpenEditModal(category)}
                    className="text-gray-800 hover:text-gray-900 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
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

      {/* 카테고리 등록/수정 모달 */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedCategory}
      />
    </div>
  );
};

export default AdminCategories;
