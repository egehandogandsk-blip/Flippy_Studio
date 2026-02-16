import { create } from 'zustand';

export type ToolType = 'select' | 'move' | 'rectangle' | 'ellipse' | 'text' | 'artboard';

interface UiState {
    activeTool: ToolType;
    zoom: number;
    theme: 'light' | 'dark';
    canvasBackgroundColor: string;
    showIconLibrary: boolean;
    showGrid: boolean;
    showLauncher: boolean;
    setActiveTool: (tool: ToolType) => void;
    setZoom: (zoom: number) => void;
    toggleTheme: () => void;
    setCanvasBackgroundColor: (color: string) => void;
    toggleIconLibrary: () => void;
    toggleGrid: () => void;
    setShowLauncher: (show: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
    activeTool: 'select',
    zoom: 1,
    theme: 'dark',
    canvasBackgroundColor: '#1e1e1e', // Default dark gray
    showIconLibrary: false,
    showGrid: true, // Grid visible by default
    showLauncher: true, // Default to true to show on startup
    setActiveTool: (tool) => set({ activeTool: tool }),
    setZoom: (zoom) => set({ zoom }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    setCanvasBackgroundColor: (color) => set({ canvasBackgroundColor: color }),
    toggleIconLibrary: () => set((state) => ({ showIconLibrary: !state.showIconLibrary })),
    toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
    setShowLauncher: (show) => set({ showLauncher: show }),
}));
