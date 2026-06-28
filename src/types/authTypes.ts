export interface UseAuthResult {
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string) => Promise<void>;
  isLoading: boolean;
  user: User | null;
  isAuthenticated: boolean;
}
export interface User {
  uid: string;
  email: string;
}
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}
