import { cookies } from 'next/headers';

// Functions for server components only
// This file should only be imported in server components

export function getUserIdFromServerCookies(): string {
  const cookieStore = cookies();
  return cookieStore.get('userId')?.value || '709'; // Default to 709 if not found
} 