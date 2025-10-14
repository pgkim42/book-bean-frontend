import { Link } from 'react-router-dom';
import { Book, Package, Users, Tag } from 'lucide-react';

const AdminDashboard = () => {
  const menuItems = [
    {
      title: '도서 관리',
      icon: Book,
      path: '/admin/books',
      description: '도서 등록, 수정, 삭제',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: '카테고리 관리',
      icon: Tag,
      path: '/admin/categories',
      description: '카테고리 등록, 수정, 삭제',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: '주문 관리',
      icon: Package,
      path: '/admin/orders',
      description: '주문 확인, 배송 처리',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: '사용자 관리',
      icon: Users,
      path: '/admin/users',
      description: '사용자 조회 및 관리',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
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
    </div>
  );
};

export default AdminDashboard;
