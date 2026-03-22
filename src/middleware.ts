import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // 1. IGNORA TUDO QUE NÃO SEJA PÁGINA (Imagens, API, Next Interno)
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // 2. SÓ PROTEGE O DASHBOARD
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Ajuste do Matcher para ser menos agressivo
  matcher: ['/dashboard/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};