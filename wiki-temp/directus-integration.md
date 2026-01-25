# Directus Integration

The East Grinstead Athletics Club website is integrated with Directus CMS to manage dynamic content such as club records, coaches, committee members, fixtures, and policies. Below are the details of the integration:

## Directus Setup
1. **Directus Instance**: The website connects to a Directus instance running at `http://localhost:8055` during development. For production, update the Directus URL in `src/lib/directus.ts`.
2. **Authentication**: The integration uses a Directus static token for authentication. Ensure the token is set in the environment variables or directly in the `src/lib/directus.ts` file.

## Dummy Data for Testing
See [dummy-records.md](./dummy-records.md) for sample records to use during development and testing. Add these to your Directus instance to verify records pages and queries.

## Collections
The following collections are configured in Directus to manage the website's content:
- **Coaches**: Profiles of club coaches.
- **Committee Members**: Information about the club's committee members.
- **Fixtures**: Details of upcoming events and competitions.
- **Club Records**: Records of athlete achievements across various age groups and disciplines.
- **Policies**: Club policies and guidelines.

## Directus Client Setup
The Directus client is configured in `src/lib/directus.ts`:
```typescript
import { Directus } from '@directus/sdk';

const DIRECTUS_URL = import.meta.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN || '';

export const directus = new Directus(DIRECTUS_URL, {
  auth: {
    staticToken: DIRECTUS_TOKEN,
  },
});
```

## Querying Data
Directus collections are queried using the Directus SDK. Below is an example of fetching published news items:
```typescript
const fetchNews = async () => {
  const { data } = await directus.items('news').readMany({
    filter: { status: { _eq: 'published' } },
    fields: ['title', 'content', 'slug', 'date_published', 'news_image.*'],
    limit: 6,
  });
  return data;
};
```

## Environment Variables
The following environment variables are used to configure Directus:
- `DIRECTUS_URL`: The base URL of the Directus instance.
- `DIRECTUS_TOKEN`: The static token for authentication.

## Deployment Considerations
- **Production URL**: Update the `DIRECTUS_URL` to point to the production Directus instance.
- **Secure Token**: Use a secure method to store and access the `DIRECTUS_TOKEN` in production.
- **CORS Configuration**: Ensure the Directus instance allows requests from the website's domain.

## Benefits of Directus Integration
- **Centralized Content Management**: Allows non-technical users to manage website content easily.
- **Dynamic Updates**: Content updates in Directus are reflected on the website without redeployment.
- **Scalability**: Supports additional collections and fields as the website grows.

This integration ensures the website remains dynamic, user-friendly, and easy to maintain.