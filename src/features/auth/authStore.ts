import { AuthState } from '@/types/authTypes';
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set) => ({
  user:
    process.env.NEXT_PUBLIC_DEV_MOCK_AUTH === 'true'
      ? { uid: 'mock-user-1', email: 'mock@test.com' }
      : null,
  isLoading: false,
  signIn: async (email: string) => {
    set({ isLoading: true });

    set({
      user: {
        uid: 'mock-user-1',
        email,
      },
    });
    set({ isLoading: false });
  },
  signUp: async (email: string) => {
    set({ isLoading: true });
    set({
      user: {
        uid: 'mock-user-1',
        email,
      },
    });
    set({ isLoading: false });
  },
  signOut: async () => {
    set({ user: null });
  },
}));
