export default async function handler(req, res) {
    const { key } = req.query; // Vercel provides path parameters in query
    const token = req.headers['x-figma-token'];

    if (!token) {
        return res.status(401).json({ error: 'Missing X-Figma-Token header' });
    }

    try {
        console.log(`[API] Fetching Figma file: ${key}`);
        const response = await fetch(`https://api.figma.com/v1/files/${key}`, {
            headers: {
                'X-Figma-Token': token
            }
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('[API] Figma API Error:', error);
            return res.status(response.status).send(error);
        }

        const data = await response.json();
        console.log('[API] Figma file fetched successfully');
        res.json(data);

    } catch (error) {
        console.error('[API] Figma Request Failed:', error);
        res.status(500).json({ error: error.message });
    }
}
