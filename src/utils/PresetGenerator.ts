import { FramePreset } from '../constants/framePresets';
import { generateId } from '../store/documentStore';
import { useDocumentStore } from '../store/documentStore';
import { calculateNextPosition } from './positionUtils';

const createId = generateId;

export const generateGamePreset = (preset: FramePreset) => {
    const { addNode } = useDocumentStore.getState().actions;
    const { rootId } = useDocumentStore.getState();
    const frameId = createId();

    // 1. Create Base Frame
    const { x, y } = calculateNextPosition(preset.w, preset.h);
    addNode({
        id: frameId,
        type: 'FRAME',
        name: preset.name,
        x,
        y,
        width: preset.w,
        height: preset.h,
        parentId: rootId,
        children: [],
        layout: { layoutMode: 'NONE' },
        style: {
            fill: preset.tag?.startsWith('souls') ? '#0a0a0a' : '#2a2a2a', // Darker for Souls
            stroke: '#444',
            strokeWidth: 1
        }
    });

    // 2. Add Content based on Tag
    if (preset.tag?.startsWith('mw3')) {
        createMW3Preset(frameId, preset.tag, preset.w, preset.h);
    } else if (preset.tag?.startsWith('brawl')) {
        if (preset.tag === 'brawl_battle') createBrawlBattleHUD(frameId, preset.w, preset.h);
        if (preset.tag === 'brawl_lobby') createBrawlLobby(frameId, preset.w, preset.h);
        if (preset.tag === 'brawl_select') createBrawlSelect(frameId, preset.w, preset.h);
        if (preset.tag === 'brawl_end') createBrawlEnd(frameId, preset.w, preset.h);
        if (preset.tag === 'brawl_shop') createBrawlShop(frameId, preset.w, preset.h);
    } else if (preset.tag?.startsWith('souls')) {
        if (preset.tag === 'souls_hud') createSoulsHUD(frameId, preset.w, preset.h);
        if (preset.tag === 'souls_inv') createSoulsInventory(frameId, preset.w, preset.h);
    }
};

