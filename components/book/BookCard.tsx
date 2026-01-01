'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/formatters';
import { BOOK_STATUS } from '@/lib/utils/constants';
import type { Book } from '@/lib/types';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group block"
    >
      <div className="relative w-full h-48">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {book.status !== 'AVAILABLE' && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-xs rounded z-10">
            {BOOK_STATUS[book.status]}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        <div className="flex items-center gap-2">
          {book.discountRate > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(book.originalPrice)}
            </span>
          )}
          <span className="font-bold text-gray-900">{formatPrice(book.salePrice)}</span>
        </div>
      </div>
    </Link>
  );
}
