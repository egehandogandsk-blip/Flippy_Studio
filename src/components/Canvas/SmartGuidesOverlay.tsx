import React from 'react';
import { AlignmentGuide, DistanceMeasurement } from '../../utils/SmartGuides';

interface SmartGuidesOverlayProps {
    guides: AlignmentGuide[];
    measurements: DistanceMeasurement[];
    zoom: number;
}

export const SmartGuidesOverlay: React.FC<SmartGuidesOverlayProps> = React.memo(({ guides, measurements, zoom }) => {
    const strokeWidth = 1 / zoom;
    const fontSize = 11 / zoom;

    return (
        <g>
            {/* Alignment guide lines */}
            {guides.map((guide, index) => (
                <line
                    key={`guide-${index}`}
                    x1={guide.type === 'vertical' ? guide.position : guide.start}
                    y1={guide.type === 'vertical' ? guide.start : guide.position}
                    x2={guide.type === 'vertical' ? guide.position : guide.end}
                    y2={guide.type === 'vertical' ? guide.end : guide.position}
                    stroke="#f43f5e"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${4 / zoom} ${4 / zoom}`}
                    opacity={0.8}
                    pointerEvents="none"
                />
            ))}

            {/* Distance measurements */}
            {measurements.map((measurement, index) => {
                const midX = (measurement.from.x + measurement.to.x) / 2;
                const midY = (measurement.from.y + measurement.to.y) / 2;
                const arrowSize = 4 / zoom;

                return (
                    <g key={`measurement-${index}`}>
                        {/* Measurement line */}
                        <line
                            x1={measurement.from.x}
                            y1={measurement.from.y}
                            x2={measurement.to.x}
                            y2={measurement.to.y}
                            stroke="#f43f5e"
                            strokeWidth={strokeWidth}
                            opacity={0.8}
                            pointerEvents="none"
                        />

                        {/* Start T-bar */}
                        <line
                            x1={measurement.type === 'horizontal' ? measurement.from.x : measurement.from.x - arrowSize}
                            y1={measurement.type === 'horizontal' ? measurement.from.y - arrowSize : measurement.from.y}
                            x2={measurement.type === 'horizontal' ? measurement.from.x : measurement.from.x + arrowSize}
                            y2={measurement.type === 'horizontal' ? measurement.from.y + arrowSize : measurement.from.y}
                            stroke="#f43f5e"
                            strokeWidth={strokeWidth}
                            pointerEvents="none"
                        />

                        {/* End T-bar */}
                        <line
                            x1={measurement.type === 'horizontal' ? measurement.to.x : measurement.to.x - arrowSize}
                            y1={measurement.type === 'horizontal' ? measurement.to.y - arrowSize : measurement.to.y}
                            x2={measurement.type === 'horizontal' ? measurement.to.x : measurement.to.x + arrowSize}
                            y2={measurement.type === 'horizontal' ? measurement.to.y + arrowSize : measurement.to.y}
                            stroke="#f43f5e"
                            strokeWidth={strokeWidth}
                            pointerEvents="none"
                        />

                        {/* Distance Label */}
                        <g transform={`translate(${midX}, ${midY})`}>
                            <rect
                                x={-16 / zoom}
                                y={-8 / zoom}
                                width={32 / zoom}
                                height={16 / zoom}
                                rx={4 / zoom}
                                fill="#f43f5e"
                            />
                            <text
                                x={0}
                                y={3 / zoom}
                                textAnchor="middle"
                                fill="white"
                                fontSize={fontSize}
                                fontWeight="bold"
                                style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                                {Math.round(measurement.distance)}
                            </text>
                        </g>
                    </g>
                );
            })}
        </g >
    );
});
