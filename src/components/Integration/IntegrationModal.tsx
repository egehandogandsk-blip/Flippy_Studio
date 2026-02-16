import React, { useState } from 'react';
import { useIntegrationStore } from '../../store/integrationStore';
import { useUiStore } from '../../store/uiStore';
import { X, Github, RefreshCw, Upload, Check, ChevronRight, Layers } from 'lucide-react';
import { generateMockGameUI } from '../../utils/MockGenerator';
import { clsx } from 'clsx';

export const IntegrationModal: React.FC = () => {
    const { isModalOpen, activeEngine, engines, closeModal, connectRepo, importScreens, pushChanges } = useIntegrationStore();
    const theme = useUiStore(state => state.theme);

    // Local state for inputs
    const [repoUrl, setRepoUrl] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [commitMessage, setCommitMessage] = useState('Frontend UI Update');
    const [isPushing, setIsPushing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!isModalOpen || !activeEngine) return null;

    const engineState = engines[activeEngine];
    const isDark = theme === 'dark';

    // Steps Logic
    const CurrentView = () => {
        // VIEW 1: CONNECT
        if (!engineState.isConnected) {
            return (
                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <Github className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <h3 className="text-lg font-bold">Connect to {activeEngine} Project</h3>
                        <p className="text-sm text-zinc-500">Enter your repository URL to sync UI screens.</p>
                    </div>

                    <input
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="https://github.com/username/project.git"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                    />

                    <button
                        disabled={!repoUrl || isConnecting}
                        onClick={async () => {
                            setIsConnecting(true);
                            await connectRepo(activeEngine, repoUrl);
                            setIsConnecting(false);
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isConnecting ? <RefreshCw className="animate-spin w-4 h-4" /> : <Github className="w-4 h-4" />}
                        {isConnecting ? 'Connecting...' : 'Connect Repository'}
                    </button>
                </div>
            );
        }

        // VIEW 3: UPLOAD / SYNC (Active if connected AND (has changes OR user explicitly wants to push))
        // For demo simple flow: if hasChanges is true, we show sync.
        if (engineState.hasChanges) {
            if (showSuccess) {
                return (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                            <Check className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Synced Successfully!</h3>
                        <p className="text-zinc-500 text-sm">Your changes are now live in the repository.</p>
                        <button
                            onClick={() => { setShowSuccess(false); closeModal(); }}
                            className="mt-6 px-6 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-full text-sm font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                );
            }

            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md text-sm border border-blue-100 dark:border-blue-900/50">
                        <RefreshCw className="w-4 h-4 shrink-0" />
                        <span>Changes detected in 2 UI Frames.</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase">Commit Message</label>
                        <textarea
                            className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none h-24"
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={isPushing}
                        onClick={async () => {
                            setIsPushing(true);
                            await pushChanges(activeEngine, commitMessage);
                            setIsPushing(false);
                            setShowSuccess(true);
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isPushing ? <RefreshCw className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                        {isPushing ? 'Pushing to GitHub...' : 'Push Changes'}
                    </button>
                </div>
            );
        }

        // VIEW 2: IMPORT SCREENS
        return (
            <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between px-1">
                    <p className="text-sm text-zinc-500">Select screens to import into Studio Forge:</p>
                    <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                        {engineState.availableScreens.length} Available
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div className="grid grid-cols-3 gap-3 pb-4">
                        {engineState.availableScreens.map(screen => (
                            <div
                                key={screen.id}
                                className={clsx(
                                    "group relative p-3 rounded-xl border cursor-pointer transition-all duration-200",
                                    "flex flex-col gap-2",
                                    screen.selected
                                        ? "bg-purple-50/80 dark:bg-purple-900/20 border-purple-500 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]"
                                        : "bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/80"
                                )}
                                onClick={() => useIntegrationStore.getState().toggleScreenSelection(activeEngine, screen.id)}
                            >
                                {/* Header: Icon + Selection Checkbox */}
                                <div className="flex items-start justify-between">
                                    <div className={clsx(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                        screen.selected ? "bg-purple-100 dark:bg-purple-900/40" : "bg-zinc-100 dark:bg-zinc-800"
                                    )}>
                                        <Layers className={clsx("w-4 h-4", screen.selected ? "text-purple-600 dark:text-purple-400" : "text-zinc-500")} />
                                    </div>
                                    <div className={clsx(
                                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                        screen.selected
                                            ? "bg-purple-600 border-purple-600 scale-100"
                                            : "bg-transparent border-zinc-300 dark:border-zinc-600 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                                    )}>
                                        {screen.selected && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <h4 className={clsx(
                                        "text-sm font-semibold truncate",
                                        screen.selected ? "text-purple-900 dark:text-purple-100" : "text-zinc-700 dark:text-zinc-200"
                                    )}>
                                        {screen.name}
                                    </h4>
                                    <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                                        <RefreshCw size={10} />
                                        Updated {screen.lastUpdated || 'recently'}
                                    </p>
                                </div>

                                {/* Info Tooltip (Simple approach) */}
                                {screen.description && (
                                    <div className="absolute top-2 left-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-black/90 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                                            {screen.description}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <button
                        onClick={async () => {
                            const screens = await importScreens(activeEngine);
                            screens.forEach((s, i) => generateMockGameUI(s.name, activeEngine, i));
                        }}
                        className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-200
                         hover:from-black hover:to-zinc-900 dark:hover:from-zinc-100 dark:hover:to-white
                         text-white dark:text-black rounded-lg py-2.5 text-sm font-bold shadow-lg
                         transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
                    >
                        <span>Import Selected</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-[850px] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900">
                    <div className="flex items-center gap-3">
                        <img
                            src={`https://cdn.simpleicons.org/${activeEngine === 'Unreal' ? 'unrealengine' : activeEngine === 'Godot' ? 'godotengine' : 'unity'}/${activeEngine === 'Godot' ? '478CBF' : isDark ? 'ffffff' : '000000'}`}
                            className="w-6 h-6"
                            alt={activeEngine}
                        />
                        <div>
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                {activeEngine} Integration
                                {engineState.isConnected && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-medium">Connected</span>
                                )}
                            </h2>
                        </div>
                    </div>
                    <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <CurrentView />
                </div>
            </div>
        </div>
    );
};
