globalThis.process ??= {}; globalThis.process.env ??= {};
import { countBookingsForDateSlot, getInviteByToken, getSupabaseAdmin, getBookingByInvite, createBooking, markInviteAccepted, appendEnquiryEvent } from '../../chunks/supabase_BuGpVBnm.mjs';
import { sendBookingConfirmation, sendInviteEmail } from '../../chunks/resend_DtyeWbHC.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_KnGPrR4n.mjs';

/**
 * @module constants
 * @summary Useful constants
 * @description
 * Collection of useful date constants.
 *
 * The constants could be imported from `date-fns/constants`:
 *
 * ```ts
 * import { maxTime, minTime } from "./constants/date-fns/constants";
 *
 * function isAllowedTime(time) {
 *   return time <= maxTime && time >= minTime;
 * }
 * ```
 */


/**
 * @constant
 * @name millisecondsInMinute
 * @summary Milliseconds in 1 minute
 */
const millisecondsInMinute = 60000;

/**
 * @constant
 * @name millisecondsInHour
 * @summary Milliseconds in 1 hour
 */
const millisecondsInHour = 3600000;

/**
 * @constant
 * @name constructFromSymbol
 * @summary Symbol enabling Date extensions to inherit properties from the reference date.
 *
 * The symbol is used to enable the `constructFrom` function to construct a date
 * using a reference date and a value. It allows to transfer extra properties
 * from the reference date to the new date. It's useful for extensions like
 * [`TZDate`](https://github.com/date-fns/tz) that accept a time zone as
 * a constructor argument.
 */
const constructFromSymbol = Symbol.for("constructDateFrom");

/**
 * @name constructFrom
 * @category Generic Helpers
 * @summary Constructs a date using the reference date and the value
 *
 * @description
 * The function constructs a new date using the constructor from the reference
 * date and the given value. It helps to build generic functions that accept
 * date extensions.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * Starting from v3.7.0, it allows to construct a date using `[Symbol.for("constructDateFrom")]`
 * enabling to transfer extra properties from the reference date to the new date.
 * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
 * that accept a time zone as a constructor argument.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 * @param value - The value to create the date
 *
 * @returns Date initialized using the given date and value
 *
 * @example
 * import { constructFrom } from "./constructFrom/date-fns";
 *
 * // A function that clones a date preserving the original type
 * function cloneDate<DateType extends Date>(date: DateType): DateType {
 *   return constructFrom(
 *     date, // Use constructor from the given date
 *     date.getTime() // Use the date value to create a new date
 *   );
 * }
 */
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);

  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);

  if (date instanceof Date) return new date.constructor(value);

  return new Date(value);
}

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * Starting from v3.7.0, it clones a date using `[Symbol.for("constructDateFrom")]`
 * enabling to transfer extra properties from the reference date to the new date.
 * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
 * that accept a time zone as a constructor argument.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param argument - The value to convert
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument, context) {
  // [TODO] Get rid of `toDate` or `constructFrom`?
  return constructFrom(argument, argument);
}

/**
 * The {@link addDays} function options.
 */

/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The date to be changed
 * @param amount - The amount of days to be added.
 * @param options - An object with options
 *
 * @returns The new date with the days added
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * const result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 */
function addDays(date, amount, options) {
  const _date = toDate(date);
  if (isNaN(amount)) return constructFrom(date, NaN);

  // If 0 days, no-op to avoid changing times in the hour before end of DST
  if (!amount) return _date;

  _date.setDate(_date.getDate() + amount);
  return _date;
}

function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    dates.find((date) => typeof date === "object"),
  );
  return dates.map(normalize);
}

/**
 * @name compareAsc
 * @category Common Helpers
 * @summary Compare the two dates and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return 1 if the first date is after the second,
 * -1 if the first date is before the second or 0 if dates are equal.
 *
 * @param dateLeft - The first date to compare
 * @param dateRight - The second date to compare
 *
 * @returns The result of the comparison
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989:
 * const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
 * //=> -1
 *
 * @example
 * // Sort the array of dates:
 * const result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareAsc)
 * //=> [
 * //   Wed Feb 11 1987 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Sun Jul 02 1995 00:00:00
 * // ]
 */
