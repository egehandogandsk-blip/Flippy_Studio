import React from 'react';
import { X, Check } from 'lucide-react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PricingPlan {
    name: string;
    price: number;
    period: string;
    targetAudience: string;
    maxProjects: string;
    dailyAI: string;
    engineBridge: string;
    github: string;
    storage: string;
    recommended?: boolean;
    features: string[];
    ctaText: string;
}

const plans: PricingPlan[] = [
    {
        name: 'Forge Lite',
        price: 0,
        period: 'Free',
        targetAudience: 'Öğrenciler',
        maxProjects: '3 Aktif Proje',
        dailyAI: 'Günlük 10 Üretim',
        engineBridge: 'Sadece 1 Bağlantı',
        github: 'Read-only',
        storage: '500 MB',
        ctaText: 'Current Plan',
        features: [
            '3 Aktif Proje',
            'Günlük 10 AI Üretim',
            '1 Engine Bridge Bağlantı',
            'GitHub Read-only',
            '500 MB Depolama'
        ]
    },
    {
        name: 'Forge Starter',
        price: 9,
        period: '/ay',
        targetAudience: 'Hobi & Küçük Projeler',
        maxProjects: '10 Aktif Proje',
        dailyAI: 'Günlük 50 Üretim',
        engineBridge: '3 Aktif Bağlantı',
        github: 'Temel Push/Pull',
        storage: '5 GB',
        ctaText: 'Upgrade',
        features: [
            '10 Aktif Proje',
            'Günlük 50 AI Üretim',
            '3 Engine Bridge Bağlantı',
            'GitHub Basic Push/Pull',
            '5 GB Depolama'
        ]
    },
    {
        name: 'Forge Pro',
        price: 19,
        period: '/ay',
        targetAudience: 'Profesyonel Geliştiriciler',
        maxProjects: 'Sınırsız',
        dailyAI: 'Sınırsız',
        engineBridge: 'Sınırsız',
        github: 'Full Entegrasyon',
        storage: '50 GB',
        recommended: true,
        ctaText: 'Upgrade',
        features: [
            'Sınırsız Proje',
            'Sınırsız AI Üretim',
            'Sınırsız Engine Bridge',
            'Live Preview',
            'GitHub Full Integration',
            '50 GB Depolama'
        ]
    },
    {
        name: 'Forge Studio',
        price: 49,
        period: '/kullanıcı',
        targetAudience: 'Oyun Stüdyoları',
        maxProjects: 'Sınırsız',
        dailyAI: 'Özel Eğitilmiş AI',
        engineBridge: 'Canlı Preview & Test',
        github: 'Versiyon Kontrolü',
        storage: 'Sınırsız',
        ctaText: 'Contact Sales',
        features: [
            'Tüm Pro Özellikleri',
            'Real-time Collaboration',
            'Özel Eğitilmiş AI Modelleri',
            'Gelişmiş Versiyon Kontrolü',
            'Admin Panel',
            'Sınırsız Depolama'
        ]
    }
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-6xl bg-[#141414] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-[#141414] border-b border-purple-500/20 p-4 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Choose Your Plan
                        </h2>
                        <p className="text-white/50 text-sm">Select the perfect plan for your creative journey</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Pricing Cards */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col p-4 rounded-xl border transition-all hover:scale-105 ${plan.recommended
                                ? 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500'
                                : 'bg-[#1a1a1a] border-purple-500/20 hover:border-purple-500/40'
                                }`}
                        >
                            {/* Recommended Badge */}
                            {plan.recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white text-xs font-semibold">
                                    Recommended
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {plan.name}
                            </h3>
                            <p className="text-white/50 text-xs mb-4">{plan.targetAudience}</p>

                            {/* Price */}
                            <div className="mb-4">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                                    <span className="text-white/50 text-sm">{plan.period}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-2 mb-4 flex-1">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start gap-2">
                                        <Check size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-white/70 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${plan.recommended
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                                    : plan.price === 0
                                        ? 'bg-[#2C2C2C] text-white/50 cursor-not-allowed'
                                        : 'bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white'
                                    }`}
                                disabled={plan.price === 0}
                            >
                                {plan.ctaText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
