import { NextResponse } from 'next/server'

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
    const auth = await startsWithAny(url, role)

    if (
        !request.cookies.has('user')
    ) {
        request.cookies.delete("user")
        return NextResponse.rewrite(new URL("/login", request.url))
    }

    try {
        if (!auth) {
            return NextResponse.redirect(new URL('/accessDenied', request.url)) 
        }

    } catch (err) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/agenda/:path*",
        "/paciente",
        "/paciente/:path*",
        "/fichaClinica/:path*",
        "/financeiro",
        "/opcoes/:path*"
    ],
}