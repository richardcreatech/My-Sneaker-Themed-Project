import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * HomeImgGallery — pixel-sprite fit-changer
 * -------------------------------------------------
 * Instead of swapping photos, this renders one fixed pixel-art character
 * (same face/hair every time — it's "the mascot") and swaps only the
 * clothing layer: oversized shirt, shoes, and a pants-cuff accent.
 *
 * The sprite is generated from a row list (see CHAR_ROWS) rather than a
 * hand-drawn image, so it can be recolored live with GSAP instead of
 * crossfading whole images.
 */

// ----------------------------------------------------------------------
// 1. OUTFITS — this is the only place you add/edit a "vibe". Swap hex
//    values or add a 4th entry and everything else (pagination, sprite,
//    background) picks it up automatically.
// ----------------------------------------------------------------------
const outfits = [
  {
    id: "panda",
    label: "Panda Mode",
    shirt: "#f5f5f0",
    shirtTrim: "#161616",
    pantsCuff: "#161616",
    shoe: "#141414",
    shoeSole: "#f5f5f0",
    shoeAccent: "#f5f5f0",
    accent: "#c9c9c9",
    bg: "#101112",
  },
  {
    id: "grape",
    label: "Grape Drop",
    shirt: "#5b2a86",
    shirtTrim: "#c9a6ec",
    pantsCuff: "#c9a6ec",
    shoe: "#3a1a5c",
    shoeSole: "#c9a6ec",
    shoeAccent: "#e7d5ff",
    accent: "#9b5de5",
    bg: "#160f22",
  },
  {
    id: "citrus",
    label: "Citrus SB",
    shirt: "#d9631e",
    shirtTrim: "#fbead0",
    pantsCuff: "#fbead0",
    shoe: "#b34a12",
    shoeSole: "#8a5a34",
    shoeAccent: "#fbead0",
    accent: "#e2793a",
    bg: "#1c1006",
  },
];

// Parts that never change between outfits — the mascot's "identity".
const BASE_PALETTE = {
  hair: "#2b2320",
  skin: "#e8b48a",
  eye: "#141414",
  pants: "#2a2b2d",
};

// ----------------------------------------------------------------------
// 2. SPRITE DEFINITION — one half-width per row (mirrored across the
//    center column), plus optional "accents" that override the part at
//    a specific |column offset| (used for eyes, a peeking hand, laces).
// ----------------------------------------------------------------------
const PX = 7; // size of one pixel, in svg units
const CHAR_ROWS = [
  { h: 1, part: "hair" },
  { h: 2, part: "hair" },
  { h: 3, part: "hair" },
  { h: 3, part: "skin" },
  { h: 3, part: "skin", accents: { 2: "eye" } },
  { h: 3, part: "skin" },
  { h: 2, part: "skin" },
  { h: 1, part: "skin" }, // neck
  { h: 5, part: "shirt" }, // shoulders — oversized jump starts here
  { h: 6, part: "shirt" },
  { h: 7, part: "shirt" }, // widest drape point
  { h: 6, part: "shirt" },
  { h: 5, part: "shirt", accents: { 4: "skin" } }, // sleeve cuff, hand peeking out
  { h: 4, part: "shirt" },
  { h: 4, part: "shirt" },
  { h: 4, part: "shirt" },
  { h: 4, part: "shirtTrim" }, // hem band
  { h: 3, part: "shirtTrim" }, // jagged hem
  { h: 3, part: "pants" },
  { h: 3, part: "pants" },
  { h: 3, part: "pants" },
  { h: 2, part: "pantsCuff" },
  { h: 3, part: "shoe", accents: { 0: "shoeAccent" } },
  { h: 4, part: "shoe" },
  { h: 4, part: "shoeSole" },
];

const Y_OFFSET = 14;
const CENTER_X = 90;

function buildPixels() {
  const pixels = [];
  CHAR_ROWS.forEach((row, rowIndex) => {
    for (let c = -(row.h - 1); c <= row.h - 1; c++) {
      let part = row.part;
      if (row.accents && row.accents[Math.abs(c)]) {
        part = row.accents[Math.abs(c)];
      }
      pixels.push({
        key: `${rowIndex}-${c}`,
        x: CENTER_X + c * PX - PX / 2,
        y: Y_OFFSET + rowIndex * PX,
        part,
      });
    }
  });
  return pixels;
}

const PIXELS = buildPixels();

function colorFor(part, outfit) {
  switch (part) {
    case "shirt":
      return outfit.shirt;
    case "shirtTrim":
      return outfit.shirtTrim;
    case "pantsCuff":
      return outfit.pantsCuff;
    case "shoe":
      return outfit.shoe;
    case "shoeSole":
      return outfit.shoeSole;
    case "shoeAccent":
      return outfit.shoeAccent;
    default:
      return BASE_PALETTE[part];
  }
}

const OUTFIT_PARTS = ["shirt", "shirtTrim", "pantsCuff", "shoe", "shoeSole", "shoeAccent"];

const SWIPE_THRESHOLD = 50;

// ----------------------------------------------------------------------
// 3. Mini sneaker icon used in the pagination row (colored per outfit)
// ----------------------------------------------------------------------
function SneakerIcon({ outfit }) {
  return (
    <svg viewBox="0 0 32 20" className="sneaker-icon" aria-hidden="true">
      <rect x="2" y="10" width="22" height="5" fill={outfit.shoe} />
      <rect x="20" y="5" width="8" height="7" fill={outfit.shoe} />
      <rect x="2" y="15" width="28" height="3" fill={outfit.shoeSole} />
      <rect x="9" y="7" width="8" height="2" fill={outfit.shoeAccent} />
    </svg>
  );
}

function HomeImgGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const svgRef = useRef(null);
  const charGroupRef = useRef(null);
  const frameRef = useRef(null);
  const dragState = useRef({ startX: 0, dragging: false });
  const isFirstRender = useRef(true);

  const goTo = (nextIndex) => {
    const clamped = (nextIndex + outfits.length) % outfits.length;
    if (clamped === activeIndex) return;
    setActiveIndex(clamped);
  };

  // Recolor the clothing pixels + do the "hop" whenever the outfit changes.
  useEffect(() => {
    const outfit = outfits[activeIndex];
    const root = svgRef.current;
    if (!root) return;

    if (isFirstRender.current) {
      // No animation on mount — just paint the starting outfit.
      OUTFIT_PARTS.forEach((part) => {
        root.querySelectorAll(`.px-${part}`).forEach((el) => {
          el.style.fill = colorFor(part, outfit);
        });
      });
      isFirstRender.current = false;
      return;
    }

    OUTFIT_PARTS.forEach((part) => {
      const els = root.querySelectorAll(`.px-${part}`);
      gsap.to(els, {
        fill: colorFor(part, outfit),
        duration: 0.45,
        ease: "power1.inOut",
        stagger: { each: 0.012, from: "random" },
      });
    });

    // A small grounded hop so the shoe change feels like it landed.
    if (charGroupRef.current) {
      gsap.timeline()
        .to(charGroupRef.current, { y: -10, scaleY: 1.03, duration: 0.16, ease: "power2.out" })
        .to(charGroupRef.current, { y: 0, scaleY: 1, duration: 0.28, ease: "bounce.out" });
    }
  }, [activeIndex]);

  // Background glow crossfades to the new outfit's accent color.
  useEffect(() => {
    const outfit = outfits[activeIndex];
    gsap.to("#gallery-glow", {
      "--glow-color": outfit.bg,
      duration: 0.5,
      ease: "power1.inOut",
    });
  }, [activeIndex]);

  const onPointerDown = (e) => {
    dragState.current = { startX: e.clientX, dragging: true };
    frameRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current.dragging || !frameRef.current) return;
    const deltaX = e.clientX - dragState.current.startX;
    gsap.set(frameRef.current, { x: deltaX * 0.25 });
  };

  const endDrag = (e) => {
    if (!dragState.current.dragging) return;
    const deltaX = e.clientX - dragState.current.startX;
    dragState.current.dragging = false;

    gsap.to(frameRef.current, { x: 0, duration: 0.4, ease: "power2.out" });

    if (deltaX <= -SWIPE_THRESHOLD) goTo(activeIndex + 1);
    else if (deltaX >= SWIPE_THRESHOLD) goTo(activeIndex - 1);
  };

  const current = outfits[activeIndex];

  return (
    <section id="home-img-gallery" style={{ "--glow-color": current.bg }}>
      <div
        id="gallery-frame"
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <div id="gallery-glow" aria-hidden="true" />

        <svg
          ref={svgRef}
          viewBox="0 0 180 200"
          className="gallery-sprite"
          role="img"
          aria-label={`Mascot wearing the ${current.label} outfit`}
        >
          <g ref={charGroupRef} style={{ transformOrigin: "90px 190px" }}>
            {PIXELS.map((p) => (
              <rect
                key={p.key}
                className={`px px-${p.part}`}
                x={p.x}
                y={p.y}
                width={PX - 0.6}
                height={PX - 0.6}
                style={{ fill: colorFor(p.part, current) }}
              />
            ))}
          </g>
        </svg>
      </div>

      <div id="gallery-pagination" role="tablist" aria-label="Choose an outfit">
        {outfits.map((outfit, i) => (
          <button
            key={outfit.id}
            className="shoe-icon"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Switch to ${outfit.label}`}
            style={{ "--tab-accent": outfit.accent }}
            onClick={() => goTo(i)}
          >
            <SneakerIcon outfit={outfit} />
            <span className="shoe-icon-label">{outfit.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        #home-img-gallery {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        #gallery-frame {
          position: relative;
          width: min(100%, 360px);
          aspect-ratio: 9 / 10;
          touch-action: pan-y;
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 18px;
        }
        #gallery-frame:active { cursor: grabbing; }

        #gallery-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 65%, var(--glow-color) 0%, transparent 70%);
          transition: background 0.2s linear;
          z-index: 0;
        }

        .gallery-sprite {
          position: relative;
          z-index: 1;
          width: 62%;
          height: auto;
          filter: drop-shadow(0 12px 14px rgba(0,0,0,0.35));
        }
        .gallery-sprite rect { shape-rendering: crispEdges; }

        #gallery-pagination {
          display: flex;
          gap: 10px;
        }

        .shoe-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 8px 12px;
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .shoe-icon[aria-selected="true"] {
          border-color: var(--tab-accent);
          transform: translateY(-2px);
        }
        .shoe-icon:hover { transform: translateY(-2px); }

        .sneaker-icon { width: 40px; height: auto; }

        .shoe-icon-label {
          font-size: 11px;
          letter-spacing: 0.03em;
          opacity: 0.75;
        }
        .shoe-icon[aria-selected="true"] .shoe-icon-label { opacity: 1; }
      `}</style>
    </section>
  );
}

export default HomeImgGallery;