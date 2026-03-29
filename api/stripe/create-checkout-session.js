import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { planType, userId, userEmail } = req.body;

        if (!planType) {
            return res.status(400).json({ error: 'Plan type is required' });
        }

        const priceIds = {
            starter: process.env.STRIPE_PRICE_STARTER,
            pro: process.env.STRIPE_PRICE_PRO,
            studio: process.env.STRIPE_PRICE_STUDIO,
        };

        const priceId = priceIds[planType];

        if (!priceId) {
            return res.status(400).json({ error: 'Invalid plan type' });
        }

        // Dynamic base URL based on environment
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const baseUrl = `${protocol}://${host}`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/subscription/cancel`,
            customer_email: userEmail,
            client_reference_id: userId,
            metadata: {
                planType,
                userId,
            },
            subscription_data: {
                metadata: {
                    planType,
                    userId
                }
            }
        });

        res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
