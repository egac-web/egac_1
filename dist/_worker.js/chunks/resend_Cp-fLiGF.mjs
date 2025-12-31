globalThis.process ??= {}; globalThis.process.env ??= {};
const RESEND_API = "https://api.resend.com/emails";
async function sendInviteEmail({ apiKey, from, to, subject, html, text }) {
  if (!apiKey) throw new Error("Missing Resend API key");
  const payload = {
    from,
    to,
    subject,
    html,
    text
  };
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error("Resend API error");
    err.response = json;
    throw err;
  }
  return { id: json?.id, status: "sent", raw: json };
}
async function sendBookingCancellation({ apiKey, from, to, date }) {
  const html = `<p>Hello,</p><p>Your booking for <strong>${date}</strong> has been cancelled.</p>`;
  const text = `Your booking for ${date} has been cancelled.`;
  return await sendInviteEmail({ apiKey, from, to, subject: "EGAC: Booking cancelled", html, text });
}

export { sendInviteEmail as default, sendBookingCancellation, sendInviteEmail };
