import { NextRequest, NextResponse } from "next/server";
import { appConfig } from "./config";

// Middleware principal
export default function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  // Si no hay encabezado de autorización, pedir credenciales
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
  if (username !== 'admin' || password !== 'supersecret') {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    });
  }

  // Si las credenciales son correctas, continúa con la respuesta normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
