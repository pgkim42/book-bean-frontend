/**
 * 이미지 관련 유틸리티 함수
 */

/**
 * 기본 블러 플레이스홀더 데이터 URL (회색 배경)
 * 외부 이미지가 로딩되기 전에 표시할 흐릿한 이미지입니다.
 */
export const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjVmM2YwIi8+PC9zdmc+';

/**
 * 도서 카드 이미지를 위한 블러 플레이스홀더를 생성합니다.
 */
export function getBookImageBlurPlaceholder(): string {
  return BLUR_PLACEHOLDER;
}

/**
 * 이미지 URL이 로컬인지 외부인지 확인합니다.
 */
export function isExternalImage(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * 이미지 로드 실패 시 대체 URL을 반환합니다.
 */
export function getFallbackImageUrl(title: string): string {
  // 제목을 기반으로 한 기본 이미지 (예: 플레이스홀더 서비스)
  return `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
      <rect fill="#f5f3f0" width="200" height="300"/>
      <text x="100" y="150" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#d6d0c7">
        No Image
      </text>
    </svg>`
  )}`;
}