function compareAsc(dateLeft, dateRight) {
  const diff = +toDate(dateLeft) - +toDate(dateRight);

  if (diff < 0) return -1;
  else if (diff > 0) return 1;

  // Return 0 if diff is 0; return NaN if diff is NaN
  return diff;
}

/**
 * The {@link differenceInCalendarYears} function options.
 */

/**
 * @name differenceInCalendarYears
 * @category Year Helpers
 * @summary Get the number of calendar years between the given dates.
 *
 * @description
 * Get the number of calendar years between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options

 * @returns The number of calendar years
 *
 * @example
 * // How many calendar years are between 31 December 2013 and 11 February 2015?
 * const result = differenceInCalendarYears(
 *   new Date(2015, 1, 11),
 *   new Date(2013, 11, 31)
 * );
 * //=> 2
 */
function differenceInCalendarYears(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate,
  );
  return laterDate_.getFullYear() - earlierDate_.getFullYear();
}

/**
 * The {@link differenceInYears} function options.
 */

/**
 * @name differenceInYears
 * @category Year Helpers
 * @summary Get the number of full years between the given dates.
 *
 * @description
 * Get the number of full years between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options
 *
 * @returns The number of full years
 *
 * @example
 * // How many full years are between 31 December 2013 and 11 February 2015?
 * const result = differenceInYears(new Date(2015, 1, 11), new Date(2013, 11, 31))
 * //=> 1
 */
function differenceInYears(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate,
  );

  // -1 if the left date is earlier than the right date
  // 2023-12-31 - 2024-01-01 = -1
  const sign = compareAsc(laterDate_, earlierDate_);

  // First calculate the difference in calendar years
  // 2024-01-01 - 2023-12-31 = 1 year
  const diff = Math.abs(differenceInCalendarYears(laterDate_, earlierDate_));

  // Now we need to calculate if the difference is full. To do that we set
  // both dates to the same year and check if the both date's month and day
  // form a full year.
  laterDate_.setFullYear(1584);
  earlierDate_.setFullYear(1584);

  // For it to be true, when the later date is indeed later than the earlier date
  // (2026-02-01 - 2023-12-10 = 3 years), the difference is full if
  // the normalized later date is also later than the normalized earlier date.
  // In our example, 1584-02-01 is earlier than 1584-12-10, so the difference
  // is partial, hence we need to subtract 1 from the difference 3 - 1 = 2.
  const partial = compareAsc(laterDate_, earlierDate_) === -sign;

  const result = sign * (diff - +partial);

  // Prevent negative zero
  return result === 0 ? 0 : result;
}

/**
 * The {@link parseISO} function options.
 */

/**
 * @name parseISO
 * @category Common Helpers
 * @summary Parse ISO string
 *
 * @description
 * Parse the given string in ISO 8601 format and return an instance of Date.
 *
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If the argument isn't a string, the function cannot parse the string or
 * the values are invalid, it returns Invalid Date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param argument - The value to convert
 * @param options - An object with options
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * const result = parseISO('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert string '+02014101' to date,
 * // if the additional number of digits in the extended year format is 1:
 * const result = parseISO('+02014101', { additionalDigits: 1 })
 * //=> Fri Apr 11 2014 00:00:00
 */
