import { NextResponse } from 'next/server';
import { getUserIdFromServerCookies } from '@/lib/serverAuth';

export async function GET() {
  const userId = getUserIdFromServerCookies();
  
  // Return the user ID from the cookie
  return NextResponse.json({
    userId: parseInt(userId, 10),
    isAuthenticated: true,
  });
} 