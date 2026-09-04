import { useState, useMemo } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TUTORIALS = [
  {
    id: 1,
    title: "Primer / Surfacer Fundamentals",
    category: "Priming",
    tags: ["primer", "surfacer", "beginner"],
    summary: "How to apply surfacer in three deliberate layers for flawless adhesion and defect detection.",
    content: [
      { heading: "Why surfacer?", body: "Surfacer (水補土) unifies part colours so defects are easy to spot, fills micro-scratches left after 400–1000 grit sanding, and dramatically improves paint adhesion." },
      { heading: "Recommended product", body: "Mr. Surfacer Grey 1000. Avoid white or black for general use — they obscure shading work." },
      { heading: "Mechanical Surfacer", body: "Nazca Mechanical Surfacer Super Heavy → weapons. Mechanical Surfacer Heavy → inner frames." },
      { heading: "Three-layer method", body: "Layer 1: Dry misty coat — no coverage. Layer 2: Light coat — low coverage. Layer 3: Wet coat — full coverage. This build-up prevents runs and ensures a fully sealed surface." },
      { heading: "Air pressure", body: "Spray surfacer at 2 bar. Metal paints and surfacer benefit from higher pressure (2.2–2.4, even up to 3 bar) with thin passes." },
    ],
  },
  {
    id: 2,
    title: "Paint Types: Lacquer, Enamel & Acrylic",
    category: "Paints",
    tags: ["lacquer", "enamel", "acrylic", "paint types"],
    summary: "A practical breakdown of the three main paint families — when to use each and how they behave.",
    content: [
      { heading: "Lacquer (硝基漆)", body: "Highest toxicity, hardest film, fastest dry (5–10 min). Best coverage and brightness — ideal for base coats. White coverage is excellent. Metal particles in metallic lacquers are coarser; use a metal-specific thinner to improve flow. Brands: GAIA, GUNZE." },
      { heading: "Enamel (法瑯漆)", body: "Medium toxicity, softest film, slowest dry (30+ min). Perfect for brush work, panel lining, and washes. Caution: if the base coat has any scratches, enamel will lift it in sheets. Metallic enamel particles are very fine. Brands: TAMIYA (square jars, X-20 thinner)." },
      { heading: "Acrylic (壓克力漆)", body: "Near-zero toxicity. Weakest film, 15–20 min dry. Superb matte finish — excellent for fabric texture effects. Washes off with water before curing. Brands: TAMIYA, GUNZE. Weakest gloss. Avoid skin contact (perspiration weakens adhesion)." },
      { heading: "Thinner selection", body: "GAIA ratio 1:2, GSI ratio 1:2. General guideline: GAIA Modo 1:3, GUNZE 1:2.5–3. Gloss paint → slow-dry thinner. Matte or metallic → quick-dry thinner. NYC recommended: Mr. Color Leveling Thinner." },
    ],
  },
  {
    id: 3,
    title: "Metallic Paint Techniques",
    category: "Painting",
    tags: ["metallic", "gold", "silver", "advanced"],
    summary: "The correct workflow for stunning metallic finishes — black undercoat, thin passes, and candy sequences.",
    content: [
      { heading: "Always start with black", body: "No matter which metallic colour, spray a black base coat first. Black deepens metallic brilliance and creates specular contrast." },
      { heading: "Colour sequence guide", body: "Gold: Black → Gold. Silver: Black → Silver. Metallic Red: Black → Silver → Clear Red. Metallic Blue: Black → Silver → Clear Blue. Metallic Black: Low pressure (10–15 PSI), large oil volume, wet spray." },
      { heading: "Airbrush settings", body: "Use a 0.5mm nozzle for metallic paints — metal particles clog 0.3mm easily. Air pressure 2–2.5 bar. Always thin coats (多層薄噴) — 2–3 passes for the black base, then layer the metallic over it. Wait 2–3 hrs between layers." },
      { heading: "Transparent candy finish", body: "Use slow-dry thinner with transparent colours. Never spray all transparent layers at once — wait for each to dry. Candy ratio guideline: Clear paint 1:3." },
      { heading: "Black base paint choice", body: "Use gloss black (not matte) — GAIA EX-02 is recommended. Mix ratio 1:3 or thinner. Medium pressure, thin spray 2–3 layers." },
    ],
  },
  {
    id: 4,
    title: "Shadow Shading (陰影噴塗) & MAX Watanabe Technique",
    category: "Painting",
    tags: ["shading", "MAX", "airbrush", "advanced"],
    summary: "From basic pre-shading to the full MAX Watanabe light-and-shadow workflow for display-grade results.",
    content: [
      { heading: "Airbrush settings comparison", body: "Flat spray: ratio 1:2–2.5, pressure 1.5–2 bar. Shadow highlight: ratio 1:2.5–3, pressure 1–1.5 bar. Use 0.2mm nozzle for fine shadow and highlight work." },
      { heading: "White shading", body: "Spray dark colour first, then white avoiding the edges. For narrow parts, spray from the bottom leaving the upper edge dark." },
      { heading: "Red shading", body: "Black Surfacer → White pre-shading → Red pre-shading. For darker tone: spray directly on black surfacer." },
      { heading: "Yellow shading", body: "Gray Surfacer → Orange → Yellow pre-shading. Never use brown as the shadow base for yellow — orange base is correct for 陰影, orange-yellow base for 高光." },
      { heading: "MAX Watanabe workflow (PGU scale)", body: "Step 1 — Surface prep: sand large panels until completely flat. Step 2 — Prime with 0.5mm nozzle for wide, even coverage. Step 3 — Switch to 0.3mm nozzle for detail shading: spray light grey at the panel centres, pure white to highlight the very centre, keep dark grey at edges. Step 4 — Core principle: thin coats, many layers (薄噴多層). The three controls: spray distance, air pressure, and thinner ratio." },
    ],
  },
  {
    id: 5,
    title: "Decal Application (水貼)",
    category: "Detailing",
    tags: ["decals", "water slide", "detailing"],
    summary: "Tips and brand notes for clean, bubble-free water-slide decal results.",
    content: [
      { heading: "Application timing", body: "Soak in water for 10 seconds (not 30 — at 30 seconds it can peel off prematurely). Slide into position, blot excess water." },
      { heading: "Softener sequencing", body: "Let decal dry for 2 minutes, then apply softener. Important: Bandai decals cannot be combined with 綠蓋 (green-cap) softener — it reacts badly." },
      { heading: "Brand notes", body: "Robo Decal 通用水貼: good. 大林達人: ok. EVO: ok. SIMP: ok. G Rework: not recommended." },
      { heading: "Sizing tip", body: "MG grade kits can also use 1/144 scale decals for added fine detail." },
      { heading: "Surface prep", body: "Always decal over a gloss coat: Spray coat → Gloss → 水貼 → Gloss → 滲線 → 水貼 → 消光." },
    ],
  },
  {
    id: 6,
    title: "Scribing Lines (刻線)",
    category: "Detailing",
    tags: ["scribing", "panel lines", "tools"],
    summary: "Recommended scriber sizes by kit grade for proportional, clean panel lines.",
    content: [
      { heading: "Scale guideline", body: "HG: 0.15mm primary, set of [0.1/0.15/0.2mm] + 1 of [0.4/0.5/0.6mm]. MG: 0.2mm primary, set of [0.15/0.2/0.3mm] + 1 of [0.6/0.7mm]. PG: set of [0.2/0.3/0.4mm] + 1 of [0.7/0.8mm]. 1/35: 0.3mm." },
      { heading: "BMC Sujiborido scraper", body: "BMC 0.2/0.4mm scraper is excellent for deepening existing lines. Tutorial available: 量產型BMC刻線刀 入門教學." },
    ],
  },
  {
    id: 7,
    title: "Matte Finish Deep-Dive (消光)",
    category: "Finishing",
    tags: ["matte", "topcoat", "finishing"],
    summary: "GH101 vs GX114 comparison and the wet-spray method for a flawless matte coat.",
    content: [
      { heading: "GH101 vs GX114", body: "GH101: ratio 1:1.5, 2 bar, 3 layers with 20 min dry between each. Does not fog panel lines. Smoother hand-feel. Marketed as UV resistant. Toxic (like thinner fumes) but slightly less than GX114. GX114: ratio 1:2.5, 25 PSI. Slightly grainy feel. Noticeably fogs dark panel lines. Both products produce similar finish, but GH101 wins on the critical 慘線 (panel line fogging) test." },
      { heading: "Wet spray technique", body: "Matte needs a wet coat to flow out properly. GX114 wet spray: ratio ~1:1 to 1:2, 25 PSI." },
      { heading: "Workflow position", body: "Correct order: Spray paint → Gloss coat → Panel line wash → Water decals → Matte topcoat." },
    ],
  },
  {
    id: 8,
    title: "Chrome / Plating Effect (電鍍效果)",
    category: "Painting",
    tags: ["chrome", "plating", "metallic", "advanced"],
    summary: "Six-step pseudo-chrome workflow for large curved surfaces.",
    content: [
      { heading: "Best surfaces", body: "Works especially well on large, curved armour panels." },
      { heading: "Six-step process", body: "1. Sand all surfaces with 2000+ grit paper. 2. Apply gloss black. 3. Metallic Gold or Silver base (gold for warm tones: red/orange/yellow; silver for cool tones: blue/purple/green). 4. Apply clear colour coat (ratio 1:3). 5. Gloss coat → Water decals → Gloss coat. 6. Polish with polishing compound (拋光研磨膏)." },
    ],
  },
  {
    id: 9,
    title: "Plastic Sheet Work (膠板)",
    category: "Scratch Building",
    tags: ["pla plate", "ABS", "PS", "scratch build"],
    summary: "ABS vs PS sheet properties and the right glue for each.",
    content: [
      { heading: "PS vs ABS", body: "PS (polystyrene) sheets cut and sand more cleanly, and bond better with Gunpla plastic. Preferred overall. ABS is tougher but more difficult to scribe or cut." },
      { heading: "Glue for ABS", body: "Tamiya regular green-cap cement (流縫膠) or 495 multi-purpose adhesive works best on ABS sheet." },
    ],
  },
  {
    id: 10,
    title: "Resin Kit Preparation",
    category: "Resin",
    tags: ["resin", "GK", "advanced"],
    summary: "Key differences when approaching a resin conversion or full resin kit.",
    content: [
      { heading: "Overview", body: "Resin kits require thorough washing in soapy water to remove mould release agent before any priming or painting." },
      { heading: "Reference", body: "Watch: 'How to Build & Paint Resin Gunpla Like a Pro' for a full walkthrough of cleaning, gap filling, and primer adhesion on resin." },
    ],
  },
];

