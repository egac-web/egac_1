import React, { useState } from 'react';
import '../styles/bookings.css';

function formatDate(date: string): string {
  // Expects date in ISO format (e.g., "2024-06-11")
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Session slot type
type Slot = {
  id: string;
  date: string; // ISO date
  time: string;
  group: string;
  enabled: boolean;
  booked: boolean;
  booker?: string;
  slotsLeft?: number | null; // realtime availability if known
};

// Initial slots (example for 4 weeks)
function getInitialSlots() {
  const slots: Slot[] = [];
  const today = new Date();
  for (let week = 0; week < 4; week++) {
    // Find next Tuesday
    const tuesday = new Date(today);
    tuesday.setDate(today.getDate() + ((2 + 7 - today.getDay()) % 7) + week * 7);
    const dateStr = tuesday.toISOString().slice(0, 10);
    slots.push(
      {
        id: `${dateStr}-u13-1`,
        date: dateStr,
        time: '18:30-19:30',
        group: 'U13s',
        enabled: true,
        booked: false,
      },
      {
        id: `${dateStr}-u13-2`,
        date: dateStr,
        time: '18:30-19:30',
        group: 'U13s',
        enabled: true,
        booked: false,
      },
      {
        id: `${dateStr}-u15-1`,
        date: dateStr,
        time: '19:30-20:30',
        group: 'U15s+',
        enabled: true,
        booked: false,
      },
      {
        id: `${dateStr}-u15-2`,
        date: dateStr,
        time: '19:30-20:30',
        group: 'U15s+',
        enabled: true,
        booked: false,
      }
    );
  }
  return slots;
}

const TrainingBookingSystem: React.FC<{ inviteToken?: string }> = ({ inviteToken }) => {
  const [slots, setSlots] = useState<Slot[]>(getInitialSlots());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [inviteTokenState, setInviteTokenState] = useState<string | null>(inviteToken || null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
  const [bookingDone, setBookingDone] = useState<boolean>(false);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const statusRef = React.useRef<HTMLDivElement | null>(null);

  const [inviteData, setInviteData] = useState<any>(null);
  const [loadingInviteData, setLoadingInviteData] = useState(false);
  const [bookingFor, setBookingFor] = useState<'self' | 'someone-else'>('self');
  const [subjectDob, setSubjectDob] = useState<string>('');
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const POLL_INTERVAL_MS = 30000; // refresh availability every 30s

  // Map server slot keys to client labels
  const groupKeyToLabel: Record<string, string> = { u13: 'U13s', u15plus: 'U15s+' };
  const labelToGroupKey: Record<string, string> = { U13s: 'u13', 'U15s+': 'u15plus' };

  // Fetch availability (invite-aware when token present) and update slot counts
  async function fetchAvailability() {
    if (!inviteTokenState) {
      // public availability
      try {
        setLoadingInviteData(true);
        const res = await fetch('/api/booking.json');
        const body = await res.json();
        if (body && body.ok) {
          setInviteData(body);
          const map = new Map();
          (body.availability || []).forEach((a: any) => map.set(a.date, a.slots || {}));
          setSlots((prev) =>
            prev.map((s) => ({
              ...s,
              slotsLeft: map.get(s.date) ? map.get(s.date)[labelToGroupKey[s.group]] ?? null : null,
            }))
          );
        }
      } catch (err) {
        // ignore
      } finally {
        setLoadingInviteData(false);
      }
      return;
    }

    // invite-aware availability
    try {
      setLoadingInviteData(true);
      const res = await fetch(`/api/booking.json?invite=${encodeURIComponent(inviteTokenState)}`);
      const body = await res.json();
      if (body && body.ok) {
        setInviteData(body);

        const map = new Map();
        (body.availability || []).forEach((a: any) => map.set(a.date, a.slots || {}));

        setSlots((prev) => {
          // update slotsLeft
          let updated = prev.map((s) => ({
            ...s,
            slotsLeft: map.get(s.date) ? map.get(s.date)[labelToGroupKey[s.group]] ?? null : null,
          }));

          // build a map of eligibleSlot per date and filter to only eligible groups
          const eligible = new Map<string, string | null>();
          (body.availability || []).forEach((a: any) =>
            eligible.set(a.date, a.eligibleSlot || null)
          );

          updated = updated.filter((s) => {
            const e = eligible.get(s.date);
            if (!e) return true; // if no eligibility info, keep it
            return e === labelToGroupKey[s.group];
          });

          return updated;
        });
      }
    } catch (err) {
      // ignore
    } finally {
      setLoadingInviteData(false);
    }
  }

  // Poll availability periodically
  React.useEffect(() => {
    let id: number | null = null;
    // initial fetch
    fetchAvailability();
    // set interval
    id = window.setInterval(() => fetchAvailability(), POLL_INTERVAL_MS);
    return () => {
      if (id) clearInterval(id);
    };
  }, [inviteTokenState]);

  // If we're loaded with an invite token (either prop or URL), preselect the slot from query params
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qInvite = params.get('invite');
      const qDate = params.get('date');
      const qSlot = params.get('slot');
      if (qInvite && !inviteTokenState) setInviteTokenState(qInvite);

      if (qInvite) {
        // fetch invite data for eligibility and prefilling
        setLoadingInviteData(true);
        fetch(`/api/booking.json?invite=${encodeURIComponent(qInvite)}`)
          .then((r) => r.json())
          .then((b) => {
            if (b && b.ok) {
              setInviteData(b);
              // set default bookingFor based on enquiry presence of dob
              if (b.enquiry && b.enquiry.dob) setBookingFor('self');
              else setBookingFor('someone-else');

              // filter existing client slots to only show DOB-eligible groups
              const eligible = new Map<string, string | null>();
              (b.availability || []).forEach((a: any) =>
                eligible.set(a.date, a.eligibleSlot || null)
              );
              setSlots((prev) =>
                prev.filter((s) => {
                  const e = eligible.get(s.date);
                  if (!e) return true;
                  return e === labelToGroupKey[s.group];
                })
              );
            }
          })
          .catch(() => {})
          .finally(() => setLoadingInviteData(false));
      }

      if (qDate && qSlot) {
        const targetLabel = groupKeyToLabel[qSlot] || qSlot;
        const match = slots.find((s) => s.date === qDate && s.group === targetLabel);
        if (match) {
          setSelectedSlot(match);
          setShowModal(true);
        }
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // Auto-focus status message for accessibility whenever it changes
  React.useEffect(() => {
    if (statusMessage && statusRef.current) {
      statusRef.current.focus();
    }
  }, [statusMessage]);

  const handleSelect = (slot: Slot) => {
    // remember currently focused element so we can return focus on close
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setSelectedSlot(slot);
    setShowModal(true);
    // ensure focus moves into modal when it opens
    setTimeout(() => {
      const btn = document.querySelector('.booking-modal .btn-primary') as HTMLElement | null;
      if (btn) btn.focus();
    }, 50);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
    // return focus to previous element
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  };

  // Placeholder for booking action
  const handleBook = async () => {
    if (!selectedSlot) return;

    // determine DOB to use
    const dobToUse =
      bookingFor === 'self' ? inviteData?.enquiry?.dob || subjectDob || '' : subjectDob || '';
    if (!dobToUse) {
      setStatusMessage('Please provide a date of birth to determine eligibility');
      setStatusType('error');
      return;
    }

    // compute age and slot
    try {
      const age = (await import('../lib/booking')).computeAgeOnDate(
        dobToUse,
        `${selectedSlot.date}T00:00:00`
      );
      const slotCode = (await import('../lib/booking')).slotForAge(age);
      const selectedCode = labelToGroupKey[selectedSlot.group];
      if (slotCode !== selectedCode) {
        setStatusMessage('Selected person is not eligible for this session');
        setStatusType('error');
        return;
      }
    } catch (e) {
      setStatusMessage('Could not determine age/eligibility from provided DOB');
      setStatusType('error');
      return;
    }

    // POST to server with booking_for and subject_dob
    if (inviteTokenState) {
      setStatusMessage('Booking in progress...');
      setStatusType(null);
      setBookingInProgress(true);
      try {
        const res = await fetch('/api/booking.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invite: inviteTokenState,
            session_date: selectedSlot.date,
            booking_for: bookingFor,
            subject_dob: dobToUse,
          }),
        });
        const body = await res.json();
        if (!res.ok || !body.ok) throw new Error(body.error || 'Booking failed');
        // mark local slot as booked
        setSlots((prev) =>
          prev.map((s) => (s.id === selectedSlot.id ? { ...s, booked: true } : s))
        );
        setBookingDone(true);
        setBookingInfo(body.booking || null);
        setStatusMessage('Booking confirmed — check your email for confirmation.');
        setStatusType('success');
      } catch (err: any) {
        setStatusMessage('Booking failed: ' + (err?.message || String(err)));
        setStatusType('error');
      } finally {
        setBookingInProgress(false);
        setShowModal(false);
        setSelectedSlot(null);
      }
      return;
    }

    // Fallback local behavior
    setSlots((prev) => prev.map((s) => (s.id === selectedSlot.id ? { ...s, booked: true } : s)));
    setShowModal(false);
    setSelectedSlot(null);
    setStatusMessage('Booking reserved locally (dev mode)');
    setStatusType('success');
    // TODO: Add notification, email, Airtable integration
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bookings-hero">
        <h2 className="text-3xl font-bold mb-2">Book a Training Session</h2>
        <p className="bookings-lead">
          Choose a session below to reserve a free taster. If you received an invite, use the
          booking link provided in your email.
        </p>
      </div>

      {/* Accessible status area */}
      <div
        aria-live="polite"
        aria-atomic="true"
        tabIndex={-1}
        ref={statusRef}
        style={{ outline: 'none' }}
      >
        {statusMessage ? (
          <div
            className={`p-3 mb-4 rounded ${
              statusType === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : statusType === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-gray-50 border border-gray-200 text-gray-800'
            }`}
            role="status"
          >
            {statusMessage}
          </div>
        ) : null}
      </div>

      <div className="booking-grid">
        {slots.map((slot) => (
          <article
            key={slot.id}
            className={`booking-card p-4 border rounded-lg shadow ${
              slot.booked ? 'bg-gray-200 border-gray-400' : 'card'
            }`}
          >
            <div
              className="card-inner"
              role={slot.booked || !slot.enabled ? undefined : 'button'}
              tabIndex={slot.booked || !slot.enabled ? -1 : 0}
              onClick={() => !slot.booked && slot.enabled && handleSelect(slot)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (!slot.booked && slot.enabled) handleSelect(slot);
                }
              }}
            >
              <div className="date-block" aria-hidden="true">
                <div className="card-title">
                  {new Date(slot.date)
                    .toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })
                    .toUpperCase()}
                </div>
                <div className="date-time text-sm text-gray-500 mt-1">
                  {slot.time.split('-')[0]}
                </div>
              </div>

              <div className="card-content flex-1">
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div className="font-semibold mb-1">
                      {slot.group}{' '}
                      <span className="text-sm text-gray-500">• {formatDate(slot.date)}</span>
                    </div>
                    <div className="session-badge" aria-hidden="true">
                      {slot.group}
                    </div>
                  </div>
                  <div className="text-sm bookings-lead">
                    {slot.time} • <span className="booking-slot-group">{slot.group}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions flex flex-col items-end gap-2">
                {typeof slot.slotsLeft === 'number' ? (
                  slot.slotsLeft > 0 ? (
                    <span className="availability-available">Slots: {slot.slotsLeft}</span>
                  ) : (
                    <span className="availability-full">Full</span>
                  )
                ) : (
                  <span className="availability-unknown">Slots: —</span>
                )}

                <div className="w-full md:w-auto mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!slot.booked && slot.enabled) handleSelect(slot);
                    }}
                    disabled={
                      bookingDone ||
                      slot.booked ||
                      !slot.enabled ||
                      (typeof slot.slotsLeft === 'number' && slot.slotsLeft <= 0)
                    }
                    className={`egac-btn btn btn-cta btn-lg inline-flex items-center gap-2 ${
                      bookingDone ||
                      slot.booked ||
                      !slot.enabled ||
                      (typeof slot.slotsLeft === 'number' && slot.slotsLeft <= 0)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {slot.booked || bookingDone ? (
                      'Booked'
                    ) : (
                      <>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                          focusable={false}
                        >
                          <path
                            d="M7 10h10M7 14h4"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth={2}
                          />
                        </svg>
                        Book
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal for booking confirmation */}
      {showModal && selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center z-50 booking-modal-backdrop">
          <div className="card p-6 rounded-lg shadow-xl booking-modal">
            <h3 className="text-xl font-bold mb-4">Confirm Booking</h3>
            <p className="mb-2">
              <strong>Date:</strong> {formatDate(selectedSlot.date)}
            </p>
            <p className="mb-2">
              <strong>Time:</strong> {selectedSlot.time}
            </p>
            <p className="mb-2">
              <strong>Group:</strong> {selectedSlot.group}
            </p>

            {/* Booking for selector and DOB input (if required) */}
            <div
              className="mb-3 booking-for-options"
              role="radiogroup"
              aria-label="Who are we booking for"
            >
              <div
                role="radio"
                aria-checked={bookingFor === 'self'}
                tabIndex={0}
                onClick={() => setBookingFor('self')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setBookingFor('self');
                }}
                className={`booking-option ${bookingFor === 'self' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="bookingFor"
                  checked={bookingFor === 'self'}
                  onChange={() => setBookingFor('self')}
                  className="sr-only"
                />
                <div className="booking-option-title">Book for myself</div>
                <div className="booking-option-sub">Use invite details</div>
              </div>

              <div
                role="radio"
                aria-checked={bookingFor === 'someone-else'}
                tabIndex={0}
                onClick={() => setBookingFor('someone-else')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setBookingFor('someone-else');
                }}
                className={`booking-option ${bookingFor === 'someone-else' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="bookingFor"
                  checked={bookingFor === 'someone-else'}
                  onChange={() => setBookingFor('someone-else')}
                  className="sr-only"
                />
                <div className="booking-option-title">Book for someone else</div>
                <div className="booking-option-sub">Provide subject's date of birth</div>
              </div>
            </div>

            {(bookingFor === 'someone-else' ||
              (!inviteData?.enquiry?.dob && bookingFor === 'self')) && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subject Date of Birth</label>
                <input
                  type="date"
                  value={subjectDob}
                  onChange={(e) => setSubjectDob(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleBook}
                className="flex-1 egac-btn btn btn-cta"
                disabled={bookingInProgress}
                aria-busy={bookingInProgress}
              >
                {bookingInProgress ? (
                  <span className="inline-flex items-center">
                    <span className="spinner mr-2" aria-hidden="true"></span>Booking...
                  </span>
                ) : (
                  'Confirm booking'
                )}
              </button>
              <button onClick={handleCloseModal} className="flex-1 egac-btn btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingBookingSystem;
