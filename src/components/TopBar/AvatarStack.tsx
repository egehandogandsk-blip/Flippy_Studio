import React from 'react';

interface AvatarStackProps {
    maxVisible?: number;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({ maxVisible = 3 }) => {
    // Mock user data - in real app, this would come from props or store
    const users = [
        { id: 1, name: 'User 1', color: '#6366f1' },
        { id: 2, name: 'User 2', color: '#8b5cf6' },
        { id: 3, name: 'User 3', color: '#ec4899' },
    ];

    return (
        <div className="flex items-center -space-x-2">
            {users.slice(0, maxVisible).map((user, index) => (
                <div
                    key={user.id}
                    className="w-7 h-7 rounded-full border-2 border-[#121212] flex items-center justify-center text-[11px] font-medium text-white"
                    style={{
                        backgroundColor: user.color,
                        zIndex: maxVisible - index
                    }}
                    title={user.name}
                >
                    {user.name.charAt(0)}
                </div>
            ))}
        </div>
    );
};
