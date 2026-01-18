import { toast } from 'react-hot-toast';
import { isAxiosError } from 'axios';
import type { ApiErrorLike, ApiErrorResponse } from '@/lib/types';

/**
 * API 에러 메시지를 추출하는 헬퍼 함수
 */
export function extractErrorMessage(error: ApiErrorLike): string {
  // Axios 에러인 경우
  if (isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response?.data;
    if (response?.message) {
      return response.message;
    }
    if (error.message) {
      return error.message;
    }
  }

  // 일반 Error 객체인 경우
  if (error instanceof Error) {
    return error.message;
  }

  // 문자열인 경우
  if (typeof error === 'string') {
    return error;
  }

  // 그 외의 경우
  return '오류가 발생했습니다';
}

/**
 * API 에러 처리를 위한 커스텀 훅
 *
 * @example
 * ```tsx
 * const { handleErrorAsync } = useApiError();
 *
 * const handleSubmit = handleErrorAsync(async () => {
 *   await api.post('/data', formData);
 *   toast.success('성공');
 * });
 * ```
 */
export function useApiError() {
  const showError = (error: ApiErrorLike): string => {
    const message = extractErrorMessage(error);
    toast.error(message);
    return message;
  };

  /**
   * 비동기 함수를 래핑하여 에러를 자동으로 처리합니다.
   */
  const handleErrorAsync = <T extends unknown[], R>(
    asyncFn: (...args: T) => Promise<R>,
    options?: {
      onError?: (error: ApiErrorLike, message: string) => void;
      suppressToast?: boolean;
    }
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        const message = extractErrorMessage(error);
        if (!options?.suppressToast) {
          toast.error(message);
        }
        options?.onError?.(error as ApiErrorLike, message);
        return undefined;
      }
    };
  };

  return {
    showError,
    handleErrorAsync,
  };
}