function parseISO(argument, options) {
  const invalidDate = () => constructFrom(options?.in, NaN);

  const additionalDigits = 2;
  const dateStrings = splitDateString(argument);

  let date;
  if (dateStrings.date) {
    const parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }

  if (!date || isNaN(+date)) return invalidDate();

  const timestamp = +date;
  let time = 0;
  let offset;

  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) return invalidDate();
  }

  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) return invalidDate();
  } else {
    const tmpDate = new Date(timestamp + time);
    const result = toDate(0);
    result.setFullYear(
      tmpDate.getUTCFullYear(),
      tmpDate.getUTCMonth(),
      tmpDate.getUTCDate(),
    );
    result.setHours(
      tmpDate.getUTCHours(),
      tmpDate.getUTCMinutes(),
      tmpDate.getUTCSeconds(),
      tmpDate.getUTCMilliseconds(),
    );
    return result;
  }

  return toDate(timestamp + time + offset);
}

const patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/,
};

const dateRegex =
  /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
const timeRegex =
  /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
const timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;

function splitDateString(dateString) {
  const dateStrings = {};
  const array = dateString.split(patterns.dateTimeDelimiter);
  let timeString;

  // The regex match should only return at maximum two array elements.
  // [date], [time], or [date, time].
  if (array.length > 2) {
    return dateStrings;
  }

  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(
        dateStrings.date.length,
        dateString.length,
      );
    }
  }

  if (timeString) {
    const token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings;
}

function parseYear(dateString, additionalDigits) {
  const regex = new RegExp(
    "^(?:(\\d{4}|[+-]\\d{" +
      (4 + additionalDigits) +
      "})|(\\d{2}|[+-]\\d{" +
      (2 + additionalDigits) +
      "})$)",
  );

  const captures = dateString.match(regex);
  // Invalid ISO-formatted year
  if (!captures) return { year: NaN, restDateString: "" };

  const year = captures[1] ? parseInt(captures[1]) : null;
  const century = captures[2] ? parseInt(captures[2]) : null;

  // either year or century is null, not both
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length),
  };
}

function parseDate(dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) return new Date(NaN);

  const captures = dateString.match(dateRegex);
  // Invalid ISO-formatted string
  if (!captures) return new Date(NaN);

  const isWeekDate = !!captures[4];
  const dayOfYear = parseDateUnit(captures[1]);
  const month = parseDateUnit(captures[2]) - 1;
  const day = parseDateUnit(captures[3]);
  const week = parseDateUnit(captures[4]);
  const dayOfWeek = parseDateUnit(captures[5]) - 1;

  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    const date = new Date(0);
    if (
      !validateDate(year, month, day) ||
      !validateDayOfYearDate(year, dayOfYear)
    ) {
      return new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}

function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}

function parseTime(timeString) {
  const captures = timeString.match(timeRegex);
  if (!captures) return NaN; // Invalid ISO-formatted time

  const hours = parseTimeUnit(captures[1]);
  const minutes = parseTimeUnit(captures[2]);
  const seconds = parseTimeUnit(captures[3]);

  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }

  return (
    hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1000
  );
}

function parseTimeUnit(value) {
  return (value && parseFloat(value.replace(",", "."))) || 0;
}

function parseTimezone(timezoneString) {
  if (timezoneString === "Z") return 0;

  const captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;

  const sign = captures[1] === "+" ? -1 : 1;
  const hours = parseInt(captures[2]);
  const minutes = (captures[3] && parseInt(captures[3])) || 0;

  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }

  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}

function dayOfISOWeekYear(isoWeekYear, week, day) {
  const date = new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  const fourthOfJanuaryDay = date.getUTCDay() || 7;
  const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// Validation functions

// February is null to handle the leap year (using ||)
const daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYearIndex(year) {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function validateDate(year, month, date) {
  return (
    month >= 0 &&
    month <= 11 &&
    date >= 1 &&
    date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28))
  );
}

function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}

function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}

function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }

  return (
    seconds >= 0 &&
    seconds < 60 &&
    minutes >= 0 &&
    minutes < 60 &&
    hours >= 0 &&
    hours < 25
  );
}

function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}

