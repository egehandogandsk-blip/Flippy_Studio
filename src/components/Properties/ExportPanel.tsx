import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useSelectionStore } from '../../store/selectionStore';

export const ExportPanel: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const node = useDocumentStore((state) => state.nodes[nodeId]);
    const { selectedIds } = useSelectionStore();
    const { addExportPreset, removeExportPreset } = useDocumentStore((state) => state.actions);

    if (!node) return null;

    return (
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
                <div className="font-semibold text-xs text-zinc-500 uppercase">Export</div>
                <button
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                    onClick={() => {
                        const newPreset = {
                            id: Date.now().toString(),
                            format: 'png' as const,
                            scale: 1
                        };
                        selectedIds.forEach(id => {
                            addExportPreset(id, newPreset);
                        });
                    }}
                    title="Add Export Preset"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Export Presets List */}
            <div className="space-y-2">
                {node.exportPresets && node.exportPresets.length > 0 ? (
                    node.exportPresets.map((preset) => (
                        <div key={preset.id} className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
                            <select
                                className="bg-zinc-100 dark:bg-zinc-700 rounded px-2 py-1 text-xs flex-1"
                                value={preset.format}
                                onChange={(e) => {
                                    const updated = { ...preset, format: e.target.value as any };
                                    removeExportPreset(node.id, preset.id);
                                    addExportPreset(node.id, updated);
                                }}
                            >
                                <option value="png">PNG</option>
                                <option value="jpg">JPG</option>
                                <option value="svg">SVG</option>
                                <option value="pdf">PDF</option>
                            </select>
                            <select
                                className="bg-zinc-100 dark:bg-zinc-700 rounded px-2 py-1 text-xs w-16"
                                value={preset.scale}
                                onChange={(e) => {
                                    const updated = { ...preset, scale: Number(e.target.value) };
                                    removeExportPreset(node.id, preset.id);
                                    addExportPreset(node.id, updated);
                                }}
                            >
                                <option value={0.5}>0.5x</option>
                                <option value={1}>1x</option>
                                <option value={2}>2x</option>
                                <option value={3}>3x</option>
                                <option value={4}>4x</option>
                            </select>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1 text-xs"
                                onClick={() => {
                                    if (selectedIds.length > 1) {
                                        // Multi-export
                                        const event = new CustomEvent('multi-export', {
                                            detail: { nodeIds: selectedIds, format: preset.format, scale: preset.scale }
                                        });
                                        window.dispatchEvent(event);
                                    } else {
                                        // Single export
                                        const event = new CustomEvent('export-node', {
                                            detail: { nodeId: node.id, format: preset.format, scale: preset.scale }
                                        });
                                        window.dispatchEvent(event);
                                    }
                                }}
                            >
                                Export
                            </button>
                            <button
                                className="text-zinc-400 hover:text-red-500 p-1"
                                onClick={() => {
                                    selectedIds.forEach(id => {
                                        removeExportPreset(id, preset.id);
                                    });
                                }}
                                title="Remove Preset"
                            >
                                <Minus size={14} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-2">
                        No export presets. Click + to add one.
                    </div>
                )}
            </div>

            {/* Multi-selection indicator */}
            {selectedIds.length > 1 && (
                <div className="text-xs text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    {selectedIds.length} items selected. Each will export separately.
                </div>
            )}
        </div>
    );
};
