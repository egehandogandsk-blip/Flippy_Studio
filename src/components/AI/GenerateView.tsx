import React from 'react';
import { Upload, Sparkles, Loader2 } from 'lucide-react';
import { ImageGallery } from './ImageGallery';


interface GenerateViewProps {
    currentPrompt: string;
    currentNegativePrompt: string;
    currentReferenceImage: string | null;
    selectedStyleId: string | null;
    trainedStyles: any[];
    sdAvailable: boolean;
    isGenerating: boolean;
    setPrompt: (prompt: string) => void;
    setNegativePrompt: (prompt: string) => void;
    setSelectedStyleId: (id: string | null) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleForge: () => void;
    setViewMode: (mode: 'launcher' | 'train' | 'generate') => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const GenerateView: React.FC<GenerateViewProps> = ({
    currentPrompt,
    currentNegativePrompt,
    currentReferenceImage,
    selectedStyleId,
    trainedStyles,
    sdAvailable,
    isGenerating,
    setPrompt,
    setNegativePrompt,
    setSelectedStyleId,
    handleFileUpload,
    handleForge,
    setViewMode,
    fileInputRef
}) => {
    return (
        <div className="h-full flex flex-col p-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6 flex-1">
                {/* LEFT: Form Controls */}
                <div className="space-y-4">
                    {/* Style Selector */}
                    {trainedStyles.length > 0 && (
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Style
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedStyleId(null)}
                                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${!selectedStyleId
                                        ? 'bg-purple-600 border-purple-500 text-white'
                                        : 'bg-[#2C2C2C] border-purple-500/20 text-white/70 hover:border-purple-500/40'
                                        }`}
                                >
                                    Default
                                </button>
                                {trainedStyles.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => setSelectedStyleId(style.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-all ${selectedStyleId === style.id
                                            ? 'bg-purple-600 border-purple-500 text-white'
                                            : 'bg-[#2C2C2C] border-purple-500/20 text-white/70 hover:border-purple-500/40'
                                            }`}
                                    >
                                        <img src={style.thumbnail} alt={style.name} className="w-4 h-4 rounded object-cover" />
                                        <span>{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prompt Input */}
                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Prompt
                        </label>
                        <textarea
                            value={currentPrompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Futuristic sci-fi character, cyberpunk style..."
                            className="w-full h-20 px-3 py-2 bg-[#2C2C2C] border border-purple-500/20 rounded-lg text-white text-xs placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none resize-none"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                    </div>

                    {/* Reference Image - Compact */}
                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Reference (Optional)
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-full h-20 border-2 border-dashed border-purple-500/30 rounded-lg bg-[#2C2C2C] hover:border-purple-500/50 transition-colors cursor-pointer flex items-center justify-center overflow-hidden"
                        >
                            {currentReferenceImage ? (
                                <img src={currentReferenceImage} alt="Reference" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-white/30">
                                    <Upload size={16} />
                                    <span className="text-xs">Upload image</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Negative Prompt */}
                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Negative Prompt
                        </label>
                        <input
                            value={currentNegativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="blurry, low quality, bad anatomy..."
                            className="w-full px-3 py-2 bg-[#2C2C2C] border border-purple-500/20 rounded-lg text-white text-xs placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                    </div>

                    {/* Connection Status & Forge Button */}
                    <div className="space-y-2">
                        <div className="text-xs text-gray-500 px-1">
                            {sdAvailable ? (
                                <span className="text-green-400">● Local SD</span>
                            ) : (
                                <span className="text-yellow-400">○ Cloud API</span>
                            )}
                        </div>
                        <button
                            onClick={handleForge}
                            disabled={!currentPrompt.trim() || isGenerating}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span className="text-sm">Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    <span className="text-sm">Forge</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={() => setViewMode('launcher')}
                        className="w-full py-2 text-white/50 hover:text-white text-xs transition-colors"
                    >
                        ← Back to Launcher
                    </button>
                </div>

                {/* RIGHT: Image Gallery */}
                <div className="bg-[#1a1a1a] rounded-lg border border-purple-500/10 p-4 overflow-y-auto">
                    <h3 className="text-xs font-semibold text-white/70 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Generated Images
                    </h3>
                    <ImageGallery />
                </div>
            </div>
        </div>
    );
};
