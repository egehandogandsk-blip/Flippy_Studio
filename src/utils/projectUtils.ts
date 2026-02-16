import { prisma } from '../lib/prisma';
import { nanoid } from 'nanoid';

interface ProjectData {
    nodes: Record<string, any>;
    // Add other canvas state as needed
}

/**
 * Save or update a project
 */
export async function saveProject(
    userId: string,
    projectId: string | null,
    name: string,
    data: ProjectData,
    thumbnail?: string
) {
    if (projectId) {
        // Update existing project
        return await prisma.project.update({
            where: { id: projectId },
            data: {
                name,
                data: data as any,
                thumbnail,
                updatedAt: new Date(),
            },
        });
    } else {
        // Create new project
        return await prisma.project.create({
            data: {
                userId,
                name,
                data: data as any,
                thumbnail,
            },
        });
    }
}

/**
 * Get all projects for a user
 */
export async function getUserProjects(userId: string) {
    return await prisma.project.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
    });
}

/**
 * Get a single project by ID
 */
export async function getProjectById(projectId: string) {
    return await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true },
    });
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string, userId: string) {
    // Verify ownership
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
    });

    if (!project) {
        throw new Error('Project not found or unauthorized');
    }

    return await prisma.project.delete({
        where: { id: projectId },
    });
}

/**
 * Publish a project (make it public)
 */
export async function publishProject(projectId: string, userId: string) {
    // Verify ownership
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
    });

    if (!project) {
        throw new Error('Project not found or unauthorized');
    }

    // Generate unique URL slug
    const slug = nanoid(10);
    const publicUrl = `p/${slug}`;

    return await prisma.project.update({
        where: { id: projectId },
        data: {
            isPublic: true,
            publicUrl,
        },
    });
}

/**
 * Unpublish a project
 */
export async function unpublishProject(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
    });

    if (!project) {
        throw new Error('Project not found or unauthorized');
    }

    return await prisma.project.update({
        where: { id: projectId },
        data: {
            isPublic: false,
        },
    });
}

/**
 * Get public project by URL slug
 */
export async function getPublicProject(slug: string) {
    return await prisma.project.findFirst({
        where: {
            publicUrl: `p/${slug}`,
            isPublic: true,
        },
        include: {
            user: {
                select: {
                    name: true,
                    avatarUrl: true,
                },
            },
        },
    });
}
