export interface UseAuthResult {
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string) => Promise<void>;
  isLoading: boolean;
  user: AuthUser | null;
  isAuthenticated: boolean;
}
export interface AuthUser {
  uid: string;
  email: string;
}
