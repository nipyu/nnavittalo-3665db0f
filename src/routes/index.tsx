import { createFileRoute } from "@tanstack/react-router";
import { Banner, Hero, InfoGrid } from "@/components/nna/Hero";
import { TripsBrowser } from "@/components/nna/TripsBrowser";
import { ContactSection } from "@/components/nna/ContactSection";
import { SuccessModal } from "@/components/nna/SuccessModal";

const TITLE = "NNA VITTALO — Adventure Travel";
const DESC =
  "Adventure travel packages across Europe — kayaking, skiing, surfing, hiking and camping. Skipass, equipment and guides always included.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <>
      <div className="topbar">
        <div className="scrolling-content">
          <span>🏔️ All Passes are included in the price!</span>
        </div>
      </div>
      <Hero />
      <Banner />
      <TripsBrowser />
      <InfoGrid />
      <ContactSection />
      <SuccessModal />
    </>
  );
}
