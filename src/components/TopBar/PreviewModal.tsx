import React, { useState, useRef, useEffect } from 'react';
import { X, Smartphone, Monitor, Gamepad2, Move } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
// Since NodeRenderer might be complex and tied to Canvas, we might need a simplified version or just use CSS transforms on a clone. 
// For this demo, let's try to render the nodes structure recursively.

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    frameId: string | null;
}

const DeviceFrames = {
    PHONE: { width: 375, height: 812, name: 'Phone', border: 'rounded-[3rem]' },
    PC: { width: 1280, height: 800, name: 'Desktop', border: 'rounded-lg' },
    GAME: { width: 1920, height: 1080, name: 'Game Console', border: 'rounded-none' },
};

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, frameId }) => {
    const { nodes } = useDocumentStore();
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [deviceType, setDeviceType] = useState<'PHONE' | 'PC' | 'GAME'>('PHONE');
    const modalRef = useRef<HTMLDivElement>(null);

    // Auto-detect device type based on frame dimensions
    useEffect(() => {
        if (frameId && nodes[frameId]) {
            const frame = nodes[frameId];
            if (frame.width > 1200) {
                // Simple heuristic for Game vs PC? Usually game is 16:9 full HD. 
                if (frame.width === 1920) setDeviceType('GAME');
                else setDeviceType('PC');
            } else if (frame.width < 600) {
                setDeviceType('PHONE');
            } else {
                setDeviceType('PC');
            }
        }
    }, [frameId, nodes]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y,
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    if (!isOpen || !frameId || !nodes[frameId]) return null;

    const frameNode = nodes[frameId];
    const device = DeviceFrames[deviceType];

    const handleMouseDown = (e: React.MouseEvent) => {
        if (modalRef.current) {
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setIsDragging(true);
        }
    };

    // Dynamic sizing for the preview container
    const PADDING = 40;
    const HEADER_HEIGHT = 40;



    // Determine available space for the preview area
    // We want the modal to be big enough but not overflow screen ideally.
    // Let's set a reasonable fixed size for the modal container, or dynamic based on device.

    // Actually, let's make the modal size depend on the scaled content, but maxed out.
    // For simplicity and "responsiveness", let's fix the modal container to a large size
    // and scale content to fit INSIDE it with "contain" logic.

    const containerWidth = Math.min(window.innerWidth * 0.8, 1000);
    const containerHeight = Math.min(window.innerHeight * 0.8, 800);

    // Calculate Scale: Fit frameNode into containerWidth/Height with padding
    const availableWidth = containerWidth - PADDING * 2;
    const availableHeight = containerHeight - PADDING * 2;

    const scaleX = availableWidth / frameNode.width;
    const scaleY = availableHeight / frameNode.height;

    // User asked for "Overview", usually means seeing the whole thing. 
    // Let's allow scale > 1 if frame is tiny, but usually we want to see it fit.
    // Let's stick to min(scale, 1) to avoid blurriness if it's small, OR just fit it.
    // "Fit otursun" implies seeing the whole thing.

    const finalScale = Math.min(scaleX, scaleY);

    const renderNode = (nodeId: string): React.ReactNode => {
        const node = nodes[nodeId];
        if (!node) return null;

        const style: React.CSSProperties = {
            position: 'absolute',
            left: node.x,
            top: node.y,
            width: node.width,
            height: node.height,
            backgroundColor: node.style?.fill || 'transparent',
            opacity: node.style?.opacity,
            borderRadius: node.style?.borderRadius,
            border: node.style?.stroke ? `${node.style.strokeWidth || 1}px solid ${node.style.stroke}` : undefined,
        };

        if (node.type === 'TEXT') {
            style.color = node.style?.color || '#000';
            style.fontSize = node.style?.fontSize || 16;
            style.fontFamily = node.style?.fontFamily || 'sans-serif';
            style.textAlign = node.style?.textAlign || 'left';
            style.display = 'flex';
            style.alignItems = 'center'; // Vertical center for now?
        }

        return (
            <div key={node.id} style={style}>
                {node.type === 'TEXT' ? node.text : null}
                {node.children && node.children.map(childId => renderNode(childId))}
            </div>
        );
    };

    return (
        <div
            ref={modalRef}
            style={{
                left: position.x,
                top: position.y,
                position: 'fixed',
                zIndex: 9999,
                width: containerWidth,
                height: containerHeight + HEADER_HEIGHT, // Header + Content
            }}
            className="flex flex-col bg-[#1E1E1E] border border-[#333] rounded-xl shadow-2xl overflow-hidden flex-shrink-0"
        >
            {/* Header / Drag Handle */}
            <div
                onMouseDown={handleMouseDown}
                className="h-10 bg-[#252525] border-b border-[#333] flex items-center justify-between px-3 cursor-move select-none flex-shrink-0"
            >
                <div className="flex items-center gap-2">
                    <span className="text-white/80 text-xs font-medium flex items-center gap-1">
                        <Move size={12} /> Preview: {frameNode.name}
                    </span>
                    <span className="text-zinc-500 text-[10px]">
                        ({Math.round(finalScale * 100)}%)
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setDeviceType('PHONE')}
                        className={`p-1 rounded hover:bg-white/10 ${deviceType === 'PHONE' ? 'text-indigo-400' : 'text-zinc-500'}`}
                        title="Phone"
                    >
                        <Smartphone size={14} />
                    </button>
                    <button
                        onClick={() => setDeviceType('PC')}
                        className={`p-1 rounded hover:bg-white/10 ${deviceType === 'PC' ? 'text-indigo-400' : 'text-zinc-500'}`}
                        title="PC / Tablet"
                    >
                        <Monitor size={14} />
                    </button>
                    <button
                        onClick={() => setDeviceType('GAME')}
                        className={`p-1 rounded hover:bg-white/10 ${deviceType === 'GAME' ? 'text-indigo-400' : 'text-zinc-500'}`}
                        title="Game Console"
                    >
                        <Gamepad2 size={14} />
                    </button>
                    <div className="w-px h-4 bg-zinc-700 mx-1" />
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div
                className="relative bg-[#0a0a0a] overflow-hidden flex items-center justify-center p-8 w-full h-full"
                style={{
                    backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            >
                {/* Simulated Device Frame */}
                <div
                    className={`relative bg-white overflow-hidden shadow-2xl transition-all duration-300 origin-center ${device.name === 'Phone' ? 'border-[8px] border-zinc-900 rounded-[2rem]' : 'border-4 border-zinc-800 rounded-lg'}`}
                    style={{
                        width: frameNode.width,
                        height: frameNode.height,
                        transform: `scale(${finalScale})`,
                        flexShrink: 0, // Prevent flex compression
                    }}
                >
                    {/* Render Content */}
                    <div className="absolute inset-0 bg-white">
                        {/* We can use the frameNode's fill as background if it exists, else white */}
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: frameNode.style.fill || '#fff',
                                position: 'relative', // Ensure children absolute positioning works relative to this
                            }}
                        >
                            {/* Recursive Children Render */}
                            {frameNode.children.map(childId => renderNode(childId))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
