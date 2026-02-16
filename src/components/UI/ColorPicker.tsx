import React, { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import useClickOutside from '../../hooks/useClickOutside';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useClickOutside(popoverRef, () => setIsOpen(false));

    return (
        <div className="relative flex items-center gap-2">
            <div
                className="w-5 h-5 rounded border border-zinc-600 cursor-pointer shadow-sm"
                style={{ backgroundColor: color }}
                onClick={() => setIsOpen(true)}
            />

            {isOpen && (
                <div ref={popoverRef} className="absolute top-8 left-0 z-50 p-2 bg-zinc-800 border border-zinc-700 rounded shadow-xl">
                    <HexColorPicker color={color} onChange={onChange} />
                </div>
            )}

            <input
                type="text"
                className="bg-zinc-800 rounded p-1 w-20 text-xs text-zinc-300 border border-transparent focus:border-indigo-500 outline-none"
                value={color}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};
