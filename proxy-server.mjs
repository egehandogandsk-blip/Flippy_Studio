import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const HF_API_KEY = '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';

app.post('/api/generate-image', async (req, res) => {
    console.log('[Proxy] ===== NEW REQUEST =====');
    console.log('[Proxy] Request body:', req.body);

    try {
        const { prompt } = req.body;

        if (!prompt) {
            console.error('[Proxy] No prompt provided');
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('[Proxy] Generating image for:', prompt);
        console.log('[Proxy] Calling Hugging Face Router API...');

        // UPDATED: Using router.huggingface.co
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

        console.log('[Proxy] HF Response status:', response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error('[Proxy] HF API Error:', error);

            // Fallback to Stable Diffusion if FLUX fails
            if (response.status === 404 || response.status === 401 || response.status === 403) {
                console.log('[Proxy] FLUX failed, trying Stable Diffusion 3.5 Large...');
                return await tryFallbackModel(prompt, res);
            }

            return res.status(response.status).json({ error: `HF API Error: ${error}` });
        }

        await processResponse(response, res);

    } catch (error) {
        console.error('[Proxy] ===== ERROR =====');
        console.error('[Proxy] Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// Stripe Webhook endpoint - must use raw body for signature verification
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('[Proxy] ===== STRIPE WEBHOOK =====');

    try {
        const { handleStripeWebhook } = await import('./src/api/stripeWebhook.mjs');
        await handleStripeWebhook(req, res);
    } catch (error) {
        console.error('[Proxy] Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// NEW: Figma API Proxy
app.get('/api/figma/file/:key', async (req, res) => {
    console.log('[Proxy] ===== FIGMA REQUEST =====');
    const { key } = req.params;
    const token = req.headers['x-figma-token'];

    if (!token) {
        return res.status(401).json({ error: 'Missing X-Figma-Token header' });
    }

    try {
        console.log(`[Proxy] Fetching Figma file: ${key}`);
        const response = await fetch(`https://api.figma.com/v1/files/${key}`, {
            headers: {
                'X-Figma-Token': token
            }
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('[Proxy] Figma API Error:', error);
            return res.status(response.status).send(error);
        }

        const data = await response.json();
        console.log('[Proxy] Figma file fetched successfully');
        res.json(data);

    } catch (error) {
        console.error('[Proxy] Figma Request Failed:', error);
        res.status(500).json({ error: error.message });
    }
});

async function tryFallbackModel(prompt, res) {
    try {
        const response = await fetch(
            'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-3.5-large',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: prompt })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('[Proxy] Fallback Error:', error);
            return res.status(response.status).json({ error: `Fallback Error: ${error}` });
        }

        await processResponse(response, res);
    } catch (error) {
        console.error('[Proxy] Fallback Exception:', error);
        res.status(500).json({ error: error.message });
    }
}

async function processResponse(response, res) {
    console.log('[Proxy] Converting image to base64...');
    const blob = await response.blob();
    console.log('[Proxy] Blob size:', blob.size, 'bytes');

    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log('[Proxy] Image generated successfully');
    console.log('[Proxy] ===== REQUEST COMPLETE =====');

    res.json({ imageUrl: dataUrl });
}

// Health check endpoint
app.get('/health', (req, res) => {
    console.log('[Proxy] Health check');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`[Proxy] ===== SERVER STARTED =====`);
    console.log(`[Proxy] Server running on http://localhost:${PORT}`);
    console.log(`[Proxy] Using router.huggingface.co with FLUX.1 + SD3.5 fallback`);
});
