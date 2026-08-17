# NNA VITTALO — Adventure Travel rebuild

Recreate the uploaded page as a React/TanStack site with the same look, content and behaviour, split into real routes, and keep it wired to your existing backend project so bookings and logins keep working exactly as today.

## Pages

- `/` — top scrolling bar, sticky navy/blue nav with WhatsApp + "Book a Trip", animated hero with floating activity emojis, badge, stats, "Always Included" banner, trip browser (filters sidebar + trip cards), promo blocks, contact section, footer.
- `/trips` — the same filterable trip browser as a standalone page (activity, duration, price range, difficulty; sorts: Upcoming / Price / Most Popular).
- `/contact` — contact section with WhatsApp / email / socials.
- `/my-bookings` — signed-in view of the user's bookings with cancel action and booking timers.
- Nav links keep smooth-scroll behaviour on the home page and route links across pages.

Each page gets its own title, description and social tags.

## Trips and booking flow

- All 6 trips carried over verbatim (Kayaking available; Surfing, Hiking, Skiing, Camping, Auschwitz "Coming Soon" with disabled buttons), same photos, badges, tags, features, PLN price with ~EUR conversion, descriptions and gallery images.
- Trip detail modal with gallery, description, guest picker, live price total, international phone input with validation, and the "Coming Soon" disabled state.
- Booking submits to the same `bookings` table in your current backend; success modal, toast messages, newsletter box and payment-status check behave as they do now.
- Login / logout / session check use the same backend auth.

## Design

Faithful copy of the original: Montserrat + Open Sans, `#2952c8` blue, `#0f2266` navy, `#f5f7fc` background, card shadows, badge/tag colour variants, hamburger mobile menu, same responsive behaviour.

## Technical notes

- Existing project credentials (project URL + anon key) from the uploaded file are used directly via the Supabase JS client; nothing is migrated and no new database is created.
- Original CSS is ported into the project stylesheet with the palette exposed as design tokens; inline `onclick` handlers become React handlers, `TRIPS`/`GALLERY` move into a shared data module.
- `intl-tel-input` is added as a dependency for the phone field.
