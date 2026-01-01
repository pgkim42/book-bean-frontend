import { useEffect, useState } from 'react';
import categoryService from '../../services/categoryService';
import clsx from 'clsx';

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded"></div>;
  }

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={clsx(
          'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
          selectedCategory === null
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        전체
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
            selectedCategory === category.id
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
