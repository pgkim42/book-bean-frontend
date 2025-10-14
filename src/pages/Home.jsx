import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-2xl">
        <h1 className="text-5xl font-bold mb-4">BookBean에 오신 것을 환영합니다</h1>
        <p className="text-xl mb-8">
          당신의 완벽한 책을 찾아보세요
        </p>
        <Link to="/books">
          <Button size="lg" variant="secondary">
            도서 둘러보기
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary-100 rounded-full">
            <BookOpen className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">다양한 도서</h3>
          <p className="text-gray-600">
            수천 권의 도서를 한곳에서 만나보세요
          </p>
        </div>

        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary-100 rounded-full">
            <ShoppingCart className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">쉬운 구매</h3>
          <p className="text-gray-600">
            간편한 주문과 빠른 배송 서비스
          </p>
        </div>

        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary-100 rounded-full">
            <TrendingUp className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">베스트셀러</h3>
          <p className="text-gray-600">
            인기 도서와 추천 도서를 확인하세요
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
        <p className="text-gray-600 mb-8">
          회원가입하고 특별한 혜택을 받아보세요
        </p>
        <Link to="/register">
          <Button size="lg">회원가입하기</Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
