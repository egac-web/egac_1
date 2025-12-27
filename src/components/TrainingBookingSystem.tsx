import React, { useState } from "react";
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
      <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--blue)' }}>Book a Training Session</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`p-4 border rounded-lg shadow cursor-pointer transition ${slot.booked
                ? "bg-gray-200 border-gray-400 cursor-not-allowed"
                : "card hover:shadow-lg"
              }`}
            onClick={() => !slot.booked && slot.enabled && handleSelect(slot)}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarAlt style={{ color: 'var(--blue)' }} />
              <span className="font-semibold">{formatDate(slot.date)}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <FaClock style={{ color: 'var(--blue)' }} />
              <span>{slot.time}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <FaUsers style={{ color: 'var(--blue)' }} />
              <span>{slot.group}</span>
            </div>
            {slot.booked && (
              <div className="mt-2 text-sm text-gray-600">
                <strong>Booked</strong>
                {slot.booker && ` by ${slot.booker}`}
              </div>
            )}
            {!slot.enabled && !slot.booked && (
              <div className="mt-2 text-sm text-red-600">
                <strong>Unavailable</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for booking confirmation */}
      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-6 rounded-lg shadow-xl max-w-md w-full">
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
                Confirm
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
