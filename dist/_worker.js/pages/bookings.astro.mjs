globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, p as Fragment } from '../chunks/astro/server_BJplAL8L.mjs';
import { $ as $$Layout } from '../chunks/Layout_BIprt-IE.mjs';
import { R as React, a as reactExports } from '../chunks/_@astro-renderers_rSKK_bSn.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_rSKK_bSn.mjs';
/* empty css                                    */
import { g as getNextNWeekdayDates, C as CONFIG } from '../chunks/booking_CA6h9KO-.mjs';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = React.createContext && /*#__PURE__*/React.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/React.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/React.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaCalendarAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"},"child":[]}]})(props);
}

function formatDate(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function getInitialSlots() {
  const slots = [];
  const today = /* @__PURE__ */ new Date();
  for (let week = 0; week < 4; week++) {
    const tuesday = new Date(today);
    tuesday.setDate(today.getDate() + (2 + 7 - today.getDay()) % 7 + week * 7);
    const dateStr = tuesday.toISOString().slice(0, 10);
    slots.push(
      {
        id: `${dateStr}-u13-1`,
        date: dateStr,
        time: "18:30-19:30",
        group: "U13s",
        enabled: true,
        booked: false
      },
      {
        id: `${dateStr}-u13-2`,
        date: dateStr,
        time: "18:30-19:30",
        group: "U13s",
        enabled: true,
        booked: false
      },
      {
        id: `${dateStr}-u15-1`,
        date: dateStr,
        time: "19:30-20:30",
        group: "U15s+",
        enabled: true,
        booked: false
      },
      {
        id: `${dateStr}-u15-2`,
        date: dateStr,
        time: "19:30-20:30",
        group: "U15s+",
        enabled: true,
        booked: false
      }
    );
  }
  return slots;
}
const TrainingBookingSystem = ({ inviteToken }) => {
  const [slots, setSlots] = reactExports.useState(getInitialSlots());
  const [selectedSlot, setSelectedSlot] = reactExports.useState(null);
  const [showModal, setShowModal] = reactExports.useState(false);
  const [inviteTokenState, setInviteTokenState] = reactExports.useState(inviteToken || null);
  const [statusMessage, setStatusMessage] = reactExports.useState(null);
  const [statusType, setStatusType] = reactExports.useState(null);
  const [bookingDone, setBookingDone] = reactExports.useState(false);
  const [bookingInfo, setBookingInfo] = reactExports.useState(null);
  const statusRef = React.useRef(null);
  const groupKeyToLabel = { u13: "U13s", u15plus: "U15s+" };
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qInvite = params.get("invite");
      const qDate = params.get("date");
      const qSlot = params.get("slot");
      if (qInvite && !inviteTokenState) setInviteTokenState(qInvite);
      if (qDate && qSlot) {
        const targetLabel = groupKeyToLabel[qSlot] || qSlot;
        const match = slots.find((s) => s.date === qDate && s.group === targetLabel);
        if (match) {
          setSelectedSlot(match);
          setShowModal(true);
        }
      }
    } catch (err) {
    }
  }, []);
  React.useEffect(() => {
    if (statusMessage && statusRef.current) {
      statusRef.current.focus();
    }
  }, [statusMessage]);
  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };
  const handleBook = async () => {
    if (!selectedSlot) return;
    if (inviteTokenState) {
      setStatusMessage("Booking in progress...");
      setStatusType(null);
      try {
        const res = await fetch("/api/booking.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invite: inviteTokenState, session_date: selectedSlot.date })
        });
        const body = await res.json();
        if (!res.ok || !body.ok) throw new Error(body.error || "Booking failed");
        setSlots((prev) => prev.map((s) => s.id === selectedSlot.id ? { ...s, booked: true } : s));
        setBookingDone(true);
        setBookingInfo(body.booking || null);
        setStatusMessage("Booking confirmed — check your email for confirmation.");
        setStatusType("success");
      } catch (err) {
        setStatusMessage("Booking failed: " + (err?.message || String(err)));
        setStatusType("error");
      } finally {
        setShowModal(false);
        setSelectedSlot(null);
      }
      return;
    }
    setSlots(
      (prev) => prev.map(
        (s) => s.id === selectedSlot.id ? { ...s, booked: true } : s
      )
    );
    setShowModal(false);
    setSelectedSlot(null);
    setStatusMessage("Booking reserved locally (dev mode)");
    setStatusType("success");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bookings-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-2", children: "Book a Training Session" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bookings-lead", children: "Choose a session below to reserve a free taster. If you received an invite, use the booking link provided in your email." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-live": "polite", "aria-atomic": "true", tabIndex: -1, ref: statusRef, style: { outline: "none" }, children: statusMessage ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 mb-4 rounded ${statusType === "success" ? "bg-green-50 border border-green-200 text-green-800" : statusType === "error" ? "bg-red-50 border border-red-200 text-red-800" : "bg-gray-50 border border-gray-200 text-gray-800"}`, role: "status", children: statusMessage }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "booking-grid", children: slots.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `booking-card p-4 border rounded-lg shadow cursor-pointer transition ${slot.booked ? "bg-gray-200 border-gray-400 cursor-not-allowed" : "card"}`,
        onClick: () => !slot.booked && slot.enabled && handleSelect(slot),
        "aria-disabled": slot.booked || !slot.enabled,
        role: "button",
        tabIndex: slot.booked || !slot.enabled ? -1 : 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (!slot.booked && slot.enabled) handleSelect(slot);
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "booking-meta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FaCalendarAlt, { style: { color: "var(--blue)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: formatDate(slot.date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm bookings-lead", children: [
                slot.time,
                " • ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "booking-slot-group", children: slot.group })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-gray-700", children: slot.booked ? /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            "Booked",
            slot.booker ? ` by ${slot.booker}` : ""
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Available" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Slots: 2" })
          ] }) }),
          !slot.enabled && !slot.booked && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-red-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Unavailable" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "slot-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => !slot.booked && slot.enabled && handleSelect(slot),
                disabled: bookingDone || slot.booked || !slot.enabled,
                className: `btn-primary ${bookingDone || slot.booked || !slot.enabled ? "opacity-50 cursor-not-allowed" : ""}`,
                children: slot.booked || bookingDone ? "Booked" : "Book"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => alert("More info coming soon"),
                className: "bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200",
                children: "Details"
              }
            )
          ] })
        ]
      },
      slot.id
    )) }),
    showModal && selectedSlot && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 flex items-center justify-center z-50 booking-modal-backdrop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-6 rounded-lg shadow-xl booking-modal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-4", children: "Confirm Booking" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Date:" }),
        " ",
        formatDate(selectedSlot.date)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Time:" }),
        " ",
        selectedSlot.time
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Group:" }),
        " ",
        selectedSlot.group
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleBook,
            className: "flex-1 btn-primary",
            children: "Confirm booking"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleCloseModal,
            className: "flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400",
            children: "Cancel"
          }
        )
      ] })
    ] }) })
  ] });
};

