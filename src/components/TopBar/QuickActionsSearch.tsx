import React, { useState } from 'react';
import { Search, Command } from 'lucide-react';

export const QuickActionsSearch: React.FC = () => {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            // Open command palette
        }
    };

    return (
        <div
            className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                "bg-[#2C2C2C] border border-transparent",
                isFocused && "border-indigo-500/50"
            )}
            style={{ width: '240px', height: '30px' }}
        >
            <Search size={14} className="text-white/40" strokeWidth={1.25} />
            <input
                type="text"
                placeholder="Quick Actions..."
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-[13px] text-white/70 placeholder:text-white/30 outline-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <div className="flex items-center gap-0.5 text-white/30 text-[11px]">
                <Command size={10} strokeWidth={1.5} />
                <span>K</span>
            </div>
        </div>
    );
};

// Import clsx
import { clsx } from 'clsx';
