import { useState, useEffect, useRef } from 'react';

const STATIONS = [
  {
    pos: "Station 1 · Sit",
    short: "Kiosk",
    title: "The Living Lab Kiosk",
    body: "Take a seat and start talking. Liv listens, asks and learns while the pod quietly takes its first readings. No forms. No clipboard. Just a conversation.",
    chips: ["Voice-led", "Vitals", "Heart", "Blood markers", "Memory and focus"]
  },
  {
    pos: "Station 2 · In the pod",
    short: "Photobiomodulation",
    title: "Photobiomodulation",
    body: "Photobiomodulation is integrated with the pod, so light becomes part of the visit itself. There is nothing extra to arrange and nowhere else to go.",
    chips: ["Integrated with the pod", "Part of the visit"]
  },
  {
    pos: "Station 3 · Stand",
    short: "Body scan",
    title: "The body scan",
    body: "Stand still for a moment. The pod sees how you stand, how you are built and how you carry yourself. Nothing touches you.",
    chips: ["Posture", "Body composition", "Shape"]
  },
  {
    pos: "Station 4 · Stand",
    short: "Face and hair",
    title: "Face, skin and hair",
    body: "A closer look at what the mirror misses. Your skin and hair get their own reading, and their own plan.",
    chips: ["Face", "Skin", "Hair"]
  },
  {
    pos: "Station 5 · Lie",
    short: "Recliner",
    title: "The recliner",
    body: "Lie back. The pod keeps reading while your body recovers. This is the part members do not want to end.",
    chips: ["Rest", "Recovery", "Still reading"]
  },
  {
    pos: "Station 6 · Lie",
    short: "Mind and face",
    title: "For the mind and the face",
    body: "Two experiences are reserved for the recliner. One is for the mind. One is for the face. Both are better felt than described.",
    chips: ["Mind", "Face"]
  },
  {
    pos: "Station 7 · Beyond the pod",
    short: "Your therapies",
    title: "Your therapies, connected",
    body: "The pod does not work alone. The therapies your centre already offers join the same experience, so every session adds to one story.",
    chips: ["Hyperbaric oxygen", "Cryotherapy", "VO₂ max"]
  }
];

const HOTSPOTS = [
  { i: 0, cx: 101, cy: 215, label: "Station 1, Living Lab Kiosk" },
  { i: 1, cx: 262, cy: 104, label: "Station 2, photobiomodulation" },
  { i: 2, cx: 345, cy: 215, label: "Station 3, smart camera and body scan" },
  { i: 3, cx: 456, cy: 316, label: "Station 4, face, skin and hair analyser" },
  { i: 4, cx: 508, cy: 215, label: "Station 5, recliner" },
  { i: 5, cx: 578, cy: 215, label: "Station 6, mind and face" },
  { i: 6, cx: 680, cy: 215, label: "Station 7, connected machines outside the pod" },
];