const LESSONS = [
  {
    id: 1,
    title: "Orange Peel on Gloss Coats",
    category: "Painting",
    tags: ["gloss", "airbrush", "surface defects"],
    problem: "Gloss coats showing rough, orange-peel texture instead of a smooth mirror finish.",
    cause: "Dry-spraying (fast passes) over a gloss coat leaves tiny droplets that don't flow together before drying. Gloss reflects light and exposes every particle.",
    fix: "Switch to wet spraying for gloss: slow down the pass significantly so the paint stays wet long enough for droplets to merge. Monitor oil dilution, air pressure, spray distance, and rhythm. Practice on scrap parts first.",
    tags2: ["technique"],
  },
  {
    id: 2,
    title: "Panel Lines Fogging After Matte Coat",
    category: "Finishing",
    tags: ["matte", "panel lines", "topcoat"],
    problem: "Dark panel lines turn grey/hazy after applying matte topcoat (especially GX114).",
    cause: "Some matte varnishes (notably GX114) leave micro-texture particles that scatter light inside deep panel lines, making them appear lighter/fogged.",
    fix: "Switch to GH101 water-based matte — tests confirm it does NOT fog panel lines. Ratio: 1:1.5, 2 bar, 3 coats with 20 min dry time each.",
    tags2: ["product choice"],
  },
  {
    id: 3,
    title: "Metallic Paint Clogging a 0.3mm Nozzle",
    category: "Tools",
    tags: ["metallic", "airbrush", "tools"],
    problem: "Metallic paint repeatedly clogs the 0.3mm airbrush nozzle mid-session.",
    cause: "Metal particles in metallic paint are too large for tight 0.3mm tolerances.",
    fix: "Use a 0.5mm nozzle for all metallic and surfacer work. Thin the paint to the correct ratio (metallic: fast-dry thinner) and spray at 2–2.5 bar with thin passes.",
    tags2: ["equipment"],
  },
  {
    id: 4,
    title: "Enamel Lifting the Base Coat",
    category: "Painting",
    tags: ["enamel", "panel wash", "paint layers"],
    problem: "When applying an enamel panel wash, the entire base coat lifts off in sheets.",
    cause: "Enamel solvent attacks scratches or thin spots in the lacquer base coat, causing catastrophic lifting.",
    fix: "Always apply a gloss lacquer clear coat before any enamel wash. The sealed gloss layer protects the base. Ensure no scratches or chips before proceeding.",
    tags2: ["technique", "layering"],
  },
  {
    id: 5,
    title: "Decal Peeling During Application",
    category: "Detailing",
    tags: ["decals", "water slide"],
    problem: "Decal slides off the backing paper prematurely or disintegrates in the water.",
    cause: "Over-soaking — 30 seconds is too long for most decals.",
    fix: "10 seconds is the ideal soak time. Slide gently. Let it sit on the surface for 2 minutes before applying softener.",
    tags2: ["technique"],
  },
  {
    id: 6,
    title: "Broken Ball Joint — Repair Technique",
    category: "Assembly",
    tags: ["repair", "joints", "assembly"],
    problem: "Ball joint snapped inside the socket during assembly or posing.",
    cause: "Ball joints bear more stress than standard peg joints; internal pins alone are insufficient for full repair.",
    fix: "Insert a pin (打樁) into the ball core, then add a secondary reinforcement layer around the socket (二次加固). Reference: 修復斷裂球關的技巧 tutorial on YouTube.",
    tags2: ["repair"],
  },
  {
    id: 7,
    title: "Sanding Marks Still Visible After Primer",
    category: "Priming",
    tags: ["sanding", "primer", "surface prep"],
    problem: "Scratches are still visible even after sanding up to 1000 grit and applying surfacer.",
    cause: "Common beginner mistake — jumping from 400 grit to 1000 grit without intermediate steps leaves deep sub-surface grooves that 1000 grit cannot fill.",
    fix: "Surfacer itself fills micro-scratches. Use the 3-layer surfacer method (dry → light → wet). If marks persist, re-sand with the correct intermediate grits (400 → 600 → 800 → 1000) before re-priming.",
    tags2: ["technique"],
  },
  {
    id: 8,
    title: "Bandai Decals Reacting with Green-Cap Softener",
    category: "Detailing",
    tags: ["decals", "softener", "Bandai"],
    problem: "Bandai decals wrinkle, dissolve, or lift completely when green-cap softener is applied.",
    cause: "Bandai decals use a film incompatible with 綠蓋 (green-cap) softener chemistry.",
    fix: "Never use green-cap softener on Bandai stock decals. Use a milder softener, or none at all, and rely on gentle pressure to conform the decal.",
    tags2: ["product choice"],
  },
];

