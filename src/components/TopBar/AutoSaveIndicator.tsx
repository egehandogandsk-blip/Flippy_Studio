import React, { useEffect, useState } from 'react';
import { Cloud, Check } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export const AutoSaveIndicator: React.FC = () => {
    const { editor } = useSettingsStore();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const intervalMs = editor.autoSaveInterval * 60 * 1000; // Convert minutes to milliseconds

        const saveInterval = setInterval(() => {
            // Trigger save
            setSaving(true);

            // Simulate save process
            setTimeout(() => {
                setSaving(false);
                setSaved(true);

                // Hide "Saved" after 2 seconds
                setTimeout(() => {
                    setSaved(false);
                }, 2000);
            }, 500);
        }, intervalMs);

        return () => clearInterval(saveInterval);
    }, [editor.autoSaveInterval]);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2C2C2C]/50 rounded-lg border border-purple-500/10">
            <Cloud
                size={16}
                className={`text-purple-400 transition-all ${saving ? 'animate-pulse' : saved ? 'text-green-400' : ''
                    }`}
            />

            {saving && (
                <span className="text-white/70 text-sm animate-pulse">Saving...</span>
            )}

            {saved && (
                <div className="flex items-center gap-1 animate-fadeIn">
                    <Check size={14} className="text-green-400" />
                    <span className="text-green-400 text-sm">Saved</span>
                </div>
            )}

            {!saving && !saved && (
                <span className="text-white/40 text-xs">{editor.autoSaveInterval}min</span>
            )}
        </div>
    );
};
