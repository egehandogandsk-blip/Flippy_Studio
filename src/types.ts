export interface Layer {
    id: string;
    name: string;
    type: 'rectangle' | 'ellipse' | 'text';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    text?: string;
}

export type ToolType = 'select' | 'move' | 'rectangle' | 'ellipse' | 'text' | 'pen';
