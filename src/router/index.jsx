import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Loading from '../components/common/Loading';

// Lazy loading pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Books = lazy(() => import('../pages/Books'));
const BookDetail = lazy(() => import('../pages/BookDetail'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Orders = lazy(() => import('../pages/Orders'));
const OrderDetail = lazy(() => import('../pages/OrderDetail'));
const Profile = lazy(() => import('../pages/Profile'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminBooks = lazy(() => import('../pages/admin/AdminBooks'));
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));

// Suspense Wrapper
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <SuspenseWrapper>
            <Register />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'books',
        element: (
          <SuspenseWrapper>
            <Books />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'books/:id',
        element: (
          <SuspenseWrapper>
            <BookDetail />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <Cart />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <Checkout />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <Orders />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <OrderDetail />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <Profile />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <AdminDashboard />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/books',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <AdminBooks />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/categories',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <AdminCategories />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/orders',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <AdminOrders />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <AdminUsers />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
