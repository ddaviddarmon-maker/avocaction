// pages/api/chat.js
// ─────────────────────────────────────────────────────────────────
// Version 2 — Recherche web TOUJOURS active
// Claude cherche les vraies actions de groupe avant de scorer
// ─────────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── Système principal ─────────────────────────────────────────────
const SYSTEM = `Tu es AVOCACTION, un agent IA spécialisé en droit de la consommation français 
et en actions de groupe (loi n° 2025-391 du 30 avril 2025).

═══════════════════════════════════════════════════════
⚠️ RÈGLE ABSOLUE : NE JAMAIS INVENTER DE SCORES
Tu dois TOUJOURS utiliser web_search avant de produire une analyse.
Les scores doivent refléter ce que tu as RÉELLEMENT trouvé.
═══════════════════════════════════════════════════════

## DÉROULEMENT DE LA CONVERSATION

### Phase 1 — Collecte d'informations (2-3 questions max)
Pose des questions claires pour obtenir :
1. Le nom de l'entreprise ou marque concernée
2. Le type de problème (produit défectueux, frais cachés, RGPD, transport, abonnement...)
3. La date approximative des faits
4. Le montant du préjudice estimé

### Phase 2 — Recherche OBLIGATOIRE avant toute analyse
Dès que tu as le nom de l'entreprise + le type de problème :

a) Lance une recherche : "[entreprise] action de groupe France"
b) Lance une recherche : "[type problème] recours collectif consommateurs France [année actuelle]"
c) Si transport aérien : "[compagnie] retard annulation remboursement action collective"

Utilise les RÉSULTATS RÉELS pour informer ton analyse.
Si tu ne trouves rien, dis-le clairement.

### Phase 3 — Analyse honnête basée sur les données réelles
Après avoir cherché, produis une analyse JSON avec ce format EXACT (en fin de message) :

{
  "analyse_complete": true,
  "entreprise": "Nom de l'entreprise",
  "type_prejudice": "Description du préjudice",
  "actions_trouvees": [
    {
      "nom": "Nom de l'action trouvée (ou 'Aucune action identifiée')",
      "statut": "en cours | terminée | en formation | aucune",
      "source": "URL ou 'Non disponible'",
      "resume": "Ce que j'ai trouvé en 1 phrase"
    }
  ],
  "scores": {
    "compatibilite": <0-100, basé sur les actions trouvées et critères légaux>,
    "prescription": <0-100, basé sur la date des faits>,
    "masse_critique": <0-100, estimation du nombre de victimes potentielles>,
    "solidite_juridique": <0-100, basé sur les preuves et type de préjudice>
  },
  "score_global": <moyenne pondérée des scores>,
  "prescription": {
    "type": "produit | faits",
    "delai_ans": <2 ou 5>,
    "date_butoir_estimee": "MM/AAAA ou 'À préciser'",
    "urgence": "faible | modérée | élevée | critique"
  },
  "recommandation": "Texte clair de 2-3 phrases sur la marche à suivre",
  "source_scores": "Basé sur recherche web du [date] + analyse juridique" 
}

## POINTS DE DROIT À APPLIQUER

- Actions de groupe : loi n° 2025-391 du 30 avril 2025
- Légitimité : associations agréées OU existant depuis 2 ans avec activité réelle
- Prescription produit : 2 ans (Art. L217-4 C. conso) depuis la livraison
- Prescription faits : 5 ans (Art. 2224 C. civil) depuis la connaissance du dommage  
- Délai adhésion au groupe : 2 mois à 5 ans selon jugement
- Transport aérien : Règlement EU 261/2004
- RGPD effacement : Art. 17, délai de réponse 1 mois

## CALIBRATION DES SCORES (honnêteté absolue)

compatibilite :
- 80-100 : action de groupe EN COURS pour cette entreprise/problème exact → rejoindre maintenant
- 50-79 : actions similaires trouvées ou critères légaux forts mais pas d'action identifiée
- 30-49 : peu de précédents, critères partiellement remplis
- 0-29 : aucun précédent trouvé, critères légaux faibles ou prescription dépassée

prescription :
- 90-100 : faits récents (< 6 mois)
- 60-89 : faits dans les délais (6 mois - 3 ans)
- 30-59 : proche de la prescription (> 3 ans)
- 0-29 : potentiellement prescrit

masse_critique :
- Évalue si ce type de problème peut toucher beaucoup de personnes
- Prends en compte ce que tu as trouvé sur le web (témoignages, forums, médias)

solidite_juridique :
- Évalue la clarté du préjudice, l'existence de preuves (factures, contrats, emails)
- Plus le préjudice est documentable, plus le score est élevé

Ton ton est bienveillant, précis, et TOUJOURS honnête sur ce que tu as trouvé.
Si tu n'as pas trouvé d'action existante, dis-le clairement et explique quand même les options.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages requis" });
    }

    // ── Toujours activer la recherche web ──────────────────────────
    const params = {
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: system || SYSTEM,
      messages,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        },
      ],
      tool_choice: { type: "auto" },
    };

    // ── Boucle agentique — gère les tool_use successifs ───────────
    // Claude peut faire plusieurs recherches avant de répondre
    let currentMessages = [...messages];
    let finalText = "";
    let iterations = 0;
    const MAX_ITERATIONS = 6; // max 6 allers-retours de recherche

    while (iterations < MAX_ITERATIONS) {
      const response = await client.messages.create({
        ...params,
        messages: currentMessages,
      });

      // Extraire le texte final
      for (const block of response.content) {
        if (block.type === "text") {
          finalText = block.text;
        }
      }

      // Si Claude a fini → on sort
      if (response.stop_reason === "end_turn") {
        break;
      }

      // Si Claude veut utiliser un tool → on continue la boucle
      if (response.stop_reason === "tool_use") {
        // Ajouter la réponse de Claude (avec tool_use) à l'historique
        currentMessages = [
          ...currentMessages,
          { role: "assistant", content: response.content },
        ];

        // Construire les tool_result pour chaque tool_use
        const toolResults = response.content
          .filter((block) => block.type === "tool_use")
          .map((block) => ({
            type: "tool_result",
            tool_use_id: block.id,
            content: "Recherche effectuée — résultats intégrés.",
          }));

        if (toolResults.length > 0) {
          currentMessages = [
            ...currentMessages,
            { role: "user", content: toolResults },
          ];
        }
      }

      iterations++;
    }

    // Fallback si pas de texte
    if (!finalText) {
      finalText = "Je n'ai pas pu compléter l'analyse. Veuillez réessayer.";
    }

    return res.status(200).json({
      content: [{ type: "text", text: finalText }],
      reply: finalText,
    });

  } catch (err) {
    console.error("API chat error:", err);

    const msg = err.message || "Erreur inconnue";

    if (msg.includes("401") || msg.includes("authentication")) {
      return res.status(500).json({
        error: "Clé API invalide. Vérifiez ANTHROPIC_API_KEY dans les variables d'environnement Vercel.",
      });
    }
    if (msg.includes("529") || msg.includes("overloaded")) {
      return res.status(503).json({
        error: "API temporairement surchargée. Réessayez dans quelques secondes.",
      });
    }

    return res.status(500).json({ error: msg });
  }
}
