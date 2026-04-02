// components/AgentChat.js
// Version 2 — Recherche web toujours active + indicateur de recherche
import { useState, useEffect, useRef } from "react";
import ScoreCard from "./ScoreCard";

const C = {
  navy: "#0A1628",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  cream: "#F5F0E8",
  gray: "#8A8F9E",
};

// ── Indicateur de frappe ──────────────────────────────────────────
function TypingIndicator({ isSearching }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <div style={avatarStyle(false)}>⚖️</div>
        <div style={{ ...bubbleStyle(false), padding: "14px 18px" }}>
          {isSearching ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "16px", height: "16px", border: `2px solid ${C.gold}`,
                borderTopColor: "transparent", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              <span style={{ color: C.gold, fontSize: "13px", letterSpacing: "0.5px" }}>
                Recherche d'actions de groupe en cours…
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: C.gold,
                  animation: `bounce 1.2s infinite ${i * 0.2}s`,
                }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function avatarStyle(isUser) {
  return {
    width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
    background: isUser
      ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`
      : "rgba(201,168,76,0.2)",
    border: isUser ? "none" : "1px solid rgba(201,168,76,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", marginTop: "4px",
  };
}

function bubbleStyle(isUser) {
  return {
    maxWidth: "78%",
    padding: "14px 18px",
    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    background: isUser
      ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`
      : "rgba(255,255,255,0.07)",
    color: isUser ? C.navy : C.cream,
    fontSize: "15px", lineHeight: "1.6",
    border: isUser ? "none" : "1px solid rgba(255,255,255,0.1)",
    fontWeight: isUser ? 500 : 400,
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    whiteSpace: "pre-wrap",
  };
}

// ── Détecte si Claude est en train de chercher (mots clés dans le texte) ──
function detectSearchPhase(text) {
  if (!text) return false;
  const searchKeywords = [
    "recherche", "vérifi", "cherche", "web_search", "action de groupe",
    "recours collectif", "j'ai trouvé", "selon mes recherches"
  ];
  return searchKeywords.some(k => text.toLowerCase().includes(k));
}

// ── Parse le JSON d'analyse ───────────────────────────────────────
function parseAnalysis(text) {
  try {
    const match = text.match(/\{[\s\S]*?"analyse_complete"[\s\S]*?\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return null;
}

// ── Nettoie le texte affiché (retire le JSON brut) ───────────────
function cleanDisplayText(text) {
  return text.replace(/\{[\s\S]*?"analyse_complete"[\s\S]*?\}/, "").trim();
}

export default function AgentChat() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [started, setStarted] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Appel API ─────────────────────────────────────────────────
  async function callApi(msgs) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur serveur");
    return data.reply;
  }

  // ── Démarrage ─────────────────────────────────────────────────
  async function startConversation() {
    setStarted(true);
    setLoading(true);

    const initMsgs = [{
      role: "user",
      content: "Bonjour, je souhaite savoir si ma situation me permet de rejoindre une action de groupe en droit de la consommation.",
    }];
    setHistory(initMsgs);

    try {
      const reply = await callApi(initMsgs);
      const display = cleanDisplayText(reply);
      setMessages([{ role: "assistant", content: display }]);
      setHistory([...initMsgs, { role: "assistant", content: reply }]);
    } catch {
      const fallback = "Bonjour ! Je suis l'agent AVOCACTION. Pouvez-vous me décrire le problème que vous avez rencontré en tant que consommateur ? (nom de l'entreprise, type de problème, date approximative)";
      setMessages([{ role: "assistant", content: fallback }]);
    }
    setLoading(false);
  }

  // ── Envoi de message ──────────────────────────────────────────
  async function sendMessage() {
    if (!input.trim() || loading) return;

    const text = input.trim();
    setInput("");

    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);

    const newMsgs = [...messages, { role: "user", content: text }];
    const newHistory = [...history, { role: "user", content: text }];
    setMessages(newMsgs);
    setHistory(newHistory);
    setLoading(true);

    // Après le 2e message utilisateur → Claude va probablement chercher
    if (newCount >= 2) {
      setIsSearching(true);
    }

    try {
      const reply = await callApi(newHistory);
      setIsSearching(false);

      const parsed = parseAnalysis(reply);
      let display = reply;

      if (parsed) {
        display = cleanDisplayText(reply) || "Voici l'analyse complète de votre situation basée sur mes recherches :";
        setAnalysis(parsed);
      }

      setMessages([...newMsgs, { role: "assistant", content: display }]);
      setHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch (e) {
      setIsSearching(false);
      setMessages([...newMsgs, {
        role: "assistant",
        content: "Une erreur est survenue. Veuillez réessayer.",
      }]);
    }
    setLoading(false);
  }

  function restart() {
    setMessages([]);
    setHistory([]);
    setAnalysis(null);
    setStarted(false);
    setInput("");
    setUserMessageCount(0);
    setIsSearching(false);
  }

  // ── Écran d'accueil ───────────────────────────────────────────
  if (!started) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", animation: "fadeInDown 0.8s ease" }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>⚖️</div>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: 300, marginBottom: "16px", lineHeight: 1.3 }}>
          Votre situation mérite<br />
          <span style={{ color: C.gold, fontWeight: 700 }}>une analyse juridique</span>
        </h1>
        <p style={{ color: "rgba(245,240,232,0.65)", fontSize: "16px", maxWidth: "520px", margin: "0 auto 36px", lineHeight: 1.7 }}>
          Notre agent IA analyse votre cas, <strong style={{ color: C.goldLight }}>recherche les actions de groupe existantes sur le web</strong> et évalue vos chances de recours collectif en droit de la consommation.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "40px", flexWrap: "wrap" }}>
          {[
            "🔍 Recherche web en temps réel",
            "⚖️ Analyse juridique précise",
            "📊 Scoring basé sur données réelles",
            "⏰ Veille prescription"
          ].map((f) => (
            <div key={f} style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "8px", padding: "8px 14px",
              color: C.gold, fontSize: "13px",
            }}>
              {f}
            </div>
          ))}
        </div>

        <button
          onClick={startConversation}
          style={{
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            border: "none", borderRadius: "14px", padding: "16px 40px",
            color: C.navy, fontSize: "16px", fontWeight: 700, cursor: "pointer",
            letterSpacing: "1px", fontFamily: "inherit",
            boxShadow: "0 8px 30px rgba(201,168,76,0.3)",
          }}
        >
          Commencer l'analyse →
        </button>

        <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px", marginTop: "20px" }}>
          🔒 Vos données restent confidentielles
        </p>
      </div>
    );
  }

  // ── Interface chat ─────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Chat */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: "16px", overflow: "hidden",
        backdropFilter: "blur(10px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 22px",
          background: "rgba(201,168,76,0.08)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: isSearching ? C.gold : "#4CAF50",
              boxShadow: isSearching ? `0 0 8px ${C.gold}` : "0 0 8px #4CAF50",
              animation: "pulse 2s infinite",
            }} />
            <span style={{ color: C.cream, fontSize: "14px", letterSpacing: "1px", fontFamily: "inherit" }}>
              Agent AVOCACTION — Entretien juridique confidentiel
            </span>
          </div>

          {/* Badge recherche active */}
          {isSearching && (
            <div style={{
              background: "rgba(201,168,76,0.15)",
              border: `1px solid ${C.gold}`,
              borderRadius: "6px", padding: "4px 10px",
              color: C.gold, fontSize: "11px", letterSpacing: "0.5px",
            }}>
              🔍 Recherche web active
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{
          height: "440px", overflowY: "auto", padding: "22px",
          display: "flex", flexDirection: "column", gap: "16px",
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                animation: "fadeInUp 0.3s ease",
              }}
            >
              <div style={{
                display: "flex", gap: "10px",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
              }}>
                <div style={avatarStyle(msg.role === "user")}>
                  {msg.role === "user" ? "👤" : "⚖️"}
                </div>
                <div style={bubbleStyle(msg.role === "user")}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && <TypingIndicator isSearching={isSearching} />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "14px 18px",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          display: "flex", gap: "10px", alignItems: "flex-end",
          background: "rgba(0,0,0,0.2)",
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Décrivez votre situation… (Entrée pour envoyer)"
            rows={1}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,168,76,0.25)",
              borderRadius: "12px", padding: "12px 16px",
              color: C.cream, fontSize: "15px",
              fontFamily: "inherit", resize: "none",
              minHeight: "44px", maxHeight: "120px", lineHeight: "1.5",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              background: (!input.trim() || loading)
                ? "rgba(201,168,76,0.3)"
                : `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              border: "none", borderRadius: "12px",
              width: "48px", height: "48px",
              cursor: (!input.trim() || loading) ? "not-allowed" : "pointer",
              fontSize: "18px", flexShrink: 0,
            }}
          >
            ➤
          </button>
        </div>
      </div>

      {/* Score Card */}
      {analysis && <ScoreCard data={analysis} />}

      {/* Restart */}
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <button
          onClick={restart}
          style={{
            background: "transparent",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: "10px", padding: "10px 20px",
            color: C.gold, fontSize: "14px", cursor: "pointer",
            letterSpacing: "1px", fontFamily: "inherit",
          }}
        >
          ↺ Nouvelle analyse
        </button>
      </div>
    </>
  );
}
