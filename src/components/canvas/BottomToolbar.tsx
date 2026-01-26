import React, { useEffect, useRef } from 'react';
import { useToolStore } from '../../store/useToolStore';

interface ToolButtonProps {
    tool: string;
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    onClick: () => void;
    active?: boolean;
    hasDropdown?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
    icon,
    label,
    shortcut,
    onClick,
    active,
    hasDropdown
}) => {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center justify-center h-9 px-2 rounded transition-colors ${active
                ? 'bg-blue-600 text-white'
                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
            title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
        >
            {icon}
            {hasDropdown && (
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            )}
        </button>
    );
};

export const BottomToolbar: React.FC = () => {
    const { activeTool, setActiveTool, shapeMenuOpen, setShapeMenuOpen } = useToolStore();
    const shapeMenuRef = useRef<HTMLDivElement>(null);

    // Close shape menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shapeMenuRef.current && !shapeMenuRef.current.contains(event.target as Node)) {
                setShapeMenuOpen(false);
            }
        };

        if (shapeMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [shapeMenuOpen, setShapeMenuOpen]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case 'v':
                    setActiveTool('cursor');
                    break;
                case 'f':
                    setActiveTool('frame');
                    break;
                case 'r':
                    setActiveTool('rectangle');
                    break;
                case 'o':
                    setActiveTool('ellipse');
                    break;
                case 'l':
                    if (e.shiftKey) {
                        setActiveTool('arrow');
                    } else {
                        setActiveTool('line');
                    }
                    break;
                case 'p':
                    setActiveTool('pen');
                    break;
                case 't':
                    setActiveTool('text');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setActiveTool]);

    const shapeTools = [
        { tool: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: '▭' },
        { tool: 'line', label: 'Line', shortcut: 'L', icon: '/' },
        { tool: 'arrow', label: 'Arrow', shortcut: 'Shift+L', icon: '→' },
        { tool: 'ellipse', label: 'Ellipse', shortcut: 'O', icon: '○' },
        { tool: 'polygon', label: 'Polygon', shortcut: '', icon: '⬡' },
        { tool: 'star', label: 'Star', shortcut: '', icon: '★' },
    ];

    const isShapeTool = ['rectangle', 'line', 'arrow', 'ellipse', 'polygon', 'star'].includes(activeTool);

    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 px-2 py-1 flex items-center gap-1">
                {/* Cursor Tool */}
                <ToolButton
                    tool="cursor"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                    }
                    label="Move"
                    shortcut="V"
                    onClick={() => setActiveTool('cursor')}
                    active={activeTool === 'cursor'}
                />

                {/* Frame Tool */}
                <ToolButton
                    tool="frame"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                        </svg>
                    }
                    label="Frame"
                    shortcut="F"
                    onClick={() => setActiveTool('frame')}
                    active={activeTool === 'frame'}
                />

                {/* Shape Tool with Dropdown */}
                <div className="relative" ref={shapeMenuRef}>
                    <ToolButton
                        tool="shape"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                            </svg>
                        }
                        label="Shape"
                        onClick={() => setShapeMenuOpen(!shapeMenuOpen)}
                        active={isShapeTool}
                        hasDropdown
                    />

                    {/* Shape Dropdown Menu */}
                    {shapeMenuOpen && (
                        <div className="absolute bottom-full mb-2 left-0 w-48 bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 py-2 z-50">
                            {shapeTools.map((shape) => (
                                <button
                                    key={shape.tool}
                                    onClick={() => {
                                        setActiveTool(shape.tool as typeof activeTool);
                                        setShapeMenuOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between transition-colors ${activeTool === shape.tool
                                        ? 'bg-blue-600 text-white'
                                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{shape.icon}</span>
                                        <span>{shape.label}</span>
                                    </div>
                                    {shape.shortcut && (
                                        <span className="text-xs text-neutral-500">{shape.shortcut}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pen Tool */}
                <ToolButton
                    tool="pen"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    }
                    label="Pen"
                    shortcut="P"
                    onClick={() => setActiveTool('pen')}
                    active={activeTool === 'pen'}
                />

                {/* Text Tool */}
                <ToolButton
                    tool="text"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                    }
                    label="Text"
                    shortcut="T"
                    onClick={() => setActiveTool('text')}
                    active={activeTool === 'text'}
                />

                {/* Divider */}
                <div className="w-px h-6 bg-neutral-700 mx-1" />

                {/* Additional tools placeholder */}
                <div className="flex items-center gap-1 opacity-50">
                    <div className="w-8 h-8 rounded flex items-center justify-center text-neutral-500 text-xs">
                        ...
                    </div>
                </div>
            </div>
        </div>
    );
};
