import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">⛰️ NNA VITTALO</div>
          <p className="footer-tagline">
            Europe's premier adventure travel operator. Mountains, oceans, forests — unforgettable
            journeys crafted for the bold.
          </p>
          <div style={{ fontSize: ".82rem" }}>
            📧 info@nnavittalo.com
            <br />
            📞 +48729648977
          </div>
        </div>
        <div className="footer-col">
          <h4>Our Trips</h4>
          <Link to="/trips">Kayaking Getaway</Link>
          <Link to="/trips">Ski Trip</Link>
          <Link to="/trips">Surfing Camp</Link>
          <Link to="/trips">Hiking in Tatra</Link>
          <Link to="/trips">Camping Weekend</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="/#about">About Us</a>
          <Link to="/contact">Contact</Link>
          <Link to="/trips">All Trips</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="mailto:info@nnavittalo.com">info@nnavittalo.com</a>
          <a href="https://wa.me/487294877">+48729648977</a>
          <span>Warsaw, Poland</span>
          <span>Mon–Fri 9:00–18:00</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 NNA VITTALO. All rights reserved.</span>
        <div style={{ display: "flex", gap: 20 }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
