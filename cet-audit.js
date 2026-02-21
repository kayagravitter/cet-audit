// CET Audit Widget (Public) — 1 free run/day/device
(() => {
  const PAY_URL = "https://your-payment-link-here.com"; // TODO: replace
  const BRAND = "Creationist Entanglement Theory (CET)";
  const TITLE = "Structural Performance Intelligence Audit";

  const KEY = "cet_free_run_date";
  const today = () => new Date().toISOString().slice(0,10);
  const canRunFree = () => localStorage.getItem(KEY) !== today();
  const markRan = () => localStorage.setItem(KEY, today());

  // --- Minimal styles (clean + centered) ---
  const css = `
  #cet-root{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;z-index:999999;
    background:radial-gradient(80% 60% at 50% 35%,rgba(30,60,90,.55),rgba(0,0,0,.86));}
  .c{width:min(920px,92vw);border-radius:18px;border:1px solid rgba(255,255,255,.12);
    background:rgba(12,18,24,.72);backdrop-filter:blur(10px);box-shadow:0 24px 80px rgba(0,0,0,.55);
    padding:22px;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;}
  .k{letter-spacing:.16em;text-transform:uppercase;opacity:.82;font-size:12px;margin:0 0 8px;}
  .h{font-size:34px;line-height:1.1;margin:0 0 10px;font-weight:750;}
  .sub{opacity:.88;margin:0 0 14px;font-size:14px;line-height:1.35}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .in{width:100%;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.24);
    color:#fff;padding:12px;outline:none;font-size:14px}
  textarea.in{min-height:90px;resize:vertical}
  .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:12px}
  .btn{border:0;border-radius:12px;padding:11px 14px;background:#2f77ff;color:#fff;font-weight:750;cursor:pointer}
  .btn:disabled{opacity:.55;cursor:not-allowed}
  .pill{padding:7px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.12);opacity:.9;font-size:12px}
  .out{margin-top:14px;display:none}
  .out.show{display:block}
  .box{border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:12px;background:rgba(0,0,0,.18)}
  .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px;white-space:pre-wrap}
  a{color:#9ec1ff}
  @media(max-width:760px){.h{font-size:28px}.grid{grid-template-columns:1fr}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // --- Root mount ---
  const root = document.getElementById("cet-root") || (() => {
    const d=document.createElement("div"); d.id="cet-root"; document.body.appendChild(d); return d;
  })();

  root.innerHTML = `
    <div class="c">
      <p class="k">${BRAND}</p>
      <h1 class="h">${TITLE}</h1>
      <p class="sub">
        Paste basic, public-safe numbers. You don’t need any “CET variables.”<br>
        <b>Free:</b> 1 audit per day. <b>More:</b> paid audit link appears after your free run.
      </p>

      <div class="grid">
        <input id="plat" class="in" placeholder="Platform (e.g., Instagram / LinkedIn / Shopify)" />
        <input id="range" class="in" placeholder="Time range (e.g., last 14 days / 90 days)" />
        <input id="impr" class="in" placeholder="Impressions / Views (number)" />
        <input id="eng" class="in" placeholder="Engagements (likes+comments+shares) (number)" />
      </div>

      <textarea id="notes" class="in" placeholder="Optional: goal + what changed (no private info). Example: 'Posted CET preprint, went semi-viral, no ads.'"></textarea>

      <div class="row">
        <button id="run" class="btn">Run CET Audit</button>
        <span id="status" class="pill">Ready</span>
        <span id="free" class="pill"></span>
      </div>

      <div id="out" class="out">
        <div class="box">
          <div style="opacity:.82;font-size:12px;margin-bottom:6px">CET Output (Preview)</div>
          <div id="headline" style="font-weight:750;margin-bottom:10px"></div>
          <div class="row" style="margin-top:0">
            <span id="rho" class="pill"></span>
            <span id="tau" class="pill"></span>
            <span id="var" class="pill"></span>
            <span id="tier" class="pill"></span>
          </div>
        </div>

        <div class="box" style="margin-top:10px">
          <div style="opacity:.82;font-size:12px;margin-bottom:6px">Schema (investor-readable)</div>
          <div id="json" class="mono"></div>
        </div>

        <div class="box" style="margin-top:10px">
          <div style="opacity:.82;font-size:12px;margin-bottom:6px">Need another run today?</div>
          <div>Unlock more audits: <a href="${PAY_URL}" target="_blank" rel="noopener">Paid CET Audit</a></div>
        </div>
      </div>
    </div>
  `;

  const $ = (id) => root.querySelector(id);
  const status = $("#status");
  const out = $("#out");
  const free = $("#free");
  const runBtn = $("#run");

  // Show free status
  free.textContent = canRunFree() ? "Free run available today" : "Free run used today";

  // --- Simple CET math (public-safe) ---
  // ρ(t) = engagement / impressions (density)
  // τ ≈ proxy (needs time series for real τ; here we label as "requires time series")
  // σ² proxy from single snapshot (not real rolling variance) — we mark as "N/A" unless you later add time series CSV.
  function computeSnapshot(impr, eng) {
    const rho = impr > 0 ? eng / impr : 0;
    const tier = rho >= 0.06 ? "High signal" : rho >= 0.03 ? "Emerging" : "Baseline";
    return {
      rho,
      tau: null,
      variance: null,
      tier,
      headline:
        tier === "High signal"
          ? "Strong density: content-to-impression coupling looks healthy."
          : tier === "Emerging"
          ? "Early signal: density is bending upward—worth controlled testing."
          : "Baseline: likely needs a single controlled perturbation to reveal structure."
    };
  }

  function schema(payload) {
    return {
      CET: "Structural Performance Intelligence",
      input: payload,
      outputs: {
        "ρ": payload.metrics.rho,
        "τ": payload.metrics.tau,     // null here (needs time series)
        "σ²": payload.metrics.variance, // null here (needs time series)
        tier: payload.metrics.tier
      },
      note: "This is a snapshot audit. Time-series upload unlocks τ and rolling variance."
    };
  }

  function render(resultObj) {
    out.classList.add("show");
    $("#headline").textContent = resultObj.metrics.headline;
    $("#rho").textContent = `ρ (density): ${(resultObj.metrics.rho*100).toFixed(2)}%`;
    $("#tau").textContent = `τ: ${resultObj.metrics.tau ?? "time-series required"}`;
    $("#var").textContent = `σ²: ${resultObj.metrics.variance ?? "time-series required"}`;
    $("#tier").textContent = `Tier: ${resultObj.metrics.tier}`;
    $("#json").textContent = JSON.stringify(schema(resultObj), null, 2);
  }

  runBtn.addEventListener("click", () => {
    // daily free gate
    if (!canRunFree()) {
      status.textContent = "Free run used. Use paid link for more.";
      out.classList.add("show");
      return;
    }

    const platform = $("#plat").value.trim();
    const range = $("#range").value.trim();
    const impr = Number(($("#impr").value || "").replace(/,/g,""));
    const eng = Number(($("#eng").value || "").replace(/,/g,""));
    const notes = $("#notes").value.trim();

    if (!platform || !range || !Number.isFinite(impr) || !Number.isFinite(eng)) {
      status.textContent = "Missing fields: platform, range, impressions, engagements.";
      return;
    }

    status.textContent = "Running…";
    const metrics = computeSnapshot(impr, eng);

    const resultObj = {
      platform,
      range,
      snapshot: { impressions: impr, engagements: eng },
      notes,
      metrics
    };

    render(resultObj);
    markRan();
    free.textContent = "Free run used today";
    status.textContent = "Complete";
  });
})();