import { Book, Package, Users, Tag } from 'lucide-react';
import Link from 'next/link';
import SalesChart from '@/components/dashboard/SalesChart';
import OrderStatusChart from '@/components/dashboard/OrderStatusChart';
import TopBooksChart from '@/components/dashboard/TopBooksChart';
import NewUsersChart from '@/components/dashboard/NewUsersChart';

const AdminDashboard = () => {
  const menuItems = [
    {
      title: '도서 관리',
      icon: Book,
      path: '/admin/books',
      description: '도서 등록, 수정, 삭제',
      color: 'bg-gray-100 text-gray-900',
    },
    {
      title: '카테고리 관리',
      icon: Tag,
      path: '/admin/categories',
      description: '카테고리 등록, 수정, 삭제',
      color: 'bg-gray-200 text-gray-900',
    },
    {
      title: '주문 관리',
      icon: Package,
      path: '/admin/orders',
      description: '주문 확인, 배송 처리',
      color: 'bg-gray-300 text-gray-900',
    },
    {
      title: '사용자 관리',
      icon: Users,
      path: '/admin/users',
      description: '사용자 조회 및 관리',
      color: 'bg-gray-400 text-white',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">관리자 대시보드</h1>

      {/* 관리 메뉴 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </Link>
          );
        })}
      </div>

      {/* 차트 섹션 */}
      <div className="space-y-6">
        {/* 매출 & 주문 상태 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <OrderStatusChart />
        </div>

        {/* 베스트셀러 & 신규 회원 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopBooksChart />
          <NewUsersChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
