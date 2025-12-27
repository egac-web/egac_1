# Change Log

All project changes must be recorded here to maintain an accurate history.

## [Unreleased]
- Initial Astro site structure created in egac_1
- Added pages: Home, Records (with dynamic age group routes), About, Contact, Policies
- Integrated documentation files as per master.md
- Added placeholders for social media and enquiry form
- Prepared for Cloudflare hosting and Directus integration

## [Date: 2025-12-04]

 - Integrated Directus dummy data into src/pages/records/u11.astro, u13.astro, u17.astro, u20.astro, senior.astro, and masters.astro for live records display and error handling.
 - Updated records.astro to indicate all age group pages now load live data from Directus and reference dummy-records.md for testing.
 - Fixed all type errors in age group records pages (u11, u13, u15, u17, u20, senior, masters) by explicitly typing records and map callback parameters.
 - Refactored Directus queries in all records pages to match SDK usage and fixed type errors. See directus-integration.md for details.
 - Improved visual design and consistency for records hub and all records tables. See colors-and-background.md for design details.

- Improved site minimalism and polish per reference: 
  - Simplified background (static gradient, no animation).
  - Refined header/footer for clarity and whitespace.
  - Updated records hub page: flat card design, soft shadows, rounded corners, clear typography, more whitespace.
- Further refined records hub for warmth and approachability:
  - Lighter, softer background and more whitespace.
  - Friendlier, larger typography.
  - Softer card edges and accent shadows.
  - Subtle yellow accent for highlights.
- All changes follow master.md and colors-and-background.md.
- Next: propagate these improvements to age group records pages and main site pages.

- Propagated warm, inviting design to all age group records pages:
  - Lighter backgrounds, more whitespace, friendlier typography, softer table edges, subtle accent colors.
  - Consistent with master.md and colors-and-background.md.
- Next: Review main site pages and analytics component for further polish and consistency.
