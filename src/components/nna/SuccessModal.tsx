import { useEffect, useRef, useState } from "react";
import { nnaSupabase } from "@/lib/nna-supabase";
import { showToast } from "./Toast";

export function SuccessModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("1");
  const [saving, setSaving] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<{ isValidNumber: () => boolean; getNumber: () => string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") setOpen(true);
  }, []);

  useEffect(() => {
    if (!open || !phoneRef.current || itiRef.current) return;
    let cancelled = false;
    import("intl-tel-input").then(({ default: intlTelInput }) => {
      if (cancelled || !phoneRef.current) return;
      itiRef.current = intlTelInput(phoneRef.current, {
        initialCountry: "auto",
        geoIpLookup: (success: (code: string) => void) => {
          fetch("https://ipapi.co/json")
            .then((r) => r.json())
            .then((d) => success(d.country_code))
            .catch(() => success("pl"));
        },
        separateDialCode: true,
        loadUtils: () => import("intl-tel-input/utils"),
      } as never) as never;
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const save = async () => {
    const userName = name.trim();
    const iti = itiRef.current;
    const userPhone = (iti ? iti.getNumber() : phone).trim();

    if (!userName || !userPhone) {
      showToast("⚠️ Please enter your name and phone number.");
      return;
    }
    if (iti && !iti.isValidNumber()) {
      showToast("❌ Invalid phone number");
      return;
    }

    setSaving(true);
    try {
      const { error } = await nnaSupabase.from("bookings").insert([
        {
          full_name: userName,
          phone: userPhone,
          guests,
          status: "confirmed",
          created_at: new Date(),
        },
      ]);
      if (error) throw error;
      showToast("✅ Adventure Confirmed! See you soon 🏔️");
      close();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showToast("❌ Error saving details: " + message);
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        inset: 0,
        background: "rgba(15,34,102,0.95)",
        zIndex: 999999,
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
        padding: 20,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "white",
          maxWidth: 500,
          width: "100%",
          borderRadius: 20,
          padding: 30,
          position: "relative",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ fontSize: "3.5rem" }}>🎉</span>
          <h2
            style={{
              color: "#0f2266",
              marginTop: 10,
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 900,
            }}
          >
            Payment Successful!
          </h2>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Please finalize your details to confirm your adventure.
          </p>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: 20,
            borderRadius: 15,
            border: "1px solid #dde4f5",
          }}
        >
          <div style={{ marginBottom: 15 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 800,
                color: "#4a5568",
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              Your Full Name
            </label>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                border: "1.5px solid #cbd5e0",
                borderRadius: 10,
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 800,
                color: "#4a5568",
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              Mobile Number
            </label>
            <input
              ref={phoneRef}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                border: "1.5px solid #cbd5e0",
                borderRadius: 10,
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#4a5568",
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              Guests Paid For
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #cbd5e0",
                borderRadius: 8,
                background: "white",
                fontWeight: "bold",
                color: "#0f2266",
              }}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n === 1 ? "1 Person" : `${n} People`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={save}
            disabled={saving}
            style={{
              width: "100%",
              padding: 18,
              background: "#2952c8",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "1rem",
              transition: "0.2s",
            }}
          >
            {saving ? "⏳ SAVING..." : "🚀 CONFIRM MY ADVENTURE"}
          </button>
        </div>
      </div>
    </div>
  );
}
