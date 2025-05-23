import { create } from 'zustand';
import { useColorScheme } from 'react-native';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  vimMode: boolean;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleVimMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  vimMode: false,
  
  setTheme: (theme) => set({ theme }),
  toggleVimMode: () => set((state) => ({ vimMode: !state.vimMode })),
}));