import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const sessionCookie = req.cookies.get('session')

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    const session = JSON.parse(sessionCookie.value)

    const pathname = req.nextUrl.pathname

    // 🔒 páginas restritas só para admin
    const adminOnlyRoutes = [
        '/admin/users',
        '/admin/tags',
    ]

    const isAdminOnly = adminOnlyRoutes.some((route) =>
        pathname.startsWith(route)
    )

    if (isAdminOnly && session.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}