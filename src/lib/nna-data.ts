// Trip data ported verbatim from the original site.
export type Trip = {
  id: string;
  title: string;
  location: string;
  photo: string;
  emoji: string;
  badges: { l: string; t: string }[];
  tags: { l: string; t: string }[];
  features: string[];
  price: number;
  priceEur?: number;
  included?: string;
  duration: string;
  desc: string;
  activity: string;
  priceRange: string;
  durationTag: string;
  difficulty: string;
  showPrice?: boolean;
  tripDate?: string;
  comingSoon?: boolean;
};

export const PLN_EUR = 0.23;

export const TRIPS: Trip[] = [
  {
    id: "Kayaking",
    title: "Kayaking Getaway — Rivers & Lakes",
    location: "Wolka Kozodawska, Warsaw, Poland",
    photo: "https://images.unsplash.com/photo-1554913968-6ba85b94df1f?w=800&auto=format&fit=crop",
    emoji: "🛶",
    badges: [
      { l: "Beginner", t: "white" },
      { l: "Available", t: "green" },
    ],
    tags: [
      { l: "Kayaking", t: "water" },
      { l: "Sport", t: "sport" },
    ],
    features: ["📅 1 Day", "🛶 Kayak Included", "🏕️ Riverside Pitstop", "🎯 Guided Tour"],
    price: 259,
    priceEur: 63,
    included: "Equipment included",
    duration: "1 Day",
    desc: "Paddle through scenic rivers and lakes. Suitable for everyone — beginners to experienced paddlers. Kayak, safety gear and a riverbank campsite all included.",
    activity: "Kayaking",
    priceRange: "Under 400",
    durationTag: "Weekend (2–3 days)",
    difficulty: "Beginner",
    showPrice: true,
    tripDate: "26 April 2026",
  },
  {
    id: "Surfing",
    title: "Surfing Camp — Catch Your First Wave",
    location: "Baltic Coast, Gdansk / Poland",
    photo:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop",
    emoji: "🏄",
    badges: [
      { l: "Popular", t: "blue" },
      { l: "Coming Soon", t: "soon" },
    ],
    tags: [
      { l: "Surfing", t: "water" },
      { l: "Sport", t: "sport" },
    ],
    features: [
      "📅 5 Days / 4 Nights",
      "🏄 Board & Wetsuit",
      "🏖️ Beach Accommodation",
      "👨‍🏫 Pro Instructor",
    ],
    price: 899,
    included: "Equipment included",
    duration: "5 Days / 4 Nights",
    desc: "Feel the power of the ocean! A 5-day surf camp with pro instructors. Board, wetsuit and beachside accommodation all included.",
    activity: "Surfing",
    priceRange: "700–1000 PLN",
    durationTag: "Short (4–5 days)",
    difficulty: "Beginner",
    showPrice: true,
    comingSoon: true,
  },
  {
    id: "Hiking",
    title: "Hiking in Tatra — Mountain Trails",
    location: "Tatra National Park, Zakopane, Poland",
    photo: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop",
    emoji: "🥾",
    badges: [
      { l: "Intermediate", t: "white" },
      { l: "Coming Soon", t: "soon" },
    ],
    tags: [
      { l: "Tatra Mts.", t: "tatra" },
      { l: "Hiking", t: "hiking" },
    ],
    features: [
      "📅 3 Days / 2 Nights",
      "🏔️ Mountain Guide",
      "🏠 Hut Accommodation",
      "🎒 Backpack & Map",
    ],
    price: 399,
    included: "Guide always included",
    duration: "3 Days / 2 Nights",
    desc: "Discover the magic of the Polish mountains. Morskie Oko, Rysy peak, Kościeliska Valley. Experienced Tatra mountain guide included.",
    activity: "Hiking",
    priceRange: "Under 400",
    durationTag: "Weekend (2–3 days)",
    difficulty: "Intermediate",
    comingSoon: true,
  },
  {
    id: "Skiing",
    title: "Ski Trip — Alpine Slopes Adventure",
    location: "Tatra Mountains / Alps, Poland / Austria",
    photo: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop",
    emoji: "⛷️",
    badges: [
      { l: "Best Seller", t: "accent" },
      { l: "Coming Soon", t: "soon" },
    ],
    tags: [
      { l: "Skiing", t: "winter" },
      { l: "Sport", t: "sport" },
    ],
    features: [
      "📅 4 Days / 3 Nights",
      "🎿 Lift Pass Included",
      "🏨 Mountain Lodge",
      "👨‍🏫 Ski Instructor",
      "🍽️ Après-ski",
    ],
    price: 999,
    included: "Skipass always included",
    duration: "4 Days / 3 Nights",
    desc: "White slopes, adrenaline and après-ski. Ski school, equipment rental, lift pass and a cosy mountain lodge all in the price.",
    activity: "Skiing",
    priceRange: "1000+ PLN",
    durationTag: "Short (4–5 days)",
    difficulty: "Intermediate",
    comingSoon: true,
  },
  {
    id: "Camping",
    title: "Camping Weekend — Stars & Campfire",
    location: "Polish Countryside / Forests, Poland",
    photo:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop",
    emoji: "🏕️",
    badges: [
      { l: "Beginner", t: "white" },
      { l: "Coming Soon", t: "soon" },
    ],
    tags: [
      { l: "Camping", t: "chill" },
      { l: "Family", t: "family" },
    ],
    features: [
      "📅 3 Days / 2 Nights",
      "⛺ Tent & Sleeping Bag",
      "🔥 Campfire Meals",
      "🎮 Outdoor Games",
    ],
    price: 259,
    included: "Gear included",
    duration: "3 Days / 2 Nights",
    desc: "Escape the city for 3 days of wild adventures, bonfires and sleeping under a sky full of stars. Tent, sleeping bag and all meals included.",
    activity: "Camping",
    priceRange: "Under 400",
    durationTag: "Weekend (2–3 days)",
    difficulty: "Beginner",
    comingSoon: true,
  },
  {
    id: "Auschwitz",
    title: "Auschwitz-Birkenau — Memorial & Museum Tour",
    location: "Oświęcim, Poland",
    photo:
      "https://images.unsplash.com/photo-1574715826360-7c02d0153097?w=800&auto=format&fit=crop",
    emoji: "🕯️",
    badges: [
      { l: "Historical", t: "dark" },
      { l: "Coming Soon", t: "soon" },
    ],
    tags: [
      { l: "History", t: "culture" },
      { l: "Memorial", t: "family" },
    ],
    features: [
      "📅 1 Day Tour",
      "🎟️ Entry Tickets Included",
      "🎤 Expert Historian Guide",
      "🚌 Transport Included",
    ],
    price: 299,
    included: "Guide & tickets included",
    duration: "1 Day Tour",
    desc: "A deeply moving guided tour of the Auschwitz-Birkenau Memorial and Museum. Expert historians guide you through this UNESCO World Heritage site.",
    activity: "City Tours",
    priceRange: "Under 400",
    durationTag: "Weekend (2–3 days)",
    difficulty: "Beginner",
    comingSoon: true,
  },
];

