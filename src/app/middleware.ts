import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Páginas que não precisam de autenticação
const publicRoutes = ['/auth/login', '/auth/register'];

// Páginas que precisam de roles específicas
const adminRoutes = ['/users', '/roles'];
const managerRoutes = ['/products', '/orders'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');
  const role = request.cookies.get('user_role')?.value; // Adicionado .value para pegar o valor do cookie
  
  // Função para verificar se a rota atual está em um array de rotas
  const matchesRoute = (routes: string[]) => 
    routes.some(route => pathname.startsWith(route));

  // Verifica se é uma página pública
  const isPublicPage = publicRoutes.some(route => pathname.startsWith(route));

  // Se for página pública e tiver token, redireciona para dashboard
  if (isPublicPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se não tiver token e não for página pública, redireciona para login
  if (!token && !isPublicPage) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificações de permissão baseadas em role
  if (token && role) {
    // Verifica rotas de admin
    if (matchesRoute(adminRoutes) && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Verifica rotas de manager
    if (matchesRoute(managerRoutes) && !['admin', 'manager'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  const response = NextResponse.next();

  // Adiciona headers de segurança
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  return response;
}

export const config = {
  matcher: [
    // Rotas protegidas
    '/dashboard/:path*',
    '/orders/:path*',
    '/products/:path*',
    '/users/:path*',
    '/roles/:path*',
    // Rotas de auth (para redirecionamento quando já autenticado)
    '/auth/:path*',
    // Exclui arquivos estáticos e API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};