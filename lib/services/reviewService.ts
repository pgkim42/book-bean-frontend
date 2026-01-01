import api from './api';
import type { Review, ReviewCreateRequest, ReviewUpdateRequest } from '../types';

const reviewService = {
  // 리뷰 작성
  createReview: async (data: ReviewCreateRequest): Promise<Review> => {
    return await api.post('/reviews', data);
  },

  // 리뷰 상세 조회
  getReview: async (id: number): Promise<Review> => {
    return await api.get(`/reviews/${id}`);
  },

  // 특정 도서의 리뷰 목록
  getBookReviews: async (bookId: number, params: { page?: number; size?: number; sort?: string } = {}): Promise<any> => {
    const { page = 0, size = 10, sort = 'createdAt,desc' } = params;
    return await api.get(`/reviews/books/${bookId}`, {
      params: { page, size, sort },
    });
  },

  // 내 리뷰 목록
  getMyReviews: async (params: { page?: number; size?: number; sort?: string } = {}): Promise<any> => {
    const { page = 0, size = 10, sort = 'createdAt,desc' } = params;
    return await api.get('/reviews/my', { params: { page, size, sort } });
  },

  // 리뷰 수정
  updateReview: async (id: number, data: ReviewUpdateRequest): Promise<Review> => {
    return await api.put(`/reviews/${id}`, data);
  },

  // 리뷰 삭제
  deleteReview: async (id: number): Promise<void> => {
    return await api.delete(`/reviews/${id}`);
  },

  // 리뷰 투표
  voteReview: async (reviewId: number, voteType: string): Promise<Review> => {
    return await api.post(`/reviews/${reviewId}/vote`, { voteType });
  },

  // 리뷰 투표 취소
  cancelVote: async (reviewId: number): Promise<void> => {
    return await api.delete(`/reviews/${reviewId}/vote`);
  },
};

export default reviewService;
