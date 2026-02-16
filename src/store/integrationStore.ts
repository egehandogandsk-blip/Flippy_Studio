import { create } from 'zustand';

export type EngineType = 'Unity' | 'Unreal' | 'Godot';

export interface GameScreen {
    id: string;
    name: string;
    selected: boolean;
    lastUpdated?: string;
    description?: string;
    thumbnail?: string; // Placeholder for future
}

interface EngineConfig {
    isConnected: boolean;
    repoUrl: string;
    lastSynced: string | null;
    hasChanges: boolean;
    availableScreens: GameScreen[];
}

interface IntegrationState {
    isModalOpen: boolean;
    activeEngine: EngineType | null;
    engines: Record<EngineType, EngineConfig>;
    openModal: (engine: EngineType) => void;
    closeModal: () => void;
    connectRepo: (engine: EngineType, url: string) => Promise<void>;
    toggleScreenSelection: (engine: EngineType, screenId: string) => void;
    syncChanges: (engine: EngineType) => Promise<void>;
    importScreens: (engine: EngineType) => Promise<GameScreen[]>;
    pushChanges: (engine: EngineType, message?: string) => Promise<void>;
    registerChange: (engine: EngineType) => void;
}

// ...

// Mock Data
const MOCK_SCREENS: Record<EngineType, GameScreen[]> = {
    Unity: [
        { id: 'u_main', name: 'MainMenu_Canvas', selected: false, lastUpdated: '2 mins ago', description: 'Primary entry point with navigation buttons.' },
        { id: 'u_hud', name: 'HUD_Panel', selected: false, lastUpdated: '1 hour ago', description: 'Heads-up display showing health, ammo, and map.' },
        { id: 'u_inv', name: 'Inventory_Grid', selected: false, lastUpdated: '3 hours ago', description: 'Grid-based inventory system with drag-drop.' },
        { id: 'u_sets', name: 'Settings_Window', selected: false, lastUpdated: '1 day ago', description: 'Audio, graphics, and gameplay configuration.' },
        { id: 'u_char', name: 'Character_Select', selected: false, lastUpdated: '2 days ago', description: '3D character preview and selection interface.' },
        { id: 'u_lvl', name: 'Level_Selection', selected: false, lastUpdated: '5 days ago', description: 'World map with level progression status.' },
        { id: 'u_pause', name: 'Pause_Menu', selected: false, lastUpdated: '1 week ago', description: 'In-game overlay with resume and quit options.' },
        { id: 'u_gameover', name: 'GameOver_Screen', selected: false, lastUpdated: '1 week ago', description: 'End-of-session summary and restart controls.' }
    ],
    Unreal: [
        { id: 'ue_main', name: 'WBP_MainMenu_v2', selected: false, lastUpdated: '10 mins ago', description: 'AAA Title Screen with news feed and dynamic background.' },
        { id: 'ue_lobby', name: 'WBP_Lobby_Squad', selected: false, lastUpdated: '1 hour ago', description: 'Pre-match squad view with 3D character rendering.' },
        { id: 'ue_loadout', name: 'WBP_Loadout_Select', selected: false, lastUpdated: '2 hours ago', description: 'Class selection screen (Assault, Medic, Recon).' },
        { id: 'ue_gunsmith', name: 'WBP_Gunsmith_Detail', selected: false, lastUpdated: '3 hours ago', description: 'Deep weapon customization with attachment slots.' },
        { id: 'ue_operator', name: 'WBP_Operator_Select', selected: false, lastUpdated: '5 hours ago', description: 'Character skins and bio selection interface.' },
        { id: 'ue_bp', name: 'WBP_BattlePass_S1', selected: false, lastUpdated: '1 day ago', description: 'Seasonal reward track with free/premium tiers.' },
        { id: 'ue_store', name: 'WBP_Store_Featured', selected: false, lastUpdated: '1 day ago', description: 'Microtransaction store with bundles and rotation.' },
        { id: 'ue_settings', name: 'WBP_Settings_Adv', selected: false, lastUpdated: '2 days ago', description: 'Tabbed settings (Graphics, Audio, Keybinds).' },
        { id: 'ue_match', name: 'WBP_Matchmaking', selected: false, lastUpdated: '2 days ago', description: 'Searching for server overlay with estimated time.' },
        { id: 'ue_load', name: 'WBP_Loading_Map', selected: false, lastUpdated: '3 days ago', description: 'Level loading screen with tips and lore.' },
        { id: 'ue_hud', name: 'WBP_HUD_Tactical', selected: false, lastUpdated: '4 days ago', description: 'In-game HUD with compass, squad status, and objectives.' },
        { id: 'ue_score', name: 'WBP_Scoreboard', selected: false, lastUpdated: '4 days ago', description: 'Multiplayer match statistics table (K/D/A).' },
        { id: 'ue_map', name: 'WBP_TacMap_Deploy', selected: false, lastUpdated: '5 days ago', description: 'Full-screen tactical map for spawn selection.' },
        { id: 'ue_aar', name: 'WBP_AfterAction', selected: false, lastUpdated: '1 week ago', description: 'Post-match summary, XP gain, and unlocks.' },
        { id: 'ue_social', name: 'WBP_Social_Hub', selected: false, lastUpdated: '1 week ago', description: 'Friends list, party management, and recent players.' },
        { id: 'ue_daily', name: 'WBP_Challenges', selected: false, lastUpdated: '2 weeks ago', description: 'Daily and weekly mission tracking overlay.' }
    ],
    Godot: [
        { id: 'g_main', name: 'MainMenu.tscn', selected: false, lastUpdated: 'Just now', description: 'Main menu scene.' },
        { id: 'g_hud', name: 'HUD.tscn', selected: false, lastUpdated: '2 hours ago', description: 'HUD scene.' },
        { id: 'g_pause', name: 'PauseMenu.tscn', selected: false, lastUpdated: 'Yesterday', description: 'Pause menu popup.' }
    ]
};

