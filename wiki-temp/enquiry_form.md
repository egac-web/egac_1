---
title: "Enquiry – East Grinstead AC"
---


# Enquiry Form

This file describes the enquiry/contact form for the website. Update the fields and handling as needed.

## Fields
- Name
- Email
- Phone (optional)
- Message
- Area of interest (dropdown: Training, Coaching, Officiating, Helping out, Other)

## Handling
- Submissions will be sent to a designated email address or stored in Directus.
- Add spam protection (honeypot or CAPTCHA) if required.
- Confirmation message shown after successful submission.

## To Do
- Add final destination for enquiries (email, Directus, etc.)
- Add privacy notice if required
- Add any additional fields as needed

---

import Layout from '../layouts/Base.astro';


<Layout title="Enquiry – East Grinstead AC">
  <section class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">East Grinstead AC – Enquiry Form</h1>

    <form
      id="enquiry-form"
      class="space-y-8"
      x-data="enquiryForm()"
      @submit.prevent="submitForm"
    >
      <!-- 1. Enquiry for -->
      <div>
        <label class="block font-medium mb-3">Is this enquiry for…</label>
        <div class="space-x-6">
          <label><input type="radio" name="enquiry_for" value="myself" x-model="form.enquiry_for" required> Myself (adult athlete, coach, volunteer)</label>
          <label><input type="radio" name="enquiry_for" value="child" x-model="form.enquiry_for" required> My child / someone else</label>
        </div>
      </div>

      <!-- 2. Contact details -->
      <div class="grid md:grid-cols-2 gap-6">
        <input name="contact_name"     placeholder="Your full name" required />
        <input type="email" name="contact_email" placeholder="Your email" required />
        <input type="tel"    name="contact_phone" placeholder="Your phone (optional)" />
      </div>

      <!-- 3. Area of interest -->
      <div>
        <label class="block font-medium mb-3">Area of interest</label>
        <select name="area_of_interest" required>
          <option value="">Select…</option>
          <option value="Training">Training</option>
          <option value="Coaching">Coaching</option>
          <option value="Officiating">Officiating</option>
          <option value="Helping out">Helping out</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <!-- 4. Message -->
      <div>
        <label class="block font-medium mb-3">Message</label>
        <textarea name="message" rows="4" placeholder="How can we help?" required></textarea>
      </div>

      <!-- 5. GDPR Consent -->
      <div>
        <input type="checkbox" name="gdpr_consent" required /> I consent to EGAC storing and processing my data for club purposes. See <a href="/policies/privacy">Privacy Policy</a>.
      </div>

      <!-- Honeypot spam protection -->
      <div style="display:none;">
        <label>Leave this field blank</label>
        <input type="text" name="honeypot" tabindex="-1" autocomplete="off" />
      </div>

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
        :disabled="submitting"
        x-text="submitting ? 'Sending…' : 'Send Enquiry'"
      >
      </button>
    </form>
  </section>

  <script>
    function enquiryForm() {
      return {
        form: {
          enquiry_for: 'myself',
        },
        submitting: false,

        async submitForm(e) {
          this.submitting = true;
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData);

          // Honeypot check
          if (data.honeypot) {
            alert('Spam detected.');
            this.submitting = false;
            return;
          }

          await fetch('https://hook.make.com/your-make-webhook-id-here', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          alert('Thank you! We’ll be in touch within 24 hours.');
          this.submitting = false;
        }
      }
    }
  </script>
</Layout>