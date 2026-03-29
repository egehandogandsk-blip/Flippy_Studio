import { useEffect } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { useSelectionStore } from '../store/selectionStore';
import { useUiStore } from '../store/uiStore';

export const useKeyboardShortcuts = () => {
    const { actions: { deleteNode, duplicateNode } } = useDocumentStore();
    const { selectedIds, clearSelection } = useSelectionStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Tool Shortcuts
            switch (e.key.toLowerCase()) {
                case 'v': useUiStore.getState().setActiveTool('select'); break;
                case 'r': useUiStore.getState().setActiveTool('rectangle'); break;
                case 'c': useUiStore.getState().setActiveTool('ellipse'); break;
                case 't': useUiStore.getState().setActiveTool('text'); break;
                case 'f': useUiStore.getState().setActiveTool('artboard'); break;
                case ' ':
                    e.preventDefault();
                    useUiStore.getState().setActiveTool('move');
                    break;
            }

            // Delete / Backspace
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedIds.length > 0) {
                    selectedIds.forEach(id => deleteNode(id));
                    clearSelection();
                }
            }

            // Copy (Ctrl+C)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
                if (selectedIds.length > 0) {
                    localStorage.setItem('clipboard_nodes', JSON.stringify(selectedIds));
                }
            }

            // Cut (Ctrl+X)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'x' || e.key === 'X')) {
                if (selectedIds.length > 0) {
                    // Copy first
                    localStorage.setItem('clipboard_nodes', JSON.stringify(selectedIds));
                    // Then delete
                    selectedIds.forEach(id => deleteNode(id));
                    clearSelection();
                }
            }

            // Paste (Ctrl+V)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
                const clipboard = localStorage.getItem('clipboard_nodes');
                if (clipboard) {
                    try {
                        const ids = JSON.parse(clipboard);
                        if (Array.isArray(ids)) {
                            ids.forEach((id: string) => duplicateNode(id));
                        }
                    } catch (err) {
                        console.error("Failed to parse clipboard", err);
                    }
                }
            }

            // Duplicate (Ctrl+D) - Quick duplicate
            if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
                e.preventDefault(); // Prevent browser bookmark dialog
                if (selectedIds.length > 0) {
                    selectedIds.forEach(id => duplicateNode(id));
                }
            }

            // Select All (Ctrl+A)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                // Get all node IDs except root
                const allNodeIds = Object.keys(useDocumentStore.getState().nodes).filter(id => id !== 'root');
                useSelectionStore.getState().setSelection(allNodeIds);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds, deleteNode, duplicateNode, clearSelection]);
};
