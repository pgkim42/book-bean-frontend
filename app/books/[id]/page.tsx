import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchBook } from '@/lib/utils/server-fetch';
import { formatPrice } from '@/lib/utils/formatters';
import { BOOK_STATUS } from '@/lib/utils/constants';
import BackButton from './components/BackButton';
import BookDetailContent from './components/BookDetailContent';
import ReviewSection from './components/ReviewSection';
import RecentlyViewed from './components/RecentlyViewed';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 도서 상세 페이지 (서버 컴포넌트)
 * - 서버에서 도서 데이터를 페칭하여 초기 렌더링
 * - 인터랙티브한 부분은 클라이언트 컴포넌트로 분리
 */
export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;
  let book;

  try {
    book = await fetchBook(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <BackButton />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 도서 이미지 (서버 렌더링) */}
        <div className="bg-gray-200 rounded-lg overflow-hidden">
          {book.imageUrl ? (
            <Image
              src={book.imageUrl}
              alt={book.title}
              width={400}
              height={500}
              className="w-full h-auto object-cover"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-400">이미지 없음</p>
            </div>
          )}
        </div>

        {/* 도서 정보 (서버 렌더링) + 인터랙티브 부분 (클라이언트) */}
        <div className="space-y-6">
          {/* 정적 정보 */}
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {book.categoryName || '미분류'}
            </span>
            {book.status !== 'AVAILABLE' && (
              <span className="px-3 py-1 bg-gray-200 text-gray-900 rounded-full text-sm font-medium">
                {BOOK_STATUS[book.status]}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

          <div className="space-y-1 text-gray-600">
            <p>저자: {book.author}</p>
            <p>출판사: {book.publisher}</p>
            <p>출판일: {book.publicationDate}</p>
            <p>ISBN: {book.isbn}</p>
          </div>

          <div className="border-t border-b py-4">
            <div className="space-y-1">
              {book.discountRate > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(book.originalPrice)}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {book.discountRate}% 할인
                  </span>
                </div>
              )}
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(book.salePrice)}
              </span>
            </div>
          </div>

          {/* 인터랙티브 부분 (클라이언트 컴포넌트) */}
          <BookDetailContent book={book} />
        </div>
      </div>

      {/* 책 소개 (서버 렌더링) */}
      {book.description && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">책 소개</h2>
          <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
        </div>
      )}

      {/* 리뷰 섹션 (클라이언트 컴포넌트) */}
      <ReviewSection bookId={book.id} />

      {/* 최근 본 도서 (클라이언트 컴포넌트) */}
      <RecentlyViewed currentBookId={book.id} />
    </div>
  );
}

/**
 * 메타데이터 생성 (SEO)
 */
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  let book;

  try {
    book = await fetchBook(id);
  } catch {
    return {
      title: '도서를 찾을 수 없습니다 | BookBean',
    };
  }

  return {
    title: `${book.title} | BookBean`,
    description: book.description
      ? `${book.description.substring(0, 160)}...`
      : `${book.title} - ${book.author} | BookBean`,
    openGraph: {
      title: book.title,
      description: book.description || `${book.author} 저자의 도서`,
      images: book.imageUrl ? [book.imageUrl] : [],
    },
  };
}
