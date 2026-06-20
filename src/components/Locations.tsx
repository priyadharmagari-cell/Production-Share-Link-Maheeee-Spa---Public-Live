import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Compass, 
  Sparkles, 
  Users, 
  Flame, 
  ShieldCheck, 
  MessageSquare,
  BookmarkCheck,
  CheckCircle2,
  CalendarDays,
  Activity,
  Award,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { safeCopyToClipboard } from '../utils/clipboard';

interface LocationInfo {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  whatsappText: string;
  whatsappLink: string;
  timing: string;
  suitesCount: number;
  therapistsOnline: number;
  uniqueness: string;
  mapEmbedUrl: string;
  directionsUrl: string;
  landmark: string;
  features: { icon: any; title: string; desc: string }[];
  accentColor: string;
  rating: string;
}

interface LocationsProps {
  onBookAtBranch: (cityName: string) => void;
}

export default function Locations({ onBookAtBranch }: LocationsProps) {
  const [selectedCity, setSelectedCity] = useState<'all' | 'hyderabad' | 'zaheerabad'>('all');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const branches: LocationInfo[] = [
    {
      id: 'hyderabad',
      city: 'Hyderabad',
      name: 'Maheeee Wellness Spa – Hyderabad (Kondapur)',
      address: '3rd Floor, Golden Heights, Opp. Google Office Main Gate, Silpa Layout Rd, Kondapur, Hyderabad, Telangana 500084',
      phone: '8328139956',
      whatsappText: 'Hi Maheeee Hyderabad, I would like to inquire about a luxury booking.',
      whatsappLink: 'https://wa.me/918328139956?text=Hi%20Maheeee%20Hyderabad,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20booking.',
      timing: '10:00 AM – 10:00 PM (Daily)',
      suitesCount: 5,
      therapistsOnline: 5,
      uniqueness: 'Our Premium Silicon Hub Retreat featuring Private Couples Steam Suites and high-grade Ayurvedic Shirodhara Rigs.',
      mapEmbedUrl: 'https://g.co/kgs/C8Q7W8',
      directionsUrl: 'https://g.co/kgs/C8Q7W8',
      landmark: 'Directly opposite to the landmark Google Office Gate #2, Silpa Layout Road',
      accentColor: 'rose',
      rating: '4.9 ★ (460+ Reviews)',
      features: [
        { icon: Sparkles, title: 'Shirodhara Rig', desc: 'Accurate medicinal wooden tables crafted directly in Kerala.' },
        { icon: Users, title: '5 Master Therapists', desc: 'Expert practitioners with male & female therapists available.' },
        { icon: Flame, title: 'Couples Steam', desc: 'Private steam chambers containing botanical essential oil vapors.' },
        { icon: ShieldCheck, title: 'ISO 6 Standard', desc: '100% Autoclaved tools and premium disinfected linen.' },
      ]
    },
    {
      id: 'zaheerabad',
      city: 'Zaheerabad',
      name: 'Maheeee Wellness Spa – Zaheerabad Branch',
      address: 'Near Old Bypass Road, Beside HDFC Bank ATM, Zaheerabad, Sangareddy District, Telangana 502220',
      phone: '9182374921',
      whatsappText: 'Hi Maheeee Zaheerabad, I would like to inquire about a wellness booking.',
      whatsappLink: 'https://wa.me/919182374921?text=Hi%20Maheeee%20Zaheerabad,%20I%20would%20like%20to%20inquire%20about%20a%20wellness%20booking.',
      timing: '10:00 AM – 09:30 PM (Daily)',
      suitesCount: 4,
      therapistsOnline: 4,
      uniqueness: 'A serene sanctuary in Sangareddy district providing organic local herbs distillation and traditional warm-pouches Potli therapy.',
      mapEmbedUrl: 'https://maps.google.com/?q=Zaheerabad+Telangana',
      directionsUrl: 'https://maps.google.com/?q=Near+Old+Bypass+Road,+Beside+HDFC+ATM,+Zaheerabad,+Telangana',
      landmark: 'Right adjacent to the HDFC ATM on Main Bypass Road, easy parking access',
      accentColor: 'indigo',
      rating: '4.8 ★ (180+ Reviews)',
      features: [
        { icon: Sparkles, title: 'Herbal Garden Deck', desc: 'Directly sourced fresh local botanical compress leaves.' },
        { icon: Users, title: '4 Experienced Gurus', desc: 'Specialized in authentic Abhyanga & joint restructuring.' },
        { icon: Flame, title: 'Authentic Potli Settle', desc: 'Pouches filled with Himalayan pink salt and organic herbs.' },
        { icon: ShieldCheck, title: 'Pristine Sanitation', desc: 'Complete high-pressure sanitization check before every slot.' },
      ]
    }
  ];

  const handleCopyAddress = (address: string, id: string) => {
    safeCopyToClipboard(address).then(() => {
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2500);
    });
  };

  const filteredBranches = selectedCity === 'all' 
    ? branches 
    : branches.filter(b => b.id === selectedCity);

  return (
    <div id="locations-container" className="space-y-8 animate-fadeIn text-[#3D342B] font-sans">
      
      {/* Banner introduction card with glowing items */}
      <div className="relative bg-[#3D342B] text-white p-6 md:p-8 rounded-3xl border border-[#8C7355]/30 overflow-hidden shadow-lg">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#8C7355]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#8C7355]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-1.5 text-[#8C7355] font-serif text-[10px] md:text-xs font-black uppercase tracking-widest">
            <Compass className="w-5 h-5" />
            Empowering Relaxation Across Telangana
          </div>
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-widest font-extrabold leading-tight">
            Our Cities & Specialized Branches
          </h2>
          <p className="text-stone-300 text-xs md:text-sm leading-relaxed font-sans max-w-xl">
            Whether inside the high-tech heart of corporate Hyderabad or in the peaceful expanses of Zaheerabad, Maheeee Wellness Spa delivers the exact elite standard of organic restoration, privacy, and clinical hygiene.
          </p>
        </div>
      </div>

      {/* Filter Tabs to sort / focus */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-[#F2EBE1]/70 rounded-full max-w-sm mx-auto border border-[#EAE2D8]">
        <button
          onClick={() => setSelectedCity('all')}
          className={`flex-1 py-2 px-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition ${
            selectedCity === 'all' 
              ? 'bg-[#8C7355] text-white shadow' 
              : 'text-[#5C544B] hover:text-[#3D342B]'
          }`}
        >
          All Branches
        </button>
        <button
          onClick={() => setSelectedCity('hyderabad')}
          className={`flex-1 py-2 px-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition ${
            selectedCity === 'hyderabad' 
              ? 'bg-[#8C7355] text-white shadow' 
              : 'text-[#5C544B] hover:text-[#3D342B]'
          }`}
        >
          Hyderabad
        </button>
        <button
          onClick={() => setSelectedCity('zaheerabad')}
          className={`flex-1 py-2 px-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition ${
            selectedCity === 'zaheerabad' 
              ? 'bg-[#8C7355] text-white shadow' 
              : 'text-[#5C544B] hover:text-[#3D342B]'
          }`}
        >
          Zaheerabad
        </button>
      </div>

      {/* Branch Cards Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredBranches.map((branch) => (
          <div 
            key={branch.id} 
            id={`branch-card-${branch.id}`}
            className="bg-white border-2 border-[#EAE2D8]/70 hover:border-[#8C7355]/50 transition-all duration-300 rounded-3xl p-6 shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="space-y-5">
              
              {/* Branch Header label */}
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF7F2] text-[#8C7355] border border-[#EAE2D8] px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                      {branch.city} Branch
                    </span>
                    <span className="text-[10px] text-[#8E867C] font-semibold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {branch.rating}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg md:text-xl text-[#3D342B] font-extrabold uppercase tracking-wider mt-2">
                    {branch.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-xl text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Slot Opening Alive
                </div>
              </div>

              {/* Descriptive Blurb */}
              <p className="text-xs text-[#5C544B] leading-relaxed font-sans italic border-l-2 border-[#8C7355]/40 pl-3">
                "{branch.uniqueness}"
              </p>

              {/* Live Status Indicators */}
              <div className="grid grid-cols-2 gap-3.5 bg-[#FAF7F2]/60 p-3.5 rounded-2xl border border-[#EAE2D8]/45">
                <div className="text-left">
                  <span className="text-[8px] text-[#8E867C] uppercase font-bold tracking-widest block">Available Suites</span>
                  <span className="font-serif text-sm font-bold text-[#3D342B]">{branch.suitesCount} Healing Chambers</span>
                </div>
                <div className="text-left">
                  <span className="text-[8px] text-[#8E867C] uppercase font-bold tracking-widest block">Active Experts</span>
                  <span className="font-serif text-sm font-bold text-[#3D342B]">{branch.therapistsOnline} Therapists Online</span>
                </div>
              </div>

              {/* Crucial Contact & Location Info */}
              <div className="space-y-3 pt-1">
                
                {/* Address details */}
                <div className="flex items-start gap-2.5 text-xs text-[#3D342B]">
                  <MapPin className="text-[#8C7355] w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-stone-900 leading-snug">{branch.address}</p>
                    <p className="text-[10px] text-[#8E867C] font-sans">
                      <strong className="text-stone-700">Landmark:</strong> {branch.landmark}
                    </p>
                    <button
                      onClick={() => handleCopyAddress(branch.address, branch.id)}
                      className="text-[9px] text-[#8C7355] hover:text-[#735E46] font-bold uppercase tracking-wider underline block mt-1"
                    >
                      {copiedIndex === branch.id ? '✓ Address Copied!' : 'Copy Address Details'}
                    </button>
                  </div>
                </div>

                {/* Operations Time */}
                <div className="flex items-center gap-2.5 text-xs text-[#3D342B]">
                  <Clock className="text-[#8C7355] w-4 h-4 flex-shrink-0" />
                  <p className="font-semibold text-stone-900 leading-snug">
                    Timing: <span className="font-mono text-[11px] font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-amber-800">{branch.timing}</span>
                  </p>
                </div>

                {/* Direct Calling Hotline */}
                <div className="flex items-center gap-2.5 text-xs text-[#3D342B]">
                  <Phone className="text-[#8C7355] w-4 h-4 flex-shrink-0" />
                  <p className="font-medium text-stone-900">
                    Hotline Voice Desk: <a href={`tel:+91${branch.phone}`} className="font-mono font-extrabold text-[#8C7355] hover:underline">+91 {branch.phone}</a>
                  </p>
                </div>

              </div>

              {/* Specialized amenities listing */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[9px] text-[#8C7355] uppercase font-black tracking-widest block">Branch Core Amenities</span>
                <div className="grid grid-cols-2 gap-3">
                  {branch.features.map((feat, fIdx) => {
                    const FeatIcon = feat.icon;
                    return (
                      <div key={fIdx} className="p-2.5 bg-neutral-50 hover:bg-neutral-100/50 transition border border-stone-200/50 rounded-xl space-y-1 group">
                        <div className="flex items-center gap-1.5">
                          <FeatIcon className="w-3.5 h-3.5 text-[#8C7355]" />
                          <span className="text-[10px] font-extrabold text-stone-800 tracking-tight font-sans text-left">{feat.title}</span>
                        </div>
                        <p className="text-[9px] text-[#8E867C] font-sans leading-relaxed text-left">{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Action buttons footer section */}
            <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3 mt-6">
              
              <button
                onClick={() => onBookAtBranch(branch.city)}
                className="flex-1 bg-[#8C7355] hover:bg-[#735E46] text-white py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition flex items-center justify-center gap-2 shadow-xs"
              >
                <CalendarDays className="w-4 h-4" />
                Book this branch
              </button>

              <div className="flex gap-2">
                <a
                  href={branch.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition flex items-center justify-center gap-1.5 text-xs font-bold font-sans"
                  title="WhatsApp Enquiry"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="sm:inline hidden uppercase tracking-wider text-[10px]">Chat</span>
                </a>

                <a
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3D342B] hover:bg-stone-800 text-white p-3 rounded-xl transition flex items-center justify-center gap-1.5 text-xs font-bold"
                  title="View Directions on Maps"
                >
                  <Navigation className="w-4 h-4" />
                  <span className="sm:inline hidden uppercase tracking-wider text-[10px]">Maps</span>
                </a>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Corporate packages promo at bottom */}
      <div className="p-6 bg-[#FAF7F2] border border-[#EAE2D8] rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2 text-left">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-[#8C7355] text-[9px] font-bold uppercase tracking-wider">
            Premium Elite Membership
          </span>
          <h4 className="font-serif text-base text-[#3D342B] font-bold uppercase tracking-widest">
            Cross-Branch Universal Validity
          </h4>
          <p className="text-xs text-[#5C544B] leading-relaxed">
            Obtain any of our restorative wellness packs and redeem credits seamlessly at either our <strong>Hyderabad Office Gate suite</strong> or our relaxed <strong>Zaheerabad Bypass lounge</strong>. Absolute flexibility across locations.
          </p>
        </div>
        <div>
          <button
            onClick={() => onBookAtBranch('Hyderabad')}
            className="w-full bg-transparent hover:bg-[#3D342B] text-[#3D342B] hover:text-white border-2 border-[#3D342B] py-2.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition duration-155"
          >
            Inquire About Terms
          </button>
        </div>
      </div>

    </div>
  );
}
