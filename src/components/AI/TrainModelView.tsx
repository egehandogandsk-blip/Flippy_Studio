import React, { useState, useRef, useEffect } from 'react';
import { FolderPlus, Upload, Trash2, Sparkles, ArrowLeft, Check, Loader2, Info } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';

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

            // Progress animation loop for this step
            while (Date.now() - stepStart < step.duration) {
                const elapsed = Date.now() - stepStart;
                const stepProgress = (elapsed / step.duration) * (100 / steps.length);
                const totalProgress = (accumulatedTime / 9000 * 100) + stepProgress; // approx based on total duration

                setTrainingProgress(Math.min(99, totalProgress));
                await new Promise(r => setTimeout(r, 50));
            }

            accumulatedTime += step.duration;
        }

        setTrainingStep('Saving model...');
        setTrainingProgress(100);
        await new Promise(r => setTimeout(r, 500));

        try {
            // Generate a style prompt based on folder name, description, and image count
            const imageDescriptions = currentFolder.images
                .map(img => img.description)
                .filter(desc => desc && desc.trim().length > 0)
                .join(', ');

            const baseModifier = imageDescriptions.length > 0
                ? `${imageDescriptions}, ${currentFolder.name} style`
                : `in the style of ${currentFolder.name}, professional quality, detailed`;

            // This might throw QuotaExceededError if localStorage is full
            trainStyleFromFolder(currentFolder.id, currentFolder.name, baseModifier);

            setIsTraining(false);
            setTrainingStep('');
            setTrainingProgress(0);
        } catch (error) {
            console.error('Training failed:', error);
            setIsTraining(false);
            setTrainingStep('Error saving model (Storage Full)');
            // Keep error visible for a moment
            setTimeout(() => {
                setTrainingStep('');
                setTrainingProgress(0);
            }, 3000);
            alert("Failed to save model: Local Storage is full. Please clear some browser data or delete old models.");
        }
    };

    return (
        <div className="flex h-full">
            {/* Left Panel - Folders */}
            <div className="w-64 border-r border-purple-500/20 bg-[#1a1a1a] p-4 flex flex-col">
                {/* Back Button */}
                <button
                    onClick={() => setViewMode('launcher')}
                    className="flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>

                <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Training Folders
                </h3>

                {/* New Folder Button */}
                {!showNewFolderInput ? (
                    <button
                        onClick={() => setShowNewFolderInput(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-md text-sm mb-3 transition-colors"
                    >
                        <FolderPlus size={16} />
                        <span>New Folder</span>
                    </button>
                ) : (
                    <div className="mb-3 flex gap-2">
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                            placeholder="Folder name..."
                            className="flex-1 px-2 py-1 bg-[#2C2C2C] border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500"
                            autoFocus
                        />
                        <button
                            onClick={handleCreateFolder}
                            className="p-1 bg-purple-600 hover:bg-purple-700 rounded text-white"
                        >
                            <Check size={16} />
                        </button>
                    </div>
                )}

                {/* Folder List */}
                <div className="flex-1 overflow-y-auto space-y-2">
                    {trainingFolders.map(folder => (
                        <div
                            key={folder.id}
                            className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${currentFolderId === folder.id
                                ? 'bg-purple-600/30 border border-purple-500/50'
                                : 'bg-[#2C2C2C] hover:bg-[#333] border border-transparent'
                                }`}
                            onClick={() => selectFolder(folder.id)}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-white truncate">{folder.name}</div>
                                <div className="text-xs text-gray-500">{folder.images.length}/10 images</div>
                            </div>
                            <div className="flex items-center gap-1">
                                {folder.isTrained && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Trained" />
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteFolder(folder.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Image Grid */}
            <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                {!currentFolder ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <FolderPlus size={48} className="mx-auto mb-3 opacity-50" />
                            <p>Select or create a folder to start training</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    {currentFolder.name}
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Upload 4-10 images to train your custom style
                                </p>
                            </div>

                            {/* Train Style Button */}
                            <button
                                onClick={handleTrainStyle}
                                disabled={!canTrain || isTraining}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${canTrain
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isTraining ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Training...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        <span>Train Style</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Image Grid */}
                        <div className="grid grid-cols-4 gap-6">
                            {Array.from({ length: 10 }).map((_, index) => {
                                const image = currentFolder.images[index];
                                const isEmpty = !image;

                                return (
                                    <div
                                        key={image ? image.id : index}
                                        className="flex flex-col gap-2"
                                    >
                                        <div
                                            onClick={() => isEmpty && currentFolder.images.length < 10 && fileInputRef.current?.click()}
                                            className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${isEmpty
                                                ? 'border-purple-500/30 bg-[#1a1a1a] hover:border-purple-500/50 hover:bg-[#222] cursor-pointer'
                                                : 'border-purple-500/50 bg-[#2C2C2C] cursor-default'
                                                }`}
                                        >
                                            {isEmpty ? (
                                                <Upload size={24} className="text-gray-600" />
                                            ) : (
                                                <img
                                                    src={image.url}
                                                    alt={`Training ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>

                                        {!isEmpty && (
                                            <input
                                                type="text"
                                                value={image.description}
                                                onChange={(e) => updateImageDescription(currentFolder.id, image.id, e.target.value)}
                                                placeholder="Describe this image..."
                                                className="w-full px-3 py-2 bg-[#2C2C2C] border border-zinc-700 rounded text-xs text-white focus:border-purple-500 focus:outline-none placeholder:text-zinc-600 transition-colors"
                                            />
                                        )}
                                    </div>
                                );
                            })}
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
                        {isTraining && (
                            <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center backdrop-blur-sm rounded-lg">
                                <div className="w-64 space-y-4">
                                    <div className="flex items-center justify-center gap-3 text-purple-400">
                                        <Loader2 size={32} className="animate-spin" />
                                        <span className="text-lg font-bold">{Math.round(trainingProgress)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                                            style={{ width: `${trainingProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-center text-white/80 text-sm animate-pulse">
                                        {trainingStep}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Info Footer */}
                        {currentFolder.isTrained && (
                            <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-green-400 text-sm flex items-center gap-2">
                                    <Check size={16} />
                                    This style has been trained using your image descriptions and is now available in "Make with Gen AI"
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
