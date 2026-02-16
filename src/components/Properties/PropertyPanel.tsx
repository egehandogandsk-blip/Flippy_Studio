import React, { useState } from 'react';
import { useDocumentStore } from '../../store/documentStore';
import { useSelectionStore } from '../../store/selectionStore';
import { useUiStore } from '../../store/uiStore';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Layout, Type as TypeIcon, HelpCircle, Plus, Minus, ChevronDown } from 'lucide-react';
import { ColorPicker } from '../UI/ColorPicker';
import { clsx } from 'clsx';
import { ExportPanel } from './ExportPanel';
import { FRAME_PRESETS } from '../../constants/framePresets';
import { generateGamePreset } from '../../utils/PresetGenerator';
import { calculateNextPosition } from '../../utils/positionUtils';

export const PropertyPanel: React.FC = () => {
    const selectedIds = useSelectionStore((state) => state.selectedIds);
    const { addNode, updateNode } = useDocumentStore((state) => state.actions);
    const { canvasBackgroundColor, setCanvasBackgroundColor, activeTool, setActiveTool } = useUiStore();

    // Simple handling for single selection for now
    const selectedId = selectedIds[0];
    const node = useDocumentStore((state) => selectedId ? state.nodes[selectedId] : null);

    const [showLayoutInfo, setShowLayoutInfo] = useState(false);
    const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);



    // Handle Frame Presets when Frame tool is active and no selection
    if (activeTool === 'artboard' && !node) {
        return (
            <div className="w-72 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col text-zinc-600 dark:text-zinc-300 text-sm h-full transition-colors duration-200">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-semibold text-xs text-zinc-500 uppercase flex items-center gap-2">
                    {collapsedCategories.length > 0 && (
                        <button
                            onClick={() => setCollapsedCategories([])}
                            className="hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1 rounded -ml-1"
                        >
                            <ChevronDown className="rotate-90" size={14} />
                        </button>
                    )}
                    {collapsedCategories.length > 0 ? collapsedCategories[0] : 'Frame Presets'}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {/* Level 1: Category Grid */}
                    {collapsedCategories.length === 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            {FRAME_PRESETS.map(group => (
                                <div
                                    key={group.category}
                                    onClick={() => setCollapsedCategories([group.category])}
                                    className="aspect-square flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-all gap-2 group text-center p-2"
                                >
                                    <group.icon size={24} className="text-zinc-400 group-hover:text-purple-500 transition-colors" />
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                        {group.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Level 2: Presets List */}
                    {collapsedCategories.map(cat => {
                        const group = FRAME_PRESETS.find(g => g.category === cat);
                        if (!group) return null;

                        return (
                            <div key={cat} className="space-y-1">
                                {group.presets.map(preset => (
                                    <button
                                        key={preset.name}
                                        className="w-full text-left px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex justify-between items-center group"
                                        onClick={() => {
                                            if (preset.type === 'game_ui') {
                                                generateGamePreset(preset);
                                            } else {
                                                const { x, y } = calculateNextPosition(preset.w, preset.h);
                                                const id = Date.now().toString();
                                                addNode({
                                                    id,
                                                    type: 'FRAME',
                                                    name: preset.name,
                                                    x,
                                                    y,
                                                    width: preset.w,
                                                    height: preset.h,
                                                    style: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 },
                                                    layout: { layoutMode: 'NONE' },
                                                    children: [],
                                                    parentId: 'root'
                                                });
                                            }
                                            setActiveTool('select');
                                        }}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium text-zinc-700 dark:text-zinc-200">{preset.name}</span>
                                            <span className="text-[10px] text-zinc-400 font-mono">
                                                {preset.w} x {preset.h}
                                            </span>
                                        </div>
                                        <Plus size={14} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-purple-500 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (!node) {
        return (
            <div className="w-72 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col text-zinc-600 dark:text-zinc-300 text-sm h-full transition-colors duration-200">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-semibold text-xs text-zinc-500 uppercase">
                    Canvas Settings
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <label>Background</label>
                        <div className="flex items-center gap-2">
                            <ColorPicker color={canvasBackgroundColor} onChange={setCanvasBackgroundColor} />
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-4 text-xs text-zinc-400 dark:text-zinc-500">
                    Select a layer to edit its properties.
                </div>
            </div>
        );
    }

    const handleChange = (field: string, value: any) => {
        updateNode(node.id, { [field]: value });
    };

    const handleStyleChange = (field: string, value: any) => {
        updateNode(node.id, (n) => { (n.style as any)[field] = value });
    };

    const removeStyle = (field: string) => {
        updateNode(node.id, (n) => { delete (n.style as any)[field]; });
    };

    const handleLayoutChange = (field: string, value: any) => {
        updateNode(node.id, (n) => { (n.layout as any)[field] = value });
    };

    const hasFill = node.style.fill !== undefined && node.style.fill !== null;
    const hasStroke = node.style.stroke !== undefined && node.style.stroke !== null && node.style.stroke !== 'none';

    return (
        <div className="w-72 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col text-zinc-600 dark:text-zinc-300 text-sm overflow-y-auto pb-4 h-full transition-colors duration-200">
            {/* Header / Rename */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-semibold flex items-center gap-2">
                <input
                    className="bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800 rounded px-1 -ml-1 w-full outline-none truncate transition-colors"
                    value={node.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
                <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1 rounded shrink-0">{node.type}</span>
            </div>

            {/* Alignment Tools (Canvas) */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between">
                <button title="Align Left" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" onClick={() => updateNode(node.id, { x: 0 })}><AlignLeft size={16} /></button>
                <button title="Align Center" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" onClick={() => {
                    const parent = node.parentId ? useDocumentStore.getState().nodes[node.parentId] : null;
                    if (parent) updateNode(node.id, { x: (parent.width - node.width) / 2 });
                }}><AlignCenter size={16} /></button>
                <button title="Align Right" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" onClick={() => {
                    const parent = node.parentId ? useDocumentStore.getState().nodes[node.parentId] : null;
                    if (parent) updateNode(node.id, { x: parent.width - node.width });
                }}><AlignRight size={16} /></button>
                <button title="Align Top" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" onClick={() => updateNode(node.id, { y: 0 })}><Layout size={16} className="rotate-90" /></button>
                <button title="Align Middle" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" onClick={() => {
                    const parent = node.parentId ? useDocumentStore.getState().nodes[node.parentId] : null;
                    if (parent) updateNode(node.id, { y: (parent.height - node.height) / 2 });
                }}><Layout size={16} /></button>
                <button title="Align Bottom" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" onClick={() => {
                    const parent = node.parentId ? useDocumentStore.getState().nodes[node.parentId] : null;
                    if (parent) updateNode(node.id, { y: parent.height - node.height });
                }}><Layout size={16} className="rotate-180" /></button>
            </div>

            {/* Dimensions */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="font-semibold text-xs text-zinc-500 uppercase">Dimensions</div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400 dark:text-zinc-500 w-4">X</span>
                        <input
                            type="number"
                            className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 w-full text-xs"
                            value={node.x}
                            onChange={(e) => handleChange('x', Number(e.target.value))}
                            disabled={!!(node.parentId && useDocumentStore.getState().nodes[node.parentId]?.layout.layoutMode === 'FLEX')}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400 dark:text-zinc-500 w-4">Y</span>
                        <input
                            type="number"
                            className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 w-full text-xs"
                            value={node.y}
                            onChange={(e) => handleChange('y', Number(e.target.value))}
                            disabled={!!(node.parentId && useDocumentStore.getState().nodes[node.parentId]?.layout.layoutMode === 'FLEX')}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400 dark:text-zinc-500 w-4">W</span>
                        <input
                            type="number"
                            className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 w-full text-xs"
                            value={Math.round(node.width)}
                            onChange={(e) => handleChange('width', Number(e.target.value))}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400 dark:text-zinc-500 w-4">H</span>
                        <input
                            type="number"
                            className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 w-full text-xs"
                            value={Math.round(node.height)}
                            onChange={(e) => handleChange('height', Number(e.target.value))}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400 dark:text-zinc-500 w-4">R</span>
                        <input
                            type="number"
                            className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 w-full text-xs"
                            value={node.rotation || 0}
                            onChange={(e) => handleChange('rotation', Number(e.target.value))}
                        />
                        <span className="text-zinc-400 dark:text-zinc-500">°</span>
                    </div>
                </div>
            </div>

            {/* Export Section - Advanced */}
            <ExportPanel nodeId={node.id} />


            {/* Typography (Text Only) */}
            {node.type === 'TEXT' && (
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="font-semibold text-xs text-zinc-500 uppercase flex items-center gap-2">
                        <TypeIcon size={12} /> Typography
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-zinc-500">Content</label>
                        <textarea
                            className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 text-xs w-full min-h-[60px] resize-y border border-transparent focus:border-indigo-500 outline-none"
                            value={node.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label>Font Size</label>
                        <input
                            type="number"
                            className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 w-16 text-xs"
                            value={node.style.fontSize || 16}
                            onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label>Color</label>
                        <ColorPicker color={node.style.color || '#000000'} onChange={(c) => handleStyleChange('color', c)} />
                    </div>
                </div>
            )}

            {/* Icon Properties (Icon Only) */}
            {node.type === 'ICON' && (
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="font-semibold text-xs text-zinc-500 uppercase flex items-center gap-2">
                        <TypeIcon size={12} /> Icon
                    </div>
                    <div className="flex items-center justify-between">
                        <label>Icon Color</label>
                        <ColorPicker color={node.style.fill || '#6366f1'} onChange={(c) => handleStyleChange('fill', c)} />
                    </div>
                    {node.iconName && (
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-zinc-500">Icon Name</label>
                            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">{node.iconName}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Appearance */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="font-semibold text-xs text-zinc-500 uppercase">Appearance</div>
                <div className="flex items-center justify-between">
                    <label>Opacity</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range" min="0" max="1" step="0.01"
                            className="w-20"
                            value={node.style.opacity !== undefined ? node.style.opacity : 1}
                            onChange={(e) => handleStyleChange('opacity', Number(e.target.value))}
                        />
                        <span className="text-xs w-8 text-right">{Math.round((node.style.opacity !== undefined ? node.style.opacity : 1) * 100)}%</span>
                    </div>
                </div>

                {/* Fill Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <label>Fill</label>
                        {!hasFill && (
                            <button onClick={() => handleStyleChange('fill', '#d9d9d9')} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"><Plus size={14} /></button>
                        )}
                    </div>
                    {hasFill && (
                        <div className="flex items-center gap-2">
                            <ColorPicker color={node.style.fill!} onChange={(c) => handleStyleChange('fill', c)} />
                            <button onClick={() => removeStyle('fill')} className="text-zinc-400 hover:text-red-500"><Minus size={14} /></button>
                        </div>
                    )}
                </div>

                {/* Stroke Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <label>Stroke</label>
                        {!hasStroke && (
                            <button onClick={() => { handleStyleChange('stroke', '#000000'); handleStyleChange('strokeWidth', 1); }} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"><Plus size={14} /></button>
                        )}
                    </div>
                    {hasStroke && (
                        <div className="flex items-center gap-2">
                            <ColorPicker color={node.style.stroke!} onChange={(c) => handleStyleChange('stroke', c)} />
                            <input
                                type="number"
                                className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 w-12 text-xs"
                                value={node.style.strokeWidth || 1}
                                onChange={(e) => handleStyleChange('strokeWidth', Number(e.target.value))}
                            />
                            <button onClick={() => { removeStyle('stroke'); removeStyle('strokeWidth'); }} className="text-zinc-400 hover:text-red-500"><Minus size={14} /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* Layout Section */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-zinc-500 uppercase">Layout</div>
                    <div className="relative group">
                        <HelpCircle
                            size={14}
                            className="text-zinc-400 dark:text-zinc-500 cursor-help hover:text-zinc-600 dark:hover:text-zinc-300"
                            onMouseEnter={() => setShowLayoutInfo(true)}
                            onMouseLeave={() => setShowLayoutInfo(false)}
                        />
                        {showLayoutInfo && (
                            <div className="absolute right-0 top-6 w-48 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 p-2 rounded shadow-xl z-50 text-xs text-zinc-600 dark:text-zinc-300">
                                <strong>Flex Layout:</strong><br />
                                To use auto-layout, set Mode to Flex.<br />
                                <br />
                                <strong>Direction:</strong> Row (→) or Column (↓).<br />
                                <strong>Justify:</strong> Aligns items along the main axis.<br />
                                <strong>Align:</strong> Aligns items along the cross axis.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label>Mode</label>
                    <select
                        className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 text-xs"
                        value={node.layout.layoutMode}
                        onChange={(e) => handleLayoutChange('layoutMode', e.target.value)}
                    >
                        <option value="NONE">Fixed</option>
                        <option value="FLEX">Auto Layout (Flex)</option>
                    </select>
                </div>

                {node.layout.layoutMode === 'FLEX' && (
                    <>
                        <div className="flex items-center justify-between">
                            <label>Justify</label>
                            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded p-1 gap-1">
                                {['flex-start', 'center', 'flex-end', 'space-between'].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => handleLayoutChange('justifyContent', v)}
                                        className={clsx(
                                            "p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700",
                                            node.layout.justifyContent === v ? 'bg-zinc-300 dark:bg-zinc-600' : ''
                                        )}
                                        title={v}
                                    >
                                        {v === 'flex-start' && <AlignLeft size={14} />}
                                        {v === 'center' && <AlignCenter size={14} />}
                                        {v === 'flex-end' && <AlignRight size={14} />}
                                        {v === 'space-between' && <AlignJustify size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Align</label>
                            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded p-1 gap-1">
                                {['flex-start', 'center', 'flex-end', 'stretch'].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => handleLayoutChange('alignItems', v)}
                                        className={clsx(
                                            "p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700",
                                            node.layout.alignItems === v ? 'bg-zinc-300 dark:bg-zinc-600' : ''
                                        )}
                                        title={v}
                                    >
                                        {v === 'flex-start' && <AlignLeft size={14} className="rotate-90" />}
                                        {v === 'center' && <AlignCenter size={14} className="rotate-90" />}
                                        {v === 'flex-end' && <AlignRight size={14} className="rotate-90" />}
                                        {v === 'stretch' && <Layout size={14} className="rotate-90" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Direction</label>
                            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded p-1 gap-1">
                                <button
                                    onClick={() => handleLayoutChange('flexDirection', 'row')}
                                    className={clsx(
                                        "p-1 rounded",
                                        node.layout.flexDirection === 'row' ? 'bg-zinc-300 dark:bg-zinc-600' : ''
                                    )}
                                    title="Row"
                                >→
                                </button>
                                <button
                                    onClick={() => handleLayoutChange('flexDirection', 'column')}
                                    className={clsx(
                                        "p-1 rounded",
                                        node.layout.flexDirection === 'column' ? 'bg-zinc-300 dark:bg-zinc-600' : ''
                                    )}
                                    title="Column"
                                >↓
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Gap</label>
                            <input
                                type="number"
                                className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 w-16 text-xs"
                                value={node.layout.gap || 0}
                                onChange={(e) => handleLayoutChange('gap', Number(e.target.value))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Padding</label>
                            <input
                                type="number"
                                className="bg-zinc-100 dark:bg-zinc-800 rounded p-1 w-16 text-xs"
                                value={node.layout.padding || 0}
                                onChange={(e) => handleLayoutChange('padding', Number(e.target.value))}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
