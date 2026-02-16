export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const HF_API_KEY = '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';

    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL or Base64 is required' });
        }

        console.log('[API] Removing background...');

        // Convert Data URL to Blob/Buffer if needed, but HF accepts image directly usually
        // For Bria RMBG 1.4, we send the image

        // 1. If it's a base64 data URI, strip the prefix
        let imageInput = imageUrl;
        if (imageUrl.startsWith('data:image')) {
            imageInput = imageUrl.split(',')[1];
        }

        const response = await fetch(
            'https://router.huggingface.co/hf-inference/models/briaai/RMBG-1.4',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: imageInput
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('[API] HF RMBG Error:', error);
            return res.status(response.status).json({ error: `HF Error: ${error}` });
        }

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:image/png;base64,${base64}`;

        console.log('[API] Background removed successfully');
        res.status(200).json({ imageUrl: dataUrl });

    } catch (error) {
        console.error('[API] Error:', error);
        res.status(500).json({ error: error.message });
    }
}
