# GO DAILY migration: Vercel + Supabase

Prepared 15 October 2026. This source package does not change the live ChatGPT Sites website. Real Google and email-code sign-in require the account configuration below.

## Included

Existing study pages, appearance settings and hover effects; login card; Google OAuth and email OTP; separate guest/account browser storage; manual cloud backup and restore; old-site backup import; sign-out and account deletion. Study pages remain public. Database access is protected by Supabase row-level security, not hidden UI buttons.

Cloud backups are manual: save on one device and load on another. Concurrent edits are not merged. Browser storage is not encrypted; use a private device/profile. Account deletion removes its database backup and local account data on the current browser; previously downloaded backups and other devices' local copies remain.

## 1. Supabase project

Create or choose a Supabase project you own. Run `supabase/schema.sql` in its SQL editor once. It creates the private backup table, ownership policies and account-deletion function. Obtain the project URL and publishable key from project settings. Never put a service-role key in a NEXT_PUBLIC variable.

Enable the Email authentication provider and sign-ups. Configure the sign-in email template with `{{ .Token }}` so it sends a numeric code rather than only a magic link. Check templates for both new and returning users. Keep email verification enabled. Set an appropriate OTP expiry and delivery rate limit.

For public visitors, configure custom SMTP with your verified sender domain in Supabase Auth settings. The built-in mail service is restricted to project-team addresses and is not a production delivery service. Enter SMTP credentials only in provider settings.

## 2. Vercel deployment

Upload this source to a private GitHub repository and import it into Vercel as a Next.js project, or deploy from your computer with the Vercel CLI. Use Node.js 22, `npm ci`, and `npm run build`. No custom output-directory setting is needed.

Configure these environment variables for the deployment:

- `NEXT_PUBLIC_SUPABASE_URL`: your project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: your publishable key.
- `NEXT_PUBLIC_SITE_URL`: your final HTTPS site origin, without a trailing slash.

Redeploy after setting or changing these build-time variables. Keep the old website live until the new deployment is tested. This package contains no provider credentials.

## 3. Google provider and redirects

In Google Cloud, configure the OAuth consent screen and create a Web application OAuth client. Set the authorized JavaScript origin to the new site origin. Set its authorized redirect URI to the exact callback URL shown in Supabase's Google provider settings (typically `https://PROJECT_REF.supabase.co/auth/v1/callback`). Enter the Google client ID and client secret in Supabase, then enable that provider. Do not put the Google secret in application code or this chat.

In Supabase URL Configuration, set Site URL to the final site origin and allow the exact redirect `https://YOUR_HOST/auth/callback`. For local development, separately allow `http://localhost:3000/auth/callback`. Use explicit production URLs rather than broad wildcards. Complete the Google consent-screen publishing/testing requirements for your intended users.

The browser SDK handles the PKCE redirect. Both login methods lead to `/account`. No backend service-role credential is needed by this application.

## 4. Move content and progress

The bundled JSON files retain the content available in the checked-out source, including curated current affairs. Database-only news records from the old Sites deployment have NOT been exported; compare the old archive and export any missing records before retiring it. The Sites-specific MCP editing endpoint is not included. Until a replacement editor is connected, news updates require edits to the JSON files and redeployment. No automatic news schedule is enabled.

On the old site, open Progress and download a backup. Sign into the new site, open My account, import that JSON, then save a cloud backup. Local storage cannot automatically move between different domains.

After testing, verify the new domain in Google Search Console and submit its sitemap. The old verification tag is retained but does not automatically verify a new property. Sitemap and canonical origins use NEXT_PUBLIC_SITE_URL. Arrange redirects only if the old host supports them; do not delete the old site first.

## 5. Launch checks requiring configured accounts

- Sign in with Google, reload, sign out, then sign back in.
- Receive and verify codes for a new user and a returning user. Wrong/expired codes must fail.
- Save bookmarks, quiz progress and Mains drafts; save a cloud backup; restore on a second browser.
- With two different users, verify neither can read, update or delete the other's row, including direct authenticated API calls. Verify anonymous access is rejected.
- Switch users and verify account progress stays separate from guest progress.
- Export/import an old-site backup and verify its answers and bookmarks.
- Delete a test account and verify its backup row is deleted.
- Check mobile layout, keyboard navigation, reduced motion, themes, public news, canonical URLs and sitemap.

Before public launch, add the owner's privacy/contact details and verify provider plan costs and email delivery limits. Google Cloud/Supabase settings and live authentication cannot be validated until those projects are connected.

## Local development

Copy `.env.example` to `.env.local`, fill the public settings, then run `npm ci` and `npm run dev`. Without settings, public study pages work and the login card explains setup is pending. Run `npm run check` and `npm run build` before deployment.

## Official setup references

- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://vercel.com/docs/frameworks/full-stack/nextjs
