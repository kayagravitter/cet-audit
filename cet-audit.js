/* CET Audit Engine v1 (prototype, non-diagnostic)
   Model: Creationist Entanglement Theory (CET)
   Layer: Structural Performance Intelligence (SPI)
*/
(function (w) {
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const toNum = (v, d) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  };
  const nowISO = () => new Date().toISOString();

  // 5 official CET system variables (v1)
  // Each is 0–100. Higher is stronger.
  const VARS = [
    { key: "coherence", name: "Structural Coherence", hint: "clarity, consistency, defined roles, clean interfaces" },
    { key: "constraint", name: "Constraint Integrity", hint: "budget/time limits, guardrails, compliance, resource reality" },
    { key: "adaptability", name: "Adaptive Capacity", hint: "iteration speed, learning loops, change tolerance, modularity" },
    { key: "entanglement", name: "Dependency Entanglement", hint: "coupling across teams/tools/vendors; risk of cascade failures" },
    { key: "emergence", name: "Emergent Value Potential", hint: "scalability, compounding impact, network effects, innovation runway" }
  ];

  // User-friendly parser:
  // Accepts: plain text description OR quick scores like:
  // coherence=70 constraint=55 adaptability=80 entanglement=40 emergence=65
  function parseInput(raw) {
    const text = String(raw || "").trim();
    const lower = text.toLowerCase();

    const scores = {};
    // try to extract explicit numbers if present
    for (const v of VARS) {
      const re = new RegExp(`${v.key}\\s*[:=]\\s*(\\d{1,3})`, "i");
      const m = lower.match(re);
      if (m) scores[v.key] = clamp(toNum(m[1], 50), 0, 100);
    }

    // If no explicit scores, derive rough signals from keywords (prototype heuristic)
    const hasAnyScores = Object.keys(scores).length > 0;
    if (!hasAnyScores) {
      const kw = {
        coherence: ["clear", "defined", "structured", "documented", "repeatable", "standard"],
        constraint: ["budget", "deadline", "policy", "legal", "security", "risk", "compliance", "scope"],
        adaptability: ["iterate", "experiment", "pivot", "learn", "feedback", "modular", "refactor"],
        entanglement: ["dependency", "vendor", "handoff", "approval", "integration", "legacy", "blocked"],
        emergence: ["scale", "growth", "automation", "leverage", "network", "platform", "compounding", "innovation"]
      };
      const scoreFrom = (arr) => clamp(arr.reduce((c, k) => (lower.includes(k) ? c + 1 : c), 0) * 18 + 28, 0, 100);
      scores.coherence = scoreFrom(kw.coherence);
      scores.constraint = scoreFrom(kw.constraint);
      scores.adaptability = scoreFrom(kw.adaptability);
      scores.entanglement = scoreFrom(kw.entanglement);
      scores.emergence = scoreFrom(kw.emergence);
    }

    return { text, scores };
  }

  // CET output schema (so it feels scientific / investor-readable)
  // SPI: aggregate 0–100
  // Risk flags: simple thresholds
  function CETAudit(input) {
    const { text, scores } = parseInput(input);

    const coherence = scores.coherence;
    const constraint = scores.constraint;
    const adaptability = scores.adaptability;
    const entanglement = scores.entanglement;
    const emergence = scores.emergence;

    // SPI logic: entanglement is a "drag" (high entanglement reduces stability)
    const spi = clamp(
      (coherence * 0.24) +
      (constraint * 0.20) +
      (adaptability * 0.22) +
      ((100 - entanglement) * 0.18) +
      (emergence * 0.16),
      0, 100
    );

    const flags = [];
    if (coherence < 45) flags.push({ code: "LOW_COH", level: "watch", message: "Low coherence: define roles, interfaces, and success criteria." });
    if (constraint < 45) flags.push({ code: "LOW_CON", level: "watch", message: "Weak constraints: tighten scope, guardrails, budget/time assumptions." });
    if (adaptability < 45) flags.push({ code: "LOW_ADA", level: "watch", message: "Low adaptability: shorten feedback loops and modularize changes." });
    if (entanglement > 65) flags.push({ code: "HIGH_ENT", level: "risk", message: "High entanglement: dependencies may cascade; reduce coupling." });
    if (emergence < 45) flags.push({ code: "LOW_EMG", level: "watch", message: "Low emergence: identify compounding levers and scalable loops." });

    const tier =
      spi >= 80 ? "Tier A (Investor-ready structure)" :
      spi >= 65 ? "Tier B (Strong, with targeted fixes)" :
      spi >= 50 ? "Tier C (Needs structural improvements)" :
      "Tier D (High friction / redesign recommended)";

    const interpretation =
      `SPI ${spi.toFixed(1)} — ${tier}. ` +
      (flags.length ? `Key flags: ${flags.map(f => f.code).join(", ")}.` : "No major flags detected.");

    return {
      schema_version: "CET-SPI-1.0",
      timestamp_utc: nowISO(),
      model: "Creationist Entanglement Theory (CET)",
      layer: "Structural Performance Intelligence (SPI)",
      input_type: text && /[:=]\s*\d/.test(text) ? "scored_variables" : "system_description",
      variables: {
        coherence: { value: coherence, scale: "0-100", label: "Structural Coherence" },
        constraint: { value: constraint, scale: "0-100", label: "Constraint Integrity" },
        adaptability: { value: adaptability, scale: "0-100", label: "Adaptive Capacity" },
        entanglement: { value: entanglement, scale: "0-100", label: "Dependency Entanglement" },
        emergence: { value: emergence, scale: "0-100", label: "Emergent Value Potential" }
      },
      spi: { value: Number(spi.toFixed(1)), scale: "0-100", tier },
      flags,
      interpretation,
      next_actions: flags.length
        ? flags.map(f => f.message)
        : ["Maintain current structure; continue monitoring with periodic CET audits."]
    };
  }

  w.CETAudit = CETAudit;
  w.CET_VARS = VARS;
})(window);