const $$Astro = createAstro("https://your-egac-site.pages.dev");
const $$Bookings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Bookings;
  const dates = getNextNWeekdayDates(2, 6);
  const slots = dates.flatMap((date) => [
    { id: `${date}-u13-1`, date, group: "u13" },
    { id: `${date}-u15-1`, date, group: "u15plus" }
  ]);
  let inviteToken = null;
  let inviteData = null;
  let inviteBanner = null;
  try {
    const url = new URL(Astro2.request.url);
    inviteToken = url.searchParams.get("invite");
    if (inviteToken) {
      const apiUrl = new URL(`/api/booking.json?invite=${encodeURIComponent(inviteToken)}`, url.origin).toString();
      const res = await fetch(apiUrl);
      if (res.ok) {
        const body = await res.json();
        if (body && body.ok) {
          inviteData = body;
          const firstAvail = (inviteData.availability || []).find((a) => a.eligibleSlot && a.slots && a.slots[a.eligibleSlot] > 0);
          if (firstAvail) inviteBanner = { eligibleSlot: firstAvail.eligibleSlot, date: firstAvail.date };
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch invite data", err);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Training Session Bookings" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bookings-hero"> <h2 class="text-3xl font-bold mb-2">Book a Training Session</h2> <p class="bookings-lead">Choose a session below to reserve a free taster. If you received an invite, use the booking link provided in your email.</p> </div> ${inviteData ? renderTemplate`<div class="invite-banner p-4 mb-4 border-l-4 border-blue-500 bg-blue-50"> <p class="font-semibold">Invited: ${inviteData.enquiry.name || inviteData.enquiry.email}</p> ${inviteBanner ? renderTemplate`<p>You're eligible for <strong>${CONFIG.slots[inviteBanner.eligibleSlot].label}</strong> on <strong>${new Date(inviteBanner.date).toLocaleDateString("en-GB")}</strong>. Click the <em>Book (invited)</em> button on that session to reserve your spot.</p>` : inviteData.booking ? renderTemplate`<p>You already have a booking on ${inviteData.booking.session_date}.</p>` : renderTemplate`<p>We couldn't find an eligible slot with vacancies; check other dates or contact us.</p>`} </div>` : null}<div class="booking-grid"> ${slots.map((slot) => {
    const slotConfig = CONFIG.slots[slot.group];
    const dateLabel = new Date(slot.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    const availabilityForDate = inviteData?.availability?.find((a) => a.date === slot.date);
    const eligibleForThisDate = availabilityForDate && availabilityForDate.eligibleSlot === slot.group;
    availabilityForDate ? availabilityForDate.slots[slot.group] ?? 0 : null;
    return renderTemplate`<article${addAttribute(slot.id, "key")} class="booking-card p-4 border rounded-lg shadow"> <div class="booking-meta"> <span class="aria-icon">📅</span> <div> <div class="font-semibold">${dateLabel}</div> <div class="text-sm bookings-lead">${slotConfig.time} • <span class="booking-slot-group">${slotConfig.label}</span></div> </div> </div> <div class="slot-actions"> ${inviteData ? inviteData.booking ? renderTemplate`<span class="text-sm">You already booked for ${inviteData.booking.session_date}</span>` : eligibleForThisDate ? renderTemplate`<a${addAttribute(`/bookings?invite=${inviteToken}&date=${slot.date}&slot=${slot.group}`, "href")} class="btn-primary">Book (invited)</a>` : renderTemplate`<button class="bg-gray-100 text-gray-800 py-2 px-4 rounded" disabled>Not eligible</button>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <a${addAttribute(`/booking?date=${slot.date}&slot=${slot.group}`, "href")} class="btn-primary">Book</a> <button class="bg-gray-100 text-gray-800 py-2 px-4 rounded">Details</button> ` })}`} </div> </article>`;
  })} <!-- Interactive client component for invite-aware booking (hydrated only when invite present) --> ${inviteToken ? renderTemplate`${renderComponent($$result2, "TrainingBookingSystem", TrainingBookingSystem, { "client:load": true, "inviteToken": inviteToken, "client:component-hydration": "load", "client:component-path": "/home/eddie/athletics/egac_1/src/components/TrainingBookingSystem", "client:component-export": "default" })}` : null} </div> ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/bookings.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/bookings.astro";
const $$url = "/bookings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Bookings,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
