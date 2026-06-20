import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';
// @ts-ignore
import spaBannerHero from '../assets/images/spa_banner_hero_1781892818736.jpg';

const PRIME_IMAGES = [
  {
    url: spaBannerHero,
    title: 'THE ART OF SOMATIC RECOVERY',
    subtitle: 'Clinical Back & Shoulder Knot Dissolving Treatments',
    description: 'Every session is guided by hand-crafted warm botanical blends, heated basalt elements, and deep tissue restructuring techniques tailored specifically to your physical metrics.'
  },
  {
    url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=90',
    title: 'AUTHENTIC AYURVEDIC ABHYANGA',
    subtitle: '5,000-Year-Old Vedic Herbal Concoctions',
    description: 'We steep direct root formulations under ancient medical standards to nourish dry nervous cells, accelerate lymphatic drainage, and purify your biological aura.'
  },
  {
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=90',
    title: 'IMMERSIVE SENSORY SANCTUARY',
    subtitle: 'Zero Noise, Ultra-Sanitized Individual Suites',
    description: 'Opposite the bustling Kondapur Google Gate, experience pristine soundproofing, hospital-standard autoclave tools sterilization, and personalized mood lighting settings.'
  }
];

interface PrimeSpaBannerProps {
  onBookTrigger: () => void;
}

export const PrimeSpaBanner: React.FC<PrimeSpaBannerProps> = ({ onBookTrigger }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PRIME_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="spa-prime-look-banner" className="bg-[#FAF7F2] border border-[#EAE2D8] rounded-3xl overflow-hidden shadow-md max-w-7xl mx-auto font-sans relative">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Interactive Curated Slide Visual Showcase (occupies 7 columns) */}
        <div className="relative h-64 sm:h-80 md:h-[400px] lg:col-span-7 bg-[#3D342B] overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <img
                src={PRIME_IMAGES[activeIndex].url}
                alt={PRIME_IMAGES[activeIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 mix-blend-normal transition-all duration-1000"
              />
              {/* Vignette Gradients for prime cinematic look */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D342B] via-transparent to-[#3D342B]/30" />
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#3D342B]/40 to-transparent hidden lg:block" />
            </motion.div>
          </AnimatePresence>

          {/* Luxury Floating Badge */}
          <div className="absolute top-4 left-4 bg-[#3D342B]/85 backdrop-blur border border-[#8C7355]/30 text-white rounded-full px-3 py-1 text-[9px] font-bold tracking-widest uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8C7355] animate-spin" />
            MAHEEEE SIGNATURE PRIME EXPERIENCE
          </div>

          {/* Interactive Slide dots navigator */}
          <div className="absolute bottom-5 right-5 flex gap-2 z-10">
            {PRIME_IMAGES.map((_, idx) => (
              <button
                key={idx}
                id={`prime-dot-${idx}`}
                onClick={() => setActiveIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'bg-[#8C7355] w-6' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pure Luxury Invitation Card Detail panel (occupies 5 columns) */}
        <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white text-[#3D342B] relative">
          {/* Subtle gold decoration ornament */}
          <div className="absolute right-6 top-6 opacity-10">
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
              <path d="M50 0 L55 35 L90 40 L55 45 L50 80 L45 45 L10 40 L45 35 Z" fill="#8C7355" />
            </svg>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-1 text-[#8C7355]">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[9px] font-bold tracking-widest uppercase ml-1.5 font-mono text-[#8E867C]">5-star service standard</span>
            </div>

            <div className="space-y-2">
              <p className="text-[#8C7355] font-mono text-[10px] uppercase tracking-widest font-bold">
                {PRIME_IMAGES[activeIndex].subtitle}
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-[#3D342B] tracking-wider leading-snug font-bold uppercase">
                {PRIME_IMAGES[activeIndex].title}
              </h3>
              <p className="text-xs text-[#5C544B] leading-relaxed font-sans font-medium">
                {PRIME_IMAGES[activeIndex].description}
              </p>
            </div>
          </div>

          {/* Action Trigger section with quality indicators */}
          <div className="mt-8 pt-6 border-t border-[#EAE2D8]/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Cancellation Fee Today
              </div>
              <span className="text-[10px] text-[#8E867C] font-mono font-bold">Opp. Google Gate</span>
            </div>

            <button
              id="prime-banner-action-btn"
              onClick={onBookTrigger}
              className="w-full bg-[#3D342B] hover:bg-[#2C241C] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition duration-200 flex items-center justify-center gap-2 shadow-md group"
            >
              Unlock Prime Session Slot
              <ArrowRight className="w-4 h-4 text-[#8C7355] group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
