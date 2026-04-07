// pages/api/chat.js
// Version stable — web search natif Anthropic, pas de temperature forcée

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
- Règlement EU 261/2004 pour transport aérien (retard, annulation)
- RGPD Art. 17 pour droit à l'effacement (délai de réponse : 1 mois)

RÈGLE ABSOLUE : Utilise web_search avant tout scoring.
Les scores doivent refléter ce que tu trouves RÉELLEMENT sur le web.

Ton ton est bienveillant, précis, sans jargon inutile.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages requis" });
    }

    const response = await client.messages.create({
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
    });

    // Prendre le DERNIER bloc texte (après les recherches web éventuelles)
    let finalText = "";
    for (const block of response.content) {
      if (block.type === "text") {
        finalText = block.text;
      }
    }

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
      return res.status(500).json({ error: "Clé API invalide." });
    }
    if (msg.includes("529") || msg.includes("overloaded")) {
      return res.status(503).json({ error: "API surchargée. Réessayez." });
    }
    return res.status(500).json({ error: msg });
  }
}
