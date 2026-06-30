export interface User {
  uid: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

export type UseAuthResult = AuthState & {
  isAuthenticated: boolean;
};
