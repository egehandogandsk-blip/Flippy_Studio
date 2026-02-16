import React, { useEffect, useRef } from 'react';
import { useSelectionStore } from '../../store/selectionStore';
import { useDocumentStore } from '../../store/documentStore';

import { Clipboard, Trash2, BringToFront, SendToBack, Eye, Lock, Group, MousePointer2, Copy } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    type: 'CANVAS' | 'OBJECT';
    nodeId?: string;
    onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, type, nodeId, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const { actions: { deleteNode, duplicateNode, toggleLock, reorderNode } } = useDocumentStore();
    const { selectedIds, clearSelection } = useSelectionStore();


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);



    const handleDuplicate = () => {
        if (nodeId) duplicateNode(nodeId);
        onClose();
    };

    const handleDelete = () => {
        if (nodeId) {
            // Check if multiple selected
            if (selectedIds.includes(nodeId)) {
                selectedIds.forEach(id => deleteNode(id));
                clearSelection();
            } else {
                deleteNode(nodeId);
            }
        }
        onClose();
    };

    const handleCopy = () => {
        if (selectedIds.length > 0) {
            localStorage.setItem('clipboard_nodes', JSON.stringify(selectedIds));
        } else if (nodeId) {
            localStorage.setItem('clipboard_nodes', JSON.stringify([nodeId]));
        }
        onClose();
    };

    const handlePaste = async () => {
        const clipboard = localStorage.getItem('clipboard_nodes');
        if (clipboard) {
            try {
                const ids = JSON.parse(clipboard);
                if (Array.isArray(ids)) {
                    // In a real app we'd paste at mouse position (x,y)
                    // For now, duplicate existing logic
                    ids.forEach((id: string) => duplicateNode(id));
                }
            } catch (err) {
                console.error("Failed to parse clipboard", err);
            }
        }
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="fixed z-[9999] w-64 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl py-2 flex flex-col text-sm text-zinc-300 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: y, left: x }}
        >
            {type === 'CANVAS' ? (
                <>
                    <button onClick={handlePaste} className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group">
                        <span className="flex items-center gap-2"><Clipboard className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" /> Paste here</span>
                        <span className="text-xs text-zinc-600">Ctrl+V</span>
                    </button>
                    <div className="h-px bg-[#333] my-1" />
                    <button className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group opacity-50 cursor-not-allowed">
                        <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-zinc-500" /> Show/Hide UI</span>
                        <span className="text-xs text-zinc-600">Ctrl+\</span>
                    </button>
                    <button className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group opacity-50 cursor-not-allowed">
                        <span className="flex items-center gap-2"><MousePointer2 className="w-4 h-4 text-zinc-500" /> Cursor chat</span>
                        <span className="text-xs text-zinc-600">/</span>
                    </button>
                </>
            ) : (
                <>
                    <button onClick={handleCopy} className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group">
                        <span className="flex items-center gap-2"><Copy className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" /> Copy</span>
                        <span className="text-xs text-zinc-600">Ctrl+C</span>
                    </button>
                    <button onClick={handlePaste} className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group">
                        <span className="flex items-center gap-2"><Clipboard className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" /> Paste here</span>
                        <span className="text-xs text-zinc-600">Ctrl+V</span>
                    </button>
                    <button onClick={handleDuplicate} className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group">
                        <span className="flex items-center gap-2"><Copy className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" /> Duplicate</span>
                        <span className="text-xs text-zinc-600">Ctrl+D</span>
                    </button>
                    <button onClick={handleDelete} className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group text-red-400 hover:text-red-300">
                        <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</span>
                        <span className="text-xs text-red-500/50 group-hover:text-red-400">Del</span>
                    </button>

                    <div className="h-px bg-[#333] my-1" />

                    <button onClick={() => nodeId && reorderNode(nodeId, 'UP')} className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group">
                        <span className="flex items-center gap-2"><BringToFront className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" /> Bring to front</span>
                        <span className="text-xs text-zinc-600">]</span>
                    </button>
                    <button onClick={() => nodeId && reorderNode(nodeId, 'DOWN')} className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group">
                        <span className="flex items-center gap-2"><SendToBack className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" /> Send to back</span>
                        <span className="text-xs text-zinc-600">[</span>
                    </button>

                    <div className="h-px bg-[#333] my-1" />

                    <button className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group opacity-50 cursor-not-allowed">
                        <span className="flex items-center gap-2"><Group className="w-4 h-4 text-zinc-500" /> Group selection</span>
                        <span className="text-xs text-zinc-600">Ctrl+G</span>
                    </button>
                    <button onClick={() => nodeId && toggleLock(nodeId)} className="px-3 py-2 hover:bg-zinc-800 flex items-center justify-between group">
                        <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-zinc-500" /> Lock/Unlock</span>
                        <span className="text-xs text-zinc-600">Ctrl+Shift+L</span>
                    </button>
                </>
            )}
        </div>
    );
};
