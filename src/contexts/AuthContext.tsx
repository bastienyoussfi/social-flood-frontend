import { createContext, useContext, type ReactNode } from 'react';
import { useSession, signOut as authSignOut, signIn as authSignIn, signUp as authSignUp } from '@/lib/auth-client';

// User type based on better-auth
interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Session type
interface Session {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

// Better-auth result types
interface AuthResult {
  data?: unknown;
  error?: {
    message?: string;
    code?: string;
    status?: number;
  } | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: {
    email: (params: { email: string; password: string }) => Promise<AuthResult>;
    social: (params: { provider: 'google' | 'github' }) => Promise<void>;
  };
  signUp: {
    email: (params: { name: string; email: string; password: string }) => Promise<AuthResult>;
  };
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: sessionData, isPending, error } = useSession();

  const isLoading = isPending;
  const isAuthenticated = !!sessionData?.user && !error;
  const user = sessionData?.user ?? null;
  const session = sessionData ?? null;

  const signIn = {
    email: async (params: { email: string; password: string }): Promise<AuthResult> => {
      const result = await authSignIn.email(params);
      return result as AuthResult;
    },
    social: async (params: { provider: 'google' | 'github' }) => {
      await authSignIn.social({
        provider: params.provider,
        callbackURL: window.location.origin,
      });
    },
  };

  const signUp = {
    email: async (params: { name: string; email: string; password: string }): Promise<AuthResult> => {
      const result = await authSignUp.email(params);
      return result as AuthResult;
    },
  };

  const signOut = async () => {
    await authSignOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
