import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { BookOpen, TrendingUp, Sparkles, ArrowRight, ChevronRight, Activity } from 'lucide-react';
import BookCard from '../components/book/BookCard';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import { useStatistics } from '../hooks/useStatistics';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryBooks, setCategoryBooks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // 신간 도서 (최신순 8개)
      const newBooksResponse = await bookService.getAllBooks({
        page: 0,
        size: 8,
        sort: 'createdAt,desc'
      });
      setNewBooks(newBooksResponse.data.content);

      // 히어로 캐러셀용 (최신순 5개)
      const featuredResponse = await bookService.getAllBooks({
        page: 0,
        size: 5,
        sort: 'createdAt,desc'
      });
      setFeaturedBooks(featuredResponse.data.content);

      // 인기 도서 (임시로 최신순 8개 - 추후 판매량/리뷰 기준으로 변경 가능)
      const popularResponse = await bookService.getAllBooks({
        page: 0,
        size: 8,
        sort: 'createdAt,desc'
      });
      setPopularBooks(popularResponse.data.content);

      // 카테고리 목록
      const categoriesResponse = await categoryService.getAllCategories();
      const allCategories = categoriesResponse.data;
      setCategories(allCategories.slice(0, 4)); // 상위 4개 카테고리만

      // 각 카테고리별 도서
      const categoryBooksData = {};
      for (const category of allCategories.slice(0, 4)) {
        const response = await bookService.getBooksByCategory(category.id, {
          page: 0,
          size: 4,
          sort: 'createdAt,desc'
        });
        categoryBooksData[category.id] = response.data.content;
      }
      setCategoryBooks(categoryBooksData);

    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-0 -mt-6">
      {/* Hero Section with Carousel */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 tracking-tight leading-tight text-primary-600">
              당신만을 위한
              <br />
              완벽한 책을 만나보세요
            </h1>
            <p className="text-xl md:text-2xl text-primary-500 mb-8">
              BookBean에서 새로운 세계를 경험하세요
            </p>
          </div>

          {/* Featured Books Carousel */}
          {featuredBooks.length > 0 && (
            <div className="relative">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="rounded-3xl overflow-hidden shadow-apple-lg"
                style={{
                  '--swiper-pagination-color': '#737373',
                  '--swiper-navigation-color': '#737373',
                }}
              >
                {featuredBooks.map((book) => (
                  <SwiperSlide key={book.id}>
                    <Link to={`/books/${book.id}`}>
                      <div className="relative h-[500px] bg-gradient-to-r from-primary-100 to-primary-50 flex items-center">
                        <div className="container mx-auto px-8 md:px-16">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Book Info */}
                            <div className="text-left space-y-6">
                              <div className="inline-block">
                                <span className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-full">
                                  신간 추천
                                </span>
                              </div>
                              <h2 className="text-4xl md:text-5xl font-bold text-primary-600 leading-tight">
                                {book.title}
                              </h2>
                              <p className="text-xl text-primary-500">
                                {book.author}
                              </p>
                              <p className="text-lg text-primary-400 line-clamp-3">
                                {book.description || `${book.publisher}에서 출간한 ${book.categoryName || '도서'}`}
                              </p>
                              <Button size="lg" className="mt-4">
                                자세히 보기 <ArrowRight className="w-5 h-5 ml-2" />
                              </Button>
                            </div>

                            {/* Book Image */}
                            <div className="flex justify-center">
                              <div className="relative">
                                {book.imageUrl ? (
                                  <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="w-80 h-96 object-cover rounded-2xl shadow-apple-lg"
                                  />
                                ) : (
                                  <div className="w-80 h-96 bg-primary-100 rounded-2xl shadow-apple-lg flex items-center justify-center">
                                    <BookOpen className="w-24 h-24 text-primary-400" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* Real-time Statistics Banner */}
      <StatisticsBanner />

      {/* Bestsellers Section */}
      {popularBooks.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-primary-600" />
                  <h2 className="text-4xl md:text-5xl font-semibold text-primary-600 tracking-tight">
                    베스트셀러
                  </h2>
                </div>
                <p className="text-xl text-primary-500">
                  지금 가장 인기있는 도서를 만나보세요
                </p>
              </div>
              <Link to="/books">
                <Button variant="outline" className="hidden md:flex items-center space-x-2">
                  <span>전체보기</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-4"
              style={{
                '--swiper-navigation-color': '#737373',
              }}
            >
              {popularBooks.map((book) => (
                <SwiperSlide key={book.id}>
                  <BookCard book={book} />
                </SwiperSlide>
              ))}
            </Swiper>

            <Link to="/books" className="md:hidden mt-8 flex justify-center">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>전체보기</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newBooks.length > 0 && (
        <section className="py-24 px-4 bg-primary-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-8 h-8 text-primary-600" />
                  <h2 className="text-4xl md:text-5xl font-semibold text-primary-600 tracking-tight">
                    신간 도서
                  </h2>
                </div>
                <p className="text-xl text-primary-500">
                  따끈따끈한 신간을 가장 먼저 만나보세요
                </p>
              </div>
              <Link to="/books?sort=createdAt,desc">
                <Button variant="outline" className="hidden md:flex items-center space-x-2">
                  <span>전체보기</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            <Link to="/books?sort=createdAt,desc" className="md:hidden mt-8 flex justify-center">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>전체보기</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Category Sections */}
      {categories.map((category, index) => {
        const books = categoryBooks[category.id] || [];
        if (books.length === 0) return null;

        return (
          <section
            key={category.id}
            className={`py-24 px-4 ${index % 2 === 0 ? 'bg-white' : 'bg-primary-50'}`}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-semibold text-primary-600 tracking-tight mb-4">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-xl text-primary-500">
                      {category.description}
                    </p>
                  )}
                </div>
                <Link to={`/books?category=${category.id}`}>
                  <Button variant="outline" className="hidden md:flex items-center space-x-2">
                    <span>전체보기</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              <Link to={`/books?category=${category.id}`} className="md:hidden mt-8 flex justify-center">
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>전체보기</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-semibold text-primary-600 mb-8 tracking-tight">
            지금 바로 시작하세요
          </h2>
          <p className="text-2xl text-primary-500 mb-12">
            BookBean 회원이 되어 특별한 혜택을 누리세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                회원가입하기
              </Button>
            </Link>
            <Link to="/books">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                도서 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Real-time Statistics Banner Component
 * - 5초마다 자동 갱신되는 시스템 통계 표시
 * - 전체 주문, 오늘 주문, 매출액, 재고 부족, 전체 도서 등
 */
const StatisticsBanner = () => {
  const { data: stats, isLoading, isError } = useStatistics();

  if (isLoading) {
    return (
      <section className="bg-gradient-to-r from-primary-50 to-indigo-50 py-8 border-y border-primary-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-400 animate-pulse mr-2" />
            <p className="text-primary-600 font-medium">실시간 통계 로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !stats) {
    return null;
  }

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  const formatRevenue = (num) => {
    return `${formatNumber(num)}원`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <section className="bg-gradient-to-r from-primary-50 to-indigo-50 py-12 border-y border-primary-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <Activity className="w-5 h-5 text-primary-600 mr-2 animate-pulse" />
          <h3 className="text-lg font-semibold text-primary-600">
            실시간 시스템 현황
          </h3>
          <span className="ml-3 text-sm text-primary-500">
            (5초마다 자동 갱신)
          </span>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Orders */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100 hover:shadow-md transition-shadow">
            <p className="text-xs text-primary-500 mb-1 font-medium">전체 주문</p>
            <p className="text-2xl font-bold text-primary-600">{formatNumber(stats.totalOrders)}</p>
            <p className="text-xs text-primary-400 mt-1">건</p>
          </div>

          {/* Today Orders */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
            <p className="text-xs text-indigo-500 mb-1 font-medium">오늘 주문</p>
            <p className="text-2xl font-bold text-indigo-600">{formatNumber(stats.todayOrders)}</p>
            <p className="text-xs text-indigo-400 mt-1">건</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <p className="text-xs text-emerald-500 mb-1 font-medium">총 매출</p>
            <p className="text-2xl font-bold text-emerald-600">{formatNumber(stats.totalRevenue)}</p>
            <p className="text-xs text-emerald-400 mt-1">원</p>
          </div>

          {/* Low Stock Count */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
            <p className="text-xs text-amber-500 mb-1 font-medium">재고 부족</p>
            <p className="text-2xl font-bold text-amber-600">{formatNumber(stats.lowStockCount)}</p>
            <p className="text-xs text-amber-400 mt-1">권</p>
          </div>

          {/* Total Books */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <p className="text-xs text-purple-500 mb-1 font-medium">전체 도서</p>
            <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.totalBooks)}</p>
            <p className="text-xs text-purple-400 mt-1">권</p>
          </div>

          {/* Last Updated */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-xs text-slate-500 mb-1 font-medium">업데이트</p>
            <p className="text-2xl font-bold text-slate-600">{formatTime(stats.lastUpdated)}</p>
            <p className="text-xs text-slate-400 mt-1">시간</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
