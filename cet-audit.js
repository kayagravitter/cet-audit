/* =========================
   CET AUDIT (Public) v1.0
   Creationist Entanglement Theory (CET)
   Structural Performance Intelligence
   ========================= */
(() => {
  if (window.__CET_AUDIT_LOADED__) return;
  window.__CET_AUDIT_LOADED__ = true;

  const VERSION = "1.0.0";
  const PAY_URL = "https://example.com/upgrade"; // <-- replace later (Stripe/PayPal link)
  const DAY = new Date().toISOString().slice(0, 10);
  const KEY = "cet_free_run_" + DAY;

  const usedToday = () => localStorage.getItem(KEY) === "1";
  const markUsed = () => localStorage.setItem(KEY, "1");

  const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
  const num = (v) => {
    if (!v) return null;
    const s = String(v).toLowerCase().replace(/,/g, "").trim();
    const m = s.match(/(-?\d+(\.\d+)?)/);
    if (!m) return null;
    let x = parseFloat(m[1]);
    if (s.includes("k")) x *= 1000;
    if (s.includes("m")) x *= 1000000;
    return Number.isFinite(x) ? x : null;
  };

  // --- Parse friendly “stats” from plain text ---
  function parseMetrics(raw) {
    const t = (raw || "").toLowerCase();

    const platform =
      (t.match(/platform\s*:\s*([a-z0-9 _-]+)/)?.[1] || "").trim() || null;

    const views =
      num(t.match(/(views|impressions)\s*:\s*([0-9.,]+[km]?)/)?.[2]) ??
      num(t.match(/([0-9.,]+[km]?)\s*(views|impressions)/)?.[1]);

    const followers =
      num(t.match(/followers\s*:\s*([0-9.,]+[km]?)/)?.[1]) ??
      num(t.match(/([0-9.,]+[km]?)\s*followers/ )?.[1]);

    const engagement =
      num(t.match(/engagement(\s*rate)?\s*:\s*([0-9.]+)\s*%/)?.[2]); // percent

    const growth =
      num(t.match(/growth\s*:\s*([0-9.]+)\s*%/)?.[1]); // percent per month, if user states it

    const postsPerWeek =
      num(t.match(/posts?\s*\/\s*week\s*:\s*([0-9.]+)/)?.[1]) ??
      num(t.match(/posting\s*:\s*([0-9.]+)\s*\/\s*wk/)?.[1]);

    const budget =
      num(t.match(/budget\s*:\s*\$?\s*([0-9.,]+[km]?)/)?.[1]);

    const team =
      num(t.match(/team\s*:\s*([0-9]+)/)?.[1]) ??
      (t.includes("solo") ? 1 : null);

    const goal =
      (t.match(/goal\s*:\s*([^\n]+)/)?.[1] || "").trim() || null;

    const collabs =
      num(t.match(/collabs?\s*:\s*([0-9]+)/)?.[1]) ??
      (t.includes("collab") || t.includes("partnership") ? 1 : 0);

    const conversions =
      num(t.match(/conversions?\s*:\s*([0-9.,]+[km]?)/)?.[1]);

    return {
      platform,
      views_monthly: views,
      followers,
      engagement_rate_pct: engagement,
      growth_rate_pct: growth,
      posts_per_week: postsPerWeek,
      budget_monthly_usd: budget,
      team_size: team,
      collabs_recent: collabs,
      conversions_monthly: conversions,
      goal,
      raw_length: (raw || "").length
    };
  }

  // --- Convert metrics -> the 5 CET system variables (0–100) ---
  function computeVariables(m) {
    // Coherence = clarity + consistency signals
    const coherence =
      clamp(
        (m.goal ? 20 : 0) +
        (m.platform ? 10 : 0) +
        (m.posts_per_week != null ? clamp(m.posts_per_week * 10, 0, 40) : 0) +
        (m.raw_length > 60 ? 15 : 0) +
        (m.raw_length > 140 ? 15 : 0)
      );

    // Constraint = pressure from low resources + “small team” (not bad, just reality)
    const constraint =
      clamp(
        (m.team_size != null ? clamp((6 - m.team_size) * 12, 0, 48) : 18) +
        (m.budget_monthly_usd != null ? clamp((1500 - m.budget_monthly_usd) / 30, 0, 40) : 12) +
        (m.views_monthly != null && m.views_monthly < 20000 ? 18 : 0)
      );

    // Adaptability = iteration capacity + experimentation signals
    const adaptability =
      clamp(
        (m.posts_per_week != null ? clamp(m.posts_per_week * 8, 0, 40) : 10) +
        (m.growth_rate_pct != null ? clamp(m.growth_rate_pct * 3, 0, 30) : 0) +
        ((m.raw_length > 140) ? 15 : 5) +
        (m.platform ? 10 : 0)
      );

    // Entanglement = network effects (collabs, partnerships, conversion touchpoints)
    const entanglement =
      clamp(
        (m.collabs_recent != null ? clamp(m.collabs_recent * 12, 0, 48) : 0) +
        (m.conversions_monthly != null ? 20 : 0) +
        (m.platform ? 10 : 0) +
        (m.followers != null && m.followers > 10000 ? 12 : 0) +
        (m.followers != null && m.followers > 50000 ? 10 : 0)
      );

    // Emergence = growth + scale signals (views, followers, engagement)
    const emergence =
      clamp(
        (m.views_monthly != null ? clamp(Math.log10(Math.max(1, m.views_monthly)) * 18, 0, 45) : 10) +
        (m.followers != null ? clamp(Math.log10(Math.max(1, m.followers)) * 14, 0, 35) : 8) +
        (m.engagement_rate_pct != null ? clamp(m.engagement_rate_pct * 3, 0, 30) : 0)
      );

    return { coherence, constraint, adaptability, entanglement, emergence };
  }

  function spiScore(vars) {
    const SPI = (vars.coherence + vars.constraint + vars.adaptability + vars.entanglement + vars.emergence) / 5;
    return clamp(SPI);
  }

  function interpret(SPI) {
    if (SPI >= 80) return "High structural readiness (investor-grade system signals).";
    if (SPI >= 60) return "Moderate readiness (strong base; optimize bottlenecks).";
    if (SPI >= 40) return "Early structure (needs clearer system design + feedback loops).";
    return "Low structural readiness (rebuild inputs, workflow, and measurement).";
  }

  function recommendations(vars, m) {
    const rec = [];
    if (vars.coherence < 55) rec.push("Clarify goal + single primary KPI (e.g., monthly views or conversions) and write it into your workflow.");
    if (vars.constraint > 70) rec.push("Constraint is high: reduce scope or add capacity (automation, assistant hours, or tighter content cadence).");
    if (vars.adaptability < 55) rec.push("Add an iteration loop: run 1 experiment/week (hook, format, posting time) and log results.");
    if (vars.entanglement < 55) rec.push("Increase entanglement: 2 collaborations or partner touchpoints this month (cross-post, PR, affiliate, newsletter).");
    if (vars.emergence < 55) rec.push("Improve emergence: focus on distribution (reels/shorts cadence, SEO captions, reposting winners).");

    // Friendly metric-specific hints
    if (m.engagement_rate_pct != null && m.engagement_rate_pct < 2) rec.push("Engagement is low: tighten niche + stronger CTA + fewer topics per week.");
    if (m.posts_per_week != null && m.posts_per_week < 2) rec.push("Posting cadence is low: aim for 2–4 posts/week for stable signal.");
    return rec.slice(0, 6);
  }

  // --- UI Mount (safe) ---
  function mount() {
    // Styles
    const style = document.createElement("style");
    style.textContent = `
      #cet-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(2,4,8,.72);z-index:999999;font-family:system-ui,-apple-system,Segoe UI,Arial;color:#fff;padding:18px}
      #cet-card{width:min(780px,94vw);background:#0b1422;border:1px solid rgba(255,255,255,.08);border-radius:22px;padding:26px;box-shadow:0 30px 80px rgba(0,0,0,.6)}
      #cet-h1{font-size:34px;line-height:1.1;margin:6px 0 8px}
      #cet-sub{opacity:.85;margin:0 0 14px;font-size:14px}
      #cet-help{opacity:.78;font-size:13px;margin:0 0 10px}
      #cet-input{width:100%;min-height:140px;border-radius:14px;border:1px solid rgba(255,255,255,.08);padding:14px;background:#050914;color:#fff;outline:none}
      #cet-row{display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap}
      #cet-btn{padding:12px 16px;border-radius:12px;border:none;background:#2f7ef7;color:#fff;font-size:15px;cursor:pointer}
      #cet-btn[disabled]{opacity:.5;cursor:not-allowed}
      #cet-close{margin-left:auto;background:transparent;border:1px solid rgba(255,255,255,.15);color:#fff;border-radius:12px;padding:10px 12px;cursor:pointer}
      #cet-out{margin-top:14px;background:#050914;border:1px solid rgba(255,255,255,.08);padding:14px;border-radius:14px;display:none;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}
      #cet-pay{margin-top:10px;font-size:13px;display:none;opacity:.9}
      #cet-pay a{color:#7fb3ff;text-decoration:underline}
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "cet-overlay";
    overlay.innerHTML = `
      <div id="cet-card" role="dialog" aria-label="CET Audit">
        <div style="opacity:.8;font-size:12px;letter-spacing:.08em">CREATIONIST ENTANGLEMENT THEORY (CET)</div>
        <div id="cet-h1">Structural Performance Intelligence</div>
        <div id="cet-sub">Paste your public stats in plain English. No formulas. No CET math.</div>
        <div id="cet-help">
          Example:<br>
          Platform: Instagram<br>
          Monthly Views: 46k<br>
          Followers: 12k<br>
          Engagement Rate: 3.2%<br>
          Posts/Week: 4<br>
          Goal: brand deals
        </div>
        <textarea id="cet-input" placeholder="Paste your stats here…"></textarea>
        <div id="cet-row">
          <button id="cet-btn">Run free CET audit</button>
          <button id="cet-close" type="button">Close</button>
        </div>
        <div id="cet-pay">Free audit used today. <a href="${PAY_URL}" target="_blank" rel="noopener">Upgrade for unlimited audits</a>.</div>
        <div id="cet-out"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const btn = overlay.querySelector("#cet-btn");
    const closeBtn = overlay.querySelector("#cet-close");
    const input = overlay.querySelector("#cet-input");
    const out = overlay.querySelector("#cet-out");
    const pay = overlay.querySelector("#cet-pay");

    closeBtn.onclick = () => overlay.remove();

    if (usedToday()) {
      btn.disabled = true;
      pay.style.display = "block";
    }

    btn.onclick = () => {
      if (usedToday()) {
        pay.style.display = "block";
        return;
      }
      const raw = input.value || "";
      const metrics = parseMetrics(raw);
      const vars = computeVariables(metrics);
      const SPI = spiScore(vars);
      const payload = {
        model: "Creationist Entanglement Theory (CET) Structural Performance Intelligence",
        version: VERSION,
        timestamp: new Date().toISOString(),
        input_summary: {
          platform: metrics.platform,
          goal: metrics.goal
        },
        metrics_parsed: metrics,
        cet_system_variables: vars,
        SPI: Number(SPI.toFixed(1)),
        interpretation: interpret(SPI),
        recommendations: recommendations(vars, metrics),
        usage: {
          free_run_limit: "1 per day",
          used_today: true
        }
      };

      markUsed();
      out.style.display = "block";
      out.textContent = JSON.stringify(payload, null, 2);
      btn.disabled = true;
      pay.style.display = "block";
    };
  }

  // Mount safely after DOM exists
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
window.CET_AUDIT_BOOT = window.CET_AUDIT_BOOT || function () {
  // If your script already mounts the UI automatically, leave this empty.
  // Otherwise call your mount function here (example names below):
  if (typeof window.mountCETAudit === "function") window.mountCETAudit();
  if (typeof window.initCETAudit === "function") window.initCETAudit();
};
