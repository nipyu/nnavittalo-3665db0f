import { useMemo, useState } from "react";
import { TRIPS, type Trip } from "@/lib/nna-data";
import { TripModal } from "./TripModal";
import { showToast } from "./Toast";

const ACTIVITIES = ["Kayaking", "Skiing", "Surfing", "Hiking", "Camping", "City Tours"];
const DURATIONS = ["Weekend (2–3 days)", "Short (4–5 days)", "Week (6–7 days)"];
const PRICES = ["Under 400", "400–700 PLN", "700–1000 PLN", "1000+ PLN"];
const DIFFS = ["All", "Beginner", "Intermediate", "Advanced"];

function TripCard({ t, onOpen }: { t: Trip; onOpen: (t: Trip) => void }) {
  const comingSoon = t.comingSoon === true;
  const eur = t.priceEur ?? 0;

  return (
    <div
      className="trip-card"
      style={comingSoon ? { cursor: "default" } : undefined}
      onClick={() => {
        if (!comingSoon) onOpen(t);
      }}
    >
      <div className="trip-img">
        {t.photo && <img src={t.photo} alt={t.title} loading="lazy" />}
        <div className="trip-badges">
          {t.badges.map((b) => (
            <span key={b.l} className={`badge badge-${b.t}`}>
              {b.l}
            </span>
          ))}
        </div>
      </div>
      <div className="trip-body">
        <div className="trip-tags">
          {t.tags.map((tg) => (
            <span key={tg.l} className={`tag tag-${tg.t}`}>
              {tg.l}
            </span>
          ))}
        </div>
        <h3 className="trip-title">{t.title}</h3>
        <div className="trip-loc">📍 {t.location}</div>
        {t.showPrice && t.tripDate ? (
          <div className="trip-date-text" style={{ color: "#2952c8" }}>
            📅 {t.tripDate}
          </div>
        ) : (
          <div className="trip-date-text" style={{ color: "#b0b8cc" }}>
            📅 Coming soon
          </div>
        )}

        <div className="trip-features">
          {t.features.map((f) => (
            <span className="feature-tag" key={f}>
              {f}
            </span>
          ))}
        </div>

        <div className="trip-footer">
          <div>
            <div className="trip-price-label">Starting from</div>
            {t.showPrice && !comingSoon ? (
              <div
                className="trip-price"
                style={{
                  color: "#2952c8",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                }}
              >
                {t.price} <span style={{ fontSize: "0.85rem" }}>PLN</span>
                <span style={{ margin: "0 2px" }}>/</span>
                {eur} <span style={{ fontSize: "0.85rem" }}>EUR</span>
              </div>
            ) : (
              <div
                className="trip-price-na"
                style={{ color: "#add8e6", fontWeight: 800, fontSize: "1.1rem" }}
              >
                — <span>PLN</span> / — EUR
              </div>
            )}
            <div style={{ fontSize: ".72rem", color: "#4a5568", marginTop: 4 }}>all inclusive</div>
            <div
              className="trip-included"
              style={{
                color: "#22c55e",
                fontWeight: 700,
                fontSize: ".72rem",
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {comingSoon ? null : (
                <>
                  <span>✓</span> {t.included || "Equipment included"}
                </>
              )}
            </div>
          </div>
          <div className="trip-btns">
            <button
              className={`btn-book${comingSoon ? " btn-disabled-home" : ""}`}
              disabled={comingSoon}
              onClick={(e) => {
                e.stopPropagation();
                onOpen(t);
              }}
            >
              Book Now
            </button>
            <button
              className={`btn-details${comingSoon ? " btn-disabled-home" : ""}`}
              disabled={comingSoon}
              onClick={(e) => {
                e.stopPropagation();
                onOpen(t);
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TripsBrowser() {
  const [activities, setActivities] = useState<string[]>([]);
  const [durations, setDurations] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [diff, setDiff] = useState("All");
  const [sort, setSort] = useState("Upcoming");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selected, setSelected] = useState<Trip | null>(null);

  const toggle = (
    value: string,
    list: string[],
    set: (v: string[]) => void,
  ) => set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const trips = useMemo(() => {
    let out = TRIPS.filter((t) => {
      if (activities.length && !activities.includes(t.activity)) return false;
      if (durations.length && !durations.includes(t.durationTag)) return false;
      if (prices.length && !prices.includes(t.priceRange)) return false;
      if (diff !== "All" && t.difficulty !== diff) return false;
      return true;
    });
    if (sort === "Price") out = [...out].sort((a, b) => a.price - b.price);
    return out;
  }, [activities, durations, prices, diff, sort]);

  const anyActive =
    activities.length > 0 || durations.length > 0 || prices.length > 0 || diff !== "All";

  const clearFilters = () => {
    setActivities([]);
    setDurations([]);
    setPrices([]);
    setDiff("All");
  };

  return (
    <div className="main-wrap" id="packages">
      <aside className="filters-sidebar">
        <div className="filters-header" onClick={() => setFiltersOpen((v) => !v)}>
          <span>🔍 Filters</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontSize: ".72rem",
                fontWeight: 600,
                color: "rgba(255,255,255,.75)",
                textDecoration: "underline",
                cursor: "pointer",
                display: anyActive ? "inline" : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
            >
              Clear
            </span>
            <span
              className="arr"
              style={{ transform: filtersOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▼
            </span>
          </div>
        </div>
        <div style={{ display: filtersOpen ? "block" : "none" }}>
          <div className="fgroup">
            <div className="fgroup-title">Activity Type</div>
            <div>
              {ACTIVITIES.map((a) => (
                <label className="chk-opt" key={a}>
                  <input
                    type="checkbox"
                    checked={activities.includes(a)}
                    onChange={() => toggle(a, activities, setActivities)}
                  />{" "}
                  {a}
                </label>
              ))}
            </div>
          </div>
          <div className="fgroup">
            <div className="fgroup-title">Duration</div>
            <div>
              {DURATIONS.map((d) => (
                <label className="chk-opt" key={d}>
                  <input
                    type="checkbox"
                    checked={durations.includes(d)}
                    onChange={() => toggle(d, durations, setDurations)}
                  />{" "}
                  {d}
                </label>
              ))}
            </div>
          </div>
          <div className="fgroup">
            <div className="fgroup-title">Price Range (PLN / person)</div>
            <div>
              {PRICES.map((p) => (
                <label className="chk-opt" key={p}>
                  <input
                    type="checkbox"
                    checked={prices.includes(p)}
                    onChange={() => toggle(p, prices, setPrices)}
                  />{" "}
                  {p}
                </label>
              ))}
            </div>
          </div>
          <div className="fgroup">
            <div className="fgroup-title">Difficulty</div>
            <div className="diff-btns">
              {DIFFS.map((d) => (
                <button
                  key={d}
                  className={`diff-btn${diff === d ? " active" : ""}`}
                  onClick={() => setDiff(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button className="filters-apply" onClick={() => showToast("✅ Filters applied!")}>
            Show Results
          </button>
        </div>
      </aside>

      <div>
        <div className="trips-header">
          <div
            style={{
              fontFamily: "Montserrat,sans-serif",
              fontWeight: 700,
              fontSize: ".88rem",
              color: "#4a5568",
            }}
          >
            Showing <span style={{ color: "#2952c8" }}>{trips.length} trips</span> available
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: ".82rem", fontWeight: 600, color: "#4a5568" }}>Sort:</span>
            <div className="sort-btns">
              {(
                [
                  ["Upcoming", "Upcoming"],
                  ["Price", "Price ↑"],
                  ["Popular", "Most Popular"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  className={`sort-btn${sort === key ? " active" : ""}`}
                  onClick={() => setSort(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          {trips.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 40,
                textAlign: "center",
                color: "#7a8599",
              }}
            >
              No trips match your filters.
            </div>
          ) : (
            trips.map((t) => <TripCard key={t.id} t={t} onOpen={setSelected} />)
          )}
        </div>
      </div>

      <TripModal trip={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
