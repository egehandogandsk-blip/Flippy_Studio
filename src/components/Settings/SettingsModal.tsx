import React, { useState } from 'react';
import { X, User, Plug, Settings as SettingsIcon, Sparkles, Users } from 'lucide-react';
import { AccountSection } from './sections/AccountSection';
import { IntegrationSection } from './sections/IntegrationSection';
import { EditorSection } from './sections/EditorSection';
import { AISection } from './sections/AISection';
import { WorkspaceSection } from './sections/WorkspaceSection';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SettingsTab = 'account' | 'integration' | 'editor' | 'ai' | 'workspace';

const tabs = [
    { id: 'account' as const, label: 'Account & Security', icon: User },
    { id: 'integration' as const, label: 'Integration & Bridge', icon: Plug },
    { id: 'editor' as const, label: 'Editor Preferences', icon: SettingsIcon },
    { id: 'ai' as const, label: 'AI & Assets', icon: Sparkles },
    { id: 'workspace' as const, label: 'Workspace', icon: Users }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');

    if (!isOpen) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return <AccountSection />;
            case 'integration':
                return <IntegrationSection />;
            case 'editor':
                return <EditorSection />;
            case 'ai':
                return <AISection />;
            case 'workspace':
                return <WorkspaceSection />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-5xl h-[85vh] bg-[#141414] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex">
                {/* Sidebar Navigation */}
                <div className="w-64 border-r border-purple-500/20 bg-[#0f0f0f] p-4 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Settings
                        </h2>
                        <p className="text-white/40 text-xs mt-1">Manage your preferences</p>
                    </div>

                    <nav className="space-y-1 flex-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${activeTab === tab.id
                                            ? 'bg-purple-600 text-white'
                                            : 'text-white/70 hover:bg-[#1a1a1a] hover:text-white'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="border-b border-purple-500/20 p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
