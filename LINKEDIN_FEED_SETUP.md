# LinkedIn Feed Setup

The homepage requests the latest three posts from `/api/linkedin-posts`.

To make that endpoint return real posts, deploy the site somewhere that supports
serverless functions, such as Vercel, and add these environment variables:

- `LINKEDIN_ACCESS_TOKEN`: LinkedIn OAuth access token with permission to read posts.
- `LINKEDIN_AUTHOR_URN`: your LinkedIn person URN, for example `urn:li:person:...`.

LinkedIn does not expose a public profile feed to static browser JavaScript. The
access token must stay server-side.
