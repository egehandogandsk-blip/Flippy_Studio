import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';

export const MakeWithAIButton: React.FC = () => {
    const openModal = useAIStore((state) => state.openModal);

    return (
        <button
            onClick={() => openModal('launcher')}
            className="relative px-4 py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[13px] font-medium transition-all hover:from-purple-700 hover:to-indigo-700 flex items-center gap-2 overflow-hidden group"
            style={{ fontFamily: 'Inter, sans-serif' }}
        >
            {/* Purple glow effect */}
            <div className="absolute inset-0 bg-purple-500/30 blur-xl group-hover:bg-purple-500/50 transition-all" />

            {/* Content */}
            <div className="relative flex items-center gap-2">
                <Sparkles size={16} className="animate-pulse" strokeWidth={1.5} />
                <span>Make with AI</span>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </button>
    );
};
