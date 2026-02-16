import React, { useState } from 'react';
import { useDocumentStore } from '../../store/documentStore';
import { useSelectionStore } from '../../store/selectionStore';
import { Folder, Type, Box, Square, Circle, Sparkles, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useIntegrationStore, EngineType } from '../../store/integrationStore';
import { useShallow } from 'zustand/react/shallow';

const IconMap: any = {
    FRAME: Box,
    RECT: Square,
    TEXT: Type,
    GROUP: Folder,
    ELLIPSE: Circle,
    ICON: Sparkles
};

const LayerItem: React.FC<{ nodeId: string; level?: number }> = ({ nodeId, level = 0 }) => {
    // Select only what we need for the list item itself
    const node = useDocumentStore(useShallow((state) => {
        const n = state.nodes[nodeId];
        if (!n) return null;
        return {
            name: n.name,
            type: n.type,
            locked: n.locked,
            visible: n.visible,
            children: n.children // We need children ID array reference to map them
        };
    }));

    // Actions are stable
    const { toggleVisibility, toggleLock, reorderNode } = useDocumentStore((state) => state.actions);

    const { isSelected, select } = useSelectionStore(useShallow((state) => ({
        isSelected: state.selectedIds.includes(nodeId),
        select: state.select
    })));

    const [isHovered, setIsHovered] = useState(false);

    if (!node) return null;

    const Icon = IconMap[node.type] || Box;

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.locked) return;
        select(nodeId, e.shiftKey);
    };

    const handleToggleVisibility = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleVisibility(nodeId);
    };

    const handleToggleLock = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleLock(nodeId);
    };

    const handleReorder = (e: React.MouseEvent, direction: 'UP' | 'DOWN') => {
        e.stopPropagation();
        reorderNode(nodeId, direction);
    };

    return (
        <div>
            <div
                className={clsx(
                    "group flex items-center justify-between px-2 py-1 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 pr-1 transition-colors",
                    isSelected ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400",
                    node.locked && "opacity-60"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={handleSelect}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 w-10 shrink-0">
                        {/* Visibility */}
                        <button
                            onClick={handleToggleVisibility}
                            className={clsx("hover:text-zinc-600 dark:hover:text-zinc-300 p-0.5 rounded", !node.visible && node.visible !== undefined ? "text-zinc-400 dark:text-zinc-500" : "invisible group-hover:visible")}
                        >
                            {node.visible === false ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                        {/* Lock */}
                        <button
                            onClick={handleToggleLock}
                            className={clsx("hover:text-zinc-600 dark:hover:text-zinc-300 p-0.5 rounded", node.locked ? "text-zinc-400 dark:text-zinc-500" : "invisible group-hover:visible")}
                        >
                            {node.locked ? <Lock size={12} /> : <Unlock size={12} />}
                        </button>
                    </div>

                    <Icon size={14} className="shrink-0" />
                    <span className={clsx("truncate select-none", node.visible === false && "text-zinc-400 dark:text-zinc-600")}>{node.name}</span>
                </div>

                {/* Reorder Buttons */}
                <div className={clsx("flex items-center gap-0.5", (isHovered || isSelected) ? "opacity-100" : "opacity-0")}>
                    <button onClick={(e) => handleReorder(e, 'UP')} className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white" title="Move Up"><ChevronUp size={12} /></button>
                    <button onClick={(e) => handleReorder(e, 'DOWN')} className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white" title="Move Down"><ChevronDown size={12} /></button>
                </div>
            </div>
            {node.children && node.children.slice().reverse().map(childId => (
                <LayerItem key={childId} nodeId={childId} level={level + 1} />
            ))}
        </div>
    );
};

const ProjectInfoPanel: React.FC = () => {
    // Optimized selector: only re-render if projectName changes
    const projectName = useDocumentStore(useShallow(state => state.projectName));
    const setProjectName = useDocumentStore(state => state.actions.setProjectName);

    return (
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Çalışma Adı</label>
            <input
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-md px-2 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                placeholder="İsimsiz Proje"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
            />
        </div>
    );
};

const LogoPanel: React.FC = () => {
    // Optimized selector
    const { openModal, engines } = useIntegrationStore(useShallow(state => ({
        openModal: state.openModal,
        engines: state.engines
    })));

    const logos: { name: EngineType, url: string }[] = [
        { name: 'Unity', url: 'https://cdn.simpleicons.org/unity/000000/ffffff' },
        { name: 'Unreal', url: 'https://cdn.simpleicons.org/unrealengine/000000/ffffff' },
        { name: 'Godot', url: 'https://cdn.simpleicons.org/godotengine/478CBF/478CBF' }
    ];

    return (
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Motor Entegrasyonu</label>
            <div className="grid grid-cols-3 gap-2">
                {logos.map((logo) => {
                    const status = engines[logo.name];
                    return (
                        <div
                            key={logo.name}
                            onClick={() => openModal(logo.name)}
                            className={clsx(
                                "aspect-square flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-md border transition-all cursor-pointer group relative",
                                status.isConnected
                                    ? "border-green-500 bg-green-500/5 dark:bg-green-500/10"
                                    : "border-zinc-200 dark:border-zinc-700 hover:border-purple-500 hover:bg-purple-500/10"
                            )}
                            title={`Manage ${logo.name} Integration`}
                        >
                            {/* Status Indicator */}
                            {status.hasChanges && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm shadow-blue-500/50" />
                            )}

                            <img
                                src={logo.url}
                                alt={logo.name}
                                className="w-6 h-6 mb-1 opacity-70 group-hover:opacity-100 transition-opacity dark:invert-0"
                                style={{ filter: logo.name !== 'Godot' ? 'var(--icon-filter)' : 'none' }}
                            />
                            <span className={clsx(
                                "text-[9px] group-hover:text-purple-500",
                                status.isConnected ? "text-green-600 dark:text-green-400 font-medium" : "text-zinc-500"
                            )}>
                                {logo.name}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* CSS helper for light/dark mode icon coloring for Unity/Unreal */}
            <style>{`
                .dark { --icon-filter: invert(1); }
                :not(.dark) { --icon-filter: invert(0); }
            `}</style>
        </div>
    );
};

export const LayerTree: React.FC = () => {
    // Access rootId and root node's children ID list specifically.
    // Using simple selector without shallow because rootId is primitive
    const rootId = useDocumentStore(state => state.rootId);

    // Using shallow for getting children array to avoid re-renders if *other* node properties change
    // Wait, if node properties change, we might want to re-render IF we were rendering node details here?
    // No, LayerTree only renders the list of children. The recursive mapping depends on children array reference.
    // However, we need to access state.nodes inside LayerTree just to get children.

    const rootChildren = useDocumentStore(useShallow(state => {
        const root = state.nodes[state.rootId];
        return root ? root.children : [];
    }));

    // If root doesn't exist (loading?), handle gracefully
    if (!rootChildren) return null;

    return (
        <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0">
            <ProjectInfoPanel />
            <LogoPanel />
            <div className="p-3 font-semibold text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm bg-zinc-50 dark:bg-zinc-900/50">
                <span>Layers</span>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
                {rootChildren.slice().reverse().map(childId => (
                    <LayerItem key={childId} nodeId={childId} />
                ))}
            </div>
        </div>
    );
};
