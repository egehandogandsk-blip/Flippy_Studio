import React, { useState, useMemo } from 'react';
import { useDocumentStore } from '../../store/documentStore';
import { useSelectionStore } from '../../store/selectionStore';
import { clsx } from 'clsx';
import { MoreHorizontal, Download, Eye, FolderOpen } from 'lucide-react';

// [IMPORT]
import { useInteractionStore } from '../../store/interactionStore';

const NodeRenderer: React.FC<{ nodeId: string }> = React.memo(({ nodeId }) => {
    const node = useDocumentStore((state) => state.nodes[nodeId]);
    const parentNode = useDocumentStore((state) => node?.parentId ? state.nodes[node.parentId] : null);
    const { selectedIds, select } = useSelectionStore();
    const [showMenu, setShowMenu] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);

    // [New] Transient drag offset
    const dragOffset = useInteractionStore((state) => state.dragOffset);

    // Common container style (Layout & Transform) - MEMOIZED
    const containerStyle: React.CSSProperties = useMemo(() => {
        if (!node) return {};

        const isParentFlex = parentNode?.layout.layoutMode === 'FLEX';
        const isSelected = selectedIds.includes(nodeId);

        // Apply drag offset ONLY if selected and dragging (offset is non-zero)
        // We use translate3d for GPU acceleration
        const transformString = [
            node.rotation ? `rotate(${node.rotation}deg)` : '',
            isSelected && (dragOffset.x !== 0 || dragOffset.y !== 0)
                ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`
                : ''
        ].filter(Boolean).join(' ');

        const baseStyle: React.CSSProperties = {
            position: isParentFlex ? 'relative' : 'absolute',
            left: isParentFlex ? undefined : node.x,
            top: isParentFlex ? undefined : node.y,
            width: node.width,
            height: node.height,
            transform: transformString || undefined, // Use combined transform
            opacity: node.style.opacity,
            pointerEvents: node.locked ? 'none' : 'auto',
            display: node.layout.layoutMode === 'FLEX' ? 'flex' : 'block',
            flexDirection: node.layout.flexDirection || 'row',
            justifyContent: node.layout.justifyContent || 'flex-start',
            alignItems: node.layout.alignItems || 'flex-start',
            gap: node.layout.gap,
            padding: node.layout.padding,
            userSelect: 'none', // Prevent text selection during drag
            willChange: isSelected ? 'transform' : undefined // optimize browser compositing
        };

        // Style specifically for non-SVG nodes (Frame, Text, Group)
        if (node.type === 'FRAME' || node.type === 'TEXT' || node.type === 'GROUP') {
            baseStyle.backgroundColor = node.style.fill;
            baseStyle.border = node.style.stroke ? `${node.style.strokeWidth || 1}px solid ${node.style.stroke}` : undefined;
        }

        return baseStyle;
    }, [node, parentNode, selectedIds, nodeId, dragOffset]);

    // We must check if node exists and if it is visible
    // CRITICAL: Checks must happen AFTER hooks to avoid "Rendered fewer hooks than expected" error
    if (!node || node.visible === false) return null;

    const isSelected = selectedIds.includes(nodeId);

    const isShape = node.type === 'RECT' || node.type === 'ELLIPSE';
    const isFrame = node.type === 'FRAME' && node.id !== 'root';

    return (
        <div
            data-node-id={nodeId}
            style={containerStyle}
            className={clsx(
                "box-border transition-colors duration-75 group/node", // Removed transition-all for transform to prevent lag
                isSelected && "outline outline-2 outline-blue-500 z-50",
                node.type === 'TEXT' && "flex items-center justify-center whitespace-pre-wrap select-none"
            )}
        >


            {/* FRAME LABEL */}
            {isFrame && (
                <div
                    className="absolute -top-6 left-0 flex items-center gap-1 z-[60] select-none group-hover/node:opacity-100 opacity-0 transition-opacity"
                    style={{ opacity: isSelected ? 1 : undefined }}
                >
                    <div
                        className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-t cursor-grab active:cursor-grabbing flex items-center gap-1"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            // Select and let parent handle drag
                            select(nodeId, e.shiftKey);
                        }}
                    >
                        {isRenaming ? (
                            <input
                                type="text"
                                className="bg-blue-600 text-white text-[10px] px-1 outline-none border-none w-24"
                                value={node.name}
                                autoFocus
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                    useDocumentStore.getState().actions.updateNode(nodeId, { name: e.target.value });
                                }}
                                onBlur={() => setIsRenaming(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === 'Escape') {
                                        setIsRenaming(false);
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    setIsRenaming(true);
                                }}
                            >
                                {node.name}
                            </span>
                        )}
                        <div
                            className="p-0.5 hover:bg-blue-600 rounded cursor-pointer relative"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                        >
                            <MoreHorizontal size={10} />
                            {/* Context Menu */}
                            {showMenu && (
                                <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-xl text-zinc-300 w-32 flex flex-col z-[100] overflow-hidden">
                                    <button
                                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-700 text-xs text-left w-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const event = new CustomEvent('export-node', {
                                                detail: { nodeId: node.id, format: 'png', scale: 2 }
                                            });
                                            window.dispatchEvent(event);
                                            setShowMenu(false);
                                        }}
                                    >
                                        <Download size={10} /> Export
                                    </button>
                                    <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-700 text-xs text-left w-full">
                                        <Eye size={10} /> Preview
                                    </button>
                                    <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-700 text-xs text-left w-full">
                                        <FolderOpen size={10} /> Open Group
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SVG Rendering for Shapes */}
            {isShape && (
                <svg
                    width="100%"
                    height="100%"
                    style={{ overflow: 'visible', pointerEvents: 'none' }} // Ensure clicks pass through SVG to container
                    viewBox={`0 0 ${node.width} ${node.height}`}
                >
                    {node.type === 'RECT' && (
                        <rect
                            x={0}
                            y={0}
                            width={node.width}
                            height={node.height}
                            fill={node.style.fill || 'transparent'}
                            stroke={node.style.stroke || 'transparent'}
                            strokeWidth={node.style.strokeWidth || 0}
                        />
                    )}
                    {node.type === 'ELLIPSE' && (
                        <ellipse
                            cx={node.width / 2}
                            cy={node.height / 2}
                            rx={node.width / 2}
                            ry={node.height / 2}
                            fill={node.style.fill || 'transparent'}
                            stroke={node.style.stroke || 'transparent'}
                            strokeWidth={node.style.strokeWidth || 0}
                        />
                    )}
                </svg>
            )}

            {/* Text Rendering */}
            {node.type === 'TEXT' && (
                <span style={{
                    color: node.style.color || 'black',
                    fontSize: node.style.fontSize || 16,
                    fontFamily: node.style.fontFamily,
                    pointerEvents: 'none' // Ensure clicks pass through text to container
                }}>
                    {node.text}
                </span>
            )}

            {/* Icon Rendering - Temporarily using placeholder */}
            {false && (
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: node.style.fill || '#6366f1',
                    color: 'white',
                    fontSize: '12px',
                    pointerEvents: 'none'
                }}>
                    {node.iconName || 'Icon'}
                </div>
            )}

            {/* Image Rendering */}
            {node.type === 'IMAGE' && node.imageUrl && (
                <img
                    src={node.imageUrl}
                    alt={node.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none'
                    }}
                />
            )}

            {/* Children Rendering */}
            {node.children.map((childId) => (
                <NodeRenderer key={childId} nodeId={childId} />
            ))}
        </div>
    );
});

export const LayerRenderer: React.FC = () => {
    // Start from root
    const rootId = useDocumentStore(state => state.rootId);

    return <NodeRenderer nodeId={rootId} />;
};
