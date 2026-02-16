import React, { useRef, useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { AILauncher } from './AILauncher';
import { TrainModelView } from './TrainModelView';
import { generateImage } from '../../services/NanoBananaService';
import { generateImageSD, checkSDConnection } from '../../services/StableDiffusionService';
import { GenerateView } from './GenerateView';

export const AIModal: React.FC = () => {
    const {
        isModalOpen,
        closeModal,
        viewMode,
        setViewMode,
        currentPrompt,
        currentNegativePrompt,
        currentReferenceImage,
        selectedStyleId,
        trainedStyles,
        setPrompt,
        setNegativePrompt,
        setReferenceImage,
        setSelectedStyleId,
        addGeneratedImage,
        isGenerating,
        setGenerating,
        clearInputs
    } = useAIStore();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [sdAvailable, setSdAvailable] = useState(false);

    // Check SD connection on mount
    useEffect(() => {
        checkSDConnection().then(setSdAvailable);
    }, [isModalOpen]);

    if (!isModalOpen) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setReferenceImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleForge = async () => {
        if (!currentPrompt.trim()) return;

        setGenerating(true);
        try {
            // Build final prompt with style modifier
            let finalPrompt = currentPrompt;
            if (selectedStyleId) {
                const style = trainedStyles.find(s => s.id === selectedStyleId);
                if (style) {
                    finalPrompt = `${currentPrompt}, ${style.promptModifier}`;
                }
            }

            // Try local SD first
            let imageUrl: string | null = null;
            if (sdAvailable) {
                imageUrl = await generateImageSD({
                    prompt: finalPrompt,
                    negative_prompt: currentNegativePrompt || 'blurry, low quality, bad anatomy',
                    width: 1024,
                    height: 1024,
                    steps: 25,
                    cfg_scale: 7
                });
            }

            // Fallback to NanoBanana if SD failed or unavailable
            if (!imageUrl) {
                const result = await generateImage({
                    prompt: finalPrompt,
                    negative_prompt: currentNegativePrompt || 'blurry, low quality',
                    image: currentReferenceImage || undefined,
                    width: 1024,
                    height: 1024
                });

                if (result.success && result.imageUrl) {
                    imageUrl = result.imageUrl;
                } else {
                    throw new Error(result.error || 'Generation failed');
                }
            }

            if (imageUrl) {
                addGeneratedImage({
                    id: Date.now().toString(),
                    url: imageUrl,
                    prompt: currentPrompt,
                    negativePrompt: currentNegativePrompt,
                    timestamp: Date.now(),
                    styleId: selectedStyleId || undefined
                });
                clearInputs();
            }

        } catch (error) {
            console.error('AI generation failed:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setGenerating(false);
        }
    };

    // Render different views based on mode
    const renderContent = () => {
        switch (viewMode) {
            case 'launcher':
                return <AILauncher />;

            case 'train':
                return <TrainModelView />;

            case 'generate':
                return (
                    <GenerateView
                        currentPrompt={currentPrompt}
                        currentNegativePrompt={currentNegativePrompt}
                        currentReferenceImage={currentReferenceImage}
                        selectedStyleId={selectedStyleId}
                        trainedStyles={trainedStyles}
                        sdAvailable={sdAvailable}
                        isGenerating={isGenerating}
                        setPrompt={setPrompt}
                        setNegativePrompt={setNegativePrompt}
                        setSelectedStyleId={setSelectedStyleId}
                        handleFileUpload={handleFileUpload}
                        handleForge={handleForge}
                        setViewMode={setViewMode}
                        fileInputRef={fileInputRef}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className={`relative ${viewMode === 'train' ? 'w-[1000px] h-[700px]' : viewMode === 'generate' ? 'w-[900px] h-[650px]' : 'w-[600px] min-h-[500px] max-h-[90vh]'} overflow-hidden bg-[#1E1E1E] border border-purple-500/30 rounded-xl shadow-2xl flex flex-col`}>
                {/* Header */}
                <div className="sticky top-0 bg-[#1E1E1E] border-b border-purple-500/20 p-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-purple-400" size={20} />
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {viewMode === 'launcher' && 'AI Studio'}
                            {viewMode === 'train' && 'Train Models'}
                            {viewMode === 'generate' && 'Make with AI'}
                        </h2>
                    </div>
                    <button
                        onClick={closeModal}
                        className="p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
