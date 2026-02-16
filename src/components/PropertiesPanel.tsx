import { Layer } from '../types';

interface PropertiesProps {
    selectedLayer?: Layer;
    updateLayer: (id: string, updates: Partial<Layer>) => void;
}

const PropertiesPanel = ({ selectedLayer, updateLayer }: PropertiesProps) => {
    if (!selectedLayer) return (
        <div className="sidebar-right">
            <div className="panel-header">Design</div>
            <div className="empty-selection">Select an object to edit properties</div>
        </div>
    );

    const handleChange = (key: keyof Layer, value: any) => {
        updateLayer(selectedLayer.id, { [key]: value });
    };

    return (
        <div className="sidebar-right">
            <div className="panel-header">Design</div>


            <div className="property-section">
                <div className="section-title">Transform</div>
                <div className="property-row">
                    <label className="input-label">X <input type="number" value={selectedLayer.x} onChange={(e) => handleChange('x', +e.target.value)} /></label>
                    <label className="input-label">Y <input type="number" value={selectedLayer.y} onChange={(e) => handleChange('y', +e.target.value)} /></label>
                </div>
                <div className="property-row">
                    <label className="input-label">W <input type="number" value={selectedLayer.width} onChange={(e) => handleChange('width', +e.target.value)} /></label>
                    <label className="input-label">H <input type="number" value={selectedLayer.height} onChange={(e) => handleChange('height', +e.target.value)} /></label>
                </div>
                <div className="property-row">
                    <label className="input-label">R <input type="number" value={selectedLayer.rotation} onChange={(e) => handleChange('rotation', +e.target.value)} />°</label>
                </div>
            </div>

            <div className="property-section">
                <div className="section-title">Appearance</div>
                <div className="property-row">
                    <label>Opacity</label>
                    <input type="range" min="0" max="1" step="0.01" value={selectedLayer.opacity} onChange={(e) => handleChange('opacity', +e.target.value)} />
                    <span>{Math.round(selectedLayer.opacity * 100)}%</span>
                </div>
                <div className="property-row fill-row">
                    <label>Fill</label>
                    <div className="color-picker-trigger" style={{ backgroundColor: selectedLayer.fill }} />
                    <input type="text" value={selectedLayer.fill} onChange={(e) => handleChange('fill', e.target.value)} />
                </div>
                <div className="property-row stroke-row">
                    <label>Stroke</label>
                    <div className="color-picker-trigger" style={{ backgroundColor: selectedLayer.stroke === 'none' ? 'transparent' : selectedLayer.stroke, border: '1px solid #555' }} />
                    <input type="text" value={selectedLayer.stroke} onChange={(e) => handleChange('stroke', e.target.value)} />
                    <input type="number" value={selectedLayer.strokeWidth} onChange={(e) => handleChange('strokeWidth', +e.target.value)} style={{ width: 40 }} />
                </div>
            </div>

            {selectedLayer.type === 'text' && (
                <div className="property-section">
                    <div className="section-title">Typography</div>
                    <textarea
                        className="text-content-editor"
                        value={selectedLayer.text}
                        onChange={(e) => handleChange('text', e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default PropertiesPanel;
