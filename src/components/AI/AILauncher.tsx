import React from 'react';
import { Brain, Palette, Sparkles, FolderOpen } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';

export const AILauncher: React.FC = () => {
    const setViewMode = useAIStore((state) => state.setViewMode);

    return (
        <div className="flex flex-col items-center justify-center p-10 space-y-8 h-full">
            <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                AI Studio
            </h2>

            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                {/* Train Models Button */}
                <button
                    onClick={() => setViewMode('train')}
                    className="group relative flex flex-col items-center justify-center p-8 bg-[#1a1a1a] hover:bg-[#222] border border-purple-500/20 hover:border-purple-500/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-900/20"
                >
                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                        <Brain size={32} className="text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Train Models
                    </h3>
                    <p className="text-sm text-gray-400 text-center max-w-[200px]">
                        Teach AI your own style by uploading reference images.
                    </p>
                </button>

                {/* Make with Gen AI Button */}
                <button
                    onClick={() => setViewMode('generate')}
                    className="group relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#1a1a1a] to-[#161616] hover:from-[#222] hover:to-[#1a1a1a] border border-indigo-500/20 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-900/20"
                >
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                        <Sparkles size={32} className="text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Make with Gen AI
                    </h3>
                    <p className="text-sm text-gray-400 text-center max-w-[200px]">
                        Generate high-quality assets using Stable Diffusion.
                    </p>
                </button>
            </div>
        </div>
    );
};
