import api from './api';

interface Category {
  id: number;
  name: string;
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

  // NOTE: 카테고리별 도서 조회는 bookService.getBooksByCategory()를 사용하세요.
  // 백엔드 엔드포인트: GET /api/v1/books/category/{categoryId}
};

export default categoryService;
