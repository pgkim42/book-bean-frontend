'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Search, Trash2, X, LayoutGrid, Table, List } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '@/lib/services/userService';
import useAuthStore from '@/lib/store/authStore';
import { formatDate } from '@/lib/utils/formatters';

const VIEW_MODES = {
  CARD: 'card',
  TABLE: 'table',
  COMPACT: 'compact',
};

// Simple Button component
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    outline: 'border border-gray-400 text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(0, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        이전
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg border ${
            currentPage === page
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        다음
      </button>
    </div>
  );
};

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

export default function AdminUsersPage() {
  const { user: authUser } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminUsersViewMode') || VIEW_MODES.CARD;
    }
    return VIEW_MODES.CARD;
  });
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
      setUsers(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
    } catch (error: any) {
      toast.error('사용자 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) {
      toast.error('이메일을 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const response = await userService.getUserByEmail(searchEmail.trim());
      setUsers([response.data]);
      setTotalPages(0);
      setIsSearchMode(true);
      toast.success('검색 완료');
    } catch (error: any) {
      toast.error(error.message || '사용자를 찾을 수 없습니다');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchEmail('');
    setIsSearchMode(false);
    setCurrentPage(0);
    fetchUsers();
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (authUser?.id === userId) {
      toast.error('자기 자신은 삭제할 수 없습니다');
      return;
    }

    if (window.confirm(`${userName} 회원을 정말 삭제하시겠습니까?\n\n삭제된 회원은 비활성화 처리됩니다.`)) {
      try {
        await userService.deleteUser(userId);
        toast.success('회원이 삭제되었습니다');
        if (isSearchMode) {
          handleResetSearch();
        } else {
          fetchUsers();
        }
      } catch (error: any) {
        toast.error(error.message || '회원 삭제에 실패했습니다');
      }
    }
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminUsersViewMode', mode);
    }
  };

  const renderUserBadges = (user: any) => (
    <div className="flex items-center space-x-2">
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          user.role === 'ROLE_ADMIN'
            ? 'bg-gray-200 text-gray-800'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {user.role === 'ROLE_ADMIN' ? '관리자' : '일반회원'}
      </span>
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          user.isActive
            ? 'bg-gray-100 text-gray-900'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        {user.isActive ? '활성' : '비활성'}
      </span>
      {user.emailVerified && (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-900">
          이메일 인증
        </span>
      )}
    </div>
  );

  const renderCardView = () => (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                {renderUserBadges(user)}
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

            <div className="text-right space-y-3">
              <div>
                <p className="text-xs text-gray-500">가입일</p>
                <p className="text-sm text-gray-700">{formatDate(user.createdAt)}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteUser(user.id, user.name)}
                disabled={user.role === 'ROLE_ADMIN' || !user.isActive}
                className="text-gray-900 border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                삭제
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.phone || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderUserBadges(user)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    disabled={user.role === 'ROLE_ADMIN' || !user.isActive}
                    className="text-gray-900 border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompactView = () => (
    <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
      {users.map((user) => (
        <div key={user.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
          <div className="flex-1 flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-900 min-w-[120px]">{user.name}</div>
            <div className="text-sm text-gray-600 min-w-[200px]">{user.email}</div>
            <div className="text-sm text-gray-600 min-w-[120px]">{user.phone || '-'}</div>
            {renderUserBadges(user)}
            <div className="text-xs text-gray-500">{formatDate(user.createdAt)}</div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteUser(user.id, user.name)}
            disabled={user.role === 'ROLE_ADMIN' || !user.isActive}
            className="text-gray-900 border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ml-4"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">사용자 관리</h1>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={viewMode === VIEW_MODES.CARD ? 'primary' : 'outline'}
            onClick={() => handleViewModeChange(VIEW_MODES.CARD)}
            className="flex items-center space-x-1"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>카드</span>
          </Button>
          <Button
            size="sm"
            variant={viewMode === VIEW_MODES.TABLE ? 'primary' : 'outline'}
            onClick={() => handleViewModeChange(VIEW_MODES.TABLE)}
            className="flex items-center space-x-1"
          >
            <Table className="w-4 h-4" />
            <span>테이블</span>
          </Button>
          <Button
            size="sm"
            variant={viewMode === VIEW_MODES.COMPACT ? 'primary' : 'outline'}
            onClick={() => handleViewModeChange(VIEW_MODES.COMPACT)}
            className="flex items-center space-x-1"
          >
            <List className="w-4 h-4" />
            <span>컴팩트</span>
          </Button>
        </div>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="이메일로 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <Button type="submit" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            검색
          </Button>
          {isSearchMode && (
            <Button
              type="button"
              onClick={handleResetSearch}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              전체 목록
            </Button>
          )}
        </form>
      </div>

      {viewMode === VIEW_MODES.CARD && renderCardView()}
      {viewMode === VIEW_MODES.TABLE && renderTableView()}
      {viewMode === VIEW_MODES.COMPACT && renderCompactView()}

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
}