export default function PodExplorer() {
  const [current, setCurrent] = useState(0);
  const [swapKey, setSwapKey] = useState(0); // triggers animation reset
  const [isMobile, setIsMobile] = useState(false);
  const touringRef = useRef(true);
  const seenRef = useRef(false);
  const curRef = useRef(0);
  const explorerRef = useRef(null);
  const detailRef = useRef(null);

  // Keep curRef in sync with current for use inside setInterval
  useEffect(() => {
    curRef.current = current;
  }, [current]);

  const show = (i) => {
    setCurrent(i);
    // Trigger the swap animation by toggling the class (remove + re-add)
    const det = detailRef.current;
    if (det) {
      det.classList.remove('swap');
      void det.offsetWidth; // force reflow
      det.classList.add('swap');
    }
  };

  // Mobile viewBox
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);

  // Intersection observer for auto-tour (whether explorer is in view)
  useEffect(() => {
    const el = explorerRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
      seenRef.current = entries[0].isIntersecting;
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-tour every 4200ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (touringRef.current && seenRef.current) {
        const next = (curRef.current + 1) % STATIONS.length;
        show(next);
      }
    }, 4200);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopTour = () => {
    touringRef.current = false;
  };

  const handleStationClick = (i) => {
    stopTour();
    show(i);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStationClick(i);
    }
  };

  const station = STATIONS[current];
  const viewBox = isMobile ? "0 34 712 376" : "0 0 900 430";

  return (
    <section className="sec" id="pod" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <p className="k">Inside the pod</p>
          <h2>A room that<br /><em>reads you.</em></h2>
          <p className="lede">This is the pod from above. Pick a number, or let it show you around.</p>
        </div>
        <div
          className="explorer"
          ref={explorerRef}
          onPointerDown={stopTour}
          onKeyDown={(e) => { if (e.key !== 'Tab') stopTour(); }}
        >
          <div className="plan">
            <svg viewBox={viewBox} role="group" aria-label="Plan view of the Living Lab pod with numbered stations">
              {/* shell */}
              <rect className="ln" x="20" y="60" width="610" height="310" rx="155"/>
              <rect className="faint" x="32" y="72" width="586" height="286" rx="143"/>
              {/* door */}
              <path className="dash" d="M300 370 q25 -46 70 -46"/>
              <line x1="300" y1="370" x2="370" y2="370" stroke="#141415" strokeWidth="4"/>
              <text x="335" y="398" textAnchor="middle">Entry</text>

              {/* kiosk (left end) */}
              <rect className="ln" x="78" y="150" width="46" height="130" rx="8"/>
              <rect className="faint" x="130" y="168" width="8" height="94" rx="4"/>
              <rect className="ln" x="158" y="188" width="54" height="54" rx="14"/>
              <text x="96" y="140">Kiosk</text>

              {/* stand: scan turntable + camera */}
              <circle className="ln" cx="345" cy="215" r="44"/>
              <circle className="faint" cx="345" cy="215" r="30"/>
              <rect className="ln" x="330" y="82" width="30" height="18" rx="5"/>
              <path className="dash" d="M345 100 L312 180 M345 100 L378 180"/>
              <text x="345" y="286" textAnchor="middle">Scan</text>

              {/* face analyser column */}
              <rect className="ln" x="436" y="296" width="40" height="40" rx="20"/>
              <text x="456" y="286" textAnchor="middle">Face</text>

              {/* recliner (opposite wall) */}
              <rect className="ln" x="470" y="170" width="118" height="90" rx="30"/>
              <rect className="faint" x="548" y="184" width="30" height="62" rx="15"/>
              <path className="ln" d="M560 196 a19 19 0 0 1 0 38"/>
              <text x="512" y="160" textAnchor="middle">Recliner</text>

              {/* outside machines */}
              <rect className="faint" x="720" y="60" width="150" height="84" rx="42"/>
              <text x="795" y="107" textAnchor="middle">HBOT</text>
              <rect className="faint" x="720" y="173" width="150" height="84" rx="42"/>
              <text x="795" y="220" textAnchor="middle">Cryotherapy</text>
              <rect className="faint" x="720" y="286" width="150" height="84" rx="42"/>
              <text x="795" y="333" textAnchor="middle">VO₂ max</text>
              <path className="dash" d="M630 215 H680 M680 102 V328 M680 102 H720 M680 215 H720 M680 328 H720"/>

              {/* hotspots */}
              {HOTSPOTS.map((spot) => (
                <g
                  key={spot.i}
                  className={`spot${current === spot.i ? ' on' : ''}`}
                  data-i={spot.i}
                  tabIndex={0}
                  role="button"
                  aria-label={spot.label}
                  onClick={() => handleStationClick(spot.i)}
                  onKeyDown={(e) => handleKeyDown(e, spot.i)}
                >
                  <circle className="halo" cx={spot.cx} cy={spot.cy} r="15"/>
                  <circle cx={spot.cx} cy={spot.cy} r="15"/>
                  <text x={spot.cx} y={spot.cy + 4}>{spot.i + 1}</text>
                </g>
              ))}
            </svg>
          </div>
          <div>
            <ul className="stations" id="stationList">
              {STATIONS.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    id={`station-btn-${i + 1}`}
                    aria-pressed={current === i ? "true" : "false"}
                    onClick={() => handleStationClick(i)}
                  >
                    {s.short}
                  </button>
                </li>
              ))}
            </ul>
            <div className="detail" ref={detailRef} aria-live="polite">
              <p className="k" id="dPos">{station.pos}</p>
              <h3 id="dTitle">{station.title}</h3>
              <p id="dBody">{station.body}</p>
              <div className="chips" id="dChips">
                {station.chips.map((chip, i) => (
                  <span key={i}>{chip}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
