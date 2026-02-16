import React, { useState, useRef, useEffect } from 'react';
import { SignOutButton } from '@clerk/clerk-react';
import { CreditCard, Settings, FolderOpen, ChevronDown, LogOut } from 'lucide-react';
import { SubscriptionModal } from '../Subscription/SubscriptionModal';
import { SettingsModal } from '../Settings/SettingsModal';

export const ProfileMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSubscription, setShowSubscription] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Mock user data - replace with real auth later
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        membershipType: 'Free' as 'Free' | 'Pro'
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const menuItems = [
        {
            icon: CreditCard,
            label: 'Subscription',
            description: 'Manage your plan',
            action: () => {
                setShowSubscription(true);
                setIsOpen(false);
            }
        },
        {
            icon: Settings,
            label: 'Settings',
            description: 'Account preferences',
            action: () => {
                setShowSettings(true);
                setIsOpen(false);
            }
        },
        {
            icon: FolderOpen,
            label: 'Workspace',
            description: 'Workspace settings',
            action: () => {
                console.log('Navigate to Workspace');
                setIsOpen(false);
            }
        }
    ];

    return (
        <>
            <SubscriptionModal isOpen={showSubscription} onClose={() => setShowSubscription(false)} />
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

            <div className="relative" ref={menuRef}>
                {/* Trigger Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-[#2C2C2C] transition-colors group"
                >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500/30 group-hover:border-purple-500/50 transition-colors">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1.5">
                            <span className="text-white text-xs font-medium">{user.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${user.membershipType === 'Pro'
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'bg-[#2C2C2C] text-white/60'
                                }`}>
                                {user.membershipType}
                            </span>
                        </div>
                    </div>

                    {/* Chevron */}
                    <ChevronDown
                        size={14}
                        className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div
                        className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a1a] border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm z-[400]"
                        style={{
                            animation: 'fadeSlideIn 0.2s ease-out',
                        }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-purple-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/50">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                                    <p className="text-white/50 text-xs truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={item.action}
                                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#2C2C2C] transition-colors group"
                                >
                                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                                        <item.icon size={16} className="text-purple-400" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-white text-sm font-medium">{item.label}</p>
                                        <p className="text-white/40 text-xs">{item.description}</p>
                                    </div>
                                </button>
                            ))}

                            <div className="border-t border-purple-500/10 mt-1 pt-1">
                                <SignOutButton>
                                    <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-500/10 transition-colors group">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                                            <LogOut size={16} className="text-red-400" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-red-400 text-sm font-medium">Log Out</p>
                                            <p className="text-red-400/50 text-xs">Sign out of your account</p>
                                        </div>
                                    </button>
                                </SignOutButton>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}</style>
            </div>
        </>
    );
};

