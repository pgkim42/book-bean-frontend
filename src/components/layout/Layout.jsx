import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import useAuthStore from '../../store/authStore';
import useWishlistStore from '../../store/wishlistStore';
import useCartStore from '../../store/cartStore';

const Layout = () => {
  const { isAuthenticated } = useAuthStore();
  const { initialize: initializeWishlist } = useWishlistStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    // 위시리스트 초기화
    initializeWishlist(isAuthenticated);

    // 로그인 사용자는 장바구니도 가져오기
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, initializeWishlist, fetchCart]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
