import { create } from 'zustand';

interface InteractionState {
    dragOffset: { x: number; y: number };
    actions: {
        setDragOffset: (offset: { x: number; y: number }) => void;
    };
}

export const useInteractionStore = create<InteractionState>((set) => ({
    dragOffset: { x: 0, y: 0 },
    actions: {
        setDragOffset: (offset) => set({ dragOffset: offset }),
    },
}));
