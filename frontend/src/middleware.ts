import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    if (!request.cookies.has('userId')) {
        response.cookies.set('userId', '709', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
    }

    return response;
}

export const config = {
    matcher: '/:path*'
};
