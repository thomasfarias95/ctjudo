import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // 1. Definição de rotas
  const isLoginPage = pathname === '/login';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // 2. Se o cara JÁ ESTÁ logado e tenta ir pro /login, manda pro Dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Se NÃO ESTÁ logado e tenta entrar no Dashboard, manda pro Login
  if (isDashboardRoute && !token) {
    // Redireciona para /login que é onde ele se autentica
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // O seu matcher original já está excelente, vamos mantê-lo
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};