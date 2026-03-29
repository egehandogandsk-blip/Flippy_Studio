import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ExportPreset } from '../types/ExportPreset';

export type NodeType = 'FRAME' | 'RECT' | 'TEXT' | 'GROUP' | 'ELLIPSE' | 'ICON' | 'IMAGE';

export interface LayoutProps {
    layoutMode: 'NONE' | 'FLEX';
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    gap?: number;
    padding?: number;
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

export interface NodeStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    opacity?: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    borderRadius?: number;
}

export interface DocumentNode {
    id: string;
    type: NodeType;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    style: NodeStyle;
    layout: LayoutProps;
    children: string[]; // IDs of children
    parentId?: string;
    text?: string; // For TEXT nodes
    iconName?: string; // For ICON nodes - lucide icon name
    svgPath?: string; // For ICON nodes - SVG path data
    imageUrl?: string; // For IMAGE nodes - URL or base64
    visible?: boolean;
    locked?: boolean;
    exportPresets?: ExportPreset[]; // Export configurations
}

export interface DocumentState {
    nodes: Record<string, DocumentNode>;
    rootId: string;
    projectName: string;
    actions: {
        setProjectName: (name: string) => void;
        addNode: (node: DocumentNode) => void;
        updateNode: (id: string, updates: Partial<DocumentNode> | ((node: DocumentNode) => void)) => void;
        deleteNode: (id: string) => void;
        moveNode: (id: string, newParentId: string, index?: number) => void;
        reparentNode: (id: string, newParentId: string) => void;
        duplicateNode: (id: string) => void;
        reorderNode: (id: string, direction: 'UP' | 'DOWN') => void;
        toggleVisibility: (id: string) => void;
        toggleLock: (id: string) => void;
        addExportPreset: (id: string, preset: ExportPreset) => void;
        removeExportPreset: (id: string, presetId: string) => void;
        resetDocument: () => void;
        setNodes: (nodes: Record<string, DocumentNode>) => void;
    };
}

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const useDocumentStore = create<DocumentState>()(
    immer((set) => ({
        nodes: {
            root: {
                id: 'root',
                type: 'FRAME',
                name: 'Root',
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                style: {},
                layout: { layoutMode: 'NONE' },
                children: [],
                locked: true, // Lock root to prevent accidental edits
            },
        },
        rootId: 'root',
        projectName: 'Untitled Project',
        actions: {
            setProjectName: (name) => set((state) => { state.projectName = name; }),
            addNode: (node) =>
                set((state) => {
                    const id = node.id || generateId();
                    state.nodes[id] = { ...node, id };
                    if (node.parentId && state.nodes[node.parentId]) {
                        state.nodes[node.parentId].children.push(id);
                    }
                }),
            updateNode: (id, updates) =>
                set((state) => {
                    const node = state.nodes[id];
                    if (node) {
                        if (typeof updates === 'function') {
                            updates(node);
                        } else {
                            Object.assign(node, updates);
                        }
                    }
                }),
            deleteNode: (id) =>
                set((state) => {
                    if (id === state.rootId) return; // Protect root
                    const deleteRecursive = (nodeId: string) => {
                        const node = state.nodes[nodeId];
                        if (!node) return;
                        node.children.forEach(deleteRecursive);
                        delete state.nodes[nodeId];
                    };

                    const node = state.nodes[id];
                    if (node && node.parentId && state.nodes[node.parentId]) {
                        state.nodes[node.parentId].children = state.nodes[node.parentId].children.filter((c: string) => c !== id);
                    }
                    deleteRecursive(id);
                }),
            moveNode: (_id, _newParentId, _index) =>
                set((_state) => {
                    // Placeholder for drag-drop logic
                }),
            reparentNode: (id, newParentId) =>
                set((state) => {
                    const node = state.nodes[id];
                    const oldParent = node.parentId ? state.nodes[node.parentId] : null;
                    const newParent = state.nodes[newParentId];

                    if (!node || !newParent || node.parentId === newParentId) return;

                    // Calculate absolute position
                    let absX = node.x;
                    let absY = node.y;
                    let current = oldParent;
                    while (current && current.id !== 'root') {
                        absX += current.x;
                        absY += current.y;
                        current = current.parentId ? state.nodes[current.parentId] : null;
                    }

                    // Calculate new relative position
                    let parentAbsX = 0;
                    let parentAbsY = 0;
                    current = newParent;
                    while (current && current.id !== 'root') {
                        parentAbsX += current.x;
                        parentAbsY += current.y;
                        current = current.parentId ? state.nodes[current.parentId] : null;
                    }

                    // Update Node
                    node.x = absX - parentAbsX;
                    node.y = absY - parentAbsY;
                    node.parentId = newParentId;

                    // Update Hierarchy
                    if (oldParent) {
                        oldParent.children = oldParent.children.filter((c: string) => c !== id);
                    }
                    newParent.children.push(id);
                }),
            duplicateNode: (originalId) =>
                set((state) => {
                    const original = state.nodes[originalId];
                    if (!original || !original.parentId) return;

                    const copyId = generateId();
                    const copy = { ...original, id: copyId, x: original.x + 20, y: original.y + 20, name: `${original.name} Copy` };

                    state.nodes[copyId] = copy;
                    state.nodes[original.parentId].children.push(copyId);
                }),
            reorderNode: (id, direction) =>
                set((state) => {
                    const node = state.nodes[id];
                    if (!node || !node.parentId) return;

                    const parent = state.nodes[node.parentId];
                    const currentIndex = parent.children.indexOf(id);
                    if (currentIndex === -1) return;

                    const newIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
                    if (newIndex < 0 || newIndex >= parent.children.length) return;

                    // Swap
                    const temp = parent.children[newIndex];
                    parent.children[newIndex] = id;
                    parent.children[currentIndex] = temp;
                }),
            toggleVisibility: (id) =>
                set((state) => {
                    if (state.nodes[id]) {
                        state.nodes[id].visible = state.nodes[id].visible === undefined ? false : !state.nodes[id].visible;
                    }
                }),
            toggleLock: (id) =>
                set((state) => {
                    if (state.nodes[id]) {
                        state.nodes[id].locked = !state.nodes[id].locked;
                    }
                }),
            addExportPreset: (id, preset) =>
                set((state) => {
                    const node = state.nodes[id];
                    if (node) {
                        if (!node.exportPresets) {
                            node.exportPresets = [];
                        }
                        node.exportPresets.push(preset);
                    }
                }),
            removeExportPreset: (id, presetId) =>
                set((state) => {
                    const node = state.nodes[id];
                    if (node && node.exportPresets) {
                        node.exportPresets = node.exportPresets.filter((p: ExportPreset) => p.id !== presetId);
                    }
                }),
            resetDocument: () =>
                set((state) => {
                    state.nodes = {
                        root: {
                            id: 'root',
                            type: 'FRAME',
                            name: 'Root',
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0,
                            style: {},
                            layout: { layoutMode: 'NONE' },
                            children: [],
                            locked: true,
                        },
                    };
                    state.projectName = 'Untitled Project';
                }),
            setNodes: (nodes) =>
                set((state) => {
                    state.nodes = nodes;
                }),
        },
    }))
);