export const GALLERY: Record<string, string[]> = {
  Kayaking: [
    "https://images.unsplash.com/photo-1554913968-6ba85b94df1f?w=800",
    "https://images.unsplash.com/photo-1523287281576-5b596107a6ae?w=400",
    "https://images.unsplash.com/photo-1578940695359-2dd6aff3eb84?w=400",
    "https://images.unsplash.com/photo-1601899986654-9d92838359e4?w=400",
    "https://images.unsplash.com/photo-1699190866577-100e090dfe1d?w=400",
  ],
  Skiing: [
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
    "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400",
    "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400",
    "https://images.unsplash.com/photo-1586967882046-8dc6b9b3c3ef?w=400",
  ],
  Surfing: [
    "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800",
    "https://images.unsplash.com/photo-1455264745730-cb3b76250de8?w=400",
    "https://images.unsplash.com/photo-1531722569936-825d4ebd0de9?w=400",
    "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=400",
    "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=400",
  ],
  Hiking: [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
    "https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=400",
  ],
  Camping: [
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400",
    "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=400",
    "https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=400",
    "https://images.unsplash.com/photo-1487730116645-74489c55bc79?w=400",
  ],
  "City Tours": [
    "https://images.unsplash.com/photo-1574715826360-7c02d0153097?w=800",
    "https://images.unsplash.com/photo-1574716625799-161d7bd9056d?w=400",
    "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "https://images.unsplash.com/photo-1592853598064-f9e2c5b8a769?w=400",
  ],
};
