'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function BooksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Books page error:', error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-error-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">도서 목록을 불러올 수 없습니다</h2>
          <p className="text-gray-600">
            {error.message || '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={reset}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
