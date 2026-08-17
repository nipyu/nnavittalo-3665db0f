import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { nnaSupabase } from "@/lib/nna-supabase";
import { showToast } from "@/components/nna/Toast";

const TITLE = "My Adventures — NNA VITTALO Bookings";
const DESC = "View, track and cancel your NNA VITTALO adventure bookings.";

export const Route = createFileRoute("/my-bookings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyBookings,
});

type Booking = {
  id: string;
  event_name: string | null;
  status: string | null;
  created_at: string;
};

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  return now;
}

function countdown(ms: number) {
  if (ms < 0) return "EXPIRED";
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function MyBookings() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const now = useNow();

  const load = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await nnaSupabase.auth.getUser();
    if (!user) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    const { data, error: err } = await nnaSupabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setBookings((data ?? []) as Booking[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking? This cannot be undone.")) return;
    const { error: err } = await nnaSupabase.from("bookings").delete().eq("id", id);
    if (err) showToast("❌ Error: " + err.message);
    else {
      showToast("✅ Booking removed successfully.");
      void load();
    }
  };

  const logout = async () => {
    await nnaSupabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px 60px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontFamily: "Montserrat,sans-serif", color: "#0f2266", fontSize: "1.5rem" }}>
          My Adventures
        </h1>
        {signedIn && (
          <button
            className="btn-outline"
            style={{ fontSize: ".7rem", padding: "6px 12px", borderColor: "#ff4d4d", color: "#ff4d4d" }}
            onClick={logout}
          >
            Log Out
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#7a8599" }}>Fetching your adventures...</p>
      ) : !signedIn ? (
        <p style={{ textAlign: "center", color: "#7a8599", padding: 20 }}>
          Please sign in to view your bookings.
        </p>
      ) : error ? (
        <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>
      ) : bookings.length === 0 ? (
        <p style={{ textAlign: "center", padding: 20 }}>No adventures found.</p>
      ) : (
        bookings.map((b) => {
          const expiry = new Date(b.created_at).getTime() + 24 * 60 * 60 * 1000;
          const canCancel = now < expiry;
          return (
            <div
              key={b.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                padding: 15,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <span style={{ fontWeight: 700, color: "#0f2266" }}>{b.event_name}</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    background: "#ecfdf5",
                    color: "#065f46",
                    padding: "2px 8px",
                    borderRadius: 99,
                    fontWeight: 700,
                  }}
                >
                  {(b.status ?? "").toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "1px dashed #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "0.7rem", color: "#7a8599" }}>
                  {canCancel
                    ? `⏳ Time left to cancel: ${countdown(expiry - now)}`
                    : "🔒 Cancellation period ended"}
                </div>
                {canCancel && (
                  <button
                    onClick={() => cancel(b.id)}
                    style={{
                      background: "#fff1f1",
                      border: "1px solid #ffcccc",
                      color: "#ff4d4d",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.7rem",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
