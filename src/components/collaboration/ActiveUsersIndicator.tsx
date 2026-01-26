import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useCanvasSessionStore } from '../../store/useCanvasSessionStore';
import { subscribeToActiveUsers } from '../../services/firestoreSync';
import type { ActiveUser } from '../../models/CanvasSession';

export const ActiveUsersIndicator: React.FC = () => {
    const { currentSessionId } = useCanvasSessionStore();
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

    useEffect(() => {
        if (!currentSessionId) return;

        const unsubscribe = subscribeToActiveUsers(currentSessionId, (users) => {
            setActiveUsers(users);
        });

        return () => unsubscribe();
    }, [currentSessionId]);

    if (!currentSessionId || activeUsers.length === 0) return null;

    return (
        <div className="flex items-center gap-2 text-sm text-neutral-600" title={`${activeUsers.length} active user${activeUsers.length !== 1 ? 's' : ''}`}>
            <Users className="w-4 h-4" />
            <span>{activeUsers.length}</span>
        </div>
    );
};
