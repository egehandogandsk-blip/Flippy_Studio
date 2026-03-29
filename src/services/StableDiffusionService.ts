
export interface SDGenerationParams {
    prompt: string;
    negative_prompt?: string;
    steps?: number;
    width?: number;
    height?: number;
    cfg_scale?: number;
    sampler_name?: string;
    seed?: number;
}

export interface SDResponse {
    images: string[]; // Base64 strings
    parameters: any;
    info: string;
}

const SD_API_URL = 'http://127.0.0.1:7860';

export const checkSDConnection = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${SD_API_URL}/sdapi/v1/options`);
        return response.ok;
    } catch (error) {
        return false;
    }
};

export const generateImageSD = async (params: SDGenerationParams): Promise<string | null> => {
    try {
        const response = await fetch(`${SD_API_URL}/sdapi/v1/txt2img`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: params.prompt,
                negative_prompt: params.negative_prompt || '',
                steps: params.steps || 20,
                width: params.width || 512,
                height: params.height || 512,
                cfg_scale: params.cfg_scale || 7,
                sampler_name: params.sampler_name || 'Euler a',
                seed: params.seed || -1,
                // Add boilerplate for better quality if needed
                restore_faces: false,
                tiling: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`SD API Error: ${response.statusText}`);
        }

        const data: SDResponse = await response.json();
        if (data.images && data.images.length > 0) {
            // SD returns purely base64, we need to prefix it
            return `data:image/png;base64,${data.images[0]}`;
        }
        return null;

    } catch (error) {
        console.error('Stable Diffusion Generation Failed:', error);
        return null;
    }
};
