/* CET AUDIT — Creationist Entanglement Theory (CET)
   Structural Performance Intelligence (SPI)
   Prototype interpretive layer (non-diagnostic). */
(() => {
  if (window.__CET_AUDIT_LOADED__) return;
  window.__CET_AUDIT_LOADED__ = true;

  const VERSION = "0.3.0";
  const $ = (s, r = document) => r.querySelector(s);

  // ---------- Free limit: 1 per day ----------
  const dayKey = "cet_free_" + new Date().toISOString().slice(0, 10);
  const usedToday = () => localStorage.getItem(dayKey) === "1";
  const markUsed = () => localStorage.setItem(dayKey, "1");

  // ---------- Styles ----------
  const style = document.createElement("style");
  style.textContent = `
#cet-root{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9999999;pointer-events:none}
#cet-card{pointer-events:auto;width:min(820px,92vw);background:rgba(10,18,30,.92);border:1px solid rgba(255,255,255,.08);
  border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.55);padding:26px;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
#cet-kicker{letter-spacing:.14em;font-size:12px;opacity:.8}
#cet-h1{font-size:38px;line-height:1.05;margin:10px 0 8px}
#cet-sub{opacity:.85;font-size:14px;margin:0 0 14px;max-width:70ch}
#cet-in{width:100%;min-height:120px;border-radius:14px;border:1px solid rgba(255,255,255,.12);
  background:rgba(0,0,0,.35);color:#fff;padding:14px;font-size:14px;outline:none}
#cet-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;align-items:center}
#cet-go{padding:12px 16px;border-radius:12px;border:0;background:#2f7ef7;color:#fff;font-weight:650;cursor:pointer}
#cet-go[disabled]{opacity:.5;cursor:not-allowed}
#cet-note{font-size:12px;opacity:.85}
#cet-out{margin-top:14px;display:none;border-radius:14px;border:1px solid rgba(255,255,255,.10);
  background:rgba(0,0,0,.35);padding:14px;white-space:pre-wrap;font-size:12.5px;line-height:1.4}
#cet-mini{margin-top:10px;font-size:12px;opacity:.75}
#cet-x{position:absolute;top:14px;right:14px;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.25);
  color:#fff;border-radius:12px;padding:8px 10px;cursor:pointer}
`;
  document.head.appendChild(style);

  // ---------- UI ----------
  const root = document.createElement("div");
  root.id = "cet-root";
  root.innerHTML = `
    <div id="cet-card">
      <button id="cet-x" aria-label="Close">✕</button>
      <div id="cet-kicker">CREATIONIST ENTANGLEMENT THEORY (CET)</div>
      <div id="cet-h1">Structural Performance Intelligence</div>
      <p id="cet-sub">
        Tell us what you’re analyzing in plain English + simple stats.
        Example: “Platform: Instagram. Views: 46.7k/mo. Followers: 18k. Engagement: 3.2%.
        Team: solo. Budget: $500/mo. Goal: book 5 brand deals in 90 days.”
      </p>

      <textarea id="cet-in" placeholder="Paste your stats or description here (no math required)…"></textarea>

      <div id="cet-row">
        <button id="cet-go">Run Free CET Audit</button>
        <div id="cet-note"></div>
      </div>

      <pre id="cet-out"></pre>
      <div id="cet-mini">Prototype interpretive layer • Non-diagnostic • Version ${VERSION}</div>
    </div>
  `;
  document.body.appendChild(root);

  // Close (nice for UX; optional)
  $("#cet-x").onclick = () => (root.style.display = "none");

  // ---------- Parsing helpers ----------
  const num = (re, t) => {
    const m = t.match(re);
    if (!m) return null;
    const v = parseFloat(String(m[1]).replace(/,/g, ""));
    return Number.isFinite(v) ? v : null;
  };

  function parseInput(raw) {
    const t = raw.toLowerCase();

    const platform =
      (t.match(/\b(instagram|tiktok|youtube|x|twitter|threads|facebook|substack|medium|website)\b/) || [])[1] || null;

    const viewsMonthly =
      num(/\bviews?\s*[:=]?\s*([\d,.]+)\s*(k|m)?\s*\/?\s*(mo|month|monthly)\b/i, raw) ??
      (() => {
        const v = num(/\b([\d,.]+)\s*(k|m)?\s*(monthly|per month)\s*views?\b/i, raw);
        return v;
      })();

    const followers = num(/\bfollowers?\s*[:=]?\s*([\d,.]+)\s*(k|m)?\b/i, raw);
    const engagement = num(/\bengagement\s*[:=]?\s*([\d.]+)\s*%/i, raw);
    const revenue = num(/\b(revenue|mrr|arr)\s*[:=]?\s*\$?\s*([\d,.]+)\b/i, raw) ?? null;
    const budget = num(/\bbudget\s*[:=]?\s*\$?\s*([\d,.]+)\b/i, raw) ?? null;
    const team =
      num(/\bteam\s*[:=]?\s*([\d,.]+)\b/i, raw) ??
      (/\bsolo\b/.test(t) ? 1 : null);

    // Normalize suffix (k/m) for the “viewsMonthly” + “followers” cases when user writes 46k
    function applySuffix(value, text, label) {
      if (value == null) return null;
      const rx = new RegExp(label + "\\s*[:=]?\\s*([\\d,.]+)\\s*(k|m)\\b", "i");
      const m = raw.match(rx);
      const s = m && m[2] ? m[2].toLowerCase() : null;
      if (s === "k") return value * 1000;
      if (s === "m") return value * 1000000;
      return value;
    }

    return {
      platform,
      views_monthly: applySuffix(viewsMonthly, raw, "views?") ?? viewsMonthly,
      followers: applySuffix(followers, raw, "followers?") ?? followers,
      engagement_pct: engagement,
      budget_usd_mo: budget,
      team_size: team,
      revenue_usd: revenue,
      raw_summary: raw.slice(0, 6000)
    };
  }

  // ---------- CET variables (first 5 “official” variables) ----------
  // 1) Coherence (clarity of goal/system)
  // 2) Constraint (resource pressure)
  // 3) Adaptability (iteration capacity)
  // 4) Entanglement (network/partners/dependencies)
  // 5) Emergence (momentum & scale signals)
  function scoreCET(raw, p) {
    const t = raw.toLowerCase();

    const hasGoal = /\b(goal|target|kpi|objective|north star|launch|deadline|90 days|30 days|q[1-4])\b/.test(t);
    const hasSystem = /\b(funnel|workflow|process|cadence|plan|strategy)\b/.test(t);
    const coherence = Math.min(100, (hasGoal ? 55 : 20) + (hasSystem ? 35 : 10));

    const lowBudget = p.budget_usd_mo != null && p.budget_usd_mo <= 1000;
    const solo = p.team_size === 1 || /\bsolo\b/.test(t);
    const constraint = Math.min(100, 30 + (lowBudget ? 35 : 10) + (solo ? 25 : 10) + (/\b(limited|tight|constraint|delays?)\b/.test(t) ? 20 : 5));

    const iter = /\b(iterate|test|experiment|a\/b|weekly|daily|sprint)\b/.test(t);
    const adapt = /\b(pivot|change|learn|ship|improve)\b/.test(t);
    const adaptability = Math.min(100, (iter ? 55 : 20) + (adapt ? 35 : 15));

    const net = /\b(partner|collab|press|pr|network|referral|affiliate|vendor|client|pipeline)\b/.test(t);
    const platform = p.platform ? 15 : 0;
    const entanglement = Math.min(100, 25 + (net ? 55 : 15) + platform);

    const views = p.views_monthly || 0;
    const foll = p.followers || 0;
    const eng = p.engagement_pct || 0;
    // Simple “momentum” proxy (investor-friendly, not “mathy”)
    const emergence = Math.min(
      100,
      15 +
        (views >= 50000 ? 35 : views >= 10000 ? 25 : views > 0 ? 15 : 0) +
        (foll >= 20000 ? 25 : foll >= 5000 ? 15 : foll > 0 ? 10 : 0) +
        (eng >= 4 ? 20 : eng >= 2 ? 12 : eng > 0 ? 6 : 0) +
        (/\b(growth|scale|expand|waitlist|revenue)\b/.test(t) ? 10 : 0)
    );

    const SPI = (coherence + constraint + adaptability + entanglement + emergence) / 5;

    const band = SPI >= 75 ? "High readiness" : SPI >= 50 ? "Moderate stability" : "Needs redesign";
    const findings = [];
    if (coherence < 60) findings.push("Clarify the goal + timeline (what success looks like, by when).");
    if (constraint > 70) findings.push("Resource pressure is high — simplify scope or add leverage (partners/automation).");
    if (adaptability < 60) findings.push("Increase iteration cadence (weekly experiments + measurement).");
    if (entanglement < 55) findings.push("Add distribution ties (press, affiliates, collabs, partnerships).");
    if (emergence < 55) findings.push("Strengthen traction signals (consistent content cadence + conversion path).");

    const nextSteps = [
      "Write 1 measurable 30–90 day goal (number + date).",
      "List your top 3 constraints (time, budget, access) and one mitigation each.",
      "Choose one growth lever to test this week (collab, PR pitch, paid test, lead magnet)."
    ];

    return {
      model: "Creationist Entanglement Theory (CET) — Structural Performance Intelligence",
      layer: "CET Audit (interpretive prototype)",
      version: VERSION,
      timestamp: new Date().toISOString(),
      variables: { coherence, constraint, adaptability, entanglement, emergence },
      SPI: Number(SPI.toFixed(1)),
      band,
      key_findings: findings.slice(0, 6),
      recommended_next_steps: nextSteps
    };
  }

  // ---------- Wiring ----------
  const btn = $("#cet-go");
  const note = $("#cet-note");
  const input = $("#cet-in");
  const out = $("#cet-out");

  function setLockedUI() {
    btn.disabled = true;
    note.textContent = "Free audit used today. Upgrade to unlock unlimited audits.";
  }

  if (usedToday()) setLockedUI();

  btn.onclick = () => {
    if (usedToday()) return setLockedUI();

    const raw = (input.value || "").trim();
    if (!raw) {
      note.textContent = "Paste a short description or your basic stats first.";
      return;
    }

    const parsed = parseInput(raw);
    const report = scoreCET(raw, parsed);

    // Output schema (scientific-feeling + investor-readable)
    const output = {
      report_id: "CET-" + Math.random().toString(16).slice(2, 10).toUpperCase(),
      ...report,
      parsed_inputs: parsed,
      paywall: { free_runs_per_day: 1, used_today: true, upgrade_required_for_more: true }
    };

    out.style.display = "block";
    out.textContent = JSON.stringify(output, null, 2);

    markUsed();
    setLockedUI();
  };
})();
