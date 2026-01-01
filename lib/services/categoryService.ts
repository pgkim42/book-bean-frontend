import api from './api';

const categoryService = {
  // 전체 카테고리 조회
  getAllCategories: async () => {
    return await api.get('/categories');
  },

  // 카테고리 단건 조회
  getCategory: async (id: number) => {
    return await api.get(`/categories/${id}`);
  },

  // 카테고리 생성 (관리자)
  createCategory: async (data: any) => {
    return await api.post('/categories', data);
  },

  // 카테고리 수정 (관리자)
  updateCategory: async (id: number, data: any) => {
    return await api.put(`/categories/${id}`, data);
  },

  // 카테고리 삭제 (관리자)
  deleteCategory: async (id: number) => {
    return await api.delete(`/categories/${id}`);
  },
};

export default categoryService;
