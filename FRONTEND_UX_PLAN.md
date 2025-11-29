# BookBean 프론트엔드 UI/UX 개선 PLAN

## 디자인 방향: Warm & Cozy (따뜻한 서점 분위기)

### 컨셉
- 오래된 서점의 따뜻함과 현대적 디지털 경험의 조화
- 크림색, 앰버, 테라코타 계열의 따뜻한 컬러
- 부드러운 곡선과 넉넉한 여백
- 종이/책 텍스처 느낌

---

## Phase 1: 디자인 토큰 & 테마 (Foundation)

### 1.1 컬러 팔레트 변경 (tailwind.config.js)

**현재:** Apple 모노크롬 (gray 계열)
**변경:** Warm & Cozy 팔레트

```javascript
colors: {
  // Primary: 따뜻한 브라운
  primary: {
    50: '#fdf8f6',   // cream
    100: '#f9ede7',
    200: '#f3d9ce',
    300: '#e9bfab',
    400: '#d89b7a',
    500: '#c47a54',  // main
    600: '#b35c38',  // accent
    700: '#8f4a2c',
    800: '#6b3820',
    900: '#4a2714',
  },
  // Accent: 따뜻한 앰버
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
  },
  // Neutral: 따뜻한 그레이
  warm: {
    50: '#faf9f7',
    100: '#f5f3f0',
    200: '#e8e4de',
    300: '#d6d0c7',
    400: '#b8b0a3',
    500: '#9a917f',
    600: '#7c7365',
    700: '#5e574c',
    800: '#403c34',
    900: '#22201c',
  }
}
```

### 1.2 타이포그래피 (Pretendard 폰트)

```html
<!-- index.html -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@latest/dist/web/static/pretendard.min.css" />
```

### 1.3 그림자 (Warm Shadows)

```javascript
boxShadow: {
  'warm-sm': '0 1px 2px 0 rgba(74, 39, 20, 0.05)',
  'warm': '0 4px 12px 0 rgba(74, 39, 20, 0.08)',
  'warm-lg': '0 12px 24px 0 rgba(74, 39, 20, 0.12)',
  'warm-xl': '0 24px 48px 0 rgba(74, 39, 20, 0.16)',
}
```

---

## Phase 2: 핵심 컴포넌트 개선

### 2.1 Button 컴포넌트 강화

**추가할 variants:**
- `primary` - 따뜻한 브라운 (기본)
- `secondary` - 크림색 배경
- `ghost` - 투명 배경, 호버시 크림색
- `accent` - 앰버 강조색
- `destructive` - 부드러운 레드

**개선 사항:**
- 호버시 `scale(1.02)` + 그림자 증가
- 클릭시 `scale(0.98)` 피드백
- 로딩 상태 스피너 개선
- `rounded-2xl` (더 부드러운 곡선)

### 2.2 Input 컴포넌트 강화

**개선 사항:**
- 따뜻한 테두리 색상
- Focus 상태: 앰버 glow 효과
- 성공/에러 상태 아이콘 추가
- 플로팅 레이블 옵션
- `rounded-xl` 적용

### 2.3 Card 컴포넌트 (신규)

**공통 카드 컴포넌트 추출:**
- 따뜻한 크림색 배경
- 부드러운 그림자
- 호버시 lift 효과
- 다양한 padding 옵션

### 2.4 Badge 컴포넌트 (신규)

**Variants:**
- `default` - 브라운
- `success` - 그린
- `warning` - 앰버
- `error` - 레드
- `info` - 블루

### 2.5 Skeleton 컴포넌트 개선

**개선 사항:**
- 따뜻한 그라데이션 shimmer
- `animate-pulse` → 커스텀 shimmer 애니메이션
- 더 부드러운 색상 전환

---

## Phase 3: 레이아웃 컴포넌트 개선

### 3.1 Header 개선

**개선 사항:**
- 따뜻한 크림색 배경
- 스크롤시 backdrop-blur 효과
- 로고 호버 애니메이션
- 모바일 햄버거 메뉴 슬라이드

### 3.2 Footer 개선

**개선 사항:**
- 따뜻한 다크 브라운 배경
- 링크 호버 underline 애니메이션
- 소셜 아이콘 추가

### 3.3 Layout 개선

**개선 사항:**
- 따뜻한 배경색 (off-white)
- max-width 조정
- 섹션간 여백 통일

---

## Phase 4: 애니메이션 시스템

### 4.1 Framer Motion 도입

```bash
npm install framer-motion
```

### 4.2 공통 애니메이션 variants

```javascript
// utils/animations.js
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};
```

### 4.3 페이지 전환 애니메이션

- 모든 페이지에 fade-in 적용
- 리스트 아이템 stagger 효과
- 스크롤 reveal 효과

---

## Phase 5: BookCard 컴포넌트 리디자인

### 개선 사항:
1. 따뜻한 크림색 카드 배경
2. 책 표지 그림자 효과 (3D 느낌)
3. 호버시 표지 tilt 효과
4. 가격 표시 개선 (할인율 강조)
5. 위시리스트 하트 애니메이션
6. 장바구니 추가 bounce 효과

---

## 구현 순서

### Step 1: Foundation (예상: 1-2시간)
- [ ] tailwind.config.js 컬러 팔레트 변경
- [ ] index.html Pretendard 폰트 추가
- [ ] index.css 기본 스타일 업데이트

### Step 2: Core Components (예상: 2-3시간)
- [ ] Button.jsx 리디자인
- [ ] Input.jsx 리디자인
- [ ] Card.jsx 신규 생성
- [ ] Badge.jsx 신규 생성
- [ ] Skeleton.jsx 개선

### Step 3: Layout (예상: 1-2시간)
- [ ] Header.jsx 개선 (모바일 메뉴 포함)
- [ ] Footer.jsx 개선
- [ ] Layout.jsx 배경색 적용

### Step 4: Animations (예상: 1-2시간)
- [ ] framer-motion 설치
- [ ] animations.js 유틸리티 생성
- [ ] 주요 컴포넌트에 애니메이션 적용

### Step 5: Feature Components (예상: 2-3시간)
- [ ] BookCard.jsx 리디자인
- [ ] CategoryFilter.jsx 개선
- [ ] SearchBar.jsx 개선
- [ ] Pagination.jsx 개선

### Step 6: Pages (예상: 2-3시간)
- [ ] Home.jsx 스타일 적용
- [ ] Books.jsx 스타일 적용
- [ ] BookDetail.jsx 스타일 적용
- [ ] Cart.jsx 스타일 적용

---

## 예상 결과물

### Before (현재)
- 차가운 모노크롬 색상
- 정적인 인터페이스
- 기본적인 그림자

### After (개선 후)
- 따뜻하고 아늑한 서점 분위기
- 부드러운 마이크로 인터랙션
- 책/종이 느낌의 텍스처
- 프리미엄 사용자 경험

---

## 파일 변경 목록

### 수정 예정:
1. `tailwind.config.js` - 컬러, 그림자, 애니메이션
2. `index.html` - 폰트 링크, 메타 태그
3. `src/index.css` - 기본 스타일
4. `src/components/common/Button.jsx`
5. `src/components/common/Input.jsx`
6. `src/components/common/Skeleton.jsx`
7. `src/components/book/BookCard.jsx`
8. `src/components/layout/Header.jsx`
9. `src/components/layout/Footer.jsx`
10. `src/pages/Home.jsx`

### 신규 생성 예정:
1. `src/components/common/Card.jsx`
2. `src/components/common/Badge.jsx`
3. `src/components/common/MobileMenu.jsx`
4. `src/utils/animations.js`
