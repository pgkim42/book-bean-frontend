const Footer = () => {
  return (
    <footer className="bg-primary-600 text-white py-16 mt-auto">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">BookBean</h3>
            <p className="text-primary-300 text-sm leading-relaxed">
              최고의 도서 쇼핑 경험을 제공합니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">바로가기</h3>
            <ul className="space-y-3 text-sm text-primary-300">
              <li>
                <a href="/books" className="hover:text-white transition-all duration-200">
                  도서 목록
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-white transition-all duration-200">
                  주문 내역
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-white transition-all duration-200">
                  장바구니
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">고객센터</h3>
            <ul className="space-y-3 text-sm text-primary-300">
              <li>이메일: support@bookbean.com</li>
              <li>전화: 1234-5678</li>
              <li>운영시간: 평일 09:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-500 text-center text-sm text-primary-300">
          © 2025 BookBean. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
