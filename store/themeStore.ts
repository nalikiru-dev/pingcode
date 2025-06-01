import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  vimMode: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setVimMode: (enabled: boolean) => void;
  toggleVimMode: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  vimMode: false,
  setTheme: (theme) => set({ theme }),
  setVimMode: (enabled) => set({ vimMode: enabled }),
  toggleVimMode: () => set((state) => ({ vimMode: !state.vimMode })),
}));