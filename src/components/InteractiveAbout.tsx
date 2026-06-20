import React, { useState } from 'react';
import { Award, Shield, Heart, Sparkles, MapPin, Phone, MessageSquare, Crown, Droplets, GlassWater } from 'lucide-react';
import { SPA_CONFIG } from '../data/catalog';

export default function InteractiveAbout() {
  const [activeTab, setActiveTab] = useState<'philosophy' | 'facilities' | 'hygiene'>('philosophy');

  return (
    <div id="about-section-container" className="bg-white border border-[#EAE2D8] rounded-2xl p-6 md:p-10 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Story & Interactive Navigation */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-[10px] bg-[#FAF7F2] border border-[#EAE2D8] text-[#8C7355] px-3 py-1.5 rounded-full font-sans tracking-widest uppercase font-bold">
              EST. 2026 • KONDAPUR SANCTUARY
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#3D342B] uppercase tracking-widest mt-3">
              Holistic Equilibrium
            </h2>
            <p className="text-[#8C7355] font-serif italic text-sm tracking-wide mt-1">
              "Healing the physical temple to tranquilize the divine soul."
            </p>
          </div>

          <p className="text-[#5C544B] text-xs md:text-sm leading-relaxed font-sans">
            {SPA_CONFIG.aboutBrief}
          </p>

          {/* Interactive Core Tabs */}
          <div className="border-b border-[#EAE2D8] flex gap-6 pt-2">
            {[
              { id: 'philosophy', label: 'The Shastra Philosophy' },
              { id: 'facilities', label: 'Artisanal Facilities' },
              { id: 'hygiene', label: 'Zero-Contamination Shield' }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`about-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 text-xs font-semibold tracking-wider uppercase transition border-b-2 relative ${
                  activeTab === tab.id 
                    ? 'border-[#8C7355] text-[#3D342B] font-bold' 
                    : 'border-transparent text-[#8E867C] hover:text-[#3D342B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="min-h-[140px] py-2 font-sans">
            {activeTab === 'philosophy' && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-xs text-[#5C544B] leading-relaxed">
                  At <strong>Maheeee Wellness Spa</strong>, we believe stress is not merely localized physical tension, but a disruption of systemic bio-rhythms (Prana and Vyana). Our specialized therapies merge premium western muscle manipulations with age-old secrets of Sanskrit healthcare (Dhanvantari Shastras).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-center text-[#8C7355] text-xs font-bold">✓</div>
                    <span className="text-[11px] font-sans font-medium text-[#3D342B]">100% Organic Extracts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-center text-[#8C7355] text-xs font-bold">✓</div>
                    <span className="text-[11px] font-sans font-medium text-[#3D342B]">Certified Healing Gurus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-center text-[#8C7355] text-xs font-bold">✓</div>
                    <span className="text-[11px] font-sans font-medium text-[#3D342B]">Nerve Deep Release</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'facilities' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SPA_CONFIG.facilities.map((fac, idx) => {
                    // Unique, colorful layout parameters for ultra-premium feel
                    const styleConfig = idx === 0 
                      ? { bg: 'bg-indigo-50/50 border-indigo-100 hover:border-indigo-300', text: 'text-indigo-900', iconBg: 'bg-indigo-100 text-indigo-700', icon: <Crown className="w-4 h-4" /> }
                      : idx === 1
                      ? { bg: 'bg-rose-50/50 border-rose-100 hover:border-rose-300', text: 'text-rose-900', iconBg: 'bg-rose-100 text-rose-600', icon: <Droplets className="w-4 h-4" /> }
                      : idx === 2
                      ? { bg: 'bg-amber-50/60 border-amber-200/50 hover:border-amber-400', text: 'text-amber-900', iconBg: 'bg-amber-100 text-amber-700', icon: <Award className="w-4 h-4" /> }
                      : { bg: 'bg-emerald-50/55 border-emerald-100 hover:border-emerald-300', text: 'text-emerald-900', iconBg: 'bg-emerald-100 text-emerald-700', icon: <GlassWater className="w-4 h-4" /> };

                    return (
                      <div key={idx} className={`p-4 border-2 rounded-xl transition-all duration-300 flex items-start gap-3 ${styleConfig.bg}`}>
                        <div className={`p-2 rounded-lg flex-shrink-0 ${styleConfig.iconBg}`}>
                          {styleConfig.icon}
                        </div>
                        <div className="text-left font-sans">
                          <h4 className={`text-xs font-bold tracking-wide ${styleConfig.text}`}>{fac.title}</h4>
                          <p className="text-[10px] text-[#5C544B] mt-1 leading-relaxed">{fac.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'hygiene' && (
              <div className="space-y-4 animate-fadeIn font-sans">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                  <Shield id="shield-icon" className="text-emerald-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 font-sans tracking-wide">6-Point Medical Grade Sterilization</h4>
                    <p className="text-[10px] text-emerald-800 mt-1 leading-normal">
                      Kondapur's clean standard. We use medical-autoclaved massage tools, single-use surgical linens, dynamic HEPA-air changes inside every healing room, and organic antibacterial lavender vaporizers.
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-[#8E867C] italic">
                  * Therapists pass mandatory skin sanitizations before starting any touch therapy. Fully compliant with state safety boards.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Showcase card with local information */}
        <div className="lg:col-span-5">
          <div className="bg-[#3D342B] text-white rounded-2xl overflow-hidden shadow-sm border border-[#8C7355]/20">
            <div className="h-44 relative bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80)' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <p className="text-xs text-amber-300 font-serif font-semibold tracking-wider italic">Premium Branch Location</p>
                <p className="text-md font-serif text-white uppercase tracking-widest mt-0.5">Kondapur, Hyderabad</p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="flex gap-3">
                <MapPin className="text-[#8C7355] w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] uppercase text-[#FAF7F2]/60 tracking-widest font-semibold">Sanctuary Address</h4>
                  <p className="text-stone-200 font-sans mt-0.5 leading-relaxed">
                    {SPA_CONFIG.address}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Phone className="text-[#8C7355] w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] uppercase text-[#FAF7F2]/60 tracking-widest font-semibold">Direct Desk Hotline</h4>
                  <p className="text-stone-100 font-mono font-bold text-sm tracking-wide mt-0.5">
                    +91 {SPA_CONFIG.contactNumber}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">We support calls & active WhatsApp queries. Pre-bookings recommended.</p>
                </div>
              </div>

              <div className="border-t border-[#8C7355]/20 pt-3.5 flex gap-2">
                <a
                  id="about-call-btn"
                  href={`tel:+91${SPA_CONFIG.contactNumber}`}
                  className="flex-1 text-center py-2.5 bg-[#4F4337] hover:bg-[#3D342B] text-white font-semibold rounded-full text-[11px] uppercase tracking-wider transition border border-[#8C7355]/25"
                >
                  Call Reception
                </a>
                <a
                  id="about-whatsapp-btn"
                  href={SPA_CONFIG.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
