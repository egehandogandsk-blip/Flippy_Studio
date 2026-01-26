import React, { useState, useCallback } from 'react';
import { PropertiesPanel } from './PropertiesPanel';
import { FabricCanvas } from '../canvas/FabricCanvas';
import { BottomToolbar } from '../canvas/BottomToolbar';
import { Undo, Redo, Download, FileImage, FileCode } from 'lucide-react';
import { useHistoryStore } from '../../store/useHistoryStore';
import { LayersPanel } from './LayersPanel';

export const MainLayout: React.FC = () => {
    const { past, future, undo, redo } = useHistoryStore();
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [layers] = useState<any[]>([]);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const showLayers = false; // Layers panel hidden by default

    const canvasRef = React.useRef<any>(null);

    const handleUndo = useCallback(() => {
        const state = undo();
        if (state && canvasRef.current) {
            canvasRef.current.loadFromJSON(state);
        }
    }, [undo]);

    const handleRedo = useCallback(() => {
        const state = redo();
        if (state && canvasRef.current) {
            canvasRef.current.loadFromJSON(state);
        }
    }, [redo]);

    const handleExportPNG = () => {
        if (!canvasRef.current) return;
        const dataURL = canvasRef.current.toDataURL({ format: 'png', quality: 1 });
        const link = document.createElement('a');
        link.download = 'canvas-export.png';
        link.href = dataURL;
        link.click();
    };

    const handleExportSVG = () => {
        if (!canvasRef.current) return;
        const svg = canvasRef.current.toSVG();
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'canvas-export.svg';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExportJSON = () => {
        if (!canvasRef.current) return;
        const json = JSON.stringify(canvasRef.current.toJSON());
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'canvas-export.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="h-12 bg-white border-b border-neutral-200 flex items-center justify-between px-4 z-20">
                <div className="font-semibold text-lg">Studio Forge</div>

                <div className="flex items-center gap-2">
                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1 mr-4">
                        <button
                            onClick={handleUndo}
                            disabled={past.length === 0}
                            className={`p-2 rounded transition-colors ${past.length > 0
                                ? 'hover:bg-neutral-100 text-neutral-700'
                                : 'text-neutral-300 cursor-not-allowed'
                                }`}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={future.length === 0}
                            className={`p-2 rounded transition-colors ${future.length > 0
                                ? 'hover:bg-neutral-100 text-neutral-700'
                                : 'text-neutral-300 cursor-not-allowed'
                                }`}
                            title="Redo (Ctrl+Shift+Z)"
                        >
                            <Redo className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Export Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="px-3 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700 text-white rounded flex items-center gap-2 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>

                        {showExportMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 py-2 z-50">
                                <button
                                    onClick={() => {
                                        handleExportPNG();
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-3"
                                >
                                    <FileImage className="w-4 h-4" />
                                    Export as PNG
                                </button>
                                <button
                                    onClick={() => {
                                        handleExportSVG();
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-3"
                                >
                                    <FileCode className="w-4 h-4" />
                                    Export as SVG
                                </button>
                                <button
                                    onClick={() => {
                                        handleExportJSON();
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-3"
                                >
                                    <FileCode className="w-4 h-4" />
                                    Export as JSON
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Layers (Hidden by default) */}
                {showLayers && (
                    <LayersPanel
                        layers={layers}
                        selectedLayerId={selectedLayerId}
                        onLayerSelect={setSelectedLayerId}
                        onToggleVisibility={(id) => console.log('Toggle visibility', id)}
                        onToggleLock={(id) => console.log('Toggle lock', id)}
                        onDeleteLayer={(id) => console.log('Delete layer', id)}
                    />
                )}

                {/* Canvas */}
                <div className="flex-1 relative">
                    <FabricCanvas />
                    <BottomToolbar />
                </div>

                {/* Right Sidebar - Properties */}
                <PropertiesPanel />
            </div>
        </div>
    );
};
