import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appConfig } from "@/config";
import createMiddleware from "next-intl/middleware";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const decodedValue = Buffer.from(authValue, 'base64').toString('utf-8');
    const [user, password] = decodedValue.split(':');

    if (user === 'admin' && password === 'admin') {
      // Continuar con el middleware de internacionalización después de la autenticación exitosa
      const intlMiddleware = createMiddleware({
        locales: appConfig.i18n.locales,
        defaultLocale: appConfig.i18n.defaultLocale,
        localePrefix: "as-needed",
        localeDetection: true,
        alternateLinks: true
      });

      return intlMiddleware(req); // No es necesario modificar la solicitud
    } else {
      console.log('Authentication failed');
    }
  } else {
    console.log('Authorization header not found');
  }

  // Solicitar autenticación si no es exitosa
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
