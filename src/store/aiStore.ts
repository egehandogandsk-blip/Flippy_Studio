import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    negativePrompt?: string;
    timestamp: number;
    styleId?: string;
}

export interface TrainingImage {
    id: string;
    url: string; // Base64 or URL
    description: string;
}

export interface TrainingFolder {
    id: string;
    name: string;
    images: TrainingImage[];
    isTrained: boolean;
    trainedStyleId?: string;
    createdAt: number;
}

export interface AIStyle {
    id: string;
    name: string;
    promptModifier: string; // The "learned" style prompt
    description?: string;
    thumbnail: string;
}

export type AIViewMode = 'launcher' | 'train' | 'generate';

interface AIState {
    isModalOpen: boolean;
    viewMode: AIViewMode;

    // Generation State
    generatedImages: GeneratedImage[];
    isGenerating: boolean;
    currentPrompt: string;
    currentNegativePrompt: string;
    currentReferenceImage: string | null;
    selectedStyleId: string | null;

    // Training State
    trainingFolders: TrainingFolder[];
    trainedStyles: AIStyle[];
    currentFolderId: string | null;

    // Actions
    openModal: (mode?: AIViewMode) => void;
    closeModal: () => void;
    setViewMode: (mode: AIViewMode) => void;

    setPrompt: (prompt: string) => void;
    setNegativePrompt: (prompt: string) => void;
    setReferenceImage: (image: string | null) => void;
    setSelectedStyleId: (id: string | null) => void;

    addGeneratedImage: (image: GeneratedImage) => void;
    setGenerating: (isGenerating: boolean) => void;
    clearInputs: () => void;

    // Training Actions
    createFolder: (name: string) => void;
    selectFolder: (id: string) => void;
    addImageToFolder: (folderId: string, image: string) => void;
    updateImageDescription: (folderId: string, imageId: string, description: string) => void;
    trainStyleFromFolder: (folderId: string, styleName: string, promptModifier: string) => void;
    deleteFolder: (id: string) => void;
    setFolderDescription: (id: string, description: string) => void;
}

export const useAIStore = create<AIState>()(
    persist(
        (set, get) => ({
            isModalOpen: false,
            viewMode: 'launcher',

            generatedImages: [],
            isGenerating: false,
            currentPrompt: '',
            currentNegativePrompt: '',
            currentReferenceImage: null,
            selectedStyleId: null,

            trainingFolders: [],
            trainedStyles: [],
            currentFolderId: null,

            openModal: (mode = 'launcher') => set({ isModalOpen: true, viewMode: mode }),
            closeModal: () => set({ isModalOpen: false }),
            setViewMode: (mode) => set({ viewMode: mode }),

            setPrompt: (prompt) => set({ currentPrompt: prompt }),
            setNegativePrompt: (prompt) => set({ currentNegativePrompt: prompt }),
            setReferenceImage: (image) => set({ currentReferenceImage: image }),
            setSelectedStyleId: (id) => set({ selectedStyleId: id }),

            addGeneratedImage: (image) => set((state) => ({
                generatedImages: [image, ...state.generatedImages]
            })),
            setGenerating: (isGenerating) => set({ isGenerating }),
            clearInputs: () => set({
                currentPrompt: '',
                currentNegativePrompt: '',
                currentReferenceImage: null,
                selectedStyleId: null
            }),

            // Training Actions
            createFolder: (name) => {
                const newFolder: TrainingFolder = {
                    id: Date.now().toString(),
                    name,
                    images: [],
                    isTrained: false,
                    createdAt: Date.now()
                };
                set((state) => ({
                    trainingFolders: [newFolder, ...state.trainingFolders],
                    currentFolderId: newFolder.id
                }));
            },

            updateImageDescription: (folderId, imageId, description) => set((state) => ({
                trainingFolders: state.trainingFolders.map(f =>
                    f.id === folderId
                        ? {
                            ...f,
                            images: f.images.map(img =>
                                img.id === imageId ? { ...img, description } : img
                            )
                        }
                        : f
                )
            })),

            selectFolder: (id) => set({ currentFolderId: id }),

            addImageToFolder: (folderId, image) => set((state) => ({
                trainingFolders: state.trainingFolders.map(f =>
                    f.id === folderId
                        ? {
                            ...f,
                            images: [...f.images, {
                                id: Date.now().toString(),
                                url: image,
                                description: ''
                            }]
                        }
                        : f
                )
            })),

            trainStyleFromFolder: (folderId, styleName, promptModifier) => {
                const state = get();
                const folder = state.trainingFolders.find(f => f.id === folderId);
                if (!folder) return;

                const newStyle: AIStyle = {
                    id: `style-${Date.now()}`,
                    name: styleName,
                    promptModifier,
                    thumbnail: folder.images[0]?.url || '', // Use first image as thumbnail
                };

                set((state) => ({
                    trainedStyles: [...state.trainedStyles, newStyle],
                    trainingFolders: state.trainingFolders.map(f =>
                        f.id === folderId
                            ? { ...f, isTrained: true, trainedStyleId: newStyle.id }
                            : f
                    )
                }));
            },

            deleteFolder: (id) => set((state) => ({
                trainingFolders: state.trainingFolders.filter(f => f.id !== id),
                currentFolderId: state.currentFolderId === id ? null : state.currentFolderId
            })),

            setFolderDescription: (id, description) => { } // Deprecated but kept for type safety
        }),
        {
            name: 'ai-storage-v3', // Updated version to force fresh state for new schema
            partialize: (state) => ({
                // DO NOT persist base64 images - they fill localStorage!
                // Only persist trained style metadata without thumbnails
                trainedStyles: state.trainedStyles.map(style => ({
                    ...style,
                    thumbnail: '' // Do not persist base64 thumbnail
                })),
                // Save folder structure but NOT images
                trainingFolders: state.trainingFolders.map(f => ({
                    ...f,
                    images: [], // Clear images to save space
                    imageCount: f.images.length // Just track count
                }))
            }),
            version: 3,
            migrate: (persistedState: any, version: number) => {
                if (version < 3) {
                    return {
                        ...persistedState,
                        trainingFolders: [],
                        trainedStyles: []
                    };
                }
                return persistedState;
            }
        }
    )
);
