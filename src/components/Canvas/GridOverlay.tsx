import React from 'react';

interface GridOverlayProps {
    transform: { x: number; y: number; k: number };
    canvasSize: { width: number; height: number };
    visible?: boolean;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ transform, canvasSize, visible = true }) => {
    if (!visible) return null;

    const gridSize = 10; // Show grid lines every 10px for visibility
    const { x: offsetX, y: offsetY, k: zoom } = transform;

    // Calculate visible range in canvas coordinates - extend beyond viewport
    const startX = Math.floor((-offsetX - canvasSize.width) / zoom / gridSize) * gridSize;
    const endX = Math.ceil((canvasSize.width * 2 - offsetX) / zoom / gridSize) * gridSize;
    const startY = Math.floor((-offsetY - canvasSize.height) / zoom / gridSize) * gridSize;
    const endY = Math.ceil((canvasSize.height * 2 - offsetY) / zoom / gridSize) * gridSize;

    // Generate vertical lines
    const verticalLines: number[] = [];
    for (let x = startX; x <= endX; x += gridSize) {
        verticalLines.push(x);
    }

    // Generate horizontal lines
    const horizontalLines: number[] = [];
    for (let y = startY; y <= endY; y += gridSize) {
        horizontalLines.push(y);
    }

    return (
        <svg
            className="absolute inset-0 pointer-events-none"
            style={{
                zIndex: 0, // Below everything
                opacity: 0.15,
                width: '100%',
                height: '100%'
            }}
        >
            <g transform={`translate(${offsetX}, ${offsetY}) scale(${zoom})`}>
                {/* Vertical grid lines */}
                {verticalLines.map((x) => (
                    <line
                        key={`v-${x}`}
                        x1={x}
                        y1={startY}
                        x2={x}
                        y2={endY}
                        stroke={x % 100 === 0 ? '#6366f1' : '#3f3f46'}
                        strokeWidth={x % 100 === 0 ? 1 / zoom : 0.5 / zoom}
                    />
                ))}

                {/* Horizontal grid lines */}
                {horizontalLines.map((y) => (
                    <line
                        key={`h-${y}`}
                        x1={startX}
                        y1={y}
                        x2={endX}
                        y2={y}
                        stroke={y % 100 === 0 ? '#6366f1' : '#3f3f46'}
                        strokeWidth={y % 100 === 0 ? 1 / zoom : 0.5 / zoom}
                    />
                ))}
            </g>
        </svg>
    );
};
