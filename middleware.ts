import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el encabezado de autorización
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    // Decodificar las credenciales de Basic Auth
    const authValue = basicAuth.split(' ')[1];
    const [user, password] = atob(authValue).split(':');

    // Log para depuración (considera remover en producción)
    console.log('Decoded credentials:', user);

    // Verificar credenciales usando variables de entorno
    if (
      user === process.env.AUTH_USER &&
      password === process.env.AUTH_PASSWORD
    ) {
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
