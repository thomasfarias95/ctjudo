import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // 1. LIBERAÇÃO TOTAL: Não intercepta o Login, arquivos do Next e a API do Java
  if (
    pathname === '/' || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') // Permite imagens e ícones
  ) {
    return NextResponse.next();
  }

  // 2. BLOQUEIO: Só barra se tentar entrar no /dashboard sem o cookie
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Monitora rotas de página, mas ignora arquivos estáticos e chamadas de API internas
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};