// CET AUDIT — CLEAN BOOT VERSION
(function () {

if (window.CET_LOADED) return;
window.CET_LOADED = true;

(function () {

function bootWhenReady(start);{
  if(document.readyState==="complete"){
    setTimeout(fn,400);
  } else {
    window.addEventListener("load",()=>setTimeout(fn,400));
  }
}

  const box = document.createElement("div");
  box.style.position="fixed";
  box.style.bottom="20px";
  box.style.right="20px";
  box.style.padding="16px 20px";
  box.style.background="#0b1620";
  box.style.color="#fff";
  box.style.fontFamily="sans-serif";
  box.style.borderRadius="12px";
  box.style.zIndex="999999";
  box.style.boxShadow="0 10px 30px rgba(0,0,0,.4)";
  box.innerHTML=`
    <b>CET Audit Ready</b><br>
    Paste your metrics below:<br><br>
    <textarea id="cetInput"
      placeholder="followers: 10000
monthly_views: 250000"
      style="width:240px;height:90px;margin-top:6px"></textarea><br><br>
    <button id="cetRun">Run CET Audit</button>
    <div id="cetResult" style="margin-top:10px"></div>
  `;

  document.body.appendChild(box);

  document.getElementById("cetRun").onclick = () => {
    const text =
      document.getElementById("cetInput").value;

    let score = Math.min(100,
      (text.length * 3) % 100);

    document.getElementById("cetResult")
      .innerHTML = "CET Score: <b>" + score + "</b>";
  };

}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", start);
else
  start();

})();