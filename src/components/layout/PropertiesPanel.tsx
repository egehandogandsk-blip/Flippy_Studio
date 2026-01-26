import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasObjectsStore } from '../../store/useCanvasObjectsStore';
import { RectangleProperties } from '../properties/RectangleProperties';

export const PropertiesPanel: React.FC = () => {
    const { backgroundColor, setBackgroundColor } = useCanvasStore();
    const selectedObject = useCanvasObjectsStore((state) => state.selectedObject);

    return (
        <aside className="w-72 bg-white border-l border-neutral-200 flex flex-col z-10 shrink-0 overflow-y-auto">
            <div className="h-10 border-b border-neutral-200 flex items-center px-4 font-semibold text-sm text-neutral-600">
                Properties
            </div>
            <div className="flex-1 py-4">
                {/* Show Rectangle Properties if rectangle is selected */}
                {selectedObject?.type === 'rect' && <RectangleProperties />}

                {/* Show Canvas Properties if nothing is selected */}
                {!selectedObject && (
                    <div className="px-4">
                        <div className="text-xs text-neutral-500 mb-4">Select an object to view properties</div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Canvas</label>
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-neutral-700">Background</div>
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="w-8 h-8 rounded border-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};
