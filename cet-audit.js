// CET AUDIT — CLEAN BOOT VERSION
(function () {

if (window.CET_LOADED) return;
window.CET_LOADED = true;

/* -----------------------------
   Wait for Framer to fully load
------------------------------*/
function bootWhenReady(fn) {
  if (document.readyState === "complete") {
    setTimeout(fn, 400);
  } else {
    window.addEventListener("load", () => setTimeout(fn, 400));
  }
}

/* -----------------------------
   MAIN START FUNCTION
------------------------------*/
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
  box.style.width = "260px";

  box.innerHTML = `
    <b>CET Audit Ready</b><br>
    Paste your metrics below:<br><br>

    <textarea id="cetInput"
      placeholder="followers: 10000
monthly_views: 250000"
      style="width:100%;height:90px;margin-top:6px;"></textarea>

    <button id="cetRun"
      style="margin-top:10px;width:100%;padding:8px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;">
      Run CET Audit
    </button>

    <div id="cetResult" style="margin-top:10px;"></div>
  `;

  document.body.appendChild(box);

  document.getElementById("cetRun").onclick = () => {

    const text =
      document.getElementById("cetInput").value;

    // Simple demo scoring logic
    let score = Math.min(100, (text.length * 3) % 100);

    document.getElementById("cetResult").innerHTML =
      "CET Score: <b>" + score + "</b>";
  };
}

/* -----------------------------
   BOOT
------------------------------*/
bootWhenReady(start);

})();