import { useState } from 'react';
import { Folder, Image, Type, Layers, Box } from 'lucide-react';
import { Layer } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
    layers: Layer[];
    selectedIDs: Set<string>;
    onSelect: (id: string, multi: boolean) => void;
}

const Sidebar = ({ layers, selectedIDs, onSelect }: SidebarProps) => {
    const [activeTab, setActiveTab] = useState<'layers' | 'assets'>('layers');

    return (
        <div className="w-64 border-r border-white/10 bg-[#1a1a1a]/80 backdrop-blur-xl flex flex-col h-full z-20">
            {/* Tabs */}
            <div className="flex p-2 gap-1 border-b border-white/5">
                {(['layers', 'assets'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all relative",
                            activeTab === tab
                                ? "text-white"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white/10 rounded-lg border border-white/5"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 capitalize flex items-center gap-2">
                            {tab === 'layers' ? <Layers size={14} /> : <Box size={14} />}
                            {tab}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2">
                <AnimatePresence mode="wait">
                    {activeTab === 'layers' ? (
                        <motion.div
                            key="layers"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-1"
                        >
                            {layers.map((layer, i) => (
                                <motion.div
                                    key={layer.id}
                                    layoutId={`layer-${layer.id}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={twMerge(
                                        "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-all border border-transparent",
                                        selectedIDs.has(layer.id)
                                            ? "bg-purple-600/30 border-purple-500/50 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/10"
                                    )}
                                    onClick={(e) => onSelect(layer.id, e.ctrlKey || e.metaKey)}
                                >
                                    {layer.type === 'rectangle' && <div className="w-3 h-3 border border-current rounded-sm" />}
                                    {layer.type === 'ellipse' && <div className="w-3 h-3 border border-current rounded-full" />}
                                    {layer.type === 'text' && <Type size={14} />}
                                    <span className="truncate">{layer.name}</span>
                                </motion.div>
                            ))}

                            {layers.length === 0 && (
                                <div className="text-center py-8 text-zinc-600 text-xs">
                                    No layers yet
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="assets"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 gap-2"
                        >
                            {[
                                { icon: Folder, label: 'Components', color: 'bg-blue-500/20 text-blue-400' },
                                { icon: Image, label: 'Images', color: 'bg-green-500/20 text-green-400' },
                                { icon: Type, label: 'Typography', color: 'bg-orange-500/20 text-orange-400' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                                >
                                    <div className={clsx("p-2 rounded-lg transition-transform group-hover:scale-110", item.color)}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-xs text-zinc-400 font-medium">{item.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Sidebar;
