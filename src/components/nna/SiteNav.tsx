import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { nnaSupabase } from "@/lib/nna-supabase";

const WHATSAPP = "https://wa.me/48729648997";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    nnaSupabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  useEffect(() => {
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goPackages = () => {
    setOpen(false);
    if (pathname === "/") {
      document.querySelector("#packages")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate({ to: "/trips" });
    }
  };

  const jump = (hash: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">⛰️</div>
          <div className="nav-logo-text">
            NNA VITTALO<small>Adventure Travel</small>
          </div>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="/#about" onClick={jump("#about")}>
            About Us
          </a>
          <Link to="/trips">Camps</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="nav-actions">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            💬 Chat
          </a>
          {signedIn ? (
            <Link to="/my-bookings" className="btn-solid" style={{ textDecoration: "none" }}>
              👤 Bookings
            </Link>
          ) : (
            <button className="btn-solid" onClick={goPackages}>
              Book a Trip
            </button>
          )}
        </div>

        <button
          className={`hamburger${open ? " active" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`mobile-menu${open ? " open" : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>
          🏠 Home
        </Link>
        <a href="/#about" onClick={jump("#about")}>
          ℹ️ About Us
        </a>
        <Link to="/trips" onClick={() => setOpen(false)}>
          🏄 Camps
        </Link>
        <Link to="/contact" onClick={() => setOpen(false)}>
          📞 Contact
        </Link>
        <div className="mobile-menu-btns">
          <a
            href={WHATSAPP}
            className="btn-outline"
            style={{
              background: "#25D366",
              color: "white",
              border: "none",
              textAlign: "center",
              textDecoration: "none",
              width: "100%",
              display: "block",
              padding: 12,
              borderRadius: 8,
            }}
          >
            Chat on WhatsApp
          </a>
          <button className="btn-solid" style={{ width: "100%", marginTop: 10 }} onClick={goPackages}>
            Book a Trip
          </button>
        </div>
      </div>
    </nav>
  );
}
