import { useState } from 'react';
import { Folder, Image, Type } from 'lucide-react';
import { Layer } from '../types';

interface SidebarProps {
    layers: Layer[];
    selectedIDs: Set<string>;
    onSelect: (id: string, multi: boolean) => void;
}

const Sidebar = ({ layers, selectedIDs, onSelect }: SidebarProps) => {
    const [activeTab, setActiveTab] = useState<'layers' | 'assets'>('layers');

    return (
        <div className="sidebar-left">
            <div className="sidebar-tabs">
                <button
                    className={`tab-btn ${activeTab === 'layers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('layers')}
                > Layers </button>
                <button
                    className={`tab-btn ${activeTab === 'assets' ? 'assets' : ''}`}
                    onClick={() => setActiveTab('assets')}
                > Assets </button>
            </div>

            <div className="panel-content">
                {activeTab === 'layers' && (
                    <div className="layers-list">
                        {layers.map(layer => (
                            <div
                                key={layer.id}
                                className={`layer-item ${selectedIDs.has(layer.id) ? 'active' : ''}`}
                                onClick={(e) => onSelect(layer.id, e.ctrlKey || e.metaKey)}
                            >
                                {layer.type === 'rectangle' && <div className="layer-icon rect" />}
                                {layer.type === 'ellipse' && <div className="layer-icon circle" />}
                                {layer.type === 'text' && <Type size={14} />}
                                <span className="layer-name">{layer.name}</span>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'assets' && (
                    <div className="assets-grid">
                        <div className="asset-folder"><Folder size={16} /> Components</div>
                        <div className="asset-folder"><Image size={16} /> Images</div>
                        <div className="asset-folder"><Type size={16} /> Typography</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
