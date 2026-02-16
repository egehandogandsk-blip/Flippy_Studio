import React, { useState } from 'react';
import { Flame, Play } from 'lucide-react';
import { MenuItem } from './MenuItem';
import { QuickActionsSearch } from './QuickActionsSearch';
import { AvatarStack } from './AvatarStack';
import { MakeWithAIButton } from '../AI/MakeWithAIButton';
import { ProfileMenu } from './ProfileMenu';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { FileOperationsModals } from './FileOperationsModals';
import { useDocumentStore } from '../../store/documentStore';
import { useSelectionStore } from '../../store/selectionStore';
import { PreviewModal } from './PreviewModal';

const menuData = {
    file: ['New Project', 'Import JSON/Figma', 'Export Code (React/HTML)', 'Save to Cloud'],
    edit: ['Undo/Redo', 'Copy as Component', 'Paste Styles', 'Search Actions (Ctrl+K)'],
    view: ['Toggle Grid', 'Show Rulers', 'Dark/Light Mode', 'Zoom to Fit'],
    object: ['Group Layers', 'Frame Selection', 'Create Component', 'Boolean Operations'],
    text: ['Font Family', 'Text Styles', 'Auto-Resize', 'Convert to Outlines'],
    arrange: ['Bring to Front', 'Send to Back', 'Align Left', 'Distribute Horizontally'],
    forge: ['Auto-Layout Engine', 'AI Style Generator', 'Asset Forge'],
    plugins: ['Installed Extensions', 'Community Store', 'Console'],
};

export const TopBar: React.FC = () => {
    const [activeModal, setActiveModal] = useState<'none' | 'new_confirm' | 'import' | 'cloud' | 'save_local'>('none');
    const [showPreview, setShowPreview] = useState(false);
    const { nodes } = useDocumentStore();
    const { selectedIds } = useSelectionStore();

    const handleFileAction = (item: string) => {
        if (item === 'New Project') {
            const hasContent = Object.keys(nodes).length > 1; // Root always exists
            if (hasContent) {
                setActiveModal('new_confirm');
            } else {
                // Just reset if empty
                useDocumentStore.getState().actions.resetDocument();
                import('../../store/uiStore').then(({ useUiStore }) => {
                    useUiStore.getState().setShowLauncher(true);
                });
            }
        } else if (item === 'Import JSON/Figma') {
            setActiveModal('import');
        } else if (item === 'Save to Cloud') {
            setActiveModal('cloud');
        } else if (item === 'Export Code (React/HTML)') {
            // Demo
        }
    };

    const handlePlayClick = () => {
        if (selectedIds.length === 1) {
            const selectedId = selectedIds[0];
            const node = nodes[selectedId];
            if (node && node.type === 'FRAME') {
                setShowPreview(true);
            }
        }
    };

    // Calculate if play button should be enabled
    const canPreview = selectedIds.length === 1 && nodes[selectedIds[0]]?.type === 'FRAME';

    return (
        <div
            className="h-12 bg-[#121212] border-b border-[#242424] flex items-center justify-between px-4"
            style={{ fontFamily: 'Inter, sans-serif' }}
        >
            <FileOperationsModals activeModal={activeModal} onClose={() => setActiveModal('none')} />

            {showPreview && selectedIds.length > 0 && (
                <PreviewModal
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    frameId={selectedIds[0]}
                />
            )}

            {/* Left Section - Logo & Menus */}
            <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 mr-4">
                    <Flame size={20} className="text-indigo-500" strokeWidth={1.5} />
                    <span className="text-white font-semibold text-sm">Flippy</span>
                </div>

                <MenuItem label="File" items={menuData.file} onSelect={handleFileAction} />
                <MenuItem label="Edit" items={menuData.edit} />
                <MenuItem label="View" items={menuData.view} />
                <MenuItem label="Object" items={menuData.object} />
                <MenuItem label="Text" items={menuData.text} />
                <MenuItem label="Arrange" items={menuData.arrange} />
                <MenuItem label="Forge" items={menuData.forge} isSpecial />
                <MenuItem label="Plugins" items={menuData.plugins} />
            </div>

            {/* Center Section - Quick Actions + AI Button */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                <QuickActionsSearch />
                <MakeWithAIButton />
            </div>

            {/* Right Section - Auto-Save, Avatar, Share, Play, Profile */}
            <div className="flex items-center gap-3">
                <AutoSaveIndicator />
                <AvatarStack />

                <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-medium rounded-md transition-colors">
                    Share
                </button>

                <button
                    onClick={handlePlayClick}
                    disabled={!canPreview}
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${canPreview ? 'bg-[#2C2C2C] hover:bg-[#3C3C3C] text-indigo-400 hover:text-indigo-300' : 'bg-[#2C2C2C]/50 text-white/30 cursor-not-allowed'}`}
                    title={canPreview ? "Preview Selected Frame" : "Select a Frame to Preview"}
                >
                    <Play size={16} strokeWidth={1.25} fill={canPreview ? "currentColor" : "none"} />
                </button>

                <ProfileMenu />
            </div>
        </div>
    );
};