const CONFIG = {
  capacityPerSlot: 2,
  weeksAhead: 8,
  timezone: "Europe/London",
  // age boundary: <13 -> U13; >=13 -> U15+ (Option A)
  ageBoundaryForU15: 13,
  slots: {
    u13: { label: "U13 (Tue 18:30)", time: "18:30", code: "u13" },
    u15plus: { label: "U15+ (Tue 19:30)", time: "19:30", code: "u15plus" }
  }
};
function computeAgeOnDate(dobIso, dateIso) {
  if (!dobIso) return null;
  const dob = parseISO(dobIso);
  const at = parseISO(dateIso);
  return differenceInYears(at, dob);
}
function slotForAge(age) {
  if (age === null || age === void 0) return null;
  return age < CONFIG.ageBoundaryForU15 ? CONFIG.slots.u13.code : CONFIG.slots.u15plus.code;
}
function getNextNWeekdayDates(weekday = 2, n = CONFIG.weeksAhead) {
  const dates = [];
  const today = /* @__PURE__ */ new Date();
  let d = new Date(today);
  const offset = (weekday - d.getDay() + 7) % 7;
  d = addDays(d, offset);
  for (let i = 0; i < n; i++) {
    const next = addDays(d, i * 7);
    dates.push(next.toISOString().slice(0, 10));
  }
  return dates;
}

