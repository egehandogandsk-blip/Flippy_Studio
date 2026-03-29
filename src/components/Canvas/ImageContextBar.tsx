import React, { useState } from 'react';
import { Download, Eraser, Library, Loader2, X, Check } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useAIStore } from '../../store/aiStore';
import * as htmlToImage from 'html-to-image';

interface ImageContextBarProps {
    nodeId: string;
    zoom: number;
}

export const ImageContextBar: React.FC<ImageContextBarProps> = ({ nodeId, zoom }) => {
    const node = useDocumentStore((state) => state.nodes[nodeId]);
    const { trainingFolders, addImageToFolder } = useAIStore();

    const [isRemovingBg, setIsRemovingBg] = useState(false);
    const [showFolderSelect, setShowFolderSelect] = useState(false);
    const [showSuccess, setShowSuccess] = useState<string | null>(null);

    if (!node || node.type !== 'IMAGE') return null;

    const handleExport = async () => {
        try {
            const dataUrl = node.imageUrl;
            if (!dataUrl) return;

            const link = document.createElement('a');
            link.download = `image-${node.name || 'export'}.png`;
            link.href = dataUrl;
            link.click();

            showTempSuccess('Exported!');
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const handleRemoveBg = async () => {
        setIsRemovingBg(true);
        try {
            const response = await fetch('/api/ai/remove-bg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: node.imageUrl })
            });

            if (!response.ok) throw new Error('Failed to remove background');

            const data = await response.json();

            // Update the node with the new image
            useDocumentStore.getState().actions.updateNode(nodeId, { imageUrl: data.imageUrl });

            showTempSuccess('BG Removed!');
        } catch (error) {
            console.error('BG Removal failed:', error);
            showTempSuccess('Failed!');
        } finally {
            setIsRemovingBg(false);
        }
    };

    const handleAddToStyle = (folderId: string) => {
        if (!node.imageUrl) return;

        addImageToFolder(folderId, node.imageUrl);
        setShowFolderSelect(false);
        showTempSuccess('Added to Style!');
    };

    const showTempSuccess = (msg: string) => {
        setShowSuccess(msg);
        setTimeout(() => setShowSuccess(null), 2000);
    };

    return (
        <div
            className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            style={{
                top: (node.height * zoom) + 20, // Position below the image
                width: 'max-content',
                pointerEvents: 'auto' // Re-enable pointer events since parent might have them disabled
            }}
        >
            {/* Main Bar */}
            <div className="flex items-center gap-1 p-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">

                {/* Export Button */}
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                    title="Export as PNG"
                >
                    <Download size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Export</span>
                </button>

                <div className="w-px h-4 bg-white/10 mx-1" />

                {/* Remove BG Button */}
                <button
                    onClick={handleRemoveBg}
                    disabled={isRemovingBg}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                    title="Remove Background"
                >
                    {isRemovingBg ? (
                        <Loader2 size={16} className="animate-spin text-purple-400" />
                    ) : (
                        <Eraser size={16} className="group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-xs font-medium">Remove BG</span>
                </button>

                <div className="w-px h-4 bg-white/10 mx-1" />

                {/* Add to Style Guide Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowFolderSelect(!showFolderSelect)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all group ${showFolderSelect ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/80 hover:text-white hover:bg-white/10'
                            }`}
                        title="Add to AI Training Folder"
                    >
                        <Library size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">Add to Style</span>
                    </button>

                    {/* Folder Selection Popup */}
                    {showFolderSelect && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-[#1a1a1a] border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in zoom-in-95 duration-100">
                            <div className="px-3 py-2 border-b border-zinc-700 bg-zinc-900/50 flex justify-between items-center">
                                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Select Folder</span>
                                <button onClick={() => setShowFolderSelect(false)} className="text-zinc-500 hover:text-white">
                                    <X size={12} />
                                </button>
                            </div>
                            <div className="max-h-48 overflow-y-auto p-1">
                                {trainingFolders.length === 0 ? (
                                    <div className="px-3 py-4 text-center text-xs text-zinc-500">
                                        No folders found. Create one in "Train Model" view.
                                    </div>
                                ) : (
                                    trainingFolders.map(folder => (
                                        <button
                                            key={folder.id}
                                            onClick={() => handleAddToStyle(folder.id)}
                                            className="w-full flex items-center justify-between px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                                        >
                                            <span className="truncate">{folder.name}</span>
                                            {folder.images.length >= 10 && (
                                                <span className="text-[9px] text-red-400 ml-2">Full</span>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="absolute top-full mt-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-medium rounded-full flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <Check size={12} />
                    {showSuccess}
                </div>
            )}
        </div>
    );
};
