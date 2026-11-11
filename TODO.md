# To-do

## Site
- [x] Merge the About page update ([PR #2](https://github.com/MRTNNC/coaching-business/pull/2)) so the new bio goes live
- [ ] Review the Apex Coaching website for ideas on site structure (page order, pricing layout, testimonials)
- [x] Add a coaching application form at `/apply` (from the Arzuno Client Intake Form PDF), emailed to the coach
- [x] Pricing cards: "Submit coaching application" + "Need more info? Book a call"
- [x] Run `supabase/migrations/0006_pricing_sections.sql` in Supabase after merging the new pricing
- [x] Add a shop page using **Payhip** (https://payhip.com/ArzunoFitness), replacing the Merch "coming soon" page
- [x] Link the shop cards to the Payhip collections (recipe packs, training plans, stretching & mobility)
- [ ] Merch page (clothing, accessories, nasal strips): send product details and set up checkout (Payhip physical products), replacing the "Coming soon" page
- [x] Add the TikTok link in the footer (https://www.tiktok.com/@mcull_fit)
- [ ] Optional: set up a Cal.com Workflow that emails the `/apply` link to people after they book a call
- [x] Home page CTA: "Submit coaching application" + "Need more info? Book a call"
- [x] Add an FAQ page (`/faq`)
- [x] Send a test application and check the email arrives
- [ ] Optional: add a refund question for digital shop products to the FAQ

## Housekeeping
- [x] Verify the domain in Resend and Mailchimp
- [x] Clear test accounts and check-ins from Supabase
- [x] Remove the client portal and admin area
- [ ] Optional: delete the old portal tables and storage buckets in Supabase (`profiles`, `checkins`, `checkin_photos`, `comments`, `plans`, `checkin-photos`, `voice-notes`) and turn off Supabase Auth sign-ups
- [ ] Rotate the Resend API key, and the Supabase service-role key (no longer used by the site; remove `SUPABASE_SERVICE_ROLE_KEY` from Vercel)
