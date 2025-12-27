# Project Structure

The East Grinstead Athletics Club website follows a modular and organized structure to ensure maintainability and scalability. Below is an overview of the key directories and their purposes:

## Key Directories
- **`src/pages/`**: Contains all the `.astro` files that define the website's pages. Each file corresponds to a route on the website.
  - Example: `src/pages/index.astro` maps to the homepage (`/`).
  - Dynamic routes are supported using `[param].astro` files, such as `src/pages/records/[ageGroup].astro`.
- **`src/components/`**: Houses reusable components used across multiple pages.
  - Example: `Header.astro`, `Footer.astro`, `RecordsChart.astro`.
- **`src/content/`**: Stores Markdown or MDX files for blog posts or other content collections.
  - Example: Blog posts are stored in `src/content/blog/`.
- **`src/lib/`**: Contains utility files and configurations.
  - Example: `directus.ts` sets up the Directus client for API interactions.
- **`src/consts.ts`**: Defines constants used throughout the site, such as the site title and description.
- **`public/`**: Contains static assets like images, fonts, and other files that do not require processing.
  - Example: `public/robots.txt` for search engine crawlers.

## Page Structure
The website's pages are structured to ensure consistency and reusability:
- **Shared Layouts**: Common elements like the header, footer, and background animations are defined in `src/components/Layout.astro` and used across all pages.
- **Dynamic Pages**: Pages like `src/pages/records/[ageGroup].astro` dynamically render content based on the URL parameter (e.g., `/records/u15`).
- **Static Pages**: Pages like `src/pages/contact.astro` and `src/pages/about.astro` have fixed content.

## Routing
Astro automatically generates routes based on the file structure in `src/pages/`:
- `src/pages/index.astro` → `/`
- `src/pages/contact.astro` → `/contact`
- `src/pages/records/[ageGroup].astro` → `/records/:ageGroup`

## Hosting & Deployment

The site is hosted on **Cloudflare Pages** for fast, secure, and scalable delivery. Static assets and the Astro build output are deployed directly to Cloudflare.

- **Deployment Steps:**
  1. Push changes to the main branch (or your chosen branch).
  2. Cloudflare Pages automatically builds and deploys the site from the `dist/` directory.
  3. Configure custom domains and SSL via the Cloudflare dashboard.

## Content Management

All dynamic content (records, news, profiles, etc.) is managed in **Directus**. The Astro site fetches content from Directus via its API at build time or runtime, depending on the page/component.

- **Directus Instance:**
  - Hosted separately (self-hosted or Directus Cloud).
  - API endpoint and authentication token are set via environment variables.
- **Content Workflow:**
  - Editors update content in Directus.
  - Changes are reflected on the site automatically (no redeploy needed for most updates).

This setup ensures a modern JAMstack workflow with fast static hosting and dynamic content updates.

## Deployment
The project is built using Astro, and the output is generated in the `dist/` directory. The deployment process involves:
1. Building the site:
   ```sh
   npm run build
   ```
2. Deploying the contents of the `dist/` directory to a hosting provider.

## Development Workflow
1. Start the development server:
   ```sh
   npm run dev
   ```
2. Open [http://localhost:4321](http://localhost:4321) to view the site locally.
3. Make changes to `.astro` files, components, or styles, and the site will automatically reload.

This structure ensures the website is easy to navigate, develop, and maintain.