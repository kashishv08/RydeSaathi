import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight } from 'lucide-react';

const CARDS = [
    {
        id: 'moto',
        title: 'Moto',
        category: 'City Escape',
        badge: 'Most Popular',
        desc: 'Affordable motorcycle rides for agility and total freedom.',
        features: ['1 seat', 'Helmet included', 'Fast commute'],
        color: '235, 33, 41', // Red
        img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=900'
    },
    {
        id: 'auto',
        title: 'Auto',
        category: 'Local Transit',
        badge: 'Best Value',
        desc: 'Pay directly to driver. Perfect for daily errands and short hops.',
        features: ['3 seats', 'Cash/UPI only', 'No haggling'],
        color: '245, 158, 11', // Amber
        img: 'image.png'
    },
    {
        id: 'ryde-go',
        title: 'Ryde Go',
        category: 'Everyday',
        badge: 'Affordable',
        desc: 'Affordable compact AC rides for your everyday commute.',
        features: ['4 seats', 'AC included', 'Verified drivers'],
        color: '59, 130, 246', // Blue
        img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=900'
    },
    {
        id: 'premier',
        title: 'Premier',
        category: 'Comfort',
        badge: 'Premium',
        desc: 'Comfortable sedans and top-quality drivers for a relaxed journey.',
        features: ['4 seats', 'Top drivers', 'Extra legroom'],
        color: '34, 197, 94', // Green
        img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=900'
    },
    {
        id: 'rydexl',
        title: 'RydeXL',
        category: 'Group Travel',
        badge: 'Spacious',
        desc: 'Comfortable SUVs for up to 6 people. Perfect for group outings.',
        features: ['6 seats', 'Extra luggage', 'Spacious'],
        color: '139, 92, 246', // Purple
        img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=900'
    }
];

export default function VehicleCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % CARDS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const getTransform = (index) => {
        const offset = (index - activeIndex + CARDS.length) % CARDS.length;
        if (offset === 0) {
            return {
                transform: 'none',
                opacity: 1,
                zIndex: 10,
                scale: 1,
            };
        } else if (offset === 1) {
            return {
                transform: 'translateX(52%) translateZ(-220px) scale(0.82) rotateY(-48deg)',
                opacity: 0.7,
                zIndex: 6,
                scale: 0.82,
            };
        } else if (offset === 2) {
            return {
                transform: 'translateX(88%) translateZ(-420px) scale(0.65) rotateY(-60deg)',
                opacity: 0.35,
                zIndex: 2,
                scale: 0.65,
            };
        } else if (offset === 3) {
            return {
                transform: 'translateX(-88%) translateZ(-420px) scale(0.65) rotateY(60deg)',
                opacity: 0.35,
                zIndex: 2,
                scale: 0.65,
            };
        } else if (offset === 4) {
            return {
                transform: 'translateX(-52%) translateZ(-220px) scale(0.82) rotateY(48deg)',
                opacity: 0.7,
                zIndex: 6,
                scale: 0.82,
            };
        }
        return {};
    };

    return (
        <div className="relative flex items-center justify-center w-full" style={{ height: '520px', transformStyle: 'preserve-3d', perspective: '1000px' }}>
            {CARDS.map((card, i) => {
                const style = getTransform(i);
                const isActive = i === activeIndex;

                return (
                    <div
                        key={card.id}
                        className="absolute transition-all duration-700 ease-in-out cursor-pointer"
                        style={{
                            width: '320px',
                            height: '460px',
                            transformStyle: 'preserve-3d',
                            opacity: style.opacity,
                            zIndex: style.zIndex,
                            transform: style.transform,
                        }}
                        onClick={() => setActiveIndex(i)}
                    >
                        <div
                            className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl"
                            style={{
                                boxShadow: isActive
                                    ? `rgba(${card.color}, 0.33) 0px 40px 80px -16px, rgba(${card.color}, 0.19) 0px 0px 0px 1.5px`
                                    : 'rgba(0, 0, 0, 0.25) 0px 20px 50px -10px',
                                transition: 'box-shadow 0.7s ease-in-out'
                            }}
                        >
                            <img
                                src={card.img}
                                alt={card.title}
                                draggable="false"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                                style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{ background: 'linear-gradient(to top, rgba(5, 5, 15, 0.97) 0%, rgba(5, 5, 15, 0.45) 55%, rgba(0, 0, 0, 0.05) 100%)' }}
                            />

                            {/* Active Top Border Glow */}
                            <div
                                className="absolute top-0 left-10 right-10 h-[3px] rounded-b-full transition-opacity duration-700"
                                style={{ background: `rgb(${card.color})`, opacity: isActive ? 1 : 0 }}
                            />

                            <div className="absolute inset-0 flex flex-col justify-between p-7">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-sm text-white/80 bg-white/10">
                                        {card.category}
                                    </span>
                                    <span
                                        className="text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-full text-white"
                                        style={{ background: `rgba(${card.color}, 0.8)` }}
                                    >
                                        {card.badge}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black text-white tracking-tight leading-none mb-1.5">
                                        {card.title}
                                    </h3>
                                    <p
                                        className="text-white/60 text-sm leading-relaxed mb-4 max-w-[220px]"
                                        style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.3s' }}
                                    >
                                        {card.desc}
                                    </p>
                                    <div
                                        className="flex flex-wrap gap-1.5 mb-5"
                                        style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.3s 0.1s' }}
                                    >
                                        {card.features.map((feature, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                                                style={{ background: `rgba(${card.color}, 0.19)`, border: `1px solid rgba(${card.color}, 0.31)` }}
                                            >
                                                <Zap size={9} style={{ color: `rgb(${card.color})` }} />
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        className="inline-flex items-center gap-2 bg-white font-bold text-sm px-5 py-2.5 rounded-2xl hover:scale-[1.04] active:scale-[0.97] transition-all duration-200 shadow-lg cursor-pointer"
                                        style={{
                                            color: `rgb(${card.color})`,
                                            opacity: isActive ? 1 : 0,
                                            pointerEvents: isActive ? 'auto' : 'none',
                                            transition: 'opacity 0.3s 0.15s'
                                        }}
                                    >
                                        Discover <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
