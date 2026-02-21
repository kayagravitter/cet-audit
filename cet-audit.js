/* CET Audit Overlay v2 (Framer-safe, user-friendly, 1 free/day) */
(() => {
  "use strict";
  if (window.__CET_AUDIT_LOADED__) return;
  window.__CET_AUDIT_LOADED__ = true;

  const VERSION = "2.0.0";
  const PAY_URL = "https://example.com/upgrade"; // TODO: replace w/ Stripe/PayPal link
  const KEY = "cet_free_run_" + new Date().toISOString().slice(0, 10);

  const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
  const hasRunToday = () => localStorage.getItem(KEY) === "1";
  const markRunToday = () => localStorage.setItem(KEY, "1");

  function parseNumber(line) {
    // grabs first number incl. k/m and %
    const m = (line || "").toLowerCase().match(/([-+]?\d+(\.\d+)?)(\s*[km])?\s*%?/);
    if (!m) return null;
    let v = parseFloat(m[1]);
    const suf = (m[3] || "").trim();
    if (suf === "k") v *= 1000;
    if (suf === "m") v *= 1000000;
    return isFinite(v) ? v : null;
  }

  function extract(input) {
    const lines = String(input || "")
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);

    const get = (keys) => {
      const ln = lines.find(l => keys.some(k => l.toLowerCase().startsWith(k)));
      return ln ? parseNumber(ln) : null;
    };

    const platformLine = lines.find(l => /^platform\s*:/.test(l.toLowerCase()));
    const platform = platformLine ? platformLine.split(":").slice(1).join(":").trim() : "Unknown";

    const views = get(["monthly views", "views", "impressions"]);
    const followers = get(["followers", "subs", "subscribers"]);
    const engagement = get(["engagement", "engagement rate", "er"]);
    const posts = get(["posts/week", "posts per week", "posts"]);
    const growth = get(["growth", "follower growth", "growth rate"]);

    return { platform, views, followers, engagement, posts, growth };
  }

  function scoreFromStats(s) {
    // Simple, explainable scoring (not CET math exposed)
    const v = s.views ?? 0;
    const f = s.followers ?? 0;
    const e = s.engagement ?? 0;
    const p = s.posts ?? 0;
    const g = s.growth ?? 0;

    // Normalize (tunable)
    const viewsScore = clamp(Math.log10(v + 1) * 20);
    const follScore = clamp(Math.log10(f + 1) * 20);
    const engScore = clamp(e * 12.5); // 8% => 100
    const postScore = clamp(p * 20); // 5/wk => 100
    const growScore = clamp(g * 10); // 10% => 100

    const overall = clamp((viewsScore + follScore + engScore + postScore + growScore) / 5);

    const notes = [];
    if (e !== null && e < 2) notes.push("Engagement looks low — improve hooks, CTAs, and saves/shares.");
    if (p !== null && p < 2) notes.push("Posting cadence may be too low — test 3–5 posts/week.");
    if (v !== null && v < 10000) notes.push("Reach is limited — collaborate + optimize SEO/keywords.");
    if (f !== null && f < 5000) notes.push("Audience is still early — focus on consistency and series content.");
    if (!notes.length) notes.push("Healthy baseline. Next step: tighten content pillars and track weekly deltas.");

    return {
      platform: s.platform,
      score: overall.toFixed(0),
      breakdown: {
        reach: viewsScore.toFixed(0),
        audience: follScore.toFixed(0),
        engagement: engScore.toFixed(0),
        consistency: postScore.toFixed(0),
        momentum: growScore.toFixed(0),
      },
      notes
    };
  }

  function injectStyles() {
    if (document.getElementById("cet-style")) return;
    const css = `
#cet-audit-root{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);backdrop-filter:blur(3px);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}
#cet-card{width:min(720px,92vw);border-radius:18px;padding:18px;background:linear-gradient(180deg,#0e1623,#0a0f18);color:#eaf2ff;box-shadow:0 18px 60px rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.08)}
#cet-top{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}
#cet-title small{display:block;opacity:.75;letter-spacing:.08em;text-transform:uppercase;font-size:11px}
#cet-title h1{margin:6px 0 4px;font-size:30px;line-height:1.05}
#cet-title p{margin:0;opacity:.86}
#cet-close{background:transparent;color:#eaf2ff;border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:8px 10px;cursor:pointer}
#cet-area{margin-top:14px;display:grid;grid-template-columns:1.1fr .9fr;gap:12px}
#cet-box{border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(255,255,255,.03);padding:12px}
#cet-input{width:100%;min-height:160px;resize:vertical;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.25);color:#eaf2ff;padding:10px;font-size:13px;line-height:1.35}
#cet-actions{display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap}
.cbtn{border:0;border-radius:12px;padding:10px 12px;font-weight:600;cursor:pointer}
#cet-run{background:#2f6bff;color:white}
#cet-pay{background:rgba(255,255,255,.1);color:#eaf2ff;border:1px solid rgba(255,255,255,.18)}
#cet-status{opacity:.85;font-size:12px}
#cet-out h2{margin:0 0 8px;font-size:14px;opacity:.85;letter-spacing:.06em;text-transform:uppercase}
#cet-score{font-size:44px;font-weight:800;margin:0}
#cet-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}
.kv{border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:10px;background:rgba(255,255,255,.03)}
.kv b{display:block;font-size:11px;opacity:.78;text-transform:uppercase;letter-spacing:.06em}
.kv span{display:block;font-size:18px;margin-top:4px}
#cet-notes{margin-top:10px;font-size:13px;opacity:.9}
#cet-notes li{margin:6px 0}
@media(max-width:720px){#cet-area{grid-template-columns:1fr}}
`;
    const style = document.createElement("style");
    style.id = "cet-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function mount() {
    injectStyles();
    if (document.getElementById("cet-audit-root")) return;

    const root = document.createElement("div");
    root.id = "cet-audit-root";
    root.innerHTML = `
      <div id="cet-card" role="dialog" aria-modal="true">
        <div id="cet-top">
          <div id="cet-title">
            <small>Creationist Entanglement Theory (CET)</small>
            <h1>Structural Performance Intelligence</h1>
            <p>Paste your public stats in plain English. No formulas. No CET math.</p>
          </div>
          <button id="cet-close" aria-label="Close">Close</button>
        </div>

        <div id="cet-area">
          <div id="cet-box">
            <div style="opacity:.86;font-size:12px;margin-bottom:8px">
              Example:<br>
              Platform: Instagram<br>
              Monthly Views: 46k<br>
              Followers: 12k<br>
              Engagement Rate: 3.2%<br>
              Posts/Week: 4<br>
              Growth: 6%<br>
              Goal: brand deals
            </div>
            <textarea id="cet-input" placeholder="Paste your stats here..."></textarea>
            <div id="cet-actions">
              <button class="cbtn" id="cet-run">Run free CET audit</button>
              <button class="cbtn" id="cet-pay" style="display:none">Upgrade for more runs</button>
              <span id="cet-status"></span>
            </div>
          </div>

          <div id="cet-box" id="cet-out-wrap">
            <div id="cet-out">
              <h2>Result</h2>
              <p style="opacity:.75;margin:0 0 10px">Run an audit to see your score + recommendations.</p>
              <div id="cet-result"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    const $ = (id) => document.getElementById(id);
    const close = () => root.remove();

    $("cet-close").onclick = close;
    root.addEventListener("click", (e) => { if (e.target === root) close(); });

    $("cet-pay").onclick = () => window.open(PAY_URL, "_blank", "noopener,noreferrer");

    function render(res) {
      $("cet-result").innerHTML = `
        <div style="display:flex;align-items:baseline;gap:10px;justify-content:space-between">
          <div>
            <h2 style="margin:0;opacity:.85">Overall score</h2>
            <p id="cet-score">${res.score}<span style="font-size:14px;opacity:.7">/100</span></p>
            <div style="opacity:.8;font-size:12px;margin-top:-8px">Platform: ${escapeHtml(res.platform)}</div>
          </div>
        </div>

        <div id="cet-grid">
          <div class="kv"><b>Reach</b><span>${res.breakdown.reach}</span></div>
          <div class="kv"><b>Audience</b><span>${res.breakdown.audience}</span></div>
          <div class="kv"><b>Engagement</b><span>${res.breakdown.engagement}</span></div>
          <div class="kv"><b>Consistency</b><span>${res.breakdown.consistency}</span></div>
          <div class="kv" style="grid-column:1/-1"><b>Momentum</b><span>${res.breakdown.momentum}</span></div>
        </div>

        <ul id="cet-notes">
          ${res.notes.map(n => `<li>${escapeHtml(n)}</li>`).join("")}
        </ul>
      `;
    }

    function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]))}

    function runAudit() {
      const status = $("cet-status");
      status.textContent = "";

      if (hasRunToday()) {
        status.textContent = "Free run used today. Upgrade to run again.";
        $("cet-pay").style.display = "inline-block";
        return;
      }

      const stats = extract($("cet-input").value);
      const res = scoreFromStats(stats);
      render(res);
      markRunToday();
      status.textContent = "Free run used for today ✓";
      $("cet-pay").style.display = "inline-block";
    }

    $("cet-run").onclick = runAudit;
  }

  // Expose a Framer-callable boot function
  window.CET_AUDIT_BOOT = function () {
    try { mount(); }
    catch (e) { console.error("CET boot error:", e); }
  };

  // Optional: auto-mount if someone loads the JS directly
  // (keeps it from being a blank page during testing)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.CET_AUDIT_BOOT());
  } else {
    window.CET_AUDIT_BOOT();
  }

  console.log("CET loaded v" + VERSION);
})();