function createMW3Preset(parentId: string, tag: string, w: number, h: number) {
    const { addNode } = useDocumentStore.getState().actions;

    // Common Background - Dark Grey/Black theme
    addNode({
        id: createId(), type: 'RECT', name: 'Background_Tint',
        x: 0, y: 0, width: w, height: h,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#0a0a0a', opacity: 0.95 }
    });

    if (tag === 'mw3_lobby') {
        // Top Nav
        const navId = createId();
        addNode({
            id: navId, type: 'FRAME', name: 'Top_Nav',
            x: 0, y: 0, width: w, height: 80,
            parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', gap: 40, padding: 30, alignItems: 'center' },
            style: { fill: '#000000', opacity: 0.8 }
        });
        ['PLAY', 'WEAPONS', 'OPERATORS', 'BATTLE PASS', 'STORE'].forEach(menu => {
            addNode({
                id: createId(), type: 'TEXT', name: `Menu_${menu}`, text: menu,
                x: 0, y: 0, width: 120, height: 30,
                parentId: navId, children: [], layout: { layoutMode: 'NONE' },
                style: { color: menu === 'PLAY' ? '#ccff00' : '#ffffff', fontSize: 24, fontWeight: 'bold', fill: 'transparent' }
            });
        });

        // Player Card (Top Right)
        const cardId = createId();
        addNode({
            id: cardId, type: 'FRAME', name: 'Player_Card',
            x: w - 350, y: 30, width: 300, height: 60,
            parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', gap: 10, alignItems: 'center' },
            style: { fill: 'transparent' }
        });
        addNode({
            id: createId(), type: 'RECT', name: 'Rank_Icon',
            x: 0, y: 0, width: 40, height: 40,
            parentId: cardId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#ccff00' }
        });
        addNode({
            id: createId(), type: 'TEXT', name: 'Player_Name', text: 'GHOST [141]',
            x: 0, y: 0, width: 200, height: 30,
            parentId: cardId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#ffffff', fontSize: 20, fill: 'transparent' }
        });

        // Start Button (Bottom Right)
        const startId = createId();
        addNode({
            id: startId, type: 'RECT', name: 'Btn_Start',
            x: w - 400, y: h - 150, width: 350, height: 100,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#ccff00' } // Neon Yellow
        });
        addNode({
            id: createId(), type: 'TEXT', name: 'Lbl_Start', text: 'START MATCH',
            x: 80, y: 35, width: 200, height: 30,
            parentId: startId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#000000', fontSize: 28, fontWeight: 'bold', fill: 'transparent' }
        });

        // Game Mode Info (Bottom Left)
        addNode({
            id: createId(), type: 'TEXT', name: 'Mode_Title', text: 'TEAM DEATHMATCH',
            x: 50, y: h - 150, width: 400, height: 40,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#ffffff', fontSize: 48, fontWeight: 'bold', fill: 'transparent', stroke: '#ccff00', strokeWidth: 1 }
        });

    } else if (tag === 'mw3_gunsmith') {
        // Weapon Name (Top Left)
        addNode({
            id: createId(), type: 'TEXT', name: 'Weapon_Name', text: 'MCW | ASSAULT RIFLE',
            x: 50, y: 100, width: 500, height: 60,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#ffffff', fontSize: 42, fontWeight: 'bold', fill: 'transparent' }
        });

        // Attachment Slots (Circular layout hint)
        const slots = [
            { name: 'Muzzle', x: 300, y: 400 },
            { name: 'Barrel', x: 500, y: 350 },
            { name: 'Optic', x: 600, y: 250 },
            { name: 'Stock', x: 900, y: 350 },
            { name: 'Underbarrel', x: 500, y: 550 },
            { name: 'Magazine', x: 700, y: 550 },
        ];
        slots.forEach(slot => {
            const sId = createId();
            addNode({
                id: sId, type: 'ELLIPSE', name: `Slot_${slot.name}`,
                x: slot.x, y: slot.y, width: 20, height: 20,
                parentId, children: [], layout: { layoutMode: 'NONE' },
                style: { fill: '#ccff00', opacity: 0.8, stroke: '#fff', strokeWidth: 2 }
            });
            addNode({
                id: createId(), type: 'RECT', name: `Line_${slot.name}`,
                x: slot.x + 10, y: slot.y - 40, width: 2, height: 40,
                parentId, children: [], layout: { layoutMode: 'NONE' },
                style: { fill: '#ffffff', opacity: 0.5 }
            });
            addNode({
                id: createId(), type: 'TEXT', name: `Label_${slot.name}`, text: slot.name,
                x: slot.x, y: slot.y - 60, width: 100, height: 20,
                parentId, children: [], layout: { layoutMode: 'NONE' },
                style: { color: '#ffffff', fontSize: 14, fill: 'transparent' }
            });
        });

        // Stats Panel (Bottom Left)
        const statsId = createId();
        addNode({
            id: statsId, type: 'FRAME', name: 'Stats_Panel',
            x: 50, y: h - 400, width: 400, height: 300,
            parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'column', gap: 15, padding: 20 },
            style: { fill: '#000000', opacity: 0.6, stroke: '#333', strokeWidth: 1 }
        });
        ['ACCURACY', 'DAMAGE', 'RANGE', 'FIRE RATE', 'MOBILITY', 'HANDLING'].forEach(stat => {
            const barId = createId();
            addNode({
                id: barId, type: 'FRAME', name: `Stat_${stat}`,
                x: 0, y: 0, width: 360, height: 30,
                parentId: statsId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'column', gap: 5 },
                style: { fill: 'transparent' }
            });
            addNode({
                id: createId(), type: 'TEXT', name: `Lbl_${stat}`, text: stat,
                x: 0, y: 0, width: 100, height: 12,
                parentId: barId, children: [], layout: { layoutMode: 'NONE' },
                style: { color: '#aaaaaa', fontSize: 12, fill: 'transparent' }
            });
            // Bar BG
            const bbgId = createId();
            addNode({
                id: bbgId, type: 'RECT', name: 'Bar_BG',
                x: 0, y: 0, width: 360, height: 8,
                parentId: barId, children: [], layout: { layoutMode: 'NONE' },
                style: { fill: '#333333' }
            });
            // Bar Fill
            addNode({
                id: createId(), type: 'RECT', name: 'Bar_Fill',
                x: 0, y: 0, width: Math.random() * 300 + 50, height: 8,
                parentId: bbgId, children: [], layout: { layoutMode: 'NONE' },
                style: { fill: '#ffffff' }
            });
        });

    } else if (tag === 'mw3_hud') {
        // Minimap (Top Left)
        addNode({
            id: createId(), type: 'RECT', name: 'Minimap',
            x: 50, y: 50, width: 250, height: 250,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#000000', opacity: 0.7, stroke: '#ffffff', strokeWidth: 2 }
        });

        // Compass (Top Center)
        const compassId = createId();
        addNode({
            id: compassId, type: 'RECT', name: 'Compass_Strip',
            x: w / 2 - 300, y: 30, width: 600, height: 30,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#000000', opacity: 0.5 }
        });
        ['NW', 'N', 'NE', 'E'].forEach((dir, i) => {
            addNode({
                id: createId(), type: 'TEXT', name: `Dir_${dir}`, text: dir,
                x: 50 + i * 150, y: 5, width: 30, height: 20,
                parentId: compassId, children: [], layout: { layoutMode: 'NONE' },
                style: { color: '#ffffff', fontSize: 14, textAlign: 'center', fill: 'transparent' }
            });
        });

        // Weapon Ammo (Bottom Right)
        const ammoId = createId();
        addNode({
            id: ammoId, type: 'FRAME', name: 'Ammo_Cluster',
            x: w - 350, y: h - 150, width: 300, height: 100,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: 'transparent' }
        });
        addNode({
            id: createId(), type: 'TEXT', name: 'Ammo_Count', text: '30',
            x: 0, y: 0, width: 100, height: 80,
            parentId: ammoId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#ffffff', fontSize: 96, fontWeight: 'bold', fill: 'transparent' }
        });
        addNode({
            id: createId(), type: 'TEXT', name: 'Reserve', text: '/ 210',
            x: 120, y: 50, width: 100, height: 30,
            parentId: ammoId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#aaaaaa', fontSize: 32, fill: 'transparent' }
        });
        addNode({
            id: createId(), type: 'RECT', name: 'Weapon_Line',
            x: 0, y: 90, width: 300, height: 4,
            parentId: ammoId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#ccff00' }
        });

        // Scorestreaks (Right)
        const streakId = createId();
        addNode({
            id: streakId, type: 'FRAME', name: 'Scorestreaks',
            x: w - 100, y: h / 2, width: 80, height: 300,
            parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'column', gap: 20, alignItems: 'center' },
            style: { fill: 'transparent' }
        });
        [1, 2, 3].forEach(i => {
            addNode({
                id: createId(), type: 'RECT', name: `Streak_${i}`,
                x: 0, y: 0, width: 60, height: 60,
                parentId: streakId, children: [], layout: { layoutMode: 'NONE' },
                style: { fill: '#000000', opacity: 0.6, stroke: '#ffffff', strokeWidth: 1 }
            });
        });
    } else if (tag === 'mw3_score') {
        // Header
        addNode({
            id: createId(), type: 'TEXT', name: 'Match_Header', text: 'DOMINATION | HIGHRISE',
            x: w / 2 - 200, y: 50, width: 400, height: 40,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#ffffff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', fill: 'transparent' }
        });

        // Team Containers
        const teams = [
            { name: 'SPECGRU', color: '#3b82f6', x: 100 },
            { name: 'KORTAC', color: '#ef4444', x: w / 2 + 50 }
        ];

        teams.forEach(team => {
            const teamId = createId();
            addNode({
                id: teamId, type: 'FRAME', name: `Team_${team.name}`,
                x: team.x, y: 120, width: w / 2 - 150, height: 800,
                parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'column', gap: 5 },
                style: { fill: '#111', opacity: 0.8, stroke: team.color, strokeWidth: 2 }
            });

            // Team Header
            addNode({
                id: createId(), type: 'TEXT', name: 'Team_Name', text: team.name,
                x: 0, y: 0, width: 200, height: 40,
                parentId: teamId, children: [], layout: { layoutMode: 'NONE' },
                style: { color: team.color, fontSize: 24, fontWeight: 'bold', fill: 'transparent' }
            });

            // Table Header
            const headerId = createId();
            addNode({
                id: headerId, type: 'FRAME', name: 'Table_Header',
                x: 0, y: 0, width: w / 2 - 150, height: 30,
                parentId: teamId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
                style: { fill: '#222' }
            });
            ['PLAYER', 'K', 'D', 'OBJ', 'SCORE'].forEach(h => {
                addNode({
                    id: createId(), type: 'TEXT', name: `H_${h}`, text: h,
                    x: 0, y: 0, width: 60, height: 20,
                    parentId: headerId, children: [], layout: { layoutMode: 'NONE' },
                    style: { color: '#aaaaaa', fontSize: 14, fill: 'transparent' }
                });
            });

            // Players
            [1, 2, 3, 4, 5, 6].forEach(i => {
                const rowId = createId();
                addNode({
                    id: rowId, type: 'FRAME', name: `Player_${i}`,
                    x: 0, y: 0, width: w / 2 - 150, height: 40,
                    parentId: teamId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' },
                    style: { fill: i % 2 === 0 ? '#1a1a1a' : 'transparent' }
                });
                addNode({
                    id: createId(), type: 'TEXT', name: 'Name', text: `Player ${i}`,
                    x: 0, y: 0, width: 100, height: 20,
                    parentId: rowId, children: [], layout: { layoutMode: 'NONE' },
                    style: { color: '#ffffff', fontSize: 16, fill: 'transparent' }
                });
                // Mock Stats
                addNode({
                    id: createId(), type: 'TEXT', name: 'Stats', text: `${Math.floor(Math.random() * 30)}   ${Math.floor(Math.random() * 15)}   ${Math.floor(Math.random() * 5)}   ${Math.floor(Math.random() * 5000)}`,
                    x: 0, y: 0, width: 200, height: 20,
                    parentId: rowId, children: [], layout: { layoutMode: 'NONE' },
                    style: { color: '#ffffff', fontSize: 16, textAlign: 'right', fill: 'transparent' }
                });
            });
        });

    } else if (tag === 'mw3_loadout') {
        // Header
        addNode({
            id: createId(), type: 'TEXT', name: 'Loadout_Header', text: 'LOADOUTS',
            x: 50, y: 50, width: 300, height: 60,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#ffffff', fontSize: 48, fontWeight: 'bold', fill: 'transparent' }
        });

        // Class List (Left)
        const listId = createId();
        addNode({
            id: listId, type: 'FRAME', name: 'Class_List',
            x: 50, y: 150, width: 400, height: 800,
            parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'column', gap: 10 },
            style: { fill: 'transparent' }
        });

        ['CUSTOM 1', 'CUSTOM 2', 'SNIPER', 'RUSH', 'STEALTH'].forEach((cls, i) => {
            const itemId = createId();
            addNode({
                id: itemId, type: 'FRAME', name: `Class_Item_${i}`,
                x: 0, y: 0, width: 300, height: 80,
                parentId: listId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', alignItems: 'center', padding: 20 },
                style: { fill: i === 0 ? '#ccff00' : '#1a1a1a', stroke: '#333', strokeWidth: 1 } // Highlight first
            });
            addNode({
                id: createId(), type: 'TEXT', name: 'Class_Name', text: cls,
                x: 0, y: 0, width: 200, height: 30,
                parentId: itemId, children: [], layout: { layoutMode: 'NONE' },
                style: { color: i === 0 ? '#000000' : '#ffffff', fontSize: 18, fontWeight: 'bold', fill: 'transparent' }
            });
        });

        // Preview Panel (Right)
        const prevId = createId();
        addNode({
            id: prevId, type: 'FRAME', name: 'Preview_Panel',
            x: 500, y: 150, width: w - 600, height: 800,
            parentId, children: [], layout: { layoutMode: 'NONE' }, // Free layout within frame
            style: { fill: 'transparent' }
        });

        // Primary Weapon Box
        addNode({
            id: createId(), type: 'RECT', name: 'Primary_Weapon_BG',
            x: 0, y: 0, width: 800, height: 400,
            parentId: prevId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#111', stroke: '#333', strokeWidth: 1 }
        });
        addNode({
            id: createId(), type: 'TEXT', name: 'Primary_Label', text: 'PRIMARY',
            x: 20, y: 20, width: 100, height: 20,
            parentId: prevId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#ccff00', fontSize: 14, fill: 'transparent' }
        });
        addNode({
            id: createId(), type: 'TEXT', name: 'Primary_Name', text: 'MCW-6.8',
            x: 20, y: 50, width: 300, height: 40,
            parentId: prevId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#ffffff', fontSize: 36, fontWeight: 'bold', fill: 'transparent' }
        });

        // Secondary & Perks (Below)
        const btmId = createId();
        addNode({
            id: btmId, type: 'FRAME', name: 'Bottom_Row',
            x: 0, y: 420, width: 800, height: 200,
            parentId: prevId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', gap: 20 },
            style: { fill: 'transparent' }
        });

        ['SECONDARY', 'TACTICAL', 'LETHAL', 'PERK 1', 'PERK 2'].forEach(slot => {
            const sId = createId();
            addNode({
                id: sId, type: 'FRAME', name: `Slot_${slot}`,
                x: 0, y: 0, width: 140, height: 140,
                parentId: btmId, children: [], layout: { layoutMode: 'NONE' },
                style: { fill: '#111', stroke: '#333', strokeWidth: 1 }
            });
            addNode({
                id: createId(), type: 'TEXT', name: 'Slot_Label', text: slot,
                x: 10, y: 10, width: 100, height: 20,
                parentId: sId, children: [], layout: { layoutMode: 'NONE' },
                style: { color: '#aaaaaa', fontSize: 12, fill: 'transparent' }
            });
        });
    }
}

