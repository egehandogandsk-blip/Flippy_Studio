export interface Theme {
    // Backgrounds
    bg: string;
    bgSecondary: string;
    panel: string;
    panelHover: string;

    // Borders
    border: string;
    borderHover: string;

    // Text
    text: string;
    textSecondary: string;
    textTertiary: string;

    // Accents
    accent: string;
    accentHover: string;
    accentText: string;

    // Status colors
    success: string;
    warning: string;
    error: string;

    // Interactive elements
    buttonBg: string;
    buttonHover: string;
    buttonText: string;

    // Canvas
    canvasBg: string;
    gridColor: string;
}

export const themes: Record<'dark' | 'light' | 'high-contrast', Theme> = {
    dark: {
        // Backgrounds
        bg: '#0a0a0a',
        bgSecondary: '#141414',
        panel: '#1a1a1a',
        panelHover: '#2a2a2a',

        // Borders
        border: 'rgba(139, 92, 246, 0.2)',
        borderHover: 'rgba(139, 92, 246, 0.5)',

        // Text
        text: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        textTertiary: 'rgba(255, 255, 255, 0.4)',

        // Accents
        accent: '#8b5cf6',
        accentHover: '#7c3aed',
        accentText: '#ffffff',

        // Status
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',

        // Interactive
        buttonBg: '#2c2c2c',
        buttonHover: '#3c3c3c',
        buttonText: '#ffffff',

        // Canvas
        canvasBg: '#1a1a1a',
        gridColor: 'rgba(255, 255, 255, 0.05)'
    },

    light: {
        // Backgrounds
        bg: '#ffffff',
        bgSecondary: '#f9fafb',
        panel: '#f5f5f5',
        panelHover: '#e5e5e5',

        // Borders
        border: 'rgba(139, 92, 246, 0.3)',
        borderHover: 'rgba(139, 92, 246, 0.6)',

        // Text
        text: '#0a0a0a',
        textSecondary: 'rgba(10, 10, 10, 0.7)',
        textTertiary: 'rgba(10, 10, 10, 0.5)',

        // Accents
        accent: '#8b5cf6',
        accentHover: '#7c3aed',
        accentText: '#ffffff',

        // Status
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',

        // Interactive
        buttonBg: '#e5e5e5',
        buttonHover: '#d4d4d4',
        buttonText: '#0a0a0a',

        // Canvas
        canvasBg: '#ffffff',
        gridColor: 'rgba(0, 0, 0, 0.05)'
    },

    'high-contrast': {
        // Backgrounds
        bg: '#000000',
        bgSecondary: '#0a0a0a',
        panel: '#ffffff',
        panelHover: '#f0f0f0',

        // Borders
        border: '#ffff00',
        borderHover: '#ffff00',

        // Text
        text: '#ffffff',
        textSecondary: '#ffffff',
        textTertiary: '#cccccc',

        // Accents
        accent: '#00ffff',
        accentHover: '#00cccc',
        accentText: '#000000',

        // Status
        success: '#00ff00',
        warning: '#ffff00',
        error: '#ff0000',

        // Interactive
        buttonBg: '#ffffff',
        buttonHover: '#e0e0e0',
        buttonText: '#000000',

        // Canvas
        canvasBg: '#000000',
        gridColor: 'rgba(255, 255, 255, 0.2)'
    }
};

export const applyTheme = (themeName: 'dark' | 'light' | 'high-contrast') => {
    const theme = themes[themeName];
    const root = document.documentElement;

    // Apply CSS variables
    Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });

    // Store theme choice
    localStorage.setItem('flippy-theme', themeName);
};

export const getStoredTheme = (): 'dark' | 'light' | 'high-contrast' => {
    const stored = localStorage.getItem('flippy-theme');
    return (stored as any) || 'dark';
};
