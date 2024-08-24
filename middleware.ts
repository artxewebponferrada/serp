import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el encabezado de autorización
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    // Decodificar las credenciales usando Buffer
    const authValue = basicAuth.split(' ')[1];
    const decodedValue = Buffer.from(authValue, 'base64').toString('utf-8');
    const [user, password] = decodedValue.split(':');

    // Verificar credenciales hardcoded
    if (user === 'admin' && password === 'admin') {
      console.log('Authentication successful');
      return NextResponse.next(); // Continuar si la autenticación es exitosa
    } else {
      console.log('Authentication failed');
    }
  } else {
    console.log('Authorization header not found');
  }

  // Responder con un 401 si la autenticación falla
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
