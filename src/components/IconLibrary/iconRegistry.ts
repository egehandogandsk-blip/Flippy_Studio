// Icon registry for Lucide Icons
// This file contains a curated list of popular icons from lucide-react

export interface IconMetadata {
    name: string;
    displayName: string;
    keywords: string[];
    category: 'general' | 'arrows' | 'media' | 'communication' | 'files' | 'design' | 'development';
}

export const iconRegistry: IconMetadata[] = [
    // General
    { name: 'Heart', displayName: 'Heart', keywords: ['love', 'like', 'favorite'], category: 'general' },
    { name: 'Star', displayName: 'Star', keywords: ['favorite', 'rating', 'bookmark'], category: 'general' },
    { name: 'Home', displayName: 'Home', keywords: ['house', 'main', 'dashboard'], category: 'general' },
    { name: 'User', displayName: 'User', keywords: ['person', 'profile', 'account'], category: 'general' },
    { name: 'Users', displayName: 'Users', keywords: ['people', 'group', 'team'], category: 'general' },
    { name: 'Settings', displayName: 'Settings', keywords: ['config', 'preferences', 'gear'], category: 'general' },
    { name: 'Search', displayName: 'Search', keywords: ['find', 'magnify', 'look'], category: 'general' },
    { name: 'Bell', displayName: 'Bell', keywords: ['notification', 'alert', 'reminder'], category: 'general' },
    { name: 'Calendar', displayName: 'Calendar', keywords: ['date', 'schedule', 'event'], category: 'general' },
    { name: 'Clock', displayName: 'Clock', keywords: ['time', 'watch', 'timer'], category: 'general' },
    { name: 'Mail', displayName: 'Mail', keywords: ['email', 'message', 'inbox'], category: 'communication' },
    { name: 'Phone', displayName: 'Phone', keywords: ['call', 'mobile', 'contact'], category: 'communication' },
    { name: 'MessageCircle', displayName: 'Message', keywords: ['chat', 'comment', 'talk'], category: 'communication' },
    { name: 'Send', displayName: 'Send', keywords: ['submit', 'share', 'forward'], category: 'communication' },

    // Arrows
    { name: 'ArrowRight', displayName: 'Arrow Right', keywords: ['next', 'forward', 'direction'], category: 'arrows' },
    { name: 'ArrowLeft', displayName: 'Arrow Left', keywords: ['back', 'previous', 'direction'], category: 'arrows' },
    { name: 'ArrowUp', displayName: 'Arrow Up', keywords: ['top', 'increase', 'direction'], category: 'arrows' },
    { name: 'ArrowDown', displayName: 'Arrow Down', keywords: ['bottom', 'decrease', 'direction'], category: 'arrows' },
    { name: 'ChevronRight', displayName: 'Chevron Right', keywords: ['next', 'arrow', 'forward'], category: 'arrows' },
    { name: 'ChevronLeft', displayName: 'Chevron Left', keywords: ['back', 'arrow', 'previous'], category: 'arrows' },
    { name: 'ChevronUp', displayName: 'Chevron Up', keywords: ['top', 'arrow', 'collapse'], category: 'arrows' },
    { name: 'ChevronDown', displayName: 'Chevron Down', keywords: ['bottom', 'arrow', 'expand'], category: 'arrows' },

    // Media
    { name: 'Play', displayName: 'Play', keywords: ['video', 'start', 'media'], category: 'media' },
    { name: 'Pause', displayName: 'Pause', keywords: ['video', 'stop', 'media'], category: 'media' },
    { name: 'Music', displayName: 'Music', keywords: ['audio', 'song', 'sound'], category: 'media' },
    { name: 'Image', displayName: 'Image', keywords: ['photo', 'picture', 'media'], category: 'media' },
    { name: 'Video', displayName: 'Video', keywords: ['film', 'movie', 'media'], category: 'media' },
    { name: 'Camera', displayName: 'Camera', keywords: ['photo', 'picture', 'capture'], category: 'media' },
    { name: 'Volume2', displayName: 'Volume', keywords: ['sound', 'audio', 'speaker'], category: 'media' },

    // Files
    { name: 'File', displayName: 'File', keywords: ['document', 'page', 'paper'], category: 'files' },
    { name: 'FileText', displayName: 'File Text', keywords: ['document', 'text', 'page'], category: 'files' },
    { name: 'Folder', displayName: 'Folder', keywords: ['directory', 'files', 'storage'], category: 'files' },
    { name: 'Download', displayName: 'Download', keywords: ['save', 'export', 'get'], category: 'files' },
    { name: 'Upload', displayName: 'Upload', keywords: ['import', 'add', 'send'], category: 'files' },
    { name: 'Trash2', displayName: 'Trash', keywords: ['delete', 'remove', 'bin'], category: 'files' },
    { name: 'Copy', displayName: 'Copy', keywords: ['duplicate', 'clone', 'paste'], category: 'files' },

    // Design
    { name: 'Edit', displayName: 'Edit', keywords: ['pencil', 'write', 'modify'], category: 'design' },
    { name: 'Palette', displayName: 'Palette', keywords: ['color', 'paint', 'design'], category: 'design' },
    { name: 'Brush', displayName: 'Brush', keywords: ['paint', 'draw', 'art'], category: 'design' },
    { name: 'Pen', displayName: 'Pen', keywords: ['write', 'draw', 'tool'], category: 'design' },
    { name: 'Square', displayName: 'Square', keywords: ['shape', 'box', 'rectangle'], category: 'design' },
    { name: 'Circle', displayName: 'Circle', keywords: ['shape', 'round', 'ellipse'], category: 'design' },
    { name: 'Triangle', displayName: 'Triangle', keywords: ['shape', 'polygon'], category: 'design' },
    { name: 'Layers', displayName: 'Layers', keywords: ['stack', 'organize', 'group'], category: 'design' },

    // Development
    { name: 'Code', displayName: 'Code', keywords: ['programming', 'development', 'brackets'], category: 'development' },
    { name: 'Terminal', displayName: 'Terminal', keywords: ['console', 'command', 'shell'], category: 'development' },
    { name: 'Database', displayName: 'Database', keywords: ['storage', 'data', 'server'], category: 'development' },
    { name: 'Server', displayName: 'Server', keywords: ['cloud', 'hosting', 'backend'], category: 'development' },
    { name: 'Cpu', displayName: 'CPU', keywords: ['processor', 'chip', 'hardware'], category: 'development' },
    { name: 'HardDrive', displayName: 'Hard Drive', keywords: ['storage', 'disk', 'memory'], category: 'development' },
    { name: 'Wifi', displayName: 'WiFi', keywords: ['network', 'internet', 'connection'], category: 'development' },

    // More general icons
    { name: 'Check', displayName: 'Check', keywords: ['done', 'complete', 'success'], category: 'general' },
    { name: 'X', displayName: 'X', keywords: ['close', 'cancel', 'delete'], category: 'general' },
    { name: 'Plus', displayName: 'Plus', keywords: ['add', 'new', 'create'], category: 'general' },
    { name: 'Minus', displayName: 'Minus', keywords: ['remove', 'subtract', 'less'], category: 'general' },
    { name: 'Menu', displayName: 'Menu', keywords: ['hamburger', 'navigation', 'bars'], category: 'general' },
    { name: 'MoreVertical', displayName: 'More', keywords: ['options', 'menu', 'dots'], category: 'general' },
    { name: 'Lock', displayName: 'Lock', keywords: ['secure', 'private', 'password'], category: 'general' },
    { name: 'Unlock', displayName: 'Unlock', keywords: ['open', 'public', 'access'], category: 'general' },
    { name: 'Eye', displayName: 'Eye', keywords: ['view', 'see', 'visible'], category: 'general' },
    { name: 'EyeOff', displayName: 'Eye Off', keywords: ['hide', 'invisible', 'hidden'], category: 'general' },
    { name: 'Link', displayName: 'Link', keywords: ['url', 'chain', 'connect'], category: 'general' },
    { name: 'ExternalLink', displayName: 'External Link', keywords: ['open', 'new', 'window'], category: 'general' },
    { name: 'Share2', displayName: 'Share', keywords: ['send', 'export', 'social'], category: 'general' },
    { name: 'Bookmark', displayName: 'Bookmark', keywords: ['save', 'favorite', 'mark'], category: 'general' },
    { name: 'Flag', displayName: 'Flag', keywords: ['mark', 'report', 'banner'], category: 'general' },
    { name: 'Award', displayName: 'Award', keywords: ['badge', 'achievement', 'medal'], category: 'general' },
    { name: 'Gift', displayName: 'Gift', keywords: ['present', 'reward', 'bonus'], category: 'general' },
    { name: 'ShoppingCart', displayName: 'Shopping Cart', keywords: ['buy', 'purchase', 'store'], category: 'general' },
    { name: 'CreditCard', displayName: 'Credit Card', keywords: ['payment', 'money', 'purchase'], category: 'general' },
    { name: 'DollarSign', displayName: 'Dollar', keywords: ['money', 'price', 'cost'], category: 'general' },
];

export function searchIcons(query: string): IconMetadata[] {
    if (!query.trim()) {
        return iconRegistry;
    }

    const lowerQuery = query.toLowerCase();
    return iconRegistry.filter(icon =>
        icon.displayName.toLowerCase().includes(lowerQuery) ||
        icon.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
}

export function getIconByName(name: string): IconMetadata | undefined {
    return iconRegistry.find(icon => icon.name === name);
}
