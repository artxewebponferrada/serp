import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
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

  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');

  const isAuthorized =
    username === 'admin' && password === 'supersecret'; // Cambia esto según tus necesidades

  if (!isAuthorized) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    });
  }

  return null; // Retorna null si la autenticación es exitosa
}

export default async function middleware(req: NextRequest) {

  // Verifica la autenticación
  const authResult = basicAuth(req);
  if (authResult) {
    return authResult;
  }

  // Si pasa la autenticación, procede con el middleware de internacionalización
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
