import api from './api';

/**
 * 통계 Service
 * 시스템 전체 통계 조회 API
 */
const statisticsService = {
  /**
   * 시스템 통계 조회
   * - 전체 주문 수, 오늘 주문 수, 총 매출액
   * - 재고 부족 책 수, 전체 책 수
   */
  getStatistics: async () => {
    return await api.get('/statistics');
  },
};

export default statisticsService;
