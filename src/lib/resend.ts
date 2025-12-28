const RESEND_API = 'https://api.resend.com/emails';

export type ResendResult = {
  id?: string;
  status?: string;
  raw?: any;
};

export async function sendInviteEmail({ apiKey, from, to, subject, html, text }) {
  if (!apiKey) throw new Error('Missing Resend API key');

  const payload = {
    from,
    to,
    subject,
    html,
    text,
  };

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error('Resend API error');
    // attach response details
    (err as any).response = json;
    throw err;
  }

  return { id: json?.id, status: 'sent', raw: json } as ResendResult;
}

export async function sendBookingConfirmation({ apiKey, from, to, date, slotLabel }) {
  const html = `<p>Hello,</p><p>Your booking for <strong>${date}</strong> (${slotLabel}) is confirmed. See you at the session.</p>`;
  const text = `Your booking for ${date} (${slotLabel}) is confirmed.`;
  return await sendInviteEmail({ apiKey, from, to, subject: 'EGAC: Booking confirmed', html, text });
}

export async function sendBookingCancellation({ apiKey, from, to, date }) {
  const html = `<p>Hello,</p><p>Your booking for <strong>${date}</strong> has been cancelled.</p>`;
  const text = `Your booking for ${date} has been cancelled.`;
  return await sendInviteEmail({ apiKey, from, to, subject: 'EGAC: Booking cancelled', html, text });
}

export default sendInviteEmail;
