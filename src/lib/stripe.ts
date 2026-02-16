import Stripe from 'stripe';

export const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
});

export const PRICING_PLANS = {
    lite: {
        name: 'Forge Lite',
        price: 0,
        priceId: null,
        features: [
            '3 Projects',
            'Basic Export',
            'Community Support',
        ],
    },
    starter: {
        name: 'Forge Starter',
        price: 9,
        priceId: import.meta.env.STRIPE_PRICE_STARTER,
        features: [
            '10 Projects',
            'AI Features',
            'Priority Export',
            'Email Support',
        ],
    },
    pro: {
        name: 'Forge Pro',
        price: 29,
        priceId: import.meta.env.STRIPE_PRICE_PRO,
        features: [
            'Unlimited Projects',
            'Advanced AI',
            'Team Collaboration',
            'Priority Support',
            'White-label Option',
        ],
    },
    studio: {
        name: 'Forge Studio',
        price: 99,
        priceId: import.meta.env.STRIPE_PRICE_STUDIO,
        features: [
            'Everything in Pro',
            'Custom Integrations',
            'Dedicated Account Manager',
            'SLA Guarantee',
            'Advanced Analytics',
        ],
    },
};
