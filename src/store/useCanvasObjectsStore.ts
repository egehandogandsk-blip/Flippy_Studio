import { create } from 'zustand';
import type { Object as FabricObject } from 'fabric';

interface CanvasObjectsStore {
    selectedObject: FabricObject | null;
    setSelectedObject: (obj: FabricObject | null) => void;
}

export const useCanvasObjectsStore = create<CanvasObjectsStore>((set) => ({
    selectedObject: null,
    setSelectedObject: (obj) => set({ selectedObject: obj }),
}));
