import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  ShieldCheck, 
  Flower, 
  CheckCircle2, 
  MapPin,
  Copy,
  QrCode,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { THERAPIES, ADDONS, SPA_CONFIG } from '../data/catalog';
import { Therapy, AddOn, Booking, TimeSlotStatus } from '../types';

interface BookingWizardProps {
  onBookingSuccess: (newBooking: Booking) => void;
  preSelectedTherapyId?: string | null;
  preSelectedBranchName?: string | null;
  onClose?: () => void;
}

export default function BookingWizard({ onBookingSuccess, preSelectedTherapyId, preSelectedBranchName, onClose }: BookingWizardProps) {
  // Steps: 0 = Choose Therapy, 1 = Select Schedule & Therapist, 2 = Choose Enhancements, 3 = Guest Details, 4 = Receipt / Success
  const [step, setStep] = useState(0);
  
  // Selection States
  const [selectedBranch, setSelectedBranch] = useState<string>(
    preSelectedBranchName || 'Hyderabad'
  );
  const [selectedTherapy, setSelectedTherapy] = useState<Therapy>(
    preSelectedTherapyId 
      ? (THERAPIES.find(t => t.id === preSelectedTherapyId) || THERAPIES[0])
      : THERAPIES[0]
  );
  const [duration, setDuration] = useState<60 | 90>(60);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [therapistPref, setTherapistPref] = useState<'any' | 'male' | 'female'>('any');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  
  // Guest States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'desk' | 'upi' | 'card'>('desk');
  const [transactionId, setTransactionId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Form Error states
  const [errorField, setErrorField] = useState<string>('');
  
  // Generated Booking
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [notifiedUser, setNotifiedUser] = useState(false);
  const [notifiedAdmin, setNotifiedAdmin] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState<'idle' | 'verifying' | 'indexing' | 'finishing'>('idle');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showVoucherQr, setShowVoucherQr] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const chunked = val.match(/.{1,4}/g);
    setCardNumber(chunked ? chunked.join(' ') : '');
    setErrorField('');
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
    setErrorField('');
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.slice(0, 3);
    setCardCvv(val);
    setErrorField('');
  };

  // General dates array starting from today for the next 14 days
  const [availableDates, setAvailableDates] = useState<{ label: string; dateStr: string; dayName: string; isWeekend: boolean }[]>([]);

  useEffect(() => {
    // Generate dates
    const dates = [];
    const today = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const year = nextDate.getFullYear();
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      const day = String(nextDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      dates.push({
        label: `${nextDate.getDate()} ${months[nextDate.getMonth()]}`,
        dateStr,
        dayName: i === 0 ? 'Today' : daysOfWeek[nextDate.getDay()],
        isWeekend: nextDate.getDay() === 0 || nextDate.getDay() === 6
      });
    }
    setAvailableDates(dates);
    if (!selectedDate) {
      setSelectedDate(dates[0].dateStr);
    }
  }, []);

  // Time Slots calculations with pseudo-live capacity simulation
  const getTimeSlots = (dateStr: string): TimeSlotStatus[] => {
    const isWeekend = dateStr ? (new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6) : false;
    
    const baseSlots = [
      { time: '10:00 AM', baseCapacity: 3 },
      { time: '11:30 AM', baseCapacity: 4 },
      { time: '01:00 PM', baseCapacity: 3 },
      { time: '02:30 PM', baseCapacity: 2 },
      { time: '04:00 PM', baseCapacity: 4 },
      { time: '05:30 PM', baseCapacity: 3 },
      { time: '07:00 PM', baseCapacity: 2 },
      { time: '08:30 PM', baseCapacity: 1 }
    ];

    return baseSlots.map(slot => {
      // Weekends have fewer available slots due to high footfalls
      let count = slot.baseCapacity;
      if (isWeekend) {
        count = Math.max(0, slot.baseCapacity - 1);
      }
      
      let status: 'available' | 'medium' | 'limited' | 'full' = 'available';
      if (count === 4 || count === 3) status = 'available';
      else if (count === 2) status = 'medium';
      else if (count === 1) status = 'limited';
      else status = 'full';

      return {
        time: slot.time,
        availableTherapists: count,
        capacityStatus: status
      };
    });
  };

  const handleTherapySelect = (therapy: Therapy) => {
    setSelectedTherapy(therapy);
    if (therapy.category === 'express') {
      setDuration(60); // standard single length
    }
  };

  const handleAddOnToggle = (addon: AddOn) => {
    const exists = selectedAddOns.some(a => a.id === addon.id);
    if (exists) {
      setSelectedAddOns(selectedAddOns.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const getBasePrice = () => {
    if (duration === 90 && selectedTherapy.basePrice90) {
      return selectedTherapy.basePrice90;
    }
    return selectedTherapy.basePrice60;
  };

  const getAddOnTotal = () => {
    return selectedAddOns.reduce((sum, current) => sum + current.price, 0);
  };

  const getSubTotal = () => {
    return getBasePrice() + getAddOnTotal();
  };

  // Spa service attracts 18% GST standard in India
  const getGstTax = () => {
    return Math.round(getSubTotal() * 0.18);
  };

  const getTotalCost = () => {
    return getSubTotal() + getGstTax();
  };

  const getEstimatedDuration = () => {
    const extraTime = selectedAddOns.reduce((sum, item) => sum + item.duration, 0);
    const textBase = selectedTherapy.category === 'express' ? 45 : duration;
    return textBase + extraTime;
  };

  const handleNextStep = () => {
    setErrorField('');
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      if (!selectedTime) {
        setErrorField('timeslot');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Validate customer fields
      if (!name || name.trim().length < 3) {
        setErrorField('name');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        setErrorField('email');
        return;
      }
      const phoneRegex = /^[6-9]\d{9}$/; // Standard Indian mobile number check
      if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
        setErrorField('phone');
        return;
      }
      if (paymentMethod === 'upi' && (!transactionId || transactionId.trim().length < 6)) {
        setErrorField('transactionId');
        return;
      }
      if (paymentMethod === 'card') {
        if (!cardNumber || cardNumber.replace(/\D/g, '').length < 15) {
          setErrorField('cardNumber');
          return;
        }
        if (!cardHolder || cardHolder.trim().length < 3) {
          setErrorField('cardHolder');
          return;
        }
        if (!cardExpiry || !cardExpiry.includes('/') || cardExpiry.replace(/\D/g, '').length < 4) {
          setErrorField('cardExpiry');
          return;
        }
        if (!cardCvv || cardCvv.replace(/\D/g, '').length < 3) {
          setErrorField('cardCvv');
          return;
        }
      }

      // Live animated payment checks and ledger validation for ultra-luxury realism of transaction verification
      setIsProcessingPayment(true);
      setPaymentPhase('verifying');

      setTimeout(() => {
        setPaymentPhase('indexing');
        setTimeout(() => {
          setPaymentPhase('finishing');
          setTimeout(() => {
            // Generate actual voucher booking
            const refCode = `MAH-${Math.floor(1000 + Math.random() * 9000)}-${selectedDate.split('-').slice(1).join('')}`;
            const finalNotes = paymentMethod === 'upi'
              ? (specialRequest ? `${specialRequest} | Prepaid via UPI Reference: ${transactionId}` : `Prepaid via UPI Reference: ${transactionId}`)
              : paymentMethod === 'card'
              ? (specialRequest ? `${specialRequest} | Prepaid via Card (Holder: ${cardHolder}, Card ending under ${cardNumber.slice(-4)})` : `Prepaid via Card (Holder: ${cardHolder}, Card ending under ${cardNumber.slice(-4)})`)
              : specialRequest;

            const newBooking: Booking = {
              id: crypto.randomUUID(),
              bookingReference: refCode,
              customerName: name,
              customerEmail: email,
              customerPhone: phone,
              therapyId: selectedTherapy.id,
              therapyName: selectedTherapy.name,
              duration: selectedTherapy.category === 'express' ? 45 : duration,
              date: selectedDate,
              timeSlot: selectedTime,
              therapistGenderPref: therapistPref,
              addOns: selectedAddOns,
              totalPrice: getTotalCost(),
              status: 'confirmed',
              branch: selectedBranch,
              notes: finalNotes,
              createdAt: new Date().toISOString()
            };

            // Store in LocalStorage
            const existingBookingsStr = localStorage.getItem('maheeee_spa_bookings');
            const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
            existingBookings.push(newBooking);
            localStorage.setItem('maheeee_spa_bookings', JSON.stringify(existingBookings));

            setCreatedBooking(newBooking);
            onBookingSuccess(newBooking);
            
            // Clean states
            setIsProcessingPayment(false);
            setPaymentPhase('idle');
            setStep(4);
          }, 1100);
        }, 1100);
      }, 1200);
    }
  };

  const handleBackStep = () => {
    setErrorField('');
    setStep(step - 1);
  };

  return (
    <div id="booking-modal-wizard" className="bg-white border border-[#EAE2D8] rounded-2xl overflow-hidden shadow-xl max-w-4xl w-full mx-auto font-sans">
      {/* Visual Header */}
      <div className="bg-[#3D342B] px-6 py-8 border-b border-[#8C7355]/20 text-center relative animate-fadeIn">
        <Flower className="text-[#8C7355] mx-auto w-7 h-7 mb-1" />
        <h2 className="font-serif text-2xl text-white uppercase tracking-widest">{SPA_CONFIG.branchName}</h2>
        <p className="text-[#FAF7F2]/80 font-serif text-xs tracking-widest uppercase italic mt-1 font-light">Online Concierge Scheduler</p>
        {onClose && (
          <button 
            id="close-wizard-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#FAF7F2]/60 hover:text-white transition"
          >
            <span className="text-xl">✕</span>
          </button>
        )}

        {/* Custom Progress Bar Indicator */}
        <div className="flex justify-center mt-6 gap-2 sm:gap-4 md:gap-6 flex-wrap">
          {[
            { title: 'Selected Therapy', color: 'bg-emerald-500 shadow-emerald-500/50', textColor: 'text-emerald-400' },
            { title: 'Schedule & Masters', color: 'bg-indigo-500 shadow-indigo-500/50', textColor: 'text-indigo-400' },
            { title: 'Add-ons & Scent', color: 'bg-amber-500 shadow-amber-500/50', textColor: 'text-amber-400' },
            { title: 'Guest Dossier', color: 'bg-rose-500 shadow-rose-500/50', textColor: 'text-rose-400' },
            { title: 'Voucher Created', color: 'bg-violet-500 shadow-violet-500/50', textColor: 'text-violet-400' }
          ].map((item, idx) => {
            const isCurrent = step === idx;
            const isCompleted = step > idx;
            const bgClass = isCurrent || isCompleted ? item.color : 'bg-[#5C544B]';
            const textClass = isCurrent ? item.textColor : isCompleted ? 'text-stone-300' : 'text-[#FAF7F2]/40';

            return (
              <div key={item.title} className="flex flex-col items-center">
                <div className={`transition-all duration-500 h-2.5 rounded-full ${bgClass} ${isCurrent ? 'w-10 shadow-lg' : 'w-2.5'}`} />
                <span className={`text-[9px] font-sans tracking-widest uppercase mt-1.5 hidden md:block font-bold transition-all ${textClass}`}>
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Main interactive panel */}
        <div className="p-6 lg:p-8 lg:col-span-8 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              {/* STEP 0: Select Therapy */}
              {step === 0 && (
                <div>
                  <h3 className="font-serif text-[#3D342B] text-lg uppercase tracking-wider mb-2 flex items-center gap-2 font-bold animate-fadeIn">
                    <Sparkles className="text-[#8C7355] w-4.5 h-4.5" />
                    Step 1: Choose Your Healing Therapy
                  </h3>
                  <p className="text-xs text-[#8E867C] mb-6 font-sans">
                    Browse our curated medical and traditional restoration solutions. Select one to proceed.
                  </p>

                  <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar font-sans">
                    {THERAPIES.map((t) => (
                      <div 
                        key={t.id}
                        id={`therapy-item-${t.id}`}
                        onClick={() => handleTherapySelect(t)}
                        className={`flex gap-4 p-3.5 rounded-xl border cursor-pointer transition ${
                          selectedTherapy.id === t.id 
                            ? 'bg-[#FAF7F2] border-[#8C7355] ring-1 ring-[#8C7355]'
                            : 'bg-white border-[#EAE2D8] hover:border-[#8C7355]/40'
                        }`}
                      >
                        <img 
                          src={t.imageUrl} 
                          alt={t.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-[#EAE2D8]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-serif text-[#3D342B] text-sm font-bold tracking-wide truncate">{t.name}</h4>
                            {t.popular && (
                              <span className="text-[9px] bg-[#FAF7F2] text-[#8C7355] border border-[#EAE2D8] px-2 py-0.5 rounded-full font-sans tracking-wider uppercase font-bold">
                                Best Selling
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5C544B] line-clamp-1 mt-0.5">{t.shortDescription}</p>
                          <div className="flex gap-4 mt-1.5 items-center">
                            <span className="text-xs text-[#8E867C] font-sans flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {t.category === 'express' ? '45 Min' : '60 / 90 Min Available'}
                            </span>
                            <span className="text-[#3D342B] text-xs font-bold font-mono">
                              From ₹{t.basePrice60.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedTherapy.id === t.id ? 'bg-[#8C7355] border-[#8C7355] text-white' : 'border-stone-300'
                          }`}>
                            {selectedTherapy.id === t.id && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Therapy Details and Duration Toggle */}
                  {selectedTherapy && selectedTherapy.category !== 'express' && (
                    <div className="mt-5 p-4 bg-[#FAF7F2]/60 border border-[#EAE2D8] rounded-xl font-sans">
                      <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold">Treatment Focus Time</span>
                      <div className="flex gap-4 mt-2">
                        <button
                          id="dur-60-btn"
                          onClick={() => setDuration(60)}
                          className={`flex-1 py-2.5 px-4 rounded-full text-xs tracking-wider uppercase border transition font-mono ${
                            duration === 60 
                              ? 'bg-[#3D342B] border-[#3D342B] text-white font-bold shadow' 
                              : 'bg-white border-[#EAE2D8] text-[#5C544B] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          60 Minutes — ₹{selectedTherapy.basePrice60.toLocaleString('en-IN')}
                        </button>
                        {selectedTherapy.basePrice90 && (
                          <button
                            id="dur-90-btn"
                            onClick={() => setDuration(90)}
                            className={`flex-1 py-2.5 px-4 rounded-full text-xs tracking-wider uppercase border transition font-mono ${
                              duration === 90 
                                ? 'bg-[#3D342B] border-[#3D342B] text-white font-bold shadow' 
                                : 'bg-white border-[#EAE2D8] text-[#5C544B] hover:bg-[#FAF7F2]'
                            }`}
                          >
                            90 Minutes — ₹{selectedTherapy.basePrice90.toLocaleString('en-IN')}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 1: Select Date, Time & Therapist preference */}
              {step === 1 && (
                <div>
                  <h3 className="font-serif text-[#3D342B] text-lg uppercase tracking-wider mb-2 flex items-center gap-2 font-bold animate-fadeIn">
                    <Calendar className="text-[#8C7355] w-4.5 h-4.5" />
                    Step 2: Real-time Schedule Sync
                  </h3>
                  <p className="text-xs text-[#8E867C] mb-4 font-sans">
                    Select your date, pick an open slot, and select therapist matching preferences.
                  </p>

                  {/* Branch Selection Section */}
                  <div className="mb-5 p-4 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl text-left">
                    <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-extrabold font-sans block mb-2.5">
                      Select Spa Location Branch
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                      <div 
                        onClick={() => setSelectedBranch('Hyderabad')}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex justify-between items-center ${
                          selectedBranch === 'Hyderabad'
                            ? 'bg-white border-[#8C7355] ring-1 ring-[#8C7355] shadow-xs'
                            : 'bg-white/50 border-[#EAE2D8] hover:border-[#8C7355]/40'
                        }`}
                      >
                        <div>
                          <p className="font-serif text-[11px] font-bold tracking-wider uppercase text-[#3D342B]">Hyderabad Hub</p>
                          <p className="text-[9px] text-[#8E867C] mt-0.5 max-w-[185px] leading-tight">Opp. Google Gate, Kondapur</p>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          selectedBranch === 'Hyderabad' ? 'bg-[#8C7355] text-white border-[#8C7355]' : 'border-neutral-300'
                        }`}>
                          {selectedBranch === 'Hyderabad' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div 
                        onClick={() => setSelectedBranch('Zaheerabad')}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex justify-between items-center ${
                          selectedBranch === 'Zaheerabad'
                            ? 'bg-white border-[#8C7355] ring-1 ring-[#8C7355] shadow-xs'
                            : 'bg-white/50 border-[#EAE2D8] hover:border-[#8C7355]/40'
                        }`}
                      >
                        <div>
                          <p className="font-serif text-[11px] font-bold tracking-wider uppercase text-[#3D342B]">Zaheerabad Branch</p>
                          <p className="text-[9px] text-[#8E867C] mt-0.5 max-w-[185px] leading-tight">Near Bypass Road, Beside HDFC</p>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          selectedBranch === 'Zaheerabad' ? 'bg-[#8C7355] text-white border-[#8C7355]' : 'border-neutral-300'
                        }`}>
                          {selectedBranch === 'Zaheerabad' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Strip Component */}
                  <span className="text-[10px] uppercase tracking-widest text-[#8E867C] font-bold font-sans block mb-2">
                    Select Day of Wellness
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-3 pr-1 snap-x select-none custom-scrollbar">
                    {availableDates.map((item) => (
                      <div
                        key={item.dateStr}
                        id={`date-strip-${item.dateStr}`}
                        onClick={() => {
                          setSelectedDate(item.dateStr);
                          setSelectedTime(''); // Reset selected time
                        }}
                        className={`flex-shrink-0 w-[68px] py-2.5 rounded-xl border text-center cursor-pointer transition snap-start ${
                          selectedDate === item.dateStr
                            ? 'bg-[#8C7355] border-[#8C7355] text-white shadow shadow-[#8C7355]/15'
                            : 'bg-white border-[#EAE2D8] text-[#3D342B] hover:border-[#8C7355]/40'
                        }`}
                      >
                        <p className={`text-[10px] uppercase tracking-widest ${selectedDate === item.dateStr ? 'text-[#FAF7F2]/90' : 'text-[#8E867C]'}`}>{item.dayName}</p>
                        <p className="font-mono text-sm font-semibold mt-1">{item.label.split(' ')[0]}</p>
                        <p className={`text-[9px] font-sans ${selectedDate === item.dateStr ? 'text-[#FAF7F2]/80' : 'text-[#8E867C]/80'}`}>{item.label.split(' ')[1]}</p>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots Area */}
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold font-sans">
                        Available Live Slots & Air-Loadings
                      </span>
                      <span className="text-[10px] font-mono text-[#8E867C] flex items-center gap-1.5 leading-none font-medium">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span> Free
                        <span className="inline-block w-2 h-2 rounded-full bg-[#8C7355]"></span> Medium
                        <span className="inline-block w-2 h-2 rounded-full bg-[#735E46]"></span> Limited
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {getTimeSlots(selectedDate).map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        const isFull = slot.capacityStatus === 'full';
                        
                        return (
                          <div
                            key={slot.time}
                            id={`timeslot-${slot.time.replace(':', '').replace(' ', '')}`}
                            onClick={() => !isFull && setSelectedTime(slot.time)}
                            className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                              isFull 
                                ? 'bg-stone-50 border-[#EAE2D8]/40 text-stone-400 cursor-not-allowed opacity-40' 
                                : isSelected
                                ? 'bg-[#3D342B] border-[#3D342B] text-white ring-1 ring-[#8C7355]/30 shadow'
                                : 'bg-white border-[#EAE2D8] hover:border-[#8C7355]/40 cursor-pointer text-[#3D342B]'
                            }`}
                          >
                            <span className="font-mono text-xs font-bold tracking-wide">{slot.time}</span>
                            <span className={`text-[9px] mt-0.5 tracking-lighter font-semibold uppercase ${
                              isFull ? 'text-stone-400' :
                              slot.capacityStatus === 'available' ? 'text-emerald-600' :
                              slot.capacityStatus === 'medium' ? 'text-[#8C7355]' : 'text-[#735E46]'
                            }`}>
                              {isFull ? 'Occupied' : `${slot.availableTherapists} free`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {errorField === 'timeslot' && (
                      <p className="text-xs text-rose-600 font-sans mt-2 font-medium">Please select an available timing slot to continue.</p>
                    )}
                  </div>

                  {/* Therapist Gender Preference */}
                  <div className="mt-5 p-4 bg-[#FAF7F2]/60 border border-[#EAE2D8] rounded-xl">
                    <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold font-sans">
                      Therapist Designation Preference
                    </span>
                    <p className="text-[11px] text-[#8E867C] mt-0.5 leading-relaxed font-sans mb-3">
                      Maheeee Wellness Spa respects your boundaries. Our service complies with premium wellness hygiene and safety frameworks.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'any', label: 'First Available Professional' },
                        { id: 'female', label: 'Elite Female Therapist' },
                        { id: 'male', label: 'Elite Male Therapist' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          id={`therapist-pref-${item.id}`}
                          onClick={() => setTherapistPref(item.id as any)}
                          className={`p-2.5 rounded-full border text-xs tracking-wide transition font-sans ${
                            therapistPref === item.id
                              ? 'bg-[#3D342B] border-[#3D342B] text-white font-bold shadow'
                              : 'bg-white border-[#EAE2D8] text-[#5C544B] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Choose Enhancements (AddOns) */}
              {step === 2 && (
                <div>
                  <h3 className="font-serif text-[#3D342B] text-lg uppercase tracking-wider mb-2 flex items-center gap-2 font-bold animate-fadeIn">
                    <Sparkles className="text-[#8C7355] w-4.5 h-4.5" />
                    Step 3: Enrich Your Experience with Botanical Boosters
                  </h3>
                  <p className="text-xs text-[#8E867C] mb-6 font-sans">
                    Optionally bundle custom add-ons into your core selected therapeutic hour.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                    {ADDONS.map((addon) => {
                      const isSelected = selectedAddOns.some(a => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          id={`addon-card-${addon.id}`}
                          onClick={() => handleAddOnToggle(addon)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition select-none flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#FAF7F2] border-[#8C7355] ring-1 ring-[#8C7355]'
                              : 'bg-white border-[#EAE2D8] hover:border-[#8C7355]/40'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif text-[#3D342B] text-xs font-bold tracking-wide">{addon.name}</h4>
                              <span className="font-mono text-xs font-bold text-[#3D342B]">
                                +₹{addon.price}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#5C544B] mt-1 leading-relaxed">{addon.description}</p>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#EAE2D8]/60">
                            <span className="text-[10px] text-[#8E867C] font-mono">
                              {addon.duration > 0 ? `+${addon.duration} min duration` : 'Infused in direct session'}
                            </span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                              isSelected ? 'bg-[#8C7355] text-white' : 'bg-[#FAF7F2] text-[#8E867C]'
                            }`}>
                              {isSelected ? 'Added' : 'Add'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Guest Details Form */}
              {step === 3 && (
                isProcessingPayment ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-fadeIn font-sans">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-amber-100 border-t-[#8C7355] animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Flower className="animate-pulse text-[#8C7355] w-7 h-7" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200/50">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                        SECURE GATEWAY ENCRYPTED
                      </div>
                      
                      <h4 className="font-serif text-[#3D342B] text-lg uppercase tracking-widest font-bold">
                        {paymentPhase === 'verifying' && 'Initiating Settle Verification...'}
                        {paymentPhase === 'indexing' && 'Matching UPI Live Ledger...'}
                        {paymentPhase === 'finishing' && 'Locking Inventory Spot...'}
                      </h4>
                      <p className="text-xs text-[#8E867C] max-w-sm mx-auto leading-relaxed">
                        {paymentPhase === 'verifying' && 'Our secure endpoint is connecting to financial networks to authorize your reservation clearance.'}
                        {paymentPhase === 'indexing' && `Checking GooglePay/PhonePe ledger database for Transaction Ref: ${transactionId || 'Desk Standard'}...`}
                        {paymentPhase === 'finishing' && 'Confirming master therapists schedule and locking your selected premium time slot.'}
                      </p>
                    </div>

                    {/* Progress Dots with animation */}
                    <div className="flex justify-center gap-2 pt-2">
                      <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${paymentPhase === 'verifying' ? 'bg-[#8C7355] scale-125' : 'bg-stone-200'}`} />
                      <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${paymentPhase === 'indexing' ? 'bg-amber-600 scale-125' : 'bg-stone-200'}`} />
                      <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${paymentPhase === 'finishing' ? 'bg-emerald-600 scale-125' : 'bg-stone-200'}`} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-serif text-[#3D342B] text-lg uppercase tracking-wider mb-2 flex items-center gap-2 font-bold animate-fadeIn">
                      <User className="text-[#8C7355] w-4.5 h-4.5" />
                      Step 4: Register Guest Dossier
                    </h3>
                    <p className="text-xs text-[#8E867C] mb-6 font-sans">
                      Complete your personal contact information to create your booking invitation code.
                    </p>

                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-[10px] uppercase font-sans tracking-widest text-[#8C7355] font-bold mb-1">
                          Full Guest Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-stone-400" />
                          <input
                            type="text"
                            id="guest-name-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className={`pl-10 w-full py-2.5 px-3 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8C7355] transition ${
                              errorField === 'name' ? 'border-rose-500 bg-rose-50/10' : 'border-[#EAE2D8]'
                            }`}
                          />
                        </div>
                        {errorField === 'name' && (
                          <p className="text-rose-600 text-[10px] mt-1 font-sans font-medium">Please enter your authentic name (minimum 3 characters).</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-sans tracking-widest text-[#8C7355] font-bold mb-1">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-stone-400" />
                            <input
                              type="email"
                              id="guest-email-input"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="your@email.com"
                              className={`pl-10 w-full py-2.5 px-3 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8C7355] transition ${
                                errorField === 'email' ? 'border-rose-500 bg-rose-50/10' : 'border-[#EAE2D8]'
                              }`}
                            />
                          </div>
                          {errorField === 'email' && (
                            <p className="text-rose-600 text-[10px] mt-1 font-sans font-medium">Please input a valid email coordinate.</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-sans tracking-widest text-[#8C7355] font-bold mb-1">
                            WhatsApp / Mobile *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4.5 w-4.5 text-stone-400" />
                            <input
                              type="tel"
                              id="guest-phone-input"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="9xxxxxxxxx (10-digit)"
                              className={`pl-10 w-full py-2.5 px-3 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8C7355] transition ${
                                errorField === 'phone' ? 'border-rose-500 bg-rose-50/10' : 'border-[#EAE2D8]'
                              }`}
                            />
                          </div>
                          {errorField === 'phone' && (
                            <p className="text-rose-600 text-[10px] mt-1 font-sans font-medium">Please inputs a correct 10-digit Indian Mobile Number.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-sans tracking-widest text-[#8C7355] font-bold mb-1">
                          Medical Flags / Special Room Requests (Optional)
                        </label>
                        <textarea
                          id="guest-requests-textarea"
                          value={specialRequest}
                          onChange={(e) => setSpecialRequest(e.target.value)}
                          placeholder="E.g., high pressure on shoulders, allergic to lemongrass oils, extra quiet room, steam requests..."
                          rows={3.5}
                          className="w-full py-2.5 px-3 border border-[#EAE2D8] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8C7355] transition"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] uppercase font-sans tracking-widest text-[#8C7355] font-bold">
                          Desired Settle Schedular (Branch Payment Method)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div
                            id="pay-at-desk-card"
                            onClick={() => { setPaymentMethod('desk'); setErrorField(''); }}
                            className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between h-28 ${
                              paymentMethod === 'desk'
                                ? 'bg-[#FAF7F2] border-[#8C7355] ring-1 ring-[#8C7355]'
                                : 'bg-white border-[#EAE2D8] hover:border-[#8C7355]/40'
                            }`}
                          >
                            <div className="text-left">
                              <span className="font-serif text-[#3D342B] text-xs font-bold block mb-1">Pay at Spa Desk</span>
                              <span className="text-[9px] text-[#8E867C] leading-tight font-medium block">
                                Settle cash, UPI or card after therapies completed
                              </span>
                            </div>
                            <div className="flex justify-between items-center w-full mt-2">
                              <span className="text-[9.5px]/none font-sans font-extrabold text-[#8C7355]">DESK SETTLE</span>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentMethod === 'desk' ? 'border-[#8C7355] bg-[#8C7355]' : 'border-stone-300'}`}>
                                {paymentMethod === 'desk' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            </div>
                          </div>

                          <div
                            id="pay-via-upi-card"
                            onClick={() => { setPaymentMethod('upi'); setErrorField(''); }}
                            className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between h-28 ${
                              paymentMethod === 'upi'
                                ? 'bg-[#FAF7F2] border-[#8C7355] ring-1 ring-[#8C7355]'
                                : 'bg-white border-[#EAE2D8] hover:border-[#8C7355]/40'
                            }`}
                          >
                            <div className="text-left">
                              <span className="font-serif text-[#3D342B] text-xs font-bold block mb-1">UPI Online Settle</span>
                              <span className="text-[9px] text-[#8E867C] leading-tight font-medium block">
                                Pay via GPAY / BHIM UPI code directly
                              </span>
                            </div>
                            <div className="flex justify-between items-center w-full mt-2">
                              <span className="text-[9.5px]/none font-sans font-extrabold text-[#8C7355]">GOOGLE PAY</span>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#8C7355] bg-[#8C7355]' : 'border-stone-300'}`}>
                                {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            </div>
                          </div>

                          <div
                            id="pay-via-card-card"
                            onClick={() => { setPaymentMethod('card'); setErrorField(''); }}
                            className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between h-28 ${
                              paymentMethod === 'card'
                                ? 'bg-[#FAF7F2] border-[#8C7355] ring-1 ring-[#8C7355]'
                                : 'bg-white border-[#EAE2D8] hover:border-[#8C7355]/40'
                            }`}
                          >
                            <div className="text-left">
                              <span className="font-serif text-[#3D342B] text-xs font-bold block mb-1">Prepaid Credit Card</span>
                              <span className="text-[9px] text-[#8E867C] leading-tight font-medium block">
                                Secure checkout with any Visa / Mastercard
                              </span>
                            </div>
                            <div className="flex justify-between items-center w-full mt-2">
                              <span className="text-[9.5px]/none font-sans font-extrabold text-[#8C7355]">VISA / MASTER</span>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#8C7355] bg-[#8C7355]' : 'border-stone-300'}`}>
                                {paymentMethod === 'card' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {paymentMethod === 'upi' ? (
                        <div id="upi-payment-details-panel" className="p-4 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl space-y-4 animate-fadeIn text-left font-sans">
                          <div className="flex items-center gap-2 pb-2 border-b border-[#EAE2D8]/60">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500 text-white font-mono text-[9px] font-bold">SECURE ONLINE QR SETTLE</span>
                            <span className="text-[10px] text-[#8E867C] font-semibold">GPay / PhonePe / Any UPI</span>
                          </div>
                          
                          <p className="text-xs text-[#5C544B] leading-relaxed">
                            Scan and pay the total cost of <strong className="text-[#3D342B]">₹{getTotalCost().toLocaleString('en-IN')}</strong> directly using GPay, PhonePe, or any UPI app:
                          </p>

                          {/* PAYMENT CARD CONTAINER */}
                          <div className="bg-[#f0f4f9] rounded-2xl p-5 max-w-sm mx-auto shadow-sm border border-stone-200/80 flex flex-col items-center justify-center space-y-4 text-center">
                            {/* Header with logo or styling */}
                            <div className="flex items-center gap-1.5 self-start">
                              <div className="w-5 h-5 bg-[#3D342B] rounded-full flex items-center justify-center">
                                <Flower className="text-white w-3 h-3" />
                              </div>
                              <span className="text-[9px] text-[#3D342B] font-bold uppercase tracking-wider font-sans">Maheeee Escrow</span>
                            </div>

                            {/* Complete UPI QR container matching original */}
                            <div className="relative bg-white p-5 rounded-2xl border border-stone-250/60 shadow-sm flex flex-col items-center justify-center w-full">
                              {/* QR code itself. We draw an elegant SVG vector QR code */}
                              <div className="relative w-44 h-44 bg-white flex items-center justify-center">
                                <svg className="w-full h-full text-stone-900" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {/* Borders / Anchors */}
                                  <path d="M5 5h15v5H10v10H5V5zm0 90h15v-5H10v-10H5v15zm90-90H80v5h10v10h5V5zm-5 85H80v5h15v-15h-5v10z" fill="currentColor"/>
                                  {/* Anchor cubes */}
                                  <rect x="7" y="7" width="11" height="11" fill="currentColor"/>
                                  <rect x="9" y="9" width="7" height="7" fill="white"/>
                                  <rect x="7" y="82" width="11" height="11" fill="currentColor"/>
                                  <rect x="9" y="84" width="7" height="7" fill="white"/>
                                  <rect x="82" y="7" width="11" height="11" fill="currentColor"/>
                                  <rect x="84" y="9" width="7" height="7" fill="white"/>
                                  
                                  {/* Simulated highly realistic QR pixels */}
                                  <path d="M25 10h5v5h-5zm10 0h10v5H35zm15 0h5v10h-5zm10 0h5v5h-5zm10 0h5v10h-5zm10 5h5v5h-5zm-55 10h5v5h-5zm10 0h5v5h-5zm15 0h10v5H45zm25 0h5v5h-5zm5 0h5v5h-5zm5 0h5v5h-5zm0 10h5v5h-5zm-75 5h5v5H5zm5 0h10v5H10zm15 0h5v5h-5zm20 0h5v10h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 5h5v5h-5zm-75 10h5v5H5zm15 0h5v5h-5zm15 0h5v5h-5zm15 0h10v5H50zm15 0h5v5h-5zm15 0h5v5h-5zm10 5h5v5h-5zm-80 5h10v5H10zm25 0h5v5h-5zm10 0h5v5h-5zm15 0h5v5h-5zm10 0h5v10h-5zm10 5h5v5h-5zm-75 5h5v5H10zm15 0h5v5h-5zm10 0h10v5H35zm15 0h5v5h-5zm15 0h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5z" fill="currentColor" opacity="0.85"/>
                                  <path d="M25 45h5v5H25zm10 0h10v5H35zm15 10h5v10h-5zm10 0h5v5h-5zm10 0h5v10h-5zm10 5h5v5h-5zm-55 10h5v5h-5zm10 0h5v5h-5zm15 0h10v5H45zm25 0h5v5h-5zm5 0h5v5h-5zm5 0h5v5h-5zm0 10h5v5h-5zm-75 5h5v5H5zm5 0h10v5H10zm15 0h5v5h-5zm20 0h5v10h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 5h5v5h-5zm-75 10h5v5H5zm15 0h5v5h-5zm15 0h5v5h-5zm15 0h10v5H50zm15 0h5v5h-5zm15 0h5v5h-5zm10 5h5v5h-5zm-80 5h10v5H10zm25 0h5v5h-5zm10 0h5v5h-5zm15 0h5v5h-5zm10 0h5v10h-5zm10 5h5v5h-5zm-75 5h5v5H10zm15 0h5v5h-5zm10 0h10v5H35zm15 0h5v5h-5zm15 0h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5z" fill="currentColor" opacity="0.9"/>
                                </svg>
                                
                                {/* Central Google Pay Logo Badge */}
                                <div className="absolute inset-0 m-auto w-11 h-11 bg-white rounded-full shadow border border-stone-100 flex items-center justify-center overflow-hidden">
                                  <div className="flex flex-col items-center justify-center p-0.5">
                                    <div className="flex gap-0.5 items-center justify-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                                    </div>
                                    <span className="text-[7.5px] font-sans font-black tracking-tighter text-blue-600 mt-0.5">G Pay</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-[9px] text-[#8E867C] font-semibold mt-1 font-sans">
                                Scan to pay with any UPI app
                              </span>
                            </div>

                            {/* PNB logo/accent and details */}
                            <div className="bg-amber-400 text-stone-900 px-3 py-2 rounded-xl border border-amber-300 w-full flex items-center justify-between shadow-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-stone-900 text-amber-400 font-bold rounded-md flex items-center justify-center text-[10px] font-mono select-none">
                                  p
                                </div>
                                <span className="text-[10px] font-sans font-black tracking-wide uppercase">
                                  Punjab National Bank 4585
                                </span>
                              </div>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>

                            {/* Click to Copy UPI ID */}
                            <div className="w-full">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText('mahipalzah-3@oksbi');
                                  setCopiedUpi(true);
                                  setTimeout(() => setCopiedUpi(false), 2000);
                                }}
                                className="w-full bg-white hover:bg-stone-50 text-[#3D342B] border border-stone-200 p-2.5 rounded-xl flex items-center justify-between transition-all duration-150 group shadow-xs active:scale-98"
                              >
                                <div className="text-left font-sans">
                                  <span className="text-[8px] text-[#8E867C] block font-bold uppercase tracking-wider">UPI ID Address</span>
                                  <span className="font-mono text-[11px] font-bold text-stone-800 tracking-wide">mahipalzah-3@oksbi</span>
                                </div>
                                
                                <div className="flex items-center gap-1 bg-[#FAF7F2] text-[#8C7355] border border-[#EAE2D8] group-hover:bg-[#3D342B] group-hover:text-white group-hover:border-transparent px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest transition duration-150">
                                  {copiedUpi ? 'Copied' : 'Copy'}
                                </div>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 text-left pt-2 border-t border-[#EAE2D8]/60">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7355]">
                              UPI Transaction Ref / UTR Number *
                            </label>
                            <input
                              type="text"
                              id="payment-ref-input"
                              required
                              placeholder="Enter the 12-digit UTR or Transaction ID after paying..."
                              value={transactionId}
                              onChange={(e) => { setTransactionId(e.target.value); setErrorField(''); }}
                              className={`w-full py-2.5 px-3 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8C7355] transition text-[#3D342B] font-mono ${
                                errorField === 'transactionId' ? 'border-rose-500 bg-rose-50/10' : 'border-[#EAE2D8]'
                              }`}
                            />
                            {errorField === 'transactionId' && (
                              <p className="text-rose-600 text-[10px] font-medium mt-1">Please enter a valid transaction reference / UTR number (min 6 characters) to authenticate.</p>
                            )}
                          </div>
                        </div>
                      ) : paymentMethod === 'card' ? (
                        <div id="card-payment-details-panel" className="p-4 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl space-y-4 animate-fadeIn text-left font-sans">
                          <div className="flex items-center gap-2 pb-2 border-b border-[#EAE2D8]/60">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[9px] font-bold">SECURE ENCRYPTED CHECKOUT</span>
                            <span className="text-[10px] text-[#8E867C] font-semibold">Visa, Mastercard, RuPay & Amex</span>
                          </div>

                          {/* Live credit card face illustration */}
                          <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-[#735E46] text-white p-5 rounded-2xl shadow-md w-full max-w-sm mx-auto aspect-[1.586/1] overflow-hidden flex flex-col justify-between font-mono tracking-widest leading-none border border-[#8C7355]/30">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className="text-[7.5px] uppercase tracking-widest text-[#FAF7F2]/60 font-sans font-extrabold font-mono">Maheeee Gold Card</span>
                                <div className="w-9 h-6.5 bg-amber-200/20 border border-amber-300/30 rounded-md mt-1.5 flex items-center justify-center relative">
                                  <div className="absolute w-3.5 h-2.5 border border-amber-200/30 rounded-xs" />
                                </div>
                              </div>
                              <Flower className="text-amber-500/80 w-8 h-8 opacity-90" />
                            </div>

                            {/* Card Number Display */}
                            <div className="text-md sm:text-base text-amber-50/90 font-bold tracking-widest py-2 text-center">
                              {cardNumber || '•••• •••• •••• ••••'}
                            </div>

                            <div className="flex justify-between items-end text-white/90">
                              <div className="space-y-1">
                                <span className="text-[6.5px] uppercase text-[#FAF7F2]/40 block font-sans font-bold">Cardholder</span>
                                <span className="text-[9.5px] uppercase font-sans font-bold tracking-widest truncate max-w-[150px] block">
                                  {cardHolder || 'VALUED GUEST'}
                                </span>
                              </div>
                              <div className="flex gap-4">
                                <div className="space-y-1">
                                  <span className="text-[6.5px] uppercase text-[#FAF7F2]/40 block font-sans font-bold">Expires</span>
                                  <span className="text-[9.5px] font-sans font-extrabold block">{cardExpiry || 'MM/YY'}</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[6.5px] uppercase text-[#FAF7F2]/40 block font-sans font-bold">CVV</span>
                                  <span className="text-[9.5px] font-sans font-extrabold block">{cardCvv ? '•••' : '***'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card input forms */}
                          <div className="grid grid-cols-1 gap-3.5 pt-2 font-sans text-xs text-[#3D342B]">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold uppercase text-[#8C7355]">
                                Cardholder Name *
                              </label>
                              <input
                                type="text"
                                value={cardHolder}
                                onChange={(e) => { setCardHolder(e.target.value.toUpperCase()); setErrorField(''); }}
                                placeholder="E.G. PRIYA DHARMAGARI"
                                className={`w-full py-2.5 px-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8C7355] transition uppercase font-sans ${
                                  errorField === 'cardHolder' ? 'border-rose-500 bg-rose-50/10' : 'border-[#EAE2D8]'
                                }`}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold uppercase text-[#8C7355]">
                                Card Number *
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={cardNumber}
                                  onChange={handleCardNumberChange}
                                  placeholder="4111 2222 3333 4444"
                                  className={`w-full py-2.5 pl-9 pr-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8C7355] transition font-mono ${
                                    errorField === 'cardNumber' ? 'border-rose-500 bg-rose-50/10' : 'border-[#EAE2D8]'
                                  }`}
                                />
                                <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase text-[#8C7355]">
                                  Expiry Date (MM/YY) *
                                </label>
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={handleCardExpiryChange}
                                  placeholder="MM/YY"
                                  className={`w-full py-2.5 px-3 border rounded-xl text-center focus:outline-none focus:ring-1 focus:ring-[#8C7355] transition font-mono ${
                                    errorField === 'cardExpiry' ? 'border-rose-500 bg-rose-50/10' : 'border-[#EAE2D8]'
                                  }`}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase text-[#8C7355]">
                                  CVV Number *
                                </label>
                                <input
                                  type="password"
                                  value={cardCvv}
                                  onChange={handleCardCvvChange}
                                  placeholder="•••"
                                  className={`w-full py-2.5 px-3 border rounded-xl text-center focus:outline-none focus:ring-1 focus:ring-[#8C7355] transition font-mono ${
                                    errorField === 'cardCvv' ? 'border-rose-500 bg-rose-50/10' : 'border-[#EAE2D8]'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-50 bg-opacity-75 border border-emerald-200 rounded-xl flex items-start gap-2.5 animate-fadeIn">
                          <ShieldCheck className="text-emerald-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-sans font-bold uppercase text-[#1E4620] tracking-wider">Zero pre-payment required today</p>
                            <p className="text-[10px] font-sans text-[#2E5E30] leading-normal mt-0.5">
                              You will settle the amount at our main desk in Kondapur after your therapy completes. Cash, Cards, and UPI are widely supported.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Cancellation Policy Notice */}
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-left animate-fadeIn">
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">★ ALWAYS FREE CANCELLATION ★</p>
                        <p className="text-[10px] text-emerald-700 leading-normal">
                          We understand plans change. Cancellations & rescheduling are <strong className="font-bold text-emerald-800">completely FREE of charge</strong> (₹0 Fee) at any time. Simply release your slot through the 'My Bookings' tab whenever needed.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* STEP 4: Success & Printable Voucher Voucher */}
              {step === 4 && createdBooking && (
                <div className="text-center py-4 font-sans space-y-6">
                  <CheckCircle2 className="text-emerald-500 w-12 h-12 mx-auto mb-2.5" />
                  <h3 className="font-serif text-[#3D342B] text-xl uppercase tracking-widest font-bold">
                    Reservation Secured
                  </h3>
                  <p className="text-xs text-[#8E867C] mb-6 font-sans">
                    Your luxury wellness slot has been locked successfully. Present this electronic voucher at the desk.
                  </p>

                  {/* Curated Luxury Voucher Design */}
                  <div id="booking-printable-voucher" className="bg-white border-2 border-dashed border-[#EAE2D8] p-6 max-w-md mx-auto text-left rounded-2xl shadow-sm relative overflow-hidden animate-fadeIn">
                    {/* Golden luxury seal */}
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#FAF7F2] border border-[#EAE2D8] rounded-full flex items-center justify-center rotate-12">
                      <Flower className="text-[#8C7355] w-10 h-10 opacity-70" />
                    </div>

                    <div className="border-b border-[#EAE2D8]/60 pb-3 mb-3 text-left">
                      <p className="text-[9px] uppercase tracking-widest text-[#8C7355] font-bold font-sans">LUXURY WELLNESS SCHEDULER</p>
                      <h4 className="font-serif text-base text-[#3D342B] uppercase font-bold leading-tight tracking-wide mt-0.5">{SPA_CONFIG.branchName}</h4>
                      <p className="text-[10px] text-[#8C7355] font-mono mt-0.5 font-bold uppercase tracking-wider">
                        ✦ {createdBooking.branch || 'HYDERABAD'} BRANCH ✦
                      </p>
                      <p className="text-[9px] text-[#8E867C] mt-0.5 leading-snug font-sans max-w-[340px]">
                        {createdBooking.branch === 'Zaheerabad' 
                          ? 'Near Old Bypass Road, Beside HDFC Bank ATM, Zaheerabad, Sangareddy District' 
                          : 'Opp. Google Office Main Gate, Kondapur, Hyderabad, Telangana'}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex justify-between">
                        <span className="text-[#8E867C]">Chosen Branch:</span>
                        <span className="font-bold text-[#8C7355] font-serif uppercase tracking-wider text-[11px] bg-[#FAF7F2] border border-[#EAE2D8]/80 px-2 py-0.5 rounded">
                          {createdBooking.branch || 'Hyderabad'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E867C]">Voucher Reference:</span>
                        <span className="font-mono font-bold text-[#3D342B] tracking-wider uppercase">{createdBooking.bookingReference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E867C]">Therapeutic Service:</span>
                        <span className="font-bold text-[#3D342B] text-right">{createdBooking.therapyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E867C]">Session Duration:</span>
                        <span className="font-mono text-[#3D342B] font-bold">{createdBooking.duration} mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E867C]">Locked Date:</span>
                        <span className="font-mono text-[#3D342B] font-bold">
                          {new Date(createdBooking.date).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E867C]">Time Slot Allocation:</span>
                        <span className="font-mono font-bold text-[#8C7355]">{createdBooking.timeSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E867C]">Caretaker Matching:</span>
                        <span className="text-[#3D342B] capitalize font-medium">
                          {createdBooking.therapistGenderPref === 'any' ? 'First available expert' : `${createdBooking.therapistGenderPref} therapist preference`}
                        </span>
                      </div>
                      {createdBooking.addOns.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-[#8E867C]">Botanical Enhancements:</span>
                          <span className="text-[#3D342B] text-right text-[11px] truncate max-w-[200px] font-medium">
                            {createdBooking.addOns.map(a => a.name).join(', ')}
                          </span>
                        </div>
                      )}
                      
                      <div className="border-t border-[#EAE2D8]/60 pt-3 mt-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-serif font-bold uppercase text-[#8C7355] tracking-wider">Desk Settle Cost (inclusive):</span>
                          <span className="font-mono text-base font-bold text-[#3D342B]">
                            ₹{createdBooking.totalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8E867C] italic mt-1 leading-normal">
                          Includes ₹{Math.round(createdBooking.totalPrice * 0.18 / 1.18).toLocaleString('en-IN')} Service Care GST (18%) standard levy.
                        </p>

                        {/* Interactive Settle details status panel inside receipt */}
                        <div className="mt-4 pt-3.5 border-t border-dashed border-[#EAE2D8]">
                          {paymentMethod === 'upi' ? (
                            <div className="bg-emerald-50 border border-emerald-150 p-2.5 rounded-xl space-y-1.5 text-left">
                              <div className="flex items-center gap-1.5 text-emerald-800 text-[10px] font-bold uppercase tracking-wider font-sans">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                Secured Online UPI
                              </div>
                              <p className="text-[10px] text-emerald-700 font-sans leading-relaxed font-semibold">
                                UPI settle reference documented correctly. Admin will verify matching funds upon desk arrival.
                              </p>
                              <div className="text-[9px] bg-white border border-emerald-250/50 px-2 py-0.5 rounded font-mono text-emerald-800 font-bold inline-block select-all cursor-pointer">
                                UTR: {transactionId || 'Pending'}
                              </div>
                            </div>
                          ) : paymentMethod === 'card' ? (
                            <div className="bg-blue-50 border border-blue-150 p-2.5 rounded-xl space-y-1.5 text-left">
                              <div className="flex items-center gap-1.5 text-blue-800 text-[10px] font-bold uppercase tracking-wider font-sans">
                                <CreditCard className="w-4 h-4 text-blue-600" />
                                Secure Card Authorised
                              </div>
                              <p className="text-[10px] text-blue-700 font-sans leading-relaxed font-semibold">
                                Prepaid via Card. Holder: {cardHolder || 'Guest'}. Card ending matching ({cardNumber.slice(-4) || '••••'}).
                              </p>
                              <div className="text-[9px] bg-white border border-blue-200 px-2 py-0.5 rounded font-mono text-blue-800 font-bold inline-block">
                                VISA/MC AUTH: SUCCESS
                              </div>
                            </div>
                          ) : (
                            <div className="bg-stone-50 border border-stone-200/60 p-2.5 rounded-xl space-y-1.5 text-left">
                              <div className="flex items-center gap-1.5 text-[#3D342B] text-[10px] font-bold uppercase tracking-wider font-sans">
                                <Clock className="w-3.5 h-3.5 text-[#8C7355]" />
                                Desk post-session settle
                              </div>
                              <p className="text-[10px] text-stone-600 font-sans leading-normal">
                                Zero deposit required today. Scan and clear post-treatment at the counter.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Quick Scan Settle Utility */}
                          <div className="mt-2.5 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EAE2D8]/60 flex items-center justify-between">
                            <div className="text-left font-sans">
                              <span className="text-[9px] text-[#8C7355] block font-bold uppercase tracking-wider">Want to pay online?</span>
                              <span className="text-[10px] text-stone-600 block leading-tight font-medium mt-0.5">Scan our GPay QR Code</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowVoucherQr(!showVoucherQr);
                              }}
                              className={`text-[9px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-lg transition-all ${
                                showVoucherQr ? 'bg-amber-500 hover:bg-amber-600 text-stone-950' : 'bg-stone-800 hover:bg-stone-900 text-white shadow-xs'
                              }`}
                            >
                              {showVoucherQr ? 'Hide QR' : 'Show QR'}
                            </button>
                          </div>

                          {/* INLINE COLLAPSED QR VIEW */}
                          {showVoucherQr && (
                            <div className="mt-3 p-3 bg-[#f0f4f9] rounded-2xl border border-stone-200/80 space-y-3 text-center animate-fadeIn">
                              <div className="relative bg-white p-3 rounded-xl border border-stone-200 flex flex-col items-center justify-center">
                                {/* Simulated QR */}
                                <div className="relative w-36 h-36 bg-white flex items-center justify-center">
                                  <svg className="w-full h-full text-stone-900" viewBox="0 0 100 100" fill="none">
                                    <path d="M5 5h12v4H9v8H5V5zm0 90h12v-4H9v-8H5v12zm90-90H83v4h8v8h4V5zm-4 81H83v4h12V81h-4z" fill="currentColor"/>
                                    <rect x="7" y="7" width="10" height="10" fill="currentColor"/>
                                    <rect x="9" y="9" width="6" height="6" fill="white"/>
                                    <rect x="7" y="83" width="10" height="10" fill="currentColor"/>
                                    <rect x="9" y="85" width="6" height="6" fill="white"/>
                                    <rect x="83" y="7" width="10" height="10" fill="currentColor"/>
                                    <rect x="85" y="9" width="6" height="6" fill="white"/>
                                    <path d="M22 10h4v4h-4zm8 0h8v4H30zm12 0h4v8h-4zm8 0h4v4h-4zm8 12h4v4h-4zm8-8h4v4h-4zm0 8h4v4h-4zm-48 8h4v4h-4zm16 0h8v4H30zm8 8h4v4h-4zm8 4h4v4h-4zm-14 8h4v4h-4zm14 4h4v4h-4zm6 12h4v4h-4zm6-24h4v4h-4zm-12 12h4v4h-4z" fill="currentColor" opacity="0.85"/>
                                    <path d="M22 45h4v4h-4zm8 0h8v4H30zm12 8h4v8h-4zm8 0h4v4h-4zm8 0h4v8h-4zm8 4h4v4h-4zm-48 8h4v4h-4zm16 0h8v4H30zm8 8h4v4h-4zm8 4h4v4h-4zm-14 8h4v4h-4zm14 4h4v4h-4z" fill="currentColor" opacity="0.9"/>
                                  </svg>
                                  
                                  {/* Minimal Google Pay Circular Badge */}
                                  <div className="absolute inset-0 m-auto w-8 h-8 bg-white rounded-full shadow border border-stone-100 flex items-center justify-center">
                                    <span className="text-[6.5px] font-sans font-black tracking-tighter text-blue-600 block">G Pay</span>
                                  </div>
                                </div>
                                <span className="text-[8px] text-[#8E867C] font-semibold mt-1 font-sans">
                                  Scan to pay with any UPI app
                                </span>
                              </div>

                              {/* PNB bank identifier */}
                              <div className="bg-amber-400 text-stone-900 px-2 py-1 rounded-lg border border-amber-300 flex items-center justify-between text-left">
                                <span className="text-[9px] font-sans font-black uppercase tracking-wide">
                                  Punjab National Bank 4585
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              </div>

                              {/* Copy button */}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText('mahipalzah-3@oksbi');
                                  setCopiedUpi(true);
                                  setTimeout(() => setCopiedUpi(false), 2000);
                                }}
                                className="w-full bg-white hover:bg-stone-50 text-[#3D342B] border border-stone-200 px-2 py-1 rounded-lg flex items-center justify-between font-sans text-left"
                              >
                                <div>
                                  <span className="text-[7.5px] text-[#8E867C] block font-bold uppercase text-[6px]">UPI ID</span>
                                  <span className="font-mono text-[9px] font-bold text-stone-800">mahipalzah-3@oksbi</span>
                                </div>
                                <div className="bg-[#FAF7F2] text-[#8C7355] border border-[#EAE2D8] px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">
                                  {copiedUpi ? 'Copied' : 'Copy'}
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  {/* Dynamic Confirmation Notifications Dashboard */}
                  {(() => {
                    const paymentMethodLabel = paymentMethod === 'upi'
                      ? `Prepaid via UPI (UTR Reference: ${transactionId})`
                      : paymentMethod === 'card'
                      ? `Prepaid via Credit Card (Holder: ${cardHolder}, Card ending: ${cardNumber.slice(-4)})`
                      : `Settle at Spa Counter Desk (Post-Session)`;

                    const adminMessageText = `Hi Maheeee Wellness Spa, I have successfully locked a wellness appointment.\n\n` +
                      `🎫 Reservation Summary:\n` +
                      `• Voucher Ref: ${createdBooking.bookingReference}\n` +
                      `• Name: ${createdBooking.customerName}\n` +
                      `• Mobile: ${createdBooking.customerPhone}\n` +
                      `• Therapy: ${createdBooking.therapyName}\n` +
                      `• Duration: ${createdBooking.duration} Mins\n` +
                      `• Schedule: ${createdBooking.date} at ${createdBooking.timeSlot}\n` +
                      `• Preference: ${createdBooking.therapistGenderPref.toUpperCase()}\n` +
                      `• Total Price: ₹${createdBooking.totalPrice.toLocaleString('en-IN')}\n` +
                      `• Payment: ${paymentMethodLabel}\n\n` +
                      `Please confirm and update the system. Thank you!`;

                    const adminWaUri = `https://wa.me/918328139956?text=${encodeURIComponent(adminMessageText)}`;

                    const userMessageText = `Hi ${createdBooking.customerName},\n\n` +
                      `Your luxury wellness slot at 🌸 Maheeee Wellness Spa (Opp. Google Gate, Kondapur, Hyderabad) is successfully CONFIRMED!\n\n` +
                      `🎫 Voucher Details:\n` +
                      `• Ref Code: ${createdBooking.bookingReference}\n` +
                      `• Treatment: ${createdBooking.therapyName}\n` +
                      `• Duration: ${createdBooking.duration} mins\n` +
                      `• Allocated Slot: ${createdBooking.date} at ${createdBooking.timeSlot}\n` +
                      `• Total Amount: ₹${createdBooking.totalPrice.toLocaleString('en-IN')}\n` +
                      `• Payment Status: ${paymentMethodLabel}\n\n` +
                      `📍 Directions: https://g.co/kgs/C8Q7W8\n\n` +
                      `See you soon!`;

                    const clientPhoneClean = createdBooking.customerPhone.replace(/\D/g, '');
                    const clientPhoneWithPrefix = clientPhoneClean.startsWith('91') && clientPhoneClean.length > 10 ? clientPhoneClean : `91${clientPhoneClean}`;
                    const userWaUri = `https://wa.me/${clientPhoneWithPrefix}?text=${encodeURIComponent(userMessageText)}`;

                    return (
                      <div className="max-w-md mx-auto mt-6 bg-[#FAF7F2] border border-[#EAE2D8] p-4 rounded-2xl text-left space-y-4 animate-fadeIn font-sans">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8C7355] border-b border-[#EAE2D8]/60 pb-1.5 font-sans">
                          Secure Confirmation Dispatch Center
                        </p>

                        {/* Notification to SPA ADMIN */}
                        <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#EAE2D8]">
                          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="flex-1 space-y-1 text-left">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-[#8C7355] uppercase tracking-wider">ADMIN DESK DISPATCH</span>
                              <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">REQUIRED</span>
                            </div>
                            <p className="text-xs font-bold text-[#3D342B]">Send Copy of Voucher to Admin Desk</p>
                            <p className="text-[10px] text-[#8E867C] leading-normal">
                              Dispatch receipt to our manager to finalize therapist allocations.
                            </p>
                            <div className="pt-1.5 flex gap-2 items-center">
                              <a
                                href={adminWaUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setNotifiedAdmin(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <Phone className="w-3 h-3" />
                                Send Admin WA Msg
                              </a>
                              {notifiedAdmin ? (
                                <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-0.5 animate-pulse">✓ Dispatched</span>
                              ) : (
                                <span className="text-[9px] text-[#8C7355] font-semibold">Recommended</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Notification to CLIENT / CUSTOMER */}
                        <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#EAE2D8]">
                          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div className="flex-1 space-y-1 text-left">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-[#8C7355] uppercase tracking-wider">CLIENT WHATSAPP DISPATCH</span>
                              <span className="text-[9px] font-mono font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">RECOMMENDED</span>
                            </div>
                            <p className="text-xs font-bold text-[#3D342B]">Send Copy to Guest: {createdBooking.customerPhone}</p>
                            <p className="text-[10px] text-[#8E867C] leading-normal">
                              Deliver premium ticket details & location link directly to your WhatsApp.
                            </p>
                            <div className="pt-1.5 flex gap-2 items-center flex-wrap">
                              <a
                                href={userWaUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-stone-800 hover:bg-stone-900 text-white py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition inline-flex items-center gap-1.5"
                              >
                                <Phone className="w-3 h-3" />
                                Send Guest WA Msg
                              </a>
                              <button
                                onClick={() => {
                                  setNotifiedUser(true);
                                  setTimeout(() => setNotifiedUser(false), 5000);
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition inline-flex items-center gap-1"
                              >
                                Simulate SMS & Email ✉
                              </button>
                            </div>
                            {notifiedUser && (
                              <div className="mt-2 bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-[10px] text-emerald-800 leading-normal animate-fadeIn font-sans">
                                <strong>✓ Simulated Broadcast Dispatched:</strong> Auto confirmation SMS sent to <span className="font-mono">{createdBooking.customerPhone || 'N/A'}</span> and transaction confirmation HTML email dispatched to <span className="font-mono">{createdBooking.customerEmail}</span> successfully!
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    {onClose && (
                      <button
                        id="close-success-btn"
                        onClick={onClose}
                        className="bg-[#3D342B] hover:bg-[#2C241C] text-white py-3 px-8 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-md font-sans"
                      >
                        Return to Sanctuary Entry
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Control Buttons (only for step < 4) */}
          {step < 4 && !isProcessingPayment && (
            <div className="flex justify-between items-center mt-8 pt-5 border-t border-[#EAE2D8]/60">
              <div>
                {step > 0 ? (
                  <button
                    id="prev-btn"
                    onClick={handleBackStep}
                    className="flex items-center gap-1.5 text-[#5C544B] hover:text-[#3D342B] transition text-xs font-bold uppercase tracking-wider bg-[#FAF7F2] hover:bg-[#EAE2D8] py-2.5 px-4 rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <span className="text-[10px] text-[#8E867C] font-sans tracking-wide font-medium">
                    Locked securely under HIPAA & safety guidelines.
                  </span>
                )}
              </div>

              <div>
                <button
                  id="next-btn"
                  onClick={handleNextStep}
                  className="flex items-center gap-1.5 bg-[#3D342B] hover:bg-[#2C241C] text-white font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition hover:shadow shadow-sm"
                >
                  {step === 3 ? 'Lock My Booking' : 'Next Stage'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary Invoice (Rigidly Styled like a luxury hotel bill) */}
        <div className="bg-[#FAF7F2]/60 border-t lg:border-t-0 lg:border-l border-[#EAE2D8] p-6 lg:p-8 lg:col-span-4 flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#8C7355] font-bold font-sans block mb-1">DRAFT TREATMENT BALANCE</span>
            <h3 className="font-serif text-[#3D342B] text-base uppercase font-bold leading-none tracking-wide pb-4 border-b border-[#EAE2D8]">
              Spa Settle Breakdown
            </h3>

            {/* Chosen Therapy Summary */}
            <div className="mt-5 space-y-4 text-xs font-sans">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8C7355] font-sans font-bold">Selected Therapy</p>
                <div className="flex justify-between items-start mt-1">
                  <span className="text-[#3D342B] font-serif font-bold">{selectedTherapy.name}</span>
                  <span className="font-mono text-[#3D342B] font-bold">
                    ₹{getBasePrice().toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-[#8E867C] font-mono mt-0.5">
                  {selectedTherapy.category === 'express' ? '45 min standard session' : `${duration} mins focused treatment`}
                </p>
              </div>

              {/* Chosen Day & Time Summary */}
              {selectedTime && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8C7355] font-sans font-bold">Allocated Slot</p>
                  <p className="text-[#3D342B] mt-0.5 flex items-center gap-1.5 leading-none">
                    <Calendar className="w-3.5 h-3.5 text-[#8C7355]" />
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-[#EAE2D8]">|</span>
                    <Clock className="w-3.5 h-3.5 text-[#8C7355]" />
                    <span className="font-bold">{selectedTime}</span>
                  </p>
                </div>
              )}

              {/* Core Scent or therapist pref */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8C7355] font-sans font-bold">Comfort Matching</p>
                <p className="text-[#3D342B] mt-0.5 capitalize font-medium">
                  Therapist: {therapistPref === 'any' ? 'First Available Specialist' : `${therapistPref} Professional`}
                </p>
              </div>

              {/* Selected AddOns */}
              {selectedAddOns.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8C7355] font-sans font-bold">Enhancements Selected</p>
                  <div className="space-y-1.5 mt-1">
                    {selectedAddOns.map(addon => (
                      <div key={addon.id} className="flex justify-between text-[11px] text-[#3D342B] font-medium">
                        <span className="truncate max-w-[150px]">{addon.name}</span>
                        <span className="font-mono text-[#8E867C] font-semibold">₹{addon.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subtotal & Totals with Elegant math breakdown */}
          <div className="border-t border-[#EAE2D8] pt-5 mt-6 space-y-2 text-xs font-sans">
            <div className="flex justify-between text-[#5C544B]">
              <span>Therapy Subtotal:</span>
              <span className="font-mono text-[#3D342B] font-bold">₹{getSubTotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#5C544B]">
              <span>GST Surcharge (18%):</span>
              <span className="font-mono text-[#3D342B] font-bold">+₹{getGstTax().toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#5C544B]">
              <span>Estimated Wellness Span:</span>
              <span className="font-mono text-[#3D342B] font-bold">{getEstimatedDuration()} Mins</span>
            </div>
            
            <div className="border-t border-[#EAE2D8] pt-3.5 mt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-serif font-bold uppercase text-[#8C7355] tracking-wider">Grand Net Total:</span>
                <span className="font-mono text-lg font-bold text-[#3D342B]">
                  ₹{getTotalCost().toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[9px] text-[#8C7355] mt-1.5 font-sans leading-normal italic flex items-center gap-1 font-semibold">
                <Info className="w-3 h-3 flex-shrink-0" />
                <span>Pay directly at desk in Kondapur post-therapy.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
