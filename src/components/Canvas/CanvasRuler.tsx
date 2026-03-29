import React from 'react';

interface CanvasRulerProps {
    orientation: 'horizontal' | 'vertical';
    transform: { x: number; y: number; k: number };
    canvasSize: { width: number; height: number };
}

export const CanvasRuler: React.FC<CanvasRulerProps> = ({ orientation, transform, canvasSize }) => {
    const rulerSize = 20; // Height for horizontal, width for vertical
    const majorTickInterval = 100; // Major tick every 100px
    const minorTickInterval = 10; // Minor tick every 10px

    const isHorizontal = orientation === 'horizontal';
    const length = isHorizontal ? canvasSize.width : canvasSize.height;
    const offset = isHorizontal ? transform.x : transform.y;
    const zoom = transform.k;

    // Calculate visible range in canvas coordinates
    const startCanvas = -offset / zoom;
    const endCanvas = (length - offset) / zoom;

    // Generate tick marks
    const ticks: { position: number; label?: string; major: boolean }[] = [];

    const startTick = Math.floor(startCanvas / minorTickInterval) * minorTickInterval;
    const endTick = Math.ceil(endCanvas / minorTickInterval) * minorTickInterval;

    for (let i = startTick; i <= endTick; i += minorTickInterval) {
        const isMajor = i % majorTickInterval === 0;
        const screenPos = i * zoom + offset;

        if (screenPos >= 0 && screenPos <= length) {
            ticks.push({
                position: screenPos,
                label: isMajor ? i.toString() : undefined,
                major: isMajor
            });
        }
    }

    return (
        <div
            className="absolute select-none backdrop-blur-md bg-zinc-900/40 border-zinc-700/50 transition-colors"
            style={{
                [isHorizontal ? 'top' : 'left']: 0,
                [isHorizontal ? 'left' : 'top']: isHorizontal ? rulerSize : 0,
                [isHorizontal ? 'width' : 'height']: `calc(100% - ${rulerSize}px)`,
                [isHorizontal ? 'height' : 'width']: rulerSize,
                [isHorizontal ? 'borderBottom' : 'borderRight']: '1px solid rgba(82, 82, 91, 0.5)',
                zIndex: 100,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
        >
            {ticks.map((tick, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        [isHorizontal ? 'left' : 'top']: `${tick.position}px`,
                        [isHorizontal ? 'bottom' : 'right']: 0,
                        [isHorizontal ? 'width' : 'height']: '1px',
                        [isHorizontal ? 'height' : 'width']: tick.major ? '8px' : '4px',
                        backgroundColor: '#71717a'
                    }}
                >
                    {tick.label && (
                        <span
                            className="absolute text-[9px] text-zinc-400"
                            style={{
                                [isHorizontal ? 'left' : 'top']: isHorizontal ? '2px' : '2px',
                                [isHorizontal ? 'bottom' : 'right']: isHorizontal ? '10px' : '10px',
                                transform: isHorizontal ? 'none' : 'rotate(-90deg)',
                                transformOrigin: isHorizontal ? 'none' : 'right center',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tick.label}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};
