
Kaya Gravitter <gravitterkaya@gmail.com>
11:24 PM (0 minutes ago)
to me

// Creationist Entanglement Theory (CET)
// Structural Performance Intelligence Audit Engine

function CETAudit(input) {

  const text = input.toLowerCase();

  function score(keywordSet){
    let count = 0;
    keywordSet.forEach(k=>{
      if(text.includes(k)) count++;
    });
    return Math.min(100, count * 20);
  }

  const variables = {
    coherence: score(["clear","defined","structured","system"]),
    constraint: score(["limit","resource","budget","time"]),
    adaptability: score(["pivot","change","learning","iteration"]),
    entanglement: score(["network","team","dependency","market"]),
    emergence: score(["growth","scale","innovation","impact"])
  };

  const SPI =
    (variables.coherence +
     variables.constraint +
     variables.adaptability +
     variables.entanglement +
     variables.emergence) / 5;

  return {
    model: "Creationist Entanglement Theory",
    layer: "Structural Performance Intelligence",
    variables,
    SPI: SPI.toFixed(2),
    interpretation:
      SPI > 75 ? "High structural coherence detected."
      : SPI > 50 ? "Moderate system stability."
      : "Low structural coherence — redesign recommended."
  };
}

// expose globally
window.CETAudit = CETAudit;
