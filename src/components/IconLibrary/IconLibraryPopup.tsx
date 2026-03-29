import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { searchIcons, IconMetadata } from './iconRegistry';

export const IconLibraryPopup: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { showIconLibrary, toggleIconLibrary, theme } = useUiStore();

    const filteredIcons = useMemo(() => searchIcons(searchQuery), [searchQuery]);

    if (!showIconLibrary) return null;

    const handleDragStart = (e: React.DragEvent, icon: IconMetadata) => {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('application/icon', JSON.stringify({
            iconName: icon.name,
            displayName: icon.displayName
        }));

        // Delay closing the popup to allow drag event to complete
        setTimeout(() => {
            toggleIconLibrary();
        }, 100);
    };

    const IconComponent = ({ iconName }: { iconName: string }) => {
        const Icon = (LucideIcons as any)[iconName];
        if (!Icon) return null;
        return <Icon size={24} />;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={toggleIconLibrary}
        >
            <div
                className={`relative w-[800px] max-h-[600px] rounded-lg shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-900'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
                    }`}>
                    <h2 className="text-xl font-semibold">Icon Library</h2>
                    <button
                        onClick={toggleIconLibrary}
                        className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                            ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100'
                            : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                            }`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search icons... (e.g., heart, arrow, user)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${theme === 'dark'
                            ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500'
                            : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500'
                            }`}
                        autoFocus
                    />
                    <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {filteredIcons.length} icons found • Drag and drop to canvas
                    </p>
                </div>

                {/* Icon Grid */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <div className="grid grid-cols-8 gap-2">
                        {filteredIcons.map((icon) => (
                            <div
                                key={icon.name}
                                draggable
                                onDragStart={(e) => handleDragStart(e, icon)}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all ${theme === 'dark'
                                    ? 'hover:bg-zinc-800 hover:shadow-lg hover:scale-105'
                                    : 'hover:bg-zinc-100 hover:shadow-lg hover:scale-105'
                                    }`}
                                title={icon.displayName}
                            >
                                <div className={`mb-1 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                                    }`}>
                                    <IconComponent iconName={icon.name} />
                                </div>
                                <span className={`text-[10px] text-center truncate w-full ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'
                                    }`}>
                                    {icon.displayName}
                                </span>
                            </div>
                        ))}
                    </div>

                    {filteredIcons.length === 0 && (
                        <div className={`text-center py-12 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                            }`}>
                            <p className="text-lg">No icons found</p>
                            <p className="text-sm mt-2">Try a different search term</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
