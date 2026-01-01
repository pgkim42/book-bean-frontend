# Book-Bean Frontend (Next.js)

Next.js 16.1.1 기반 온라인 책 쇼핑몰 프론트엔드

---

## 프로젝트 개요

**Book-Bean Frontend**는 최신 React 생태계 기술을 활용한 온라인 책 쇼핑몰 웹 애플리케이션입니다.
사용자 경험(UX)을 고려한 **Warm & Cozy 디자인 시스템**, **서버 상태 관리**, **폼 유효성 검증** 등 실무에서 필요한 기술들을 학습하고 적용했습니다.

### 주요 구현 사항
- **Next.js 16.1.1**: App Router, 파일 기반 라우팅
- **React 19**: 최신 React 기능 활용
- **TanStack Query**: 서버 상태 관리 및 캐싱
- **Zustand**: 클라이언트 상태 관리 (장바구니, 인증, 위시리스트)
- **React Hook Form + Zod**: 타입 안전한 폼 검증
- **Tailwind CSS 3.4**: Warm & Cozy 커스텀 디자인 시스템
- **반응형 UI**: 모바일부터 데스크톱까지 완벽 지원

---

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| **Core** | Next.js | 16.1.1 |
| **Core** | React | 19.2.3 |
| **Server State** | TanStack Query | 5.90.16 |
| **Client State** | Zustand | 5.0.9 |
| **Form** | React Hook Form + Zod | 7.69.0, 4.3.4 |
| **Styling** | Tailwind CSS | 3.4.19 |
| **HTTP Client** | Axios | 1.13.2 |
| **Toast** | React Hot Toast | 2.6.0 |
| **Charts** | Recharts | 3.6.0 |
| **Icons** | Lucide React | 0.562.0 |
| **Date** | date-fns | 4.1.0 |
| **UI Components** | Headless UI | 2.2.9 |

---

## 주요 기능

### 사용자 기능
- **도서 탐색**: 카테고리 필터링, 가격대/평점 필터, 정렬, 검색, 페이지네이션
- **장바구니**: 담기/삭제/수량 변경, 실시간 합계 계산
- **주문/결제**: 배송지 입력, 쿠폰 할인 적용, 결제 수단 선택
- **쿠폰**: 사용 가능 쿠폰 목록, 할인 금액 미리보기
- **리뷰**: 구매 상품 리뷰 작성, 별점, 투표
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
├── app/                          # App Router 페이지
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 메인 페이지
│   ├── providers.tsx             # QueryClient Provider
│   ├── globals.css               # 전역 스타일
│   ├── books/
│   │   ├── page.tsx             # 도서 목록
│   │   └── [id]/page.tsx        # 도서 상세 (동적 라우트)
│   ├── cart/page.tsx            # 장바구니
│   ├── checkout/page.tsx        # 주문/결제
│   ├── orders/
│   │   ├── page.tsx             # 주문 내역
│   │   └── [id]/page.tsx        # 주문 상세
│   ├── profile/page.tsx         # 프로필
│   ├── wishlist/page.tsx        # 위시리스트
│   ├── login/page.tsx           # 로그인
│   ├── register/page.tsx        # 회원가입
│   └── admin/
│       ├── page.tsx             # 관리자 대시보드
│       ├── books/page.tsx       # 도서 관리
│       ├── categories/page.tsx  # 카테고리 관리
│       ├── orders/page.tsx      # 주문 관리
│       └── users/page.tsx       # 사용자 관리
├── components/
│   ├── dashboard/                # 차트 컴포넌트
│   │   ├── SalesChart.tsx
│   │   ├── OrderStatusChart.tsx
│   │   ├── TopBooksChart.tsx
│   │   └── NewUsersChart.tsx
│   └── layout/                  # 레이아웃 컴포넌트
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── services/                 # API 서비스 계층
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
│   └── utils/                    # 유틸리티
│       ├── constants.ts          # 상수 정의
│       ├── formatters.ts        # 가격/날짜 포맷
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
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# .env.production
NEXT_PUBLIC_API_URL=https://api.bookbean.com/api
```

---

## 페이지 라우팅

### 사용자
| 경로 | 설명 |
|------|------|
| `/` | 메인 페이지 |
| `/books` | 도서 목록 |
| `/books/[id]` | 도서 상세 |
| `/cart` | 장바구니 |
| `/checkout` | 주문/결제 |
| `/orders` | 주문 내역 |
| `/orders/[id]` | 주문 상세 |
| `/profile` | 프로필 |
| `/wishlist` | 위시리스트 |
| `/login` | 로그인 |
| `/register` | 회원가입 |

### 관리자
| 경로 | 설명 |
|------|------|
| `/admin` | 대시보드 |
| `/admin/books` | 도서 관리 |
| `/admin/categories` | 카테고리 관리 |
| `/admin/orders` | 주문 관리 |
| `/admin/users` | 사용자 관리 |

---

## 주요 변경사항 (Vite → Next.js 16)

| 항목 | Vite | Next.js 16 |
|------|------|-------------|
| 라우팅 | React Router | App Router (파일 기반) |
| 구조 | `src/pages/` | `app/` |
| params | `useParams()` | `params: Promise<T>` + `use()` |
| 네비게이션 | `useNavigate()` | `useRouter()` |
| Link | `react-router-dom` | `next/link` |
| 미들웨어 | 없음 | `proxy.ts` |
| 스타일 | CSS Modules | Tailwind CSS 전역 |

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

### 컬러르 팔레트
- Primary: 따뜻한 브라운 (#B45309)
- Accent: 코랄 오렌지 (#F97316)
- Background: 아이보리cream (#FAFAF9)

### 기능
- 반응형 그리드 (모바일 1열 ~ 데스크톱 4열)
- Skeleton UI 로딩 상태
- Toast 알림 (성공/실패)
- 에러 경계처리

---

## 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 정적 HTML 내보내기 (선택)
npm run build # .next/static 생성
```
