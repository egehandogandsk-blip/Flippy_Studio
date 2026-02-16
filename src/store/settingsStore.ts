import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DeviceSession {
    id: string;
    deviceName: string;
    location: string;
    lastActive: string;
    current: boolean;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    avatarUrl: string;
}

export interface SharedLibrary {
    id: string;
    name: string;
    type: 'colors' | 'components' | 'assets';
    itemCount: number;
}

export interface SettingsState {
    // Account & Security
    account: {
        userId: string;
        username: string;
        email: string;
        flippyId: string;
        avatarUrl: string;
        tier: 'lite' | 'starter' | 'pro' | 'studio';
        twoFactorEnabled: boolean;
        activeSessions: DeviceSession[];
    };

    // Integration & Engine Bridge
    integration: {
        githubConnected: boolean;
        githubRepo: string;
        enginePath: string | null;
        engineType: 'unity' | 'unreal' | null;
        pluginVersion: string | null;
        bridgeStatus: 'disconnected' | 'connecting' | 'connected';
        apiKeys: {
            stableDiffusion: string;
            layerAI: string;
            custom: string;
        };
    };

    // Editor Preferences
    editor: {
        theme: 'dark' | 'light' | 'high-contrast';
        gridEnabled: boolean;
        snapToGrid: boolean;
        snapTolerance: number; // pixels
        autoSaveInterval: number; // minutes
        shortcuts: Record<string, string>;
    };

    // AI & Asset Management
    ai: {
        defaultModel: 'stable-diffusion' | 'dalle' | 'midjourney';
        namingTemplate: string;
        storageUsed: number; // bytes
        storageLimit: number; // bytes
    };

    // Workspace & Collaboration
    workspace: {
        teamMembers: TeamMember[];
        sharedLibraries: SharedLibrary[];
    };

    // Actions
    setSetting: (path: string, value: any) => void;
    updateAccount: (updates: Partial<SettingsState['account']>) => void;
    updateIntegration: (updates: Partial<SettingsState['integration']>) => void;
    updateEditor: (updates: Partial<SettingsState['editor']>) => void;
    updateAI: (updates: Partial<SettingsState['ai']>) => void;
    updateWorkspace: (updates: Partial<SettingsState['workspace']>) => void;
    addTeamMember: (member: TeamMember) => void;
    removeTeamMember: (memberId: string) => void;
    subscribe: (observer: SettingObserver) => () => void;
}

type SettingObserver = (path: string, value: any) => void;

// Observer registry
const observers = new Set<SettingObserver>();

const notifyObservers = (path: string, value: any) => {
    observers.forEach(fn => {
        try {
            fn(path, value);
        } catch (error) {
            console.error('Observer error:', error);
        }
    });
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            // Default state
            account: {
                userId: 'user_001',
                username: 'John Doe',
                email: 'john@example.com',
                flippyId: 'FL-JD-2024',
                avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
                tier: 'lite',
                twoFactorEnabled: false,
                activeSessions: [
                    {
                        id: 'session_1',
                        deviceName: 'MacBook Pro',
                        location: 'Istanbul, Turkey',
                        lastActive: new Date().toISOString(),
                        current: true
                    }
                ]
            },

            integration: {
                githubConnected: false,
                githubRepo: '',
                enginePath: null,
                engineType: null,
                pluginVersion: null,
                bridgeStatus: 'disconnected',
                apiKeys: {
                    stableDiffusion: '',
                    layerAI: '',
                    custom: ''
                }
            },

            editor: {
                theme: 'dark',
                gridEnabled: true,
                snapToGrid: true,
                snapTolerance: 5,
                autoSaveInterval: 5,
                shortcuts: {
                    select: 'V',
                    move: 'H',
                    rectangle: 'R',
                    ellipse: 'C',
                    text: 'T',
                    frame: 'F'
                }
            },

            ai: {
                defaultModel: 'stable-diffusion',
                namingTemplate: '{project}_{type}_{date}',
                storageUsed: 128 * 1024 * 1024, // 128 MB
                storageLimit: 500 * 1024 * 1024  // 500 MB for lite
            },

            workspace: {
                teamMembers: [],
                sharedLibraries: []
            },

            // Universal setter with observer notification
            setSetting: (path: string, value: any) => {
                const keys = path.split('.');
                set((state) => {
                    const newState = { ...state };
                    let current: any = newState;

                    // Navigate to the nested property
                    for (let i = 0; i < keys.length - 1; i++) {
                        current[keys[i]] = { ...current[keys[i]] };
                        current = current[keys[i]];
                    }

                    // Set the value
                    current[keys[keys.length - 1]] = value;
                    return newState;
                });

                // Notify observers
                notifyObservers(path, value);

                // Trigger specific handlers
                if (path.startsWith('integration.enginePath')) {
                    console.log('[Settings] Engine path changed, verifying connection...');
                    // BridgeProtocol.verifyPath(value) will be called here
                }
                if (path.startsWith('account.tier')) {
                    console.log('[Settings] Subscription tier changed, recalculating features...');
                    // FeatureMatrix.recalculate() will be called here
                }
            },

            updateAccount: (updates) => {
                set((state) => ({
                    account: { ...state.account, ...updates }
                }));
                Object.entries(updates).forEach(([key, value]) => {
                    notifyObservers(`account.${key}`, value);
                });
            },

            updateIntegration: (updates) => {
                set((state) => ({
                    integration: { ...state.integration, ...updates }
                }));
                Object.entries(updates).forEach(([key, value]) => {
                    notifyObservers(`integration.${key}`, value);
                });
            },

            updateEditor: (updates) => {
                set((state) => ({
                    editor: { ...state.editor, ...updates }
                }));
                Object.entries(updates).forEach(([key, value]) => {
                    notifyObservers(`editor.${key}`, value);
                });
            },

            updateAI: (updates) => {
                set((state) => ({
                    ai: { ...state.ai, ...updates }
                }));
                Object.entries(updates).forEach(([key, value]) => {
                    notifyObservers(`ai.${key}`, value);
                });
            },

            updateWorkspace: (updates) => {
                set((state) => ({
                    workspace: { ...state.workspace, ...updates }
                }));
                Object.entries(updates).forEach(([key, value]) => {
                    notifyObservers(`workspace.${key}`, value);
                });
            },

            addTeamMember: (member) => {
                set((state) => ({
                    workspace: {
                        ...state.workspace,
                        teamMembers: [...state.workspace.teamMembers, member]
                    }
                }));
                notifyObservers('workspace.teamMembers', get().workspace.teamMembers);
            },

            removeTeamMember: (memberId) => {
                set((state) => ({
                    workspace: {
                        ...state.workspace,
                        teamMembers: state.workspace.teamMembers.filter(m => m.id !== memberId)
                    }
                }));
                notifyObservers('workspace.teamMembers', get().workspace.teamMembers);
            },

            subscribe: (observer: SettingObserver) => {
                observers.add(observer);
                return () => observers.delete(observer);
            }
        }),
        {
            name: 'flippy-settings',
            // Only persist critical settings, not session data
            partialize: (state) => ({
                account: {
                    username: state.account.username,
                    email: state.account.email,
                    tier: state.account.tier,
                    twoFactorEnabled: state.account.twoFactorEnabled
                },
                integration: {
                    enginePath: state.integration.enginePath,
                    engineType: state.integration.engineType
                },
                editor: state.editor,
                ai: {
                    defaultModel: state.ai.defaultModel,
                    namingTemplate: state.ai.namingTemplate
                }
            })
        }
    )
);
