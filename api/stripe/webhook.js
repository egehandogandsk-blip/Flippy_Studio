import { handleStripeWebhook } from '../../src/api/stripeWebhook.mjs';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    return handleStripeWebhook(req, res);
}
