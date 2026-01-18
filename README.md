# Book-Bean Frontend (Next.js)

Next.js 16.1.1 기반 온라인 책 쇼핑몰 프론트엔드

---

## 프로젝트 개요

**Book-Bean Frontend**는 최신 React 생태계 기술을 활용한 온라인 책 쇼핑몰 웹 애플리케이션입니다.
사용자 경험(UX)을 고려한 **Warm & Cozy 디자인 시스템**, **서버 상태 관리**, **폼 유효성 검증** 등 실무에서 필요한 기술들을 학습하고 적용했습니다.

### 주요 구현 사항
- **Next.js 16.1.1**: App Router, 서버 컴포넌트(RSC), 파일 기반 라우팅
- **React 19**: 최신 React 기능 활용
- **서버 컴포넌트 전환**: 도서 목록/상세 페이지의 SSR 및 SEO 최적화
- **ISR (Incremental Static Regeneration)**: 데이터 변경 주기에 맞는 캐시 전략
- **TanStack Query**: 서버 상태 관리 및 캐싱
- **Zustand**: 클라이언트 상태 관리 (장바구니, 인증, 위시리스트)
- **React Hook Form + Zod**: 타입 안전한 폼 검증
- **Tailwind CSS 3.4**: Warm & Cozy 커스텀 디자인 시스템
- **반응형 UI**: 모바일부터 데스크톱까지 완벽 지원

---

## 기술 스택

| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **Core** | Next.js | 16.1.1 | App Router, RSC, ISR |
| **Core** | React | 19.2.3 | UI 라이브러리 |
| **Server State** | TanStack Query | 5.90.16 | 서버 상태 관리 |
| **Client State** | Zustand | 5.0.9 | 클라이언트 상태 |
| **Form** | React Hook Form + Zod | 7.69.0, 4.3.4 | 폼 검증 |
| **Styling** | Tailwind CSS | 3.4.19 | 스타일링 |
| **HTTP Client** | Axios | 1.13.2 | 클라이언트 API 호출 |
| **Server Fetch** | Native Fetch | - | 서버 컴포넌트 데이터 페칭 |
| **Toast** | React Hot Toast | 2.6.0 | 알림 |
| **Charts** | Recharts | 3.6.0 | 차트 |
| **Icons** | Lucide React | 0.562.0 | 아이콘 |
| **Date** | date-fns | 4.1.0 | 날짜 처리 |
| **UI Components** | Headless UI | 2.2.9 | 접근 가능한 컴포넌트 |

---

## 주요 기능

### 사용자 기능
- **도서 탐색**: 카테고리 필터링, 가격대/평점 필터, 정렬, 검색, 페이지네이션
- **장바구니**: 담기/삭제/수량 변경, 실시간 합계 계산
- **주문/결제**: 배송지 입력, 쿠폰 할인 적용, 결제 수단 선택
- **쿠폰**: 사용 가능 쿠폰 목록, 할인 금액 미리보기
- **리뷰**: 구매 상품 리뷰 작성, 별점, 수정/삭제
- **프로필**: 회원 정보 수정, 리뷰 관리
- **위시리스트**: 찜한 도서 관리

### 관리자 기능
- **대시보드**: 매출/주문 현황 차트
- **도서 관리**: CRUD, 재고 관리, 상태 변경
- **카테고리 관리**: CRUD, 표시 순서 관리
- **주문 관리**: 상태 변경 (결제 확인, 배송 시작/완료), 뷰 모드 (카드/테이블/컴팩트)
- **사용자 관리**: 조회, 검색, 삭제, 뷰 모드

---

## 프로젝트 구조

