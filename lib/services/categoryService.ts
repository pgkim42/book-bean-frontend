import api from './api';

interface Category {
  id: number;
  name: string;
  description?: string | null;
  displayOrder: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateCategoryRequest {
  name: string;
  description?: string;
  displayOrder: number;
}

interface UpdateCategoryRequest {
  name: string;
  description?: string;
  displayOrder: number;
}

const categoryService = {
  /**
   * 모든 카테고리 조회
   * 백엔드: GET /api/v1/categories
   */
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    // api.ts 인터셉터가 response.data를 반환하므로, response가 곧 ApiResponse
    const data = response.data || response;
    return Array.isArray(data) ? data : data.content || [];
  },

  /**
   * 카테고리 단건 조회
   * 백엔드: GET /api/v1/categories/{id}
   */
  getCategory: async (categoryId: number): Promise<Category> => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data || response;
  },

  /**
   * 카테고리 등록 (관리자 전용)
   * 백엔드: POST /api/v1/categories
   */
  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data || response;
  },

  /**
   * 카테고리 수정 (관리자 전용)
   * 백엔드: PUT /api/v1/categories/{id}
   */
  updateCategory: async (id: number, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data || response;
  },

  /**
   * 카테고리 삭제 (관리자 전용)
   * 백엔드: DELETE /api/v1/categories/{id}
   */
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  /**
   * 카테고리 진짜 삭제 (Hard Delete, 관리자 전용)
   * 백엔드: DELETE /api/v1/categories/{id}/hard
   */
  hardDeleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}/hard`);
  },

  /**
   * 카테고리 활성화 (관리자 전용)
   * 백엔드: PUT /api/v1/categories/{id}/activate
   */
  activateCategory: async (id: number): Promise<Category> => {
    const response = await api.put(`/categories/${id}/activate`);
    return response.data || response;
  },

  // NOTE: 카테고리별 도서 조회는 bookService.getBooksByCategory()를 사용하세요.
  // 백엔드 엔드포인트: GET /api/v1/books/category/{categoryId}
};

export default categoryService;
