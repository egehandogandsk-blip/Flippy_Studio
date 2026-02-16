export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const HF_API_KEY = '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';

    try {
        const { prompt } = req.body;

        if (!prompt) {
            console.error('[API] No prompt provided');
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('[API] Generating image for:', prompt);
        console.log('[API] Calling Hugging Face Router API...');

        // Using FLUX.1
        const response = await fetch(
            'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('[API] HF API Error:', error);

            // Fallback to Stable Diffusion if FLUX fails
            if (response.status === 404 || response.status === 401 || response.status === 403) {
                console.log('[API] FLUX failed, trying Stable Diffusion 3.5 Large...');
                return await tryFallbackModel(prompt, res, HF_API_KEY);
            }

            return res.status(response.status).json({ error: `HF API Error: ${error}` });
        }

        await processResponse(response, res);

    } catch (error) {
        console.error('[API] Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

async function tryFallbackModel(prompt, res, apiKey) {
    try {
        const response = await fetch(
            'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-3.5-large',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: prompt })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('[API] Fallback Error:', error);
            return res.status(response.status).json({ error: `Fallback Error: ${error}` });
        }

        await processResponse(response, res);
    } catch (error) {
        console.error('[API] Fallback Exception:', error);
        res.status(500).json({ error: error.message });
    }
}

async function processResponse(response, res) {
    console.log('[API] Converting image to base64...');
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log('[API] Image generated successfully');
    res.status(200).json({ imageUrl: dataUrl });
}
