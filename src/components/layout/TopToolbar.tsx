import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuthStore } from '../../store/useAuthStore';

export const TopToolbar: React.FC = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user, setUser } = useAuthStore();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        if (isProfileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileMenuOpen]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsProfileMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const menuItems = [
        { label: 'Profile', icon: '👤', onClick: () => console.log('Profile clicked') },
        { label: 'Token', icon: '🔑', onClick: () => console.log('Token clicked') },
        { label: 'Settings', icon: '⚙️', onClick: () => console.log('Settings clicked') },
        { label: 'Log out', icon: '🚪', onClick: handleLogout, danger: true },
    ];

    return (
        <header className="h-12 bg-white border-b border-neutral-200 flex items-center px-4 justify-between z-10 shrink-0">
            <div className="font-bold text-lg tracking-wider text-indigo-600">forge</div>
            <div className="flex gap-2">
                {/* Placeholder tools */}
                <button className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors">File</button>
                <button className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors">Edit</button>
                <button className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors">View</button>
            </div>

            {/* User Profile with Dropdown */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white hover:scale-110 transition-transform duration-200 cursor-pointer"
                    title={user?.displayName || user?.email || 'User'}
                >
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span>{user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-neutral-200 py-2 z-50">
                        {/* User Info Header */}
                        <div className="px-4 py-2 border-b border-neutral-200">
                            <p className="text-sm font-semibold text-neutral-800 truncate">
                                {user?.displayName || 'User'}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                                {user?.email || 'dev@localhost'}
                            </p>
                        </div>

                        {/* Menu Items */}
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.onClick}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${item.danger
                                        ? 'text-red-600 hover:bg-red-50'
                                        : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};
