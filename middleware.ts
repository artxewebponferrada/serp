import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const decodedValue = atob(authValue);

    console.log('Authorization Header:', basicAuth);
    console.log('Decoded Credentials:', decodedValue);

    const [user, password] = decodedValue.split(':');

    console.log('User:', user);
    console.log('Password:', password);

    const validUser = 'admin';
    const validPassword = 'supersecret';

    if (user === validUser && password === validPassword) {
      console.log('Authentication successful');
      return NextResponse.next();
    } else {
      console.log('Authentication failed');
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
