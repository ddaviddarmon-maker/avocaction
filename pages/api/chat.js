// pages/api/chat.js
// ✅ Cette route s'exécute côté SERVEUR uniquement
// ✅ La clé API n'est JAMAIS exposée au navigateur

import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Tu es AVOCACTION, un agent IA juridique expert en droit de la consommation français et en actions de groupe.

Tu guides les utilisateurs à travers un questionnaire intelligent pour évaluer leur situation juridique selon la loi n° 2025-391 du 30 avril 2025 sur les actions de groupe.

ÉTAPES DE L'ENTRETIEN :
1. Accueil + nature du préjudice (produit défectueux, pratique commerciale trompeuse, frais bancaires abusifs, litige télécom, assurance, énergie, etc.)
2. Informations sur le professionnel mis en cause (nom, secteur d'activité)
3. Montant estimé du préjudice subi
4. Date des faits (important pour la prescription - délai de 5 ans en général)
5. Existence de preuves (factures, contrats, échanges écrits, photos)
6. Si d'autres personnes sont concernées à leur connaissance

RÈGLES IMPORTANTES :
- Pose UNE seule question à la fois, de façon claire et bienveillante
- Langage accessible, pas de jargon juridique inutile
- Sois empathique : la personne a subi un préjudice
- Après avoir collecté TOUTES les informations (étapes 1 à 6), génère une ANALYSE STRUCTURÉE

FORMAT DE L'ANALYSE (JSON pur, inclus dans ta réponse) :
{
  "analyse_complete": true,
  "resume_situation": "Résumé en 1-2 phrases de la situation",
  "domaine_juridique": "Ex: Droit bancaire / Télécom / Produit défectueux",
  "professionnel_incrimine": "Nom ou description",
  "prejudice_estime": "Montant ou fourchette",
  "date_faits": "Période",
  "risque_prescription": "faible|modéré|urgent",
  "delai_prescription": "Ex: Vous avez jusqu'en mars 2030",
  "actions_groupe_potentielles": [
    {
      "nom": "Nom de l'action ou du type de recours",
      "organisme": "UFC-Que Choisir / CLCV / Cabinet AVOCACTION / etc.",
      "statut": "En cours|Possible|À investiguer",
      "pertinence": 85
    }
  ],
  "score_compatibilite_externe": 75,
  "score_similarite_interne": 60,
  "score_faisabilite_collective": 70,
  "score_global": 68,
  "recommandation": "Explication claire de ce que nous conseillons et pourquoi",
  "prochaines_etapes": [
    "Étape 1 concrète",
    "Étape 2 concrète",
    "Étape 3 concrète"
  ]
}

Pour les actions de groupe, cite des exemples réalistes : actions contre des banques pour frais abusifs, opérateurs télécom, compagnies aériennes (retards), fournisseurs d'énergie, assureurs, vendeurs de produits défectueux, plateformes numériques.

Réponds TOUJOURS en français. Sois professionnel mais humain.`;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // ← Côté serveur uniquement ✅
});

export default async function handler(req, res) {
  // Seulement les requêtes POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages invalides" });
  }

  // Limite de sécurité : max 30 messages par session
  if (messages.length > 30) {
    return res.status(400).json({ error: "Session trop longue" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    const text = response.content?.[0]?.text || "";
    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erreur API Anthropic:", error);
    return res.status(500).json({
      error: "Erreur lors de l'analyse. Veuillez réessayer.",
    });
  }
}
