import { useEffect, useState } from "react";
import { nnaSupabase } from "@/lib/nna-supabase";
import { GALLERY } from "@/lib/nna-data";
import { type Package } from "@/hooks/use-packages";
import { showToast } from "./Toast";

export function TripModal({ trip, onClose }: { trip: Package | null; onClose: () => void }) {
  const [view, setView] = useState<"details" | "form" | "success">("details");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", guests: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setView("details");
    setFormData({ name: "", email: "", phone: "", guests: 1 });
  }, [trip]);
  useEffect(() => {
    document.body.style.overflow = trip ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [trip]);

  if (!trip) return null;

  const gallery = GALLERY[trip.activity] ?? GALLERY["Kayaking"] ?? [];
  const isComingSoon = trip.coming_soon === true || trip.is_disabled === true;

  // Parse features safely
  let amenities: string[] = [];
  try {
    if (typeof trip.features === "string") {
      amenities = JSON.parse(trip.features);
    } else if (Array.isArray(trip.features)) {
      amenities = trip.features;
    }
  } catch (e) {
    amenities = [
      "✅ " + (trip.included || "Equipment included"),
      "✅ Professional guide / instructor",
      "✅ Meals & snacks Included",
      "✅ Safety gear",
      "✅ Transport from meeting point",
    ];
  }

  if (amenities.length === 0) {
    amenities = [
      "✅ " + (trip.included || "Equipment included"),
      "✅ Professional guide / instructor",
    ];
  }

  const handleStartBooking = () => {
    setView("form");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    setIsSubmitting(true);
    try {
      const total_paid_pln = trip.price_pln * formData.guests;
      const { error } = await nnaSupabase.from("bookings").insert([
        {
          package_id: trip.id,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          total_paid_pln,
          payment_status: "Confirmed",
        },
      ]);

      if (error) throw error;

      showToast("✅ Booking Confirmed!");
      setView("success");
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to submit booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: "flex", zIndex: 100 }}
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
          {view === "details" && (
            <>
              <div className="modal-main">
                <div className="modal-gallery">
                  <div className="gallery-grid">
                    <img src={trip.photo || gallery[0]} alt={trip.title} />
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
                  {trip.desc_text +
                    " Whether you're a first-timer or a seasoned adventurer, this package is carefully designed to deliver an unforgettable experience from start to finish."}
                </p>

                {trip.itinerary && (
                  <>
                    <h4
                      style={{
                        fontFamily: "Montserrat,sans-serif",
                        fontWeight: 700,
                        fontSize: ".85rem",
                        color: "#1a1f36",
                        marginBottom: 10,
                        marginTop: 20,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      Itinerary
                    </h4>
                    <div
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 20,
                        color: "#475569",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                      }}
                      className="itinerary-rich-text"
                      dangerouslySetInnerHTML={{ __html: trip.itinerary }}
                    />
                  </>
                )}

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
                        {trip.show_price ? trip.trip_date || "17 April 2026" : "Date TBA"}
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
                      "Currently Unavailable"
                    ) : (
                      <>
                        {trip.price_pln} <span style={{ fontSize: "1rem" }}>PLN</span>
                        <span
                          style={{
                            fontSize: ".9rem",
                            fontWeight: 700,
                            color: "#4a5568",
                            marginLeft: 8,
                          }}
                        >
                          (~{trip.price_eur ?? Math.round(trip.price_pln * 0.23)} EUR)
                        </span>
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: ".78rem", color: "#7a8599", marginBottom: 16 }}>
                    ✓ {trip.included || "Equipment & guide included"}
                  </div>

                  <button
                    className={`btn-book-modal${isComingSoon ? " btn-disabled-modal" : ""}`}
                    disabled={isComingSoon}
                    onClick={handleStartBooking}
                    style={
                      isComingSoon
                        ? {
                            background: "#e2e8f0",
                            color: "#94a3b8",
                            cursor: "not-allowed",
                            width: "100%",
                            padding: 18,
                            fontWeight: 800,
                          }
                        : { width: "100%", padding: 18, fontWeight: 800 }
                    }
                  >
                    {isComingSoon
                      ? trip.is_disabled
                        ? "Unavailable"
                        : "Coming Soon"
                      : "🎉 Book Your Spot"}
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
            </>
          )}
          {view === "form" && (
            <div className="modal-main" style={{ width: "100%", padding: "20px" }}>
              <h3
                style={{
                  fontFamily: "Montserrat,sans-serif",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: "#0f2266",
                  marginBottom: 20,
                }}
              >
                Complete your Booking
              </h3>
              <form
                onSubmit={handleBookingSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "15px" }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#4a5568",
                      marginBottom: "5px",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #cbd5e0",
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#4a5568",
                      marginBottom: "5px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #cbd5e0",
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#4a5568",
                      marginBottom: "5px",
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #cbd5e0",
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#4a5568",
                      marginBottom: "5px",
                    }}
                  >
                    Number of Guests
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="20"
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #cbd5e0",
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#0f2266",
                    textAlign: "right",
                  }}
                >
                  Total: {trip.price_pln * formData.guests} PLN
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setView("details")}
                    style={{
                      flex: 1,
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e0",
                      background: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      flex: 2,
                      padding: "15px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#2952c8",
                      color: "white",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {isSubmitting ? "Confirming..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          )}
          {view === "success" && (
            <div
              className="modal-main"
              style={{ width: "100%", textAlign: "center", padding: "40px 20px" }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🎉</div>
              <h3
                style={{
                  fontFamily: "Montserrat,sans-serif",
                  fontWeight: 900,
                  fontSize: "2rem",
                  color: "#0f2266",
                  marginBottom: "15px",
                }}
              >
                Booking Confirmed!
              </h3>
              <p
                style={{
                  color: "#4a5568",
                  fontSize: "1.1rem",
                  marginBottom: "30px",
                  lineHeight: "1.6",
                }}
              >
                Thank you, <strong>{formData.name}</strong>! Your adventure is booked.
                <br />
                We will contact you shortly at <strong>{formData.email}</strong> or{" "}
                <strong>{formData.phone}</strong> with more details.
              </p>
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #cbd5e0",
                  padding: "20px",
                  borderRadius: "12px",
                  textAlign: "left",
                  maxWidth: "400px",
                  margin: "0 auto 30px",
                }}
              >
                <h4 style={{ margin: "0 0 15px 0", color: "#0f2266", fontWeight: 800 }}>
                  Booking Details
                </h4>
                <div
                  style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}
                >
                  <span style={{ color: "#718096" }}>Trip:</span>
                  <span style={{ fontWeight: 600, color: "#2d3748" }}>{trip.title}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}
                >
                  <span style={{ color: "#718096" }}>Guests:</span>
                  <span style={{ fontWeight: 600, color: "#2d3748" }}>{formData.guests}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#718096" }}>Total Paid:</span>
                  <span style={{ fontWeight: 800, color: "#2952c8" }}>
                    {trip.price_pln * formData.guests} PLN
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: "15px 40px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#2952c8",
                  color: "white",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
