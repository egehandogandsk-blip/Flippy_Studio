import React from 'react';
import { useUiStore, ToolType } from '../store/uiStore';
import {
    MousePointer2,
    Hand,
    Square,
    Circle,
    Type,
    Layout,
    Menu,
    Moon,
    Sun
} from 'lucide-react';
import { clsx } from 'clsx';

const Tools: { id: ToolType; icon: React.FC<any>; label: string }[] = [
    { id: 'select', icon: MousePointer2, label: 'Select (V)' },
    { id: 'move', icon: Hand, label: 'Hand (H)' },
    { id: 'rectangle', icon: Square, label: 'Rectangle (R)' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse (O)' },
    { id: 'text', icon: Type, label: 'Text (T)' },
    { id: 'artboard', icon: Layout, label: 'Frame (F)' },
];

const Header: React.FC = () => {
    const { activeTool, setActiveTool, theme, toggleTheme } = useUiStore();

    return (
        <header className="h-12 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 select-none shrink-0 z-50 transition-colors duration-200">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                    <Menu size={20} className="text-zinc-500 dark:text-zinc-400" />
                    <span>Flippy</span>
                </div>

                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

                <div className="flex items-center gap-1">
                    {Tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => setActiveTool(tool.id)}
                            className={clsx(
                                "p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative group",
                                activeTool === tool.id ? "bg-indigo-600 text-white" : "text-zinc-500 dark:text-zinc-400"
                            )}
                            title={tool.label}
                        >
                            <tool.icon size={18} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-500">Draft / Page 1</span>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
                    Share
                </button>
            </div>
        </header>
    );
};

export default Header;
