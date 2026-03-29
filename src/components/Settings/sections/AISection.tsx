import React from 'react';
import { useSettingsStore } from '../../../store/settingsStore';
import { Sparkles, FileText, HardDrive } from 'lucide-react';

export const AISection: React.FC = () => {
    const { ai, updateAI } = useSettingsStore();

    const storagePercent = (ai.storageUsed / ai.storageLimit) * 100;
    const storageUsedMB = (ai.storageUsed / (1024 * 1024)).toFixed(1);
    const storageLimitMB = (ai.storageLimit / (1024 * 1024)).toFixed(0);

    return (
        <div className="space-y-6">
            {/* Default Model */}
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-400" />
                    AI Model
                </h4>

                <div>
                    <label className="block text-white/70 text-sm mb-2">Default Generation Model</label>
                    <select
                        value={ai.defaultModel}
                        onChange={(e) => updateAI({ defaultModel: e.target.value as any })}
                        className="w-full bg-[#2C2C2C] border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                    >
                        <option value="stable-diffusion">Stable Diffusion</option>
                        <option value="dalle">DALL-E</option>
                        <option value="midjourney">Midjourney</option>
                    </select>
                </div>
            </div>

            {/* Asset Naming */}
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-purple-400" />
                    Asset Organization
                </h4>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm mb-2">Naming Template</label>
                        <input
                            type="text"
                            value={ai.namingTemplate}
                            onChange={(e) => updateAI({ namingTemplate: e.target.value })}
                            className="w-full bg-[#2C2C2C] border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                        />
                        <p className="text-white/40 text-xs mt-2">
                            Available variables: {'{project}'}, {'{type}'}, {'{date}'}, {'{time}'}
                        </p>
                    </div>

                    <div className="p-3 bg-[#2C2C2C] rounded-lg">
                        <p className="text-white/70 text-sm mb-1">Preview:</p>
                        <p className="text-white font-mono text-sm">
                            my_project_character_2024-02-16.png
                        </p>
                    </div>
                </div>
            </div>

            {/* Storage */}
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <HardDrive size={18} className="text-purple-400" />
                    Cloud Storage
                </h4>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-white text-sm">{storageUsedMB} MB used</span>
                            <span className="text-white/70 text-sm">{storageLimitMB} MB total</span>
                        </div>
                        <div className="w-full h-3 bg-[#2C2C2C] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all"
                                style={{ width: `${Math.min(storagePercent, 100)}%` }}
                            />
                        </div>
                    </div>

                    <button className="px-4 py-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white text-sm rounded-lg transition-colors">
                        Clear Cache
                    </button>
                </div>
            </div>
        </div>
    );
};