function createBrawlBattleHUD(parentId: string, w: number, h: number) {
    const { addNode } = useDocumentStore.getState().actions;

    // Movement Joystick (Left)
    const joyId = createId();
    addNode({
        id: joyId,
        type: 'ELLIPSE',
        name: 'Joystick_Move',
        x: 60, y: h - 180, width: 120, height: 120,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#000000', opacity: 0.2, stroke: '#ffffff', strokeWidth: 2 }
    });
    addNode({
        id: createId(),
        type: 'ELLIPSE',
        name: 'Joystick_Knob',
        x: 35, y: 35, width: 50, height: 50,
        parentId: joyId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#3b82f6', opacity: 0.8 }
    });

    // Attack Buttons Cluster (Right)
    const atkBaseX = w - 180;
    const atkBaseY = h - 180;

    // Main Attack (Red)
    const atkId = createId();
    addNode({
        id: atkId,
        type: 'ELLIPSE',
        name: 'Button_Attack',
        x: atkBaseX, y: atkBaseY, width: 140, height: 140,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#ef4444', opacity: 0.9, stroke: '#ffffff', strokeWidth: 4 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Icon_Skull', text: '💀',
        x: 45, y: 40, width: 50, height: 50,
        parentId: atkId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 56, fill: 'transparent' }
    });

    // Super Button (Yellow - Small, top-left of attack)
    const superId = createId();
    addNode({
        id: superId,
        type: 'ELLIPSE',
        name: 'Button_Super',
        x: atkBaseX - 60, y: atkBaseY - 20, width: 90, height: 90,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#eab308', opacity: 0.9, stroke: '#ffffff', strokeWidth: 4, strokeDasharray: '6 4' } // Dashed for "charging" effect
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Icon_Super', text: '⚡',
        x: 25, y: 20, width: 40, height: 40,
        parentId: superId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 40, fill: 'transparent' }
    });

    // Gadget Button (Green - Small, bottom-left of attack)
    addNode({
        id: createId(),
        type: 'ELLIPSE',
        name: 'Button_Gadget',
        x: atkBaseX - 20, y: atkBaseY + 100, width: 60, height: 60,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#22c55e', opacity: 0.9, stroke: '#ffffff', strokeWidth: 3 }
    });

    // Ammo Bars (3 Bars below center)
    const ammoContainerId = createId();
    addNode({
        id: ammoContainerId, type: 'FRAME', name: 'Ammo_Container',
        x: w / 2 - 40, y: h / 2 + 10, width: 80, height: 10,
        parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', gap: 4, justifyContent: 'space-between' },
        style: { fill: 'transparent' }
    });
    [1, 2, 3].forEach(i => {
        addNode({
            id: createId(), type: 'RECT', name: `Ammo_${i}`,
            x: 0, y: 0, width: 24, height: 8,
            parentId: ammoContainerId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#f97316', stroke: '#000', strokeWidth: 1 } // Orange
        });
    });

    // Health Bar (Center)
    const hpId = createId();
    addNode({
        id: hpId, type: 'RECT', name: 'Player_HP_Bar',
        x: w / 2 - 60, y: h / 2 - 60, width: 120, height: 16,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#111827', stroke: '#000', strokeWidth: 2 }
    });
    addNode({
        id: createId(), type: 'RECT', name: 'HP_Fill',
        x: 2, y: 2, width: 116, height: 12,
        parentId: hpId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#22c55e' } // Green
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Player_Name', text: 'Player 1',
        x: w / 2 - 60, y: h / 2 - 85, width: 120, height: 20,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 14, color: '#ffffff', textAlign: 'center', fill: 'transparent', fontWeight: 'bold', stroke: '#000', strokeWidth: 0.5 }
    });

    // Top Info (Timer & Mode)
    addNode({
        id: createId(), type: 'TEXT', name: 'Timer', text: '2:30',
        x: w / 2 - 50, y: 20, width: 100, height: 30,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 24, color: '#ffffff', textAlign: 'center', fill: 'transparent', fontWeight: 'bold' }
    });
}

