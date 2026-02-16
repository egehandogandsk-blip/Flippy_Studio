interface ImageGenerationParams {
    prompt: string;
    negative_prompt?: string;
    image?: string;
    width?: number;
    height?: number;
}

interface ImageGenerationResponse {
    success: boolean;
    imageUrl?: string;
    metadata?: any;
    error?: string;
}

export class NanoBananaService {
    private proxyUrl = 'http://localhost:3001/api/generate-image';

    async generateImage(params: ImageGenerationParams): Promise<ImageGenerationResponse> {
        console.log(`[NanoBananaService] ===== STARTING GENERATION =====`);
        console.log(`[NanoBananaService] Prompt: "${params.prompt}"`);
        console.log(`[NanoBananaService] Proxy URL: ${this.proxyUrl}`);

        try {
            console.log('[NanoBananaService] Sending request to proxy...');

            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: params.prompt
                })
            });

            console.log('[NanoBananaService] Response received');
            console.log('[NanoBananaService] Status:', response.status);
            console.log('[NanoBananaService] Status Text:', response.statusText);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('[NanoBananaService] Error response:', errorData);
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[NanoBananaService] Data received, has imageUrl:', !!data.imageUrl);

            if (!data.imageUrl) {
                throw new Error('No imageUrl in response');
            }

            console.log('[NanoBananaService] ===== GENERATION SUCCESSFUL =====');

            return {
                success: true,
                imageUrl: data.imageUrl,
                metadata: {
                    model: 'Stable Diffusion 2.1 (via proxy)',
                    prompt: params.prompt,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('[NanoBananaService] ===== GENERATION FAILED =====');
            console.error('[NanoBananaService] Error:', error);
            console.error('[NanoBananaService] Error type:', error instanceof Error ? error.constructor.name : typeof error);
            console.error('[NanoBananaService] Error message:', error instanceof Error ? error.message : String(error));

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
}

export const nanoBananaService = new NanoBananaService();

export const generateImage = (params: ImageGenerationParams) => nanoBananaService.generateImage(params);
