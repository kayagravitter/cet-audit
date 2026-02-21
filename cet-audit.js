/* CET Audit Overlay v1 (safe mount: never clears page)
   Creationist Entanglement Theory (CET) — Structural Performance Intelligence
*/
(() => {
  const DAY = () => new Date().toISOString().slice(0, 10);
  const KEY = "cet_free_run_day_v1";
  const usedToday = () => localStorage.getItem(KEY) === DAY();
  const markUsed = () => localStorage.setItem(KEY, DAY());

  const clamp = (n, a=0, b=100) => Math.max(a, Math.min(b, n));
  const num = (v) => {
    const n = Number(String(v).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  // Parse either structured key=val pairs or plain text with numbers.
  function parseInput(raw) {
    const text = (raw || "").trim();
    const kv = {};
    text.split(/[\n,]+/).forEach(part => {
      const m = part.match(/^\s*([a-zA-Z_ -]+)\s*[:=]\s*([^\n]+)\s*$/);
      if (m) kv[m[1].trim().toLowerCase()] = m[2].trim();
    });

    // Friendly aliases
    const platform = (kv.platform || kv.network || "").toLowerCase() || "";
    const views = num(kv.views || kv.impressions || kv.reach || kv.plays);
    const engagements = num(kv.engagements || kv.likes || 0) + num(kv.comments || 0) + num(kv.shares || 0) + num(kv.saves || 0);
    const followers = num(kv.followers || kv.subscribers || kv.audience);
    const postsPerWeek = num(kv["posts/week"] || kv.posts || kv.frequency);
    const revenue = num(kv.revenue || kv.sales || kv.mrr);

    // If no kv, try to infer common metrics from text numbers (best-effort)
    const numbers = (text.match(/[0-9][0-9,]*\.?[0-9]*/g) || []).map(s => num(s));
    const guessViews = views || (numbers[0] || 0);
    const guessFollowers = followers || (numbers[1] || 0);

    return {
      platform: platform || "unspecified",
      timeframe: (kv.timeframe || kv.period || "last 30 days").toLowerCase(),
      views: guessViews,
      engagements,
      followers: guessFollowers,
      postsPerWeek,
      revenue,
      notes: kv.notes || kv.context || ""
    };
  }

  // CET variables (first 5 "official" audit variables) — scored 0–100
  function scoreCET(m) {
    // Coherence: consistent signals & ratio sanity
    const er = m.views ? (m.engagements / m.views) : 0; // engagement rate
    const coherence = clamp(
      (m.followers ? 25 : 0) +
      (m.views ? 25 : 0) +
      (m.engagements ? 25 : 0) +
      (er > 0 && er < 0.2 ? 25 : er >= 0.2 ? 15 : 5)
    );

    // Constraint: bottlenecks / low capacity (low posting cadence or low resources proxy)
    const constraint = clamp(
      60 - clamp(m.postsPerWeek * 10, 0, 50) + (m.revenue > 0 ? -10 : 10)
    );

    // Adaptability: iteration frequency proxy (posts/week) + engagement responsiveness proxy
    const adaptability = clamp(
      clamp(m.postsPerWeek * 12, 0, 70) + clamp(er * 200, 0, 30)
    );

    // Entanglement: platform + audience leverage proxy (followers + views mix)
    const entanglement = clamp(
      clamp(Math.log10(m.followers + 1) * 18, 0, 60) + clamp(Math.log10(m.views + 1) * 12, 0, 40)
    );

    // Emergence: growth potential proxy (views relative to followers + revenue presence)
    const vf = m.followers ? (m.views / m.followers) : 0;
    const emergence = clamp(
      clamp(vf * 25, 0, 70) + (m.revenue > 0 ? 20 : 10)
    );

    const spi = clamp((coherence + (100 - constraint) + adaptability + entanglement + emergence) / 5);

    const flags = [];
    if (constraint > 70) flags.push("High constraint: capacity or budget bottleneck likely.");
    if (coherence < 50) flags.push("Low coherence: metrics/context unclear or inconsistent.");
    if (adaptability < 40) flags.push("Low adaptability: iterate more frequently (content/tests).");
    if (entanglement < 40) flags.push("Low entanglement: improve distribution/collabs/SEO.");
    if (emergence < 50) flags.push("Moderate emergence: clarify growth loop and monetization path.");

    const nextActions = [
      "Clarify the system: define 1 goal + 3 KPI signals (views, engagement, conversion).",
      "Reduce constraints: pick one bottleneck (time, budget, creative throughput) and remove it.",
      "Increase adaptability: commit to a weekly test cadence (1 experiment/week).",
      "Increase entanglement: add 1 distribution partner/channel (collab, newsletter, SEO, PR).",
      "Drive emergence: build a repeatable loop (content → capture → offer → retention)."
    ];

    return { coherence, constraint, adaptability, entanglement, emergence, spi, flags, nextActions };
  }

  // Investor-friendly output schema (feels “scientific”)
  function buildSchema(m, s) {
    return {
      model: "Creationist Entanglement Theory (CET)",
      layer: "Structural Performance Intelligence",
      tool: "CET Audit (Beta)",
      timestamp: new Date().toISOString(),
      input: {
        platform: m.platform,
        timeframe: m.timeframe,
        metrics: {
          views: m.views,
          engagements: m.engagements,
          followers: m.followers,
          posts_per_week: m.postsPerWeek,
          revenue: m.revenue
        },
        notes: m.notes
      },
      variables_0_100: {
        coherence: s.coherence,
        constraint: s.constraint,
        adaptability: s.adaptability,
        entanglement: s.entanglement,
        emergence: s.emergence
      },
      composite: {
        spi: s.spi, // Structural Performance Intelligence score
        band: s.spi >= 80 ? "A" : s.spi >= 65 ? "B" : s.spi >= 50 ? "C" : "D"
      },
      interpretation: {
        flags: s.flags,
        recommended_actions: s.nextActions.slice(0, 3)
      },
      disclaimer:
        "Prototype analytical model for structural interpretation only. Not diagnostic, financial, or predictive advice."
    };
  }

  function mount() {
    // Prevent double-mount
    if (document.getElementById("cet-overlay-root")) return;

    const root = document.createElement("div");
    root.id = "cet-overlay-root";
    root.style.cssText = `
      position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
      z-index: 999999; pointer-events: none;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    `;

    const card = document.createElement("div");
    card.style.cssText = `
      width: min(720px, calc(100vw - 28px));
      background: rgba(12,16,24,0.92);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 18px;
      box-shadow: 0 18px 60px rgba(0,0,0,0.35);
      padding: 22px 20px;
      color: #fff;
      pointer-events: auto;
    `;

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
        <div>
          <div style="letter-spacing:.08em;text-transform:uppercase;font-size:12px;opacity:.85;">
            Creationist Entanglement Theory (CET)
          </div>
          <div style="font-size:34px;line-height:1.05;font-weight:800;margin-top:6px;">
            Structural Performance Intelligence
          </div>
          <div style="opacity:.85;margin-top:8px;">
            Tell us what you want to audit. Paste simple stats — no CET math required.
          </div>
        </div>
        <button id="cet-close" aria-label="Close" style="
          background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
          color:#fff;border-radius:12px;padding:8px 10px;cursor:pointer;
        ">✕</button>
      </div>

      <div style="margin-top:14px;display:grid;gap:10px;">
        <div style="display:grid;gap:8px;">
          <div style="opacity:.9;font-size:13px;">
            Paste metrics like:
            <span style="opacity:.8">platform=instagram, views=106000, likes=3200, comments=210, shares=140, followers=46700, posts/week=3, timeframe=90 days</span>
            <br/><span style="opacity:.8">or just write: “Instagram last 90 days: 106k views, 46.7k followers, 3.5k total engagements”</span>
          </div>
          <textarea id="cet-input" rows="5" style="
            width:100%; resize:vertical; padding:12px 12px;
            border-radius:14px; border:1px solid rgba(255,255,255,.12);
            background:rgba(255,255,255,.06); color:#fff; outline:none;
          " placeholder="Paste your stats or describe your system…"></textarea>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
          <button id="cet-run" style="
            background:#2f78ff;border:none;color:#fff;
            border-radius:14px;padding:12px 16px;font-weight:700;
            cursor:pointer;
          ">Run Free CET Audit</button>

          <div id="cet-status" style="opacity:.85;font-size:13px;"></div>
        </div>

        <div id="cet-result" style="display:none;margin-top:8px;">
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
            <div style="font-size:14px;opacity:.9;">
              SPI Score: <span id="cet-spi" style="font-weight:800;"></span>
              <span id="cet-band" style="opacity:.85;margin-left:8px;"></span>
            </div>
          </div>

          <div style="margin-top:10px;display:grid;gap:10px;">
            <div id="cet-flags" style="font-size:13px;opacity:.92;"></div>
            <div id="cet-actions" style="font-size:13px;opacity:.92;"></div>

            <details style="margin-top:4px;">
              <summary style="cursor:pointer;opacity:.9;">View scientific output schema (JSON)</summary>
              <pre id="cet-json" style="
                margin-top:8px;white-space:pre-wrap;word-break:break-word;
                background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.10);
                padding:12px;border-radius:12px;font-size:12px;opacity:.95;
              "></pre>
            </details>
          </div>
        </div>

        <div id="cet-paywall" style="display:none;margin-top:10px;
          border-top:1px solid rgba(255,255,255,.10);padding-top:10px;opacity:.95;">
          <div style="font-weight:700;">Free audit used for today.</div>
          <div style="opacity:.85;font-size:13px;margin-top:4px;">
            Upgrade to run unlimited audits, compare platforms, and track improvements over time.
          </div>
          <div style="opacity:.8;font-size:12px;margin-top:4px;">
            (Hook this button to Stripe/checkout later.)
          </div>
          <button id="cet-upgrade" style="
            margin-top:10px;background:rgba(255,255,255,.10);
            border:1px solid rgba(255,255,255,.16);color:#fff;
            border-radius:12px;padding:10px 12px;cursor:pointer;
          ">Upgrade to Unlimited</button>
        </div>

        <div style="margin-top:10px;opacity:.65;font-size:12px;">
          Status: prototype analytical model (non-diagnostic; interpretive layer).
        </div>
      </div>
    `;

    root.appendChild(card);
    document.body.appendChild(root);

    const $ = (id) => card.querySelector(id);
    const input = $("#cet-input");
    const runBtn = $("#cet-run");
    const status = $("#cet-status");
    const result = $("#cet-result");
    const spiEl = $("#cet-spi");
    const bandEl = $("#cet-band");
    const flagsEl = $("#cet-flags");
    const actionsEl = $("#cet-actions");
    const jsonEl = $("#cet-json");
    const paywall = $("#cet-paywall");
    const upgrade = $("#cet-upgrade");

    // Close
    $("#cet-close").onclick = () => root.remove();

    // Paywall gate
    function gate() {
      if (usedToday()) {
        runBtn.disabled = true;
        runBtn.style.opacity = "0.5";
        paywall.style.display = "block";
        status.textContent = "Free run already used today.";
        return true;
      }
      paywall.style.display = "none";
      return false;
    }
    gate();

    upgrade.onclick = () => {
      alert("Upgrade flow not connected yet. Add Stripe later.");
    };

    function render(schema) {
      const spi = schema.composite.spi;
      spiEl.textContent = `${spi.toFixed(1)}/100`;
      bandEl.textContent = `Band ${schema.composite.band}`;
      const flags = schema.interpretation.flags || [];
      const actions = schema.interpretation.recommended_actions || [];
      flagsEl.innerHTML = flags.length
        ? `<b>Flags:</b><br/>• ${flags.join("<br/>• ")}`
        : `<b>Flags:</b><br/>None detected.`;
      actionsEl.innerHTML = actions.length
        ? `<b>Next actions:</b><br/>1) ${actions.join("<br/>2) ").replace("<br/>2)", "<br/>2)")}`
        : "";
      jsonEl.textContent = JSON.stringify(schema, null, 2);
      result.style.display = "block";
    }

    function run() {
      try {
        status.textContent = "";
        if (gate()) return;

        const metrics = parseInput(input.value);
        const scores = scoreCET(metrics);
        const schema = buildSchema(metrics, scores);

        render(schema);
        markUsed();
        gate();
        status.textContent = "Complete.";
      } catch (e) {
        status.textContent = "Error: " + (e && e.message ? e.message : "unknown");
      }
    }

    runBtn.onclick = run;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run();
    });

    // Helpful default example (so it looks alive)
    if (!input.value.trim()) {
      input.value = "platform=instagram, timeframe=90 days, views=106000, followers=46700, likes=2800, comments=210, shares=140, posts/week=3";
    }
  }

  // Mount when DOM is ready (safe for Framer)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
