import { DocumentNode, NodeType, generateId } from '../store/documentStore';

// --- Types defined based on Figma API ---
interface FigmaNode {
    id: string;
    name: string;
    type: string;
    children?: FigmaNode[];
    absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
    relativeTransform?: [[number, number, number], [number, number, number]];
    fills?: any[];
    strokes?: any[];
    strokeWeight?: number;
    opacity?: number;
    characters?: string; // For TEXT
    style?: any; // For TEXT styles
    backgroundColor?: { r: number; g: number; b: number; a: number };
}

interface FigmaFileResponse {
    document: FigmaNode;
    name: string;
}

// --- Helper Functions ---

const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const mapFigmaType = (type: string): NodeType => {
    switch (type) {
        case 'FRAME': return 'FRAME';
        case 'GROUP': return 'GROUP';
        case 'GoUP': return 'GROUP'; // Typo protection
        case 'TEXT': return 'TEXT';
        case 'ELLIPSE': return 'ELLIPSE';
        case 'RECTANGLE': return 'RECT';
        case 'COMPONENT': return 'FRAME';
        case 'INSTANCE': return 'FRAME'; // Treat instances as frames for now (detached)
        case 'VECTOR': return 'RECT'; // Placeholder
        case 'STAR': return 'RECT'; // Placeholder
        case 'LINE': return 'RECT'; // Placeholder
        case 'REGULAR_POLYGON': return 'RECT'; // Placeholder
        default: return 'RECT';
    }
};

const getPaintColor = (fills: any[]) => {
    if (!fills || fills.length === 0) return undefined;
    // Find first visible solid fill
    const solid = fills.find(f => f.type === 'SOLID' && f.visible !== false);
    if (solid && solid.color) {
        return rgbToHex(solid.color.r, solid.color.g, solid.color.b);
    }
    return undefined;
};

// --- Main Importer Class ---

export class FigmaImporter {
    private token: string;
    private nodes: Record<string, DocumentNode> = {};


    constructor(token: string) {
        this.token = token;
        this.nodes = {};
    }

    async fetchFile(fileKey: string): Promise<FigmaFileResponse> {
        // Use local proxy to avoid CORS
        const response = await fetch(`http://localhost:3001/api/figma/file/${fileKey}`, {
            headers: {
                'X-Figma-Token': this.token
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Figma file: ${response.statusText}`);
        }

        return await response.json();
    }

    processFile(data: FigmaFileResponse): Record<string, DocumentNode> {
        this.nodes = {};

        // Create Root
        this.nodes['root'] = {
            id: 'root',
            type: 'FRAME',
            name: data.name || 'Figma Import',
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            children: [],
            style: { fill: '#1e1e1e' },
            layout: { layoutMode: 'NONE' },
            locked: true
        };

        // Find the first Page (Canvas)
        const document = data.document;
        const firstPage = document.children?.find(c => c.type === 'CANVAS');

        if (!firstPage || !firstPage.children) {
            console.warn('No pages found in Figma file');
            return this.nodes;
        }

        // Process children of the first page
        // Note: Page children in Figma are top-level frames. 
        // We will add them to our 'root'.

        firstPage.children.forEach(child => {
            this.convertNode(child, 'root');
        });

        return this.nodes;
    }

    private convertNode(figmaNode: FigmaNode, parentId: string) {
        // Skipping invisible nodes? Maybe keep them for completeness but visible=false
        // For now, let's keep everything.

        const myId = generateId(); // Generate a new ID to avoid collisions/format issues
        const type = mapFigmaType(figmaNode.type);

        // Position Logic
        let x = 0;
        let y = 0;

        if (figmaNode.relativeTransform) {
            x = figmaNode.relativeTransform[0][2];
            y = figmaNode.relativeTransform[1][2];
        } else if (figmaNode.absoluteBoundingBox && this.nodes[parentId]) {
            // Fallback or root level items might not have relativeTransform correctly set in some contexts?
            // Actually pages have children with absoluteBoundingBox.
            // If parent is 'root' (which has 0,0), then absolute matches relative.
        }

        // Size
        const width = figmaNode.absoluteBoundingBox ? figmaNode.absoluteBoundingBox.width : 100;
        const height = figmaNode.absoluteBoundingBox ? figmaNode.absoluteBoundingBox.height : 100;

        // Styles
        const fill = getPaintColor(figmaNode.fills || []) ||
            (figmaNode.backgroundColor ? rgbToHex(figmaNode.backgroundColor.r, figmaNode.backgroundColor.g, figmaNode.backgroundColor.b) : undefined) ||
            'transparent';

        const stroke = getPaintColor(figmaNode.strokes || []);
        const strokeWidth = figmaNode.strokeWeight;

        // Create Node
        const newNode: DocumentNode = {
            id: myId,
            parentId: parentId,
            name: figmaNode.name,
            type: type,
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: 0, // Extract from matrix if needed, ignoring for now
            visible: true, // figmaNode.visible !== false,
            locked: false, // figmaNode.locked === true,
            children: [],
            style: {
                fill: type === 'TEXT' ? undefined : fill, // Text color is handled differently usually
                stroke: stroke,
                strokeWidth: strokeWidth,
                opacity: figmaNode.opacity,
            },
            layout: { layoutMode: 'NONE' }
        };

        // Specific Type Handling
        if (type === 'TEXT' && figmaNode.characters) {
            newNode.text = figmaNode.characters;
            newNode.style.color = fill; // Text fill
            if (figmaNode.style) {
                newNode.style.fontSize = figmaNode.style.fontSize;
                newNode.style.fontFamily = figmaNode.style.fontFamily;
                newNode.style.fontWeight = figmaNode.style.fontWeight;
                // TextAlign...
            }
        }

        // Add to store
        this.nodes[myId] = newNode;

        // Add to parent's children list
        if (this.nodes[parentId]) {
            this.nodes[parentId].children.push(myId);
        }

        // Recursion
        if (figmaNode.children) {
            figmaNode.children.forEach(child => {
                this.convertNode(child, myId);
            });
        }
    }
}
