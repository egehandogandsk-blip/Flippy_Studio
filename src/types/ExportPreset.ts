export interface ExportPreset {
    id: string;
    format: 'png' | 'jpg' | 'svg' | 'pdf';
    scale: number;
}
