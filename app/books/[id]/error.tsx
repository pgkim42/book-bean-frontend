'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Home } from 'lucide-react';

export default function BookDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Book detail error:', error);
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-error-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">도서 정보를 불러올 수 없습니다</h2>
          <p className="text-gray-600">
            {error.message || '요청하신 도서를 찾을 수 없거나 일시적인 오류가 발생했습니다.'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={reset}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={() => router.push('/books')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              도서 목록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
