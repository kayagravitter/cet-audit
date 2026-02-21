(function () {

if (document.getElementById("cet-root")) return;

const root=document.createElement("div");
root.id="cet-root";
root.style.cssText="min-height:100vh;width:100%;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(1200px 800px at 50% 20%,#142233 0%,#0b0f14 55%,#06080c 100%);color:#fff;font-family:system-ui";

root.innerHTML=`
<div style="width:min(860px,100%);border-radius:18px;padding:28px;background:rgba(17,26,34,.72);border:1px solid rgba(255,255,255,.1);box-shadow:0 18px 60px rgba(0,0,0,.45)">
<div style="opacity:.8;font-size:13px;text-transform:uppercase">Creationist Entanglement Theory (CET)</div>
<h1 style="margin:10px 0 6px">Structural Performance Intelligence</h1>
<div style="opacity:.8;margin-bottom:14px">Describe the system you want analyzed.</div>

<textarea id="cetInput" rows="5" style="width:100%;padding:14px;border-radius:12px;background:#0004;color:#fff;border:1px solid #fff2"></textarea>

<button id="cetRun" style="margin-top:14px;padding:12px 16px;border-radius:12px;background:#2b7cff;color:#fff;border:none;cursor:pointer">Run CET Audit</button>

<div id="cetReport" style="margin-top:18px;display:none"></div>
</div>
`;

document.body.appendChild(root);

const btn=document.getElementById("cetRun");
const input=document.getElementById("cetInput");
const report=document.getElementById("cetReport");

btn.onclick=function(){
if(!window.CETAudit){alert("CET engine not loaded");return;}
const r=window.CETAudit(input.value);
report.style.display="block";
report.innerHTML=`
<h3>SPI: ${r.SPI}</h3>
<p>${r.interpretation}</p>
<pre>${JSON.stringify(r,null,2)}</pre>
`;
};

})();