import { useDocumentStore } from '../store/documentStore';
import { generateId } from '../store/documentStore';

const createId = generateId;

// Helper to create a node easily
const createNode = (
    type: 'FRAME' | 'RECT' | 'TEXT' | 'ELLIPSE',
    name: string,
    x: number,
    y: number,
    w: number,
    h: number,
    parentId: string,
    style: any = {},
    text?: string
) => {
    const { addNode } = useDocumentStore.getState().actions;
    const id = createId();
    addNode({
        id,
        type,
        name,
        x,
        y,
        width: w,
        height: h,
        parentId,
        text,
        children: [],
        layout: { layoutMode: 'NONE' },
        style: {
            fill: 'transparent',
            stroke: '#ffffff',
            strokeWidth: 1,
            ...style
        }
    });
    return id;
};

export const generateMockGameUI = (screenName: string, _engine: string, index: number) => {
    // Grid Layout Constants
    const COLS = 3; // Changed to 3 cols for wider layout
    const GAP = 60;
    const WIDTH = 1000; // 16:9 Aspect Ratio approx
    const HEIGHT = 562;

    // Calculate Position on Canvas
    const startX = 0;
    const startY = 0;
    const gridX = startX + (index % COLS) * (WIDTH + GAP);
    const gridY = startY + Math.floor(index / COLS) * (HEIGHT + GAP);

    // 1. Create Main Container Frame (The Screen)
    const frameId = createNode('FRAME', `${screenName}_Root`, gridX, gridY, WIDTH, HEIGHT, 'root', {
        fill: '#121212', // Dark background for wireframe
        stroke: '#333333',
        strokeWidth: 2
    });

    const SAFE_X = 50;
    const SAFE_Y = 50;
    const CONTENT_W = WIDTH - (SAFE_X * 2);

    // --- AAA Unreal Screen Generators ---

    if (screenName.includes('MainMenu_v2')) {
        // Semantic: High-impact visuals, clear navigation, social/news integration.
        // Dynamic BG
        createNode('RECT', 'Cinematic_BG', 0, 0, WIDTH, HEIGHT, frameId, { fill: '#0a0a0a', stroke: 'none' });

        // Navigation (Left Align)
        const menuItems = ['PLAY', 'WEAPONS', 'OPERATORS', 'BATTLE PASS', 'STORE', 'BARRACKS'];
        menuItems.forEach((item, i) => {
            const y = 180 + i * 60;
            createNode('TEXT', `Menu_${item}`, SAFE_X, y, 300, 40, frameId, {
                color: i === 0 ? '#ffd700' : '#fff', fontSize: 32, fontWeight: '800', stroke: 'none', letterSpacing: '2px'
            }, item);
            if (i === 0) createNode('RECT', 'Active_Ind', SAFE_X - 15, y + 5, 4, 30, frameId, { fill: '#ffd700', stroke: 'none' });
        });

        // News Feed (Right Align)
        const newsW = 320;
        const newsX = WIDTH - newsW - SAFE_X;
        createNode('FRAME', 'News_Container', newsX, 100, newsW, HEIGHT - 150, frameId, { stroke: 'none' });
        createNode('TEXT', 'News_Header', newsX, 100, 200, 30, frameId, { color: '#ffd700', fontSize: 18, fontWeight: 'bold', stroke: 'none', letterSpacing: '1px' }, 'MESSAGE OF THE DAY');

        [1, 2, 3].forEach((n, i) => {
            const itemY = 140 + i * 130;
            createNode('RECT', `News_Img_${n}`, newsX, itemY, newsW, 80, frameId, { fill: '#222', stroke: '#333' });
            createNode('TEXT', `News_Title_${n}`, newsX, itemY + 90, newsW, 20, frameId, { color: '#fff', fontSize: 14, fontWeight: 'bold', stroke: 'none' }, `DOUBLE XP EVENT ${n}`);
            createNode('TEXT', `News_Body_${n}`, newsX, itemY + 110, newsW, 20, frameId, { color: '#888', fontSize: 12, stroke: 'none' }, 'Live now -> Ends Monday');
        });

        // Player Profile (Top Right)
        createNode('TEXT', 'Player_Rank', WIDTH - 200 - SAFE_X, SAFE_Y, 200, 30, frameId, { color: '#fff', fontSize: 20, textAlign: 'right', fontWeight: 'bold', stroke: 'none' }, 'RANK 55 [GEN]');
    }

    else if (screenName.includes('Lobby_Squad')) {
        // Background
        createNode('RECT', '3D_Stage_BG', 0, 0, WIDTH, HEIGHT, frameId, { fill: '#111', stroke: 'none' });

        // Character Pedestals (Centered)
        const charCount = 4;
        const charW = 180;
        const charGap = 40;
        const totalW = (charCount * charW) + ((charCount - 1) * charGap);
        const startX_Chars = (WIDTH - totalW) / 2;

        for (let i = 0; i < charCount; i++) {
            const x = startX_Chars + i * (charW + charGap);
            createNode('ELLIPSE', `Pedestal_${i}`, x + charW / 2, 450, charW / 2 + 20, 20, frameId, { fill: 'transparent', stroke: '#444', strokeWidth: 1 });
            createNode('RECT', `Model_Placeholder_${i}`, x, 180, charW, 280, frameId, { fill: i === 0 ? '#222' : '#1a1a1a', stroke: i === 0 ? '#ffd700' : '#333', strokeDasharray: i === 0 ? '0' : '5 5' });

            // Nameplate
            createNode('RECT', `Name_BG_${i}`, x, 470, charW, 30, frameId, { fill: '#000', opacity: 0.8, stroke: 'none' });
            createNode('TEXT', `Name_${i}`, x, 475, charW, 20, frameId, { color: i === 0 ? '#ffd700' : '#ccc', textAlign: 'center', fontSize: 14, stroke: 'none' }, i === 0 ? 'YOU' : 'SQUADMATE');
        }

        // Match Info (Bottom)
        createNode('FRAME', 'Match_Info', WIDTH / 2 - 250, HEIGHT - 80, 500, 60, frameId, { fill: '#1a1a1a', stroke: '#ffd700', strokeWidth: 1 });
        createNode('TEXT', 'Match_Type', WIDTH / 2 - 200, HEIGHT - 65, 400, 30, frameId, { color: '#ffd700', fontSize: 20, textAlign: 'center', fontWeight: 'bold', stroke: 'none' }, 'QUICK PLAY: TEAM DEATHMATCH');
    }

    else if (screenName.includes('Loadout_Select')) {
        createNode('TEXT', 'Page_Title', SAFE_X, SAFE_Y, 400, 40, frameId, { color: '#fff', fontSize: 40, fontWeight: 'bold', stroke: 'none' }, 'CUSTOM LOADOUTS');

        const classes = [
            { name: 'ASSAULT ALPHA', prim: 'M4A1', sec: 'P1911', tac: 'Flash', leth: 'Frag' },
            { name: 'SNIPER CHARLIE', prim: 'HDR', sec: 'Isokinetic', tac: 'Smoke', leth: 'Mine' },
            { name: 'HEAVY SUPPORT', prim: 'PKM', sec: 'RPG-7', tac: 'Stun', leth: 'C4' },
            { name: 'SMG RUSHER', prim: 'MP5', sec: 'Combat Knife', tac: 'Stim', leth: 'Semtex' },
            { name: 'RECON SCOUT', prim: 'FAL', sec: 'Renetti', tac: 'Spotter', leth: 'Claymore' }
        ];

        classes.forEach((c, i) => {
            const bgY = 120 + i * 85;
            createNode('RECT', `Row_BG_${i}`, SAFE_X, bgY, CONTENT_W, 75, frameId, { fill: '#161616', stroke: i === 0 ? '#ffd700' : '#333', strokeWidth: i === 0 ? 2 : 1 });

            createNode('TEXT', `Num_${i}`, SAFE_X + 20, bgY + 15, 30, 40, frameId, { color: '#555', fontSize: 32, fontWeight: 'bold', stroke: 'none' }, `${i + 1}`);
            createNode('TEXT', `Name_${i}`, SAFE_X + 70, bgY + 25, 200, 30, frameId, { color: i === 0 ? '#ffd700' : '#fff', fontSize: 20, fontWeight: 'bold', stroke: 'none' }, c.name);
            createNode('TEXT', `Desc_${i}`, SAFE_X + 300, bgY + 28, 400, 20, frameId, { color: '#aaa', fontSize: 14, stroke: 'none' }, `${c.prim}  |  ${c.sec}  |  ${c.leth}`);

            createNode('RECT', `Edit_Btn_${i}`, WIDTH - SAFE_X - 100, bgY + 20, 80, 35, frameId, { fill: 'transparent', stroke: '#fff' });
            createNode('TEXT', `Btn_Lbl_${i}`, WIDTH - SAFE_X - 90, bgY + 28, 60, 20, frameId, { color: '#fff', fontSize: 12, stroke: 'none' }, 'CUSTOMIZE');
        });
    }

    else if (screenName.includes('Gunsmith')) {
        // Header
        createNode('TEXT', 'Weapon_Header', SAFE_X, SAFE_Y, 300, 30, frameId, { color: '#aaa', fontSize: 14, stroke: 'none' }, 'WEAPON EDIT > ASSAULT RIFLE');
        createNode('TEXT', 'Weapon_Name', SAFE_X, SAFE_Y + 30, 400, 50, frameId, { color: '#fff', fontSize: 48, fontWeight: 'bold', stroke: 'none' }, 'AR-15 TACTICAL');

        // Weapon View (Center)
        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;
        createNode('RECT', 'Weapon_Silhouette', centerX - 300, centerY - 100, 600, 200, frameId, { fill: '#222', stroke: 'none' }); // Shape placeholder

        // Attachment Slots around centerpiece
        const slots = [
            { label: 'MUZZLE', x: centerX - 250, y: centerY + 50 },
            { label: 'BARREL', x: centerX - 150, y: centerY - 80 },
            { label: 'LASER', x: centerX - 50, y: centerY - 90 },
            { label: 'OPTIC', x: centerX + 50, y: centerY - 100 },
            { label: 'STOCK', x: centerX + 250, y: centerY + 20 },
            { label: 'REAR GRIP', x: centerX + 200, y: centerY + 80 },
            { label: 'MAGAZINE', x: centerX + 50, y: centerY + 100 },
            { label: 'UNDERBARREL', x: centerX - 100, y: centerY + 110 }
        ];

        slots.forEach((s) => {
            createNode('ELLIPSE', `Node_${s.label}`, s.x, s.y, 12, 12, frameId, { fill: '#ffd700', stroke: 'none' });
            createNode('TEXT', `Lbl_${s.label}`, s.x - 40, s.y + (s.y > centerY ? 20 : -30), 80, 20, frameId, { color: '#fff', fontSize: 10, textAlign: 'center', stroke: 'none' }, s.label);
        });

        // Stats Box (Bottom Left)
        createNode('FRAME', 'Stats_Box', SAFE_X, HEIGHT - 180, 250, 150, frameId, { stroke: '#444' });
        createNode('TEXT', 'Stats_H', SAFE_X + 20, HEIGHT - 160, 100, 20, frameId, { color: '#fff', fontWeight: 'bold', stroke: 'none' }, 'STATS');
        ['ACCURACY', 'DAMAGE', 'RANGE', 'FIRE RATE', 'MOBILITY', 'CONTROL'].forEach((stat, i) => {
            const rowY = HEIGHT - 130 + i * 20;
            createNode('TEXT', `S_Lbl_${i}`, SAFE_X + 20, rowY, 80, 14, frameId, { color: '#aaa', fontSize: 10, stroke: 'none' }, stat);
            createNode('RECT', `S_Bar_BG_${i}`, SAFE_X + 100, rowY + 2, 130, 6, frameId, { fill: '#333', stroke: 'none' });
            createNode('RECT', `S_Bar_Fill_${i}`, SAFE_X + 100, rowY + 2, 50 + Math.random() * 80, 6, frameId, { fill: i % 2 === 0 ? '#fff' : '#4ade80', stroke: 'none' });
        });
    }

    else if (screenName.includes('Operator')) {
        // Layout: List on bottom, Bio on Right, 3D on Left
        createNode('TEXT', 'Op_Header', SAFE_X, SAFE_Y, 300, 40, frameId, { color: '#fff', fontSize: 36, fontWeight: 'bold', stroke: 'none' }, 'OPERATORS');

        // Character List Filmstrip
        const stripY = HEIGHT - 160;
        createNode('RECT', 'Strip_BG', 0, stripY, WIDTH, 160, frameId, { fill: '#111', stroke: 'none' });
        for (let i = 0; i < 6; i++) {
            createNode('FRAME', `Char_Card_${i}`, SAFE_X + i * 130, stripY + 30, 110, 110, frameId, { fill: '#222', stroke: i === 2 ? '#ffd700' : '#444' });
            createNode('TEXT', `C_Name_${i}`, SAFE_X + i * 130, stripY + 110, 110, 20, frameId, { color: '#fff', textAlign: 'center', fontSize: 12, stroke: 'none' }, `OPERATOR ${i + 1}`);
        }

        // Bio Panel (Floating Right)
        const bioW = 350;
        createNode('FRAME', 'Bio_Card', WIDTH - bioW - SAFE_X, SAFE_Y + 50, bioW, HEIGHT - 250, frameId, { fill: '#161616', stroke: '#333' });
        createNode('TEXT', 'Bio_Name', WIDTH - bioW - SAFE_X + 20, SAFE_Y + 80, 200, 30, frameId, { color: '#ffd700', fontSize: 28, fontWeight: 'bold', stroke: 'none' }, 'GHOST');
        createNode('TEXT', 'Bio_Fac', WIDTH - bioW - SAFE_X + 20, SAFE_Y + 120, 200, 20, frameId, { color: '#888', fontSize: 14, stroke: 'none' }, 'TASK FORCE 141');
        createNode('RECT', 'Div_Line', WIDTH - bioW - SAFE_X + 20, SAFE_Y + 150, bioW - 40, 1, frameId, { fill: '#444', stroke: 'none' });
        createNode('TEXT', 'Bio_Text', WIDTH - bioW - SAFE_X + 20, SAFE_Y + 170, 300, 200, frameId, { color: '#ccc', fontSize: 14, stroke: 'none' }, 'Lieutenant Simon "Ghost" Riley. Special Forces operator. Expert in stealth and infiltration. [REDACTED] previous mission data.');
    }

    else if (screenName.includes('BattlePass')) {
        createNode('TEXT', 'BP_H1', SAFE_X, SAFE_Y, 400, 40, frameId, { color: '#ffd700', fontSize: 40, fontWeight: 'bold', stroke: 'none' }, 'BATTLE PASS');
        createNode('TEXT', 'BP_Sub', SAFE_X, SAFE_Y + 50, 400, 20, frameId, { color: '#fff', fontSize: 18, stroke: 'none' }, 'SEASON 01 - SECTOR MAP');

        // Track visual (Hexagon grid style or Linear)
        const mapX = SAFE_X;
        const mapY = 180;
        const mapW = CONTENT_W;

        createNode('RECT', 'Path_Line', mapX, mapY + 60, mapW, 6, frameId, { fill: '#333', stroke: 'none' });
        createNode('RECT', 'Prog_Line', mapX, mapY + 60, mapW * 0.4, 6, frameId, { fill: '#ffd700', stroke: 'none' });

        for (let i = 0; i < 6; i++) {
            const x = mapX + 80 + i * (mapW / 6);
            const isUnlocked = i < 3;
            createNode('FRAME', `Sector_${i}`, x - 50, mapY, 100, 120, frameId, { fill: isUnlocked ? '#1a1a1a' : '#0a0a0a', stroke: isUnlocked ? '#ffd700' : '#444', strokeWidth: isUnlocked ? 2 : 1 });
            createNode('TEXT', `Sec_Num_${i}`, x - 40, mapY + 10, 30, 20, frameId, { color: '#888', fontSize: 12, stroke: 'none' }, `A${i + 1}`);
            createNode('TEXT', `Item_${i}`, x - 40, mapY + 50, 80, 40, frameId, { color: '#fff', fontSize: 12, textAlign: 'center', stroke: 'none' }, 'REWARD ITEM');

            if (i === 2) {
                createNode('RECT', 'Claim_Btn', x - 40, mapY + 95, 80, 20, frameId, { fill: '#ffd700', stroke: 'none' });
                createNode('TEXT', 'Claim_Txt', x - 40, mapY + 98, 80, 15, frameId, { color: '#000', fontSize: 10, textAlign: 'center', fontWeight: 'bold', stroke: 'none' }, 'CLAIM');
            }
        }

        createNode('FRAME', 'Buy_Block', WIDTH - 300, SAFE_Y, 250, 80, frameId, { fill: '#ffd700', stroke: 'none' });
        createNode('TEXT', 'Buy_Txt', WIDTH - 280, SAFE_Y + 20, 200, 25, frameId, { color: '#000', fontSize: 20, fontWeight: 'bold', stroke: 'none' }, 'UPGRADE PASS');
        createNode('TEXT', 'Cost', WIDTH - 280, SAFE_Y + 45, 200, 20, frameId, { color: '#000', fontSize: 14, stroke: 'none' }, '1100 CP');
    }

    else if (screenName.includes('Store')) {
        createNode('TEXT', 'Store_Head', SAFE_X, SAFE_Y, 200, 40, frameId, { color: '#fff', fontSize: 32, fontWeight: 'bold', stroke: 'none' }, 'STORE');

        // Grid Layout: 1 Large Left, 4 Small Right
        const gridW = CONTENT_W;
        const gridH = HEIGHT - 150;

        // Hero Card
        createNode('FRAME', 'Hero_Item', SAFE_X, 120, gridW * 0.4, gridH, frameId, { fill: '#141414', stroke: '#444' });
        createNode('TEXT', 'Hero_Tag', SAFE_X + 20, 140, 100, 20, frameId, { color: '#ffd700', fontSize: 12, fontWeight: 'bold', stroke: 'none' }, 'FEATURED');
        createNode('TEXT', 'Hero_Title', SAFE_X + 20, 170, 300, 40, frameId, { color: '#fff', fontSize: 32, fontWeight: 'bold', stroke: 'none' }, 'WINTER OPS\nBUNDLE');
        createNode('RECT', 'Hero_Price_Tag', SAFE_X + 20, 120 + gridH - 50, 100, 30, frameId, { fill: '#fff', stroke: 'none' });
        createNode('TEXT', 'Hero_Price', SAFE_X + 35, 120 + gridH - 45, 80, 20, frameId, { color: '#000', fontWeight: 'bold', stroke: 'none' }, '2400 CP');

        // Small Cards Grid
        const smallW = (gridW * 0.6) / 2 - 10;
        const smallH = (gridH - 20) / 2;
        const startX_Grid = SAFE_X + (gridW * 0.4) + 20;

        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 2; c++) {
                createNode('FRAME', `Item_${r}_${c}`, startX_Grid + c * (smallW + 20), 120 + r * (smallH + 20), smallW, smallH, frameId, { fill: '#1a1a1a', stroke: '#333' });
                createNode('TEXT', `Itm_Name_${r}_${c}`, startX_Grid + c * (smallW + 20) + 15, 120 + r * (smallH + 20) + smallH - 40, 150, 20, frameId, { color: '#eee', fontSize: 14, stroke: 'none' }, 'WEAPON BLUEPRINT');
            }
        }
    }

    else if (screenName.includes('Settings')) {
        createNode('RECT', 'Modal_Overlay', 0, 0, WIDTH, HEIGHT, frameId, { fill: '#000', opacity: 0.8, stroke: 'none' });

        const modalW = 900;
        const modalH = 500;
        const mx = (WIDTH - modalW) / 2;
        const my = (HEIGHT - modalH) / 2;

        const modalId = createNode('FRAME', 'Settings_Modal', mx, my, modalW, modalH, frameId, { fill: '#161616', stroke: '#444' });

        // Tabs
        const tabs = ['GRAPHICS', 'AUDIO', 'KEYBINDS', 'ACCOUNT'];
        tabs.forEach((tab, i) => {
            createNode('TEXT', `Tab_${i}`, mx + 40 + i * 150, my + 40, 120, 30, frameId, { color: i === 0 ? '#fff' : '#666', fontSize: 18, fontWeight: 'bold', stroke: 'none' }, tab);
            if (i === 0) createNode('RECT', 'Tab_Line', mx + 40, my + 70, 100, 2, frameId, { fill: '#fff', stroke: 'none' });
        });

        // Content
        const opts = ['Display Mode', 'Aspect Ratio', 'V-Sync', 'Frame Rate Limit', 'Brightness', 'Field of View'];
        opts.forEach((opt, i) => {
            const rowY = my + 100 + i * 50;
            createNode('RECT', `Row_BG_${i}`, mx + 40, rowY, modalW - 80, 40, frameId, { fill: i % 2 === 0 ? '#1a1a1a' : 'transparent', stroke: 'none' });
            createNode('TEXT', `Opt_Lbl_${i}`, mx + 60, rowY + 10, 200, 20, frameId, { color: '#ccc', fontSize: 14, stroke: 'none' }, opt);
            createNode('TEXT', `Opt_Val_${i}`, mx + 400, rowY + 10, 200, 20, frameId, { color: '#fff', fontSize: 14, stroke: 'none' }, 'Automatic / High');
        });
    }

    else if (screenName.includes('Matchmaking')) {
        createNode('RECT', 'Map_Blur', 0, 0, WIDTH, HEIGHT, frameId, { fill: '#111', stroke: 'none' });

        // Info Box Bottom Left
        createNode('FRAME', 'Status_Box', SAFE_X, HEIGHT - 200, 400, 150, frameId, { fill: '#0a0a0a', stroke: '#ffd700', strokeWidth: 2 });
        createNode('TEXT', 'Status_Header', SAFE_X + 20, HEIGHT - 170, 300, 30, frameId, { color: '#ffd700', fontSize: 24, fontWeight: 'bold', stroke: 'none' }, 'SEARCHING FOR MATCH < 58MS');
        createNode('TEXT', 'Playlist', SAFE_X + 20, HEIGHT - 130, 300, 20, frameId, { color: '#fff', fontSize: 14, stroke: 'none' }, 'PLAYLIST: HARDCORE MOSH PIT');

        // Lobby List overlay right
        const listW = 300;
        createNode('FRAME', 'Lobby_List', WIDTH - listW - SAFE_X, SAFE_Y, listW, HEIGHT - 100, frameId, { fill: 'rgba(0,0,0,0.8)', stroke: 'none' });
        createNode('TEXT', 'Lobby_H', WIDTH - listW - SAFE_X + 20, SAFE_Y + 20, 200, 20, frameId, { color: '#fff', fontWeight: 'bold', stroke: 'none' }, 'LOBBY (6/12)');
        for (let i = 0; i < 6; i++) {
            createNode('RECT', `P_Row_${i}`, WIDTH - listW - SAFE_X + 10, SAFE_Y + 60 + i * 40, listW - 20, 30, frameId, { fill: '#222', stroke: 'none' });
            createNode('TEXT', `P_Name_${i}`, WIDTH - listW - SAFE_X + 40, SAFE_Y + 65 + i * 40, 150, 20, frameId, { color: '#aaa', fontSize: 12, stroke: 'none' }, `Player_Tag_${i}`);
        }
    }

    else if (screenName.includes('Loading')) {
        // Full Image Placeholder
        createNode('RECT', 'Concept_Art', 0, 0, WIDTH, HEIGHT, frameId, { fill: '#1a1a1a', stroke: 'none' });

        // Tip Box
        createNode('RECT', 'Tip_BG', 0, HEIGHT - 150, WIDTH, 150, frameId, { fill: '#000', opacity: 0.8, stroke: 'none' });
        createNode('TEXT', 'Map_Title', SAFE_X, HEIGHT - 120, 400, 50, frameId, { color: '#fff', fontSize: 48, fontWeight: 'bold', stroke: 'none' }, 'TERMINAL');
        createNode('TEXT', 'Tip_Txt', SAFE_X, HEIGHT - 60, 600, 30, frameId, { color: '#ffd700', fontSize: 18, fontStyle: 'italic', stroke: 'none' }, 'TIP: Use smoke grenades to cover your advance across the tarmac.');

        // Loader
        createNode('RECT', 'Load_Line', 0, HEIGHT - 10, WIDTH, 10, frameId, { fill: '#222', stroke: 'none' });
        createNode('RECT', 'Load_Prog', 0, HEIGHT - 10, WIDTH * 0.65, 10, frameId, { fill: '#fff', stroke: 'none' });
    }

    else if (screenName.includes('HUD_Tactical')) {
        // Compass Strip Top Center
        const compW = 600;
        createNode('RECT', 'Compass_BG', (WIDTH - compW) / 2, 30, compW, 30, frameId, { fill: 'rgba(0,0,0,0.5)', stroke: 'none' });
        createNode('TEXT', 'Comp_Val', (WIDTH) / 2 - 10, 35, 40, 20, frameId, { color: '#fff', textAlign: 'center', stroke: 'none' }, 'NW');

        // Left Info (Minimap + Chat)
        createNode('FRAME', 'Minimap', SAFE_X, SAFE_Y, 200, 200, frameId, { fill: '#000', stroke: '#fff', opacity: 0.5 });
        createNode('TEXT', 'Killfeed', SAFE_X, 300, 250, 100, frameId, { color: '#eee', fontSize: 12, stroke: 'none' }, 'Ghost [M4] Shepard\nPrice [AK47] Makarov');

        // Bottom Box (Ammo + Health)
        const statH = 80;
        createNode('RECT', 'Stat_BG', WIDTH - 350, HEIGHT - statH - SAFE_Y, 300, statH, frameId, { fill: 'rgba(0,0,0,0.5)', stroke: 'none' });
        createNode('TEXT', 'Ammo', WIDTH - 180, HEIGHT - statH - SAFE_Y + 15, 120, 50, frameId, { color: '#fff', fontSize: 48, fontWeight: 'bold', stroke: 'none' }, '30 | 120');
        createNode('RECT', 'Icon_Wep', WIDTH - 320, HEIGHT - statH - SAFE_Y + 20, 100, 40, frameId, { fill: '#fff', opacity: 0.2, stroke: 'none' });

        // Objectives (Center)
        createNode('RECT', 'Obj_A', WIDTH / 2 - 20, 120, 40, 40, frameId, { fill: 'transparent', stroke: '#4ade80', strokeWidth: 2 });
        createNode('TEXT', 'Obj_Lbl', WIDTH / 2 - 10, 130, 20, 20, frameId, { color: '#4ade80', textAlign: 'center', fontWeight: 'bold', stroke: 'none' }, 'A');
    }

    else if (screenName.includes('Scoreboard')) {
        createNode('RECT', 'Overlay_SB', 0, 0, WIDTH, HEIGHT, frameId, { fill: 'rgba(0,0,0,0.85)', stroke: 'none' });

        const tableW = 800;
        const tx = (WIDTH - tableW) / 2;

        createNode('TEXT', 'Mode_Header', tx, 60, tableW, 40, frameId, { color: '#fff', fontSize: 24, textAlign: 'center', fontWeight: 'bold', stroke: 'none' }, 'ALLIED FORCES vs COALITION');

        // Headers
        createNode('RECT', 'Th_BG', tx, 100, tableW, 40, frameId, { fill: '#333', stroke: 'none' });
        createNode('TEXT', 'Th_1', tx + 20, 110, 200, 20, frameId, { color: '#aaa', fontSize: 14, stroke: 'none' }, 'PLAYER');
        createNode('TEXT', 'Th_2', tx + 400, 110, 50, 20, frameId, { color: '#aaa', fontSize: 14, stroke: 'none' }, 'K');
        createNode('TEXT', 'Th_3', tx + 480, 110, 50, 20, frameId, { color: '#aaa', fontSize: 14, stroke: 'none' }, 'D');
        createNode('TEXT', 'Th_4', tx + 560, 110, 50, 20, frameId, { color: '#aaa', fontSize: 14, stroke: 'none' }, 'A');
        createNode('TEXT', 'Th_5', tx + 640, 110, 80, 20, frameId, { color: '#aaa', fontSize: 14, stroke: 'none' }, 'SCORE');

        // Rows
        for (let i = 0; i < 10; i++) {
            const ry = 145 + i * 35;
            createNode('RECT', `Tr_${i}`, tx, ry, tableW, 30, frameId, { fill: i === 0 ? 'rgba(255, 215, 0, 0.1)' : '#1a1a1a', stroke: 'none' });
            createNode('TEXT', `Td_Name_${i}`, tx + 20, ry + 5, 200, 20, frameId, { color: i === 0 ? '#ffd700' : '#ccc', fontSize: 14, stroke: 'none' }, i === 0 ? 'You' : `Soldier_${i}`);
            createNode('TEXT', `Td_K_${i}`, tx + 400, ry + 5, 50, 20, frameId, { color: '#fff', fontSize: 14, stroke: 'none' }, `${24 - i}`);
        }
    }

    else if (screenName.includes('TacMap')) {
        createNode('RECT', 'Sat_Map', 0, 0, WIDTH, HEIGHT, frameId, { fill: '#0f172a', stroke: '#334155' });
        createNode('RECT', 'Grid_Overlay', 0, 0, WIDTH, HEIGHT, frameId, { fill: 'transparent', stroke: '#1e293b', strokeDasharray: '40 40', strokeWidth: 1 });

        // Zones
        ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO'].forEach((z, i) => {
            createNode('TEXT', `Z_${z}`, 100 + i * 150, 150 + (i % 2) * 100, 100, 30, frameId, { color: 'rgba(255,255,255,0.2)', fontSize: 36, fontWeight: 'bold', stroke: 'none' }, z);
        });

        // POIs
        createNode('ELLIPSE', 'Obj_HQ', WIDTH / 2, HEIGHT / 2, 20, 20, frameId, { fill: '#fff', stroke: 'none' });
        createNode('TEXT', 'HQ_Lbl', WIDTH / 2 - 20, HEIGHT / 2 + 25, 40, 20, frameId, { color: '#fff', textAlign: 'center', stroke: 'none' }, 'HQ');
    }

    else if (screenName.includes('AfterAction')) {
        createNode('TEXT', 'Win_Msg', WIDTH / 2 - 200, SAFE_Y, 400, 60, frameId, { color: '#4ade80', fontSize: 64, textAlign: 'center', fontWeight: 'bold', stroke: 'none' }, 'VICTORY');

        // XP Circle Center
        const cx = WIDTH / 2;
        const cy = HEIGHT / 2;
        const r = 120;
        createNode('ELLIPSE', 'XP_Ring_BG', cx, cy, r * 2, r * 2, frameId, { fill: 'transparent', stroke: '#333', strokeWidth: 15 });
        createNode('ELLIPSE', 'XP_Ring_Fg', cx, cy, r * 2, r * 2, frameId, { fill: 'transparent', stroke: '#ffd700', strokeWidth: 15, strokeDasharray: '500 1000' });

        createNode('TEXT', 'Rank_Main', cx - 50, cy - 30, 100, 60, frameId, { color: '#fff', fontSize: 64, fontWeight: 'bold', textAlign: 'center', stroke: 'none' }, '56');
        createNode('TEXT', 'Rank_Sub', cx - 50, cy + 40, 100, 20, frameId, { color: '#aaa', fontSize: 16, textAlign: 'center', stroke: 'none' }, 'RANK UP!');

        // Stats Footer
        createNode('FRAME', 'Stat_Row', SAFE_X, HEIGHT - 120, WIDTH - 2 * SAFE_X, 80, frameId, { fill: '#1a1a1a', stroke: '#444' });
        createNode('TEXT', 'Tot_XP', WIDTH / 2 - 100, HEIGHT - 95, 200, 30, frameId, { color: '#fff', textAlign: 'center', fontSize: 24, stroke: 'none' }, '+25,400 XP');
    }

    else if (screenName.includes('Social_Hub')) {
        createNode('TEXT', 'Soc_H', SAFE_X, SAFE_Y, 300, 40, frameId, { color: '#fff', fontSize: 32, fontWeight: 'bold', stroke: 'none' }, 'SOCIAL');

        // 3 Columns: Friends, Party, Recent
        const colW = (CONTENT_W - 40) / 3;
        ['ONLINE FRIENDS', 'PARTY', 'RECENT PLAYERS'].forEach((grp, i) => {
            const cx = SAFE_X + i * (colW + 20);
            createNode('TEXT', `Grp_${i}`, cx, 100, 200, 20, frameId, { color: '#888', fontWeight: 'bold', stroke: 'none' }, grp);

            // List Background
            createNode('RECT', `List_BG_${i}`, cx, 130, colW, HEIGHT - 200, frameId, { fill: '#121212', stroke: '#333' });

            // Items
            for (let j = 0; j < 8; j++) {
                createNode('RECT', `Row_${i}_${j}`, cx + 10, 140 + j * 50, colW - 20, 40, frameId, { fill: '#1e1e1e', stroke: 'none' });
                createNode('ELLIPSE', `Dot_${i}_${j}`, cx + 25, 160 + j * 50, 10, 10, frameId, { fill: i === 0 ? '#4ade80' : '#555', stroke: 'none' });
                createNode('TEXT', `Name_${i}_${j}`, cx + 45, 153 + j * 50, 150, 20, frameId, { color: '#eee', fontSize: 12, stroke: 'none' }, `User_Tag_${j}`);
            }
        });
    }

    else if (screenName.includes('Challenges')) {
        createNode('TEXT', 'Chal_Title', SAFE_X, SAFE_Y, 300, 40, frameId, { color: '#fff', fontSize: 32, fontWeight: 'bold', stroke: 'none' }, 'CHALLENGES');

        // Large Daily Cards
        const cardH = 120;
        for (let i = 0; i < 3; i++) {
            const y = 120 + i * (cardH + 20);
            createNode('FRAME', `C_Card_${i}`, SAFE_X, y, CONTENT_W, cardH, frameId, { fill: '#161616', stroke: i === 0 ? '#ffd700' : '#333' });

            createNode('TEXT', `C_Head_${i}`, SAFE_X + 30, y + 20, 400, 30, frameId, { color: '#fff', fontSize: 20, fontWeight: 'bold', stroke: 'none' }, i === 0 ? 'DAILY: HEADHUNTER' : 'WEEKLY: EXPLOSIVE EXPERT');
            createNode('TEXT', `C_Desc_${i}`, SAFE_X + 30, y + 50, 500, 20, frameId, { color: '#aaa', fontSize: 14, stroke: 'none' }, 'Get 15 Headshots in Team Deathmatch matches');

            // Progress bar
            createNode('RECT', `P_Bar_BG_${i}`, SAFE_X + 30, y + 80, 500, 10, frameId, { fill: '#333', stroke: 'none' });
            createNode('RECT', `P_Bar_Fill_${i}`, SAFE_X + 30, y + 80, 350, 10, frameId, { fill: '#ffd700', stroke: 'none' });
            createNode('TEXT', `XP_${i}`, WIDTH - SAFE_X - 150, y + 40, 100, 30, frameId, { color: '#ffd700', fontSize: 24, textAlign: 'right', stroke: 'none' }, '10000 XP');
        }
    }

    else {
        // Game Over or Generic
        createNode('TEXT', 'Generic_Title', 50, 50, 500, 50, frameId, { color: '#fff', fontSize: 40, stroke: 'none' }, screenName.replace(/_/g, ' '));

        if (screenName.includes('GameOver')) {
            // Improved Layout
            const centerX = WIDTH / 2;
            const centerY = HEIGHT / 2;

            createNode('TEXT', 'GO_Text', centerX - 250, centerY - 120, 500, 80, frameId, {
                color: '#ff4444', fontSize: 64, fontWeight: 'bold', textAlign: 'center', stroke: 'none'
            }, 'GAME OVER');

            const statsW = 400;
            const statsX = centerX - statsW / 2;
            const statsY = centerY - 20;

            // Stats Panel Background
            const statsPanel = createNode('FRAME', 'Stats_Panel', statsX, statsY, statsW, 100, frameId, { fill: '#1a1a1a', stroke: '#444' });

            createNode('TEXT', 'Score_Lbl', 20, 20, 100, 20, statsPanel, { color: '#888', fontSize: 14, stroke: 'none' }, 'TOTAL SCORE');
            createNode('TEXT', 'Score_Val', 20, 45, 200, 40, statsPanel, { color: '#fff', fontSize: 32, fontWeight: 'bold', stroke: 'none' }, '12,450');

            createNode('TEXT', 'Time_Lbl', 220, 20, 100, 20, statsPanel, { color: '#888', fontSize: 14, stroke: 'none' }, 'TIME PLAYED');
            createNode('TEXT', 'Time_Val', 220, 45, 150, 40, statsPanel, { color: '#fff', fontSize: 32, fontWeight: 'bold', stroke: 'none' }, '14:23');

            // Retry Button at bottom
            const btnW = 220;
            createNode('FRAME', 'Retry_Btn', centerX - btnW / 2, HEIGHT - 120, btnW, 60, frameId, { fill: '#fff', stroke: 'none' });
            createNode('TEXT', 'Retry_Lbl', centerX - 40, HEIGHT - 100, 80, 24, frameId, { color: '#000', fontSize: 20, fontWeight: 'bold', stroke: 'none' }, 'RETRY');
        } else {
            createNode('RECT', 'Content_Area', 50, 120, WIDTH - 100, HEIGHT - 200, frameId, { fill: 'transparent', stroke: '#444444', strokeDasharray: '5 5' });
            createNode('TEXT', 'Placeholder', WIDTH / 2 - 100, HEIGHT / 2, 200, 20, frameId, { color: '#444', stroke: 'none' }, 'Content Placeholder');
        }
    }
};
