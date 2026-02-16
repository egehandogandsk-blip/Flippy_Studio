import React, { useState, useRef } from 'react';
import { useUiStore } from '../../store/uiStore';
import { MousePointer2, Hand, Square, Circle, Type, Layout } from 'lucide-react';
import { clsx } from 'clsx';

const tools = [
    { id: 'select' as const, icon: MousePointer2, label: 'Select (V)' },
    { id: 'move' as const, icon: Hand, label: 'Pan (Space)' },
    { id: 'rectangle' as const, icon: Square, label: 'Rectangle (R)' },
    { id: 'ellipse' as const, icon: Circle, label: 'Circle (C)' },
    { id: 'text' as const, icon: Type, label: 'Text (T)' },
    { id: 'artboard' as const, icon: Layout, label: 'Frame (F)' },
];

export const FloatingToolbar: React.FC = () => {
    const { activeTool, setActiveTool } = useUiStore();
    const [position, setPosition] = useState(() => {
        const saved = localStorage.getItem('floatingToolbarPosition');
        return saved ? JSON.parse(saved) : { x: window.innerWidth / 2 - 150, y: 20 };
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const toolbarRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === toolbarRef.current || (e.target as HTMLElement).closest('.toolbar-handle')) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newPos = {
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            };
            setPosition(newPos);
            localStorage.setItem('floatingToolbarPosition', JSON.stringify(newPos));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragOffset]);

    return (
        <div
            ref={toolbarRef}
            className={clsx(
                "fixed bg-[#2C2C2C] border border-[#3C3C3C] rounded-xl shadow-lg p-2 flex items-center gap-1 z-[200] hover:shadow-xl transition-shadow",
                "flex items-center gap-1 p-2",
                isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="toolbar-handle flex items-center gap-1 px-1 cursor-grab">
                <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
            </div>

            <div className="w-px h-6 bg-zinc-700 mx-1"></div>

            {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                    <button
                        key={tool.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveTool(tool.id);
                        }}
                        className={clsx(
                            "p-2 rounded transition-colors",
                            activeTool === tool.id
                                ? "bg-indigo-600 text-white"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-700"
                        )}
                        title={tool.label}
                    >
                        <Icon size={18} />
                    </button>
                );
            })}
        </div>
    );
};
