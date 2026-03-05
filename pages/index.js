// pages/index.js
import Head from "next/head";
import AgentChat from "../components/AgentChat";

const C = { gold: "#C9A84C", goldLight: "#E8C96A", cream: "#F5F0E8", navy: "#0A1628" };

export default function Home() {
  return (
    <>
      <Head>
        <title>AVOCACTION — Agent IA Droit de la Consommation</title>
        <meta name="description" content="Analysez votre situation juridique et découvrez si vous pouvez rejoindre une action de groupe en droit de la consommation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.navy} 0%, #0F2040 50%, #162840 100%)`,
        fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Ambient background */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(201,168,76,0.05) 0%, transparent 50%)`,
        }} />

        {/* Header */}
        <header style={{
          width: "100%", padding: "18px 40px",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(10,22,40,0.8)", backdropFilter: "blur(10px)",
          position: "sticky", top: 0, zIndex: 100, boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "8px",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
            }}>⚖️</div>
            <div>
              <div style={{ color: "white", fontSize: "22px", fontWeight: 700, letterSpacing: "2px" }}>AVOCACTION</div>
              <div style={{ color: C.gold, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase" }}>Agent IA — Droit de la Consommation</div>
            </div>
          </div>
          <div style={{
            background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: "20px", padding: "6px 14px", color: C.gold, fontSize: "12px", letterSpacing: "1px",
          }}>
            🔒 Confidentiel & Sécurisé
          </div>
        </header>

        {/* Main content */}
        <main style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto", padding: "40px 20px", boxSizing: "border-box" }}>
          <AgentChat />
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: "center", padding: "30px 20px",
          color: "rgba(245,240,232,0.25)", fontSize: "12px",
          borderTop: "1px solid rgba(201,168,76,0.08)", position: "relative", zIndex: 1,
        }}>
          © {new Date().getFullYear()} AVOCACTION — Cabinet juridique spécialisé en actions de groupe<br />
          <span style={{ fontSize: "11px" }}>Les informations fournies ne constituent pas un conseil juridique et ne remplacent pas la consultation d'un avocat.</span>
        </footer>
      </div>
    </>
  );
}
