// pages/api/chat.js  (ou app/api/chat/route.js selon ta structure Next.js)
// ─────────────────────────────────────────────────────────────────
// Remplace TON fichier existant par celui-ci.
// Gère :
//   - Le chat standard (analyse dossier)
//   - La recherche web autonome pour identifier une marque (enableWebSearch: true)
// ─────────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── Système commun ────────────────────────────────────────
const SYSTEM = `Tu es AVOCACTION, un agent IA spécialisé en droit de la consommation français 
et en actions de groupe (loi n° 2025-391 du 30 avril 2025).

Points de droit clés à appliquer :
- Actions de groupe ouvertes aux particuliers, petits professionnels (< 5 salariés, contrat hors activité principale), 
  personnes morales non professionnelles (syndicats de copropriétaires)
- Associations agréées OU existant depuis 2 ans avec activité réelle peuvent représenter les victimes
- Prescription produit : 2 ans (Art. L217-4 C. conso) à partir de la livraison
- Prescription faits : 5 ans (Art. 2224 C. civil) à partir de la connaissance du dommage
- Délai d'adhésion au groupe : 2 mois à 5 ans selon le jugement
- Double procédure : jugement sur responsabilité PUIS réparation (opt-in)
- Possibilité de cessation du manquement + réparation de tous types de préjudices
- Règlement EU 261/2004 pour transport aérien (retard, annulation)
- RGPD Art. 17 pour droit à l'effacement (délai de réponse : 1 mois)

Ton ton est bienveillant, précis, sans jargon inutile.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, enableWebSearch, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages requis" });
    }

    // ── Paramètres communs ──────────────────────────────
    const params = {
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 2048,
      system: system || SYSTEM,
      messages,
    };

    // ── Web search activé pour la recherche de marque ──
    if (enableWebSearch) {
      params.tools = [
        {
          type: "web_search_20250305",
          name: "web_search",
        },
      ];
      // Laisser Claude décider quand utiliser le tool
      params.tool_choice = { type: "auto" };
    }

    const response = await client.messages.create(params);

    // ── Extraire le texte final (après tool use éventuel) ──
    // Si Claude a utilisé web_search, il y a plusieurs blocs content :
    // tool_use → tool_result → puis le texte final
    // On prend le dernier bloc text
    let finalText = "";
    for (const block of response.content) {
      if (block.type === "text") {
        finalText = block.text; // on prend le dernier text
      }
    }

    // Si pas de texte (cas rare), on retourne le premier bloc
    if (!finalText && response.content.length > 0) {
      finalText = response.content[0].text || JSON.stringify(response.content[0]);
    }

    return res.status(200).json({
      content: [{ type: "text", text: finalText }],
      // Compatibilité avec d'autres formats
      reply: finalText,
    });

  } catch (err) {
    console.error("API chat error:", err);

    // Message d'erreur utile pour le debug
    const msg = err.message || "Erreur inconnue";
    if (msg.includes("401") || msg.includes("authentication")) {
      return res.status(500).json({
        error: "Clé API invalide. Vérifiez ANTHROPIC_API_KEY dans les variables d'environnement Vercel.",
      });
    }
    if (msg.includes("529") || msg.includes("overloaded")) {
      return res.status(503).json({ error: "API temporairement surchargée. Réessayez dans quelques secondes." });
    }

    return res.status(500).json({ error: msg });
  }
}

// ── Pour App Router (app/api/chat/route.js) ──────────────
// Si tu utilises le App Router de Next.js 13+, remplace la fonction ci-dessus par :
//
// export async function POST(request) {
//   const body = await request.json();
//   // ... même logique, retourne Response.json(...)
// }
