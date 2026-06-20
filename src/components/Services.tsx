import React, { useState } from 'react';
import { Sparkles, Clock, Compass, ThumbsUp, Heart, Flower } from 'lucide-react';
import { THERAPIES } from '../data/catalog';
import { Therapy } from '../types';

interface ServicesProps {
  onSelectTherapyToBook: (therapyId: string) => void;
}

export default function Services({ onSelectTherapyToBook }: ServicesProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'massages' | 'ayurvedic' | 'express' | 'scrubs-wraps' | 'partners'>('all');

  const categories = [
    { id: 'all', label: 'All Therapies' },
    { id: 'massages', label: 'Classic Massage' },
    { id: 'ayurvedic', label: 'Holistic Ayurveda' },
    { id: 'scrubs-wraps', label: 'Body Scrubs & Polishes' },
    { id: 'express', label: 'Express Rejuvenations' },
    { id: 'partners', label: 'Partners & Couples Spa' }
  ];

  const filteredTherapies = selectedCategory === 'all' 
    ? THERAPIES 
    : THERAPIES.filter(t => t.category === selectedCategory);

  return (
    <div id="services-section-wrapper" className="space-y-6">
      {/* Category Selection Tabs */}
      <div className="flex justify-center flex-wrap gap-2 md:gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
              selectedCategory === cat.id
                ? cat.id === 'all'
                  ? 'bg-stone-900 text-white shadow-md'
                  : cat.id === 'massages'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/15'
                  : cat.id === 'ayurvedic'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/15'
                  : cat.id === 'scrubs-wraps'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/15'
                  : cat.id === 'partners'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-700 text-white shadow-lg shadow-rose-600/15'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/15'
                : 'bg-[#F2EBE1]/75 hover:bg-[#F2EBE1] text-[#5C544B]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTherapies.map((therapy) => {
          // Dynamic category colors for premium spa aesthetics
          const categoryColors = therapy.category === 'massages'
            ? { border: 'group-hover:border-emerald-500/80', badgeBg: 'bg-emerald-500', tagColor: 'text-emerald-400', glow: 'shadow-emerald-500/5', checkColor: 'text-emerald-500', strip: 'bg-emerald-600' }
            : therapy.category === 'ayurvedic'
            ? { border: 'group-hover:border-amber-500/80', badgeBg: 'bg-amber-600', tagColor: 'text-amber-300', glow: 'shadow-amber-500/5', checkColor: 'text-amber-600', strip: 'bg-amber-600' }
            : therapy.category === 'scrubs-wraps'
            ? { border: 'group-hover:border-rose-400/80', badgeBg: 'bg-rose-500', tagColor: 'text-rose-300', glow: 'shadow-rose-400/5', checkColor: 'text-rose-500', strip: 'bg-rose-500' }
            : therapy.category === 'partners'
            ? { border: 'group-hover:border-rose-500/80', badgeBg: 'bg-rose-600', tagColor: 'text-rose-400', glow: 'shadow-rose-500/10', checkColor: 'text-rose-600', strip: 'bg-rose-600' }
            : { border: 'group-hover:border-violet-500/80', badgeBg: 'bg-violet-600', tagColor: 'text-violet-300', glow: 'shadow-violet-500/5', checkColor: 'text-violet-600', strip: 'bg-violet-600' };

          return (
            <div
              key={therapy.id}
              id={`service-card-${therapy.id}`}
              className={`bg-white border-2 border-stone-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between group transform hover:-translate-y-1 ${categoryColors.border} ${categoryColors.glow}`}
            >
              {/* Visual background image with content overlays */}
              <div className="h-48 overflow-hidden relative border-b border-stone-100">
                <img 
                  src={therapy.imageUrl} 
                  alt={therapy.name}
                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/15 to-transparent"></div>
                
                {therapy.popular && (
                  <div className="absolute top-3.5 left-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-black shadow-sm flex items-center gap-1 animate-pulse">
                    <Sparkles className="w-2.5 h-2.5" />
                    Top Curated
                  </div>
                )}

                {/* Decorative category marker strip */}
                <div className={`absolute top-0 right-0 left-0 h-1.5 ${categoryColors.strip}`} />

                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className={`text-[10px] ${categoryColors.tagColor} font-sans tracking-widest uppercase font-bold`}>
                    {therapy.category.replace('-', ' & ')}
                  </span>
                  <h3 className="font-serif text-md text-white uppercase font-bold tracking-wide mt-1 leading-tight">
                    {therapy.name}
                  </h3>
                </div>
              </div>

              {/* Core details body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-[#5C544B] text-[11px] md:text-xs leading-relaxed font-sans text-left">
                    {therapy.shortDescription}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] uppercase tracking-widest text-[#8C7355] font-bold font-sans">Therapeutic Action</span>
                    <div className="space-y-1.5 mt-1.5">
                      {therapy.benefits.slice(0, 2).map((benefit, idx) => (
                        <div key={idx} className="flex gap-1.5 items-start text-[10.5px] text-[#5C544B]">
                          <Sparkles className={`${categoryColors.checkColor} w-3 h-3 flex-shrink-0 mt-0.5`} />
                          <span className="leading-tight">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scent & ingredient highlights */}
                  <div className="pt-2 text-left">
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold font-sans font-mono">Signature Botanics</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {therapy.signatureIngredients.map((ing, idx) => (
                        <span 
                          key={idx} 
                          className="text-[9px] bg-amber-50/70 text-amber-900 border border-amber-200/50 px-2 py-0.5 rounded font-sans uppercase font-semibold"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Booking Trigger Footer */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[9px] text-[#8C7355] font-bold font-sans uppercase block tracking-wider">Starting From</span>
                    <span className="font-mono text-sm font-bold text-[#3D342B]">
                      ₹{therapy.basePrice60.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#8E867C] font-sans ml-1 font-mono">
                      ({therapy.category === 'express' ? '45 min' : '64 min'} base)
                    </span>
                  </div>

                  <button
                    id={`book-now-trigger-${therapy.id}`}
                    onClick={() => onSelectTherapyToBook(therapy.id)}
                    className="bg-[#3D342B] hover:bg-[#8C7355] text-white text-[10px] font-semibold uppercase tracking-widest py-2 px-5 rounded-full transition duration-200"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
