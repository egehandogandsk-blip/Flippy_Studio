import { useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import { useDocumentStore } from '../../store/documentStore';
import { X, Cloud, Upload, FileJson, Check, Save } from 'lucide-react';
import { createMobileAppFlow } from '../../utils/PresetGenerator';

interface FileOperationsModalsProps {
    activeModal: 'none' | 'new_confirm' | 'import' | 'cloud' | 'save_local';
    onClose: () => void;
}

export const FileOperationsModals = ({ activeModal, onClose }: FileOperationsModalsProps) => {
    const { setShowLauncher } = useUiStore();
    const { actions } = useDocumentStore();
    const [importTab, setImportTab] = useState<'json' | 'figma'>('json');
    const [figmaLink, setFigmaLink] = useState('');
    const [figmaToken, setFigmaToken] = useState(''); // Store token
    // const [jsonFile, setJsonFile] = useState<File | null>(null); // Future implementation
    const [cloudSaving, setCloudSaving] = useState(false);
    const [importing, setImporting] = useState(false);

    if (activeModal === 'none') return null;

    // --- NEW PROJECT LOGIC ---
    const handleReset = () => {
        actions.resetDocument();
        setShowLauncher(true);
        onClose();
    };

    const handleSaveAndReset = () => {
        // Mock save logic
        const blob = new Blob(['Mock Project Data'], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project.json';
        a.click();

        setTimeout(() => {
            handleReset();
        }, 500);
    };

    // --- IMPORT LOGIC ---
    const handleImport = async () => {
        setImporting(true);
        if (importTab === 'json') {
            setTimeout(() => {
                createMobileAppFlow(100, 100); // Demo import
                setImporting(false);
                onClose();
            }, 1000);
        } else {
            // Figma Import
            try {
                // Extract File Key
                // Extract File Key - Support more formats
                // standard: https://www.figma.com/file/KEY/title
                // design: https://www.figma.com/design/KEY/title
                // proto: https://www.figma.com/proto/KEY/title
                let fileKey = '';
                const urlMatch = figmaLink.match(/(?:file|design|proto)\/([a-zA-Z0-9]+)/);

                if (urlMatch && urlMatch[1]) {
                    fileKey = urlMatch[1];
                } else if (figmaLink.length > 20 && !figmaLink.includes('/')) {
                    // Assume it's a raw key if it's long and has no slashes
                    fileKey = figmaLink;
                }

                if (!fileKey) {
                    alert('Invalid Figma Link. Please paste the full URL (e.g., figma.com/design/KEY/...) or just the File Key.');
                    setImporting(false);
                    return;
                }

                // Get Token (from input or localStorage in future)
                if (!figmaToken) {
                    alert('Please enter your Figma Personal Access Token');
                    setImporting(false);
                    return;
                }

                const { FigmaImporter } = await import('../../utils/FigmaImporter');
                const importer = new FigmaImporter(figmaToken);

                // Fetch
                const data = await importer.fetchFile(fileKey);
                // Process
                const nodes = importer.processFile(data);

                // Update Store
                actions.setNodes(nodes);

                setImporting(false);
                onClose();

            } catch (error) {
                console.error(error);
                alert('Figma Import Failed: ' + (error as Error).message);
                setImporting(false);
            }
        }
    };

    // ... inside return ...



    // --- CLOUD LOGIC ---
    const handleCloudSave = () => {
        setCloudSaving(true);
        setTimeout(() => {
            setCloudSaving(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">

            {/* NEW PROJECT CONFIRMATION */}
            {activeModal === 'new_confirm' && (
                <div className="w-[400px] bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-semibold text-white mb-2">Save current project?</h3>
                    <p className="text-zinc-400 text-sm mb-6">You have unsaved changes. Do you want to save them before creating a new project?</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleSaveAndReset}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save & New Project
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-red-400 hover:text-red-300 rounded-lg font-medium transition-colors"
                        >
                            Don't Save
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* IMPORT MODAL */}
            {activeModal === 'import' && (
                <div className="w-[500px] bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                        <h3 className="text-lg font-semibold text-white">Import Design</h3>
                        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="flex border-b border-zinc-800">
                        <button
                            onClick={() => setImportTab('json')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${importTab === 'json' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-zinc-800/50' : 'text-zinc-400 hover:bg-zinc-800'}`}
                        >
                            JSON File
                        </button>
                        <button
                            onClick={() => setImportTab('figma')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${importTab === 'figma' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-zinc-800/50' : 'text-zinc-400 hover:bg-zinc-800'}`}
                        >
                            Figma Link
                        </button>
                    </div>

                    <div className="p-6">
                        {importTab === 'json' ? (
                            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-zinc-500 transition-colors cursor-pointer bg-zinc-800/20">
                                <FileJson className="w-10 h-10 text-zinc-500 mb-3" />
                                <p className="text-zinc-300 font-medium">Click to select file</p>
                                <p className="text-zinc-500 text-xs mt-1">Supports .json project files</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">Figma File Link</label>
                                    <input
                                        type="text"
                                        value={figmaLink}
                                        onChange={(e) => setFigmaLink(e.target.value)}
                                        placeholder="Paste full URL or File Key"
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">Personal Access Token</label>
                                    <input
                                        type="password"
                                        value={figmaToken}
                                        onChange={(e) => setFigmaToken(e.target.value)}
                                        placeholder="figd_..."
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                                    />
                                    <p className="text-[10px] text-zinc-500 mt-1">Found in Figma Settings &gt; Account &gt; Personal Access Tokens</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                        <button
                            onClick={handleImport}
                            disabled={importing}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {importing ? 'Importing...' : <><Upload className="w-4 h-4" /> Import</>}
                        </button>
                    </div>
                </div>
            )}

            {/* CLOUD SAVE DEMA */}
            {activeModal === 'cloud' && (
                <div className="w-[400px] bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Cloud className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Save to Cloud</h3>
                    <p className="text-zinc-400 text-sm mb-6">Syncing your project to Branchout Cloud...</p>

                    {cloudSaving ? (
                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mb-2">
                            <div className="bg-indigo-500 h-full rounded-full animate-[loading_2s_ease-in-out_infinite] w-1/2" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center animate-in zoom-in duration-200">
                            <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-3">
                                <Check className="w-6 h-6" />
                            </div>
                            <p className="text-white font-medium">Saved Successfully!</p>
                        </div>
                    )}

                    {!cloudSaving && (
                        <button
                            onClick={handleCloudSave}
                            className="mt-6 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Sync Again
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
