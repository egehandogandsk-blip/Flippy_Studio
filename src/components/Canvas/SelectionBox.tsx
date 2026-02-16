import React from 'react';
import { useDocumentStore } from '../../store/documentStore';

interface SelectionBoxProps {
    nodeId: string;
    zoom: number;
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const SelectionBox: React.FC<SelectionBoxProps> = ({ nodeId, zoom }) => {
    const node = useDocumentStore((state) => state.nodes[nodeId]);
    const updateNode = useDocumentStore((state) => state.actions.updateNode);

    if (!node) return null;

    const handleSize = 6 / zoom; // Handle size in canvas units
    const borderWidth = 1 / zoom;

    const handles: { position: ResizeHandle; cursor: string; x: number; y: number }[] = [
        { position: 'nw', cursor: 'nw-resize', x: 0, y: 0 },
        { position: 'n', cursor: 'n-resize', x: node.width / 2, y: 0 },
        { position: 'ne', cursor: 'ne-resize', x: node.width, y: 0 },
        { position: 'e', cursor: 'e-resize', x: node.width, y: node.height / 2 },
        { position: 'se', cursor: 'se-resize', x: node.width, y: node.height },
        { position: 's', cursor: 's-resize', x: node.width / 2, y: node.height },
        { position: 'sw', cursor: 'sw-resize', x: 0, y: node.height },
        { position: 'w', cursor: 'w-resize', x: 0, y: node.height / 2 },
    ];

    const handleMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
        e.stopPropagation();
        const initialBounds = { x: node.x, y: node.y, width: node.width, height: node.height };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = (moveEvent.clientX - e.clientX) / zoom;
            const dy = (moveEvent.clientY - e.clientY) / zoom;
            const shift = moveEvent.shiftKey;

            let newX = node.x;
            let newY = node.y;
            let newWidth = node.width;
            let newHeight = node.height;

            const aspectRatio = initialBounds.width / initialBounds.height;

            // Calculate new dimensions based on handle
            switch (handle) {
                case 'nw':
                    newX = initialBounds.x + dx;
                    newY = initialBounds.y + dy;
                    newWidth = initialBounds.width - dx;
                    newHeight = initialBounds.height - dy;
                    if (shift) {
                        const avgDelta = (dx + dy) / 2;
                        newWidth = initialBounds.width - avgDelta;
                        newHeight = newWidth / aspectRatio;
                        newX = initialBounds.x + avgDelta;
                        newY = initialBounds.y + (initialBounds.height - newHeight);
                    }
                    break;
                case 'n':
                    newY = initialBounds.y + dy;
                    newHeight = initialBounds.height - dy;
                    if (shift) {
                        newWidth = newHeight * aspectRatio;
                        newX = initialBounds.x - (newWidth - initialBounds.width) / 2;
                    }
                    break;
                case 'ne':
                    newY = initialBounds.y + dy;
                    newWidth = initialBounds.width + dx;
                    newHeight = initialBounds.height - dy;
                    if (shift) {
                        const avgDelta = (dx - dy) / 2;
                        newWidth = initialBounds.width + avgDelta;
                        newHeight = newWidth / aspectRatio;
                        newY = initialBounds.y + (initialBounds.height - newHeight);
                    }
                    break;
                case 'e':
                    newWidth = initialBounds.width + dx;
                    if (shift) {
                        newHeight = newWidth / aspectRatio;
                        newY = initialBounds.y - (newHeight - initialBounds.height) / 2;
                    }
                    break;
                case 'se':
                    newWidth = initialBounds.width + dx;
                    newHeight = initialBounds.height + dy;
                    if (shift) {
                        const avgDelta = (dx + dy) / 2;
                        newWidth = initialBounds.width + avgDelta;
                        newHeight = newWidth / aspectRatio;
                    }
                    break;
                case 's':
                    newHeight = initialBounds.height + dy;
                    if (shift) {
                        newWidth = newHeight * aspectRatio;
                        newX = initialBounds.x - (newWidth - initialBounds.width) / 2;
                    }
                    break;
                case 'sw':
                    newX = initialBounds.x + dx;
                    newWidth = initialBounds.width - dx;
                    newHeight = initialBounds.height + dy;
                    if (shift) {
                        const avgDelta = (-dx + dy) / 2;
                        newWidth = initialBounds.width + avgDelta;
                        newHeight = newWidth / aspectRatio;
                        newX = initialBounds.x - avgDelta;
                    }
                    break;
                case 'w':
                    newX = initialBounds.x + dx;
                    newWidth = initialBounds.width - dx;
                    if (shift) {
                        newHeight = newWidth / aspectRatio;
                        newY = initialBounds.y - (newHeight - initialBounds.height) / 2;
                    }
                    break;
            }

            // Enforce minimum size and adjust position if needed
            if (newWidth < 10) {
                if (handle.includes('w')) {
                    newX = initialBounds.x + initialBounds.width - 10;
                }
                newWidth = 10;
            }
            if (newHeight < 10) {
                if (handle.includes('n')) {
                    newY = initialBounds.y + initialBounds.height - 10;
                }
                newHeight = 10;
            }

            updateNode(nodeId, { x: newX, y: newY, width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const dimensionFontSize = 10 / zoom;
    const dimensionText = `${Math.round(node.width)} × ${Math.round(node.height)}`;

    return (
        <g>
            {/* Selection border */}
            <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={borderWidth}
                pointerEvents="none"
            />

            {/* Dimension display boxes at corners */}
            <g opacity="0.9">
                {/* Top-left dimension box */}
                <rect
                    x={node.x - 1 / zoom}
                    y={node.y - (20 / zoom) - (2 / zoom)}
                    width={60 / zoom}
                    height={18 / zoom}
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth={borderWidth}
                    rx={2 / zoom}
                    pointerEvents="none"
                />
                <text
                    x={node.x + (30 / zoom) - 1 / zoom}
                    y={node.y - (6 / zoom) - (2 / zoom)}
                    fontSize={dimensionFontSize}
                    fill="#3b82f6"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                    style={{ userSelect: 'none', fontFamily: 'system-ui, sans-serif', fontWeight: 500 }}
                >
                    {dimensionText}
                </text>
            </g>

            {/* Resize handles */}
            {handles.map((handle) => (
                <rect
                    key={handle.position}
                    x={node.x + handle.x - handleSize / 2}
                    y={node.y + handle.y - handleSize / 2}
                    width={handleSize}
                    height={handleSize}
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth={borderWidth}
                    style={{ cursor: handle.cursor }}
                    onMouseDown={(e) => handleMouseDown(e, handle.position)}
                />
            ))}
        </g>
    );
};
