import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { dossier, analyse } = req.body;

    if (!dossier?.rgpd_consent?.startsWith('Oui')) {
      return res.status(200).json({ saved: false, reason: 'no_consent' });
    }

    const entreprise = analyse?.entreprise || dossier?.entreprise || '';
    let action_cabinet_id = null;

    if (entreprise) {
      const { data: actions } = await supabase
        .from('actions_cabinet')
        .select('id')
        .ilike('defendeur', `%${entreprise}%`)
        .limit(1);
      if (actions?.length > 0) action_cabinet_id = actions[0].id;
    }

    let clustering_alerte = false;
    if (entreprise) {
      const { count } = await supabase
        .from('dossiers_clients')
        .select('*', { count: 'exact', head: true })
        .ilike('entreprise', `%${entreprise}%`);
      clustering_alerte = (count || 0) >= 2;
    }

    const { data, error } = await supabase
      .from('dossiers_clients')
      .insert({
        cadre: dossier.cadre,
        residence: dossier.residence,
        localisation_achat: dossier.localisation,
        description_libre: dossier.conversation_resume,
        entreprise: analyse?.entreprise || dossier.entreprise,
        probleme: analyse?.resume || dossier.probleme,
        date_faits: dossier.date,
        prejudice_corpo: dossier.prejudice_corpo,
        cas_similaires: dossier.similaires,
        demarches: dossier.demarches,
        montant: dossier.montant,
        participation: dossier.participation,
        score_compatibilite: analyse?.scores?.compatibilite,
        score_similarite: analyse?.scores?.similarite,
        score_faisabilite: analyse?.scores?.faisabilite,
        score_global: analyse?.scores?.global,
        urgence: analyse?.urgence,
        prescription_statut: analyse?.prescription?.statut,
        recommandation: analyse?.recommandation,
        action_cabinet_id,
        rgpd_consent: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    if (action_cabinet_id) {
      await supabase.rpc('increment_plaignants', { action_id: action_cabinet_id });
    }

    return res.status(200).json({ saved: true, dossier_id: data.id, clustering_alerte });

  } catch (err) {
    console.error('[save-dossier]', err);
    return res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
}
