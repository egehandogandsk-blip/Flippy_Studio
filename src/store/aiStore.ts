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

export interface TrainingFolder {
    id: string;
    name: string;
    images: string[]; // Base64 or URLs
    isTrained: boolean;
    trainedStyleId?: string;
    createdAt: number;
}

export interface AIStyle {
    id: string;
    name: string;
    promptModifier: string; // The "learned" style prompt
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
    trainStyleFromFolder: (folderId: string, styleName: string, promptModifier: string) => void;
    deleteFolder: (id: string) => void;
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

            selectFolder: (id) => set({ currentFolderId: id }),

            addImageToFolder: (folderId, image) => set((state) => ({
                trainingFolders: state.trainingFolders.map(f =>
                    f.id === folderId
                        ? { ...f, images: [...f.images, image] }
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
                    thumbnail: folder.images[0] // Use first image as thumbnail
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
            }))
        }),
        {
            name: 'ai-storage-v2', // Updated version to force fresh state if needed, or handle migration
            partialize: (state) => ({
                // DO NOT persist base64 images - they fill localStorage!
                // Only persist trained style metadata
                trainedStyles: state.trainedStyles,
                // Save folder structure but NOT images
                trainingFolders: state.trainingFolders.map(f => ({
                    ...f,
                    images: [], // Clear images to save space
                    imageCount: f.images.length // Just track count
                }))
            })
        }
    )
);
