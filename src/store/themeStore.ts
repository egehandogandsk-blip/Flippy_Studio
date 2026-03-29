import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyTheme } from '../utils/themes';

interface ThemeState {
    currentTheme: 'dark' | 'light' | 'high-contrast';
    setTheme: (theme: 'dark' | 'light' | 'high-contrast') => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            currentTheme: 'dark',
            setTheme: (theme) => {
                applyTheme(theme);
                set({ currentTheme: theme });
            }
        }),
        {
            name: 'flippy-theme'
        }
    )
);

// Initialize theme on app load
export const initializeTheme = () => {
    const theme = useThemeStore.getState().currentTheme;
    applyTheme(theme);
};
