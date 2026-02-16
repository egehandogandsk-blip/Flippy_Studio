import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export async function createCheckoutSession(planType: 'starter' | 'pro' | 'studio') {
    try {
        const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ planType }),
        });

        const { sessionId } = await response.json();

        const stripe = await stripePromise;
        if (!stripe) {
            throw new Error('Stripe failed to load');
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
            console.error('Stripe checkout error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Checkout error:', error);
        throw error;
    }
}

export async function createPortalSession() {
    try {
        const response = await fetch('/api/stripe/create-portal-session', {
            method: 'POST',
        });

        const { url } = await response.json();
        window.location.href = url;
    } catch (error) {
        console.error('Portal error:', error);
        throw error;
    }
}
