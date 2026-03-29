import { Smartphone, Monitor, Instagram, Printer, Gamepad2, Swords } from 'lucide-react';

export interface FramePreset {
    name: string;
    w: number;
    h: number;
    type?: 'simple' | 'game_ui'; // 'simple' is just size, 'game_ui' generates content
    tag?: string; // e.g. 'brawl', 'souls'
}

export interface PresetCategory {
    category: string;
    icon: any;
    presets: FramePreset[];
}

export const FRAME_PRESETS: PresetCategory[] = [
    {
        category: 'Phone',
        icon: Smartphone,
        presets: [
            // Apple
            { name: 'iPhone 17 Pro Max', w: 430, h: 932 },
            { name: 'iPhone 17 Pro', w: 393, h: 852 },
            { name: 'iPhone 17 Plus', w: 428, h: 926 },
            { name: 'iPhone 17', w: 390, h: 844 },
            { name: 'iPhone 16 Pro Max', w: 430, h: 932 },
            { name: 'iPhone 16 Pro', w: 393, h: 852 },
            { name: 'iPhone 16 Plus', w: 428, h: 926 },
            { name: 'iPhone 16', w: 393, h: 852 },
            { name: 'iPhone 15 Pro Max', w: 430, h: 932 },
            { name: 'iPhone 15 Pro', w: 393, h: 852 },
            { name: 'iPhone 15 Plus', w: 430, h: 932 },
            { name: 'iPhone 15', w: 393, h: 852 },
            { name: 'iPhone 14 Pro Max', w: 430, h: 932 },
            { name: 'iPhone 14 Pro', w: 393, h: 852 },
            { name: 'iPhone 14 Plus', w: 428, h: 926 },
            { name: 'iPhone 14', w: 390, h: 844 },
            { name: 'iPhone 13 Pro Max', w: 428, h: 926 },
            { name: 'iPhone 13 Pro', w: 390, h: 844 },
            { name: 'iPhone 13', w: 390, h: 844 },
            { name: 'iPhone 13 Mini', w: 375, h: 812 },
            { name: 'iPhone 12 Pro Max', w: 428, h: 926 },
            { name: 'iPhone 12 Pro', w: 390, h: 844 },
            { name: 'iPhone 12', w: 390, h: 844 },
            { name: 'iPhone 12 Mini', w: 375, h: 812 },
            { name: 'iPhone 11 Pro Max', w: 414, h: 896 },
            { name: 'iPhone 11 Pro', w: 375, h: 812 },
            { name: 'iPhone 11', w: 414, h: 896 },
            { name: 'iPhone SE', w: 375, h: 667 },
            // Android
            { name: 'Android Small', w: 360, h: 640 },
            { name: 'Android Medium', w: 360, h: 800 },
            { name: 'Android Large', w: 412, h: 915 }, // Pixel 8 Pro / S24 Ultra ish
            { name: 'Pixel 8 Pro', w: 1344, h: 2992 }, // High density, maybe scale down? let's stick to viewport logic
            { name: 'Pixel 8', w: 412, h: 915 },
            { name: 'Samsung S24 Ultra', w: 412, h: 915 },
            { name: 'Samsung S24', w: 360, h: 780 },
            { name: 'Samsung S24+', w: 384, h: 832 },
            { name: 'Samsung Z Fold 5 (Unfolded)', w: 768, h: 1076 },
            { name: 'Samsung Z Fold 5 (Folded)', w: 344, h: 882 },
        ]
    },
    {
        category: 'Desktop',
        icon: Monitor,
        presets: [
            { name: 'Desktop 1440', w: 1440, h: 1024 },
            { name: 'Desktop 1280', w: 1280, h: 800 },
            { name: 'MacBook Pro 16', w: 1728, h: 1117 },
            { name: 'MacBook Pro 14', w: 1512, h: 982 },
            { name: 'MacBook Air', w: 1280, h: 832 },
            { name: 'iMac 24', w: 2240, h: 1260 },
            { name: 'Full HD', w: 1920, h: 1080 },
            { name: '4K', w: 3840, h: 2160 },
        ]
    },
    {
        category: 'Social',
        icon: Instagram,
        presets: [
            // Instagram
            { name: 'Instagram Post', w: 1080, h: 1080 },
            { name: 'Instagram Story', w: 1080, h: 1920 },
            { name: 'Instagram Portrait', w: 1080, h: 1350 },
            { name: 'Instagram Landscape', w: 1080, h: 566 },
            // Facebook
            { name: 'Facebook Post', w: 1200, h: 630 },
            { name: 'Facebook Cover', w: 820, h: 312 },
            { name: 'Facebook Story', w: 1080, h: 1920 },
            // LinkedIn
            { name: 'LinkedIn Post', w: 1200, h: 627 },
            { name: 'LinkedIn Cover', w: 1128, h: 191 },
            // Twitter / X
            { name: 'X Post', w: 1600, h: 900 },
            { name: 'X Header', w: 1500, h: 500 },
            // TikTok
            { name: 'TikTok Video', w: 1080, h: 1920 },
            { name: 'TikTok Profile', w: 200, h: 200 },
            // YouTube
            { name: 'YouTube Thumbnail', w: 1280, h: 720 },
            { name: 'YouTube Channel Art', w: 2560, h: 1440 },
        ]
    },
    {
        category: 'Paper',
        icon: Printer,
        presets: [
            { name: 'A0', w: 2384, h: 3370 },
            { name: 'A1', w: 1684, h: 2384 },
            { name: 'A2', w: 1191, h: 1684 },
            { name: 'A3', w: 842, h: 1191 },
            { name: 'A4', w: 595, h: 842 },
            { name: 'A5', w: 420, h: 595 },
            { name: 'A6', w: 297, h: 420 },
            { name: 'Letter', w: 612, h: 792 },
            { name: 'Legal', w: 612, h: 1008 },
            { name: 'Tabloid', w: 1008, h: 1632 },
        ]
    },
    {
        category: 'Mobile Game',
        icon: Gamepad2,
        presets: [
            { name: 'Battle HUD', w: 932, h: 430, type: 'game_ui', tag: 'brawl_battle' }, // Landscape Phone
            { name: 'Lobby Screen', w: 932, h: 430, type: 'game_ui', tag: 'brawl_lobby' },
            { name: 'Brawler Selection', w: 932, h: 430, type: 'game_ui', tag: 'brawl_select' },
            { name: 'End Game Screen', w: 932, h: 430, type: 'game_ui', tag: 'brawl_end' },
            { name: 'Shop Offer', w: 932, h: 430, type: 'game_ui', tag: 'brawl_shop' },
        ]
    },
    {
        category: 'Video Game',
        icon: Swords,
        presets: [
            { name: 'MW3 Lobby', w: 1920, h: 1080, type: 'game_ui', tag: 'mw3_lobby' },
            { name: 'MW3 Gunsmith', w: 1920, h: 1080, type: 'game_ui', tag: 'mw3_gunsmith' },
            { name: 'MW3 HUD', w: 1920, h: 1080, type: 'game_ui', tag: 'mw3_hud' },
            { name: 'MW3 Scoreboard', w: 1920, h: 1080, type: 'game_ui', tag: 'mw3_score' },
            { name: 'MW3 Loadout', w: 1920, h: 1080, type: 'game_ui', tag: 'mw3_loadout' },
        ]
    }
];
