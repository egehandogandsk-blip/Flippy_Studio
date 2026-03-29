import React from 'react';
import { useSettingsStore } from '../../../store/settingsStore';
import { useThemeStore } from '../../../store/themeStore';
import { Palette, Grid, Keyboard, Clock } from 'lucide-react';

export const EditorSection: React.FC = () => {
    const { editor, updateEditor } = useSettingsStore();
    const { currentTheme, setTheme } = useThemeStore();

    const handleThemeChange = (theme: 'dark' | 'light' | 'high-contrast') => {
        setTheme(theme);
        updateEditor({ theme });
    };

    return (
        <div className="space-y-6">
            {/* Theme */}
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Palette size={18} className="text-purple-400" />
                    Theme
                </h4>

                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => handleThemeChange('dark')}
                        className={`p-4 rounded-lg border-2 transition-all ${currentTheme === 'dark'
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-purple-500/20 hover:border-purple-500/50'
                            }`}
                    >
                        <div className="w-full h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded mb-2"></div>
                        <p className="text-white font-medium">Dark</p>
                    </button>

                    <button
                        onClick={() => handleThemeChange('light')}
                        className={`p-4 rounded-lg border-2 transition-all ${currentTheme === 'light'
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-purple-500/20 hover:border-purple-500/50'
                            }`}
                    >
                        <div className="w-full h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-2"></div>
                        <p className="text-white font-medium">Light</p>
                    </button>

                    <button
                        onClick={() => handleThemeChange('high-contrast')}
                        className={`p-4 rounded-lg border-2 transition-all ${currentTheme === 'high-contrast'
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-purple-500/20 hover:border-purple-500/50'
                            }`}
                    >
                        <div className="w-full h-12 bg-gradient-to-br from-black to-white rounded mb-2"></div>
                        <p className="text-white font-medium">High Contrast</p>
                    </button>
                </div>
            </div>

            {/* Grid & Snapping */}
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Grid size={18} className="text-purple-400" />
                    Grid & Snapping
                </h4>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-white">Show Grid</span>
                        <button
                            onClick={() => updateEditor({ gridEnabled: !editor.gridEnabled })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${editor.gridEnabled ? 'bg-purple-600' : 'bg-[#3C3C3C]'
                                }`}
                        >
                            <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${editor.gridEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-white">Snap to Grid</span>
                        <button
                            onClick={() => updateEditor({ snapToGrid: !editor.snapToGrid })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${editor.snapToGrid ? 'bg-purple-600' : 'bg-[#3C3C3C]'
                                }`}
                        >
                            <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${editor.snapToGrid ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                            />
                        </button>
                    </div>

                    <div>
                        <label className="block text-white mb-2">Snap Tolerance: {editor.snapTolerance}px</label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={editor.snapTolerance}
                            onChange={(e) => updateEditor({ snapTolerance: parseInt(e.target.value) })}
                            className="w-full accent-purple-600"
                        />
                    </div>
                </div>
            </div>

            {/* Auto-Save */}
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-purple-400" />
                    Auto-Save
                </h4>

                <div>
                    <label className="block text-white mb-2">Interval: {editor.autoSaveInterval} minutes</label>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        value={editor.autoSaveInterval}
                        onChange={(e) => updateEditor({ autoSaveInterval: parseInt(e.target.value) })}
                        className="w-full accent-purple-600"
                    />
                    <p className="text-white/50 text-sm mt-2">
                        Auto-save indicator will appear in the top bar
                    </p>
                </div>
            </div>

            {/* Shortcuts */}
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Keyboard size={18} className="text-purple-400" />
                    Keyboard Shortcuts
                </h4>

                <div className="space-y-2">
                    {Object.entries(editor.shortcuts).map(([action, key]) => (
                        <div key={action} className="flex items-center justify-between p-2 hover:bg-[#2C2C2C] rounded">
                            <span className="text-white capitalize">{action}</span>
                            <kbd className="px-3 py-1 bg-[#2C2C2C] border border-purple-500/20 rounded text-white text-sm">
                                {key}
                            </kbd>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
