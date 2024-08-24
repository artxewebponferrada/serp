import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el encabezado de autorización
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    // Decodificar las credenciales de Basic Auth usando Buffer
    const authValue = basicAuth.split(' ')[1];
    const decodedValue = Buffer.from(authValue, 'base64').toString('ascii');
    const [user, password] = decodedValue.split(':');

    // Log para depuración
    console.log('Decoded credentials:', decodedValue);

    // Verificación simple con credenciales hardcoded
    if (user === 'admin' && password === 'admin') {
      console.log('Authentication successful');
      return NextResponse.next(); // Autenticación exitosa, continuar
    } else {
      console.log('Authentication failed');
    }
  } else {
    console.log('Authorization header not found');
  }

  // Si la autenticación falla, solicitar credenciales nuevamente
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
