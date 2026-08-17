import { useEffect } from "react";
import { GALLERY, type Trip } from "@/lib/nna-data";
import { showToast } from "./Toast";

const STRIPE_LINK = "https://buy.stripe.com/7sY6oG5aI3MKcVW4i148001";

export function TripModal({ trip, onClose }: { trip: Trip | null; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = trip ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [trip]);

  if (!trip) return null;

  const gallery = GALLERY[trip.activity] ?? GALLERY["Kayaking"] ?? [];
  const isComingSoon = trip.comingSoon === true;
  const amenities = [
    "✅ " + (trip.included || "Equipment included"),
    " ✅ Professional guide / instructor",
    "✅ Meals & snacks Included",
    "✅ Safety gear",
    "✅ Transport from meeting point",
  ];

  const confirmBooking = () => {
    showToast("🚀 Redirecting to secure payment...");
    window.location.href = STRIPE_LINK;
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: "flex" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: "2.2rem" }}>{trip.emoji}</div>
            <div>
              <div
                style={{
                  fontFamily: "Montserrat,sans-serif",
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  color: "#fff",
                }}
              >
                {trip.title}
              </div>
              <div
                style={{ fontSize: ".82rem", color: "rgba(255,255,255,.7)", marginTop: 2 }}
              >{`📍 ${trip.location}  ·  🏷️ ${trip.activity}  ·  📅 ${trip.duration}`}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-main">
            <div className="modal-gallery">
              <div className="gallery-grid">
                <img src={gallery[0]} alt={trip.title} />
                <div className="gallery-sub">
                  {gallery.slice(1, 5).map((img) => (
                    <img key={img} src={img} alt="" loading="lazy" />
                  ))}
                </div>
              </div>
            </div>
            <h3
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "#0f2266",
                marginBottom: 10,
              }}
            >
              Feel the thrill of the wild 🌿
            </h3>
            <p
              style={{
                fontSize: ".9rem",
                color: "#4a5568",
                lineHeight: 1.75,
                marginBottom: 16,
              }}
            >
              {trip.desc +
                " Whether you're a first-timer or a seasoned adventurer, this package is carefully designed to deliver an unforgettable experience from start to finish."}
            </p>
            <h4
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontWeight: 700,
                fontSize: ".85rem",
                color: "#1a1f36",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Most Popular Amenities
            </h4>
            <div className="amenities-grid">
              {amenities.map((a) => (
                <div className="amenity-item" key={a}>
                  {a}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <h4
                style={{
                  fontFamily: "Montserrat,sans-serif",
                  fontWeight: 700,
                  fontSize: ".85rem",
                  color: "#1a1f36",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Trip Date
              </h4>
              <div
                style={{
                  background: "#e8eefb",
                  border: "1px solid #d0dcf8",
                  borderRadius: 10,
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>📅</span>
                <div>
                  <div
                    style={{
                      fontFamily: "Montserrat,sans-serif",
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: "#0f2266",
                    }}
                  >
                    {trip.showPrice ? trip.tripDate || "17 April 2026" : "Date TBA"}
                  </div>
                  <div style={{ fontSize: ".78rem", color: "#4a5568", marginTop: 2 }}>
                    Departure date
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-sidebar">
            <div className="booking-panel">
              <div className="booking-label">Total price</div>
              <div className="booking-price">
                {isComingSoon ? (
                  "Price Coming Soon"
                ) : (
                  <>
                    {trip.price} <span style={{ fontSize: "1rem" }}>PLN</span>
                    <span
                      style={{
                        fontSize: ".9rem",
                        fontWeight: 700,
                        color: "#4a5568",
                        marginLeft: 8,
                      }}
                    >
                      (~{trip.priceEur ?? Math.round(trip.price * 0.23)} EUR)
                    </span>
                  </>
                )}
              </div>
              <div style={{ fontSize: ".78rem", color: "#7a8599", marginBottom: 16 }}>
                ✓ {trip.included || "Equipment & guide included"}
              </div>

              <div
                style={{
                  background: "#f0f7ff",
                  border: "1px dashed #2952c8",
                  padding: 15,
                  borderRadius: 12,
                  marginBottom: 20,
                }}
              >
                <p style={{ fontSize: "0.82rem", color: "#2952c8", lineHeight: 1.4, margin: 0 }}>
                  <strong>Secure Booking:</strong> Click below to pay via Stripe. You will provide
                  your contact details and guest count on the next page.
                </p>
              </div>

              <button
                className={`btn-book-modal${isComingSoon ? " btn-disabled-modal" : ""}`}
                disabled={isComingSoon}
                onClick={confirmBooking}
                style={{ width: "100%", padding: 18, fontWeight: 800 }}
              >
                {isComingSoon ? "Coming Soon" : "🎉 Book Your Spot"}
              </button>

              <p
                style={{
                  fontSize: ".72rem",
                  color: "#7a8599",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Your fellow trip mates are waiting for you 🥰 !!
              </p>
            </div>

            <div className="trust-box">
              🏆 Trusted by 150+ adventurers
              <br />
              <span style={{ fontWeight: 400, color: "#4a5568" }}>4.9 ⭐ average rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
