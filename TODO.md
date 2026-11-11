# To-do

## Site
- [x] Merge the About page update ([PR #2](https://github.com/MRTNNC/coaching-business/pull/2)) so the new bio goes live
- [ ] Review the Apex Coaching website for ideas on site structure (page order, pricing layout, testimonials)
- [x] Add a coaching application form at `/apply` (from the Arzuno Client Intake Form PDF), emailed to the coach
- [x] Pricing cards: "Submit coaching application" + "Need more info? Book a call"
- [ ] Run `supabase/migrations/0006_pricing_sections.sql` in Supabase after merging the new pricing
- [x] Add a shop page using **Payhip** (https://payhip.com/ArzunoFitness), replacing the Merch "coming soon" page
- [x] Link the shop cards to the Payhip collections (recipe packs, training plans, stretching & mobility)
- [ ] Merch page (clothing, accessories, nasal strips): send product details and set up checkout (Payhip physical products), replacing the "Coming soon" page
- [ ] Add the TikTok link in the footer (needs handle)
- [ ] Optional: set up a Cal.com Workflow that emails the `/apply` link to people after they book a call

- [x] Home page CTA: "Submit coaching application" + "Need more info? Book a call"
- [x] Add an FAQ page (`/faq`) — review the answers

## Housekeeping
- [ ] Verify a domain in Resend so emails can reach people other than the coach
- [ ] Clear test accounts and check-ins from Supabase before real clients use the portal
- [ ] Rotate the Supabase service-role key and Resend API key
- [ ] Optional: switch client invites to an email code instead of a link
