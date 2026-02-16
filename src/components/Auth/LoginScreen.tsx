import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Hexagon } from 'lucide-react';

export const LoginScreen = () => {
    return (
        <div className="flex h-screen w-screen bg-zinc-950 text-white overflow-hidden font-sans">
            {/* Left Side - Branding & Visuals */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-900 flex-col justify-between p-12 border-r border-zinc-800">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 opacity-80" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7f1c338e852c?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />
                <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] pointer-events-none" />

                {/* Logo & Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Hexagon className="w-6 h-6 text-white fill-indigo-600" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Studio Forge</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Design the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Digital Experience</span>
                    </h1>
                    <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                        The all-in-one platform for prototyping mobile apps, games, and web interfaces.
                        Connect directly with Unity, Unreal, and Godot.
                    </p>

                    <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] text-white">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full rounded-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <p>Joined by 10,000+ creators</p>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-zinc-600">
                    © 2026 Studio Forge Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-950 relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-lg relative z-10 bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl">
                    <SignIn
                        appearance={{
                            layout: {
                                socialButtonsPlacement: "top",
                                socialButtonsVariant: "blockButton",
                            },
                            variables: {
                                colorPrimary: "#4f46e5", // Indigo 600
                                colorText: "white",
                                colorTextSecondary: "#a1a1aa", // Zinc 400
                                colorBackground: "transparent",
                                colorInputBackground: "#18181b", // Zinc 900
                                colorInputText: "white",
                                borderRadius: "0.75rem",
                            },
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent shadow-none border-none p-0 w-full",
                                headerTitle: "text-3xl font-bold text-white mb-2",
                                headerSubtitle: "text-zinc-400 text-base mb-6",
                                socialButtonsBlockButton: "bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white h-12 rounded-xl transition-all",
                                socialButtonsBlockButtonText: "font-medium text-white",
                                dividerLine: "bg-zinc-800",
                                dividerText: "text-zinc-500 bg-transparent px-3",
                                formFieldLabel: "text-zinc-400 font-medium",
                                formFieldInput: "bg-zinc-900/50 border-zinc-700 text-white rounded-xl h-11 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all",
                                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white h-11 rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-medium text-base",
                                footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium",
                                footer: "bg-transparent",
                                identityPreviewText: "text-zinc-300",
                                identityPreviewEditButtonIcon: "text-indigo-400",
                                formFieldAction: "text-indigo-400 hover:text-indigo-300",
                                alert: "bg-red-500/10 border border-red-500/20 text-red-200",
                                alertText: "text-red-200",
                                phoneInputBox: "bg-zinc-900 border-zinc-800 text-white rounded-xl"
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
