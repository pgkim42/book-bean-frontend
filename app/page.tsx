import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-warm-gradient py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 tracking-tight leading-tight text-primary-600">
              당신만을 위한
              <br />
              완벽한 책을 만나보세요
            </h1>
            <p className="text-xl md:text-2xl text-primary-500 mb-8">
              BookBean에서 새로운 세계를 경험하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books">
                <button className="px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-warm hover:shadow-warm-md">
                  도서 둘러보기
                </button>
              </Link>
              <Link href="/register">
                <button className="px-8 py-3 border-2 border-warm-200 text-warm-700 rounded-xl font-medium hover:border-primary-600 hover:text-primary-600 transition-colors">
                  회원가입하기
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-primary-600 tracking-tight mb-4">
              왜 BookBean인가요?
            </h2>
            <p className="text-xl text-primary-500">
              독자를 위한 최고의 경험을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-warm-900 mb-3">
                다양한 도서
              </h3>
              <p className="text-warm-600">
                수만 권의 도서를 카테고리별로 찾아보세요.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-warm-900 mb-3">
                빠른 배송
              </h3>
              <p className="text-warm-600">
                주문하신 도서를 빠르고 안전하게 받아보세요.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-warm-900 mb-3">
                특별한 혜택
              </h3>
              <p className="text-warm-600">
                회원가입 하시고 다양한 혜택을 누리세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-warm-gradient-subtle">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-semibold text-primary-600 mb-8 tracking-tight">
            지금 바로 시작하세요
          </h2>
          <p className="text-2xl text-primary-500 mb-12">
            BookBean 회원이 되어 특별한 혜택을 누리세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="px-8 py-4 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-warm hover:shadow-warm-md text-lg">
                회원가입하기
              </button>
            </Link>
            <Link href="/books">
              <button className="px-8 py-4 border-2 border-warm-200 text-warm-700 rounded-xl font-medium hover:border-primary-600 hover:text-primary-600 transition-colors text-lg flex items-center justify-center gap-2">
                도서 둘러보기
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
