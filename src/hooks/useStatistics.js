import { useQuery } from '@tanstack/react-query';
import statisticsService from '../services/statisticsService';

/**
 * 통계 데이터 조회 Hook
 * - 5초마다 자동으로 갱신
 * - 실시간 시스템 현황 표시용
 */
export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: statisticsService.getStatistics,
    refetchInterval: 5000,  // 5초마다 자동 갱신
    staleTime: 0,           // 항상 stale 상태로 간주 (최신 데이터 유지)
    gcTime: 0,              // 캐시 유지 시간 0 (이전 cacheTime)
    retry: 1,               // 실패 시 1번만 재시도
  });
};
