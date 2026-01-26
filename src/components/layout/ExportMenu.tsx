import React from 'react';
import { Download, FileImage, FileCode } from 'lucide-react';

interface ExportMenuProps {
    onExportPNG: () => void;
    onExportSVG: () => void;
    onExportJSON: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ onExportPNG, onExportSVG, onExportJSON }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700 text-white rounded flex items-center gap-2 transition-colors"
            >
                <Download className="w-4 h-4" />
                Export
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 py-2 z-50">
                    <button
                        onClick={() => {
                            onExportPNG();
                            setIsOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-3"
                    >
                        <FileImage className="w-4 h-4" />
                        Export as PNG
                    </button>
                    <button
                        onClick={() => {
                            onExportSVG();
                            setIsOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-3"
                    >
                        <FileCode className="w-4 h-4" />
                        Export as SVG
                    </button>
                    <button
                        onClick={() => {
                            onExportJSON();
                            setIsOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-3"
                    >
                        <FileCode className="w-4 h-4" />
                        Export as JSON
                    </button>
                </div>
            )}
        </div>
    );
};
