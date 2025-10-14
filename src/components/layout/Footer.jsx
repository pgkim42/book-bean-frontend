const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">BookBean</h3>
            <p className="text-gray-400 text-sm">
              최고의 도서 쇼핑 경험을 제공합니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/books" className="hover:text-white transition-colors">
                  도서 목록
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-white transition-colors">
                  주문 내역
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-white transition-colors">
                  장바구니
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">고객센터</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>이메일: support@bookbean.com</li>
              <li>전화: 1234-5678</li>
              <li>운영시간: 평일 09:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          © 2025 BookBean. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
