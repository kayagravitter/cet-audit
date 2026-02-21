/* Creationist Entanglement Theory (CET)
   Structural Performance Intelligence — Audit Engine
   Exposes: window.CETAudit(input)
*/

(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CETAudit = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));

  // Pull numbers from messy text: "46k views", "$8k/mo", "12%", etc.
  function extractMetrics(text) {
    const t = (text || "").toLowerCase();
    const num = (re) => {
      const m = t.match(re);
      if (!m) return null;
      let v = parseFloat(m[1]);
      const k = m[2];
      if (k === "k") v *= 1000;
      if (k === "m") v *= 1000000;
      return v;
    };
    return {
      followers: num(/(\d+(?:\.\d+)?)\s*(k|m)?\s*(followers|subs|subscribers)\b/),
      views: num(/(\d+(?:\.\d+)?)\s*(k|m)?\s*(views|impressions|reach)\b/),
      revenue: num(/\$?\s*(\d+(?:\.\d+)?)\s*(k|m)?\s*(\/mo|per month|monthly|mo)\b/),
      growthPct: num(/(\d+(?:\.\d+)?)\s*%\s*(growth|increase)\b/)
    };
  }

  // Keyword scoring (keeps CET “math layer” private/interpretive)
  function scoreByKeywords(text, keywords) {
    const t = (text || "").toLowerCase();
    let hits = 0;
    for (const k of keywords) if (t.includes(k)) hits++;
    return clamp(hits * 20);
  }

  function inferScores(text) {
    return {
      coherence: scoreByKeywords(text, ["clear", "roles", "process", "system", "strategy", "cadence"]),
      constraint: scoreByKeywords(text, ["budget", "delay", "bottleneck", "problem", "risk", "time"]),
      adaptability: scoreByKeywords(text, ["iterate", "test", "learn", "pivot", "experiment", "improve"]),
      entanglement: scoreByKeywords(text, ["audience", "platform", "community", "partners", "network", "clients"]),
      emergence: scoreByKeywords(text, ["scale", "growth", "expansion", "roadmap", "vision", "future"])
    };
  }

  function normalizeUserNumbers(inputObj) {
    // Optional: if a user passes explicit numeric CET values
    const get = (k) => (inputObj && typeof inputObj[k] === "number" ? clamp(inputObj[k]) : null);
    return {
      coherence: get("coherence"),
      constraint: get("constraint"),
      adaptability: get("adaptability"),
      entanglement: get("entanglement"),
      emergence: get("emergence")
    };
  }

  function recommendations(scores, metrics) {
    const rec = [];
    if (scores.coherence < 55) rec.push("Clarify roles, workflow, and decision rights. Add a weekly cadence.");
    if (scores.constraint > 70) rec.push("Address constraints: budget, time, bottlenecks. Define top 1–2 limiting factors.");
    if (scores.adaptability < 55) rec.push("Increase iteration speed: run smaller experiments more frequently.");
    if (scores.entanglement < 55) rec.push("Strengthen external ties: distribution channels, partnerships, community loops.");
    if (scores.emergence < 55) rec.push("Define scale pathway: targets, milestones, and what ‘growth’ means in numbers.");
    if (metrics && (metrics.followers || metrics.views)) rec.push("Turn audience into a pipeline: capture emails, convert with offers, track CAC/LTV.");
    return rec.slice(0, 5);
  }

  function tier(spi) {
    if (spi >= 80) return { label: "A — Scale Ready", risk: "Low" };
    if (spi >= 60) return { label: "B — Stabilize & Optimize", risk: "Moderate" };
    return { label: "C — Rebuild Core System", risk: "High" };
  }

  function CETAudit(input) {
    const inputText = typeof input === "string" ? input : (input && input.text) || "";
    const explicit = normalizeUserNumbers(input);
    const inferred = inferScores(inputText);
    const scores = {
      coherence: explicit.coherence ?? inferred.coherence,
      constraint: explicit.constraint ?? inferred.constraint,
      adaptability: explicit.adaptability ?? inferred.adaptability,
      entanglement: explicit.entanglement ?? inferred.entanglement,
      emergence: explicit.emergence ?? inferred.emergence
    };

    const spi = Math.round(
      (scores.coherence + scores.constraint + scores.adaptability + scores.entanglement + scores.emergence) / 5
    );

    const met = extractMetrics(inputText);
    const t = tier(spi);

    return {
      model: "Creationist Entanglement Theory (CET)",
      layer: "Structural Performance Intelligence",
      version: "0.1.0",
      timestamp: new Date().toISOString(),

      input: {
        text: inputText.slice(0, 5000),
        extractedMetrics: met
      },

      variables: scores,

      indices: {
        SPI: spi,
        tier: t.label,
        riskLevel: t.risk
      },

      interpretation: {
        headline:
          spi >= 80
            ? "High structural alignment detected. Ready for scalable growth."
            : spi >= 60
              ? "Moderate stability detected. Optimization opportunities identified."
              : "Low structural coherence. System redesign recommended.",
        notes: "Prototype output — interpretive structural layer (non-diagnostic)."
      },

      recommendations: recommendations(scores, met)
    };
  }

  return CETAudit;
});