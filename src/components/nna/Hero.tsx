const ICONS = [
  "🚐",
  "✈️",
  "⛷️",
  "🏄",
  "🛶",
  "🥾",
  "🚌",
  "⛺",
  "🪂",
  "🚴",
  "🚐",
  "✈️",
  "🛶",
  "🏄",
  "🥾",
  "🚌",
  "⛺",
  "⛷️",
  "🚴",
  "🪂",
];

export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg"></div>
      <div className="hero-moving-icons">
        {ICONS.map((icon, i) => (
          <span key={i} className={`icon-item icon-${i + 1}`}>
            {icon}
          </span>
        ))}
      </div>
      <div className="hero-inner">
        <div className="hero-badge">🏆 Europe's Premier Adventure Operator</div>
        <h1>
          Your Next
          <br />
          <span>Epic Adventure</span>
          <br />
          Starts with
          <br />
          NNA VITTALO
        </h1>
        <p>
          From mountain peaks to ocean waves — we craft unforgettable travel and adventure packages.
          Skipass, equipment, guides and accommodation always included.
        </p>
        <div className="hero-stats">
          <div>
            <strong>150+</strong>
            <small>Happy Adventurers</small>
          </div>
          <div>
            <strong>3+</strong>
            <small>Destinations</small>
          </div>
          <div>
            <strong>1 yr</strong>
            <small>Experience</small>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Banner() {
  return (
    <div className="banner">
      <span className="banner-pill">Always Included</span>
      Skipass, equipment &amp; guide are included in every package price — no hidden extras!
    </div>
  );
}

export function InfoGrid() {
  return (
    <div className="info-grid" id="about">
      <div className="info-card">
        <div className="info-icon">🏔️</div>
        <h2>Adventure Trips — Mountains &amp; Trails</h2>
        <p>
          NNA VITTALO has been organising adventure travel packages for{" "}
          <strong style={{ color: "#2952c8" }}>over 1 year</strong>. From the iconic Tatra Mountains
          to the Alpine slopes of Austria and Switzerland, every trip is built around your passion
          for the outdoors.
        </p>
        <p>
          Our mountain trips include an experienced guide, all necessary equipment, accommodation
          and full board. Whether you're a first-time hiker or a seasoned mountaineer, we have the
          perfect package for you.
        </p>
        <p>
          Expert local guides ensure your safety and help you get the most from every destination.{" "}
          <strong style={{ color: "#2952c8" }}>
            All essential gear and permits are always included.
          </strong>
        </p>
      </div>
      <div className="info-card">
        <div className="info-icon">🌊</div>
        <h2>Water Sports — Surf, Kayak &amp; Sail</h2>
        <p>
          From the calm lakes of Masuria to the powerful Atlantic swells of Portugal, NNA VITTALO
          offers <strong style={{ color: "#2952c8" }}>water sports experiences</strong> for every
          level. Kayaking, surfing, sailing and more.
        </p>
        <p>
          Each water sports package includes professional instruction, certified safety equipment
          and accommodation near the water. Our instructors are accredited and experienced with
          first-time participants.
        </p>
        <p>
          Starting your water sports adventure? Don't worry — our beginner-friendly programmes are
          designed to have you paddling or surfing with confidence on day one.
        </p>
      </div>
    </div>
  );
}
