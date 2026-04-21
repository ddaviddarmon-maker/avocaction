// pages/api/generate-pdf.js
// Génère un HTML prêt à imprimer en PDF (ouvre dans un nouvel onglet)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { dossier, analyse } = req.body;
  const a = analyse || {};
  const date = new Date().toLocaleDateString("fr-FR", { day:"2-digit", month:"long", year:"numeric" });

  const sc = v => v >= 75 ? "#2D7D4E" : v >= 50 ? "#C9A84C" : "#C0392B";
  const sl = v => v >= 75 ? "Élevé" : v >= 50 ? "Moyen" : "Faible";

  const scoresHtml = a.scores ? `
    <div class="section">
      <h2>Score de faisabilité collective — ${a.scores.global}/100</h2>
      <table class="score-table">
        <tr>
          ${[["Compatibilité externe", a.scores.compatibilite], ["Similarité interne", a.scores.similarite], ["Faisabilité collective", a.scores.faisabilite]].map(([label, val]) => `
          <td>
            <div class="score-label">${label}</div>
            <div class="score-value" style="color:${sc(val)}">${val}/100</div>
            <div class="score-bar-bg"><div class="score-bar" style="width:${val}%;background:${sc(val)}"></div></div>
            <div class="score-level" style="color:${sc(val)}">${sl(val)}</div>
          </td>`).join("")}
        </tr>
      </table>
    </div>` : "";

  const actionsHtml = a.action_groupe?.actions_trouvees?.length > 0 ? `
    <div class="actions-list">
      <div class="actions-title">Actions identifiées :</div>
      ${a.action_groupe.actions_trouvees.map(act => `
        <div class="action-item">⚠ ${act}</div>
      `).join("")}
    </div>` : "";

  const etapesHtml = a.etapes?.length ? `
    <div class="section">
      <h2>Prochaines étapes</h2>
      ${a.etapes.map((e, i) => `
        <div class="etape">
          <div class="etape-num">${i + 1}</div>
          <div class="etape-text">${e}</div>
        </div>`).join("")}
    </div>` : "";

  const prescHtml = a.prescription ? `
    <div class="section">
      <h2>Prescription</h2>
      <div class="presc-statut statut-${a.prescription.statut}">
        ${a.prescription.statut === "favorable" ? "✓ Favorable" : a.prescription.statut === "urgent" ? "⚠ Urgent" : "ℹ Attention"}
      </div>
      <p>${a.prescription.message}</p>
      ${a.prescription.expiration ? `<p><strong>Expiration :</strong> ${a.prescription.expiration}</p>` : ""}
      <div class="alertes-box">
        <strong>Alertes programmées :</strong> J-365 · J-180 · J-30 avant expiration
      </div>
    </div>` : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Dossier AVOCACTION — ${a.entreprise || dossier?.entreprise || "Dossier"}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: "Calibri", sans-serif; color: #0A1628; background: #fff; padding: 40px 50px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 3px solid #0B1A3E; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-family: "Palatino Linotype", serif; font-size: 28px; font-weight: bold; color: #0B1A3E; letter-spacing: 2px; }
    .logo span { color: #4DB8E8; }
    .header-right { text-align:right; font-size: 12px; color: #6B7280; }
    .header-right strong { display:block; font-size:14px; color:#0B1A3E; margin-bottom:4px; }
    .confidential { font-size:10px; color:#9CA3AF; margin-top:6px; border:1px solid #E5E7EB; padding:3px 8px; border-radius:4px; display:inline-block; }
    h1 { font-family: "Palatino Linotype", serif; font-size: 22px; color: #0B1A3E; margin-bottom: 6px; }
    .entreprise-badge { display:inline-block; background:#E6F4FB; color:#0B1A3E; padding:4px 12px; border-radius:20px; font-size:13px; font-weight:bold; margin-bottom:20px; }
    .section { margin-bottom: 28px; }
    h2 { font-family: "Palatino Linotype", serif; font-size: 16px; color: #0B1A3E; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #E5E7EB; }
    p { font-size: 13px; line-height: 1.7; color: #374151; margin-bottom: 8px; }
    .score-table { width:100%; border-collapse:collapse; }
    .score-table td { padding: 10px 16px; text-align:center; border: 1px solid #E5E7EB; }
    .score-label { font-size:11px; color:#6B7280; margin-bottom:6px; }
    .score-value { font-size:20px; font-weight:bold; font-family:"Palatino Linotype", serif; margin-bottom:6px; }
    .score-bar-bg { background:#E5E7EB; height:6px; border-radius:3px; overflow:hidden; margin-bottom:4px; }
    .score-bar { height:100%; border-radius:3px; }
    .score-level { font-size:11px; font-weight:bold; }
    .action-groupe-box { background:#FFF7ED; border:1px solid #FED7AA; border-left:4px solid #EA580C; border-radius:8px; padding:14px 16px; margin-bottom:12px; }
    .action-groupe-potentiel { font-size:12px; font-weight:bold; padding:3px 10px; border-radius:20px; display:inline-block; margin-bottom:8px; }
    .potentiel-eleve { background:#DCFCE7; color:#166534; }
    .potentiel-moyen { background:#FEF9C3; color:#854D0E; }
    .potentiel-faible { background:#FEE2E2; color:#991B1B; }
    .actions-list { margin-top:10px; }
    .actions-title { font-size:11px; color:#6B7280; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
    .action-item { background:#FEF2F2; border:1px solid #FECACA; border-left:4px solid #F87171; border-radius:6px; padding:8px 12px; font-size:12px; color:#991B1B; margin-bottom:6px; }
    .recommandation-box { background:#EFF6FF; border:1px solid #BFDBFE; border-left:4px solid #4DB8E8; border-radius:8px; padding:14px 16px; }
    .etape { display:flex; gap:12px; align-items:flex-start; margin-bottom:10px; }
    .etape-num { width:26px; height:26px; background:#0B1A3E; color:#4DB8E8; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; flex-shrink:0; }
    .etape-text { font-size:13px; color:#374151; line-height:1.6; padding-top:3px; }
    .presc-statut { display:inline-block; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:bold; margin-bottom:10px; }
    .statut-favorable { background:#DCFCE7; color:#166534; }
    .statut-attention { background:#FEF9C3; color:#854D0E; }
    .statut-urgent { background:#FEE2E2; color:#991B1B; }
    .alertes-box { background:#EFF6FF; border:1px solid #BFDBFE; border-radius:6px; padding:10px 14px; font-size:12px; color:#1E40AF; margin-top:10px; }
    .avocat-box { background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:14px 16px; }
    .avocat-initiale { width:44px; height:44px; background:#0B1A3E; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; color:#4DB8E8; font-family:"Palatino Linotype",serif; font-weight:bold; float:left; margin-right:14px; }
    .avocat-nom { font-size:15px; font-weight:bold; color:#0B1A3E; font-family:"Palatino Linotype",serif; }
    .avocat-role { font-size:11px; color:#4DB8E8; text-transform:uppercase; letter-spacing:1px; margin-top:2px; }
    .footer { margin-top:40px; padding-top:16px; border-top:1px solid #E5E7EB; display:flex; justify-content:space-between; font-size:10px; color:#9CA3AF; }
    @media print {
      body { padding: 20px 30px; }
      .no-print { display:none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">AVOC<span>ACTION</span></div>
      <div style="font-size:11px;color:#6B7280;margin-top:4px;font-family:Calibri,sans-serif;">La force du nombre au service de vos droits</div>
    </div>
    <div class="header-right">
      <strong>Rapport d'analyse juridique</strong>
      Généré le ${date}<br/>
      <span class="confidential">CONFIDENTIEL — Usage personnel</span>
    </div>
  </div>

  <div class="section">
    <h1>${a.entreprise || dossier?.entreprise || "Dossier client"}</h1>
    <div class="entreprise-badge">${a.entreprise || "Entreprise concernée"}</div>
    ${a.urgence ? `<div style="display:inline-block;margin-left:8px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;background:${a.urgence==="haute"?"#FEE2E2":a.urgence==="normale"?"#FEF9C3":"#DCFCE7"};color:${a.urgence==="haute"?"#991B1B":a.urgence==="normale"?"#854D0E":"#166534"}">Urgence ${a.urgence}</div>` : ""}
    <p style="margin-top:12px">${a.resume || ""}</p>
  </div>

  ${scoresHtml}

  ${prescHtml}

  ${a.action_groupe ? `
  <div class="section">
    <h2>Action de groupe</h2>
    <div class="action-groupe-box">
      <div class="action-groupe-potentiel potentiel-${a.action_groupe.potentiel?.replace("é","e")}"">
        Potentiel ${a.action_groupe.potentiel}
      </div>
      <p>${a.action_groupe.message || ""}</p>
      ${actionsHtml}
    </div>
  </div>` : ""}

  ${a.recommandation ? `
  <div class="section">
    <h2>Recommandation</h2>
    <div class="recommandation-box">
      <p>${a.recommandation}</p>
    </div>
  </div>` : ""}

  ${etapesHtml}

  <div class="section">
    <h2>Alertes de prescription</h2>
    <div class="alertes-box" style="font-size:13px;padding:14px 16px">
      Trois alertes automatiques ont été programmées avant l'expiration de votre droit d'action :<br/>
      <strong>J-365</strong> (1 an avant) · <strong>J-180</strong> (6 mois avant) · <strong>J-30</strong> (1 mois avant)<br/>
      Ces alertes seront envoyées à l'adresse email enregistrée lors de la création de votre compte.
    </div>
  </div>

  <div class="footer">
    <span>AVOCACTION — avocaction.vercel.app — d.darmon@eleve-efb.fr</span>
    <span>Loi n° 2025-391 du 30 avril 2025 · Art. L217-4 C. conso · Art. 2224 C. civil</span>
  </div>

  <div class="no-print" style="text-align:center;margin-top:30px">
    <button onclick="window.print()" style="padding:12px 28px;background:#0B1A3E;color:#4DB8E8;border:none;border-radius:10px;cursor:pointer;font-size:14px;font-family:Calibri,sans-serif;font-weight:bold;letter-spacing:1px">
      🖨 Imprimer / Enregistrer en PDF
    </button>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
