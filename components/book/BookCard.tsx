'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/formatters';
import { BOOK_STATUS } from '@/lib/utils/constants';
import { getBookImageBlurPlaceholder } from '@/lib/utils/image';
import type { Book } from '@/lib/types';

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group block"
    >
      <div className="relative w-full h-48">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={getBookImageBlurPlaceholder()}
          />
        ) : (
          <div className="w-full h-full bg-warm-100 flex items-center justify-center">
            <span className="text-warm-400">No Image</span>
          </div>
        )}
        {book.status !== 'AVAILABLE' && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-warm-800 text-white text-xs rounded-lg z-10">
            {BOOK_STATUS[book.status]}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-warm-900 line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-sm text-warm-600 mb-2">{book.author}</p>
        <div className="flex items-center gap-2">
          {book.discountRate > 0 && (
            <span className="text-sm text-warm-400 line-through">
              {formatPrice(book.originalPrice)}
            </span>
          )}
          <span className="font-bold text-primary-600">{formatPrice(book.salePrice)}</span>
        </div>
      </div>
    </Link>
  );
}

export default memo(BookCard);
