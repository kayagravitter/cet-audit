(()=>{const d=document,ID="cet-root",K="cetAuditLastRun";
function ui(){if(d.getElementById(ID))return;
const r=d.createElement("div");r.id=ID;
r.innerHTML=`<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at top,#132436,#05070a);padding:24px;">
<div style="width:min(720px,92vw);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.10);border-radius:22px;padding:26px;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;">
<div style="letter-spacing:.14em;font-size:12px;opacity:.75;margin-bottom:10px;">CREATIONIST ENTANGLEMENT THEORY (CET)</div>
<div style="font-size:42px;line-height:1.05;font-weight:700;margin:0 0 12px;">Structural Performance Intelligence</div>
<div style="opacity:.8;font-size:14px;margin-bottom:16px;">
Paste your <b>public stats</b> (no math). Example:<br>
<span style="opacity:.9">Platform: Instagram • Views: 106000 • Likes: 4200 • Comments: 380 • Shares: 210 • New followers: 950</span>
</div>
<textarea id="cet_in" placeholder="Paste your stats here…" style="width:100%;min-height:120px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.25);color:#fff;padding:14px;outline:none;"></textarea>
<div style="display:flex;gap:12px;align-items:center;margin-top:14px;flex-wrap:wrap;">
<button id="cet_run" style="background:#2b74ff;color:#fff;border:none;border-radius:14px;padding:12px 16px;font-weight:700;cursor:pointer;">Run CET Audit</button>
<span id="cet_note" style="opacity:.75;font-size:12px;">Free: 1 audit/day. For more runs, upgrade.</span>
</div>
<div id="cet_out" style="margin-top:14px;display:none;padding:14px;border-radius:14px;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.10);"></div>
</div></div>`;
d.body.appendChild(r);

const $=q=>d.getElementById(q);
function n(s){const m=String(s||"").match(/(-?\d+(\.\d+)?)/);return m?Number(m[1]):0}
function grab(txt,key){const re=new RegExp(key+"\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)","i");const m=txt.match(re);return m?Number(m[1]):0}
function score(p){return Math.max(0,Math.min(100,Math.round(p)))}

function run(){
const out=$("cet_out"),note=$("cet_note");
const today=new Date().toDateString();
if(localStorage.getItem(K)===today){
note.textContent="Free audit already used today. Upgrade for more runs.";
out.style.display="block";
out.innerHTML="⛔ Free audit already used today.";
return;
}
const t=$("cet_in").value||"";
if(t.trim().length<8){out.style.display="block";out.innerHTML="Please paste a short set of stats.";return;}

const views = grab(t,"views")||grab(t,"impressions")||grab(t,"reach")||n(t);
const likes = grab(t,"likes");
const comments = grab(t,"comments");
const shares = grab(t,"shares")||grab(t,"saves");
const growth = grab(t,"new followers")||grab(t,"followers")||grab(t,"growth");

const engagements = likes+comments+shares;
const rho = views? engagements/views : 0;
const tau = Math.log(views+1)/(Math.max(1,growth)+1);
const sigma = Math.abs(rho-0.05);

const coherence   = score((rho*1400));          // engagement density
const constraint  = score((tau*18));            // friction proxy
const adaptability= score((shares/(Math.max(1,likes))*100)); // share efficiency
const entangle    = score((comments/(Math.max(1,views))*8000)); // conversation density
const emergence   = score((growth/(Math.max(1,views))*120000)); // growth signal

const SPI = score((coherence+ (100-constraint) + adaptability + entangle + emergence)/5);

let status="Stable System";
let insight="Maintain cadence; test 1 variable at a time.";
if(SPI>=75){status="Structural Expansion Detected";insight="Double down on top-performing channel; scale distribution.";}
else if(SPI<=40){status="Constraint Bottleneck";insight="Your system is constrained—simplify offer, tighten funnel, reduce friction.";}

out.style.display="block";
out.innerHTML =
`<div style="font-weight:800;margin-bottom:6px;">CET Output (Structural Performance Intelligence)</div>
<div style="opacity:.85;font-size:13px;margin-bottom:10px;">Model: CET • Layer: Structural Performance Intelligence • Mode: Prototype (interpretive)</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:14px;">
<div><b>SPI:</b> ${SPI}/100</div><div><b>Status:</b> ${status}</div>
<div>Coherence: ${coherence}</div><div>Constraint: ${constraint}</div>
<div>Adaptability: ${adaptability}</div><div>Entanglement: ${entangle}</div>
<div>Emergence: ${emergence}</div><div></div>
</div>
<div style="margin-top:10px;opacity:.9;"><b>Interpretation:</b> ${insight}</div>`;

localStorage.setItem(K,today);
}

$("cet_run").addEventListener("click",run);
$("cet_in").addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))run();});
}
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",ui); else ui();
})();