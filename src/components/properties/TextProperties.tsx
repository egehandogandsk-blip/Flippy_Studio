import React, { useEffect, useState } from 'react';
import { useCanvasObjectsStore } from '../../store/useCanvasObjectsStore';
import { POPULAR_FONTS, loadGoogleFont } from '../../utils/googleFonts';

export const TextProperties: React.FC = () => {
    const selectedObject = useCanvasObjectsStore((state) => state.selectedObject);
    const [props, setProps] = useState({
        text: '',
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 'normal' as 'normal' | 'bold',
        fill: '#000000',
        textAlign: 'left' as 'left' | 'center' | 'right',
        underline: false,
        linethrough: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        opacity: 100,
    });

    useEffect(() => {
        if (selectedObject && selectedObject.type === 'i-text') {
            const textObj = selectedObject as any;
            setProps({
                text: textObj.text || '',
                fontFamily: textObj.fontFamily || 'Inter',
                fontSize: textObj.fontSize || 16,
                fontWeight: textObj.fontWeight || 'normal',
                fill: (textObj.fill as string) || '#000000',
                textAlign: textObj.textAlign || 'left',
                underline: textObj.underline || false,
                linethrough: textObj.linethrough || false,
                x: Math.round(textObj.left || 0),
                y: Math.round(textObj.top || 0),
                width: Math.round(textObj.width || 0),
                height: Math.round(textObj.height || 0),
                opacity: Math.round((textObj.opacity || 1) * 100),
            });
        }
    }, [selectedObject]);

    const updateProperty = (key: string, value: any) => {
        if (!selectedObject) return;

        const updates: any = {};

        switch (key) {
            case 'text':
                (selectedObject as any).set({ text: value });
                break;
            case 'fontFamily':
                loadGoogleFont(value);
                updates.fontFamily = value;
                break;
            case 'fontSize':
            case 'fontWeight':
            case 'fill':
            case 'textAlign':
            case 'underline':
            case 'linethrough':
                updates[key] = value;
                break;
            case 'x':
                updates.left = value;
                break;
            case 'y':
                updates.top = value;
                break;
            case 'opacity':
                updates.opacity = value / 100;
                break;
        }

        selectedObject.set(updates);
        selectedObject.canvas?.renderAll();
        setProps({ ...props, [key]: value });
    };

    if (!selectedObject || selectedObject.type !== 'i-text') {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                <h3 className="font-semibold text-sm">Text</h3>
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
            </div>

            {/* Typography */}
            <div className="px-4">
                <h4 className="text-xs font-semibold text-neutral-600 mb-2">Typography</h4>

                {/* Font Family */}
                <div className="mb-2">
                    <label className="text-xs text-neutral-500 mb-1 block">Font</label>
                    <select
                        value={props.fontFamily}
                        onChange={(e) => updateProperty('fontFamily', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                    >
                        {POPULAR_FONTS.map(font => (
                            <option key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                        <label className="text-xs text-neutral-500 mb-1 block">Size</label>
                        <input
                            type="number"
                            min="1"
                            value={props.fontSize}
                            onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-neutral-500 mb-1 block">Weight</label>
                        <select
                            value={props.fontWeight}
                            onChange={(e) => updateProperty('fontWeight', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:border-indigo-500"
                        >
                            <option value="normal">Regular</option>
                            <option value="bold">Bold</option>
                        </select>
                    </div>
                </div>

                {/* Text Align */}
                <div className="mb-2">
                    <label className="text-xs text-neutral-500 mb-1 block">Alignment</label>
                    <div className="flex gap-1">
                        <button
                            onClick={() => updateProperty('textAlign', 'left')}
                            className={`flex-1 px-2 py-1 text-xs border rounded ${props.textAlign === 'left'
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'border-neutral-300 hover:bg-neutral-50'
                                }`}
                        >
                            Left
                        </button>
                        <button
                            onClick={() => updateProperty('textAlign', 'center')}
                            className={`flex-1 px-2 py-1 text-xs border rounded ${props.textAlign === 'center'
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'border-neutral-300 hover:bg-neutral-50'
                                }`}
                        >
                            Center
                        </button>
                        <button
                            onClick={() => updateProperty('textAlign', 'right')}
                            className={`flex-1 px-2 py-1 text-xs border rounded ${props.textAlign === 'right'
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'border-neutral-300 hover:bg-neutral-50'
                                }`}
                        >
                            Right
                        </button>
                    </div>
                </div>

                {/* Text Decoration */}
                <div className="flex gap-2">
                    <label className="flex items-center gap-1 text-xs">
                        <input
                            type="checkbox"
                            checked={props.underline}
                            onChange={(e) => updateProperty('underline', e.target.checked)}
                            className="rounded"
                        />
                        Underline
                    </label>
                    <label className="flex items-center gap-1 text-xs">
                        <input
                            type="checkbox"
                            checked={props.linethrough}
                            onChange={(e) => updateProperty('linethrough', e.target.checked)}
                            className="rounded"
                        />
                        Strikethrough
                    </label>
                </div>
            </div>

            {/* Appearance */}
            <div className="px-4">
                <h4 className="text-xs font-semibold text-neutral-600 mb-2">Appearance</h4>
                <div className="mb-2">
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
        </div>
    );
};
