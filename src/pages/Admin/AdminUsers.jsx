import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '../../services/userService';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/formatters';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc',
      });
      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      toast.error('사용자 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">사용자 관리</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'ROLE_ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.role === 'ROLE_ADMIN' ? '관리자' : '일반회원'}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.isActive ? '활성' : '비활성'}
                  </span>
                  {user.emailVerified && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      이메일 인증
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <div>
                        {user.zipCode && <span className="text-gray-500">({user.zipCode}) </span>}
                        <span>{user.address}</span>
                        {user.addressDetail && <span>, {user.addressDetail}</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">가입일</p>
                <p className="text-sm text-gray-700">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
