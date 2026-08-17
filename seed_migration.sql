CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    photo TEXT,
    emoji TEXT,
    badges JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    price_pln NUMERIC NOT NULL DEFAULT 0,
    price_eur NUMERIC,
    included TEXT,
    duration TEXT,
    desc_text TEXT,
    itinerary TEXT,
    activity TEXT,
    price_range TEXT,
    duration_tag TEXT,
    difficulty TEXT,
    show_price BOOLEAN DEFAULT true,
    trip_date TEXT,
    coming_soon BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    is_disabled BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    total_paid_pln NUMERIC,
    total_paid_eur NUMERIC,
    payment_status TEXT CHECK (payment_status IN ('Paid', 'Pending', 'Failed', 'Refunded')) DEFAULT 'Pending',
    booking_date TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.packages (title, location, photo, emoji, badges, tags, features, price_pln, price_eur, included, duration, desc_text, itinerary, activity, price_range, duration_tag, difficulty, show_price, trip_date, coming_soon, priority)
VALUES
('Kayaking Getaway — Rivers & Lakes', 'Wolka Kozodawska, Warsaw, Poland', 'https://images.unsplash.com/photo-1554913968-6ba85b94df1f?w=800&auto=format&fit=crop', '🛶', '[{"l":"Beginner","t":"white"},{"l":"Available","t":"green"}]', '[{"l":"Kayaking","t":"water"},{"l":"Sport","t":"sport"}]', '["📅 1 Day","🛶 Kayak Included","🏕️ Riverside Pitstop","🎯 Guided Tour"]', 259, 63, 'Equipment included', '1 Day', 'Paddle through scenic rivers and lakes. Suitable for everyone — beginners to experienced paddlers. Kayak, safety gear and a riverbank campsite all included.', '<h2>Day 1: The Adventure Begins</h2><p>Arrive at the riverbank, get your gear, and start paddling down the beautiful river!</p>', 'Kayaking', 'Under 400', 'Weekend (2–3 days)', 'Beginner', true, '26 April 2026', false, 100),
('Surfing Camp — Catch Your First Wave', 'Baltic Coast, Gdansk / Poland', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop', '🏄', '[{"l":"Popular","t":"blue"},{"l":"Coming Soon","t":"soon"}]', '[{"l":"Surfing","t":"water"},{"l":"Sport","t":"sport"}]', '["📅 5 Days / 4 Nights","🏄 Board & Wetsuit","🏖️ Beach Accommodation","👨‍🏫 Pro Instructor"]', 899, NULL, 'Equipment included', '5 Days / 4 Nights', 'Feel the power of the ocean! A 5-day surf camp with pro instructors. Board, wetsuit and beachside accommodation all included.', '<h2>Day 1-5: Catching Waves</h2><p>Daily lessons and free surf sessions along the beautiful Baltic coast.</p>', 'Surfing', '700–1000 PLN', 'Short (4–5 days)', 'Beginner', true, NULL, true, 90),
('Hiking in Tatra — Mountain Trails', 'Tatra National Park, Zakopane, Poland', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop', '🥾', '[{"l":"Intermediate","t":"white"},{"l":"Coming Soon","t":"soon"}]', '[{"l":"Tatra Mts.","t":"tatra"},{"l":"Hiking","t":"hiking"}]', '["📅 3 Days / 2 Nights","🏔️ Mountain Guide","🏠 Hut Accommodation","🎒 Backpack & Map"]', 399, NULL, 'Guide always included', '3 Days / 2 Nights', 'Discover the magic of the Polish mountains. Morskie Oko, Rysy peak, Kościeliska Valley. Experienced Tatra mountain guide included.', '<h2>Day 1-3: Mountain Conquest</h2><p>Hike up Rysy and enjoy the view of Morskie Oko.</p>', 'Hiking', 'Under 400', 'Weekend (2–3 days)', 'Intermediate', false, NULL, true, 80),
('Ski Trip — Alpine Slopes Adventure', 'Tatra Mountains / Alps, Poland / Austria', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop', '⛷️', '[{"l":"Best Seller","t":"accent"},{"l":"Coming Soon","t":"soon"}]', '[{"l":"Skiing","t":"winter"},{"l":"Sport","t":"sport"}]', '["📅 4 Days / 3 Nights","🎿 Lift Pass Included","🏨 Mountain Lodge","👨‍🏫 Ski Instructor","🍽️ Après-ski"]', 999, NULL, 'Skipass always included', '4 Days / 3 Nights', 'White slopes, adrenaline and après-ski. Ski school, equipment rental, lift pass and a cosy mountain lodge all in the price.', '<h2>Day 1-4: Skiing and Après-ski</h2><p>Enjoy the slopes by day and warm lodges by night.</p>', 'Skiing', '1000+ PLN', 'Short (4–5 days)', 'Intermediate', false, NULL, true, 70),
('Camping Weekend — Stars & Campfire', 'Polish Countryside / Forests, Poland', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop', '🏕️', '[{"l":"Beginner","t":"white"},{"l":"Coming Soon","t":"soon"}]', '[{"l":"Camping","t":"chill"},{"l":"Family","t":"family"}]', '["📅 3 Days / 2 Nights","⛺ Tent & Sleeping Bag","🔥 Campfire Meals","🎮 Outdoor Games"]', 259, NULL, 'Gear included', '3 Days / 2 Nights', 'Escape the city for 3 days of wild adventures, bonfires and sleeping under a sky full of stars. Tent, sleeping bag and all meals included.', '<h2>Day 1-3: Back to Nature</h2><p>Pitch your tent, build a campfire, and gaze at the stars.</p>', 'Camping', 'Under 400', 'Weekend (2–3 days)', 'Beginner', false, NULL, true, 60),
('Auschwitz-Birkenau — Memorial & Museum Tour', 'Oświęcim, Poland', 'https://images.unsplash.com/photo-1574715826360-7c02d0153097?w=800&auto=format&fit=crop', '🕯️', '[{"l":"Historical","t":"dark"},{"l":"Coming Soon","t":"soon"}]', '[{"l":"History","t":"culture"},{"l":"Memorial","t":"family"}]', '["📅 1 Day Tour","🎟️ Entry Tickets Included","🎤 Expert Historian Guide","🚌 Transport Included"]', 299, NULL, 'Guide & tickets included', '1 Day Tour', 'A deeply moving guided tour of the Auschwitz-Birkenau Memorial and Museum. Expert historians guide you through this UNESCO World Heritage site.', '<h2>Day 1: A Journey Through History</h2><p>A guided historical tour focusing on remembrance and education.</p>', 'City Tours', 'Under 400', 'Weekend (2–3 days)', 'Beginner', false, NULL, true, 50);

INSERT INTO public.bookings (package_id, customer_name, customer_email, customer_phone, total_paid_pln, total_paid_eur, payment_status, booking_date)
SELECT id, 'John Doe', 'john.doe@example.com', '+48 123 456 789', 259, 63, 'Paid', NOW() - INTERVAL '2 days' FROM public.packages WHERE title LIKE 'Kayaking%';

INSERT INTO public.bookings (package_id, customer_name, customer_email, customer_phone, total_paid_pln, total_paid_eur, payment_status, booking_date)
SELECT id, 'Alice Smith', 'alice@example.com', '+48 987 654 321', 899, 215, 'Pending', NOW() - INTERVAL '5 days' FROM public.packages WHERE title LIKE 'Surfing%';
