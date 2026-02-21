/* CET Audit Overlay v2.0 — Clean Public Build */

(() => {

if (window.__CET_AUDIT_LOADED__) return;
window.__CET_AUDIT_LOADED__ = true;

/* ---------------- CONFIG ---------------- */

const STRIPE_URL =
"https://buy.stripe.com/5kQdR8eHT6iy3Uy4q42Fa00";

/* 1 free audit per day */
const DAY = new Date().toISOString().slice(0,10);
const KEY = "cet_free_run_" + DAY;

const usedToday = () => localStorage.getItem(KEY) === "1";
const markUsed = () => localStorage.setItem(KEY,"1");

/* ---------------- UI ---------------- */

const css = `
.cet-overlay{
position:fixed; inset:0;
background:rgba(0,0,0,.65);
display:flex; align-items:center;
justify-content:center;
z-index:999999;
font-family:system-ui;
}
.cet-card{
width:min(520px,92vw);
background:#0b1620;
color:white;
padding:26px;
border-radius:18px;
box-shadow:0 20px 60px rgba(0,0,0,.6);
}
.cet-title{font-size:26px;font-weight:600;margin-bottom:8px}
.cet-sub{opacity:.8;margin-bottom:14px}
textarea{
width:100%;height:120px;
background:#081018;
color:white;
border-radius:10px;
border:1px solid #1e2b36;
padding:10px;
margin-bottom:14px;
}
button{
border:none;
border-radius:10px;
padding:12px 16px;
font-weight:600;
cursor:pointer;
}
.cet-run{background:#3b82f6;color:white}
.cet-upgrade{
margin-top:12px;
display:none;
background:#10b981;
color:white;
width:100%;
}
.cet-result{
margin-top:14px;
background:#081018;
padding:14px;
border-radius:10px;
display:none;
}
`;

const style=document.createElement("style");
style.innerHTML=css;
document.head.appendChild(style);

/* ---------------- BUILD OVERLAY ---------------- */

const overlay=document.createElement("div");
overlay.className="cet-overlay";

overlay.innerHTML=`
<div class="cet-card">
<div class="cet-title">Performance Audit</div>
<div class="cet-sub">
Paste your public stats in plain English.
Example: Instagram, followers, views, posting frequency.
</div>

<textarea id="cetInput"
placeholder="Platform: Instagram
Followers: 12k
Monthly Views: 90k
Posts per week: 3
Goal: brand deals"></textarea>

<button class="cet-run" id="cetRun">
Run free audit
</button>

<button class="cet-upgrade" id="cetUpgrade">
Unlock unlimited audits
</button>

<div class="cet-result" id="cetResult"></div>
</div>
`;

document.body.appendChild(overlay);

/* ---------------- LOGIC ---------------- */

const runBtn = overlay.querySelector("#cetRun");
const upgradeBtn = overlay.querySelector("#cetUpgrade");
const resultBox = overlay.querySelector("#cetResult");
const input = overlay.querySelector("#cetInput");

/* SIMPLE FRIENDLY ANALYSIS */
function analyze(text){

let score = 40;

if(/followers/i.test(text)) score+=15;
if(/views/i.test(text)) score+=15;
if(/post/i.test(text)) score+=10;
if(/goal/i.test(text)) score+=10;

if(score>90) score=90;

let message =
score < 50
? "Early stage profile. Focus on consistency and niche clarity."
: score < 70
? "Growing momentum. Increase posting rhythm and collaborations."
: "Strong positioning. Ready for partnerships and monetization.";

return {score,message};
}

/* RUN AUDIT */

runBtn.onclick=()=>{

if(usedToday()){
upgradeBtn.style.display="block";
runBtn.disabled=true;
return;
}

const text=input.value.trim();
if(!text) return;

const r=analyze(text);

resultBox.style.display="block";
resultBox.innerHTML=
`<b>Performance Score:</b> ${r.score}/100<br><br>${r.message}`;

markUsed();
};

/* STRIPE BUTTON — MOBILE SAFE */
upgradeBtn.onclick=(e)=>{
e.preventDefault();
e.stopPropagation();
window.location.href = STRIPE_URL;
};

})();