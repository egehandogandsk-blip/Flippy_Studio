import React, { useState, useRef } from 'react';
import { useSettingsStore } from '../../../store/settingsStore';
import { Shield, CreditCard, LogOut, Upload, Check, X } from 'lucide-react';
import { SubscriptionModal } from '../../Subscription/SubscriptionModal';

export const AccountSection: React.FC = () => {
    const { account, updateAccount } = useSettingsStore();
    const [localUsername, setLocalUsername] = useState(account.username);
    const [localEmail, setLocalEmail] = useState(account.email);
    const [hasChanges, setHasChanges] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', repeat: '' });
    const [passwordError, setPasswordError] = useState('');
    const [showUpgrade, setShowUpgrade] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tierLabels = {
        lite: 'Flippy Lite',
        starter: 'Flippy Starter',
        pro: 'Flippy Pro',
        studio: 'Flippy Enterprise'
    };

    const handleInputChange = (field: 'username' | 'email', value: string) => {
        if (field === 'username') {
            setLocalUsername(value);
            setHasChanges(value !== account.username || localEmail !== account.email);
        } else {
            setLocalEmail(value);
            setHasChanges(localUsername !== account.username || value !== account.email);
        }
    };

    const handleSave = () => {
        updateAccount({ username: localUsername, email: localEmail });
        setHasChanges(false);
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateAccount({ avatarUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = () => {
        // Validation
        if (!passwords.current) {
            setPasswordError('Current password is required');
            return;
        }
        if (passwords.new.length < 8) {
            setPasswordError('New password must be at least 8 characters');
            return;
        }
        if (passwords.new !== passwords.repeat) {
            setPasswordError('Passwords do not match');
            return;
        }

        // Success
        setPasswordError('');
        setPasswords({ current: '', new: '', repeat: '' });
        setShowPasswordChange(false);

        // Show success notification (could use toast library)
        alert('Password changed successfully!');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(account.flippyId);
    };

    return (
        <>
            <SubscriptionModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />

            <div className="space-y-6">
                {/* Profile Info */}
                <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-purple-400" />
                        Profile & Identity
                    </h4>

                    <div className="space-y-4">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <img
                                src={account.avatarUrl}
                                alt={account.username}
                                className="w-16 h-16 rounded-full border-2 border-purple-500/50"
                            />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Upload size={16} />
                                Change Avatar
                            </button>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Username</label>
                            <input
                                type="text"
                                value={localUsername}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className="w-full bg-[#2C2C2C] border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Email</label>
                            <input
                                type="email"
                                value={localEmail}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full bg-[#2C2C2C] border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                            />
                        </div>

                        {/* Flippy ID */}
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Flippy ID</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={account.flippyId}
                                    readOnly
                                    className="flex-1 bg-[#2C2C2C]/50 border border-purple-500/20 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                                >
                                    Copy
                                </button>
                            </div>
                            <p className="text-white/40 text-xs mt-1">Used for collaboration invites</p>
                        </div>

                        {/* Save Button */}
                        {hasChanges && (
                            <button
                                onClick={handleSave}
                                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Check size={16} />
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>

                {/* Subscription */}
                <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <CreditCard size={18} className="text-purple-400" />
                        Subscription
                    </h4>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{tierLabels[account.tier]}</p>
                                <p className="text-white/50 text-sm">Current plan</p>
                            </div>
                            <button
                                onClick={() => setShowUpgrade(true)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                                Upgrade Plan
                            </button>
                        </div>

                        <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                            View billing history →
                        </button>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4">Security</h4>

                    <div className="space-y-4">
                        {/* 2FA Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Two-Factor Authentication</p>
                                <p className="text-white/50 text-sm">Add extra security to your account</p>
                            </div>
                            <button
                                onClick={() => updateAccount({ twoFactorEnabled: !account.twoFactorEnabled })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${account.twoFactorEnabled ? 'bg-purple-600' : 'bg-[#3C3C3C]'
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${account.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Change Password Button */}
                        {!showPasswordChange && (
                            <button
                                onClick={() => setShowPasswordChange(true)}
                                className="px-4 py-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white text-sm rounded-lg transition-colors"
                            >
                                Change Password
                            </button>
                        )}

                        {/* Password Change Form */}
                        {showPasswordChange && (
                            <div className="space-y-3 p-4 bg-[#2C2C2C] rounded-lg animate-fadeIn">
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-purple-500/20 rounded px-3 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-purple-500/20 rounded px-3 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">Repeat Password</label>
                                    <input
                                        type="password"
                                        value={passwords.repeat}
                                        onChange={(e) => setPasswords({ ...passwords, repeat: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-purple-500/20 rounded px-3 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                                    />
                                </div>

                                {passwordError && (
                                    <p className="text-red-400 text-sm">{passwordError}</p>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePasswordChange}
                                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check size={16} />
                                        Save Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPasswordChange(false);
                                            setPasswords({ current: '', new: '', repeat: '' });
                                            setPasswordError('');
                                        }}
                                        className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#141414] text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4">Active Sessions</h4>

                    <div className="space-y-3">
                        {(account.activeSessions || []).map((session) => (
                            <div
                                key={session.id}
                                className="flex items-center justify-between p-3 bg-[#2C2C2C] rounded-lg"
                            >
                                <div>
                                    <p className="text-white font-medium flex items-center gap-2">
                                        {session.deviceName}
                                        {session.current && (
                                            <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded">
                                                Current
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-white/50 text-sm">{session.location}</p>
                                    <p className="text-white/40 text-xs">Last active: {new Date(session.lastActive).toLocaleString()}</p>
                                </div>
                                {!session.current && (
                                    <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                                        <LogOut size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