```
book-bean-frontend-nextjs/
├── app/                          # App Router 페이지 (서버 컴포넌트)
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 메인 페이지
│   ├── providers.tsx             # QueryClient Provider
│   ├── globals.css               # 전역 스타일
│   ├── books/
│   │   ├── page.tsx              # 도서 목록 (서버 컴포넌트)
│   │   ├── loading.tsx           # 목록 로딩 상태
│   │   ├── error.tsx             # 목록 에러 상태
│   │   ├── components/
│   │   │   └── BookListClient.tsx # 필터/검색/페이지네이션 (클라이언트)
│   │   └── [id]/
│   │       ├── page.tsx          # 도서 상세 (서버 컴포넌트)
│   │       ├── loading.tsx       # 상세 로딩 상태
│   │       ├── error.tsx         # 상세 에러 상태
│   │       └── components/
│   │           ├── BackButton.tsx
│   │           ├── BookDetailContent.tsx  # 장바구니/위시리스트
│   │           ├── ReviewSection.tsx      # 리뷰 목록/폼
│   │           └── RecentlyViewed.tsx     # 최근 본 도서
│   ├── cart/page.tsx             # 장바구니
│   ├── checkout/page.tsx         # 주문/결제
│   ├── orders/
│   │   ├── page.tsx              # 주문 내역
│   │   └── [id]/page.tsx         # 주문 상세
│   ├── profile/page.tsx          # 프로필
│   ├── wishlist/page.tsx         # 위시리스트
│   ├── login/page.tsx            # 로그인
│   ├── register/page.tsx         # 회원가입
│   └── admin/
│       ├── page.tsx              # 관리자 대시보드
│       ├── books/page.tsx        # 도서 관리
│       ├── categories/page.tsx   # 카테고리 관리
│       ├── orders/page.tsx       # 주문 관리
│       └── users/page.tsx        # 사용자 관리
├── components/
│   ├── book/                     # 도서 관련 컴포넌트
│   │   ├── BookCard.tsx
│   │   ├── BookCardSkeleton.tsx
│   │   └── BookSearchBar.tsx
│   ├── filter/                   # 필터 컴포넌트
│   │   ├── CategoryFilter.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── FilterTags.tsx
│   │   ├── Pagination.tsx
│   │   └── SortDropdown.tsx
│   ├── review/                   # 리뷰 컴포넌트
│   │   ├── ReviewForm.tsx
│   │   └── ReviewList.tsx
│   └── layout/                   # 레이아웃 컴포넌트
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── services/                 # API 서비스 계층 (클라이언트)
│   │   ├── api.ts               # Axios 인스턴스
│   │   ├── bookService.ts
│   │   ├── categoryService.ts
│   │   ├── couponService.ts
│   │   ├── orderService.ts
│   │   ├── reviewService.ts
│   │   └── userService.ts
│   ├── store/                    # Zustand 스토어
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── wishlistStore.ts
│   ├── hooks/                    # 커스텀 훅
│   │   └── useApiError.ts       # API 에러 핸들링
│   ├── types/                    # TypeScript 타입 정의
│   │   ├── book.types.ts
│   │   ├── cart.types.ts
│   │   ├── review.types.ts
│   │   ├── user.types.ts
│   │   └── ...
│   └── utils/                    # 유틸리티
│       ├── constants.ts          # 상수 정의
│       ├── formatters.ts        # 가격/날짜 포맷
│       ├── image.ts             # 이미지 관련 유틸
│       ├── server-fetch.ts      # 서버 컴포넌트용 데이터 페칭
│       └── storage.ts           # localStorage 래퍼
├── public/                       # 정적 파일
├── tailwind.config.js           # Tailwind 설정
├── next.config.ts               # Next.js 설정
├── proxy.ts                     # 인증 미들웨어
├── tsconfig.json                # TypeScript 설정
└── package.json
```

---

