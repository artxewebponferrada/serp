import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { appConfig } from "./config";

// Función para manejar la autenticación básica
function basicAuth(req: NextRequest) {
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

  // Verifica las credenciales
  const isAuthorized = username === 'admin' && password === 'supersecret';

  if (!isAuthorized) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    });
  }

  return null; // Autenticación exitosa
}

export default async function middleware(req: NextRequest) {

  // Verifica la autenticación
  const authResult = basicAuth(req);
  if (authResult) {
    return authResult;
  }

  // Procede con el middleware de internacionalización si la autenticación es exitosa
  const intlMiddleware = createMiddleware({
    locales: appConfig.i18n.locales,
    defaultLocale: appConfig.i18n.defaultLocale,
    localePrefix: "as-needed",
    localeDetection: false,
    alternateLinks: true,
  });

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
