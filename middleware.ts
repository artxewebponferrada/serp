import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { appConfig } from "./config";

export default async function middleware(req: NextRequest) {
  // Verifica la autenticación básica
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Comprueba las credenciales
  if (username !== 'admin' || password !== 'supersecret') {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    });
  }

  // Si la autenticación es exitosa, continúa con el middleware de internacionalización
  const intlMiddleware = createMiddleware({
    locales: appConfig.i18n.locales,
    defaultLocale: appConfig.i18n.defaultLocale,
    localePrefix: "as-needed",
    localeDetection: false,
    alternateLinks: true
  });

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