async function get({ request }) {
  try {
    const url = new URL(request.url);
    const inviteToken = url.searchParams.get("invite");
    const dateParam = url.searchParams.get("date");
    if (!inviteToken && !dateParam) {
      const dates = getNextNWeekdayDates(2, CONFIG.weeksAhead);
      const availabilityPromises = dates.map(async (d) => {
        const u13Count = await countBookingsForDateSlot(d, "u13");
        const u15Count = await countBookingsForDateSlot(d, "u15plus");
        return { date: d, slots: { u13: CONFIG.capacityPerSlot - u13Count, u15plus: CONFIG.capacityPerSlot - u15Count } };
      });
      const availability = await Promise.all(availabilityPromises);
      return { status: 200, body: { ok: true, availability } };
    }
    if (inviteToken) {
      const invite = await getInviteByToken(inviteToken);
      if (!invite) return { status: 404, body: { ok: false, error: "Invalid invite" } };
      const client = getSupabaseAdmin();
      const { data: enqRes, error } = await client.from("enquiries").select("*").eq("id", invite.enquiry_id).maybeSingle();
      if (error) throw error;
      const enquiry = enqRes;
      const dates = getNextNWeekdayDates(2, CONFIG.weeksAhead);
      const availabilityPromises = dates.map(async (d) => {
        const age = enquiry.dob ? computeAgeOnDate(enquiry.dob, `${d}T00:00:00`) : null;
        const eligibleSlot = age !== null ? slotForAge(age) : null;
        const u13Count = await countBookingsForDateSlot(d, "u13");
        const u15Count = await countBookingsForDateSlot(d, "u15plus");
        return { date: d, eligibleSlot, slots: { u13: CONFIG.capacityPerSlot - u13Count, u15plus: CONFIG.capacityPerSlot - u15Count } };
      });
      const availability = await Promise.all(availabilityPromises);
      const existingBooking = await getBookingByInvite(invite.id);
      return { status: 200, body: { ok: true, invite, enquiry, availability, booking: existingBooking } };
    }
  } catch (err) {
    console.error("Booking GET error", err);
    return { status: 500, body: { ok: false, error: "Server error" } };
  }
}
async function post({ request }) {
  try {
    const body = await request.json();
    const { invite: inviteToken, session_date } = body;
    if (!inviteToken || !session_date) return { status: 400, body: { ok: false, error: "invite and session_date required" } };
    const invite = await getInviteByToken(inviteToken);
    if (!invite) return { status: 404, body: { ok: false, error: "Invalid invite" } };
    if (invite.status !== "pending") return { status: 400, body: { ok: false, error: "Invite is not available for booking" } };
    const client = getSupabaseAdmin();
    const { data: enqRes, error } = await client.from("enquiries").select("*").eq("id", invite.enquiry_id).maybeSingle();
    if (error) throw error;
    const enquiry = enqRes;
    const dob = enquiry.dob;
    if (!dob) return { status: 400, body: { ok: false, error: "DOB required to determine age group" } };
    const age = computeAgeOnDate(dob, `${session_date}T00:00:00`);
    const slot = slotForAge(age);
    if (!slot) return { status: 400, body: { ok: false, error: "Unable to determine slot for age" } };
    const count = await countBookingsForDateSlot(session_date, slot);
    if (count >= CONFIG.capacityPerSlot) return { status: 409, body: { ok: false, error: "No vacancies for this session" } };
    const session_time = CONFIG.slots[slot].time + ":00";
    const booking = await createBooking(enquiry.id, invite.id, session_date, slot, session_time);
    try {
      await markInviteAccepted(invite.id);
      await appendEnquiryEvent(enquiry.id, { type: "booking_created", booking_id: booking.id, session_date, slot, at: (/* @__PURE__ */ new Date()).toISOString() });
    } catch (err) {
      console.error("Failed to mark accepted/append event", err);
    }
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      try {
        const res = await sendBookingConfirmation({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: enquiry.email, date: session_date, slotLabel: CONFIG.slots[slot].label });
        try {
          await appendEnquiryEvent(enquiry.id, { type: "booking_confirm_email_sent", booking_id: booking.id, resend_id: res.id, at: (/* @__PURE__ */ new Date()).toISOString(), meta: res.raw });
        } catch (err) {
          console.error("append event failed", err);
        }
      } catch (err) {
        console.error("Failed to send booking confirmation", err);
        try {
          await appendEnquiryEvent(enquiry.id, { type: "booking_confirm_email_failed", booking_id: booking.id, error: err && err.response ? err.response : String(err), at: (/* @__PURE__ */ new Date()).toISOString() });
        } catch (e) {
          console.error("append event failed", e);
        }
      }
    }
    try {
      const client2 = getSupabaseAdmin();
      await client2.from("enquiries").update({ booking_id: booking.id, booking_date: booking.session_date }).eq("id", enquiry.id);
    } catch (err) {
      console.error("Failed to update enquiry with booking info", err);
    }
    if (process.env.MEMBERSHIP_SECRETARY_EMAIL && process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      try {
        const subject = `EGAC: New taster booking for ${enquiry.name || enquiry.email}`;
        const html = `<p>A new taster booking has been made:</p><ul><li>Enquiry ID: ${enquiry.id}</li><li>Name: ${enquiry.name || ""}</li><li>Email: ${enquiry.email}</li><li>Session date: ${session_date}</li><li>Slot: ${slot}</li><li>Booking ID: ${booking.id}</li></ul>`;
        const text = `New taster booking: ${session_date} (${slot}) for ${enquiry.name || enquiry.email}. Booking ID: ${booking.id}`;
        const res2 = await sendInviteEmail({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: process.env.MEMBERSHIP_SECRETARY_EMAIL, subject, html, text });
        try {
          await appendEnquiryEvent(enquiry.id, { type: "booking_notify_secretary_sent", booking_id: booking.id, resend_id: res2.id, at: (/* @__PURE__ */ new Date()).toISOString(), meta: res2.raw });
        } catch (err) {
          console.error("append event failed", err);
        }
      } catch (err) {
        console.error("Failed to send booking notification to secretary", err);
        try {
          await appendEnquiryEvent(enquiry.id, { type: "booking_notify_secretary_failed", booking_id: booking.id, error: err && err.response ? err.response : String(err), at: (/* @__PURE__ */ new Date()).toISOString() });
        } catch (e) {
          console.error("append event failed", e);
        }
      }
    }
    return { status: 200, body: { ok: true, booking } };
  } catch (err) {
    console.error("Booking POST error", err);
    return { status: 500, body: { ok: false, error: "Server error" } };
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get,
  post
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
