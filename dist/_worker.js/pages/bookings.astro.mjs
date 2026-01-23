globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_D9mQmrFP.mjs';
import { $ as $$Layout } from '../chunks/Layout_BqUPBaKK.mjs';
import { R as React, a as reactExports } from '../chunks/_@astro-renderers_BTUeEnL1.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BTUeEnL1.mjs';
/* empty css                                    */
import { C as CONFIG, g as getNextNWeekdayDates } from '../chunks/booking_CA6h9KO-.mjs';

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
function getInitialSlots(weeks = 6) {
  const dates = getNextNWeekdayDates(2, weeks);
  const slots = [];
  for (const dateStr of dates) {
    slots.push({ id: `${dateStr}-u13`, date: dateStr, time: CONFIG.slots.u13.time, group: "u13", label: CONFIG.slots.u13.label, enabled: true, booked: false, slotsLeft: CONFIG.capacityPerSlot });
    slots.push({ id: `${dateStr}-u15plus`, date: dateStr, time: CONFIG.slots.u15plus.time, group: "u15plus", label: CONFIG.slots.u15plus.label, enabled: true, booked: false, slotsLeft: CONFIG.capacityPerSlot });
  }
  return slots;
}
function getVisibleSlots(allSlots, invitePresent) {
  if (invitePresent) return allSlots.filter((s) => s.eligible && s.enabled);
  return allSlots.filter((s) => s.enabled);
}
const TrainingBookingSystem = ({ inviteToken }) => {
  const [slots, setSlots] = reactExports.useState(getInitialSlots(6));
  const [selectedSlot, setSelectedSlot] = reactExports.useState(null);
  const [showModal, setShowModal] = reactExports.useState(false);
  const [inviteTokenState, setInviteTokenState] = reactExports.useState(inviteToken || null);
  const [statusMessage, setStatusMessage] = reactExports.useState(null);
  const [statusType, setStatusType] = reactExports.useState(null);
  const [bookingDone, setBookingDone] = reactExports.useState(false);
  const [bookingInfo, setBookingInfo] = reactExports.useState(null);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [showConfirmation, setShowConfirmation] = reactExports.useState(false);
  const redirectTimerRef = React.useRef(null);
  const REDIRECT_DELAY = 6e3;
  const statusRef = React.useRef(null);
  React.useEffect(() => {
    return () => {
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    };
  }, []);
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qInvite = params.get("invite");
      const qDate = params.get("date");
      const qSlot = params.get("slot");
      if (qInvite && !inviteTokenState) setInviteTokenState(qInvite);
      if (qDate && qSlot) {
        const match = slots.find((s) => s.date === qDate && s.group === qSlot);
        if (match) {
          setSelectedSlot(match);
          setShowModal(true);
        }
      }
    } catch (err) {
    }
  }, []);
  React.useEffect(() => {
    async function loadInvite() {
      if (!inviteTokenState) return;
      try {
        const res = await fetch(`/api/booking.json?invite=${encodeURIComponent(inviteTokenState)}`);
        const body = await res.json();
        if (!res.ok || !body.ok) {
          setStatusMessage("Failed to load invite data");
          setStatusType("error");
          return;
        }
        const availability = (body.availability || []).reduce((acc, a) => {
          acc[a.date] = a;
          return acc;
        }, {});
        setSlots((prev) => prev.map((s) => {
          const a = availability[s.date];
          if (!a) return s;
          const slotsLeft = a.slots && typeof a.slots[s.group] === "number" ? a.slots[s.group] : CONFIG.capacityPerSlot;
          const eligible = a.eligibleSlot === s.group;
          return { ...s, slotsLeft, enabled: slotsLeft > 0, eligible };
        }));
        if (body.booking) {
          setBookingDone(true);
          setBookingInfo(body.booking);
          setStatusMessage("You already have a booking — check your email.");
          setStatusType("success");
        }
      } catch (err) {
        setStatusMessage("Failed to fetch availability");
        setStatusType("error");
      }
    }
    loadInvite();
  }, [inviteTokenState]);
  React.useEffect(() => {
    async function loadPublicAvailability() {
      if (inviteTokenState) return;
      try {
        const res = await fetch("/api/booking.json");
        const body = await res.json();
        if (!res.ok || !body.ok) return;
        const availability = (body.availability || []).reduce((acc, a) => {
          acc[a.date] = a;
          return acc;
        }, {});
        setSlots((prev) => prev.map((s) => {
          const a = availability[s.date];
          if (!a) return s;
          const slotsLeft = a.slots && typeof a.slots[s.group] === "number" ? a.slots[s.group] : CONFIG.capacityPerSlot;
          return { ...s, slotsLeft, enabled: slotsLeft > 0 };
        }));
      } catch (err) {
      }
    }
    loadPublicAvailability();
  }, [inviteTokenState]);
  const visibleSlots = getVisibleSlots(slots, !!inviteTokenState);
  const eligibleLabel = inviteTokenState ? slots.find((s) => s.eligible)?.label ?? null : null;
  React.useEffect(() => {
    if (statusMessage && statusRef.current) {
      statusRef.current.focus();
    }
  }, [statusMessage]);
  const handleSelect = (slot) => {
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
        if (!res.ok || !body.ok) {
          if (res.status === 409 && body.booking) {
            setBookingDone(true);
            setBookingInfo(body.booking);
            setStatusMessage("A booking already exists for this invite.");
            setStatusType("success");
            return;
          }
          throw new Error(body.error || "Booking failed");
        }
        setSlots((prev) => prev.map((s) => s.id === `${selectedSlot.date}-${selectedSlot.group}` ? { ...s, booked: true, slotsLeft: (s.slotsLeft || 1) - 1 } : s));
        setBookingDone(true);
        setBookingInfo(body.booking || null);
        setStatusMessage("Booking confirmed — check your email for confirmation.");
        setStatusType("success");
        setShowConfirmation(true);
        if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = window.setTimeout(() => {
          window.location.assign("/");
        }, REDIRECT_DELAY);
      } catch (err) {
        setStatusMessage("Booking failed: " + (err?.message || String(err)));
        setStatusType("error");
      } finally {
        setSubmitting(false);
        setShowModal(false);
        setSelectedSlot(null);
      }
      return;
    }
    setSlots((prev) => prev.map((s) => s.id === selectedSlot.id ? { ...s, booked: true } : s));
    setShowModal(false);
    setSelectedSlot(null);
    setBookingDone(true);
    setBookingInfo({ id: "local-dev", session_date: selectedSlot.date, slot: selectedSlot.group, session_time: selectedSlot.time });
    setStatusMessage("Booking reserved locally (dev mode) — check your email (dev)");
    setStatusType("success");
    setShowConfirmation(true);
    if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    redirectTimerRef.current = window.setTimeout(() => {
      window.location.assign("/");
    }, REDIRECT_DELAY);
    setSubmitting(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto py-8 px-4 booking-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bookings-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-2", children: "Book a Training Session" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bookings-lead", children: "Choose a session below to reserve a free taster. If you received an invite, it will show your eligible slot and held availability." })
    ] }),
    showConfirmation && bookingInfo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 mb-6 rounded-lg border-l-4 border-green-500 bg-green-50", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold", children: "Booking confirmed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2", children: [
        "Your session on ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: new Date(bookingInfo.session_date).toLocaleDateString("en-GB") }),
        " (",
        CONFIG.slots[bookingInfo.slot]?.label || bookingInfo.slot,
        ") has been booked. A confirmation email has been sent to the email address you provided when enquiring (check your inbox and spam folder)."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2", children: [
        "You will be returned to the home page in ",
        Math.round(REDIRECT_DELAY / 1e3),
        " seconds."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", style: { display: "flex", gap: "0.5rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
          window.location.assign("/");
        }, className: "btn-primary", children: "Return home now" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowConfirmation(false);
          if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
        }, className: "btn-ghost", children: "Stay on page" })
      ] })
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-live": "polite", "aria-atomic": "true", tabIndex: -1, ref: statusRef, style: { outline: "none" }, children: statusMessage ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 mb-4 rounded ${statusType === "success" ? "status-success" : statusType === "error" ? "status-error" : "bg-gray-50"}`, role: "status", children: statusMessage }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "booking-grid", children: [
      inviteTokenState ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 mb-4 rounded border-l-4 border-blue-500 bg-blue-50", children: eligibleLabel ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small-muted", children: [
        "Showing sessions for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: eligibleLabel }),
        ". If none are listed, it means there are no vacancies in your group."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small-muted", children: "You're invited — showing only sessions for your eligible group." }) }) : null,
      visibleSlots.length === 0 && inviteTokenState ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 mb-4 rounded bg-yellow-50 border border-yellow-200", children: "No eligible sessions with vacancies were found for your group. Please check other dates or contact us." }) : null,
      visibleSlots.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `booking-card ${slot.booked ? "bg-gray-100" : ""} ${slot.eligible ? "eligible-card" : ""}`,
          onClick: () => handleSelect(slot),
          role: "button",
          tabIndex: slot.enabled && !slot.booked ? 0 : -1,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "booking-meta", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FaCalendarAlt, { style: { color: "var(--blue)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "date", children: formatDate(slot.date) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "time small-muted", children: [
                    slot.time,
                    " • ",
                    slot.label
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "capacity-badge", children: [
                  slot.slotsLeft ?? CONFIG.capacityPerSlot,
                  " left"
                ] }),
                slot.eligible ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "eligible-pill", children: "Your slot" }) : null,
                !slot.enabled && !slot.booked ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "small-muted", children: "Full" }) : null
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "slot-actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleSelect(slot),
                disabled: !slot.enabled || slot.booked || bookingDone,
                className: "btn-primary",
                children: slot.booked ? "Booked" : slot.enabled ? "Book" : "Full"
              }
            ) })
          ]
        },
        slot.id
      ))
    ] }),
    showModal && selectedSlot && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 flex items-center justify-center z-50 booking-modal-backdrop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card booking-modal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Confirm Booking" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Date:" }),
          " ",
          formatDate(selectedSlot.date)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Time:" }),
          " ",
          selectedSlot.time
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-4 small-muted", children: [
        "Group: ",
        selectedSlot.label
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "1rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleBook, disabled: submitting, className: "btn-primary", style: { flex: 1 }, children: submitting ? "Booking…" : "Confirm booking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCloseModal, className: "btn-ghost", style: { flex: 1 }, children: "Cancel" })
      ] })
    ] }) })
  ] });
};

