import { fetchBooks } from '@/lib/utils/server-fetch';
import BookListClient from './components/BookListClient';

interface BooksPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

/**
 * 도서 목록 페이지 (서버 컴포넌트)
 * - URL 파라미터를 기반으로 초기 데이터를 서버에서 페칭
 * - 인터랙티브한 부분은 클라이언트 컴포넌트로 위임
 */
export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;

  // URL 파라미터 파싱
  const page = params.page ? parseInt(params.page as string) : 0;
  const size = 12;
  const sort = (params.sort as string) || 'createdAt,desc';
  const minPrice = params.minPrice ? parseInt(params.minPrice as string) : undefined;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice as string) : undefined;
  const minRating = params.minRating ? parseFloat(params.minRating as string) : undefined;
  const category = params.category ? parseInt(params.category as string) : undefined;
  const keyword = params.search as string;

  // 서버에서 초기 데이터 페칭
  let initialBooks: any[] = [];
  let initialTotalPages = 0;

  try {
    const data = await fetchBooks({
      page,
      size,
      sort,
      minPrice,
      maxPrice,
      minRating,
      category,
      keyword,
    });
    initialBooks = data.content;
    initialTotalPages = data.totalPages;
  } catch (error) {
    console.error('Failed to fetch initial books:', error);
    // 에러가 발생해도 클라이언트 컴포넌트에서 다시 시도하므로 빈 배열 전달
  }

  return (
    <BookListClient
      initialBooks={initialBooks}
      initialTotalPages={initialTotalPages}
    />
  );
}

/**
 * 메타데이터 생성 (SEO)
 */
export async function generateMetadata({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const keyword = params.search as string;
  const category = params.category as string;

  let title = '도서 목록 | BookBean';
  let description = 'BookBean에서 다양한 도서를 만나보세요.';

  if (keyword) {
    title = `"${keyword}" 검색 결과 | BookBean`;
    description = `"${keyword}"에 대한 도서 검색 결과입니다.`;
  } else if (category) {
    title = `카테고리 도서 | BookBean`;
    description = '선택한 카테고리의 도서 목록입니다.';
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}
