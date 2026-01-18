import api from './api';
import type { User } from '../types';

const userService = {
  // 내 정보 조회
  getMyInfo: async () => {
    return await api.get('/users/me');
  },

  // 이메일로 사용자 조회
  getUserByEmail: async (email: string) => {
    return await api.get(`/users/email/${email}`);
  },

  // 전체 사용자 조회 (관리자)
  getAllUsers: async (params: { page?: number; size?: number; sort?: string } = {}) => {
    const { page = 0, size = 10, sort = 'createdAt,desc' } = params;
    return await api.get('/users', { params: { page, size, sort } });
  },

  // 사용자 정보 수정
  updateUser: async (id: number, data: Partial<Omit<User, 'id'>>) => {
    return await api.put(`/users/${id}`, data);
  },

  // 사용자 삭제
  deleteUser: async (id: number) => {
    return await api.delete(`/users/${id}`);
  },
};

export default userService;