const $$Astro = createAstro("https://your-egac-site.pages.dev");
const $$Bookings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Bookings;
  const dates = getNextNWeekdayDates(2, 6);
  dates.flatMap((date) => [
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
  let pageAvailability = null;
  if (!inviteToken) {
    try {
      const apiUrl = new URL(`/api/booking.json`, new URL(Astro2.request.url).origin).toString();
      const r = await fetch(apiUrl);
      if (r.ok) {
        const body = await r.json();
        if (body && body.ok) pageAvailability = body.availability;
      }
    } catch (e) {
      console.error("Failed to fetch availability for public bookings page", e);
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Training Session Bookings" }, { "default": async ($$result2) => renderTemplate`${inviteData ? renderTemplate`${maybeRenderHead()}<div class="invite-banner"> <div style="flex:1;"> <div class="meta">Invited: ${inviteData.enquiry.name || inviteData.enquiry.email}</div> ${inviteBanner ? renderTemplate`<div class="hint">You're eligible for <strong>${CONFIG.slots[inviteBanner.eligibleSlot].label}</strong> on <strong>${new Date(inviteBanner.date).toLocaleDateString("en-GB")}</strong>. Use the <em>Book (invited)</em> button to reserve your spot — it's held for you for a limited time.</div>` : inviteData.booking ? renderTemplate`<div class="hint">You already have a booking on ${inviteData.booking.session_date} — check your email for confirmation.</div>` : renderTemplate`<div class="hint">We couldn't find an eligible slot with vacancies; check other dates or contact us.</div>`} </div> <div style="text-align:right;"> <a class="btn-primary"${addAttribute(`/bookings?invite=${inviteData.invite.token}`, "href")}>View available sessions</a> </div> </div>` : null}<div> ${renderComponent($$result2, "TrainingBookingSystem", TrainingBookingSystem, { "client:load": true, "inviteToken": inviteToken, "client:component-hydration": "load", "client:component-path": "/home/eddie/athletics/egac_1/src/components/TrainingBookingSystem", "client:component-export": "default" })} </div>` })}`;
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
