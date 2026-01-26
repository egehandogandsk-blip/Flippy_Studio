import { create } from 'zustand';

export interface Layer {
    id: string;
    name: string;
    type: string;
    visible: boolean;
    locked: boolean;
    fabricObject?: any; // Reference to Fabric.js object
}

interface LayersState {
    layers: Layer[];
    selectedLayerId: string | null;
    setLayers: (layers: Layer[]) => void;
    addLayer: (layer: Layer) => void;
    removeLayer: (id: string) => void;
    updateLayer: (id: string, updates: Partial<Layer>) => void;
    setSelectedLayer: (id: string | null) => void;
    reorderLayers: (startIndex: number, endIndex: number) => void;
}

export const useLayersStore = create<LayersState>((set) => ({
    layers: [],
    selectedLayerId: null,

    setLayers: (layers) => set({ layers }),

    addLayer: (layer) => set((state) => ({
        layers: [...state.layers, layer]
    })),

    removeLayer: (id) => set((state) => ({
        layers: state.layers.filter(l => l.id !== id),
        selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId
    })),

    updateLayer: (id, updates) => set((state) => ({
        layers: state.layers.map(l =>
            l.id === id ? { ...l, ...updates } : l
        )
    })),

    setSelectedLayer: (id) => set({ selectedLayerId: id }),

    reorderLayers: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.layers);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { layers: result };
    }),
}));
