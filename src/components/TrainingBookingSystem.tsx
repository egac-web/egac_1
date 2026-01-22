import React, { useState } from "react";
import "../styles/bookings.css";
import { FaCalendarAlt } from "react-icons/fa";
import { CONFIG, getNextNWeekdayDates } from "../lib/booking";

function formatDate(date: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Session slot type
type Slot = {
  id: string;
  date: string; // ISO date
  time: string;     // '18:30'
  group: string;    // 'u13' | 'u15plus'
  label: string;    // human label
  enabled: boolean;
  booked: boolean;
  slotsLeft?: number; // availability
  eligible?: boolean; // invite eligible
  booker?: string;
};

function getInitialSlots(weeks = 6) {
  const dates = getNextNWeekdayDates(2, weeks);
  const slots: Slot[] = [];
  for (const dateStr of dates) {
    slots.push({ id: `${dateStr}-u13`, date: dateStr, time: CONFIG.slots.u13.time, group: 'u13', label: CONFIG.slots.u13.label, enabled: true, booked: false, slotsLeft: CONFIG.capacityPerSlot });
    slots.push({ id: `${dateStr}-u15plus`, date: dateStr, time: CONFIG.slots.u15plus.time, group: 'u15plus', label: CONFIG.slots.u15plus.label, enabled: true, booked: false, slotsLeft: CONFIG.capacityPerSlot });
  }
  return slots;
}

// Helper to decide which slots to show to a user. If an invite is present, only the eligible slots
// for that invite (and that are enabled) should be visible. Public users see all enabled slots.
export function getVisibleSlots(allSlots: Slot[], invitePresent: boolean) {
  if (invitePresent) return allSlots.filter((s) => s.eligible && s.enabled);
  return allSlots.filter((s) => s.enabled);
}

const TrainingBookingSystem: React.FC<{ inviteToken?: string }> = ({ inviteToken }) => {
  const [slots, setSlots] = useState<Slot[]>(getInitialSlots(6));
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [inviteTokenState, setInviteTokenState] = useState<string | null>(inviteToken || null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
  const [bookingDone, setBookingDone] = useState<boolean>(false);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const redirectTimerRef = React.useRef<number | null>(null);
  const REDIRECT_DELAY = 6000; // ms before redirecting to home
  const statusRef = React.useRef<HTMLDivElement | null>(null);

  // Clear redirect timer on unmount
  React.useEffect(() => {
    return () => {
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    };
  }, []);

  // If we're loaded with an invite token (prop or URL), preselect the slot from query params
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qInvite = params.get('invite');
      const qDate = params.get('date');
      const qSlot = params.get('slot');
      if (qInvite && !inviteTokenState) setInviteTokenState(qInvite);

      if (qDate && qSlot) {
        const match = slots.find((s) => s.date === qDate && s.group === qSlot);
        if (match) {
          setSelectedSlot(match);
          setShowModal(true);
        }
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // Load availability for an invite token when present
  React.useEffect(() => {
    async function loadInvite() {
      if (!inviteTokenState) return;
      try {
        const res = await fetch(`/api/booking.json?invite=${encodeURIComponent(inviteTokenState)}`);
        const body = await res.json();
        if (!res.ok || !body.ok) {
          setStatusMessage('Failed to load invite data');
          setStatusType('error');
          return;
        }
        // Update slots with availability and eligible slot
        const availability = (body.availability || []).reduce((acc: Record<string, any>, a: any) => { acc[a.date] = a; return acc; }, {});
        setSlots((prev) => prev.map((s) => {
          const a = availability[s.date];
          if (!a) return s;
          const slotsLeft = (a.slots && typeof a.slots[s.group] === 'number') ? a.slots[s.group] : CONFIG.capacityPerSlot;
          const eligible = a.eligibleSlot === s.group;
          return { ...s, slotsLeft, enabled: slotsLeft > 0, eligible };
        }));

        if (body.booking) {
          setBookingDone(true);
          setBookingInfo(body.booking);
          setStatusMessage('You already have a booking — check your email.');
          setStatusType('success');
        }
      } catch (err) {
        setStatusMessage('Failed to fetch availability');
        setStatusType('error');
      }
    }
    loadInvite();
  }, [inviteTokenState]);

  // Load public availability when no invite token present
  React.useEffect(() => {
    async function loadPublicAvailability() {
      if (inviteTokenState) return; // only for public view
      try {
        const res = await fetch('/api/booking.json');
        const body = await res.json();
        if (!res.ok || !body.ok) return;
        const availability = (body.availability || []).reduce((acc: Record<string, any>, a: any) => { acc[a.date] = a; return acc; }, {});
        setSlots((prev) => prev.map((s) => {
          const a = availability[s.date];
          if (!a) return s;
          const slotsLeft = (a.slots && typeof a.slots[s.group] === 'number') ? a.slots[s.group] : CONFIG.capacityPerSlot;
          return { ...s, slotsLeft, enabled: slotsLeft > 0 };
        }));
      } catch (err) {
        // ignore public availability errors silently
      }
    }
    loadPublicAvailability();
  }, [inviteTokenState]);

  // Compute visible slots and an eligible label for invite users
  const visibleSlots = getVisibleSlots(slots, !!inviteTokenState);
  const eligibleLabel = inviteTokenState ? (slots.find((s) => s.eligible)?.label ?? null) : null;

  // Auto-focus status message for accessibility whenever it changes
  React.useEffect(() => {
    if (statusMessage && statusRef.current) {
      statusRef.current.focus();
    }
  }, [statusMessage]);

  const handleSelect = (slot: Slot) => {
    if (!slot.enabled || slot.booked) return;
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    if (submitting) return;
    setSubmitting(true);

    // Server booking flow only when invite present
    if (inviteTokenState) {
      setStatusMessage('Booking in progress...');
      setStatusType(null);
      try {
        const res = await fetch('/api/booking.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invite: inviteTokenState, session_date: selectedSlot.date }),
        });
        const body = await res.json();
        if (!res.ok || !body.ok) {
          if (res.status === 409 && body.booking) {
            // idempotent response: booking already exists
            setBookingDone(true);
            setBookingInfo(body.booking);
            setStatusMessage('A booking already exists for this invite.');
            setStatusType('success');
            return;
          }
          throw new Error(body.error || 'Booking failed');
        }
        // update UI
        setSlots((prev) => prev.map((s) => s.id === `${selectedSlot.date}-${selectedSlot.group}` ? { ...s, booked: true, slotsLeft: (s.slotsLeft || 1) - 1 } : s));
        setBookingDone(true);
        setBookingInfo(body.booking || null);
        setStatusMessage('Booking confirmed — check your email for confirmation.');
        setStatusType('success');
        // Show a prominent confirmation panel and redirect home after a short delay
        setShowConfirmation(true);
        if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = window.setTimeout(() => {
          window.location.assign('/');
        }, REDIRECT_DELAY);
      } catch (err: any) {
        setStatusMessage('Booking failed: ' + (err?.message || String(err)));
        setStatusType('error');
      } finally {
        setSubmitting(false);
        setShowModal(false);
        setSelectedSlot(null);
      }
      return;
    }

    // Local dev fallback
    setSlots((prev) => prev.map((s) => s.id === selectedSlot.id ? { ...s, booked: true } : s));
    setShowModal(false);
    setSelectedSlot(null);
    setBookingDone(true);
    setBookingInfo({ id: 'local-dev', session_date: selectedSlot.date, slot: selectedSlot.group, session_time: selectedSlot.time });
    setStatusMessage('Booking reserved locally (dev mode) — check your email (dev)');
    setStatusType('success');
    // Show confirmation and redirect (dev mode)
    setShowConfirmation(true);
    if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    redirectTimerRef.current = window.setTimeout(() => {
      window.location.assign('/');
    }, REDIRECT_DELAY);
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 booking-page">
      <div className="bookings-hero">
        <h2 className="text-3xl font-bold mb-2">Book a Training Session</h2>
        <p className="bookings-lead">Choose a session below to reserve a free taster. If you received an invite, it will show your eligible slot and held availability.</p>
      </div>

      {/* Confirmation overlay shown after booking */}
      {showConfirmation && bookingInfo ? (
        <div className="p-6 mb-6 rounded-lg border-l-4 border-green-500 bg-green-50" role="status" aria-live="polite">
          <h3 className="text-xl font-semibold">Booking confirmed</h3>
          <p className="mt-2">Your session on <strong>{new Date(bookingInfo.session_date).toLocaleDateString('en-GB')}</strong> ({CONFIG.slots[bookingInfo.slot]?.label || bookingInfo.slot}) has been booked. A confirmation email has been sent to the email address you provided when enquiring (check your inbox and spam folder).</p>
          <p className="mt-2">You will be returned to the home page in {Math.round(REDIRECT_DELAY / 1000)} seconds.</p>
          <div className="mt-4" style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => { if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current); window.location.assign('/'); }} className="btn-primary">Return home now</button>
            <button onClick={() => { setShowConfirmation(false); if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current); }} className="btn-ghost">Stay on page</button>
          </div>
        </div>
      ) : null}

      {/* Accessible status area */}
      <div aria-live="polite" aria-atomic="true" tabIndex={-1} ref={statusRef} style={{ outline: 'none' }}>
        {statusMessage ? (
          <div className={`p-3 mb-4 rounded ${statusType === 'success' ? 'status-success' : statusType === 'error' ? 'status-error' : 'bg-gray-50'}`} role="status">
            {statusMessage}
          </div>
        ) : null}
      </div>

      <div className="booking-grid">
        {inviteTokenState ? (
          <div className="p-3 mb-4 rounded border-l-4 border-blue-500 bg-blue-50">
            {eligibleLabel ? (
              <p className="small-muted">Showing sessions for <strong>{eligibleLabel}</strong>. If none are listed, it means there are no vacancies in your group.</p>
            ) : (
              <p className="small-muted">You're invited — showing only sessions for your eligible group.</p>
            )}
          </div>
        ) : null}

        {visibleSlots.length === 0 && inviteTokenState ? (
          <div className="p-4 mb-4 rounded bg-yellow-50 border border-yellow-200">No eligible sessions with vacancies were found for your group. Please check other dates or contact us.</div>
        ) : null}

        {visibleSlots.map((slot) => (
          <div
            key={slot.id}
            className={`booking-card ${slot.booked ? 'bg-gray-100' : ''} ${slot.eligible ? 'eligible-card' : ''}`}
            onClick={() => handleSelect(slot)}
            role="button"
            tabIndex={slot.enabled && !slot.booked ? 0 : -1}
          >
            <div>
              <div className="booking-meta">
                <FaCalendarAlt style={{ color: 'var(--blue)' }} />
                <div>
                  <div className="date">{formatDate(slot.date)}</div>
                  <div className="time small-muted">{slot.time} • {slot.label}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                <div className="capacity-badge">{slot.slotsLeft ?? CONFIG.capacityPerSlot} left</div>
                {slot.eligible ? <div className="eligible-pill">Your slot</div> : null}
                {!slot.enabled && !slot.booked ? <div className="small-muted">Full</div> : null}
              </div>
            </div>

            <div className="slot-actions">
              <button
                onClick={() => handleSelect(slot)}
                disabled={!slot.enabled || slot.booked || bookingDone}
                className="btn-primary"
              >
                {slot.booked ? 'Booked' : (slot.enabled ? 'Book' : 'Full')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for booking confirmation */}
      {showModal && selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center z-50 booking-modal-backdrop">
          <div className="card booking-modal">
            <h3>Confirm Booking</h3>
            <div className="meta-row">
              <div className="col"><strong>Date:</strong> {formatDate(selectedSlot.date)}</div>
              <div className="col"><strong>Time:</strong> {selectedSlot.time}</div>
            </div>
            <p className="mb-4 small-muted">Group: {selectedSlot.label}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleBook} disabled={submitting} className="btn-primary" style={{ flex: 1 }}>{submitting ? 'Booking…' : 'Confirm booking'}</button>
              <button onClick={handleCloseModal} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingBookingSystem;
