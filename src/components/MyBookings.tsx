import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Calendar, CheckCircle2, AlertTriangle, Phone, Trash2, Mail, Award, X } from 'lucide-react';
import { Booking } from '../types';
import { SPA_CONFIG } from '../data/catalog';

interface MyBookingsProps {
  onAddBookingTrigger: () => void;
  // Trigger update when bookings mutate
  changeId: number;
  onBookingChange?: () => void;
}

export default function MyBookings({ onAddBookingTrigger, changeId, onBookingChange }: MyBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [changeId]);

  const loadBookings = () => {
    try {
      const dataStr = localStorage.getItem('maheeee_spa_bookings');
      if (dataStr) {
        const parsed = JSON.parse(dataStr) as Booking[];
        // Sort descending so the newest booking is on top
        parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(parsed);
      } else {
        setBookings([]);
      }
    } catch (e) {
      console.error('Failed to parse bookings from localStorage: ', e);
    }
  };

  const handlePermanentlyDeleteBooking = (bookingId: string) => {
    try {
      const dataStr = localStorage.getItem('maheeee_spa_bookings');
      if (dataStr) {
        const parsed = JSON.parse(dataStr) as Booking[];
        const updated = parsed.filter(b => b.id !== bookingId);
        localStorage.setItem('maheeee_spa_bookings', JSON.stringify(updated));
        loadBookings();
        if (onBookingChange) {
          onBookingChange();
        }
      }
    } catch (e) {
      console.error('Failed to delete booking: ', e);
    }
  };

  const handleClearAllHistory = () => {
    try {
      localStorage.removeItem('maheeee_spa_bookings');
    } catch (e) {
      console.error('Failed to clear bookings history: ', e);
    }
    loadBookings();
    setIsConfirmingClearAll(false);
    if (onBookingChange) {
      onBookingChange();
    }
  };

  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const handleCancelBooking = (booking: Booking) => {
    setCancellingBooking(booking);
  };

  const confirmCancellationAction = () => {
    if (!cancellingBooking) return;

    try {
      const dataStr = localStorage.getItem('maheeee_spa_bookings');
      if (dataStr) {
        const parsed = JSON.parse(dataStr) as Booking[];
        const updated = parsed.map(b => {
          if (b.id === cancellingBooking.id) {
            return { 
              ...b, 
              status: 'cancelled' as const,
              notes: b.notes 
                ? `${b.notes} | Cancelled (Free of Charge)`
                : `Cancelled (Free of Charge)`
            };
          }
          return b;
        });
        localStorage.setItem('maheeee_spa_bookings', JSON.stringify(updated));
        loadBookings();
        setCancellingBooking(null);
        if (onBookingChange) {
          onBookingChange();
        }
      }
    } catch (e) {
      console.error('Failed to update booking status: ', e);
    }
  };

  return (
    <div id="my-bookings-container" className="bg-white border border-[#EAE2D8] rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex justify-between items-center pb-4 border-b border-[#EAE2D8] mb-6 flex-wrap gap-4 text-left">
        <div>
          <h3 className="font-serif text-[#3D342B] text-xl uppercase tracking-wider font-bold">Your Scheduled Sessions</h3>
          <p className="text-xs text-[#8E867C] font-sans mt-0.5">Manage, track, or cancel your upcoming wellness appointments.</p>
        </div>
        <div className="flex items-center gap-2">
          {bookings.length > 0 && (
            <button
              id="clear-all-bookings-trigger"
              onClick={() => setIsConfirmingClearAll(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition duration-150"
            >
              Clear All Record
            </button>
          )}
          <button
            id="new-booking-trigger"
            onClick={onAddBookingTrigger}
            className="bg-[#3D342B] hover:bg-[#8C7355] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-sm"
          >
            Schedule New Session
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div id="no-bookings-view" className="text-center py-10 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl p-6 md:p-10">
          <Bookmark className="text-[#8C7355]/40 w-10 h-10 mx-auto mb-2" />
          <h4 className="font-serif text-[#3D342B] text-base uppercase tracking-wider font-bold">No Appointments Found</h4>
          <p className="text-[#5C544B] text-xs font-sans max-w-md mx-auto mt-1.5 leading-relaxed">
            You do not have any registered luxury bookings recorded on this browser. Ready to embark on your physical restoration journey?
          </p>
          <button
            id="book-first-btn"
            onClick={onAddBookingTrigger}
            className="mt-4 bg-[#8C7355] hover:bg-[#735E46] text-white font-semibold py-2.5 px-8 rounded-full text-xs uppercase tracking-wider transition shadow shadow-[#8C7355]/15"
          >
            Lock Your First Session Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'cancelled';
            const dateObj = new Date(booking.date);
            
            return (
              <div
                key={booking.id}
                id={`booking-card-${booking.bookingReference}`}
                className={`bg-white border-2 rounded-2xl overflow-hidden relative shadow-sm flex flex-col justify-between transition ${
                  isCancelled 
                    ? 'border-red-100 bg-red-50/10 opacity-80' 
                    : 'border-emerald-100 bg-emerald-50/10 shadow-emerald-100/30 hover:shadow-lg border-l-4 border-l-emerald-500'
                }`}
              >
                {/* Upper banner */}
                <div className={`p-4 ${isCancelled ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-[#3D342B] to-[#5C4D3C] text-white'} flex justify-between items-center`}>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#D4C8B8] font-bold block">
                      Maheeee Spa – {booking.branch || 'Hyderabad'}
                    </span>
                    <span className={`font-mono text-xs font-bold tracking-wider text-white`}>
                      {booking.bookingReference}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                      isCancelled 
                        ? 'bg-[#ffebee] text-red-700 border border-red-300' 
                        : 'bg-emerald-500 text-white font-semibold'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-4 space-y-3 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-[#8E867C] font-bold uppercase tracking-wider block">Therapy & Plan</span>
                    <span className={`font-serif text-sm font-semibold text-[#3D342B] block mt-0.5 ${isCancelled ? 'line-through text-stone-400' : ''}`}>
                      {booking.therapyName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[10px] text-[#8E867C] font-bold uppercase tracking-wider block">Schedule</span>
                      <div className="flex items-center gap-1 mt-0.5 text-[#3D342B]">
                        <Calendar className="w-3.5 h-3.5 text-[#8C7355] flex-shrink-0" />
                        <span className="font-mono text-[11px] font-medium">
                          {dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8E867C] font-bold uppercase tracking-wider block">Timing</span>
                      <div className="flex items-center gap-1 mt-0.5 text-[#3D342B]">
                        <Clock className="w-3.5 h-3.5 text-[#8C7355] flex-shrink-0" />
                        <span className="font-mono font-bold text-[11px] text-[#8C7355]">
                          {booking.timeSlot}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[10px] text-[#8E867C] font-bold uppercase tracking-wider block">Guest Name</span>
                      <span className="text-[#3D342B] font-medium truncate block">{booking.customerName}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8E867C] font-bold uppercase tracking-wider block">Phone Reference</span>
                      <span className="text-[#3D342B] font-mono text-[11px] block">{booking.customerPhone}</span>
                    </div>
                  </div>

                  {booking.addOns.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-[#8E867C] font-bold uppercase tracking-wider block">Therapy Boosters</span>
                      <span className="text-[#5C544B] text-[10px] mt-0.5 block truncate">
                        {booking.addOns.map(a => a.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Settle Cost directly at Kondapur desk */}
                  <div className="border-t border-[#EAE2D8]/60 pt-3 mt-3 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-[#8C7355] uppercase font-bold tracking-wider block">Desk Due</span>
                      <span className="text-[#8E867C] text-[9px]">UPI / Cash / Card supported</span>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#3D342B]">
                      ₹{booking.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-[#FAF7F2] p-3 border-t border-[#EAE2D8]/60 flex gap-2">
                  {!isCancelled ? (
                    <>
                      <button
                        id={`cancel-btn-${booking.bookingReference}`}
                        onClick={() => handleCancelBooking(booking)}
                        className="flex-1 text-center py-2.5 border border-[#EAE2D8] hover:border-rose-300 hover:bg-rose-50/10 text-[#5C544B] hover:text-rose-700 rounded-full font-semibold text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Cancel Slot
                      </button>
                      <a
                        id={`whatsapp-btn-${booking.bookingReference}`}
                        href={`https://wa.me/918328139956?text=Hi%20Maheeee%20Wellness%20Spa%20Kondapur,%20I%20would%20like%2520to%2520reschedule%2520my%2520appointment.%20Voucher%20Ref:%20${booking.bookingReference}.%20Therapy:%20${encodeURIComponent(booking.therapyName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Reschedule (WA)
                      </a>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 text-[#8E867C] p-2 text-[11px] mx-auto font-sans text-center w-full">
                      <div className="flex items-center justify-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <span className="font-semibold text-rose-600">This wellness slot has been released back into open inventory.</span>
                      </div>
                      {booking.notes && (booking.notes.includes('Cancellation') || booking.notes.includes('Cancelled')) && (
                        <p className="text-[10px] text-rose-700 font-mono select-all bg-rose-50 border border-rose-100 py-1 px-2 rounded-md mt-1 italic">
                          {booking.notes.includes('|') ? booking.notes.split('|').pop()?.trim() : booking.notes}
                        </p>
                      )}
                      
                      <button
                        onClick={() => handlePermanentlyDeleteBooking(booking.id)}
                        className="mt-2 mx-auto inline-flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition duration-155"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Voucher Record
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Elegant Cancellation Modal with Free Cancel support */}
      {cancellingBooking && (
        <div className="fixed inset-0 bg-[#3D342B]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-[#EAE2D8] rounded-2xl max-w-sm w-full p-6 md:p-8 relative shadow-2xl font-sans text-left">
            <button 
              onClick={() => setCancellingBooking(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-[#3D342B] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <AlertTriangle className="text-rose-500 w-12 h-12 mx-auto mb-2" />
              <h4 className="font-serif text-[#3D342B] text-lg uppercase tracking-wider font-bold">Release Wellness Slot</h4>
              <p className="text-xs text-[#8E867C] font-sans mt-0.5">Voucher Ref: <span className="font-mono font-bold text-[#3D342B]">{cancellingBooking.bookingReference}</span></p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-5 text-center">
              <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider mb-1">Free Cancellation Activated</p>
              <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                This reserved slot has a <strong className="text-emerald-800 font-bold">₹0 cancellation fee</strong>. No fees or penalties apply.
              </p>
            </div>

            <p className="text-xs text-[#5C544B] leading-relaxed text-center mb-4">
              Are you sure you want to cancel your scheduled <strong className="text-[#3D342B]">{cancellingBooking.therapyName}</strong> session? This releases your slot immediately.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={confirmCancellationAction}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider transition shadow-sm"
              >
                Yes, Cancel Booking (₹0 Charge)
              </button>
              <button
                onClick={() => setCancellingBooking(null)}
                className="w-full bg-[#FAF7F2] hover:bg-[#EAE2D8] text-[#5C544B] font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition"
              >
                Keep My Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Broad Purge / Clear All History Modal */}
      {isConfirmingClearAll && (
        <div className="fixed inset-0 bg-[#3D342B]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-[#EAE2D8] rounded-2xl max-w-sm w-full p-6 md:p-8 relative shadow-2xl font-sans text-left">
            <button 
              onClick={() => setIsConfirmingClearAll(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-[#3D342B] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <Trash2 className="text-rose-600 w-12 h-12 mx-auto mb-2 animate-bounce" />
              <h4 className="font-serif text-[#3D342B] text-lg uppercase tracking-wider font-bold">Wipe Booking History</h4>
              <p className="text-xs text-[#8E867C] font-sans mt-0.5">This action cannot be undone.</p>
            </div>

            <p className="text-xs text-[#5C544B] leading-relaxed text-center mb-6">
              Are you sure you want to <strong className="text-rose-700">permanently delete all booking records</strong> from this browser's database? 
              This will completely clean and reset your history.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setIsConfirmingClearAll(false)}
                className="bg-[#FAF7F2] hover:bg-[#EAE2D8] text-[#5C544B] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition text-center"
              >
                Keep History
              </button>
              <button
                onClick={handleClearAllHistory}
                className="bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition text-center shadow-md shadow-rose-600/10"
              >
                Wipe All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
