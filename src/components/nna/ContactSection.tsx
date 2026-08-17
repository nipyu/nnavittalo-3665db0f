import { useState } from "react";
import { showToast } from "./Toast";

export function ContactSection() {
  const [email, setEmail] = useState("");

  const subscribe = () => {
    if (!email || !email.includes("@")) {
      showToast("⚠️ Please enter a valid email address.");
      return;
    }
    setEmail("");
    showToast("✅ Subscribed! Welcome to the NNA VITTALO community 🏔️");
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-inner">
        <h2>Questions? Get in Touch! 🗺️</h2>
        <p>
          Looking for a custom trip, group booking or just want to know more? Our team is here to
          help plan your perfect adventure.
        </p>
        <div className="contact-cards">
          <a href="mailto:info@nnavittalo.com" className="contact-card">
            <span className="contact-card-icon">📧</span>
            <div>
              <div className="contact-card-label">Email Us</div>
              <div className="contact-card-val">info@nnavittalo.com</div>
            </div>
          </a>
          <a href="https://wa.me/487294877" target="_blank" rel="noreferrer" className="contact-card">
            <span className="contact-card-icon">📞</span>
            <div>
              <div className="contact-card-label">Call / WhatsApp Us</div>
              <div className="contact-card-val">+48729648977</div>
            </div>
          </a>
        </div>
        <p style={{ fontSize: ".82rem", marginBottom: 10, color: "rgba(255,255,255,.6)" }}>
          Join our newsletter — be the first to hear about new trips, discounts and adventures!
        </p>
        <div className="nl-form">
          <input
            type="email"
            placeholder="Your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={subscribe}>Subscribe</button>
        </div>
      </div>
    </section>
  );
}
