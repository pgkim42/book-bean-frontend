import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, BookOpen, Shield } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import Button from '../common/Button';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart } = useCartStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <BookOpen className="w-8 h-8" />
            <span>BookBean</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/books"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              도서 목록
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  주문 내역
                </Link>
                {user?.role === 'ROLE_ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>관리자</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </Button>

                <span className="text-sm text-gray-600">{user?.name}님</span>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">회원가입</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
