import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  // Se o cara tentar entrar no dashboard sem o cookie "auth_token"
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    // Manda ele de volta para a página inicial (Login)
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protege o dashboard e qualquer sub-página dele
};