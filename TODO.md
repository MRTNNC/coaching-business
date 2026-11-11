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
- [ ] Optional: save applications to the admin portal as well as emailing them

## Housekeeping
- [x] Verify the domain in Resend and Mailchimp
- [x] Clear test accounts and check-ins from Supabase
- [ ] Rotate the Supabase service-role key and Resend API key
- [ ] Optional: switch client invites to an email code instead of a link
