import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/nna/ContactSection";

const TITLE = "Contact NNA VITTALO — Plan Your Adventure";
const DESC =
  "Get in touch with NNA VITTALO for custom trips, group bookings and questions. Email info@nnavittalo.com or WhatsApp +48729648977.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <h1
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        Contact NNA VITTALO
      </h1>
      <ContactSection />
    </>
  );
}
