import { NextResponse } from 'next/server'

import { deleteSessionCookie } from '@/lib/auth/session'

export async function POST() {
    const response = NextResponse.json({ success: true })
    deleteSessionCookie(response)
    return response
}
