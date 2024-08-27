import { NextResponse } from 'next/server'
import { authRoutes, protectedRoutes } from './router/routes'

async function getUserRole(req) {
    const dados = await req.cookies.get('user')?.value
    if (dados === undefined) return null

    return JSON.parse(dados)?.access_level
}

const startsWithAny = async (url, prefixes) => {

    if (prefixes === null) return true

    for (const prefix of prefixes) {
        if (url.startsWith(prefix)) {
            return true
        }
    }
    return false
}

export async function middleware(request) {
    const role = await getUserRole(request)
    const url = request.nextUrl.pathname
    const basePath = url?.split('/')[1]
    const auth = await startsWithAny(url, role)

    if (
        // (!role?.includes(`/${basePath}`) ||  basePath !== '') ||
        !request.cookies.has('user')
    ) {
        request.cookies.delete("user")
        return NextResponse.rewrite(new URL("/login", request.url))
    }

    if (!auth) {
        return NextResponse.redirect(new URL('/accessDenied', request.url));
    }

    const SECRET_KEY = 'your-secret-key-here'
}

export const config = {
    matcher: [
        "/",
        "/agenda/:path*",
        "/paciente/:path*",
        "/fichaClinica/:path*",
        "/financeiro/:path*",
        "/usuario/:path*",
        "/nivelAcesso/:path*"
    ],
}