/* ================================
   CET AUDIT ENGINE — PUBLIC BUILD
   Creationist Entanglement Theory
================================ */

(function () {

if (window.CET_LOADED) return;
window.CET_LOADED = true;

/* ---------- STYLE ---------- */

const style = document.createElement("style");
style.innerHTML = `
#cet-root{
 position:fixed;
 inset:0;
 display:flex;
 align-items:center;
 justify-content:center;
 background:#05070c;
 z-index:999999;
 font-family:system-ui,Arial;
 color:#fff;
}
#cet-card{
 width:min(720px,92vw);
 background:#0b1422;
 border-radius:20px;
 padding:28px;
 box-shadow:0 20px 60px rgba(0,0,0,.6);
}
#cet-title{font-size:40px;margin:10px 0}
#cet-input{
 width:100%;
 min-height:140px;
 border-radius:12px;
 border:none;
 padding:14px;
 background:#020409;
 color:#fff;
}
#cet-btn{
 margin-top:14px;
 padding:12px 18px;
 border-radius:10px;
 border:none;
 background:#2f7ef7;
 color:#fff;
 font-size:16px;
 cursor:pointer;
}
#cet-out{
 margin-top:14px;
 background:#020409;
 padding:14px;
 border-radius:12px;
 display:none;
 white-space:pre-wrap;
}
#cet-pay{margin-top:10px;font-size:13px;display:none}
`;
document.head.appendChild(style);

/* ---------- UI ---------- */

const root = document.createElement("div");
root.id = "cet-root";

root.innerHTML = `
<div id="cet-card">
<div style="opacity:.7;font-size:12px;letter-spacing:.15em">
CREATIONIST ENTANGLEMENT THEORY
</div>

<div id="cet-title">Structural Performance Intelligence</div>

<p style="opacity:.8">
Describe your project using simple numbers and facts.
Example:
Platform: Instagram
Views: 46k/month
Goal: grow audience
Team: solo founder
</p>

<textarea id="cet-input"
placeholder="Paste your stats here..."></textarea>

<button id="cet-btn">Run Free CET Audit</button>

<div id="cet-out"></div>
<div id="cet-pay">
Free audit used today.<br>
Upgrade to unlock unlimited audits.
</div>

</div>
`;

document.body.appendChild(root);

/* ---------- FREE LIMIT ---------- */

const today = new Date().toISOString().slice(0,10);
const key = "cet_free_" + today;

function usedToday(){
  return localStorage.getItem(key)==="1";
}

/* ---------- CET SCORING ---------- */

function score(text,words){
 let c=0;
 words.forEach(w=>{
   if(text.includes(w)) c++;
 });
 return Math.min(100,c*20);
}

function runAudit(input){

 const t = input.toLowerCase();

 const coherence = score(t,
  ["goal","plan","clear","system","strategy"]);

 const constraint = score(t,
  ["budget","limited","solo","delay","problem"]);

 const adaptability = score(t,
  ["test","iterate","weekly","change","experiment"]);

 const entanglement = score(t,
  ["partner","collab","network","brand","press"]);

 const emergence = score(t,
  ["scale","growth","expand","increase","trend"]);

 const SPI = (
   coherence +
   constraint +
   adaptability +
   entanglement +
   emergence
 ) / 5;

 return {
   model:"CET Structural Performance Intelligence",
   variables:{
     coherence,
     constraint,
     adaptability,
     entanglement,
     emergence
   },
   SPI:SPI.toFixed(1),
   interpretation:
     SPI>75
      ?"High structural readiness"
      :SPI>50
      ?"Moderate system stability"
      :"Low coherence — redesign advised"
 };
}

/* ---------- BUTTON ---------- */

const btn = document.getElementById("cet-btn");
const input = document.getElementById("cet-input");
const out = document.getElementById("cet-out");
const pay = document.getElementById("cet-pay");

if(usedToday()){
 btn.disabled=true;
 pay.style.display="block";
}

btn.onclick = () => {

 if(usedToday()){
   pay.style.display="block";
   return;
 }

 const result = runAudit(input.value);

 localStorage.setItem(key,"1");

 out.style.display="block";
 out.textContent =
   JSON.stringify(result,null,2);

 btn.disabled=true;
 pay.style.display="block";
};

})();