## 시작하기

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm start
```

### 환경 변수
```env
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# .env.production
NEXT_PUBLIC_API_URL=https://api.bookbean.com/api/v1
```

---

## 페이지 라우팅

### 사용자
| 경로 | 설명 | 렌더링 방식 |
|------|------|-----------|
| `/` | 메인 페이지 | 클라이언트 |
| `/books` | 도서 목록 | **서버 (ISR)** |
| `/books/[id]` | 도서 상세 | **서버 (ISR)** |
| `/cart` | 장바구니 | 클라이언트 |
| `/checkout` | 주문/결제 | 클라이언트 |
| `/orders` | 주문 내역 | 클라이언트 |
| `/orders/[id]` | 주문 상세 | 클라이언트 |
| `/profile` | 프로필 | 클라이언트 |
| `/wishlist` | 위시리스트 | 클라이언트 |
| `/login` | 로그인 | 클라이언트 |
| `/register` | 회원가입 | 클라이언트 |

### 관리자
| 경로 | 설명 |
|------|------|
| `/admin` | 대시보드 |
| `/admin/books` | 도서 관리 |
| `/admin/categories` | 카테고리 관리 |
| `/admin/orders` | 주문 관리 |
| `/admin/users` | 사용자 관리 |

---

## 성능 최적화

### 서버 컴포넌트 (RSC)
- **도서 목록/상세 페이지**를 서버 컴포넌트로 전환
- 초기 HTML에 데이터가 포함되어 SEO 개선
- JavaScript 번들 크기 감소

### ISR (Incremental Static Regeneration)
| 페이지 | 재검증 시간 | 설명 |
|--------|-----------|------|
| 도서 상세 | 5분 | 개별 도서 정보는 자주 변경되지 않음 |
| 도서 목록 | 1분 | 목록은 더 자주 변경될 수 있음 |

### 폰트 최적화
- `next/font`로 폰트 최적화
- FOUT, FOIT 방지
- 자체 호스팅으로 외부 요청 최소화

### 이미지 최적화
- `next/image`로 최적화된 이미지 로딩
- 블러 플레이스홀더로 LCP 개선
- lazy loading으로 초기 로드 최적화

### 동적 임포트
- `next/dynamic`으로 무거운 컴포넌트 지연 로딩
- 초기 JS 번들 크기 감소

### Loading/Error 상태
- `loading.tsx`, `error.tsx`로 일관된 로딩/에러 UX
- Skeleton UI로 사용자 경험 개선

---

## 상태 관리

### 서버 상태 (TanStack Query)
- 도서 목록/상세
- 카테고리 목록
- 주문 내역
- 사용자 정보

### 클라이언트 상태 (Zustand)
- **authStore**: 인증 정보, 로그인/로그아웃
- **cartStore**: 장바구니 아이템, CRUD 연산
- **wishlistStore**: 위시리스트, persist 미들웨어

---

## 디자인 시스템 (Warm & Cozy)

### 컬러 팔레트
| 이름 | 코드 | 용도 |
|------|------|------|
| Primary | #B45309 | 주요 버튼, 링크 |
| Accent | #F97316 | 강조 요소 |
| Background | #FAFAF9 | 페이지 배경 |
| Warm Gray | #78716C | 보조 텍스트 |

### 기능
- 반응형 그리드 (모바일 1열 ~ 데스크톱 4열)
- Skeleton UI 로딩 상태
- Toast 알림 (성공/실패)
- 에러 경계 처리

---

## 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 정적 HTML 내보내기 (선택)
npm run build # .next/static 생성
```

---

## 아키텍처 결정 사항

### 서버 vs 클라이언트 컴포넌트 분리
| 구분 | 예시 |
|------|------|
| **서버 컴포넌트** | 도서 정보 표시, 책 소개, 메타데이터 |
| **클라이언트 컴포넌트** | 장바구니 추가, 위시리스트, 리뷰 작성, 필터/검색 |

### 왜 axios와 fetch를 같이 쓰나요?
- **axios**: 클라이언트 컴포넌트에서 인증 토큰, 인터셉터가 필요한 경우
- **fetch**: 서버 컴포넌트에서 Next.js 캐싱 기능을 활용하기 위함

---

## 라이선스

MIT License
