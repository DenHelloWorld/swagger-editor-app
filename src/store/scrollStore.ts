import { create } from 'zustand';

type ScrollStore = {
  isScrolled: boolean;
  setScrolled: (isScrolled: boolean) => void;
};

export const useScrollStore = create<ScrollStore>((set) => ({
  isScrolled: false,
  setScrolled: (isScrolled) => set({ isScrolled }),
}));
