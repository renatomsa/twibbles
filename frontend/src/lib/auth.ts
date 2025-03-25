// Client-side only auth utilities
// This file will be imported in client components, so it can't use server-only APIs

// Function to get user ID for client components
// This is using localStorage as the source of truth
export function getClientUserId(): number {
  if (typeof window === 'undefined') {
    return 709; // Default for server-side rendering
  }

  // Try to get from localStorage
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    return parseInt(storedUserId, 10);
  }

  // Default to 709 as in the middleware
  const userId = 709;
  // Store it for future use
  localStorage.setItem('userId', userId.toString());
  return userId;
}

// Client-side utility to fetch the current user ID from API
export async function fetchCurrentUserId(): Promise<number> {
  try {
    // Make an API call to get the current user ID
    const response = await fetch('/api/user/me');
    const data = await response.json();
    
    // Store it in localStorage for future use
    if (data.userId) {
      localStorage.setItem('userId', data.userId.toString());
    }
    
    return data.userId;
  } catch (error) {
    console.error('Error fetching current user ID:', error);
    // Return default userId if there's an error
    return getClientUserId();
  }
} 