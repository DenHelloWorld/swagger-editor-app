export interface User {
  uid: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
}

export type UseAuthResult = AuthState & {
  isAuthenticated: boolean;
};