export const useIntegrationStore = create<IntegrationState>((set, get) => ({
    isModalOpen: false,
    activeEngine: null,
    engines: {
        Unity: {
            isConnected: false,
            repoUrl: '',
            lastSynced: null,
            hasChanges: false,
            availableScreens: [...MOCK_SCREENS.Unity]
        },
        Unreal: {
            isConnected: false,
            repoUrl: '',
            lastSynced: null,
            hasChanges: false,
            availableScreens: [...MOCK_SCREENS.Unreal]
        },
        Godot: {
            isConnected: false,
            repoUrl: '',
            lastSynced: null,
            hasChanges: false,
            availableScreens: [...MOCK_SCREENS.Godot]
        }
    },

    openModal: (engine) => set({ isModalOpen: true, activeEngine: engine }),
    closeModal: () => set({ isModalOpen: false, activeEngine: null }),

    connectRepo: async (engine, url) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        set(state => ({
            engines: {
                ...state.engines,
                [engine]: {
                    ...state.engines[engine],
                    isConnected: true,
                    repoUrl: url,
                    availableScreens: [...MOCK_SCREENS[engine]] // Reset screens
                }
            }
        }));
    },

    toggleScreenSelection: (engine, screenId) => set(state => ({
        engines: {
            ...state.engines,
            [engine]: {
                ...state.engines[engine],
                availableScreens: state.engines[engine].availableScreens.map(s =>
                    s.id === screenId ? { ...s, selected: !s.selected } : s
                )
            }
        }
    })),

    syncChanges: async (engine) => {
        // Simulate sync operation
        await new Promise(resolve => setTimeout(resolve, 2000));

        set(state => ({
            engines: {
                ...state.engines,
                [engine]: {
                    ...state.engines[engine],
                    lastSynced: new Date().toISOString(),
                    hasChanges: false
                }
            }
        }));
    },

    syncChanges: async (engine) => {
        // Simulate sync operation
        await new Promise(resolve => setTimeout(resolve, 2000));

        set(state => ({
            engines: {
                ...state.engines,
                [engine]: {
                    ...state.engines[engine],
                    lastSynced: new Date().toISOString(),
                    hasChanges: false
                }
            }
        }));
    },

    importScreens: async (engine) => {
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        const state = get();
        const selectedScreens = state.engines[engine].availableScreens.filter(s => s.selected);

        // Mark as synced initially
        set(state => ({
            isModalOpen: false, // Close modal after import
            engines: {
                ...state.engines,
                [engine]: {
                    ...state.engines[engine],
                    lastSynced: new Date(),
                    hasChanges: true // Set to true immediately for demo purposes (to show Upload flow next time)
                }
            }
        }));

        return selectedScreens;
    },

    pushChanges: async (engine, _message) => {
        // Simulate git push
        await new Promise(resolve => setTimeout(resolve, 2000));

        set(state => ({
            isModalOpen: false,
            engines: {
                ...state.engines,
                [engine]: {
                    ...state.engines[engine],
                    lastSynced: new Date(),
                    hasChanges: false
                }
            }
        }));
    },

    registerChange: (engine) => set(state => ({
        engines: {
            ...state.engines,
            [engine]: {
                ...state.engines[engine],
                hasChanges: true
            }
        }
    }))
}));
