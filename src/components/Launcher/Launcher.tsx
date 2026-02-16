import { useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import {
    createMobileAppFlow,
    createSocialMediaFlow,
    createWebsiteFlow,
    createVideoGameFlow
} from '../../utils/PresetGenerator';
import {
    Smartphone,
    Layout,
    Globe,
    Gamepad2,
    Plus,
    Users,
    MessageSquare,
    Wifi,
    Clock,
    FileText,
    Settings,
    X,
    Search,
    Filter,
    ArrowLeft,
    Check,
    Send,
    Link as LinkIcon,
    Eye,
    ArrowRight,
    FolderOpen
} from 'lucide-react';

const PresetCard = ({
    title,
    description,
    icon: Icon,
    gradient,
    onClick
}: {
    title: string;
    description: string;
    icon: any;
    gradient: string;
    onClick: () => void
}) => (
    <div
        onClick={onClick}
        className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:shadow-2xl hover:-translate-y-1 h-64 w-full flex flex-col"
    >
        {/* Background Gradient & Visuals */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

        {/* Abstract Shapes */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />

        <div className="relative p-5 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                    <Icon className="w-8 h-8 text-white/90" />
                </div>

                {/* Action Indicator - Hidden by default, visible on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-white/60 uppercase tracking-wider">
                    <span>Create</span>
                    <ArrowRight className="w-3 h-3" />
                </div>
            </div>

            {/* Content */}
            <div>
                <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                <p className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors line-clamp-2 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

const RecentFileRow = ({ name, date }: { name: string; date: string }) => (
    <div className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer group transition-colors">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-800 group-hover:bg-zinc-700 rounded-md transition-colors">
                <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-200">{name}</span>
                <span className="text-xs text-zinc-500">Edited {date}</span>
            </div>
        </div>
        <Settings className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
);

const CommunityCard = ({ title, author, likes, image }: { title: string, author: string, likes: string, image: string }) => (
    <div className="group relative bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-zinc-500 transition-all cursor-pointer">
        <div className="h-40 bg-zinc-900 relative overflow-hidden">
            {/* Background Image/Gradient Placeholder */}
            <div className={`absolute inset-0 bg-gradient-to-br ${image} opacity-80 group-hover:scale-105 transition-transform duration-500`} />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-200 hover:bg-white text-zinc-900 rounded-lg text-xs font-medium transition-colors">
                    <Eye className="w-3 h-3" /> Preview
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors">
                    <FolderOpen className="w-3 h-3" /> Open
                </button>
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-zinc-100 font-medium truncate">{title}</h3>
            <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-zinc-500">by {author}</span>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <Users className="w-3 h-3" /> {likes}
                </div>
            </div>
        </div>
    </div>
);

export const Launcher = () => {
    const { showLauncher, setShowLauncher } = useUiStore();
    const [loading, setLoading] = useState<{ active: boolean; text: string } | null>(null);
    const [currentView, setCurrentView] = useState<'launcher' | 'community'>('launcher');
    const [activeModal, setActiveModal] = useState<'none' | 'feedback' | 'connection'>('none');

    // Feedback Form State
    const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'success'>('idle');
    const [feedbackSubject, setFeedbackSubject] = useState('');
    const [feedbackEmail, setFeedbackEmail] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    // Connection Form State
    const [connectionLinks, setConnectionLinks] = useState({
        unity: 'C:/Program Files/Unity/Hub/Editor/2022.3.10f1/Editor/Unity.exe',
        unreal: 'C:/Program Files/Epic Games/UE_5.3/Engine/Binaries/Win64/UnrealEditor.exe',
        godot: 'C:/Program Files/Godot/Godot_v4.2.1.exe'
    });

    // If not visible, return null (or unmount)
    if (!showLauncher) return null;

    const handlePresetClick = async (type: 'mobile' | 'social' | 'web' | 'game') => {
        setLoading({ active: true, text: `Generating ${type === 'mobile' ? 'App' : type} Template...` });

        // Simulate "AI Generation" delay
        setTimeout(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (type === 'mobile') {
                createMobileAppFlow(width, height);
            } else if (type === 'social') {
                createSocialMediaFlow(width, height);
            } else if (type === 'web') {
                createWebsiteFlow(width, height);
            } else if (type === 'game') {
                createVideoGameFlow(width, height);
            }

            setLoading(null);
            setShowLauncher(false);
        }, 3000);
    };

    const handleNewDesign = () => {
        setLoading({ active: true, text: 'Preparing Canvas...' });
        setTimeout(() => {
            setLoading(null);
            setShowLauncher(false);
        }, 1000);
    };

    const handleSendFeedback = () => {
        if (!feedbackSubject || !feedbackMessage) return;
        setFeedbackStatus('sending');
        setTimeout(() => {
            setFeedbackStatus('success');
            setTimeout(() => {
                setActiveModal('none');
                setFeedbackStatus('idle');
                setFeedbackSubject('');
                setFeedbackMessage('');
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop with Blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            {/* Main Modal */}
            <div className="relative w-[1200px] h-[800px] bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex border border-zinc-800 animate-in fade-in zoom-in-95 duration-300">

                {/* Close Button (Top Right) */}
                <button
                    onClick={() => setShowLauncher(false)}
                    className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors z-50"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Sidebar */}
                <div className="w-[300px] text-white flex flex-col justify-between p-8 relative overflow-hidden border-r border-zinc-800">
                    {/* Background Image/Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-purple-900/50 opacity-90" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white rounded-xl mb-6 flex items-center justify-center shadow-lg">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg transform rotate-45" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Studio Forge</h1>
                        <p className="text-indigo-200 text-sm">Design & Prototype for the Future.</p>
                    </div>

                    <div className="relative z-10 text-xs text-indigo-300 space-y-1">
                        <p className="font-medium text-white">Branchout Studio Team</p>
                        <p>Version 2.8.0-beta</p>
                        <p>© 2026 Studio Forge Inc.</p>
                    </div>
                </div>

                {/* Main Content Area (Dynamic) */}
                <div className="flex-1 flex flex-col bg-zinc-950 relative">

                    {/* LAUNCHER VIEW */}
                    {currentView === 'launcher' && (
                        <div className="flex h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Center Panel - Presets */}
                            <div className="flex-1 p-10 flex flex-col border-r border-zinc-800">
                                <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                                    Start Something New
                                    <span className="text-xs font-normal text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">Select a Preset</span>
                                </h2>

                                <div className="grid grid-cols-2 gap-6 flex-1 content-center">
                                    <PresetCard
                                        title="Mobile App"
                                        description="Start with a complete 10-screen mobile app wireframe flow including login and dashboard."
                                        icon={Smartphone}
                                        gradient="from-blue-600 to-indigo-600"
                                        onClick={() => handlePresetClick('mobile')}
                                    />
                                    <PresetCard
                                        title="Social Media"
                                        description="Create stunning social media posts with 10 ready-to-use layouts for Instagram and TikTok."
                                        icon={Layout}
                                        gradient="from-pink-600 to-rose-600"
                                        onClick={() => handlePresetClick('social')}
                                    />
                                    <PresetCard
                                        title="Website Flow"
                                        description="Design responsive landing pages with Dark/Light mode variations and grid systems."
                                        icon={Globe}
                                        gradient="from-emerald-600 to-teal-600"
                                        onClick={() => handlePresetClick('web')}
                                    />
                                    <PresetCard
                                        title="Game UI"
                                        description="Prototype game interfaces with HUDs, inventories, and menu systems for PC/Console."
                                        icon={Gamepad2}
                                        gradient="from-orange-600 to-amber-600"
                                        onClick={() => handlePresetClick('game')}
                                    />
                                </div>

                                <div className="mt-8 flex items-center gap-4">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl transition-all shadow-lg hover:shadow-white/10 font-medium" onClick={handleNewDesign}>
                                        <Plus className="w-5 h-5" />
                                        Create Empty Project
                                    </button>
                                </div>
                            </div>

                            {/* Right Panel - Recent Files & Buttons */}
                            <div className="w-[320px] bg-zinc-900/50 p-8 flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-zinc-500" />
                                        <h3 className="text-lg font-medium text-white">Recent Files</h3>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-1 -mx-2 px-2 custom-scrollbar">
                                    <RecentFileRow name="Mobile App Concept 2" date="2h ago" />
                                    <RecentFileRow name="Landing Page Dark" date="Yesterday" />
                                    <RecentFileRow name="Dashboard V3" date="3 days ago" />
                                    <RecentFileRow name="Instagram Campaign" date="4 days ago" />
                                    <RecentFileRow name="Game HUD Mocks" date="1 week ago" />
                                    <RecentFileRow name="Profile Settings" date="1 week ago" />
                                    <RecentFileRow name="Login Flow" date="2 weeks ago" />
                                    <RecentFileRow name="Design System v1" date="1 month ago" />
                                </div>

                                <div className="mt-6 pt-6 border-t border-zinc-800 flex flex-col gap-2">
                                    <button
                                        onClick={() => setCurrentView('community')}
                                        className="flex items-center gap-3 w-full p-2.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors text-sm"
                                    >
                                        <Users className="w-4 h-4" />
                                        Community
                                    </button>
                                    <button
                                        onClick={() => setActiveModal('feedback')}
                                        className="flex items-center gap-3 w-full p-2.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors text-sm"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Send Feedback
                                    </button>
                                    <button
                                        onClick={() => setActiveModal('connection')}
                                        className="flex items-center gap-3 w-full p-2.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors text-sm"
                                    >
                                        <Wifi className="w-4 h-4" />
                                        Connection
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COMMUNITY VIEW */}
                    {currentView === 'community' && (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Top Bar */}
                            <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/50">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setCurrentView('launcher')}
                                        className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h2 className="text-xl font-semibold text-white">Community</h2>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            type="text"
                                            placeholder="Search projects..."
                                            className="bg-zinc-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 w-64 placeholder-zinc-500"
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors">
                                        <Filter className="w-4 h-4" />
                                        Filter
                                    </button>
                                </div>
                            </div>

                            {/* Grid Content */}
                            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-4 gap-6">
                                    <CommunityCard title="E-Commerce Kit" author="Sarah Design" likes="1.2k" image="from-purple-500 to-indigo-500" />
                                    <CommunityCard title="SaaS Dashboard" author="Alex M." likes="856" image="from-blue-500 to-cyan-500" />
                                    <CommunityCard title="Portfolio Dark" author="DesignMaster" likes="2.3k" image="from-zinc-800 to-zinc-600" />
                                    <CommunityCard title="Social App UI" author="CreativeLabs" likes="4.1k" image="from-pink-500 to-rose-500" />
                                    <CommunityCard title="Crypto Wallet" author="CoinBase_Fan" likes="342" image="from-emerald-500 to-teal-500" />
                                    <CommunityCard title="Flight Booking" author="TravelUI" likes="156" image="from-orange-500 to-red-500" />
                                    <CommunityCard title="Music Player" author="AudioPhile" likes="943" image="from-violet-500 to-purple-500" />
                                    <CommunityCard title="Task Manager" author="Productivity+" likes="2.8k" image="from-blue-600 to-indigo-700" />
                                    <CommunityCard title="Fitness Tracker" author="FitLife" likes="567" image="from-lime-500 to-green-600" />
                                    <CommunityCard title="Recipe App" author="ChefCurry" likes="890" image="from-amber-500 to-orange-600" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* MODALS */}

                {/* Feedback Modal */}
                {activeModal === 'feedback' && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-[500px] bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-2xl relative">
                            <button
                                onClick={() => setActiveModal('none')}
                                className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-white rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-indigo-500" /> Send Feedback
                            </h3>

                            {feedbackStatus === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-medium text-white">Feedback Sent!</h4>
                                    <p className="text-zinc-500 mt-1">Thank you for helping us improve.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSendFeedback} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-1">Subject</label>
                                        <input required type="text" className="w-full bg-zinc-800 border-zinc-700 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2" placeholder="Feature request, Bug report, etc." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-1">Email (Optional)</label>
                                        <input value={feedbackEmail} onChange={(e) => setFeedbackEmail(e.target.value)} type="email" className="w-full bg-zinc-800 border-zinc-700 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2" placeholder="your@email.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-1">Message</label>
                                        <textarea required rows={4} className="w-full bg-zinc-800 border-zinc-700 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 resize-none" placeholder="Tell us what you think..." />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={feedbackStatus === 'sending'}
                                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {feedbackStatus === 'sending' ? (
                                            <>Sending...</>
                                        ) : (
                                            <><Send className="w-4 h-4" /> Send Feedback</>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* Connection Modal */}
                {activeModal === 'connection' && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-[600px] bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-2xl relative">
                            <button
                                onClick={() => setActiveModal('none')}
                                className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-white rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <LinkIcon className="w-5 h-5 text-indigo-500" /> Engine Connections
                            </h3>

                            <div className="space-y-5">
                                <p className="text-sm text-zinc-400">Configure the paths to your local game engine executables to enable direct export and sync features.</p>

                                <div>
                                    <label className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-black border border-white/20"></div> Unity Engine Path
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={connectionLinks.unity}
                                            onChange={(e) => setConnectionLinks({ ...connectionLinks, unity: e.target.value })}
                                            className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 font-mono"
                                        />
                                        <button className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 transition-colors">
                                            <FolderOpen className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-black border border-white/20"></div> Unreal Engine Path
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={connectionLinks.unreal}
                                            onChange={(e) => setConnectionLinks({ ...connectionLinks, unreal: e.target.value })}
                                            placeholder="C:/Program Files/Epic Games/UE_5.3/Engine/Binaries/Win64/UnrealEditor.exe"
                                            className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 font-mono"
                                        />
                                        <button className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 transition-colors">
                                            <FolderOpen className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Godot Engine Path
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={connectionLinks.godot}
                                            onChange={(e) => setConnectionLinks({ ...connectionLinks, godot: e.target.value })}
                                            className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 font-mono"
                                        />
                                        <button className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 transition-colors">
                                            <FolderOpen className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setActiveModal('none')}
                                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setActiveModal('none')}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading Overlay (Inside Modal) */}
                {loading && (
                    <div className="absolute inset-0 bg-zinc-900/90 z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
                        <h3 className="text-xl font-medium text-white">{loading.text}</h3>
                        <p className="text-zinc-500 mt-2 text-sm">Setting up workspace...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
