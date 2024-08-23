import { NextResponse } from 'next/server'
import { authRoutes, protectedRoutes } from './router/routes'

function getUserRole(req) {
    return JSON.parse(req.cookies.get('user')?.value)?.access_level
}

const startsWithAny = (url, prefixes) => {
    if (prefixes === null) return true

    for (const prefix of prefixes) {
        if (url.startsWith(prefix)) {
            return true
        }
    }
    return false
}

export async function middleware(request) {
    const role = getUserRole(request)
    const url = request.nextUrl.pathname

    if (
        protectedRoutes.includes(request.nextUrl.pathname) &&
        (!request.cookies.has('user'))
    ) {
        request.cookies.delete("user")
        return NextResponse.rewrite(new URL("/login", request.url))
    }

    if (!startsWithAny(url, role) || role === null) {
        return NextResponse.redirect(new URL('/accessDenied', request.url));
    } 

    const SECRET_KEY = 'your-secret-key-here'
}

export const config = {
    matcher: [
        "/login",
        "/agenda/:path*",
        "/paciente/:path*",
        "/fichaClinica/:path*",
        "/financeiro/:path*",
        "/usuario/:path*",
        "/nivelAcesso/:path*"
    ],
}