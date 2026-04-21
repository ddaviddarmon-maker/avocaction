// pages/api/save-dossier.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: "Configuration Supabase manquante" });
  }

  try {
    const { dossier, analyse } = req.body;
    if (!dossier) return res.status(400).json({ error: "Données dossier manquantes" });

    const entreprise = dossier.entreprise || analyse?.entreprise || null;

    // ── Clustering ────────────────────────────────────────
    let clustering_alerte = false;
    let nb_cas_similaires = 0;
    if (entreprise && entreprise !== "Producteur inconnu") {
      try {
        const clusterRes = await fetch(
          `${SUPABASE_URL}/rest/v1/dossiers?entreprise=ilike.${encodeURIComponent("%" + entreprise + "%")}&select=id`,
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        if (clusterRes.ok) {
          const existants = await clusterRes.json();
          nb_cas_similaires = existants.length;
          if (nb_cas_similaires >= 2) clustering_alerte = true;
        }
      } catch {}
    }

    // ── Insertion ─────────────────────────────────────────
    const row = {
      entreprise,
      type_produit:          dossier.type_produit          || null,
      probleme:              dossier.probleme               || null,
      date_faits:            dossier.date                   || null,
      prejudice:             dossier.prejudice              || null,
      montant:               dossier.montant                || null,
      documents:             dossier.documents              || null,
      cadre:                 dossier.cadre                  || null,
      conversation_resume:   dossier.conversation_resume    || null,
      score_global:          analyse?.scores?.global        || null,
      score_compatibilite:   analyse?.scores?.compatibilite || null,
      score_similarite:      analyse?.scores?.similarite    || null,
      score_faisabilite:     analyse?.scores?.faisabilite   || null,
      action_groupe_potentiel: analyse?.action_groupe?.potentiel || null,
      prescription_statut:   analyse?.prescription?.statut  || null,
      rgpd_consent:          dossier.rgpd_consent           || "Oui",
      nom:                   dossier.nom                    || null,
      prenom:                dossier.prenom                 || null,
      email:                 dossier.email                  || null,
      telephone:             dossier.telephone              || null,
      user_password:         dossier.user_password          || null,  // ← FIX
      analyse_json:          analyse                        || null,
    };

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

    return res.status(200).json({
      success: true,
      id: inserted[0]?.id || null,
      clustering_alerte,
      nb_cas_similaires,
      message: clustering_alerte
        ? `${nb_cas_similaires} cas similaires détectés`
        : "Dossier sauvegardé",
    });

  } catch (err) {
    console.error("[save-dossier] Erreur:", err);
    return res.status(500).json({ error: err.message });
  }
}
