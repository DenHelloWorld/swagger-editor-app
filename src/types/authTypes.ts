import type { Unsubscribe } from 'firebase/auth';
export interface User {
  uid: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  sessionError: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
  initAuth: () => Unsubscribe;
  clearSessionError: () => void;
}

export type UseAuthResult = Omit<AuthState, 'initAuth'> & {
  isAuthenticated: boolean;
};