function createBrawlLobby(parentId: string, w: number, h: number) {
    const { addNode } = useDocumentStore.getState().actions;

    // Brawler Model Placeholder (Center)
    addNode({
        id: createId(), type: 'RECT', name: 'Brawler_Model_Placeholder',
        x: w / 2 - 100, y: h / 2 - 150, width: 200, height: 300,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: 'transparent', stroke: '#ffffff', strokeWidth: 2, strokeDasharray: '5 5' }
    });

    // Top Bar (Currency)
    const topBarId = createId();
    addNode({
        id: topBarId, type: 'FRAME', name: 'Top_Bar',
        x: 0, y: 0, width: w, height: 60,
        parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' },
        style: { fill: '#000000', opacity: 0.5 }
    });

    // Currencies
    ['Coins', 'Gems'].forEach(curr => {
        const cId = createId();
        addNode({
            id: cId, type: 'RECT', name: `Box_${curr}`,
            x: 0, y: 0, width: 100, height: 30,
            parentId: topBarId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#1f2937', borderRadius: 15 }
        });
        addNode({
            id: createId(), type: 'TEXT', name: `Text_${curr}`, text: `999 ${curr}`,
            x: 10, y: 5, width: 80, height: 20,
            parentId: cId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: '#ffffff', fontSize: 12, fill: 'transparent', textAlign: 'right' }
        });
    });

    // Play Button (Bottom Right)
    const playId = createId();
    addNode({
        id: playId, type: 'RECT', name: 'Button_Play',
        x: w - 180, y: h - 80, width: 160, height: 60,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#eab308', borderRadius: 8, stroke: '#ffffff', strokeWidth: 2 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Label_Play', text: 'PLAY',
        x: 0, y: 15, width: 160, height: 30,
        parentId: playId, children: [], layout: { layoutMode: 'NONE' },
        style: { color: '#000000', fontSize: 24, fontWeight: 'bold', textAlign: 'center', fill: 'transparent' }
    });

    addNode({
        id: createId(), type: 'TEXT', name: 'Event_Name', text: 'Gem Grab',
        x: w - 180, y: h - 100, width: 160, height: 20,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { color: '#ffffff', fontSize: 14, textAlign: 'center', fill: 'transparent' }
    });
}

