import { useState, useMemo, useEffect, useRef } from "react";
import { showToast } from "./Toast";
import { TripModal } from "./TripModal";
import { usePackages, type Package } from "@/hooks/use-packages";

const ACTIVITIES = ["Kayaking", "Surfing", "Skiing", "Hiking", "Camping", "City Tours"];
const DURATIONS = ["Day Trip (1 day)", "Weekend (2–3 days)", "Short (4–5 days)", "Long (6+ days)"];
const PRICES = ["Under 400", "400–700 PLN", "700–1000 PLN", "1000+ PLN"];
const DIFFS = ["All", "Beginner", "Intermediate", "Advanced"];

function TripCard({ t, onOpen }: { t: Package; onOpen: (t: Package) => void }) {
  const eur = t.price_eur ?? Math.round(t.price_pln * 0.23);
  const comingSoon = t.coming_soon || t.is_disabled;

  return (
    <div className={`trip-card${comingSoon ? " is-soon" : ""}`} onClick={() => onOpen(t)}>
      <div className="trip-img-wrap">
        <img src={t.photo} alt={t.title} loading="lazy" />
        <div className="trip-badges">
          {Array.isArray(t.badges) &&
            t.badges.map((b: unknown, i: number) => (
              <span key={i} className={`badge badge-${b.t}`}>
                {b.l}
              </span>
            ))}
          {t.is_disabled && <span className="badge badge-soon">Currently Unavailable</span>}
        </div>
        <div className="trip-fav" onClick={(e) => e.stopPropagation()}>
          ♡
        </div>
      </div>
      <div className="trip-content">
        <div className="trip-meta">
          <div className="trip-loc">
            <span>📍</span> {t.location}
          </div>
          <div className="trip-dur">
            <span>⏳</span> {t.duration}
          </div>
        </div>
        <h3 className="trip-title">
          <span>{t.emoji}</span>
          {t.title}
        </h3>
        <p className="trip-desc">{t.desc_text}</p>

        <div className="trip-tags">
          {Array.isArray(t.tags) &&
            t.tags.map((tg: unknown, i: number) => (
              <span key={i} className={`tag tag-${tg.t}`}>
                {tg.l}
              </span>
            ))}
        </div>

        <div className="trip-foot">
          <div className="trip-price">
            {t.show_price ? (
              <div
                style={{
                  color: "#0f2266",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                }}
              >
                {t.price_pln} <span style={{ fontSize: "0.85rem" }}>PLN</span>
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
                if (!comingSoon) onOpen(t);
              }}
              style={
                comingSoon
                  ? {
                      background: "#e2e8f0",
                      color: "#94a3b8",
                      cursor: "not-allowed",
                      boxShadow: "none",
                    }
                  : {}
              }
            >
              Book Now
            </button>
            <button
              className={`btn-details`}
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
  const { data: allTrips = [], isLoading } = usePackages(false); // Fetch active packages
  const [appliedActivities, setAppliedActivities] = useState<string[]>([]);
  const [appliedDurations, setAppliedDurations] = useState<string[]>([]);
  const [appliedPrices, setAppliedPrices] = useState<string[]>([]);
  const [appliedDiff, setAppliedDiff] = useState("All");

  const [activities, setActivities] = useState<string[]>([]);
  const [durations, setDurations] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [diff, setDiff] = useState("All");
  const [sort, setSort] = useState("Upcoming");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<Package | null>(null);

  const filtersRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (value: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const trips = useMemo(() => {
    let out = allTrips.filter((t) => {
      if (appliedActivities.length && !appliedActivities.includes(t.activity)) return false;
      if (appliedDurations.length && !appliedDurations.includes(t.duration_tag)) return false;
      if (appliedPrices.length && !appliedPrices.includes(t.price_range)) return false;
      if (appliedDiff !== "All" && t.difficulty !== appliedDiff) return false;
      return true;
    });
    // Default sorting is already by priority descending from usePackages
    if (sort === "Price") out = [...out].sort((a, b) => a.price_pln - b.price_pln);
    if (sort === "Popular") out = [...out].sort((a, b) => b.priority - a.priority); // Example logic
    return out;
  }, [appliedActivities, appliedDurations, appliedPrices, appliedDiff, sort, allTrips]);

  const anyActive =
    appliedActivities.length > 0 ||
    appliedDurations.length > 0 ||
    appliedPrices.length > 0 ||
    appliedDiff !== "All";

  const applyFilters = () => {
    setAppliedActivities(activities);
    setAppliedDurations(durations);
    setAppliedPrices(prices);
    setAppliedDiff(diff);
  };

  const clearFilters = () => {
    setActivities([]);
    setDurations([]);
    setPrices([]);
    setDiff("All");
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Loading adventures...</div>;
  }

  return (
    <div className="trips-wrap" id="packages">
      <div className="trips-controls-bar">
        <div className="trips-count">
          Showing <span>{trips.length} trips</span> available
        </div>
        <div className="trips-controls-btns">
          <div className="dropdown" ref={filtersRef}>
            <button
              className={`dropdown-btn${filtersOpen ? " active" : ""}`}
              onClick={() => {
                if (!filtersOpen) {
                  setActivities(appliedActivities);
                  setDurations(appliedDurations);
                  setPrices(appliedPrices);
                  setDiff(appliedDiff);
                  setFiltersOpen(true);
                  setSortOpen(false);
                }
              }}
            >
              Filters
              {anyActive && <span className="dropdown-dot" />}
              <span
                className="dropdown-arr"
                style={{ transform: filtersOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▼
              </span>
            </button>
          </div>

          {filtersOpen && (
            <div className="filters-modal-overlay" onClick={() => setFiltersOpen(false)}>
              <div className="filters-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="filters-modal-head">
                  <span>Filter trips</span>
                  {(activities.length > 0 ||
                    durations.length > 0 ||
                    prices.length > 0 ||
                    diff !== "All") && (
                    <button className="filters-clear" onClick={clearFilters}>
                      Clear all
                    </button>
                  )}
                </div>
                <div className="filters-modal-grid">
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
                </div>
                <button
                  className="filters-modal-apply"
                  onClick={() => {
                    applyFilters();
                    showToast("✅ Filters applied!");
                    setFiltersOpen(false);
                  }}
                >
                  Show Results
                </button>
              </div>
            </div>
          )}

          <div className="dropdown" ref={sortRef}>
            <button
              className={`dropdown-btn${sortOpen ? " active" : ""}`}
              onClick={() => {
                setSortOpen((v) => !v);
                setFiltersOpen(false);
              }}
            >
              Sort by
              <span
                className="dropdown-arr"
                style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▼
              </span>
            </button>
            {sortOpen && (
              <div className="dropdown-panel sort-panel">
                {(
                  [
                    ["Upcoming", "Priority / Recommended"],
                    ["Price", "Price ↑"],
                    ["Popular", "Most Popular"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    className={`sort-btn${sort === key ? " active" : ""}`}
                    onClick={() => {
                      setSort(key);
                      setSortOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="trips-list">
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

      <TripModal trip={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