const COLLECTION = [
  { series: "RX-78", kits: ["SD", "RX-78-3 G-3", "MG RX-78-3 3.0", "RG 2.0", "PGU", "PGU G-3"] },
  { series: "Zaku", kits: ["MG Red Zaku 2.0", "PG Red Zaku II", "Cucuruz Doan's Zaku", "MG Zaku 2.0", "MG Gunner Zaku Warrior Lunamaria Hawke", "LunaMaria Gelgoog Menace"] },
  { series: "Nu / Hi-Nu Gundam", kits: ["EG RX-93ff", "RG Nu Gundam", "1/48 G-System Nu Gundam", "PGU Nu Gundam", "Hi-Nu Gundam"] },
  { series: "Sazabi / Sinanju", kits: ["MG Sinanju Stein Ver.Ka", "HG Sinanju Stein Narrative", "1/60 SH Studio Sinanju", "MSN-04FF Sazabi", "Yujiaoland MG Sazabi Resin Kit"] },
  { series: "Strike Freedom / Freedom", kits: ["MGEX Strike Freedom", "MGSD Freedom", "MG Freedom 2.0", "MGSD Barbatos"] },
  { series: "Unicorn", kits: ["PG Unicorn", "MG Unicorn Perfectibility", "MG Narrative Gundam C-PACKS Ver.Ka"] },
  { series: "Z / ZZ / 百式", kits: ["Z-Gundam Ver.Ka", "ZZ HG", "ZZ Ver.Ka", "FAZZ", "HGUC Hyaku Shiki", "MG Hyaku Shiki + Ballute System", "MG Hyaku Shiki 2.0"] },
  { series: "SEED / SEED Destiny", kits: ["HG Black Knight Cal-re.A", "HG Black Knight Rud-ro.A", "Mighty Strike Freedom", "Infinite Justice Type II", "Destiny Gundam Spec II", "Immortal Justice", "Rising Freedom", "Agnes' Gyan Storm"] },
  { series: "Others", kits: ["Guncannon (Cucuruz Doan's ver.)", "HG GM", "MS-09 Dom", "Z'Gok", "Nu Gundam EG", "Psycho Gundam", "Psycho Gundam Mk-II", "Baund Doc", "Ex-S Gundam HGUC", "RG Wing Zero", "HG Ryujinmaru", "HG Chou Majin Ryujinmaru", "HG Koutetsu Ryuohmaru", "SMP Voltes V", "Moderoid Golion", "Moderoid God Mars", "RX-104FF Penelope", "RX-105 Xi Gundam", "TX-ff104 Alyzeus", "RG God Gundam", "Messer Type F01"] },
];