function createSoulsHUD(parentId: string, w: number, h: number) {
    const { addNode } = useDocumentStore.getState().actions;

    // Compass (Top Center)
    const compassId = createId();
    addNode({
        id: compassId, type: 'RECT', name: 'Compass_Bar',
        x: w / 2 - 200, y: 30, width: 400, height: 4,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#ffffff', opacity: 0.5 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Compass_N', text: 'N',
        x: 190, y: -20, width: 20, height: 20,
        parentId: compassId, children: [], layout: { layoutMode: 'NONE' },
        style: { color: '#ffffff', fontSize: 16, textAlign: 'center', fill: 'transparent' }
    });

    // Stat Bars (Top Left)
    const bars = [
        { name: 'HP', color: '#dc2626', width: 350 },
        { name: 'FP', color: '#2563eb', width: 260 },
        { name: 'Stamina', color: '#16a34a', width: 240 },
    ];

    bars.forEach((bar, i) => {
        const bgId = createId();
        addNode({
            id: bgId, type: 'RECT', name: `Bar_BG_${bar.name}`,
            x: 60, y: 60 + (i * 28), width: bar.width, height: 18,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#1f1f1f', opacity: 0.8, stroke: '#555', strokeWidth: 1 }
        });
        addNode({
            id: createId(), type: 'RECT', name: `Bar_Fill_${bar.name}`,
            x: 0, y: 0, width: bar.width * 0.8, height: 18,
            parentId: bgId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: bar.color }
        });
    });

    // Status Effect Icons (Below Stamina)
    const effectsId = createId();
    addNode({
        id: effectsId, type: 'FRAME', name: 'Status_Effects',
        x: 60, y: 160, width: 200, height: 30,
        parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', gap: 5 },
        style: { fill: 'transparent' }
    });
    ['🛡️', '⚡', '☠️'].forEach(_icon => {
        addNode({
            id: createId(), type: 'RECT', name: 'Effect_Icon',
            x: 0, y: 0, width: 24, height: 24,
            parentId: effectsId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#333', stroke: '#777', strokeWidth: 1 } // Diamond shape usually, simplifed as rect
        });
    });

    // Item Slot (Bottom Left - D-Pad Style)
    const slotBaseX = 60;
    const slotBaseY = h - 160;
    const slotId = createId();

    // Main Slot
    addNode({
        id: slotId, type: 'RECT', name: 'Item_Slot_Main',
        x: slotBaseX, y: slotBaseY, width: 70, height: 70,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#000000', opacity: 0.6, stroke: '#d4d4d8', strokeWidth: 2 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Item_Name', text: 'Flask +5',
        x: 0, y: 75, width: 70, height: 20,
        parentId: slotId, children: [], layout: { layoutMode: 'NONE' },
        style: { color: '#ffffff', fontSize: 12, textAlign: 'center', fill: 'transparent' }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Item_Count', text: '12',
        x: 45, y: 50, width: 20, height: 20,
        parentId: slotId, children: [], layout: { layoutMode: 'NONE' },
        style: { color: '#ffffff', fontSize: 14, textAlign: 'right', fill: 'transparent' }
    });

    // Secondary Slots (Top/Left/Right implies Magic/LeftHand/RightHand)
    [
        { x: slotBaseX, y: slotBaseY - 60 }, // Magic
        { x: slotBaseX - 60, y: slotBaseY }, // Left Hand
        { x: slotBaseX + 60, y: slotBaseY }, // Right Hand
    ].forEach((pos, i) => {
        addNode({
            id: createId(), type: 'RECT', name: `Item_Slot_Sub_${i}`,
            x: pos.x + 10, y: pos.y + 10, width: 50, height: 50, // Smaller
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#000000', opacity: 0.4, stroke: '#777', strokeWidth: 1 }
        });
    });


    // Souls Counter (Bottom Right)
    const soulsId = createId();
    addNode({
        id: soulsId, type: 'FRAME', name: 'Souls_Counter_Container',
        x: w - 220, y: h - 90, width: 180, height: 50,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: 'url(#gradient)', opacity: 0.8 } // Gradient would be nice, plain for now
    });
    addNode({
        id: createId(), type: 'RECT', name: 'Souls_Icon', // Diamond
        x: 10, y: 15, width: 20, height: 20, rotation: 45,
        parentId: soulsId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#ffffff', opacity: 0.8 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Souls_Value', text: '128,540',
        x: 40, y: 5, width: 130, height: 40,
        parentId: soulsId, children: [], layout: { layoutMode: 'NONE' },
        style: { color: '#ffffff', fontSize: 32, textAlign: 'right', fill: 'transparent', fontFamily: 'serif' }
    });
}


function createSoulsInventory(parentId: string, w: number, _h: number) {
    const { addNode } = useDocumentStore.getState().actions;

    // Header Line
    addNode({
        id: createId(), type: 'RECT', name: 'Header_Line',
        x: 50, y: 80, width: w - 100, height: 2,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#d4d4d8', opacity: 0.5 }
    });

    // Titles
    ['Inventory', 'Equipment', 'Status', 'System'].forEach((tab, i) => {
        addNode({
            id: createId(), type: 'TEXT', name: `Tab_${tab}`, text: tab,
            x: 60 + (i * 150), y: 40, width: 120, height: 30,
            parentId, children: [], layout: { layoutMode: 'NONE' },
            style: { color: i === 0 ? '#ffffff' : '#9ca3af', fontSize: 24, fill: 'transparent', fontFamily: 'serif' }
        });
    });

    // Grid (Left)
    const gridId = createId();
    addNode({
        id: gridId, type: 'FRAME', name: 'Item_Grid',
        x: 50, y: 120, width: 600, height: 600,
        parentId, children: [],
        layout: { layoutMode: 'FLEX', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 10, padding: 10 },
        style: { fill: '#000000', opacity: 0.5 }
    });

    for (let i = 0; i < 20; i++) {
        addNode({
            id: createId(), type: 'RECT', name: `Item_${i}`,
            x: 0, y: 0, width: 100, height: 100,
            parentId: gridId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#1f1f1f', stroke: '#444', strokeWidth: 1 }
        });
    }

    // Detail Pane (Right)
    const detailId = createId();
    addNode({
        id: detailId, type: 'FRAME', name: 'Item_Details',
        x: 700, y: 120, width: 400, height: 600,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#000000', opacity: 0.5, stroke: '#444' }
    });

    addNode({
        id: createId(), type: 'TEXT', name: 'Item_Title', text: 'Longsword',
        x: 20, y: 20, width: 300, height: 40,
        parentId: detailId, children: [], layout: { layoutMode: 'NONE' },
        style: { color: '#ffffff', fontSize: 32, fill: 'transparent', fontFamily: 'serif' }
    });

    addNode({
        id: createId(), type: 'TEXT', name: 'Item_Desc', text: 'A standard iron straight sword.\nReliable and easy to handle.\n\nStandard attacks include slashes and thrusts.',
        x: 20, y: 80, width: 360, height: 300,
        parentId: detailId, children: [], layout: { layoutMode: 'NONE' },
        style: { color: '#d1d5db', fontSize: 16, fill: 'transparent' }
    });
}

