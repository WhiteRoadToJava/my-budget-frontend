import {NextResponse} from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');

  if(!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}