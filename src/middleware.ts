import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // 1. Liberação de rotas públicas, assets e internos
  const isPublicRoute = pathname === '/' || pathname === '/login';
  const isAsset = pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/);
  const isInternal = pathname.startsWith('/_next') || pathname.startsWith('/api');

  if (isPublicRoute || isAsset || isInternal) {
    return NextResponse.next();
  }

  // 2. Proteção do Dashboard
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher refinado para ignorar arquivos estáticos e focar em rotas de páginas
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};