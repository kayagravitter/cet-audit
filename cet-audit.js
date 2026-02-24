(() => {
  const STRIPE_URL = "PASTE_YOUR_STRIPE_LINK_HERE"; // e.g. https://buy.stripe.com/xxxx

  const $ = (id) => document.getElementById(id);
  const input = $("in"), out = $("out"), run = $("run"), clear = $("clear"), count = $("count");
  $("upgrade").href = STRIPE_URL;

  const num = (s) => {
    if (!s) return null;
    const m = String(s).toLowerCase().replace(/,/g,"").match(/(\d+(\.\d+)?)(\s*[kmb])?/);
    if (!m) return null;
    let n = parseFloat(m[1]);
    const u = (m[3] || "").trim();
    if (u==="k") n*=1e3; else if (u==="m") n*=1e6; else if (u==="b") n*=1e9;
    return isFinite(n) ? n : null;
  };

  const pick = (t, keys) => {
    const lines = t.split(/\n+/).map(l => l.trim()).filter(Boolean);
    for (const l of lines) {
      const low = l.toLowerCase();
      if (keys.some(k => low.includes(k))) {
        const after = l.split(/[:=-]/).slice(1).join(":").trim();
        const v = num(after) ?? num(l);
        if (v !== null) return v;
      }
    }
    return null;
  };

  const pickText = (t, keys) => {
    const lines = t.split(/\n+/).map(l=>l.trim()).filter(Boolean);
    for (const l of lines) {
      const low = l.toLowerCase();
      if (keys.some(k=>low.startsWith(k) || low.includes(k))) {
        const after = l.split(/[:=-]/).slice(1).join(":").trim();
        return after || l;
      }
    }
    return "";
  };

  const scoreIt = (followers, impressions14, engagements14) => {
    // Friendly, simple, explainable scoring (0–100)
    let s = 10;

    if (followers) s += Math.min(35, Math.log10(followers + 1) * 12);
    if (impressions14) s += Math.min(35, Math.log10(impressions14 + 1) * 12);
    if (engagements14) s += Math.min(20, Math.log10(engagements14 + 1) * 8);

    return Math.max(0, Math.min(100, Math.round(s)));
  };

  const fmt = (n) => n == null ? "—" : n.toLocaleString();

  const render = () => {
    const t = input.value || "";
    count.textContent = String(t.length);

    if (!t.trim()) {
      out.textContent = "Paste stats to generate your CET audit.";
      return;
    }

    const platform = pickText(t, ["platform", "channel"]) || "—";
    const followers = pick(t, ["followers", "subs", "subscribers", "audience"]);
    const impressions14 = pick(t, ["impressions", "reach", "views (14", "views 14", "14d impressions", "14 day impressions"]);
    const engagements14 = pick(t, ["engagements", "reactions", "comments", "shares", "saves"]);
    const goal = pickText(t, ["goal", "objective", "want", "seeking"]) || "—";

    const score = scoreIt(followers, impressions14, engagements14);

    const next =
      score >= 80 ? "You’re ready for bigger partners. Package this into a 1-page media kit + pinned post cadence." :
      score >= 60 ? "Solid traction. Tighten your positioning + post 2x/week with 1 clear CTA." :
      score >= 40 ? "Early signal. Focus on consistency + one niche conversation thread." :
                    "Seed phase. Clarify your offer + run a small cohort/beta with testimonials.";

    out.textContent =
`CET Score: ${score}/100

Platform: ${platform}
Followers: ${fmt(followers)}
Impressions (14d): ${fmt(impressions14)}
Engagements (14d): ${fmt(engagements14)}
Goal: ${goal}

Next move: ${next}`;
  };

  input.addEventListener("input", render);
  run.addEventListener("click", render);
  clear.addEventListener("click", () => { input.value=""; render(); });

  // remember last input
  input.value = localStorage.getItem("cet_audit_text") || input.value;
  input.addEventListener("input", () => localStorage.setItem("cet_audit_text", input.value));
  render();
})();