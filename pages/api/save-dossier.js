// pages/api/save-dossier.js
// ─────────────────────────────────────────────────────────
// Sauvegarde un dossier client en base Supabase
// + détecte le clustering (cas similaires existants)
// Appelé depuis index.jsx uniquement si rgpd_consent = Oui
// ─────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[save-dossier] Variables Supabase manquantes");
    return res.status(500).json({ error: "Configuration Supabase manquante" });
  }

  try {
    const { dossier, analyse } = req.body;

    if (!dossier) {
      return res.status(400).json({ error: "Données dossier manquantes" });
    }

    const entreprise = dossier.entreprise || analyse?.entreprise || null;

    // ── 1. Vérifier clustering AVANT insertion ─────────────
    let clustering_alerte = false;
    let nb_cas_similaires = 0;

    if (entreprise && entreprise !== "Producteur inconnu") {
      const clusterRes = await fetch(
        `${SUPABASE_URL}/rest/v1/dossiers?entreprise=ilike.${encodeURIComponent("%" + entreprise + "%")}&select=id,entreprise,probleme`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (clusterRes.ok) {
        const existants = await clusterRes.json();
        nb_cas_similaires = existants.length;
        if (nb_cas_similaires >= 2) {
          clustering_alerte = true;
        }
      }
    }

    // ── 2. Préparer les données à insérer ──────────────────
    const row = {
      entreprise: entreprise,
      type_produit: dossier.type_produit || null,
      probleme: dossier.probleme || null,
      date_faits: dossier.date || null,
      prejudice: dossier.prejudice || null,
      montant: dossier.montant || null,
      documents: dossier.documents || null,
      cadre: dossier.cadre || null,
      conversation_resume: dossier.conversation_resume || null,
      score_global: analyse?.scores?.global || null,
      score_compatibilite: analyse?.scores?.compatibilite || null,
      score_similarite: analyse?.scores?.similarite || null,
      score_faisabilite: analyse?.scores?.faisabilite || null,
      action_groupe_potentiel: analyse?.action_groupe?.potentiel || null,
      prescription_statut: analyse?.prescription?.statut || null,
      rgpd_consent: dossier.rgpd_consent || "Oui",
      nom: dossier.nom || null,
      prenom: dossier.prenom || null,
      email: dossier.email || null,
      telephone: dossier.telephone || null,
      analyse_json: analyse || null,
    };

    // ── 3. Insérer en base ─────────────────────────────────
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/dossiers`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error("[save-dossier] Erreur insertion:", errText);
      return res.status(500).json({ error: "Erreur sauvegarde", details: errText });
    }

    const inserted = await insertRes.json();

    // ── 4. Retourner le résultat + info clustering ─────────
    return res.status(200).json({
      success: true,
      id: inserted[0]?.id || null,
      clustering_alerte,
      nb_cas_similaires,
      message: clustering_alerte
        ? `${nb_cas_similaires} cas similaires détectés pour ${entreprise}`
        : "Dossier sauvegardé",
    });

  } catch (err) {
    console.error("[save-dossier] Erreur:", err);
    return res.status(500).json({ error: err.message });
  }
}
