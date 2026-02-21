(function () {
  if (document.getElementById("cet-spi-root")) return;

  const css = `
  #cet-spi-root{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px;
    background:radial-gradient(1200px 800px at 50% 20%,#142233 0%,#0b0f14 55%,#06080c 100%);
    font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#fff}
  .cet-card{width:min(920px,100%);border-radius:18px;padding:26px;background:rgba(17,26,34,.74);
    border:1px solid rgba(255,255,255,.10);box-shadow:0 18px 60px rgba(0,0,0,.45)}
  .cet-kicker{opacity:.85;font-size:12px;letter-spacing:.12em;text-transform:uppercase}
  .cet-title{font-size:34px;line-height:1.1;margin:10px 0 6px}
  .cet-sub{opacity:.85;margin:0 0 14px}
  .cet-row{display:flex;gap:10px;flex-wrap:wrap}
  .cet-text{width:100%;min-height:110px;resize:vertical;padding:14px;border-radius:12px;background:#0004;color:#fff;
    border:1px solid #fff2;outline:none}
  .cet-btn{padding:12px 16px;border-radius:12px;background:#2b7cff;color:#fff;border:0;cursor:pointer;font-weight:600}
  .cet-mini{opacity:.8;font-size:13px;margin-top:10px}
  .cet-report{margin-top:16px;display:none;border-top:1px solid #fff1;padding-top:14px}
  .cet-pill{display:inline-block;padding:6px 10px;border-radius:999px;background:#ffffff12;border:1px solid #fff1;margin:6px 6px 0 0;font-size:12px}
  pre{white-space:pre-wrap;word-break:break-word;background:#0005;border:1px solid #fff1;padding:12px;border-radius:12px}
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "cet-spi-root";
  root.innerHTML = `
    <div class="cet-card">
      <div class="cet-kicker">Creationist Entanglement Theory (CET)</div>
      <div class="cet-title">Structural Performance Intelligence</div>
      <div class="cet-sub">Paste a short description of your system (company, project, workflow) <b>or</b> enter quick scores like: <span style="opacity:.9">coherence=70 constraint=60 adaptability=80 entanglement=35 emergence=75</span></div>

      <textarea id="cetInput" class="cet-text" placeholder="Example: We're a 6-person team building a fashion-tech marketplace. We have clear roles but vendors create delays. Budget is tight, we iterate weekly, and want to scale via partnerships."></textarea>

      <div class="cet-row" style="margin-top:12px;align-items:center">
        <button id="cetRun" class="cet-btn">Run CET Audit</button>
        <div id="cetStatus" class="cet-mini"></div>
      </div>

      <div id="cetReport" class="cet-report"></div>
    </div>
  `;
  document.body.appendChild(root);

  const input = document.getElementById("cetInput");
  const run = document.getElementById("cetRun");
  const status = document.getElementById("cetStatus");
  const report = document.getElementById("cetReport");

  function pill(label, val){ return `<span class="cet-pill">${label}: <b>${val}</b></span>`; }

  function render(r){
    const v = r.variables;
    report.style.display = "block";
    report.innerHTML = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <div style="font-size:22px;font-weight:800">SPI ${r.spi.value}</div>
        <div class="cet-pill">${r.spi.tier}</div>
      </div>
      <div style="margin-top:8px;opacity:.9">${r.interpretation}</div>

      <div style="margin-top:10px">
        ${pill("Coherence", v.coherence.value)}
        ${pill("Constraint", v.constraint.value)}
        ${pill("Adaptability", v.adaptability.value)}
        ${pill("Entanglement", v.entanglement.value)}
        ${pill("Emergence", v.emergence.value)}
      </div>

      ${r.flags.length ? `<div style="margin-top:10px"><b>Flags</b>: ${r.flags.map(f=>`${f.code} (${f.level})`).join(", ")}</div>` : ""}

      <div style="margin-top:10px"><b>Next actions</b><ul>${r.next_actions.map(x=>`<li>${x}</li>`).join("")}</ul></div>

      <details style="margin-top:10px">
        <summary style="cursor:pointer;opacity:.9">Show CET Output Schema (JSON)</summary>
        <pre>${JSON.stringify(r, null, 2)}</pre>
      </details>
    `;
  }

  function runAudit(){
    try{
      if (!window.CETAudit) { status.textContent="Engine not loaded yet. Refresh in 3 seconds."; return; }
      status.textContent="Running…";
      const r = window.CETAudit(input.value);
      status.textContent="Complete.";
      render(r);
    } catch(e){
      status.textContent = "Error: " + (e && e.message ? e.message : "unknown");
    }
  }

  run.addEventListener("click", runAudit);
  input.addEventListener("keydown", (e)=>{ if(e.key==="Enter" && (e.metaKey || e.ctrlKey)) runAudit(); });
})();