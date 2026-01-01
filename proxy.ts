import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 보호된 경로
  const protectedPaths = ['/cart', '/checkout', '/profile', '/orders', '/wishlist', '/admin'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // 인증되지 않은 사용자는 로그인 페이지로
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 이미 로그인한 사용자는 로그인/회원가입 페이지 접근 불가
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // api, _next/static, _next/image, favicon.ico 제외한 모든 경로
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
