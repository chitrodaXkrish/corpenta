# Corpenta Global

Next.js App Router foundation for the Corpenta Global public site, student area, admin area, Supabase data model and integration endpoints.

## Local setup

1. Install Node.js 20.9+ and npm.
2. Copy `.env.example` to `.env.local` and fill in the Supabase project URL, public anon key and server-only service role key. Never commit `.env.local`.
3. Apply `supabase/migrations/202611150001_initial_schema.sql` in the Supabase SQL editor or through Supabase CLI. It creates six unpublished course placeholders. Admins must be provisioned deliberately by inserting their auth UUID into `public.user_roles` with role `admin` from a trusted SQL session.
4. Configure email verification and password recovery redirect URLs in Supabase Auth. Set `NEXT_PUBLIC_SITE_URL` to the deployed site URL.
5. Run `npm install`, then `npm run dev`.

## Integrations

- **Razorpay:** configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`. Set the Razorpay webhook URL to `/api/payments/webhook` and subscribe to `payment.captured` (and optionally `order.paid`). Course checkout orders are server-created; only a valid signed webhook can activate an enrollment. Frontend success callbacks are not used for entitlement.
- **Video:** Bunny Stream playback signing is scaffolded at `/api/video/playback`. Configure the Bunny library, token key and video asset IDs. Domain restrictions must also be configured in Bunny. Vimeo is listed as a future provider adapter; its credentials alone do not enable playback.
- **Email/Telegram:** environment placeholders are provided, but sending/broadcast workers are not implemented yet. Do not treat a configured token as proof of delivery.
- **Storage:** the database records asset paths. Configure private Supabase Storage buckets and storage policies before uploading student charts, course videos, or invoices. Public marketing imagery should use a separate public bucket.

## Access model

Enrollment is tied to a student/course pair and activated in the signed Razorpay webhook database function only after provider confirmation. Lesson and module reads use RLS and require `status='active'`; meeting URLs are selected only by RLS for a scheduled class assigned to the student's enrolled course/batch. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Admin pages additionally check the database role; browser-supplied role metadata is not trusted.

The `student_sessions` table is a schema foundation only. Supabase Auth session revocation and strict one-session enforcement still need a production session broker and verification on every protected request. Do not describe concurrent login prevention as enabled until that middleware and its RLS-aware session validation are deployed.

## Important production work still required

This repository began empty, so this delivery establishes the visual direction, routes, schema, core RLS model, and limited server integration paths. Before a production launch, implement the CMS edit/upload workflow, searchable/paginated student operations, complete role/session revocation and concurrent-session enforcement, the client Razorpay checkout widget and receipts, PDF invoice rendering/download, email/Telegram queue and delivery logs, lesson progress/video UI, batch assignment UI, rate limiting, and automated security/integration tests. Supply actual academy copy, six course details/prices, verified mentor profiles, contact details, legal approval, and a real market content policy. The SRS PDF was not present in the supplied workspace.

No genuine market data, testimonials, identities, credentials, course prices, or trading performance claims are included. Legal pages are drafts marked for client/legal review.

## Search engine configuration

- `src/lib/seo.ts` is the canonical SEO configuration. Canonical URLs are intentionally fixed to `https://corpentaglobal.in`, including local and preview builds, so deployment URLs do not leak into search indexes.
- Next.js serves `/robots.txt` and a request-time `/sitemap.xml`. The sitemap adds published, non-archived course URLs from the public Supabase API; it only lists `/courses` when at least one course is published.
- Admin, student, sign-in and account-recovery paths are disallowed in `robots.txt` and marked `noindex`. Draft legal pages, the placeholder About page and illustrative-only market scenarios are also marked `noindex` and omitted from the sitemap until their content is ready for publication.
- The host redirect in `next.config.ts` sends `www.corpentaglobal.in` to the preferred non-www HTTPS host. The root-domain HTTP redirect relies on the reverse proxy forwarding `x-forwarded-proto: http`; configure that header in the VPS proxy. Keep TLS termination and an HTTP-to-HTTPS redirect enabled at the proxy as a fallback.
- Add `https://corpentaglobal.in` as a property in Google Search Console and Bing Webmaster Tools, verify ownership, and submit `https://corpentaglobal.in/sitemap.xml` after deployment. Publish approved About/legal copy and at least one confirmed course before expecting those sections to be indexed.
