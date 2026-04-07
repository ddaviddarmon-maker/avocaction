// pages/api/chat.js
// Version 4 — Deux appels séparés : recherche PUIS formatage JSON
// Fiable : Claude ne mélange plus recherche web et formatage JSON

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_BASE = `Tu es AVOCACTION, un agent IA spécialisé en droit de la consommation français 
et en actions de groupe (loi n° 2025-391 du 30 avril 2025).

Points de droit clés :
- Prescription produit : 2 ans (Art. L217-4 C. conso) à partir de la livraison
- Prescription faits : 5 ans (Art. 2224 C. civil) à partir de la connaissance du dommage
- Associations agréées OU existant depuis 2 ans avec activité réelle peuvent représenter les victimes
- Délai d'adhésion au groupe : 2 mois à 5 ans selon le jugement
- Règlement EU 261/2004 pour transport aérien
- RGPD Art. 17 pour droit à l'effacement

Ton ton est bienveillant, précis, sans jargon inutile.`;

// Détecte si le message contient un prompt d'analyse finale (buildPrompt)
function isAnalysisPrompt(messages) {
  const lastMsg = messages[messages.length - 1];
  if (!lastMsg) return false;
  const content = typeof lastMsg.content === "string" ? lastMsg.content : "";
  return content.includes("ÉTAPE 1 OBLIGATOIRE") || content.includes("Retourne UNIQUEMENT ce JSON");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages requis" });
    }

    // ── CAS 1 : Prompt d'analyse finale → 2 appels ───────
    if (isAnalysisPrompt(messages)) {
      const lastMsg = messages[messages.length - 1];
      const promptContent = typeof lastMsg.content === "string" ? lastMsg.content : "";

      // Extraire entreprise + problème du prompt pour la recherche
      const entrepriseMatch = promptContent.match(/entreprise[^:]*:\s*([^\n]+)/i);
      const entreprise = entrepriseMatch ? entrepriseMatch[1].trim() : "";

      // ── APPEL 1 : Recherche web ───────────────────────
      let searchResults = "";
      if (entreprise && entreprise !== "Producteur inconnu") {
        try {
          const searchResponse = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 1500,
            system: "Tu es un assistant de recherche juridique. Cherche des informations factuelles et retourne un résumé structuré de ce que tu trouves.",
            messages: [{
              role: "user",
              content: `Recherche sur le web les informations suivantes et retourne un résumé factuel :
1. Actions de groupe contre "${entreprise}" en France (en cours ou passées)
2. Condamnations ou sanctions de "${entreprise}" par des tribunaux français ou la CNIL (2020-2025)
3. Associations de consommateurs (UFC-Que Choisir, Familles Rurales, etc.) ayant agi contre "${entreprise}"
4. Témoignages collectifs de consommateurs contre "${entreprise}"

Retourne UNIQUEMENT les faits trouvés, sans interprétation.`
            }],
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            tool_choice: { type: "auto" },
          });

          for (const block of searchResponse.content) {
            if (block.type === "text") {
              searchResults = block.text;
            }
          }
        } catch (searchErr) {
          console.error("[search step error]", searchErr.message);
          searchResults = "Recherche web indisponible.";
        }
      }

      // ── APPEL 2 : Formatage JSON ──────────────────────
      // On injecte les résultats de recherche dans le prompt
      const enrichedPrompt = promptContent.replace(
        "ÉTAPE 1 OBLIGATOIRE — RECHERCHE WEB AVANT TOUT SCORING",
        `RÉSULTATS DE RECHERCHE WEB (déjà effectuée) :
${searchResults || "Aucun résultat trouvé."}

ÉTAPE 1 COMPLÉTÉE — UTILISE CES RÉSULTATS POUR SCORER`
      );

      const jsonResponse = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        temperature: 0,
        system: system || SYSTEM_BASE,
        messages: [{ role: "user", content: enrichedPrompt }],
        // Pas de web_search ici → Claude se concentre sur le JSON
      });

      let finalText = "";
      for (const block of jsonResponse.content) {
        if (block.type === "text") {
          finalText = block.text;
        }
      }

      return res.status(200).json({
        content: [{ type: "text", text: finalText }],
        reply: finalText,
      });
    }

    // ── CAS 2 : Conversation normale (identification producteur, etc.) ──
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      temperature: 0,
      system: system || SYSTEM_BASE,
      messages,
    });

    let finalText = "";
    for (const block of response.content) {
      if (block.type === "text") {
        finalText = block.text;
      }
    }

    if (!finalText) {
      finalText = "Je n'ai pas pu traiter votre demande. Veuillez réessayer.";
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
