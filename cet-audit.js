// CET AUDIT — CLEAN BOOT + STRIPE UPGRADE (no engagement rate)
(function () {
  if (window.CET_LOADED) return;
  window.CET_LOADED = true;

  const STRIPE_URL = "https://buy.stripe.com/5kQdR8eHT6iy3Uy4q42Fa00"; // <-- paste yours

  function bootWhenReady(fn) {
    if (document.readyState === "complete") setTimeout(fn, 400);
    else window.addEventListener("load", () => setTimeout(fn, 400));
  }

  function goToStripe(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Most reliable on mobile + inside builders:
    try {
      window.top.location.href = STRIPE_URL;
    } catch (_) {
      window.location.href = STRIPE_URL;
    }
  }

  function start() {
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.bottom = "20px";
    box.style.right = "20px";
    box.style.padding = "16px 20px";
    box.style.background = "#0b1620";
    box.style.color = "#fff";
    box.style.fontFamily = "sans-serif";
    box.style.borderRadius = "12px";
    box.style.zIndex = "999999";
    box.style.boxShadow = "0 10px 30px rgba(0,0,0,.4)";
    box.style.width = "280px";

    box.innerHTML = `
      <b>CET Audit</b><br>
      Paste stats (plain English):<br><br>

      <textarea id="cetInput"
        placeholder="platform: instagram
monthly_views: 99000
followers: 12400
goal: brand deals"
        style="width:100%;height:110px;margin-top:6px;"></textarea>

      <button id="cetRun"
        style="margin-top:10px;width:100%;padding:9px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;">
        Run free audit
      </button>

      <div id="cetResult" style="margin-top:10px;opacity:.95;"></div>

      <div style="margin-top:10px;font-size:12px;opacity:.9;">
        Free audit used today.
        <a id="cetUpgradeLink" href="${STRIPE_URL}" style="color:#93c5fd;text-decoration:underline;">
          Upgrade for unlimited
        </a>
      </div>

      <button id="cetUpgradeBtn"
        style="margin-top:10px;width:100%;padding:9px;background:#111827;color:white;border:1px solid rgba(255,255,255,.18);border-radius:8px;cursor:pointer;">
        Upgrade (Stripe)
      </button>
    `;

    document.body.appendChild(box);

    // Run button (simple demo scoring; no engagement rate)
    document.getElementById("cetRun").onclick = () => {
      const text = document.getElementById("cetInput").value || "";
      const score = Math.min(100, (text.length * 3) % 100);
      document.getElementById("cetResult").innerHTML =
        `SPI Score: <b>${score}</b><br><span style="font-size:12px;opacity:.9;">(No engagement rate needed.)</span>`;
    };

    // Stripe upgrade: use redirect, not window.open
    document.getElementById("cetUpgradeBtn").addEventListener("click", goToStripe);
    document.getElementById("cetUpgradeLink").addEventListener("click", goToStripe);
  }

  bootWhenReady(start);
})();