import { create } from 'zustand';

interface HistoryState {
    past: string[];
    future: string[];
    addToHistory: (state: string) => void;
    undo: () => string | null;
    redo: () => string | null;
    clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
    past: [],
    future: [],

    addToHistory: (state: string) => {
        set((current) => ({
            past: [...current.past, state],
            future: [], // Clear future when new action is performed
        }));
    },

    undo: () => {
        const { past, future } = get();
        if (past.length === 0) return null;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);

        set({
            past: newPast,
            future: [previous, ...future],
        });

        return newPast.length > 0 ? newPast[newPast.length - 1] : null;
    },

    redo: () => {
        const { past, future } = get();
        if (future.length === 0) return null;

        const next = future[0];

        set({
            past: [...past, next],
            future: future.slice(1),
        });

        return next;
    },

    clear: () => {
        set({ past: [], future: [] });
    },
}));