function createBrawlSelect(parentId: string, w: number, h: number) {
    const { addNode } = useDocumentStore.getState().actions;

    // Filter Tabs (Left Vertical)
    const tabsId = createId();
    addNode({
        id: tabsId, type: 'FRAME', name: 'Filter_Tabs',
        x: 0, y: 0, width: 80, height: h,
        parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'column', gap: 10, padding: 10, alignItems: 'center' },
        style: { fill: '#1f2937' }
    });
    ['ALL', 'TANK', 'DMG', 'SUP'].forEach(tab => {
        const tId = createId();
        addNode({
            id: tId, type: 'RECT', name: `Tab_${tab}`,
            x: 0, y: 0, width: 60, height: 60,
            parentId: tabsId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: tab === 'ALL' ? '#eab308' : '#374151', borderRadius: 8 }
        });
        addNode({
            id: createId(), type: 'TEXT', name: `Label_${tab}`, text: tab,
            x: 5, y: 20, width: 50, height: 20,
            parentId: tId, children: [], layout: { layoutMode: 'NONE' },
            style: { fontSize: 12, textAlign: 'center', fill: 'transparent', fontWeight: 'bold' }
        });
    });

    // Brawler Grid (Center)
    const gridId = createId();
    addNode({
        id: gridId, type: 'FRAME', name: 'Brawler_Grid',
        x: 90, y: 60, width: w - 350, height: h - 80,
        parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 10 },
        style: { fill: 'transparent' }
    });

    // Header
    addNode({
        id: createId(), type: 'TEXT', name: 'Header_Select', text: 'BRAWLERS',
        x: 100, y: 20, width: 200, height: 30,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 24, fontWeight: 'bold', fill: 'transparent', color: '#fff' }
    });

    for (let i = 0; i < 12; i++) {
        const bId = createId();
        addNode({
            id: bId, type: 'FRAME', name: `Brawler_Card_${i}`,
            x: 0, y: 0, width: 100, height: 120,
            parentId: gridId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#374151', borderRadius: 8, stroke: i === 0 ? '#eab308' : '#000', strokeWidth: i === 0 ? 3 : 1 }
        });
        // Portrait
        addNode({
            id: createId(), type: 'RECT', name: 'Portrait',
            x: 5, y: 5, width: 90, height: 80,
            parentId: bId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#1f2937' }
        });
        // Name
        addNode({
            id: createId(), type: 'TEXT', name: 'Name', text: 'Name',
            x: 5, y: 90, width: 90, height: 20,
            parentId: bId, children: [], layout: { layoutMode: 'NONE' },
            style: { fontSize: 12, textAlign: 'center', fill: 'transparent', color: '#fff' }
        });
    }

    // Selected Preview (Right)
    const previewId = createId();
    addNode({
        id: previewId, type: 'FRAME', name: 'Preview_Panel',
        x: w - 250, y: 0, width: 250, height: h,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#111827', stroke: '#333', strokeWidth: 1 }
    });

    // Model
    addNode({
        id: createId(), type: 'RECT', name: 'Preview_Model',
        x: 25, y: 50, width: 200, height: 200,
        parentId: previewId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: 'transparent', stroke: '#555', strokeDasharray: '5 5' }
    });

    // Stats
    ['OFFENSE', 'DEFENSE', 'UTILITY'].forEach((stat, i) => {
        addNode({
            id: createId(), type: 'TEXT', name: `Label_${stat}`, text: stat,
            x: 25, y: 270 + (i * 40), width: 80, height: 20,
            parentId: previewId, children: [], layout: { layoutMode: 'NONE' },
            style: { fontSize: 12, color: '#aaa', fill: 'transparent' }
        });
        // Bar
        addNode({
            id: createId(), type: 'RECT', name: `Bar_BG_${stat}`,
            x: 100, y: 275 + (i * 40), width: 120, height: 10,
            parentId: previewId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#333' }
        });
        addNode({
            id: createId(), type: 'RECT', name: `Bar_Fill_${stat}`,
            x: 100, y: 275 + (i * 40), width: 80 + (Math.random() * 40), height: 10,
            parentId: previewId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#ef4444' }
        });
    });

    // Select Button
    const selBtnId = createId();
    addNode({
        id: selBtnId, type: 'RECT', name: 'Btn_Select',
        x: 25, y: h - 70, width: 200, height: 50,
        parentId: previewId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#eab308', borderRadius: 8 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Txt_Select', text: 'SELECT',
        x: 0, y: 15, width: 200, height: 30,
        parentId: selBtnId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', fill: 'transparent', color: '#000' }
    });
}

