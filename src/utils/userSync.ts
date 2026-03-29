import { prisma } from '../lib/prisma';

interface ClerkUser {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
}

/**
 * Syncs a Clerk user to the database
 * Called after user signs up or signs in
 */
export async function syncUserWithDatabase(clerkUser: ClerkUser) {
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
        throw new Error('User email not found');
    }

    const name = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(' ') || null;

    // Upsert user in database
    const user = await prisma.user.upsert({
        where: { clerkId: clerkUser.id },
        update: {
            email,
            name,
            avatarUrl: clerkUser.imageUrl,
            updatedAt: new Date(),
        },
        create: {
            clerkId: clerkUser.id,
            email,
            name,
            avatarUrl: clerkUser.imageUrl,
            planType: 'lite',
        },
    });

    return user;
}

/**
 * Gets user from database by Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
        where: { clerkId },
        include: { projects: true },
    });
}

/**
 * Updates user's subscription plan
 */
export async function updateUserPlan(clerkId: string, planType: string, stripeCustomerId?: string) {
    return await prisma.user.update({
        where: { clerkId },
        data: {
            planType,
            ...(stripeCustomerId && { stripeCustomerId }),
            updatedAt: new Date(),
        },
    });
}