const CATEGORIES = ["All", "Priming", "Paints", "Painting", "Finishing", "Detailing", "Scratch Building", "Resin", "Tools", "Assembly"];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Tag({ label }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "3px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "lowercase",
      background: "rgba(180,145,90,0.15)",
      color: "#b4915a",
      border: "1px solid rgba(180,145,90,0.25)",
    }}>{label}</span>
  );
}

function CategoryPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: "20px",
        border: active ? "1px solid #b4915a" : "1px solid #333",
        background: active ? "rgba(180,145,90,0.15)" : "transparent",
        color: active ? "#b4915a" : "#888",
        fontSize: "12px",
        fontWeight: active ? 700 : 400,
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >{label}</button>
  );
}

function TutorialCard({ tutorial, onClick }) {
  return (
    <div
      onClick={() => onClick(tutorial)}
      style={{
        background: "#181818",
        border: "1px solid #2a2a2a",
        borderRadius: "6px",
        padding: "20px",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#b4915a"; e.currentTarget.style.background = "#1d1a14"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.background = "#181818"; }}
    >
      <div style={{ fontSize: "10px", fontWeight: 700, color: "#b4915a", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {tutorial.category}
      </div>
      <div style={{ fontSize: "16px", fontWeight: 600, color: "#e8e0d0", lineHeight: 1.3 }}>
        {tutorial.title}
      </div>
      <div style={{ fontSize: "13px", color: "#777", lineHeight: 1.6 }}>
        {tutorial.summary}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "4px" }}>
        {tutorial.tags.map(t => <Tag key={t} label={t} />)}
      </div>
    </div>
  );
}

function LessonCard({ lesson, onClick }) {
  return (
    <div
      onClick={() => onClick(lesson)}
      style={{
        background: "#181818",
        border: "1px solid #2a2a2a",
        borderLeft: "3px solid #7a3030",
        borderRadius: "6px",
        padding: "20px",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#1d1414"; e.currentTarget.style.borderLeftColor = "#c44"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#181818"; e.currentTarget.style.borderLeftColor = "#7a3030"; }}
    >
      <div style={{ fontSize: "10px", fontWeight: 700, color: "#c77", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {lesson.category} · Lesson Learned
      </div>
      <div style={{ fontSize: "16px", fontWeight: 600, color: "#e8e0d0", lineHeight: 1.3 }}>
        {lesson.title}
      </div>
      <div style={{ fontSize: "13px", color: "#777", lineHeight: 1.5 }}>
        <strong style={{ color: "#a77" }}>Problem:</strong> {lesson.problem}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "4px" }}>
        {lesson.tags.map(t => <Tag key={t} label={t} />)}
      </div>
    </div>
  );
}

function Modal({ item, type, onClose }) {
  if (!item) return null;
  const isTutorial = type === "tutorial";
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "20px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#141414",
          border: "1px solid #333",
          borderRadius: "8px",
          maxWidth: "660px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: isTutorial ? "#b4915a" : "#c77", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
              {item.category}{!isTutorial && " · Lesson Learned"}
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#e8e0d0", lineHeight: 1.3 }}>
              {item.title}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: "20px", cursor: "pointer", flexShrink: 0 }}>✕</button>
        </div>

        {isTutorial ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {item.content.map((section, i) => (
              <div key={i}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#b4915a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{section.heading}</div>
                <div style={{ fontSize: "14px", color: "#aaa", lineHeight: 1.7 }}>{section.body}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#c77", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>The Problem</div>
              <div style={{ fontSize: "14px", color: "#aaa", lineHeight: 1.7 }}>{item.problem}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#c99", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Root Cause</div>
              <div style={{ fontSize: "14px", color: "#aaa", lineHeight: 1.7 }}>{item.cause}</div>
            </div>
            <div style={{ background: "rgba(60,140,60,0.08)", border: "1px solid rgba(60,140,60,0.2)", borderRadius: "6px", padding: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#6a9", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>The Fix</div>
              <div style={{ fontSize: "14px", color: "#aaa", lineHeight: 1.7 }}>{item.fix}</div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", paddingTop: "8px", borderTop: "1px solid #222" }}>
          {item.tags.map(t => <Tag key={t} label={t} />)}
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("tutorials");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [modal, setModal] = useState(null);
  const [modalType, setModalType] = useState(null);

  const filteredTutorials = useMemo(() => {
    return TUTORIALS.filter(t => {
      const matchCat = category === "All" || t.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const filteredLessons = useMemo(() => {
    return LESSONS.filter(l => {
      const matchCat = category === "All" || l.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || l.title.toLowerCase().includes(q) || l.problem.toLowerCase().includes(q) || l.tags.some(tag => tag.includes(q));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const openTutorial = (t) => { setModal(t); setModalType("tutorial"); };
  const openLesson = (l) => { setModal(l); setModalType("lesson"); };

  const navStyle = (t) => ({
    padding: "8px 20px",
    border: "none",
    background: tab === t ? "#b4915a" : "transparent",
    color: tab === t ? "#111" : "#888",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "all 0.15s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      color: "#e8e0d0",
    }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e1e1e",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        position: "sticky",
        top: 0,
        background: "#0f0f0f",
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.02em", color: "#e8e0d0" }}>Gunpla</span>
          <span style={{ fontSize: "20px", fontWeight: 300, color: "#b4915a" }}>Knowledge Hub</span>
        </div>
        <nav style={{ display: "flex", gap: "4px" }}>
          {["tutorials", "lessons", "collection"].map(t => (
            <button key={t} style={navStyle(t)} onClick={() => setTab(t)}>
              {t === "tutorials" ? "Tutorials" : t === "lessons" ? "Lessons Learned" : "My Collection"}
            </button>
          ))}
        </nav>
      </header>

      {/* Hero */}
      {tab !== "collection" && (
        <div style={{
          padding: "48px 32px 36px",
          borderBottom: "1px solid #1a1a1a",
          background: "linear-gradient(to bottom, #131310, #0f0f0f)",
        }}>
          <div style={{ maxWidth: "760px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#b4915a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
              {tab === "tutorials" ? `${TUTORIALS.length} techniques documented` : `${LESSONS.length} hard lessons logged`}
            </div>
            <h1 style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1.15, margin: 0, color: "#e8e0d0", letterSpacing: "-0.02em" }}>
              {tab === "tutorials" ? "Everything I've learned about painting and building Gunpla." : "Mistakes made. Problems solved. Written down so you don't repeat them."}
            </h1>
          </div>
        </div>
      )}

      {/* Controls */}
      {tab !== "collection" && (
        <div style={{ padding: "20px 32px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by keyword, technique, or paint..."
            style={{
              background: "#181818",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              padding: "10px 14px",
              color: "#e8e0d0",
              fontSize: "14px",
              width: "100%",
              maxWidth: "440px",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {CATEGORIES.map(c => (
              <CategoryPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main style={{ padding: "24px 32px 60px", maxWidth: "1200px" }}>
        {tab === "tutorials" && (
          filteredTutorials.length === 0
            ? <div style={{ color: "#555", marginTop: "40px" }}>No tutorials match your search.</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {filteredTutorials.map(t => <TutorialCard key={t.id} tutorial={t} onClick={openTutorial} />)}
              </div>
        )}

        {tab === "lessons" && (
          filteredLessons.length === 0
            ? <div style={{ color: "#555", marginTop: "40px" }}>No lessons match your search.</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {filteredLessons.map(l => <LessonCard key={l.id} lesson={l} onClick={openLesson} />)}
              </div>
        )}

        {tab === "collection" && (
          <div style={{ paddingTop: "32px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#e8e0d0", marginBottom: "8px", letterSpacing: "-0.02em" }}>My Builds</h2>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "32px" }}>Every kit I've built or am building, grouped by series.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {COLLECTION.map(group => (
                <div key={group.series} style={{ background: "#181818", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#b4915a", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {group.series}
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {group.kits.map(kit => (
                      <li key={kit} style={{ fontSize: "13px", color: "#aaa", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <span style={{ color: "#444", flexShrink: 0, marginTop: "2px" }}>›</span>
                        {kit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Modal item={modal} type={modalType} onClose={() => setModal(null)} />
    </div>
  );
}
