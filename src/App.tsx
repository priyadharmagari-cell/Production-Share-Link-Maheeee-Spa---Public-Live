import React, { useState, useEffect } from 'react';
import { 
  Flower, 
  MapPin, 
  Phone, 
  Clock, 
  Compass, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Activity, 
  MessageSquare,
  BookmarkCheck,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { THERAPIES, SPA_CONFIG } from './data/catalog';
import { Booking } from './types';
import { safeCopyToClipboard } from './utils/clipboard';
import Services from './components/Services';
import BookingWizard from './components/BookingWizard';
import InteractiveAbout from './components/InteractiveAbout';
import MyBookings from './components/MyBookings';
import { PrimeSpaBanner } from './components/PrimeSpaBanner';
import Locations from './components/Locations';

export default function App() {
  // Navigation: 'catalog' | 'book' | 'bookings' | 'sanctuary' | 'locations'
  const [activeTab, setActiveTab] = useState<'catalog' | 'book' | 'bookings' | 'sanctuary' | 'locations'>('catalog');
  
  // Selected branch of booking
  const [preSelectedBranch, setPreSelectedBranch] = useState<string | null>(null);

  // Selected therapy state when booked from the catalog
  const [preSelectedTherapyId, setPreSelectedTherapyId] = useState<string | null>(null);

  // Storage updates trigger state
  const [bookingChangeId, setBookingChangeId] = useState<number>(0);
  const [activeBookingsCount, setActiveBookingsCount] = useState<number>(0);

  // Toast confirmation notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Help portal states
  const [copiedDevUrl, setCopiedDevUrl] = useState(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);
  const [showHelperPortal, setShowHelperPortal] = useState(true);

  useEffect(() => {
    updateBookingsCount();
  }, [bookingChangeId]);

  const updateBookingsCount = () => {
    try {
      const dataStr = localStorage.getItem('maheeee_spa_bookings');
      if (dataStr) {
        const parsed = JSON.parse(dataStr) as Booking[];
        const active = parsed.filter(b => b.status === 'confirmed');
        setActiveBookingsCount(active.length);
      } else {
        setActiveBookingsCount(0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookingChangeId(prev => prev + 1);
    setToastMessage(`Your wellness slot for ${newBooking.timeSlot} has been successfully registered!`);
    
    // Automatically fade out toast
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);

    // Swap tab to bookings to let them see their voucher card
    setActiveTab('bookings');
  };

  const handleSelectTherapyToBook = (therapyId: string) => {
    setPreSelectedTherapyId(therapyId);
    setPreSelectedBranch(null);
    setActiveTab('book');
  };

  const handleCreateNewBookingDirectly = () => {
    setPreSelectedTherapyId(null);
    setPreSelectedBranch(null);
    setActiveTab('book');
  };

  return (
    <div id="spa-app-root" className="min-h-screen bg-[#FAF7F2]/80 text-[#2C2C2C] selection:bg-[#F2EBE1] selection:text-[#8C7355] pb-20">
      
      {/* Dynamic Slide-in Toast Notification */}
      {toastMessage && (
        <div 
          id="toast-notification-banner" 
          className="fixed top-5 right-5 z-50 max-w-sm bg-[#3D342B] text-white p-4 rounded-xl shadow-2xl border border-[#8C7355]/30 flex items-start gap-3 animate-slideIn"
        >
          <CheckCircle2 className="text-[#8C7355] w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[#8C7355]">Appointment Registered</h4>
            <p className="text-[#FAF7F2]/90 mt-1">{toastMessage}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-[#FAF7F2]/60 hover:text-white font-mono text-sm leading-none ml-auto"
          >
            ✕
          </button>
        </div>
      )}

      {/* Luxury Utility Top Rail */}
      <div className="bg-[#3D342B] text-[#FAF7F2]/90 text-[10px] md:text-xs py-2 px-4 border-b border-[#8C7355]/20 font-sans">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#FAF7F2]/70">
              <MapPin className="w-3.5 h-3.5 text-[#8C7355]" />
              Opp. Google Office Gate, Kondapur, Hyderabad
            </span>
            <span className="hidden sm:inline-block text-[#8C7355]/40">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-[#FAF7F2]/70">
              <Clock className="w-3.5 h-3.5 text-[#8C7355]" />
              10:00 AM – 10:00 PM (Daily)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#FAF7F2]/70">Hotline:</span>
            <a 
              href={`tel:+91${SPA_CONFIG.contactNumber}`} 
              className="font-mono text-white font-bold hover:text-[#8C7355] transition"
            >
              +91 {SPA_CONFIG.contactNumber}
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Helper & Live Link Portal */}
      {showHelperPortal && (
        <div 
          id="github-live-link-portal" 
          className="bg-gradient-to-r from-[#FAF7F2] via-[#EAE2D8]/30 to-[#FAF7F2] border-b border-[#8C7355]/25 px-4 py-3 text-xs text-[#3D342B] font-sans"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 select-text">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#8C7355] text-white text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
                  PORTAL / గమనిక
                </span>
                <span className="font-serif font-bold text-[#3D342B]">
                  Maheeee Spa - Public Live & GitHub Deployment Helper
                </span>
              </div>
              <p className="text-[#5C544B] leading-normal text-[11px]">
                <strong>English:</strong> Direct external links (WhatsApp / Calls) may be blocked by sandboxed frames. Please click <span className="font-semibold text-[#8C7355]">"Open in New Tab"</span> or use our <strong>"Copy Msg"</strong> options. 
                To deploy directly to GitHub, go to the top Settings menu ⚙️ in AI Studio &rarr; Click <strong>"Export"</strong> &rarr; Choose <strong>"Connect GitHub"</strong> or <strong>"Export ZIP"</strong>.
              </p>
              <p className="text-[#8C7355] leading-normal text-[10px] italic">
                <strong>తెలుగు:</strong> క్రాష్ లేదా లింకుల బ్లాక్ లేకుండా ఉండటానికి పైన ఉన్న <span className="font-bold underline">"Open in New Tab"</span> క్లిక్ చేయండి. 
                గిట్‌హబ్‌కు కోడ్‌ను నేరుగా లైవ్ చేయడానికి, ఎడిటర్ పైన ఉన్న ⚙️ Settings &rarr; <strong className="underline">"Export"</strong> క్లిక్ చేసి <strong>"Connect GitHub"</strong> లేదా <strong>"Export ZIP"</strong> ను ఉపయోగించండి!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Copy Shared App Link */}
              <button
                onClick={() => {
                  safeCopyToClipboard("https://ais-pre-klkuksboktkg2b7tuhrqbg-490021625183.asia-southeast1.run.app").then(() => {
                    setCopiedShareUrl(true);
                    setTimeout(() => setCopiedShareUrl(false), 3000);
                  });
                }}
                className="flex-1 md:flex-initial bg-white hover:bg-stone-50 border border-[#8C7355]/40 text-[#3D342B] py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition"
              >
                <Copy className="w-3.5 h-3.5 text-[#8C7355]" />
                {copiedShareUrl ? 'Copied Public Link! ✅' : 'Copy Public Live Link'}
              </button>

              {/* Development sandbox launcher */}
              <a
                href="https://ais-pre-klkuksboktkg2b7tuhrqbg-490021625183.asia-southeast1.run.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial bg-[#8C7355] hover:bg-[#735E46] text-white py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Live Spa Site
              </a>

              <button
                onClick={() => setShowHelperPortal(false)}
                className="text-stone-400 hover:text-[#3D342B] font-mono text-sm px-2 transition"
                title="Dismiss Portal"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Luxury Header Navigation */}
      <header className="bg-white border-b border-[#EAE2D8] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex justify-between items-center">
          
          {/* Logo with clean typography */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#8C7355] text-white rounded-full flex items-center justify-center border border-[#8C7355]/20 shadow-inner">
              <Flower className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg md:text-xl font-bold text-[#3D342B] uppercase tracking-widest leading-none">
                {SPA_CONFIG.branchName}
              </h1>
              <span className="text-[9px] uppercase tracking-widest text-[#8C7355] font-bold block mt-0.5 font-sans leading-none">
                Kondapur, Hyderabad
              </span>
            </div>
          </div>

          {/* Desktop Navigation Link Tabs */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              id="nav-catalog-btn"
              onClick={() => setActiveTab('catalog')}
              className={`text-xs uppercase tracking-widest font-bold font-sans transition ${
                activeTab === 'catalog' ? 'text-[#8C7355] border-b border-[#8C7355] pb-1' : 'text-[#8E867C] hover:text-[#3D342B]'
              }`}
            >
              Therapies Menu
            </button>
            <button
              id="nav-book-btn"
              onClick={() => setActiveTab('book')}
              className={`text-xs uppercase tracking-widest font-bold font-sans transition ${
                activeTab === 'book' ? 'text-[#8C7355] border-b border-[#8C7355] pb-1' : 'text-[#8E867C] hover:text-[#3D342B]'
              }`}
            >
              Book Schedulers
            </button>
            <button
              id="nav-bookings-btn"
              onClick={() => setActiveTab('bookings')}
              className={`text-xs uppercase tracking-widest font-bold font-sans transition flex items-center gap-1.5 ${
                activeTab === 'bookings' ? 'text-[#8C7355] border-b border-[#8C7355] pb-1' : 'text-[#8E867C] hover:text-[#3D342B]'
              }`}
            >
              My Bookings
              {activeBookingsCount > 0 && (
                <span className="bg-[#8C7355] text-white font-mono text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {activeBookingsCount}
                </span>
              )}
            </button>
            <button
              id="nav-sanctuary-btn"
              onClick={() => setActiveTab('sanctuary')}
              className={`text-xs uppercase tracking-widest font-bold font-sans transition ${
                activeTab === 'sanctuary' ? 'text-[#8C7355] border-b border-[#8C7355] pb-1' : 'text-[#8E867C] hover:text-[#3D342B]'
              }`}
            >
              Our Sanctuary
            </button>
            <button
              id="nav-locations-btn"
              onClick={() => setActiveTab('locations')}
              className={`text-xs uppercase tracking-widest font-bold font-sans transition ${
                activeTab === 'locations' ? 'text-[#8C7355] border-b border-[#8C7355] pb-1' : 'text-[#8E867C] hover:text-[#3D342B]'
              }`}
            >
              Our Branches
            </button>
          </nav>

          {/* Direct Reserve Trigger Button */}
          <button
            id="header-reserve-btn"
            onClick={() => setActiveTab('catalog')}
            className="bg-[#8C7355] hover:bg-[#735E46] text-white text-[10px] md:text-xs px-6 py-2.5 rounded-full uppercase tracking-widest font-medium transition shadow"
          >
            Book Now
          </button>
        </div>
      </header>

      {/* Luxury Hero Showcase Section */}
      <section className="bg-gradient-to-br from-[#FAF7F2] via-[#F5ECE2] to-[#ECE1CE] border-b border-[#EAE2D8] text-[#3D342B] py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Colorful glowing spa background gradient elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-200/40 blur-3xl rounded-full pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-rose-200/20 blur-3xl rounded-full pointer-events-none"></div>

        {/* Subtle background abstract elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-serif text-[#EAE2D8] opacity-45 select-none leading-none pointer-events-none tracking-widest uppercase">Luxury</div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 animate-fadeIn">
          <Flower className="text-[#8C7355] w-10 h-10 mx-auto opacity-80" />
          
          <p className="text-[#8C7355] font-serif text-xs md:text-sm tracking-widest uppercase italic font-bold">
            {SPA_CONFIG.tagline}
          </p>
          
          <h2 className="font-serif text-4xl md:text-6xl uppercase tracking-widest leading-tight text-[#3D342B] font-bold">
            Maheeee Wellness Spa
          </h2>
          
          <p className="text-[#5C544B] text-xs md:text-sm font-sans max-w-2xl mx-auto leading-relaxed">
            Kondapur's newest modern therapeutic day retreat has open its gates. Presenting a flawless marriage of classical Ayurvedic science and clinical somatic massage arts designed to dissolve modern stress, sensory fatigue, and physical stiff.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="hero-book-btn"
              onClick={handleCreateNewBookingDirectly}
              className="w-full sm:w-auto bg-[#8C7355] hover:bg-[#735E46] text-white font-medium uppercase tracking-widest text-xs py-3.5 px-8 rounded-full transition duration-200 shadow shadow-[#8C7355]/20"
            >
              Reserve Wellness Slot
            </button>
            <button
              id="hero-services-btn"
              onClick={() => setActiveTab('catalog')}
              className="w-full sm:w-auto bg-white hover:bg-[#FAF7F2] border border-[#EAE2D8] text-[#3D342B] font-medium uppercase tracking-widest text-xs py-3.5 px-8 rounded-full transition duration-200"
            >
              Browse Therapy Menu
            </button>
          </div>
        </div>
      </section>

      {/* Real-time Status Board / Informational Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-20">
        <div className="bg-white border-2 border-[#EAE2D8]/60 rounded-2xl p-4 md:p-6 shadow-md grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-[1.02] duration-200">
            <Users className="text-indigo-600 w-5 h-5 mb-1.5" />
            <h4 className="text-[10px] text-indigo-700 uppercase tracking-widest font-sans font-bold">Therapist Staffing</h4>
            <p className="font-serif text-sm text-indigo-950 font-bold mt-0.5">5 Masters Online</p>
            <p className="text-[9px] text-indigo-500 leading-none mt-1 font-medium">Both genders available</p>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-[1.02] duration-200">
            <ShieldCheck className="text-emerald-600 w-5 h-5 mb-1.5" />
            <h4 className="text-[10px] text-emerald-700 uppercase tracking-widest font-sans font-bold">Sanitation Clear</h4>
            <p className="font-serif text-sm text-emerald-950 font-bold mt-0.5">6-Point ISO Cleared</p>
            <p className="text-[9px] text-emerald-600 leading-none mt-1 font-medium">100% Autoclave standard</p>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-150 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-[1.02] duration-200">
            <Activity className="text-amber-600 w-5 h-5 mb-1.5" />
            <h4 className="text-[10px] text-amber-800 uppercase tracking-widest font-sans font-bold">Scheduler Capacity</h4>
            <p className="font-serif text-sm text-amber-950 font-bold mt-0.5">Real-time Slot Hold</p>
            <p className="text-[9px] text-amber-600 leading-none mt-1 font-medium">14-day booking map online</p>
          </div>

          <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-[1.02] duration-200">
            <Compass className="text-rose-600 w-5 h-5 mb-1.5" />
            <h4 className="text-[10px] text-rose-800 uppercase tracking-widest font-sans font-bold">Sanctuary Landmark</h4>
            <p className="font-serif text-sm text-rose-950 font-bold mt-0.5">Opposite Google Gate</p>
            <p className="text-[9px] text-rose-500 leading-none mt-1 font-medium">Easy parking & valet</p>
          </div>

        </div>
      </section>

      {/* Main Container Work Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
        
        {/* Premium Spa Image Billboard Showcase - Prime Look */}
        <PrimeSpaBanner onBookTrigger={handleCreateNewBookingDirectly} />
        
        {/* Interactive Secondary Tab Navigation on Mobile (so navigation is effortless) */}
        <div className="flex md:hidden bg-[#F2EBE1]/85 rounded-full p-1.5 mb-8 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 text-center py-2 px-2 rounded-full font-sans text-[10px] uppercase font-bold tracking-wider transition ${
              activeTab === 'catalog' ? 'bg-[#8C7355] text-white' : 'text-[#5C544B]'
            }`}
          >
            Therapies
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={`flex-1 text-center py-2 px-2 rounded-full font-sans text-[10px] uppercase font-bold tracking-wider transition ${
              activeTab === 'book' ? 'bg-[#8C7355] text-white' : 'text-[#5C544B]'
            }`}
          >
            Reserve
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 text-center py-2 px-2 rounded-full font-sans text-[10px] uppercase font-bold tracking-wider transition relative ${
              activeTab === 'bookings' ? 'bg-[#8C7355] text-white' : 'text-[#5C544B]'
            }`}
          >
            Bookings
            {activeBookingsCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#8C7355] text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center font-bold">
                {activeBookingsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sanctuary')}
            className={`flex-1 text-center py-2 px-2 rounded-full font-sans text-[10px] uppercase font-bold tracking-wider transition ${
              activeTab === 'sanctuary' ? 'bg-[#8C7355] text-white' : 'text-[#5C544B]'
            }`}
          >
            Sanctuary
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex-1 text-center py-2 px-2 rounded-full font-sans text-[10px] uppercase font-bold tracking-wider transition ${
              activeTab === 'locations' ? 'bg-[#8C7355] text-white' : 'text-[#5C544B]'
            }`}
          >
            Branches
          </button>
        </div>

        {/* Render Tab Contents */}
        <div id="dynamic-tab-renderer" className="space-y-12">
          
          {/* TAB 1: Therapies Catalog */}
          {activeTab === 'catalog' && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold font-sans">Restorative Offerings</span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#3D342B] uppercase tracking-widest mt-1">Curated Therapies Menu</h3>
                <p className="text-[#5C544B] text-xs md:text-sm mt-2 leading-relaxed">
                  Every treatment has been designed by Ayurvedic practitioners, utilizing natural, locally sourced botanicals and specific therapeutic touch protocols.
                </p>
              </div>

              <Services onSelectTherapyToBook={handleSelectTherapyToBook} />
            </div>
          )}

          {/* TAB 2: Live Schedulers / Appointment Wizard */}
          {activeTab === 'book' && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold font-sans">Slot Locker</span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#3D342B] uppercase tracking-widest mt-1">Live Online Schedulers</h3>
                <p className="text-[#5C544B] text-xs md:text-sm mt-2 leading-relaxed">
                  Configure your healing hour with total customizability. No prepayments. Pay directly at our Kondapur desk post-therapy.
                </p>
              </div>

              <BookingWizard 
                onBookingSuccess={handleBookingSuccess} 
                preSelectedTherapyId={preSelectedTherapyId}
                preSelectedBranchName={preSelectedBranch}
                onClose={() => setActiveTab('catalog')}
              />
            </div>
          )}

          {/* TAB 3: Guest Bookings Manager */}
          {activeTab === 'bookings' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold font-sans font-mono block">Durable Guest Registry</span>
                <p className="text-[#5C544B] text-xs md:text-sm mt-2 leading-relaxed">
                  Your browser keeps track of bookings on local-cache storage systems. Changes made here seamlessly re-balance the spa capacity.
                </p>
              </div>

              <MyBookings 
                onAddBookingTrigger={() => setActiveTab('book')} 
                changeId={bookingChangeId}
                onBookingChange={() => setBookingChangeId(prev => prev + 1)}
              />
            </div>
          )}

          {/* TAB 4: Sanctuary & Hygiene details */}
          {activeTab === 'sanctuary' && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold font-sans font-medium">Our space</span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#3D342B] uppercase tracking-widest mt-1">Step Inside Maheeee</h3>
                <p className="text-[#5C544B] text-xs md:text-sm mt-2 leading-relaxed">
                  Explore our premium facilities and sanitation metrics located opposite the google office gate.
                </p>
              </div>

              <InteractiveAbout />
            </div>
          )}

          {/* TAB 5: Our Locations / Cities Branches */}
          {activeTab === 'locations' && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto animate-fadeIn">
                <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold font-sans">Cities footprint</span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#3D342B] uppercase tracking-widest mt-1">Our Registered Branches</h3>
                <p className="text-[#5C544B] text-xs md:text-sm mt-2 leading-relaxed">
                  Now active in 2 key hubs across Telangana. Visit us in person or book a real-time slot online.
                </p>
              </div>

              <Locations 
                onBookAtBranch={(cityName) => {
                  setPreSelectedBranch(cityName);
                  setPreSelectedTherapyId(null);
                  setActiveTab('book');
                }} 
              />
            </div>
          )}

        </div>
      </main>

      {/* Luxury Curated Reviews Slider/Display */}
      <section className="bg-white border-t border-b border-[#EAE2D8] py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold font-sans">Guest Testimonials</span>
            <h3 className="font-serif text-2xl text-[#3D342B] uppercase tracking-widest mt-1 font-bold">The Senses of Calm</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { text: "Absolute heaven. The premium Swedish treatment here in Kondapur completely dissolved my severe stiff shoulders from long desk hours. Cleanest, highly sanitary spa suites I have ever seen in Hyderabad.", user: "Priya D., Google Tech Lead" },
              { text: "Potli Massage here is exceptional. The medicated oils customized for my Ayurvedic Abhyanga were so soothing. Incredible attention to privacy, hygiene protocols, and elite treatment quality.", user: "Karthik R., Director of Product" },
              { text: "Extremely professional. Loved the real-time slot scheduling — no calling back and forth. The Volcanic stones addon is worth every rupee. Walked in and was greeted with Saffron tea.", user: "Preethi S., Wellness Writer" }
            ].map((rev, idx) => (
              <div key={idx} className="bg-white p-6 border border-[#EAE2D8] rounded-2xl space-y-4 shadow-sm hover:shadow-md transition">
                <div className="flex text-[#8C7355] font-mono text-xs">★★★★★</div>
                <p className="text-[#3D342B] text-xs font-sans leading-relaxed">{rev.text}</p>
                <div className="border-t border-[#EAE2D8]/50 pt-3 flex justify-between items-center">
                  <span className="text-[10px] text-[#8E867C] uppercase font-sans tracking-wide">{rev.user}</span>
                  <span className="text-[9px] bg-[#FAF7F2] text-[#8C7355] border border-[#EAE2D8] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Area */}
      <footer className="bg-[#3D342B] text-[#FAF7F2]/90 py-12 px-4 border-t border-[#8C7355]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flower className="text-[#8C7355] w-5 h-5" />
              <h4 className="font-serif text-md tracking-wider uppercase text-white font-bold">{SPA_CONFIG.branchName}</h4>
            </div>
            <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-sans">
              Kondapur's premier luxury wellness day retreat. Crafting physical recovery and mental serenity utilizing high-grade botanical oils, Ayurvedic scriptures, and sterilizations.
            </p>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <h4 className="font-serif text-white uppercase tracking-wider text-xs font-semibold">Quick Navigation</h4>
            <ul className="space-y-2 text-[#FAF7F2]/75">
              <li><button onClick={() => setActiveTab('catalog')} className="hover:text-[#8C7355] transition font-medium">Curated Therapy Menu</button></li>
              <li><button onClick={() => setActiveTab('book')} className="hover:text-[#8C7355] transition font-medium">Online Schedulers</button></li>
              <li><button onClick={() => setActiveTab('bookings')} className="hover:text-[#8C7355] transition font-medium">Track Reservations</button></li>
              <li><button onClick={() => setActiveTab('sanctuary')} className="hover:text-[#8C7355] transition font-medium">Our Hygiene Regulations</button></li>
              <li><button onClick={() => setActiveTab('locations')} className="hover:text-[#8C7355] transition font-medium">Hyderabad & Zaheerabad Branches</button></li>
            </ul>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <h4 className="font-serif text-white uppercase tracking-wider text-xs font-semibold">Timing & Operations</h4>
            <p className="text-[#FAF7F2]/75 leading-relaxed">
              Open Daily:<br />
              <strong>10:00 AM – 10:00 PM</strong><br />
              Settle desk payments inside our Kondapur lobby after completion of service.
            </p>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <h4 className="font-serif text-[#8C7355] uppercase tracking-wider text-xs font-bold">Hotline Reservations</h4>
            <p className="text-[#FAF7F2]/75 leading-relaxed">
              Call our Desk directly for custom group bookings, corporate therapy retreats, couples suites, or voice reservations:
            </p>
            <p className="font-mono text-white text-base font-bold tracking-wide">
              +91 {SPA_CONFIG.contactNumber}
            </p>
            <div className="pt-2 flex gap-2">
              <a 
                href={SPA_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#8C7355] hover:bg-[#735E46] text-white text-[10px] md:text-xs py-2 px-5 rounded-full font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Live Settle
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-[#FAF7F2]/10 mt-10 pt-6 text-center text-[10px] text-[#FAF7F2]/60 flex flex-wrap justify-between items-center gap-4">
          <p>© 2026 Maheeee Wellness Spa, Hyderabad Branch. All Rights Reserved. Fully Certified & Licensed.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#8C7355] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#8C7355] cursor-pointer">Sanitation Standards</span>
            <span className="hover:text-[#8C7355] cursor-pointer">Terms of Care</span>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Concierge Banner (For Mobile quick tap triggers) */}
      <div className="fixed bottom-0 inset-x-0 bg-[#3D342B] text-white border-t border-[#8C7355]/20 py-3.5 px-4 z-30 shadow-2xl flex md:hidden justify-between items-center animate-fadeIn">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <div className="font-sans">
            <p className="text-[9px] text-[#FAF7F2]/60 leading-none uppercase tracking-wider font-semibold">Desk Open</p>
            <p className="text-xs font-mono font-bold tracking-wider mt-0.5 text-stone-200">+91 {SPA_CONFIG.contactNumber}</p>
          </div>
        </div>
        <div className="flex gap-2 font-sans">
          <button 
            onClick={() => setActiveTab('book')}
            className="bg-[#8C7355] hover:bg-[#735E46] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition duration-155"
          >
            Reserve Slot
          </button>
          <a
            href={SPA_CONFIG.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full flex items-center justify-center gap-1 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </a>
        </div>
      </div>

    </div>
  );
}
