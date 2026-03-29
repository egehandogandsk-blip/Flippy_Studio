import React, { useState, useRef } from 'react';
import { FolderPlus, Upload, Trash2, Sparkles, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { motion, AnimatePresence } from 'framer-motion';

export const TrainModelView: React.FC = () => {
    const {
        trainingFolders,
        currentFolderId,
        createFolder,
        selectFolder,
        addImageToFolder,
        trainStyleFromFolder,
        deleteFolder,
        setViewMode,
        updateImageDescription
    } = useAIStore();

    const [newFolderName, setNewFolderName] = useState('');
    const [showNewFolderInput, setShowNewFolderInput] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingStep, setTrainingStep] = useState<string>('');
    const [trainingProgress, setTrainingProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentFolder = trainingFolders.find(f => f.id === currentFolderId);
    const canTrain = currentFolder && currentFolder.images.length >= 4 && !currentFolder.isTrained;

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            createFolder(newFolderName.trim());
            setNewFolderName('');
            setShowNewFolderInput(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentFolderId) return;

        const files = Array.from(e.target.files || []);
        const remainingSlots = 10 - (currentFolder?.images.length || 0);

        files.slice(0, remainingSlots).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                addImageToFolder(currentFolderId, event.target?.result as string);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleTrainStyle = async () => {
        if (!currentFolder) return;

        setIsTraining(true);
        const steps = [
            { msg: 'Analyzing image dataset...', duration: 2000 },
            { msg: 'Extracting key features...', duration: 2500 },
            { msg: 'Fine-tuning style model...', duration: 3000 },
            { msg: 'Finalizing style parameters...', duration: 1500 }
        ];

        let accumulatedTime = 0;

        for (const step of steps) {
            setTrainingStep(step.msg);
            const stepStart = Date.now();

            while (Date.now() - stepStart < step.duration) {
                const elapsed = Date.now() - stepStart;
                const stepProgress = (elapsed / step.duration) * (100 / steps.length);
                const totalProgress = (accumulatedTime / 9000 * 100) + stepProgress;

                setTrainingProgress(Math.min(99, totalProgress));
                await new Promise(r => setTimeout(r, 50));
            }

            accumulatedTime += step.duration;
        }

        setTrainingStep('Saving model...');
        setTrainingProgress(100);
        await new Promise(r => setTimeout(r, 500));

        try {
            const imageDescriptions = currentFolder.images
                .map(img => img.description)
                .filter(desc => desc && desc.trim().length > 0)
                .join(', ');

            const baseModifier = imageDescriptions.length > 0
                ? `${imageDescriptions}, ${currentFolder.name} style`
                : `in the style of ${currentFolder.name}, professional quality, detailed`;

            trainStyleFromFolder(currentFolder.id, currentFolder.name, baseModifier);

            setIsTraining(false);
            setTrainingStep('');
            setTrainingProgress(0);
        } catch (error) {
            console.error('Training failed:', error);
            setIsTraining(false);
            setTrainingStep('Error saving model (Storage Full)');
            setTimeout(() => {
                setTrainingStep('');
                setTrainingProgress(0);
            }, 3000);
            alert("Failed to save model: Local Storage is full. Please clear some browser data or delete old models.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full font-sans"
        >
            {/* Left Panel - Folders */}
            <div className="w-80 border-r border-white/10 bg-[#1a1a1a]/60 backdrop-blur-xl p-4 flex flex-col z-10 glass-panel border-y-0 border-l-0 rounded-none">
                <button
                    onClick={() => setViewMode('launcher')}
                    className="flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Launcher</span>
                </button>

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white tracking-wide">
                        Training Folders
                    </h3>
                    {!showNewFolderInput && (
                        <button
                            onClick={() => setShowNewFolderInput(true)}
                            className="p-1.5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-colors"
                        >
                            <FolderPlus size={16} />
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {showNewFolderInput && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-4 overflow-hidden"
                        >
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                                    placeholder="Folder name..."
                                    className="glass-input flex-1 px-3 py-1.5 rounded-md text-sm text-white placeholder:text-white/30"
                                    autoFocus
                                />
                                <button
                                    onClick={handleCreateFolder}
                                    className="p-1.5 bg-purple-600 hover:bg-purple-500 rounded-md text-white transition-colors"
                                >
                                    <Check size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 overflow-y-auto space-y-1 -mx-2 px-2 scrollbar-hide">
                    {trainingFolders.map(folder => (
                        <motion.div
                            key={folder.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all border border-transparent ${currentFolderId === folder.id
                                    ? 'bg-purple-600/20 border-purple-500/30 text-white shadow-[0_0_20px_rgba(147,51,234,0.1)]'
                                    : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                                }`}
                            onClick={() => selectFolder(folder.id)}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{folder.name}</div>
                                <div className="text-xs opacity-60">{folder.images.length}/10 images</div>
                            </div>
                            <div className="flex items-center gap-2">
                                {folder.isTrained && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Trained" />
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteFolder(folder.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-md text-red-400 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Image Grid */}
            <div className="flex-1 p-8 flex flex-col overflow-y-auto relative">
                {!currentFolder ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-4">
                        <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                            <FolderPlus size={48} className="opacity-50" />
                        </div>
                        <p className="text-lg font-medium">Select or create a folder to start training</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={currentFolder.id}
                        className="h-full flex flex-col max-w-5xl mx-auto w-full"
                    >
                        <header className="flex items-start justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tight text-glow">
                                    {currentFolder.name}
                                </h2>
                                <p className="text-white/50 mt-2 text-lg">
                                    Upload 4-10 images to train your custom style
                                </p>
                            </div>

                            <button
                                onClick={handleTrainStyle}
                                disabled={!canTrain || isTraining}
                                className={`flex items-center gap-3 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg ${canTrain
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                                    }`}
                            >
                                {isTraining ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Training Model...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        <span>Train Style Model</span>
                                    </>
                                )}
                            </button>
                        </header>

                        <div className="grid grid-cols-4 lg:grid-cols-5 gap-6">
                            <AnimatePresence>
                                {Array.from({ length: 10 }).map((_, index) => {
                                    const image = currentFolder.images[index];
                                    const isEmpty = !image;

                                    return (
                                        <motion.div
                                            key={image?.id || index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex flex-col gap-3 group"
                                        >
                                            <div
                                                onClick={() => isEmpty && currentFolder.images.length < 10 && fileInputRef.current?.click()}
                                                className={`aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${isEmpty
                                                        ? 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 cursor-pointer'
                                                        : 'border-purple-500/30 bg-black/40 cursor-default'
                                                    }`}
                                            >
                                                {isEmpty ? (
                                                    <Upload size={28} className="text-white/30 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
                                                ) : (
                                                    <motion.img
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        src={image.url}
                                                        alt={`Training ${index + 1}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                )}

                                                {/* Number Badge */}
                                                <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-xs font-medium text-white/70">
                                                    {index + 1}
                                                </div>
                                            </div>

                                            {!isEmpty && (
                                                <input
                                                    type="text"
                                                    value={image.description}
                                                    onChange={(e) => updateImageDescription(currentFolder.id, image.id, e.target.value)}
                                                    placeholder="Describe this image..."
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-white focus:border-purple-500/50 focus:bg-black/40 outline-none transition-all placeholder:text-white/20"
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        {/* Training Overlay */}
                        <AnimatePresence>
                            {isTraining && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-3xl"
                                >
                                    <div className="w-96 space-y-8 text-center">
                                        <div className="relative w-32 h-32 mx-auto">
                                            <div className="absolute inset-0 rounded-full border-t-4 border-purple-500 animate-spin"></div>
                                            <div className="absolute inset-2 rounded-full border-r-4 border-indigo-500 animate-spin reverse-spin duration-75 text-white flex items-center justify-center font-bold text-2xl">
                                                {Math.round(trainingProgress)}%
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-bold text-white tracking-tight">{trainingStep}</h3>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${trainingProgress}%` }}
                                                    transition={{ ease: "linear" }}
                                                />
                                            </div>
                                            <p className="text-white/40 text-sm">Please do not close this window</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Success Message */}
                        {currentFolder.isTrained && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                    <Check size={20} />
                                </div>
                                <div>
                                    <h4 className="text-green-400 font-semibold">Training Complete!</h4>
                                    <p className="text-green-400/70 text-sm">
                                        This style model is now ready to use. Go to "Make with Gen AI" to start generating images.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
