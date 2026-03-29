import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InfiniteCanvas } from '../components/canvas/InfiniteCanvas';

interface PublicProject {
    id: string;
    name: string;
    data: {
        nodes: Record<string, any>;
    };
    user: {
        name: string;
        avatarUrl: string;
    };
    createdAt: string;
}

export default function PublicProjectViewer() {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<PublicProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProject() {
            try {
                const response = await fetch(`/api/projects/public/${slug}`);
                if (!response.ok) {
                    throw new Error('Project not found');
                }
                const data = await response.json();
                setProject(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load project');
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            loadProject();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
                <div className="text-white">Loading project...</div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
                <div className="text-center">
                    <h1 className="text-2xl text-white mb-2">Project Not Found</h1>
                    <p className="text-white/50">{error || 'This project does not exist or is private'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a]">
            {/* Header */}
            <div className="h-16 bg-[#141414] border-b border-purple-500/20 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <img
                        src={project.user.avatarUrl}
                        alt={project.user.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h1 className="text-white font-semibold">{project.name}</h1>
                        <p className="text-white/50 text-sm">by {project.user.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
                        Clone Project
                    </button>
                    <button className="px-4 py-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white text-sm rounded-lg transition-colors">
                        Share
                    </button>
                </div>
            </div>

            {/* Read-only Canvas */}
            <div className="flex-1 relative">
                <InfiniteCanvas readonly initialNodes={project.data.nodes} />
            </div>

            {/* Footer */}
            <div className="h-12 bg-[#141414] border-t border-purple-500/20 flex items-center justify-center">
                <p className="text-white/40 text-sm">
                    Powered by <span className="text-purple-400 font-semibold">Flippy</span>
                </p>
            </div>
        </div>
    );
}
