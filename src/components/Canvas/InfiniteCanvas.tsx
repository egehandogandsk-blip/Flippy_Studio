import React, { useRef, useState, useEffect, useMemo } from 'react';
import { LayerRenderer } from '../Renderer/LayerRenderer';
import { useSelectionStore } from '../../store/selectionStore';
import { useUiStore } from '../../store/uiStore';
import { useDocumentStore } from '../../store/documentStore';
import { NodeType } from '../../store/documentStore';
import { SelectionBox } from './SelectionBox';
import { SmartGuidesOverlay } from './SmartGuidesOverlay';
import { CanvasRuler } from './CanvasRuler';
import { GridOverlay } from './GridOverlay';
import { snapToGrid } from '../../utils/snapToGrid';
import { AlignmentGuide, DistanceMeasurement, calculateSmartGuides } from '../../utils/SmartGuides';
import { useShallow } from 'zustand/react/shallow';

import { ContextMenu } from '../UI/ContextMenu';
import { useInteractionStore } from '../../store/interactionStore';

type InteractionState =
    | { type: 'IDLE' }
    | { type: 'PANNING'; startX: number; startY: number; initialTransform: { x: number; y: number } }
    | { type: 'DRAGGING_NODES'; startX: number; startY: number; initialPositions: Record<string, { x: number; y: number }> }
    | { type: 'MARQUEE'; startX: number; startY: number; currentX: number; currentY: number }
    | { type: 'DRAWING'; tool: NodeType; startX: number; startY: number; currentX: number; currentY: number; modifiers: { shift: boolean } };

