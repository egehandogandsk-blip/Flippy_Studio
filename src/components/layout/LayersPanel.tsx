import React from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';

interface LayerItem {
    id: string;
    name: string;
    type: string;
    visible: boolean;
    locked: boolean;
}

interface LayersPanelProps {
    layers: LayerItem[];
    selectedLayerId: string | null;
    onLayerSelect: (id: string) => void;
    onToggleVisibility: (id: string) => void;
    onToggleLock: (id: string) => void;
    onDeleteLayer: (id: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
    layers,
    selectedLayerId,
    onLayerSelect,
    onToggleVisibility,
    onToggleLock,
    onDeleteLayer,
}) => {
    return (
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col z-10 shrink-0">
            <div className="h-10 border-b border-neutral-200 flex items-center px-4 font-semibold text-sm text-neutral-600">
                Layers
            </div>
            <div className="flex-1 overflow-y-auto py-2">
                {layers.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-neutral-400">
                        No layers yet
                    </div>
                ) : (
                    layers.map((layer) => (
                        <div
                            key={layer.id}
                            onClick={() => onLayerSelect(layer.id)}
                            className={`px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors ${selectedLayerId === layer.id
                                    ? 'bg-indigo-50 border-l-2 border-indigo-600'
                                    : 'hover:bg-neutral-50'
                                }`}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleVisibility(layer.id);
                                }}
                                className="p-1 hover:bg-neutral-200 rounded"
                            >
                                {layer.visible ? (
                                    <Eye className="w-4 h-4 text-neutral-600" />
                                ) : (
                                    <EyeOff className="w-4 h-4 text-neutral-400" />
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-neutral-900 truncate">
                                    {layer.name}
                                </div>
                                <div className="text-xs text-neutral-500">{layer.type}</div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleLock(layer.id);
                                }}
                                className="p-1 hover:bg-neutral-200 rounded"
                            >
                                {layer.locked ? (
                                    <Lock className="w-4 h-4 text-neutral-600" />
                                ) : (
                                    <Unlock className="w-4 h-4 text-neutral-400" />
                                )}
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteLayer(layer.id);
                                }}
                                className="p-1 hover:bg-red-100 rounded"
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
};
