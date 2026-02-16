
import React, { useState } from 'react';
import { nanoBananaService } from '../../services/NanoBananaService';

export const NanoBananaUI: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) return;

        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const response = await nanoBananaService.generateImage({
                prompt,
                width: 512,
                height: 512
            });

            if (response.success && response.imageUrl) {
                setImageUrl(response.imageUrl);
            } else {
                setError(response.error || 'Failed to generate image');
            }
        } catch (err) {
            setError('Failed to generate image. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px', margin: '20px auto' }}>
            <h2>Nano Banana Image Generator</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a prompt (e.g., A futuristic city in cyberpunk style)"
                    style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt}
                    style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#646cff', color: 'white', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {imageUrl && (
                <div style={{ textAlign: 'center' }}>
                    <img src={imageUrl} alt="Generated result" style={{ maxWidth: '100%', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <p style={{ fontSize: '0.8em', color: '#666', marginTop: '10px' }}>Powered by Gemini 2.5 Flash</p>
                </div>
            )}
        </div>
    );
};