function createBrawlEnd(parentId: string, w: number, h: number) {
    const { addNode } = useDocumentStore.getState().actions;

    // Result Banner
    addNode({
        id: createId(), type: 'RECT', name: 'Result_Banner',
        x: 0, y: 40, width: w, height: 80,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#3b82f6', opacity: 0.8 } // Blue for Victory
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Text_Victory', text: 'VICTORY!',
        x: 0, y: 55, width: w, height: 50,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', fill: 'transparent', color: '#fff', stroke: '#000', strokeWidth: 2 }
    });

    // Star Player (Center)
    const starId = createId();
    addNode({
        id: starId, type: 'FRAME', name: 'Star_Player',
        x: w / 2 - 100, y: 150, width: 200, height: 250,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: 'transparent' }
    });
    addNode({
        id: createId(), type: 'RECT', name: 'Star_Icon',
        x: 60, y: -20, width: 80, height: 80, rotation: 30,
        parentId: starId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#eab308', opacity: 0.9 } // Star shape hint
    });
    addNode({
        id: createId(), type: 'RECT', name: 'Player_Model',
        x: 20, y: 40, width: 160, height: 200,
        parentId: starId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#1f2937', stroke: '#eab308', strokeWidth: 4 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Player_Name', text: 'STAR PLAYER',
        x: 0, y: 250, width: 200, height: 30,
        parentId: starId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', fill: 'transparent', color: '#eab308' }
    });

    // Progression (Bottom)
    const progId = createId();
    addNode({
        id: progId, type: 'FRAME', name: 'Progression',
        x: 50, y: h - 120, width: w - 100, height: 100,
        parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
        style: { fill: '#111827', opacity: 0.8, borderRadius: 12 }
    });

    // Trophies
    ['+8 Trophies', '+20 Tokens', '+10 Mastery'].forEach((reward, i) => {
        const rId = createId();
        addNode({
            id: rId, type: 'FRAME', name: `Reward_${i}`,
            x: 0, y: 0, width: 150, height: 60,
            parentId: progId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: 'transparent' }
        });
        addNode({
            id: createId(), type: 'RECT', name: 'Bar_BG',
            x: 0, y: 30, width: 150, height: 10,
            parentId: rId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: '#374151' }
        });
        addNode({
            id: createId(), type: 'RECT', name: 'Bar_Fill',
            x: 0, y: 30, width: 100, height: 10,
            parentId: rId, children: [], layout: { layoutMode: 'NONE' },
            style: { fill: i === 0 ? '#eab308' : '#3b82f6' }
        });
        addNode({
            id: createId(), type: 'TEXT', name: 'Label', text: reward,
            x: 0, y: 5, width: 150, height: 20,
            parentId: rId, children: [], layout: { layoutMode: 'NONE' },
            style: { fontSize: 16, textAlign: 'center', fill: 'transparent', color: '#fff' }
        });
    });

    // Exit Button
    const exitId = createId();
    addNode({
        id: exitId, type: 'RECT', name: 'Btn_Exit',
        x: w - 150, y: 20, width: 130, height: 50,
        parentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#3b82f6', borderRadius: 8 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Txt_Exit', text: 'EXIT',
        x: 0, y: 15, width: 130, height: 30,
        parentId: exitId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', fill: 'transparent', color: '#fff' }
    });
}

function createBrawlShop(parentId: string, w: number, h: number) {
    const { addNode } = useDocumentStore.getState().actions;

    // Header
    const headId = createId();
    addNode({
        id: headId, type: 'FRAME', name: 'Shop_Header',
        x: 0, y: 0, width: w, height: 60,
        parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' },
        style: { fill: '#111827' }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Title', text: 'DAILY DEALS',
        x: 0, y: 0, width: 200, height: 30,
        parentId: headId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 24, fontWeight: 'bold', fill: 'transparent', color: '#fff' }
    });

    // Currency
    const currId = createId();
    addNode({
        id: currId, type: 'FRAME', name: 'Currency_Box',
        x: 0, y: 0, width: 200, height: 40,
        parentId: headId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: 'transparent' }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Gems', text: '💎 150  💰 2300',
        x: 0, y: 10, width: 200, height: 20,
        parentId: currId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 16, textAlign: 'right', fill: 'transparent', color: '#fff' }
    });

    // Content Area
    const contentId = createId();
    addNode({
        id: contentId, type: 'FRAME', name: 'Shop_Content',
        x: 0, y: 60, width: w, height: h - 60,
        parentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'row', gap: 20, padding: 30, alignItems: 'center', justifyContent: 'center' },
        style: { fill: 'transparent' }
    });

    // 1. Daily Free Item
    const freeId = createId();
    addNode({
        id: freeId, type: 'FRAME', name: 'Deal_Free',
        x: 0, y: 0, width: 180, height: 250,
        parentId: contentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 },
        style: { fill: '#1f2937', stroke: '#22c55e', strokeWidth: 2 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Title', text: 'FREE!',
        x: 0, y: 0, width: 100, height: 30,
        parentId: freeId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', fill: 'transparent', color: '#22c55e' }
    });
    addNode({
        id: createId(), type: 'RECT', name: 'Icon',
        x: 0, y: 0, width: 80, height: 80,
        parentId: freeId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#eab308' } // Coin
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Amount', text: '15 Coins',
        x: 0, y: 0, width: 100, height: 20,
        parentId: freeId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 16, textAlign: 'center', fill: 'transparent', color: '#fff' }
    });

    // 2. Skin Offer (Large)
    const skinId = createId();
    addNode({
        id: skinId, type: 'FRAME', name: 'Deal_Skin',
        x: 0, y: 0, width: 300, height: 280,
        parentId: contentId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#1f2937', stroke: '#eab308', strokeWidth: 2 }
    });
    addNode({
        id: createId(), type: 'RECT', name: 'Skin_Image',
        x: 10, y: 10, width: 280, height: 200,
        parentId: skinId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#374151' }
    });
    addNode({
        id: createId(), type: 'RECT', name: 'Price_Tag',
        x: 200, y: 230, width: 80, height: 40,
        parentId: skinId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#22c55e', borderRadius: 4 }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Price', text: '79 💎',
        x: 200, y: 240, width: 80, height: 20,
        parentId: skinId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', fill: 'transparent', color: '#fff' }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Skin_Name', text: 'MECHA CROW',
        x: 20, y: 230, width: 150, height: 30,
        parentId: skinId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 20, fontWeight: 'bold', fill: 'transparent', color: '#eab308' }
    });

    // 3. Power Points
    const ppId = createId();
    addNode({
        id: ppId, type: 'FRAME', name: 'Deal_PP',
        x: 0, y: 0, width: 180, height: 250,
        parentId: contentId, children: [], layout: { layoutMode: 'FLEX', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 },
        style: { fill: '#1f2937' }
    });
    addNode({
        id: createId(), type: 'RECT', name: 'Icon',
        x: 0, y: 0, width: 80, height: 80,
        parentId: ppId, children: [], layout: { layoutMode: 'NONE' },
        style: { fill: '#ec4899' } // Pink PP
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Amount', text: '50 Pts',
        x: 0, y: 0, width: 100, height: 20,
        parentId: ppId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 16, textAlign: 'center', fill: 'transparent', color: '#fff' }
    });
    addNode({
        id: createId(), type: 'TEXT', name: 'Cost', text: '100 💰',
        x: 0, y: 0, width: 100, height: 20,
        parentId: ppId, children: [], layout: { layoutMode: 'NONE' },
        style: { fontSize: 14, textAlign: 'center', fill: 'transparent', color: '#eab308' }
    });
}
// ... existing code ...

