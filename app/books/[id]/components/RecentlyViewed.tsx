'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Book } from '@/lib/types';
import { getBookPlaceholder } from '@/lib/utils/image';

interface RecentlyViewedProps {
  currentBookId: number;
}

/**
 * 최근 본 도서 컴포넌트 (클라이언트 컴포넌트)
 * - localStorage를 사용하여 최근 본 도서 목록 표시
 */
export default function RecentlyViewed({ currentBookId }: RecentlyViewedProps) {
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);

  useEffect(() => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = recentlyViewed.filter((book: Book) => book.id !== currentBookId).slice(0, 4);
    setRecentBooks(filtered);
  }, [currentBookId]);

  if (recentBooks.length === 0) return null;

  return (
    <div className="py-8 px-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">최근 본 도서</h2>
      <div className="flex gap-4 overflow-x-auto">
        {recentBooks.map((book) => (
          <a key={book.id} href={`/books/${book.id}`} className="flex-shrink-0 w-32">
            {book.imageUrl ? (
              <Image
                src={book.imageUrl}
                alt={book.title}
                width={128}
                height={160}
                className="w-32 h-40 object-cover rounded"
                unoptimized
              />
            ) : (
              <div className="w-32 h-40 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
            <p className="text-sm font-medium mt-2 line-clamp-2">{book.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
