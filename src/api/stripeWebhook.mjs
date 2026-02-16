import Stripe from 'stripe';
import { prisma } from './src/lib/prisma.ts';
import { updateUserPlan } from './src/utils/userSync.ts';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia',
});

/**
 * Stripe Webhook Handler
 * Processes subscription events from Stripe
 */
export async function handleStripeWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET not configured');
        return res.status(500).send('Webhook secret not configured');
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Stripe webhook event:', event.type);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                await handleCheckoutComplete(session);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                await handleSubscriptionUpdate(subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await handleSubscriptionCancel(subscription);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).send('Webhook handler failed');
    }
}

async function handleCheckoutComplete(session) {
    const { customer, client_reference_id, metadata } = session;

    if (!client_reference_id) {
        console.error('No client_reference_id in checkout session');
        return;
    }

    // client_reference_id should be the Clerk user ID
    const clerkId = client_reference_id;
    const planType = metadata?.planType || 'starter';

    await updateUserPlan(clerkId, planType, customer);
    console.log(`User ${clerkId} upgraded to ${planType}`);
}

async function handleSubscriptionUpdate(subscription) {
    const customerId = subscription.customer;

    const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        console.error(`User not found for Stripe customer: ${customerId}`);
        return;
    }

    // Determine plan type from subscription items
    const priceId = subscription.items.data[0]?.price.id;
    const planType = getPlanTypeFromPriceId(priceId);

    if (planType) {
        await updateUserPlan(user.clerkId, planType);
        console.log(`Subscription updated for user ${user.clerkId} to ${planType}`);
    }
}

async function handleSubscriptionCancel(subscription) {
    const customerId = subscription.customer;

    const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        console.error(`User not found for Stripe customer: ${customerId}`);
        return;
    }

    // Downgrade to lite plan
    await updateUserPlan(user.clerkId, 'lite');
    console.log(`User ${user.clerkId} downgraded to lite (subscription cancelled)`);
}

function getPlanTypeFromPriceId(priceId) {
    const pricePlans = {
        [process.env.STRIPE_PRICE_STARTER]: 'starter',
        [process.env.STRIPE_PRICE_PRO]: 'pro',
        [process.env.STRIPE_PRICE_STUDIO]: 'studio',
    };

    return pricePlans[priceId] || null;
}
