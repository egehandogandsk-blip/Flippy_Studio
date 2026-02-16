import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export const SubscriptionCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-white">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/50">
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
                    <p className="text-zinc-400 mb-8">
                        The checkout process was cancelled. No charges were made.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} /> Return to Studio
                    </button>
                </div>
            </div>
        </div>
    );
};
