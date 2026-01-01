import Link from 'next/link';
import { BookOpen, Mail, Phone, Clock, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/books', label: '도서 목록' },
    { href: '/orders', label: '주문 내역' },
    { href: '/cart', label: '장바구니' },
    { href: '/wishlist', label: '위시리스트' },
  ];

  const supportLinks = [
    { label: '자주 묻는 질문', href: '#' },
    { label: '배송 안내', href: '#' },
    { label: '교환/반품', href: '#' },
    { label: '개인정보처리방침', href: '#' },
  ];

  return (
    <footer className="bg-warm-900 text-warm-100 mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-6 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BookBean</span>
            </Link>
            <p className="text-warm-400 text-sm leading-relaxed mb-6">
              따뜻한 책 한 잔, BookBean에서 당신만을 위한 완벽한 책을 만나보세요.
              독서의 즐거움을 함께 나누는 온라인 서점입니다.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-warm-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-warm-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-warm-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">바로가기</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-warm-400 hover:text-white transition-colors text-sm link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">고객지원</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-warm-400 hover:text-white transition-colors text-sm link-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">고객센터</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-warm-400">이메일</p>
                  <a
                    href="mailto:support@bookbean.com"
                    className="text-white hover:text-primary-400 transition-colors"
                  >
                    support@bookbean.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-warm-400">전화</p>
                  <a
                    href="tel:1234-5678"
                    className="text-white hover:text-primary-400 transition-colors"
                  >
                    1234-5678
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-warm-400">운영시간</p>
                  <p className="text-white">평일 09:00 - 18:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-800">
        <div className="container mx-auto px-6 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-warm-500">
              © {currentYear} BookBean. All rights reserved.
            </p>
            <p className="text-sm text-warm-500">
              Made with ☕ for book lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
