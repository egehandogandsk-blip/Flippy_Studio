import React from 'react';
import { Download, Plus } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { useDocumentStore } from '../../store/documentStore';

export const ImageGallery: React.FC = () => {
    const generatedImages = useAIStore((state) => state.generatedImages);
    const addNode = useDocumentStore((state) => state.actions.addNode);
    const closeModal = useAIStore((state) => state.closeModal);

    const handleImportToCanvas = (imageUrl: string) => {
        // Add image as a node to canvas
        const id = `img-${Date.now()}`;
        addNode({
            id,
            type: 'IMAGE' as any, // IMAGE type for proper rendering
            name: 'AI Generated Image',
            x: 100,
            y: 100,
            width: 512,
            height: 512,
            style: {
                fill: '#ffffff',
                stroke: 'none',
                strokeWidth: 0
            },
            layout: { layoutMode: 'NONE' },
            children: [],
            parentId: 'root',
            imageUrl: imageUrl // Store as dedicated property
        });
        closeModal();
    };

    if (generatedImages.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                Üretilen Görseller
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                {generatedImages.map((image) => (
                    <div
                        key={image.id}
                        className="relative flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-purple-500/20 group"
                    >
                        <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-full object-cover"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                onClick={() => handleImportToCanvas(image.url)}
                                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white transition-colors"
                                title="Canvas'a Aktar"
                            >
                                <Plus size={16} />
                            </button>
                            <a
                                href={image.url}
                                download
                                className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors"
                                title="İndir"
                            >
                                <Download size={16} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