export const InfiniteCanvas: React.FC = () => {
    const [transform, setTransform] = useState({ x: 100, y: 100, k: 1 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [interaction, setInteraction] = useState<InteractionState>({ type: 'IDLE' });
    const [smartGuides, setSmartGuides] = useState<{ guides: AlignmentGuide[]; measurements: DistanceMeasurement[] }>({ guides: [], measurements: [] });
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: 'CANVAS' | 'OBJECT'; nodeId?: string } | null>(null);

    const { selectedIds, select, clearSelection } = useSelectionStore(useShallow(state => ({
        selectedIds: state.selectedIds,
        select: state.select,
        clearSelection: state.clearSelection
    })));

    const { activeTool, setActiveTool, canvasBackgroundColor, showGrid } = useUiStore(useShallow(state => ({
        activeTool: state.activeTool,
        setActiveTool: state.setActiveTool,
        canvasBackgroundColor: state.canvasBackgroundColor,
        showGrid: state.showGrid
    })));

    const { addNode, updateNode, reparentNode } = useDocumentStore(useShallow(state => ({
        addNode: state.actions.addNode,
        updateNode: state.actions.updateNode,
        reparentNode: state.actions.reparentNode
    })));

    // Helper to get canvas coordinates from mouse event
    const getCanvasPos = (clientX: number, clientY: number) => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: (clientX - rect.left - transform.x) / transform.k,
            y: (clientY - rect.top - transform.y) / transform.k
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (contextMenu) setContextMenu(null);

        // 1. Pan (Space or Middle Click)
        if (e.button === 1 || activeTool === 'move') {
            setInteraction({
                type: 'PANNING',
                startX: e.clientX,
                startY: e.clientY,
                initialTransform: { ...transform }
            });
            return;
        }

        const pos = getCanvasPos(e.clientX, e.clientY);

        // 2. Drawing Tools
        if (activeTool === 'rectangle' || activeTool === 'ellipse' || activeTool === 'text' || activeTool === 'artboard') {
            const typeMap: Record<string, NodeType> = { 'rectangle': 'RECT', 'ellipse': 'ELLIPSE', 'text': 'TEXT', 'artboard': 'FRAME' };
            const nodeType = typeMap[activeTool];

            if (nodeType) {
                // Start drawing interaction but DO NOT create node yet
                setInteraction({
                    type: 'DRAWING',
                    tool: nodeType,
                    startX: pos.x,
                    startY: pos.y,
                    currentX: pos.x,
                    currentY: pos.y,
                    modifiers: { shift: e.shiftKey }
                });
            }
            return;
        }

        // 3. Selection / Dragging
        const target = e.target as HTMLElement;
        const nodeId = target.closest('[data-node-id]')?.getAttribute('data-node-id');

        if (nodeId) {
            // Clicked on a node
            const isAlreadySelected = selectedIds.includes(nodeId);

            if (e.shiftKey) {
                // Multi-select toggle
                select(nodeId, true);
            } else {
                // Exclusive select (unless already selected and potentially dragging multiple)
                if (!isAlreadySelected) {
                    select(nodeId, false);
                }
            }

            // Start Dragging
            const nodesToDrag = e.shiftKey || isAlreadySelected ? useSelectionStore.getState().selectedIds : [nodeId];
            const currentNodes = useDocumentStore.getState().nodes;

            const initialPositions: Record<string, { x: number, y: number }> = {};
            nodesToDrag.forEach(id => {
                const n = currentNodes[id];
                if (n) initialPositions[id] = { x: n.x, y: n.y };
            });

            setInteraction({
                type: 'DRAGGING_NODES',
                startX: pos.x,
                startY: pos.y,
                initialPositions
            });

        } else {
            // Clicked on background
            if (!e.shiftKey) {
                clearSelection();
            }
            if (contextMenu) setContextMenu(null);
            setInteraction({ type: 'MARQUEE', startX: pos.x, startY: pos.y, currentX: pos.x, currentY: pos.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (interaction.type === 'IDLE') return;

        if (interaction.type === 'PANNING') {
            const dx = e.clientX - interaction.startX;
            const dy = e.clientY - interaction.startY;
            setTransform({
                ...transform,
                x: interaction.initialTransform.x + dx,
                y: interaction.initialTransform.y + dy
            });
            return;
        }

        const pos = getCanvasPos(e.clientX, e.clientY);

        if (interaction.type === 'DRAWING') {
            // Simply update the current position for preview
            setInteraction({
                ...interaction,
                currentX: pos.x,
                currentY: pos.y,
                modifiers: { shift: e.shiftKey }
            });
            return;
        }

        if (interaction.type === 'DRAGGING_NODES') {
            let dx = pos.x - interaction.startX;
            let dy = pos.y - interaction.startY;

            // Shift-constrained dragging: lock to horizontal or vertical axis
            if (e.shiftKey) {
                // Determine which axis has more movement
                if (Math.abs(dx) > Math.abs(dy)) {
                    // Lock to horizontal
                    dy = 0;
                } else {
                    // Lock to vertical
                    dx = 0;
                }
            }

            // Get the first dragged node for smart guides calculation
            const firstNodeId = Object.keys(interaction.initialPositions)[0];
            const currentNodes = useDocumentStore.getState().nodes;
            const firstNode = currentNodes[firstNodeId];

            // Update drag offset instead of committing to store
            if (firstNode) {
                // Determine new proposed position (relative to initial)
                // Note: Smart guides logic still uses absolute positions, so we calculate that temporarily
                // But we ONLY update visual offset

                let newX = interaction.initialPositions[firstNodeId].x + dx;
                let newY = interaction.initialPositions[firstNodeId].y + dy;

                // Calculate Smart Guides
                const result = calculateSmartGuides(
                    firstNode,
                    { x: newX, y: newY, width: firstNode.width, height: firstNode.height },
                    currentNodes,
                    firstNodeId
                );

                setSmartGuides({
                    guides: result.guides,
                    measurements: result.measurements
                });

                // Apply Snap Offsets to the delta
                const snapX = result.snapOffset.x !== 0 ? result.snapOffset.x : 0;
                const snapY = result.snapOffset.y !== 0 ? result.snapOffset.y : 0;

                const finalDx = dx + snapX;
                const finalDy = dy + snapY;

                // Update transient store
                useInteractionStore.getState().actions.setDragOffset({ x: finalDx, y: finalDy });
            }
        }

        if (interaction.type === 'MARQUEE') {
            setInteraction({ ...interaction, currentX: pos.x, currentY: pos.y });
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const nodeId = target.closest('[data-node-id]')?.getAttribute('data-node-id');

        if (nodeId) {
            // Select the node if not already selected
            if (!selectedIds.includes(nodeId)) {
                select(nodeId, false);
            }
            setContextMenu({ x: e.clientX, y: e.clientY, type: 'OBJECT', nodeId });
        } else {
            setContextMenu({ x: e.clientX, y: e.clientY, type: 'CANVAS' });
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        // Clear smart guides when drag ends
        setSmartGuides({ guides: [], measurements: [] });

        if (interaction.type === 'DRAWING') {
            // Finalize drawing
            let width = Math.abs(interaction.currentX - interaction.startX);
            let height = Math.abs(interaction.currentY - interaction.startY);
            let x = Math.min(interaction.currentX, interaction.startX);
            let y = Math.min(interaction.currentY, interaction.startY);

            // Aspect ratio constraint (Shift key)
            if (e.shiftKey || interaction.modifiers?.shift) {
                const size = Math.max(width, height);
                width = size;
                height = size;

                // Adjust x/y based on direction
                if (interaction.currentX < interaction.startX) {
                    x = interaction.startX - size;
                }
                if (interaction.currentY < interaction.startY) {
                    y = interaction.startY - size;
                }
            }

            // Create node if bigger than minimum size or it is Text (click to create)
            if (width > 5 || height > 5 || interaction.tool === 'TEXT') {
                const id = Date.now().toString();
                addNode({
                    id,
                    type: interaction.tool,
                    name: interaction.tool === 'RECT' ? 'Rectangle' : interaction.tool === 'ELLIPSE' ? 'Ellipse' : interaction.tool === 'TEXT' ? 'Text' : 'Frame',
                    x: snapToGrid(x),
                    y: snapToGrid(y),
                    width: Math.max(width, interaction.tool === 'TEXT' ? 100 : 10), // Min size
                    height: Math.max(height, interaction.tool === 'TEXT' ? 50 : 10),
                    style: { fill: interaction.tool === 'FRAME' ? '#ffffff' : '#d1d5db', stroke: 'none', strokeWidth: 0 },
                    layout: { layoutMode: 'NONE' },
                    children: [],
                    parentId: 'root',
                    text: interaction.tool === 'TEXT' ? 'Text' : undefined
                });

                // Select the new node
                select(id, false);
            }
            setActiveTool('select');
        }

        if (interaction.type === 'DRAGGING_NODES') {
            const pos = getCanvasPos(e.clientX, e.clientY);
            // Check for reparenting
            const draggedIds = Object.keys(interaction.initialPositions);
            const currentNodes = useDocumentStore.getState().nodes;

            // Get final drag offset from store
            const dragOffset = useInteractionStore.getState().dragOffset;

            // Commit final positions to store
            if (dragOffset.x !== 0 || dragOffset.y !== 0) {
                draggedIds.forEach(id => {
                    const initPos = interaction.initialPositions[id];
                    updateNode(id, {
                        x: initPos.x + dragOffset.x,
                        y: initPos.y + dragOffset.y
                    });
                });
            }

            // Reset drag offset
            useInteractionStore.getState().actions.setDragOffset({ x: 0, y: 0 });

            // Find potential new parent (Frame) under the mouse
            // We need to check all nodes to see if we dropped inside one
            // This is a naive hit test. A better one would check Z-index or tree order.
            // We iterate in reverse to find top-most.
            const hitFrameId = Object.values(currentNodes)
                .slice()
                .reverse()
                .find(node =>
                    node.type === 'FRAME' &&
                    node.id !== 'root' &&
                    !draggedIds.includes(node.id) && // Can't drop into self
                    pos.x >= node.x && pos.x <= node.x + node.width &&
                    pos.y >= node.y && pos.y <= node.y + node.height
                )?.id;

            const targetParentId = hitFrameId || 'root';

            draggedIds.forEach(id => {
                const node = currentNodes[id];
                if (node && node.parentId !== targetParentId) {
                    reparentNode(id, targetParentId);
                }
            });
        }

        if (interaction.type === 'MARQUEE') {
            // Finalize Marquee Selection
            const x = Math.min(interaction.startX, interaction.currentX);
            const y = Math.min(interaction.startY, interaction.currentY);
            const w = Math.abs(interaction.currentX - interaction.startX);
            const h = Math.abs(interaction.currentY - interaction.startY);

            const currentNodes = useDocumentStore.getState().nodes;
            const hitIds: string[] = [];
            Object.values(currentNodes).forEach(node => {
                if (node.id === 'root') return;
                if (
                    node.x < x + w &&
                    node.x + node.width > x &&
                    node.y < y + h &&
                    node.y + node.height > y
                ) {
                    hitIds.push(node.id);
                }
            });

            if (hitIds.length > 0) {
                hitIds.forEach(id => select(id, true));
            }
        }

        setInteraction({ type: 'IDLE' });
    };

    // Wheel Zoom
    useEffect(() => {
        const preventDefault = (e: WheelEvent) => {
            if (e.ctrlKey) e.preventDefault();
        };
        const current = containerRef.current;
        if (current) current.addEventListener('wheel', preventDefault, { passive: false });
        return () => current?.removeEventListener('wheel', preventDefault);
    }, []);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();


            // Calculate mouse position relative to container
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate point on canvas under mouse BEFORE zoom
            const canvasX = (mouseX - transform.x) / transform.k;
            const canvasY = (mouseY - transform.y) / transform.k;

            // Calculate new scale (Standard exponential zoom)
            // Using e.deltaY to determine direction and magnitude
            // Typically deltaY is around 100 for a mouse wheel notch
            const zoomFactor = Math.pow(0.999, e.deltaY);
            const newScale = Math.max(0.1, Math.min(10, transform.k * zoomFactor));

            // Calculate new translation to keep the same canvas point under the mouse
            // mouseX = newX + canvasX * newScale
            // newX = mouseX - canvasX * newScale
            const newX = mouseX - canvasX * newScale;
            const newY = mouseY - canvasY * newScale;

            setTransform({ x: newX, y: newY, k: newScale });
        } else {
            // Pan
            setTransform(t => ({ ...t, x: t.x - e.deltaX, y: t.y - e.deltaY }));
        }
    };

    // Handle icon drop from library - TEMPORARILY DISABLED
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const iconData = e.dataTransfer.getData('application/icon');

        if (iconData) {
            try {
                const { iconName, displayName } = JSON.parse(iconData);
                const pos = getCanvasPos(e.clientX, e.clientY);

                const id = Date.now().toString();
                addNode({
                    id,
                    type: 'ICON',
                    name: displayName,
                    x: pos.x - 24,
                    y: pos.y - 24,
                    width: 48,
                    height: 48,
                    style: { fill: '#6366f1', stroke: 'none', strokeWidth: 0 },
                    layout: { layoutMode: 'NONE' },
                    children: [],
                    parentId: 'root',
                    iconName: iconName
                });

                select(id, false);
            } catch (error) {
                console.error('Failed to parse icon data:', error);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const getCursorClass = () => {
        if (interaction.type === 'PANNING' || activeTool === 'move') {
            return interaction.type === 'PANNING' ? 'cursor-grabbing' : 'cursor-grab';
        }
        if (activeTool === 'select') return 'cursor-default';
        // For drawing tools, keep crosshair to indicate precision
        return 'cursor-crosshair';
    };

    // Memoize canvas size to prevent re-renders of rulers/grid
    const canvasSize = useMemo(() => ({
        width: containerRef.current?.clientWidth || 0,
        height: containerRef.current?.clientHeight || 0
    }), [containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full overflow-hidden relative select-none transition-colors duration-200 ${getCursorClass()}`}
            style={{ backgroundColor: canvasBackgroundColor }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleContextMenu}
            onWheel={handleWheel}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {/* Grid Overlay */}
            <GridOverlay
                transform={transform}
                canvasSize={canvasSize}
                visible={showGrid}
            />

            <div
                className="absolute origin-top-left transition-transform duration-75 ease-out will-change-transform"
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
                    zIndex: 10
                }}
            >
                <LayerRenderer />

                {/* Smart Guides Overlay */}
                {(smartGuides.guides.length > 0 || smartGuides.measurements.length > 0) && (
                    <SmartGuidesOverlay
                        guides={smartGuides.guides}
                        measurements={smartGuides.measurements}
                        zoom={transform.k}
                    />
                )}

                {/* SVG Overlay for Selection Boxes */}
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ overflow: 'visible' }}
                >
                    <g style={{ pointerEvents: 'auto' }}>
                        {selectedIds.map(id => (
                            <SelectionBox key={id} nodeId={id} zoom={transform.k} />
                        ))}
                    </g>

                    {/* Smart Guides */}
                    <SmartGuidesOverlay
                        guides={smartGuides.guides}
                        measurements={smartGuides.measurements}
                        zoom={transform.k}
                    />
                </svg>

                {/* Marquee Visual */}
                {interaction.type === 'MARQUEE' && (
                    <div
                        className="absolute border border-indigo-500 bg-indigo-500/20 pointer-events-none z-[100]"
                        style={{
                            left: Math.min(interaction.startX, interaction.currentX),
                            top: Math.min(interaction.startY, interaction.currentY),
                            width: Math.abs(interaction.currentX - interaction.startX),
                            height: Math.abs(interaction.currentY - interaction.startY)
                        }}
                    />
                )}

                {/* Drawing Preview Visual */}
                {interaction.type === 'DRAWING' && (() => {
                    let width = Math.abs(interaction.currentX - interaction.startX);
                    let height = Math.abs(interaction.currentY - interaction.startY);
                    let left = Math.min(interaction.startX, interaction.currentX);
                    let top = Math.min(interaction.startY, interaction.currentY);

                    // Aspect ratio constraint (Shift key)
                    if (interaction.modifiers?.shift) {
                        const size = Math.max(width, height);
                        width = size;
                        height = size;

                        // Adjust visual position based on direction
                        if (interaction.currentX < interaction.startX) {
                            left = interaction.startX - size;
                        }
                        if (interaction.currentY < interaction.startY) {
                            top = interaction.startY - size;
                        }
                    }

                    return (
                        <div
                            className="absolute pointer-events-none z-[100]"
                            style={{
                                left,
                                top,
                                width,
                                height,
                                border: interaction.tool === 'TEXT' ? '1px dashed #6366f1' : '1px solid #6366f1',
                                backgroundColor: interaction.tool === 'FRAME' ? '#ffffff' : interaction.tool === 'TEXT' ? 'transparent' : '#d1d5db',
                                opacity: 0.5,
                                borderRadius: interaction.tool === 'ELLIPSE' ? '50%' : '0'
                            }}
                        >
                            {/* Text Label */}
                            {interaction.tool === 'TEXT' && (
                                <span className="text-xs text-indigo-500 bg-white px-1 absolute -top-5 left-0">Text</span>
                            )}

                            {/* Dimensions Tooltip */}
                            <div className="absolute -bottom-6 right-0 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap font-mono z-[110]">
                                {Math.round(width)} x {Math.round(height)}
                            </div>
                        </div>
                    );
                })()}
            </div>

            <div className="absolute bottom-4 right-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-2 rounded shadow text-xs border border-zinc-200 dark:border-zinc-700 transition-colors duration-200">
                {Math.round(transform.k * 100)}%
            </div>

            {/* Canvas Rulers */}
            <CanvasRuler
                orientation="horizontal"
                transform={transform}
                canvasSize={canvasSize}
            />
            <CanvasRuler
                orientation="vertical"
                transform={transform}
                canvasSize={canvasSize}
            />

            {/* Ruler Corner (top-left 20x20 square) */}
            <div className="absolute top-0 left-0 w-5 h-5 bg-zinc-900 border-r border-b border-zinc-700 z-[100]" />

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    type={contextMenu.type}
                    nodeId={contextMenu.nodeId}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
};
