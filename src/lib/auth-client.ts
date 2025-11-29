import { createAuthClient } from 'better-auth/react';

// API base URL for the backend
const API_BASE_URL = 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
});

// Export typed hooks and methods for convenience
export const { useSession, signIn, signUp, signOut } = authClient;

