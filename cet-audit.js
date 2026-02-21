<div id="cetAudit" style="font-family:Arial;padding:20px;max-width:600px;margin:auto;">
<h2>Creationist Entanglement Theory (CET)<br>
Structural Performance Intelligence Audit</h2>

<p>Enter simple performance numbers from your platform.</p>

<label>Platform:</label><br>
<select id="platform">
<option>Instagram</option>
<option>LinkedIn</option>
<option>Shopify</option>
<option>Website</option>
</select><br><br>

<label>Views / Impressions:</label><br>
<input id="views" type="number"><br><br>

<label>Total Engagements (likes + comments + clicks):</label><br>
<input id="engagement" type="number"><br><br>

<label>Follower or User Growth:</label><br>
<input id="growth" type="number"><br><br>

<button onclick="runCET()">Run CET Audit</button>

<div id="result" style="margin-top:20px;font-weight:bold;"></div>
</div>

<script>
function runCET(){

const today = new Date().toDateString();
if(localStorage.getItem("cetAudit")==today){
document.getElementById("result").innerHTML =
"Free audit already used today.";
return;
}

let v = Number(document.getElementById("views").value);
let e = Number(document.getElementById("engagement").value);
let g = Number(document.getElementById("growth").value);

if(!v || !e){
document.getElementById("result").innerHTML =
"Please enter valid numbers.";
return;
}

/* --- CET CORE VARIABLES --- */

let rho = e / v;                // Engagement Density
let tau = Math.log(v+1)/(g+1);  // Relaxation proxy
let sigma = Math.abs(rho - 0.05);

/* --- CET SCORE --- */

let CETscore = Math.round(
(0.6*rho + 0.3*(1/(tau+1)) + 0.1*(1-sigma))*100
);

/* --- INTERPRETATION --- */

let state="Stable System";
if(CETscore>70) state="Structural Expansion Detected";
if(CETscore<40) state="Constraint Bottleneck";

document.getElementById("result").innerHTML =
"CET Score: "+CETscore+
"<br>Status: "+state;

localStorage.setItem("cetAudit",today);
}
</script>