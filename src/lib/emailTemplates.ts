export function inviteEmailTemplate({
  inviteUrl,
  siteName = 'EGAC',
  accentColor = '#F041FF',
  logoUrl,
}: {
  inviteUrl: string;
  siteName?: string;
  accentColor?: string;
  logoUrl?: string;
}) {
  const subject = `${siteName}: Book a taster / session`;
  const text = `Hello,\n\nThanks for your enquiry. Book a free taster at: ${inviteUrl}\n\nIf you did not request this, ignore this email.`;

  const html = `<!doctype html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${subject}</title>
    <style>
      /* Basic, inlined-friendly styling */
      body { background: #f7f7f9; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #222; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; }
      .card { background: #ffffff; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
      .header { padding: 20px; display: flex; align-items: center; gap: 12px; }
      .brand { font-weight: 700; font-size: 18px; color: ${accentColor}; }
      .hero { padding: 24px; }
      .hero h1 { margin: 0 0 8px 0; font-size: 20px; }
      .hero p { margin: 0 0 16px 0; color: #333; }
      .cta { display: inline-block; background: ${accentColor}; color: #fff; padding: 12px 18px; border-radius: 6px; text-decoration: none; font-weight: 600; }
      .footer { padding: 16px 24px; font-size: 12px; color: #666; background: #fafafa; }
      @media (max-width:480px) { .hero h1 { font-size: 18px; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          ${
            logoUrl
              ? `<img src="${logoUrl}" alt="${siteName}" width="40" style="display:block;border-radius:4px"/>`
              : ''
          }
          <div class="brand">${siteName}</div>
        </div>
        <div class="hero">
          <h1>Book your free taster</h1>
          <p>Thanks for your enquiry — to book a free taster session, please use the button below.</p>
          <p><a class="cta" href="${inviteUrl}">Book a session</a></p>
          <p style="margin-top:8px;color:#666;font-size:13px">Or paste this link into your browser:<br/><a href="${inviteUrl}">${inviteUrl}</a></p>
        </div>
        <div class="footer">
          <div>If you did not request this, you can ignore this email.</div>
          <div style="margin-top:8px">${siteName} • <a href="${inviteUrl}">${inviteUrl}</a></div>
        </div>
      </div>
    </div>
  </body>
  </html>`;

  return { subject, text, html };
}

export function bookingConfirmationTemplate({
  date,
  slotLabel,
  siteName = 'EGAC',
  accentColor = '#F041FF',
}: {
  date: string;
  slotLabel: string;
  siteName?: string;
  accentColor?: string;
}) {
  const subject = `${siteName}: Booking confirmed`;
  const text = `Your booking for ${date} (${slotLabel}) is confirmed.`;
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>${subject}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#222;margin:0;padding:0} .container{max-width:600px;margin:0 auto;padding:20px} .card{background:#fff;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.06)} .cta{display:inline-block;background:${accentColor};color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:600}</style></head><body><div class="container"><div class="card"><h1>Booking confirmed</h1><p>Your booking for <strong>${date}</strong> (${slotLabel}) is confirmed. We look forward to seeing you.</p></div></div></body></html>`;
  return { subject, text, html };
}

export function reminderTemplate({
  date,
  slotLabel,
  siteName = 'EGAC',
}: {
  date: string;
  slotLabel: string;
  siteName?: string;
}) {
  const subject = `${siteName}: Reminder - upcoming taster session`;
  const text = `Reminder: your taster session on ${date} (${slotLabel}) is tomorrow.`;
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>${subject}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#222;margin:0;padding:0} .container{max-width:600px;margin:0 auto;padding:20px} .card{background:#fff;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.06)} .cta{display:inline-block;background:#333;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:600}</style></head><body><div class="container"><div class="card"><h1>Reminder: upcoming taster</h1><p>This is a reminder that your free taster session is scheduled for <strong>${date}</strong> (${slotLabel}) tomorrow. We look forward to seeing you.</p></div></div></body></html>`;
  return { subject, text, html };
}

export function academyInvitationTemplate({
  responseYesUrl,
  responseNoUrl,
  childName,
  siteName = 'EGAC',
  accentColor = '#145FBA',
}: {
  responseYesUrl: string;
  responseNoUrl: string;
  childName?: string;
  siteName?: string;
  accentColor?: string;
}) {
  const subject = `${siteName}: Academy Invitation - March/April Intake`;
  const greeting = childName ? `regarding ${childName}` : 'from East Grinstead AC';
  const text = `Hello,\n\nThank you for your interest in the EGAC Academy (U11). We are pleased to invite you to join our March/April intake.\n\nPlease confirm your interest:\nYes, still interested: ${responseYesUrl}\nNo longer interested: ${responseNoUrl}\n\nBest regards,\n${siteName}`;

  const html = `<!doctype html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${subject}</title>
    <style>
      body { background: #f7f7f9; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #222; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; }
      .card { background: #ffffff; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
      .header { padding: 20px; background: linear-gradient(135deg, ${accentColor} 0%, #0d4a8f 100%); color: #fff; }
      .brand { font-weight: 700; font-size: 20px; }
      .hero { padding: 24px; }
      .hero h1 { margin: 0 0 12px 0; font-size: 22px; color: ${accentColor}; }
      .hero p { margin: 0 0 16px 0; color: #333; line-height: 1.6; }
      .cta-container { display: flex; gap: 12px; margin: 24px 0; }
      .cta { display: inline-block; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; text-align: center; flex: 1; }
      .cta-yes { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; }
      .cta-no { background: #f3f4f6; color: #991b1b; border: 2px solid #fee2e2; }
      .footer { padding: 16px 24px; font-size: 12px; color: #666; background: #fafafa; }
      @media (max-width:480px) { .cta-container { flex-direction: column; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <div class="brand">${siteName}</div>
          <div style="font-size:14px;margin-top:4px">Academy Invitation</div>
        </div>
        <div class="hero">
          <h1>🏃 Academy Invitation (U11)</h1>
          <p>Hello ${greeting},</p>
          <p>Thank you for your interest in the <strong>EGAC Academy</strong> for young athletes (U11). We are pleased to invite you to join our <strong>March/April intake</strong>.</p>
          <p>We have limited spaces available and would like to confirm your continued interest. Please let us know by clicking one of the buttons below:</p>
          <div class="cta-container">
            <a class="cta cta-yes" href="${responseYesUrl}">✅ Yes, Still Interested</a>
            <a class="cta cta-no" href="${responseNoUrl}">❌ No Longer Interested</a>
          </div>
          <p style="font-size:13px;color:#666;">If the buttons don't work, copy and paste one of these links:<br/>
          Yes: <a href="${responseYesUrl}">${responseYesUrl}</a><br/>
          No: <a href="${responseNoUrl}">${responseNoUrl}</a></p>
        </div>
        <div class="footer">
          <div>Thank you for your interest in East Grinstead AC.</div>
          <div style="margin-top:8px">${siteName} • Academy Programme</div>
        </div>
      </div>
    </div>
  </body>
  </html>`;

  return { subject, text, html };
}
