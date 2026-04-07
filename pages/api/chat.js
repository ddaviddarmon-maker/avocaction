// pages/api/chat.js
// Version 5 — Deux étapes propres : search séparé, JSON sans tools

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_BASE = `Tu es AVOCACTION, un agent IA spécialisé en droit de la consommation français 
et en actions de groupe (loi n° 2025-391 du 30 avril 2025).
Points de droit : prescription produit 2 ans (Art. L217-4), prescription faits 5 ans (Art. 2224 C. civil),
règlement EU 261/2004 transport aérien, RGPD Art. 17.
Ton ton est bienveillant et précis.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages requis" });
    }

    const lastContent = messages[messages.length - 1]?.content || "";
    const isAnalysis = typeof lastContent === "string" && 
      lastContent.includes("Retourne UNIQUEMENT ce JSON");

    // ── CAS ANALYSE FINALE : 2 étapes ─────────────────────
    if (isAnalysis) {

      // Extraire l'entreprise du prompt
      const entrepriseMatch = lastContent.match(/- entreprise\s*:\s*(.+)/i);
      const entreprise = entrepriseMatch ? entrepriseMatch[1].trim() : "";

      // ÉTAPE 1 — Recherche web séparée
      let searchSummary = "Aucune information trouvée.";
      if (entreprise && entreprise !== "Producteur inconnu") {
        try {
          const searchResp = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 800,
            system: "Tu es un assistant de recherche. Résume UNIQUEMENT les faits trouvés sur le web, en bullet points courts.",
            messages: [{
              role: "user",
              content: `Recherche et résume en bullet points :
- Actions de groupe contre "${entreprise}" en France
- Condamnations/sanctions de "${entreprise}" par tribunaux ou CNIL
- Associations de consommateurs ayant agi contre "${entreprise}"
Sois factuel, bref, cite les sources.`
            }],
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            tool_choice: { type: "auto" },
          });
          for (const block of searchResp.content) {
            if (block.type === "text" && block.text.length > 50) {
              searchSummary = block.text;
            }
          }
        } catch (e) {
          console.error("Search error:", e.message);
        }
      }

      // ÉTAPE 2 — Génération JSON sans web_search
      // On remplace les instructions de recherche par les résultats réels
      const cleanedPrompt = lastContent
        .replace(/═+[\s\S]*?═+/g, "") // retire les blocs ═══
        .replace(/ÉTAPE 1[\s\S]*?ÉTAPE 2/g, `RÉSULTATS DE RECHERCHE WEB :\n${searchSummary}\n\nINSTRUCTION :`);

      const finalPrompt = cleanedPrompt + `

IMPORTANT : Ta réponse doit être UNIQUEMENT le JSON ci-dessus rempli.
Commence par { et termine par }. Aucun texte avant ou après.
Base les scores sur les résultats de recherche fournis.`;

      const jsonResp = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2500,
        system: system || SYSTEM_BASE,
        messages: [{ role: "user", content: finalPrompt }],
        // PAS de web_search ici — Claude doit juste produire le JSON
      });

      let finalText = "";
      for (const block of jsonResp.content) {
        if (block.type === "text") finalText = block.text;
      }

      return res.status(200).json({ reply: finalText, content: [{ type: "text", text: finalText }] });
    }

    // ── CAS CONVERSATION NORMALE ────────────────────────────
    const convResp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: system || SYSTEM_BASE,
      messages,
    });

    let finalText = "";
    for (const block of convResp.content) {
      if (block.type === "text") finalText = block.text;
    }

    return res.status(200).json({ reply: finalText, content: [{ type: "text", text: finalText }] });

  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: err.message || "Erreur inconnue" });
  }
}
