import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // 1. Liberação total para rotas públicas e recursos
  if (
    pathname === '/' || 
    pathname === '/login' || // Se sua rota for /login, ajuste aqui
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  // 2. Proteção do Dashboard
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // O matcher deve excluir explicitamente arquivos estáticos
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};