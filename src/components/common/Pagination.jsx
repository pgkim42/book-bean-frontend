import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
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

export default Pagination;
