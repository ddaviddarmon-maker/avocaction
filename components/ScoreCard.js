// components/ScoreCard.js

const C = {
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  cream: "#F5F0E8",
  navy: "#0A1628",
  gray: "#8A8F9E",
};

function scoreColor(s) {
  return s >= 70 ? "#4CAF50" : s >= 50 ? C.gold : "#E57373";
}

function scoreBorder(s) {
  return s >= 70
    ? "rgba(45,125,78,0.4)"
    : s >= 50
    ? "rgba(201,168,76,0.4)"
    : "rgba(139,26,26,0.4)";
}

function StatusBadge({ statut }) {
  const colors = {
    "En cours": { bg: "rgba(45,125,78,0.2)", color: "#4CAF50", border: "rgba(45,125,78,0.3)" },
    "Possible": { bg: "rgba(201,168,76,0.2)", color: C.gold, border: "rgba(201,168,76,0.3)" },
    "À investiguer": { bg: "rgba(100,120,160,0.2)", color: "#90A4AE", border: "rgba(100,120,160,0.3)" },
  };
  const s = colors[statut] || colors["À investiguer"];
  return (
    <span style={{
      padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600,
      letterSpacing: "0.5px", background: s.bg, color: s.color,
      border: `1px solid ${s.border}`, whiteSpace: "nowrap",
    }}>
      {statut}
    </span>
  );
}

export default function ScoreCard({ data }) {
  const scores = [
    { label: "Compatibilité externe", value: data.score_compatibilite_externe, desc: "Actions existantes" },
    { label: "Similarité interne",    value: data.score_similarite_interne,    desc: "Cas comparables" },
    { label: "Faisabilité collective",value: data.score_faisabilite_collective, desc: "Potentiel de groupe" },
    { label: "Score global",          value: data.score_global,                 desc: "Évaluation finale" },
  ];

  const prescriptionColor = {
    urgent: "#E57373", modéré: C.gold, faible: "#4CAF50",
  }[data.risque_prescription] || C.gold;

  const prescriptionBg = {
    urgent: "rgba(139,26,26,0.2)", modéré: "rgba(184,118,10,0.15)", faible: "rgba(45,125,78,0.15)",
  }[data.risque_prescription] || "rgba(201,168,76,0.15)";

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(201,168,76,0.25)",
      borderRadius: "16px", padding: "28px", marginTop: "24px",
      animation: "fadeInUp 0.6s ease",
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    }}>
      {/* Titre */}
      <div style={{ color: C.gold, fontSize: "18px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <span>⚖️</span><span>Analyse AVOCACTION</span>
      </div>

      {/* Résumé */}
      {data.resume_situation && (
        <p style={{ color: "rgba(245,240,232,0.75)", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px", fontStyle: "italic" }}>
          « {data.resume_situation} »
        </p>
      )}

      {/* Scores */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        {scores.map((s) => (
          <div key={s.label} style={{
            background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "16px",
            textAlign: "center", border: `1px solid ${scoreBorder(s.value)}`,
          }}>
            <div style={{ fontSize: "34px", fontWeight: 700, color: scoreColor(s.value), lineHeight: 1, marginBottom: "6px" }}>
              {s.value}<span style={{ fontSize: "15px" }}>%</span>
            </div>
            <div style={{ color: C.cream, fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>{s.label}</div>
            <div style={{ color: C.gray, fontSize: "12px", marginBottom: "8px" }}>{s.desc}</div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${s.value}%`, background: scoreColor(s.value), borderRadius: "2px", transition: "width 1s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Actions de groupe */}
      {data.actions_groupe_potentielles?.length > 0 && (
        <>
          <div style={{ color: C.gold, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>🔍 Actions de groupe identifiées</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
            {data.actions_groupe_potentielles.map((a, i) => (
              <div key={i} style={{
                background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "10px", padding: "14px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
              }}>
                <div>
                  <div style={{ color: C.cream, fontSize: "14px", fontWeight: 500 }}>{a.nom}</div>
                  <div style={{ color: C.gray, fontSize: "12px" }}>{a.organisme}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <span style={{ color: C.gold, fontSize: "13px", fontWeight: 600 }}>{a.pertinence}%</span>
                  <StatusBadge statut={a.statut} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Recommandation */}
      {data.recommandation && (
        <>
          <div style={{ color: C.gold, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>💡 Recommandation</div>
          <div style={{
            background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: "12px", padding: "16px 20px", color: C.cream,
            fontSize: "15px", lineHeight: "1.7", marginBottom: "20px",
          }}>
            {data.recommandation}
          </div>
        </>
      )}

      {/* Prochaines étapes */}
      {data.prochaines_etapes?.length > 0 && (
        <>
          <div style={{ color: C.gold, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>📋 Prochaines étapes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {data.prochaines_etapes.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "rgba(245,240,232,0.8)", fontSize: "14px", lineHeight: "1.5" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                  color: C.navy, fontSize: "12px", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px",
                }}>{i + 1}</div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Prescription */}
      {data.risque_prescription && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
          background: prescriptionBg, color: prescriptionColor,
          border: `1px solid ${prescriptionColor}44`,
        }}>
          ⏱️ Risque prescription : {data.risque_prescription.toUpperCase()}
          {data.delai_prescription && ` — ${data.delai_prescription}`}
        </div>
      )}
    </div>
  );
}
