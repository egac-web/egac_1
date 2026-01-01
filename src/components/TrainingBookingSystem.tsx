import React, { useState } from "react";
import "../styles/bookings.css";
import { FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";

function formatDate(date: string): string {
  // Expects date in ISO format (e.g., "2024-06-11")
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
  time: string;
  group: string;
  enabled: boolean;
  booked: boolean;
  booker?: string;
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
        time: "18:30-19:30",
        group: "U13s",
        enabled: true,
        booked: false,
      },
      {
        id: `${dateStr}-u13-2`,
        date: dateStr,
        time: "18:30-19:30",
        group: "U13s",
        enabled: true,
        booked: false,
      },
      {
        id: `${dateStr}-u15-1`,
        date: dateStr,
        time: "19:30-20:30",
        group: "U15s+",
        enabled: true,
        booked: false,
      },
      {
        id: `${dateStr}-u15-2`,
        date: dateStr,
        time: "19:30-20:30",
        group: "U15s+",
        enabled: true,
        booked: false,
      }
    );
  }
  return slots;
}

const TrainingBookingSystem: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>(getInitialSlots());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  // Placeholder for booking action
  const handleBook = () => {
    if (!selectedSlot) return;
    setSlots((prev) =>
      prev.map((s) =>
        s.id === selectedSlot.id ? { ...s, booked: true } : s
      )
    );
    setShowModal(false);
    setSelectedSlot(null);
    // TODO: Add notification, email, Airtable integration
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bookings-hero">
        <h2 className="text-3xl font-bold mb-2">Book a Training Session</h2>
        <p className="bookings-lead">Choose a session below to reserve a free taster. If you received an invite, use the booking link provided in your email.</p>
      </div>

      <div className="booking-grid">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`booking-card p-4 border rounded-lg shadow cursor-pointer transition ${slot.booked
                ? "bg-gray-200 border-gray-400 cursor-not-allowed"
                : "card"
              }`}
            onClick={() => !slot.booked && slot.enabled && handleSelect(slot)}
            aria-disabled={slot.booked || !slot.enabled}
            role="button"
            tabIndex={slot.booked || !slot.enabled ? -1 : 0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (!slot.booked && slot.enabled) handleSelect(slot); } }}
          >
            <div className="booking-meta">
              <FaCalendarAlt style={{ color: 'var(--blue)' }} />
              <div>
                <div className="font-semibold">{formatDate(slot.date)}</div>
                <div className="text-sm bookings-lead">{slot.time} • <span className="booking-slot-group">{slot.group}</span></div>
              </div>
            </div>

            {/* capacity / status */}
            <div className="mt-2 text-sm text-gray-700">
              {slot.booked ? (
                <strong>Booked{slot.booker ? ` by ${slot.booker}` : ''}</strong>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Available</div>
                  <div className="text-sm text-gray-600">Slots: 2</div>
                </div>
              )}
            </div>

            {!slot.enabled && !slot.booked && (
              <div className="mt-2 text-sm text-red-600">
                <strong>Unavailable</strong>
              </div>
            )}

            <div className="slot-actions">
              <button
                onClick={() => !slot.booked && slot.enabled && handleSelect(slot)}
                disabled={slot.booked || !slot.enabled}
                className={`btn-primary ${slot.booked || !slot.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {slot.booked ? 'Booked' : 'Book'}
              </button>
              <button
                onClick={() => alert('More info coming soon')}
                className="bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200"
              >
                Details
              </button>
            </div>
          </div>
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
            <p className="mb-4">
              <strong>Group:</strong> {selectedSlot.group}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleBook}
                className="flex-1 btn-primary"
              >
                Confirm booking
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
              >
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
