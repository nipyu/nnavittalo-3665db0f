import { createFileRoute } from "@tanstack/react-router";
import { Banner } from "@/components/nna/Hero";
import { TripsBrowser } from "@/components/nna/TripsBrowser";
import { SuccessModal } from "@/components/nna/SuccessModal";

const TITLE = "All Adventure Camps & Trips — NNA VITTALO";
const DESC =
  "Browse every NNA VITTALO adventure: kayaking, surfing, skiing, hiking, camping and memorial tours. Filter by activity, duration, price and difficulty.";

export const Route = createFileRoute("/trips")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TripsPage,
});

function TripsPage() {
  return (
    <>
      <div style={{ background: "#0f2266", padding: "48px 20px 40px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "Montserrat,sans-serif",
            fontWeight: 900,
            color: "#fff",
            fontSize: "2rem",
          }}
        >
          Our Adventure Camps
        </h1>
        <p style={{ color: "rgba(255,255,255,.75)", marginTop: 10, fontSize: ".95rem" }}>
          Skipass, equipment and guides included in every package.
        </p>
      </div>
      <Banner />
      <TripsBrowser />
      <SuccessModal />
    </>
  );
}
