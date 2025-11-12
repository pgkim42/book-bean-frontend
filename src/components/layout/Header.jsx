import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, BookOpen, Shield, Heart } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import Button from '../common/Button';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cart?.items?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-apple sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-semibold text-primary-600 hover:text-primary-700 transition-all duration-200"
          >
            <BookOpen className="w-7 h-7" />
            <span>BookBean</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/books"
              className="text-primary-500 hover:text-primary-600 font-medium transition-all duration-200"
            >
              도서 목록
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className="text-primary-500 hover:text-primary-600 font-medium transition-all duration-200"
                >
                  주문 내역
                </Link>
                {user?.role === 'ROLE_ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-primary-500 hover:text-primary-600 font-medium transition-all duration-200"
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
                  to="/wishlist"
                  className="relative p-2 text-primary-500 hover:text-primary-600 transition-all duration-200"
                >
                  <Heart className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2 text-primary-500 hover:text-primary-600 transition-all duration-200"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="p-2 text-primary-500 hover:text-primary-600 transition-all duration-200"
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

                <span className="text-sm text-primary-500">{user?.name}님</span>
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
