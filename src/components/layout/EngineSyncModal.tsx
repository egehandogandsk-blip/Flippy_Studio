import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, X, Download, Server } from 'lucide-react';

interface EngineSyncModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'selection' | 'github' | 'connecting' | 'screens';

export const EngineSyncModal: React.FC<EngineSyncModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<Step>('selection');
    const [selectedEngine, setSelectedEngine] = useState<string | null>(null);
    const [githubUrl, setGithubUrl] = useState('');

    const engines = [
        { id: 'unity', name: 'Unity', color: 'hover:border-gray-400 hover:shadow-gray-400/20' },
        { id: 'unreal', name: 'Unreal Engine', color: 'hover:border-blue-500 hover:shadow-blue-500/20' },
        { id: 'godot', name: 'Godot', color: 'hover:border-blue-400 hover:shadow-blue-400/20' }
    ];

    const mockScreens = [
        { id: 1, name: 'Main Menu UI', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop' },
        { id: 2, name: 'Inventory Screen', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop' },
        { id: 3, name: 'HUD Overlay', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop' },
        { id: 4, name: 'Settings Menu', url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop' }
    ];

    const handleEngineSelect = (engineId: string) => {
        setSelectedEngine(engineId);
        setStep('github');
    };

    const handleGithubSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('connecting');
        setTimeout(() => {
            setStep('screens');
        }, 2500);
    };

    const handleImport = (screenName: string) => {
        console.log(`Importing ${screenName} to canvas...`);
        alert(`${screenName} imported to canvas successfully!`);
        onClose();
        setTimeout(() => setStep('selection'), 300); // reset state after close
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`glass-panel border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col ${
                        step === 'screens' ? 'w-full max-w-5xl h-[80vh]' : 'w-full max-w-lg min-h-[400px]'
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-2">
                            <Server className="w-5 h-5 text-accent" />
                            <h2 className="text-lg font-bold text-white">
                                {step === 'selection' && 'Select Target Engine'}
                                {step === 'github' && 'Connect Repository'}
                                {step === 'connecting' && 'Establishing Link...'}
                                {step === 'screens' && 'Project Screens'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto w-full flex flex-col justify-center">
                        {step === 'selection' && (
                            <div className="flex flex-col gap-4">
                                <p className="text-gray-400 text-sm text-center mb-4">Choose a game engine to synchronize UI components bidirectionally.</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {engines.map(engine => (
                                        <button
                                            key={engine.id}
                                            onClick={() => handleEngineSelect(engine.id)}
                                            className={`p-6 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center gap-3 transition-all ${engine.color}`}
                                        >
                                            <span className="text-lg font-semibold text-white">{engine.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 'github' && (
                            <form onSubmit={handleGithubSubmit} className="flex flex-col gap-6 w-full max-w-sm mx-auto">
                                <div className="text-center">
                                    <Github className="w-12 h-12 text-white/50 mx-auto mb-4" />
                                    <p className="text-gray-300 text-sm">Enter your GitHub repository URL for the {selectedEngine} project.</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://github.com/user/repo"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-accent hover:bg-accent/80 text-white rounded-lg font-semibold transition-colors shadow-glow">
                                    Connect & Sync
                                </button>
                                <button type="button" onClick={() => setStep('selection')} className="text-gray-500 hover:text-white text-sm">
                                    Back
                                </button>
                            </form>
                        )}

                        {step === 'connecting' && (
                            <div className="flex flex-col items-center justify-center gap-6 py-12">
                                <div className="relative">
                                    <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin"></div>
                                    <Server className="w-16 h-16 text-white/50 animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">Syncing via Flippy Bridge</h3>
                                    <p className="text-gray-400 text-sm">Parsing C# / C++ classes and generating UI AST trees...</p>
                                </div>
                            </div>
                        )}

                        {step === 'screens' && (
                            <div className="h-full w-full flex flex-col">
                                <p className="text-gray-400 text-sm mb-6">Select a screen from the remote {selectedEngine} repository to import to your canvas.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mockScreens.map((screen) => (
                                        <div key={screen.id} className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-accent transition-colors">
                                            <div className="aspect-video w-full overflow-hidden">
                                                <img src={screen.url} alt={screen.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                                                <span className="font-medium text-white">{screen.name}</span>
                                                <button 
                                                    onClick={() => handleImport(screen.name)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 bg-accent rounded-lg text-white hover:bg-white hover:text-black transition-all flex items-center gap-2"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span className="text-xs font-bold">Import</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
