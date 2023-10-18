//import { NextResponse } from 'next/server'

// export async function middleware(request) {

//     const jwt = await request.cookies.get('jwt')

//     if (request.nextUrl.pathname.startsWith('/')) {

//         //if (jwt)
//           //  return NextResponse.rewrite(new URL('/', request.url))

//        // return NextResponse.rewrite(new URL('/agenda', request.url))
//     }

//     if (request.nextUrl.pathname.startsWith('/[*]') && !jwt) {
//         return NextResponse.rewrite(new URL('/login', request.url))
//     }
// }

// export const config ={
//     matcher: ['/', 'dashboard/:path']
// }

// import { NextResponse } from 'next/server'

// // This function can be marked `async` if using `await` inside
// export async function middleware(request) {

//     const jwt = await request.cookies.get('jwt')

//     if (!jwt)
//         return NextResponse.redirect(new URL('/login', request.url))
// }

// // See "Matching Paths" below to learn more
// export const config = {
//     matcher: '/:path*',
// }

import { NextResponse } from 'next/server'
import { authRoutes, protectedRoutes } from './router/routes'
import { jwtVerify } from "jose"

export async function middleware(request) {
    const currentUser = await request.cookies.get("user")?.value
    const SECRET_KEY = 'your-secret-key-here'

    // if (request.nextUrl.pathname !== "/login" && !currentUser) {
    //     return NextResponse.redirect(new URL("/login", request.url))
    // }

    if (currentUser) {
        const { payload, protectedHeader } =
            await jwtVerify(JSON.parse(currentUser).token, new TextEncoder().encode(SECRET_KEY))

        // console.log("<<<<<<<<<>>>>>>>", protectedHeader)
        // console.log("-------------------=====", payload)
    }

    if (
        protectedRoutes.includes(request.nextUrl.pathname) &&
        (!currentUser || Date.now() > payload.expe)
    ) {
        request.cookies.delete("user")
        const response = NextResponse.redirect(new URL("/login", request.url))
        request.cookies.delete("user")

        return response
    } else {
        //  console.log('>>>>>>>>>>.', payload)
    }

    // if (authRoutes.includes(request.nextUrl.pathname) && currentUser)
    //     return NextResponse.redirect(new URL("/profile", request.url))
}