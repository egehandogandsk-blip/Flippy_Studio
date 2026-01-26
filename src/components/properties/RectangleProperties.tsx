import React, { useEffect, useState } from 'react';
import { useCanvasObjectsStore } from '../../store/useCanvasObjectsStore';

export const RectangleProperties: React.FC = () => {
    const selectedObject = useCanvasObjectsStore((state) => state.selectedObject);
    const [props, setProps] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotation: 0,
        opacity: 100,
        cornerRadius: 0,
        fill: '#D9D9D9',
        stroke: '#000000',
        strokeWidth: 2,
    });

    useEffect(() => {
        if (selectedObject && selectedObject.type === 'rect') {
            setProps({
                x: Math.round(selectedObject.left || 0),
                y: Math.round(selectedObject.top || 0),
                width: Math.round(selectedObject.getScaledWidth()),
                height: Math.round(selectedObject.getScaledHeight()),
                rotation: Math.round(selectedObject.angle || 0),
                opacity: Math.round((selectedObject.opacity || 1) * 100),
                cornerRadius: (selectedObject as any).rx || 0,
                fill: (selectedObject.fill as string) || '#D9D9D9',
                stroke: (selectedObject.stroke as string) || '#000000',
                strokeWidth: selectedObject.strokeWidth || 2,
            });
        }
    }, [selectedObject]);

    const updateProperty = (key: string, value: any) => {
        if (!selectedObject) return;

        const updates: any = {};

        switch (key) {
            case 'x':
                updates.left = value;
                break;
            case 'y':
                updates.top = value;
                break;
            case 'width':
                updates.width = value / (selectedObject.scaleX || 1);
                break;
            case 'height':
                updates.height = value / (selectedObject.scaleY || 1);
                break;
            case 'rotation':
                updates.angle = value;
                break;
            case 'opacity':
                updates.opacity = value / 100;
                break;
            case 'cornerRadius':
                updates.rx = value;
                updates.ry = value;
                break;
            case 'fill':
            case 'stroke':
            case 'strokeWidth':
                updates[key] = value;
                break;
        }

        selectedObject.set(updates);
        selectedObject.canvas?.renderAll();
        setProps({ ...props, [key]: value });
    };

    if (!selectedObject || selectedObject.type !== 'rect') {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                <h3 className="font-semibold text-sm">Rectangle</h3>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-neutral-100 rounded" title="More options">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Position */}
            <div className="px-4">
                <h4 className="text-xs font-semibold text-neutral-600 mb-2">Position</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-neutral-500 mb-1 block">X</label>
                        <input
                            type="number"
                            value={props.x}
                            onChange={(e) => updateProperty('x', Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-neutral-500 mb-1 block">Y</label>
                        <input
                            type="number"
                            value={props.y}
                            onChange={(e) => updateProperty('y', Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>
                <div className="mt-2">
                    <label className="text-xs text-neutral-500 mb-1 block">Rotation</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={props.rotation}
                            onChange={(e) => updateProperty('rotation', Number(e.target.value))}
                            className="flex-1"
                        />
                        <input
                            type="number"
                            value={props.rotation}
                            onChange={(e) => updateProperty('rotation', Number(e.target.value))}
                            className="w-16 px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-xs text-neutral-500">°</span>
                    </div>
                </div>
            </div>

            {/* Layout - Dimensions */}
            <div className="px-4">
                <h4 className="text-xs font-semibold text-neutral-600 mb-2">Layout</h4>
                <p className="text-xs text-neutral-500 mb-2">Dimensions</p>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-neutral-500 mb-1 block">W</label>
                        <input
                            type="number"
                            value={props.width}
                            onChange={(e) => updateProperty('width', Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-neutral-500 mb-1 block">H</label>
                        <input
                            type="number"
                            value={props.height}
                            onChange={(e) => updateProperty('height', Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="px-4">
                <h4 className="text-xs font-semibold text-neutral-600 mb-2">Appearance</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-neutral-500 mb-1 block">Opacity</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={props.opacity}
                                onChange={(e) => updateProperty('opacity', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                            />
                            <span className="text-xs text-neutral-500">%</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-neutral-500 mb-1 block">Corner radius</label>
                        <input
                            type="number"
                            min="0"
                            value={props.cornerRadius}
                            onChange={(e) => updateProperty('cornerRadius', Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Fill */}
            <div className="px-4">
                <h4 className="text-xs font-semibold text-neutral-600 mb-2">Fill</h4>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={props.fill}
                        onChange={(e) => updateProperty('fill', e.target.value)}
                        className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                        type="text"
                        value={props.fill}
                        onChange={(e) => updateProperty('fill', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* Stroke */}
            <div className="px-4">
                <h4 className="text-xs font-semibold text-neutral-600 mb-2">Stroke</h4>
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="color"
                        value={props.stroke}
                        onChange={(e) => updateProperty('stroke', e.target.value)}
                        className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                        type="text"
                        value={props.stroke}
                        onChange={(e) => updateProperty('stroke', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="text-xs text-neutral-500 mb-1 block">Width</label>
                    <input
                        type="number"
                        min="0"
                        value={props.strokeWidth}
                        onChange={(e) => updateProperty('strokeWidth', Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
};
