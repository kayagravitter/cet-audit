/* CET Audit Overlay v1.1 (Public) - user friendly, no raw JSON */
(() => {
  if (window.__CET_AUDIT_LOADED__) return;
  window.__CET_AUDIT_LOADED__ = true;

  const VERSION = "1.1.0";
  const UPGRADE_URL = "https://buy.stripe.com/5kQdR8eHT6iy3Uy4q42Fa00";// TODO: replace with Stripe/Gumroad/LemonSqueezy
  const $ = (sel, root = document) => root.querySelector(sel);

  // 1 free run/day (per browser)
  const DAY = new Date().toISOString().slice(0, 10);
  const KEY = "cet_free_run_" + DAY;
  const usedToday = () => localStorage.getItem(KEY) === "1";
  const markUsed = () => localStorage.setItem(KEY, "1");

  // ---- Styles ----
  const css = `
  .cet-overlay{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);}
  .cet-card{width:min(720px,92vw);border-radius:22px;background:linear-gradient(180deg,#0b1620,#070c12);box-shadow:0 20px 70px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.08);color:#fff;padding:26px;position:relative;}
  .cet-kicker{letter-spacing:.14em;text-transform:uppercase;font-size:12px;opacity:.8;margin-bottom:8px}
  .cet-title{font-size:44px;line-height:1.05;margin:0 0 10px 0;font-weight:700}
  .cet-sub{opacity:.85;margin:0 0 14px 0;font-size:15px}
  .cet-example{opacity:.75;font-size:13px;line-height:1.35;margin:0 0 14px 0;white-space:pre-line}
  .cet-text{width:100%;min-height:120px;border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#fff;padding:14px 14px;font-size:14px;outline:none;resize:vertical}
  .cet-actions{display:flex;gap:12px;align-items:center;margin-top:14px}
  .cet-btn{border:0;border-radius:14px;padding:12px 16px;font-weight:700;cursor:pointer}
  .cet-primary{background:#2d7dff;color:#fff}
  .cet-primary[disabled]{opacity:.45;cursor:not-allowed}
  .cet-ghost{background:transparent;border:1px solid rgba(255,255,255,.18);color:#fff}
  .cet-note{margin-top:10px;font-size:13px;opacity:.85}
  .cet-link{color:#9cc0ff;text-decoration:underline;cursor:pointer}
  .cet-results{margin-top:16px;border-radius:18px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);padding:14px}
  .cet-rh{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .cet-rtitle{font-weight:800;opacity:.95}
  .cet-pill{font-size:12px;opacity:.9;border:1px solid rgba(255,255,255,.14);padding:6px 10px;border-radius:999px}
  .cet-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}
  .cet-m{padding:10px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.15)}
  .cet-ml{font-size:12px;opacity:.75;margin-bottom:4px}
  .cet-mv{font-size:18px;font-weight:800}
  .cet-small{font-size:12px;opacity:.75;margin-top:8px}
  @media (max-width:600px){.cet-title{font-size:34px}.cet-grid{grid-template-columns:1fr}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ---- Helpers ----
  const cleanNumber = (v) => {
    if (v == null) return null;
    // remove commas and spaces, keep digits, dot, minus
    const s = String(v).replace(/,/g, "").trim();
    const n = Number(s.replace(/[^\d.\-]/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const parseLines = (text) => {
    const out = {};
    const lines = String(text || "")
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      const m = line.match(/^([^:]+)\s*:\s*(.+)$/);
      if (!m) continue;
      const key = m[1].toLowerCase().replace(/\s+/g, "_");
      out[key] = m[2].trim();
    }
    return out;
  };

  // CET mapping is interpretive. NO engagement calculation.
  const buildCET = (m) => {
    const followers = cleanNumber(m.followers);
    const views = cleanNumber(m.monthly_views) ?? cleanNumber(m.views_monthly) ?? cleanNumber(m.views);
    const posts = cleanNumber(m.posts_per_week) ?? cleanNumber(m.posts_week);
    const growth = cleanNumber(m.growth_rate) ?? cleanNumber(m.growth_rate_pct);
    const engagement = cleanNumber(m.engagement_rate) ?? cleanNumber(m.engagement_rate_pct); // only if user gives it

    // Interpretive heuristics (simple, stable, non-mathy for user)
    const clamp = (n) => Math.max(0, Math.min(100, n));

    // coherence: completeness of inputs + consistency
    const provided = [followers, views, posts, engagement, growth].filter((x) => x != null).length;
    const coherence = clamp(20 + provided * 12);

    // constraint: low inputs => higher constraint (less signal)
    const constraint = clamp(70 - provided * 10);

    // adaptability: growth + posting cadence if provided
    const adaptability = clamp(
      25 +
        (growth != null ? Math.min(35, Math.abs(growth) * 2) : 0) +
        (posts != null ? Math.min(20, posts * 3) : 0)
    );

    // entanglement: platform + collabs mention (optional)
    const plat = (m.platform || "").toLowerCase();
    const entanglement = clamp(plat.includes("instagram") ? 18 : plat ? 14 : 10);

    // emergence: views-to-followers ratio if both exist
    let emergence = 40;
    if (followers != null && views != null && followers > 0) {
      const ratio = views / followers; // ex: 97209/12409 ~ 7.8
      emergence = clamp(20 + Math.min(70, ratio * 8));
    }

    const spi = clamp(Math.round((coherence * 0.25 + (100 - constraint) * 0.2 + adaptability * 0.2 + entanglement * 0.15 + emergence * 0.2)));

    return { spi, coherence, constraint, adaptability, entanglement, emergence, followers, views, posts, engagement, growth, platform: m.platform || null, goal: m.goal || null };
  };

  const interpret = (r) => {
    if (r.spi >= 75) return "High readiness: your system is primed. Tighten your offer + scale distribution.";
    if (r.spi >= 55) return "Strong base: improve consistency and add 1–2 growth levers to unlock scale.";
    if (r.spi >= 35) return "Developing: add missing inputs (posts/week, engagement, growth) and clarify a single goal.";
    return "Low readiness: your inputs are incomplete—start with platform + followers + views + posting cadence.";
  };

  // ---- UI ----
  function mount() {
    const overlay = document.createElement("div");
    overlay.className = "cet-overlay";
    overlay.innerHTML = `
      <div class="cet-card" role="dialog" aria-modal="true">
        <div class="cet-kicker">Creationist Entanglement Theory (CET)</div>
        <h1 class="cet-title">Structural Performance Intelligence</h1>
        <p class="cet-sub">Paste your public stats in plain English. No formulas. No CET math.</p>
        <div class="cet-example">Example:
Platform: Instagram
Monthly Views: 46k
Followers: 12,000
Engagement Rate: 3.2% (optional)
Posts/Week: 4 (optional)
Goal: brand deals (optional)</div>

        <textarea class="cet-text" placeholder="Paste your stats here..."></textarea>

        <div class="cet-actions">
          <button class="cet-btn cet-primary" id="cetRun">Run free CET audit</button>
          <button class="cet-btn cet-ghost" id="cetClose">Close</button>
        </div>

        <div class="cet-note" id="cetGate" style="display:none">
          Free audit used today. <span class="cet-link" id="cetUpgrade">Upgrade for unlimited audits</span>.
        </div>

        <div class="cet-results" id="cetResults" style="display:none">
          <div class="cet-rh">
            <div class="cet-rtitle">Results</div>
            <div class="cet-pill" id="cetStamp">v${VERSION}</div>
          </div>
          <div class="cet-grid">
            <div class="cet-m"><div class="cet-ml">SPI Score</div><div class="cet-mv" id="spiVal">—</div></div>
            <div class="cet-m"><div class="cet-ml">Interpretation</div><div class="cet-mv" style="font-size:14px;font-weight:700;line-height:1.2" id="spiTxt">—</div></div>
            <div class="cet-m"><div class="cet-ml">Coherence</div><div class="cet-mv" id="vCoh">—</div></div>
            <div class="cet-m"><div class="cet-ml">Adaptability</div><div class="cet-mv" id="vAda">—</div></div>
            <div class="cet-m"><div class="cet-ml">Constraint</div><div class="cet-mv" id="vCon">—</div></div>
            <div class="cet-m"><div class="cet-ml">Emergence</div><div class="cet-mv" id="vEm">—</div></div>
          </div>
          <div class="cet-small" id="cetSmall"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const ta = $(".cet-text", overlay);
    const runBtn = $("#cetRun", overlay);
    const closeBtn = $("#cetClose", overlay);
    const gate = $("#cetGate", overlay);
    const upgrade = $("#cetUpgrade", overlay);
    const results = $("#cetResults", overlay);

    const showGated = () => {
      runBtn.disabled = true;
      gate.style.display = "block";
    };

    if (usedToday()) showGated();

    upgrade.onclick = () => window.open(UPGRADE_URL, "_blank", "noopener,noreferrer");
    closeBtn.onclick = () => overlay.remove();

    runBtn.onclick = () => {
      if (usedToday()) return showGated();

      const m = parseLines(ta.value);

      // Map common aliases
      if (!m.monthly_views && m.views_monthly) m.monthly_views = m.views_monthly;
      if (!m.followers && m.follower_count) m.followers = m.follower_count;
      if (!m.posts_per_week && m.posts_week) m.posts_per_week = m.posts_week;

      const r = buildCET(m);

      // Render user-friendly output ONLY
      $("#spiVal", overlay).textContent = String(r.spi);
      $("#spiTxt", overlay).textContent = interpret(r);
      $("#vCoh", overlay).textContent = String(r.coherence);
      $("#vAda", overlay).textContent = String(r.adaptability);
      $("#vCon", overlay).textContent = String(r.constraint);
      $("#vEm", overlay).textContent = String(Math.round(r.emergence));

      const smallBits = [];
      if (r.platform) smallBits.push(`Platform: ${r.platform}`);
      if (r.views != null) smallBits.push(`Monthly views: ${Math.round(r.views).toLocaleString()}`);
      if (r.followers != null) smallBits.push(`Followers: ${Math.round(r.followers).toLocaleString()}`);
      if (r.posts != null) smallBits.push(`Posts/week: ${r.posts}`);
      // engagement is OPTIONAL; we do not compute it
      if (r.engagement != null) smallBits.push(`Engagement: ${r.engagement}%`);
      if (r.goal) smallBits.push(`Goal: ${r.goal}`);

      $("#cetSmall", overlay).textContent = smallBits.join(" • ") || "Tip: add Followers + Monthly Views + Posts/Week for a stronger audit.";

      results.style.display = "block";

      // Gate for the day
      markUsed();
      showGated();
    };
  }

  // Public boot (Framer loader calls this)
  window.CET_AUDIT_BOOT = function () {
    // Avoid double mount
    if (document.querySelector(".cet-overlay")) return;
    mount();
  };
})();