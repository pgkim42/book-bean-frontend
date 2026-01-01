import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogOut,
  BookOpen,
  Shield,
  Heart,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import Button from '../common/Button';
import { CountBadge } from '../common/Badge';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const cartItemCount = cart?.items?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  const navLinks = [
    { to: '/books', label: '도서 목록' },
    ...(isAuthenticated ? [{ to: '/orders', label: '주문 내역' }] : []),
  ];

  return (
    <header className="glass sticky top-0 z-50 border-b border-warm-100">
      <nav className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-warm group-hover:shadow-warm-lg transition-all duration-300 group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-warm-900 hidden sm:block">
              BookBean
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-warm-600 hover:text-primary-600 font-medium transition-colors link-underline"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user?.role === 'ROLE_ADMIN' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>관리자</span>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* 위시리스트 */}
                <Link
                  to="/wishlist"
                  className="relative p-2.5 text-warm-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5">
                      <CountBadge count={wishlistCount} variant="error" />
                    </span>
                  )}
                </Link>

                {/* 장바구니 */}
                <Link
                  to="/cart"
                  className="relative p-2.5 text-warm-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5">
                      <CountBadge count={cartItemCount} variant="primary" />
                    </span>
                  )}
                </Link>

                {/* 프로필 */}
                <Link
                  to="/profile"
                  className="p-2.5 text-warm-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* 사용자 이름 */}
                <span className="text-sm font-medium text-warm-700 px-2">
                  {user?.name}님
                </span>

                {/* 로그아웃 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">회원가입</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-warm-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={clsx(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
          )}
        >
          <div className="pt-4 space-y-1">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-warm-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-warm-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    위시리스트
                  </span>
                  {wishlistCount > 0 && (
                    <CountBadge count={wishlistCount} variant="error" />
                  )}
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-warm-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    장바구니
                  </span>
                  {cartItemCount > 0 && (
                    <CountBadge count={cartItemCount} variant="primary" />
                  )}
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-warm-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
                >
                  <User className="w-5 h-5" />
                  내 프로필
                </Link>

                {user?.role === 'ROLE_ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    관리자
                  </Link>
                )}

                <div className="pt-4 px-4 border-t border-warm-100 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-warm-600">{user?.name}님</span>
                  </div>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </Button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-4 px-4 border-t border-warm-100 mt-4 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" fullWidth>
                    로그인
                  </Button>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button fullWidth>회원가입</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
