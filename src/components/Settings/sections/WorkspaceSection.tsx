import React, { useState } from 'react';
import { useSettingsStore } from '../../../store/settingsStore';
import { Users, Plus, Trash2, Send } from 'lucide-react';

export const WorkspaceSection: React.FC = () => {
    const { workspace, addTeamMember, removeTeamMember } = useSettingsStore();
    const [showInviteRow, setShowInviteRow] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
    const [pendingInvites, setPendingInvites] = useState<Set<string>>(new Set());

    const handleInvite = () => {
        if (!inviteEmail) return;

        const newMember = {
            id: `member_${Date.now()}`,
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: inviteRole,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteEmail}`
        };

        addTeamMember(newMember);
        setPendingInvites(new Set([...pendingInvites, newMember.id]));
        setInviteEmail('');
        setShowInviteRow(false);
    };

    const handleRemove = (memberId: string) => {
        removeTeamMember(memberId);
        const newPending = new Set(pendingInvites);
        newPending.delete(memberId);
        setPendingInvites(newPending);
    };

    return (
        <div className="space-y-6">
            {/* Team Members */}
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                        <Users size={18} className="text-purple-400" />
                        Team Members
                    </h4>
                    <button
                        onClick={() => setShowInviteRow(!showInviteRow)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Add Member
                    </button>
                </div>

                {/* Invite Row */}
                {showInviteRow && (
                    <div className="mb-4 p-3 bg-[#2C2C2C] rounded-lg border border-purple-500/30 animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@example.com"
                                className="flex-1 bg-[#1a1a1a] border border-purple-500/20 rounded px-3 py-2 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none"
                            />
                            <select
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                                className="bg-[#1a1a1a] border border-purple-500/20 rounded px-3 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                            >
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>
                            <button
                                onClick={handleInvite}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Send size={16} />
                                Invite
                            </button>
                        </div>
                    </div>
                )}

                {workspace.teamMembers.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-white/50">No team members yet</p>
                        <p className="text-white/40 text-sm mt-1">Add your first collaborator to get started</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {workspace.teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-3 bg-[#2C2C2C] rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={member.avatarUrl}
                                        alt={member.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="text-white font-medium">{member.name}</p>
                                        <p className="text-white/50 text-sm">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={member.role}
                                        className="bg-[#1a1a1a] border border-purple-500/20 rounded px-3 py-1.5 text-white text-sm"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                    <button
                                        onClick={() => handleRemove(member.id)}
                                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Shared Libraries */}
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4">Shared Libraries</h4>

                {workspace.sharedLibraries.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-white/50">No shared libraries</p>
                        <p className="text-white/40 text-sm mt-1">Create libraries to share assets across your team</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {workspace.sharedLibraries.map((library) => (
                            <div
                                key={library.id}
                                className="flex items-center justify-between p-3 bg-[#2C2C2C] rounded-lg"
                            >
                                <div>
                                    <p className="text-white font-medium">{library.name}</p>
                                    <p className="text-white/50 text-sm capitalize">
                                        {library.type} • {library.itemCount} items
                                    </p>
                                </div>
                                <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                                    Manage
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
