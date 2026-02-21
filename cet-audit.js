/* CET Audit Overlay v1.0 (Framer + jsDelivr)
   - Creates a simple, user-friendly input
   - 1 free run per day (localStorage)
   - Upgrade link placeholder
*/
(function () {
  "use strict";

  // Prevent double-load
  if (window.__CET_AUDIT_LOADED__) return;
  window.__CET_AUDIT_LOADED__ = true;

  // === CONFIG (edit these later) ===
  var UPGRADE_URL = "https://example.com/upgrade"; // TODO: replace with Stripe/PayPal link
  var FREE_KEY = "cet_free_run_day";
  var TODAY = new Date().toISOString().slice(0, 10);

  function usedToday() {
    return localStorage.getItem(FREE_KEY) === TODAY;
  }
  function markUsed() {
    localStorage.setItem(FREE_KEY, TODAY);
  }

  // Simple “stat parsing” (keeps it human)
  function getNumber(label, text) {
    // e.g. "Followers: 12k" "Monthly Views: 46,700"
    var re = new RegExp(label + "\\s*[:=]\\s*([0-9.,]+)\\s*(k|m)?", "i");
    var m = text.match(re);
    if (!m) return null;
    var n = parseFloat((m[1] || "").replace(/,/g, ""));
    if (!isFinite(n)) return null;
    var suf = (m[2] || "").toLowerCase();
    if (suf === "k") n *= 1000;
    if (suf === "m") n *= 1000000;
    return n;
  }
  function getPercent(label, text) {
    var re = new RegExp(label + "\\s*[:=]\\s*([0-9.]+)\\s*%?", "i");
    var m = text.match(re);
    if (!m) return null;
    var n = parseFloat(m[1]);
    return isFinite(n) ? n : null;
  }
  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  // CET-style scores from normal creator stats (no “CET math” shown)
  function scoreFromStats(raw) {
    var followers = raw.followers || 0;
    var views = raw.views || 0;
    var engagement = raw.engagement || 0;
    var posts = raw.posts || 0;

    // Normalize into 0–100 (rough heuristic)
    var reach = clamp(Math.log10(views + 10) * 20, 0, 100);       // views
    var base = clamp(Math.log10(followers + 10) * 18, 0, 100);   // followers
    var rate = clamp(engagement * 12.5, 0, 100);                 // % engagement
    var cadence = clamp(posts * 12.5, 0, 100);                   // posts/week

    // Map to CET dimensions (explained in plain English)
    return {
      coherence: clamp((rate * 0.55) + (cadence * 0.45), 0, 100),
      constraint: clamp(100 - (cadence * 0.35 + reach * 0.15), 0, 100), // more output/reach can add “strain”
      adaptability: clamp((cadence * 0.6) + (rate * 0.4), 0, 100),
      entanglement: clamp((base * 0.5) + (rate * 0.5), 0, 100),
      emergence: clamp((reach * 0.7) + (cadence * 0.3), 0, 100),
    };
  }

  function overallSPI(s) {
    return ((s.coherence + s.constraint + s.adaptability + s.entanglement + s.emergence) / 5).toFixed(1);
  }

  function buildUI() {
    // container
    var wrap = document.createElement("div");
    wrap.id = "cet-audit-overlay";
    wrap.innerHTML = `
      <div class="cet-card">
        <div class="cet-top">
          <div class="cet-kicker">CREATIONIST ENTANGLEMENT THEORY (CET)</div>
          <div class="cet-title">Structural Performance Intelligence</div>
          <div class="cet-sub">
            Paste your public stats in plain English. No formulas. No CET math.
          </div>
        </div>

        <div class="cet-example">
          <div class="cet-small">Example:</div>
          <div class="cet-mono">
Platform: Instagram<br/>
Monthly Views: 46k<br/>
Followers: 12k<br/>
Engagement Rate: 3.2%<br/>
Posts/Week: 4<br/>
Goal: brand deals
          </div>
        </div>

        <textarea id="cetInput" class="cet-input" placeholder="Paste your stats here..."></textarea>

        <div class="cet-actions">
          <button id="cetRun" class="cet-btn">Run free CET audit</button>
          <a id="cetUpgrade" class="cet-up" href="${UPGRADE_URL}" target="_blank" rel="noopener">Unlock more runs</a>
        </div>

        <div id="cetMsg" class="cet-msg"></div>

        <div id="cetResult" class="cet-result" style="display:none;"></div>

        <button id="cetClose" class="cet-close" aria-label="Close">Close</button>
      </div>
    `;

    var style = document.createElement("style");
    style.textContent = `
      #cet-audit-overlay{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(10,14,20,.55);backdrop-filter:blur(6px)}
      #cet-audit-overlay .cet-card{width:min(680px,92vw);border-radius:22px;background:linear-gradient(180deg,#0b1220,#070b12);box-shadow:0 24px 80px rgba(0,0,0,.55);color:#eaf0ff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;padding:22px;position:relative}
      #cet-audit-overlay .cet-kicker{letter-spacing:.12em;font-size:12px;opacity:.75}
      #cet-audit-overlay .cet-title{font-size:34px;line-height:1.05;margin-top:6px;font-weight:750}
      #cet-audit-overlay .cet-sub{margin-top:10px;opacity:.85}
      #cet-audit-overlay .cet-example{margin-top:14px;padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.03)}
      #cet-audit-overlay .cet-small{font-size:12px;opacity:.7;margin-bottom:6px}
      #cet-audit-overlay .cet-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;opacity:.9}
      #cet-audit-overlay .cet-input{margin-top:14px;width:100%;min-height:130px;border-radius:14px;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.25);color:#fff;padding:12px 14px;outline:none}
      #cet-audit-overlay .cet-actions{display:flex;gap:12px;align-items:center;margin-top:14px}
      #cet-audit-overlay .cet-btn{border:0;border-radius:14px;padding:11px 14px;font-weight:650;cursor:pointer;background:#2e74ff;color:white}
      #cet-audit-overlay .cet-up{font-size:13px;opacity:.85;text-decoration:underline}
      #cet-audit-overlay .cet-msg{margin-top:10px;font-size:13px;opacity:.9}
      #cet-audit-overlay .cet-result{margin-top:14px;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03)}
      #cet-audit-overlay .cet-close{position:absolute;right:14px;bottom:14px;border:1px solid rgba(255,255,255,.10);background:transparent;color:#fff;border-radius:999px;padding:8px 12px;cursor:pointer;opacity:.9}
    `;
    document.head.appendChild(style);
    document.body.appendChild(wrap);

    // Wire up actions
    var input = wrap.querySelector("#cetInput");
    var btn = wrap.querySelector("#cetRun");
    var msg = wrap.querySelector("#cetMsg");
    var res = wrap.querySelector("#cetResult");
    var close = wrap.querySelector("#cetClose");

    close.onclick = function () {
      wrap.remove();
    };

    btn.onclick = function () {
      msg.textContent = "";
      res.style.display = "none";
      res.innerHTML = "";

      if (usedToday()) {
        msg.innerHTML = `You’ve used today’s free run. <a href="${UPGRADE_URL}" target="_blank" rel="noopener" style="color:#9fc1ff;text-decoration:underline">Unlock more runs</a>.`;
        return;
      }

      var t = (input.value || "").trim();
      if (!t) {
        msg.textContent = "Paste a few lines of stats first (followers, views, engagement, posts/week).";
        return;
      }

      // Parse common fields
      var raw = {
        followers: getNumber("followers", t) ?? getNumber("subs", t),
        views: getNumber("monthly views", t) ?? getNumber("views", t),
        engagement: getPercent("engagement", t) ?? getPercent("engagement rate", t),
        posts: getNumber("posts/week", t) ?? getNumber("posts per week", t) ?? getNumber("posts", t),
      };

      var s = scoreFromStats(raw);
      var spi = overallSPI(s);

      markUsed();

      res.style.display = "block";
      res.innerHTML = `
        <div style="font-weight:700;font-size:16px;margin-bottom:8px">Your CET SPI score: <span style="color:#9fc1ff">${spi}/100</span></div>
        <div style="font-size:13px;opacity:.9;line-height:1.5">
          <b>Coherence</b> (clarity + consistency): ${s.coherence.toFixed(0)}<br/>
          <b>Constraint</b> (strain + bottlenecks): ${s.constraint.toFixed(0)}<br/>
          <b>Adaptability</b> (iteration speed): ${s.adaptability.toFixed(0)}<br/>
          <b>Entanglement</b> (network effects): ${s.entanglement.toFixed(0)}<br/>
          <b>Emergence</b> (breakout potential): ${s.emergence.toFixed(0)}<br/>
        </div>
        <div style="margin-top:10px;font-size:12.5px;opacity:.85">
          Want more runs today? <a href="${UPGRADE_URL}" target="_blank" rel="noopener" style="color:#9fc1ff;text-decoration:underline">Unlock unlimited</a>.
        </div>
      `;
      msg.textContent = "Free run used for today.";
    };

    return wrap;
  }

  // BOOT function (THIS is what Framer loader is looking for)
  function boot() {
    // don’t mount twice
    if (document.getElementById("cet-audit-overlay")) return;

    // Ensure DOM exists
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", buildUI, { once: true });
    } else {
      buildUI();
    }
  }

  // Expose for Framer loader
  window.CET_AUDIT_BOOT = boot;

  // Optional auto-boot (uncomment if you always want it to appear)
  // boot();
})();