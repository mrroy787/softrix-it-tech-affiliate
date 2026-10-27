# Softrix IT Tech — Affiliate Events CMS

A full-stack Next.js + Supabase starter for a public affiliate-event landing page with a protected admin login, shared database, image uploads, and per-event/site-wide SEO controls.

## Features
- Public premium responsive landing page branded **Softrix IT Tech**
- Five starter affiliate campaigns from the supplied screenshot
- Supabase Postgres shared event database; changes in admin are visible to all visitors
- Per-event SEO title, meta description, keywords, canonical URL, OG image, robots, slug, draft/published status
- Site-wide SEO and homepage text editor
- Supabase Storage event image uploads
- Admin sign-in using Supabase Auth
- Event add/edit/delete, display ordering, draft/publish

## Setup (required before it can run)
1. Create a project at https://supabase.com/
2. In Supabase, open **SQL Editor**, paste and run `supabase/schema.sql`.
3. In Supabase **Project Settings → API**, copy Project URL and `anon` public key.
4. Copy `.env.example` to `.env.local`, fill in the values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   NEXT_PUBLIC_SITE_URL=https://your-deployed-domain.vercel.app
   ```
5. In Supabase **Authentication → Providers / Sign In**, disable public email signups. Create the owner/admin user manually in Authentication → Users → Add user. Use that email/password at `/admin/login`. Do not share the admin account.
6. Run locally: `npm install`, then `npm run dev`.
7. Deploy the folder to a Git repository and import it into Vercel. Add the same environment variables in Vercel Project Settings → Environment Variables, then redeploy.

## Important security note
The SQL policies allow any authenticated Supabase user to administer the CMS. Therefore, **disable public signups** and only create trusted admin accounts manually. For multi-admin production systems, add an explicit `admin_users` table/role check in RLS policies. Never put the Supabase service-role key in browser or public environment variables.

## SEO notes
- Public event pages are served at `/events/[slug]`, with metadata read from the database.
- Keep each event slug unique, write a genuinely useful meta description, and use canonical URLs that match your final public domain.
- Search engines may take time to crawl and index pages; SEO settings do not guarantee rankings.
- Supplied affiliate links are seeded as given; confirm each campaign URL is correct in your affiliate dashboard before launch.

## Included paths
- `app/` — public site, dynamic event pages, admin login and CMS
- `lib/` — Supabase clients
- `supabase/schema.sql` — database schema, security policies, image bucket and seed campaigns
- `.env.example` — required public environment variables
