import { create } from 'zustand';

interface SelectionState {
    selectedIds: string[];
    select: (id: string, multi?: boolean) => void;
    setSelection: (ids: string[]) => void;
    clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
    selectedIds: [],
    select: (id, multi = false) =>
        set((state) => ({
            selectedIds: multi
                ? state.selectedIds.includes(id)
                    ? state.selectedIds.filter((sid) => sid !== id)
                    : [...state.selectedIds, id]
                : [id],
        })),
    setSelection: (ids: string[]) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] }),
}));
