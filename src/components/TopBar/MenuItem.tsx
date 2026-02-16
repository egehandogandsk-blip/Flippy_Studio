import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface MenuItemProps {
    label: string;
    items: string[];
    isSpecial?: boolean;
    onSelect?: (item: string) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ label, items, isSpecial, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "px-3 py-1.5 rounded text-[13px] font-normal transition-colors flex items-center gap-1",
                    "text-white/70 hover:bg-[#2C2C2C] hover:text-white",
                    isSpecial && "font-semibold text-indigo-400"
                )}
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {label}
                <ChevronDown size={12} className="opacity-50" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg shadow-2xl py-1 z-[200]">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setIsOpen(false);
                                onSelect?.(item);
                            }}
                            className="w-full px-4 py-2 text-left text-[13px] text-white/80 hover:bg-[#2C2C2C] hover:text-white transition-colors"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
