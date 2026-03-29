import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

export const SubscriptionSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            // Optional: Verify session status with backend if needed
            console.log('Payment successful. Session ID:', sessionId);
            // In a real app, you might poll the backend to confirm the webhook processed the update
        }
    }, [sessionId]);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-white">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/50">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>

                    <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-zinc-400 mb-8">
                        Thank you for upgrading, <span className="text-white font-medium">{user?.firstName}</span>.
                        Your account has been upgraded to the new plan.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        Return to Studio <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
