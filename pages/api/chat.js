// pages/api/chat.js — Version finale stable

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Tu es AVOCACTION, agent IA spécialisé en droit de la consommation français et actions de groupe (loi 2025-391).
Points de droit : prescription produit 2 ans (Art. L217-4), prescription faits 5 ans (Art. 2224 C. civil), règlement EU 261/2004, RGPD Art. 17.
Ton ton est bienveillant et précis.`;

function getLastText(content) {
  let text = "";
  for (const block of content) {
    if (block.type === "text") text = block.text;
  }
  return text;
}

function looksLikeJSON(text) {
  const t = text.trim();
  return t.startsWith("{") && t.includes('"scores"');
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { messages, system } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "messages requis" });

    const lastContent = messages[messages.length - 1]?.content || "";
    const isAnalysis = typeof lastContent === "string" && lastContent.includes("Retourne UNIQUEMENT ce JSON");

    // ── Appel principal ────────────────────────────────────
    const mainResp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: system || SYSTEM,
      messages,
      ...(isAnalysis ? {
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        tool_choice: { type: "auto" },
      } : {}),
    });

    let finalText = getLastText(mainResp.content);

    // ── Si analyse mais pas de JSON → 2e appel pour formater ──
    if (isAnalysis && !looksLikeJSON(finalText)) {
      const formatResp = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2500,
        system: system || SYSTEM,
        messages: [
          ...messages,
          { role: "assistant", content: mainResp.content },
          {
            role: "user",
            content: `Parfait. Maintenant, en te basant sur ton analyse ci-dessus, 
retourne UNIQUEMENT le JSON demandé dans le prompt initial.
Ta réponse doit commencer par { et se terminer par }.
Aucun texte avant ou après le JSON.`,
          },
        ],
      });
      finalText = getLastText(formatResp.content);
    }

    if (!finalText) finalText = "Analyse indisponible. Veuillez réessayer.";

    return res.status(200).json({ reply: finalText, content: [{ type: "text", text: finalText }] });

  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: err.message || "Erreur inconnue" });
  }
}