// --- BATCH GENERATORS FOR LAUNCHER ---

export const createMobileAppFlow = (startX: number = 0, startY: number = 0) => {
    const { addNode } = useDocumentStore.getState().actions;
    const { rootId } = useDocumentStore.getState();
    const w = 375;
    const h = 812;
    const gap = 50;

    const screens = [
        'Splash', 'Onboarding', 'Login', 'Sign Up', 'Home',
        'Search', 'Details', 'Profile', 'Settings', 'Empty State'
    ];

    screens.forEach((name, index) => {
        const id = generateId();
        const x = startX + (index * (w + gap));
        const y = startY;

        addNode({
            id, type: 'FRAME', name, x, y, width: w, height: h, parentId: rootId, children: [],
            layout: { layoutMode: 'NONE' },
            style: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 }
        });

        // Add dummy content
        addNode({
            id: generateId(), type: 'TEXT', name: `${name} Title`, text: name, x: 20, y: 40, width: 200, height: 30, parentId: id, children: [],
            layout: { layoutMode: 'NONE' },
            style: { fill: '#111827', fontSize: 24, fontFamily: 'Inter', fontWeight: 'bold' }
        });

        // Placeholder rectangle
        addNode({
            id: generateId(), type: 'RECT', name: 'Placeholder', x: 20, y: 100, width: w - 40, height: 200, parentId: id, children: [],
            layout: { layoutMode: 'NONE' },
            style: { fill: '#f3f4f6', stroke: 'none' }
        });
    });
};

export const createSocialMediaFlow = (startX: number = 0, startY: number = 0) => {
    const { addNode } = useDocumentStore.getState().actions;
    const { rootId } = useDocumentStore.getState();
    const s = 1080;
    const gap = 100;

    const posts = [
        'Quote Post', 'Product Showcase', 'Event Announcement', 'Testimonial', 'New Arrival',
        'Sale Alert', 'Behind Scenes', 'Team Spotlight', 'Giveaway', 'Blog Promotion'
    ];

    posts.forEach((name, index) => {
        const id = generateId();
        const x = startX + (index * (s + gap));
        const y = startY;

        addNode({
            id, type: 'FRAME', name: `IG - ${name}`, x, y, width: s, height: s, parentId: rootId, children: [],
            layout: { layoutMode: 'NONE' },
            style: { fill: index % 2 === 0 ? '#ffffff' : '#fafafa', stroke: '#e5e7eb', strokeWidth: 1 }
        });

        // Dummy content
        addNode({
            id: generateId(), type: 'TEXT', name: 'Post Text', text: name, x: 50, y: 50, width: 500, height: 60, parentId: id, children: [],
            layout: { layoutMode: 'NONE' },
            style: { fill: '#111827', fontSize: 48, fontFamily: 'Inter', fontWeight: 'bold' }
        });
    });
};

export const createWebsiteFlow = (startX: number = 0, startY: number = 0) => {
    const { addNode } = useDocumentStore.getState().actions;
    const { rootId } = useDocumentStore.getState();
    const w = 1440;
    const h = 900;
    const gap = 100;

    const pages = [
        { name: 'Landing Page (Light)', theme: 'light' },
        { name: 'Dashboard (Light)', theme: 'light' },
        { name: 'Landing Page (Dark)', theme: 'dark' },
        { name: 'Dashboard (Dark)', theme: 'dark' }
    ];

    pages.forEach((page, index) => {
        const id = generateId();
        const x = startX + (index * (w + gap));
        const y = startY;
        const isDark = page.theme === 'dark';

        addNode({
            id, type: 'FRAME', name: page.name, x, y, width: w, height: h, parentId: rootId, children: [],
            layout: { layoutMode: 'NONE' },
            style: { fill: isDark ? '#111827' : '#ffffff', stroke: isDark ? '#374151' : '#e5e7eb', strokeWidth: 1 }
        });

        // Navbar
        addNode({
            id: generateId(), type: 'RECT', name: 'Navbar', x: 0, y: 0, width: w, height: 80, parentId: id, children: [],
            layout: { layoutMode: 'NONE' },
            style: { fill: isDark ? '#1f2937' : '#f9fafb', stroke: 'none' }
        });

        // Hero / Content
        addNode({
            id: generateId(), type: 'TEXT', name: 'Hero Title', text: page.name, x: 100, y: 200, width: 500, height: 60, parentId: id, children: [],
            layout: { layoutMode: 'NONE' },
            style: { fill: isDark ? '#ffffff' : '#111827', fontSize: 48, fontFamily: 'Inter', fontWeight: 'bold' }
        });
    });
};

export const createVideoGameFlow = (startX: number = 0, startY: number = 0) => {
    // Reuse existing generators for MW3 style
    const { addNode } = useDocumentStore.getState().actions;
    const { rootId } = useDocumentStore.getState();
    const w = 1920;
    const h = 1080;
    const gap = 100;

    const screens = ['Lobby', 'Gunsmith', 'HUD', 'Scoreboard', 'Loadout'];

    // We handle this manually to reuse the specific logic which normally takes a frame ID
    // Check existing functions: createMW3Preset(parentId, tag, w, h)

    screens.forEach((screen, index) => {
        const id = generateId();
        const x = startX + (index * (w + gap));
        const y = startY;

        addNode({
            id, type: 'FRAME', name: `MW3 - ${screen}`, x, y, width: w, height: h, parentId: rootId, children: [],
            layout: { layoutMode: 'NONE' },
            style: { fill: '#000000', stroke: '#333', strokeWidth: 1 }
        });

        const tagMap: Record<string, string> = {
            'Lobby': 'mw3_lobby',
            'Gunsmith': 'mw3_gunsmith',
            'HUD': 'mw3_hud',
            'Scoreboard': 'mw3_scoreboard',
            'Loadout': 'mw3_loadout'
        };

        createMW3Preset(id, tagMap[screen], w, h);
    });
};
