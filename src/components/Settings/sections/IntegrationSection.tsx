import React, { useState, useRef } from 'react';
import { useSettingsStore } from '../../../store/settingsStore';
import { Github, FolderOpen, Key, Circle, Check } from 'lucide-react';

export const IntegrationSection: React.FC = () => {
    const { integration, updateIntegration } = useSettingsStore();
    const [showGitHubAuth, setShowGitHubAuth] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState('');
    const [apiKeysSaved, setApiKeysSaved] = useState(false);
    const directoryInputRef = useRef<HTMLInputElement>(null);

    const mockRepos = [
        'username/awesome-project',
        'username/game-engine-assets',
        'username/flippy-plugin'
    ];

    const handleGitHubConnect = () => {
        setShowGitHubAuth(true);
    };

    const handleGitHubAuthorize = () => {
        // Simulate OAuth - show repo selection
        setShowGitHubAuth(false);
        setSelectedRepo(mockRepos[0]);
    };

    const handleRepoSelect = (repo: string) => {
        setSelectedRepo(repo);
        updateIntegration({
            githubConnected: true,
            githubRepo: repo
        });
    };

    const handleDisconnectGitHub = () => {
        updateIntegration({
            githubConnected: false,
            githubRepo: ''
        });
        setSelectedRepo('');
    };

    const handleDirectorySelect = () => {
        directoryInputRef.current?.click();
    };

    const handleDirectoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const path = files[0].webkitRelativePath;
            const dirPath = path.split('/')[0];

            // Simple validation - check for Unity or Unreal markers
            const isUnity = dirPath.toLowerCase().includes('unity');
            const isUnreal = dirPath.toLowerCase().includes('unreal');

            updateIntegration({
                enginePath: dirPath,
                engineType: isUnity ? 'unity' : isUnreal ? 'unreal' : null,
                bridgeStatus: isUnity || isUnreal ? 'connected' : 'disconnected',
                pluginVersion: isUnity || isUnreal ? '1.2.3' : null
            });
        }
    };

    const handleSaveApiKeys = () => {
        setApiKeysSaved(true);
        setTimeout(() => setApiKeysSaved(false), 2000);
    };

    return (
        <>
            {/* GitHub Auth Modal */}
            {showGitHubAuth && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-white font-bold text-lg mb-4">Authorize GitHub</h3>
                        <p className="text-white/70 mb-6">
                            Flippy needs permission to access your GitHub repositories.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleGitHubAuthorize}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                                Authorize
                            </button>
                            <button
                                onClick={() => setShowGitHubAuth(false)}
                                className="px-4 py-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* GitHub Connection */}
                <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Github size={18} className="text-purple-400" />
                        GitHub Connection
                    </h4>

                    <div className="space-y-4">
                        {!integration.githubConnected ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Not Connected</p>
                                    <p className="text-white/50 text-sm">Connect to sync your projects</p>
                                </div>
                                <button
                                    onClick={handleGitHubConnect}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Connect GitHub
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Connected</p>
                                        <p className="text-white/50 text-sm">{integration.githubRepo}</p>
                                    </div>
                                    <button
                                        onClick={handleDisconnectGitHub}
                                        className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Disconnect
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Select Repository</label>
                                    <select
                                        value={selectedRepo}
                                        onChange={(e) => handleRepoSelect(e.target.value)}
                                        className="w-full bg-[#2C2C2C] border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                                    >
                                        {mockRepos.map((repo) => (
                                            <option key={repo} value={repo}>
                                                {repo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Engine Bridge */}
                <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <FolderOpen size={18} className="text-purple-400" />
                        Game Engine Bridge
                    </h4>

                    <div className="space-y-4">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-2">
                            <Circle
                                size={12}
                                className={`${integration.bridgeStatus === 'connected'
                                    ? 'text-green-400 fill-green-400'
                                    : integration.bridgeStatus === 'connecting'
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-red-400 fill-red-400'
                                    }`}
                            />
                            <span className="text-white/70 text-sm capitalize">{integration.bridgeStatus}</span>
                        </div>

                        {/* Engine Path */}
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Engine Path</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={integration.enginePath || ''}
                                    readOnly
                                    placeholder="No engine path selected"
                                    className="flex-1 bg-[#2C2C2C] border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                                />
                                <input
                                    ref={directoryInputRef}
                                    type="file"
                                    // @ts-ignore
                                    webkitdirectory="true"
                                    directory="true"
                                    onChange={handleDirectoryChange}
                                    className="hidden"
                                />
                                <button
                                    onClick={handleDirectorySelect}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                                >
                                    Browse
                                </button>
                            </div>
                        </div>

                        {/* Plugin Version */}
                        {integration.pluginVersion && (
                            <div className="flex items-center justify-between p-3 bg-[#2C2C2C] rounded-lg">
                                <div>
                                    <p className="text-white font-medium">Plugin Installed</p>
                                    <p className="text-white/50 text-sm">Version {integration.pluginVersion}</p>
                                </div>
                                <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors">
                                    Update
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* API Keys */}
                <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Key size={18} className="text-purple-400" />
                        API Keys
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Stable Diffusion API Key</label>
                            <input
                                type="password"
                                value={integration.apiKeys?.stableDiffusion || ''}
                                onChange={(e) =>
                                    updateIntegration({
                                        apiKeys: {
                                            stableDiffusion: e.target.value,
                                            layerAI: integration.apiKeys?.layerAI || '',
                                            custom: integration.apiKeys?.custom || ''
                                        }
                                    })
                                }
                                placeholder="sk-..."
                                className="w-full bg-[#2C2C2C] border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-2">Layer.ai API Key</label>
                            <input
                                type="password"
                                value={integration.apiKeys?.layerAI || ''}
                                onChange={(e) =>
                                    updateIntegration({
                                        apiKeys: {
                                            stableDiffusion: integration.apiKeys?.stableDiffusion || '',
                                            layerAI: e.target.value,
                                            custom: integration.apiKeys?.custom || ''
                                        }
                                    })
                                }
                                placeholder="layer-..."
                                className="w-full bg-[#2C2C2C] border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={handleSaveApiKeys}
                            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {apiKeysSaved ? (
                                <>
                                    <Check size={16} />
                                    Saved!
                                </>
                            ) : (
                                'Save API Keys'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
