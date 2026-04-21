"use client";
import { useState, useRef, useEffect } from "react";

// ── Nouvelle charte graphique (logo bleu) ─────────────────
const C = {
  navy:    "#0B1A3E",
  navyDark:"#071230",
  navyMid: "#1A2D5A",
  blue:    "#4DB8E8",
  blueMid: "#2A8FBF",
  blueLight:"#7ACFEF",
  cream:   "#E8F4FB",
  gray:    "#8BBDD9",
  grayMid: "#4A6A8A",
  white:   "#FFFFFF",
  green:   "#2D7D4E",
  amber:   "#C9A84C",
  red:     "#C0392B",
};

// ── Logo SVG ──────────────────────────────────────────────
function Logo({ size = 32, withText = true, onClick }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <path d="M25 22 Q50 10 75 22" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <text x="50" y="68" textAnchor="middle" fontFamily="Palatino Linotype, serif" fontSize="62" fontWeight="bold" fill={C.blue}>A</text>
        <path d="M25 78 Q50 90 75 78" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
      {withText && (
        <span style={{ fontSize: size * 0.6, fontFamily:"Palatino Linotype, serif", fontWeight:"bold", color:C.white, letterSpacing: size * 0.07 }}>
          AVOCACTION
        </span>
      )}
    </div>
  );
}

// ── Navigation ────────────────────────────────────────────
function Nav({ activeTab, setActiveTab, onReset }) {
  return (
    <div style={{ background:C.navy, borderBottom:`2px solid ${C.blue}`, padding:"0 40px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, boxShadow:"0 2px 20px rgba(0,0,0,0.3)" }}>
      <Logo size={34} onClick={() => { setActiveTab("analyse"); onReset(); }} />
      <div style={{ display:"flex", gap:2 }}>
        {[
          { id:"analyse",  label:"Lancer une analyse" },
          { id:"equipe",   label:"Qui sommes-nous" },
          { id:"dossier",  label:"Suivre mon dossier" },
          { id:"cabinet",  label:"Entrée cabinet" },
        ].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === "analyse") onReset(); }}
            style={{ padding:"16px 16px", background:"transparent", border:"none", cursor:"pointer",
              fontSize:13, fontFamily:"Calibri, sans-serif", letterSpacing:"0.3px",
              color: activeTab === tab.id ? C.blue : C.gray,
              borderBottom: activeTab === tab.id ? `3px solid ${C.blue}` : "3px solid transparent",
              marginBottom:"-2px", transition:"all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────
function Footer() {
  return (
    <div style={{ background:C.navyDark, borderTop:`1px solid ${C.navyMid}`, padding:"16px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <Logo size={20} withText={false} />
        <span style={{ fontSize:11, color:C.grayMid, fontFamily:"Calibri, sans-serif" }}>
          © 2025 Avocaction — Outil d'information juridique, pas de conseil juridique
        </span>
      </div>
      <div style={{ display:"flex", gap:20 }}>
        {[
          { label:"Mentions légales", href:"/mentions-legales" },
          { label:"CGU", href:"/cgu" },
          { label:"Confidentialité", href:"/rgpd" },
          { label:"Contact", href:"mailto:d.darmon@eleve-efb.fr" },
        ].map(l => (
          <a key={l.href} href={l.href} style={{ fontSize:11, color:C.grayMid, fontFamily:"Calibri, sans-serif", textDecoration:"none", transition:"color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color=C.blue}
            onMouseLeave={e => e.currentTarget.style.color=C.grayMid}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE : QUI SOMMES-NOUS
// ═══════════════════════════════════════════════════════════
const TEAM = [
  { nom:"David Darmon",   role:"Fondateur & Développeur", desc:"Étudiant à l'EFB, porteur du projet AVOCACTION. Combine droit et technologie pour rendre la justice accessible." },
  { nom:"Mathieu",        role:"Juriste",                 desc:"Spécialiste en droit de la consommation et actions de groupe." },
  { nom:"Célia",          role:"Juriste",                 desc:"Experte en droit européen de la consommation." },
  { nom:"Yasmine",        role:"Juriste",                 desc:"Droit des contrats et responsabilité civile." },
  { nom:"Fatouma",        role:"Juriste",                 desc:"Droit processuel et procédures collectives." },
  { nom:"Alice",          role:"Juriste",                 desc:"Droit numérique et RGPD." },
];

function PageEquipe() {
  return (
    <div style={{ flex:1, background:"#F0F6FA", padding:"60px 40px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <Logo size={52} withText={false} />
          </div>
          <h1 style={{ fontSize:34, color:C.navy, fontFamily:"Palatino Linotype, serif", marginBottom:14 }}>Notre équipe</h1>
          <p style={{ fontSize:15, color:"#4A6A8A", fontFamily:"Calibri, sans-serif", maxWidth:560, margin:"0 auto", lineHeight:1.8 }}>
            AVOCACTION est né de la conviction que la justice collective doit être accessible à tous.
            Notre équipe combine expertise juridique et innovation technologique.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20, marginBottom:48 }}>
          {TEAM.map((m, i) => (
            <div key={i} style={{ background:C.white, border:`1px solid #D0E4F0`, borderRadius:14, padding:"28px 24px", display:"flex", flexDirection:"column", gap:12, boxShadow:"0 2px 12px rgba(11,26,62,0.07)", transition:"transform 0.2s", cursor:"default" }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:C.blue, fontFamily:"Palatino Linotype, serif", fontWeight:"bold" }}>
                {m.nom[0]}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif" }}>{m.nom}</div>
                <div style={{ fontSize:11, color:C.blue, fontFamily:"Calibri, sans-serif", marginTop:3, textTransform:"uppercase", letterSpacing:1.2 }}>{m.role}</div>
              </div>
              <p style={{ fontSize:13, color:"#4A6A8A", fontFamily:"Calibri, sans-serif", lineHeight:1.7, margin:0 }}>{m.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ background:C.navy, borderRadius:16, padding:"36px 48px", textAlign:"center", border:`1px solid ${C.navyMid}` }}>
          <div style={{ fontSize:11, color:C.blue, fontFamily:"Calibri, sans-serif", letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>Notre mission</div>
          <p style={{ fontSize:17, color:C.cream, fontFamily:"Palatino Linotype, serif", lineHeight:1.9, maxWidth:620, margin:"0 auto" }}>
            La force du nombre au service de vos droits.
          </p>
          <p style={{ fontSize:11, color:C.grayMid, fontFamily:"Calibri, sans-serif", marginTop:16 }}>
            Loi n° 2025-391 du 30 avril 2025 · Actions de groupe
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE : SUIVRE MON DOSSIER
// ═══════════════════════════════════════════════════════════
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZWdsY2ZjaWVtbGtmdXB6endzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjA1NTEsImV4cCI6MjA4OTMzNjU1MX0.yVoMTqn3o2FdXgSCYLiBenKkVX09JK8hQHOn_li_Vbk";
const SB_URL  = "https://jmeglcfciemlkfupzzws.supabase.co";

function PageDossier() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dossier, setDossier] = useState(null);

  async function login() {
    if (!email.trim() || !password.trim()) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${SB_URL}/rest/v1/dossiers?email=eq.${encodeURIComponent(email.trim())}&select=*&order=created_at.desc&limit=1`,
        { headers: { apikey: ANON_KEY, Authorization:`Bearer ${ANON_KEY}` } });
      const data = await res.json();
      if (!data || data.length === 0) { setError("Aucun dossier trouvé pour cet email."); setLoading(false); return; }
      const d = data[0];
      if (d.user_password !== password) { setError("Mot de passe incorrect."); setLoading(false); return; }
      setDossier(d);
    } catch { setError("Erreur de connexion. Réessayez."); }
    setLoading(false);
  }

  if (dossier) {
    const a = dossier.analyse_json || {};
    const sc = (v) => v >= 75 ? C.green : v >= 50 ? C.amber : C.red;
    return (
      <div style={{ flex:1, background:C.navy, padding:"32px 40px" }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <h2 style={{ color:C.blue, fontFamily:"Palatino Linotype, serif", fontSize:22 }}>Mon dossier</h2>
            <button onClick={() => setDossier(null)} style={{ background:"transparent", border:`1px solid ${C.navyMid}`, color:C.gray, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, fontFamily:"Calibri, sans-serif" }}>← Déconnexion</button>
          </div>
          <div style={SD.card}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontFamily:"Calibri, sans-serif", marginBottom:8 }}>Dossier créé le {new Date(dossier.created_at).toLocaleDateString("fr-FR")}</div>
            <div style={{ fontSize:17, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif" }}>{a.entreprise || dossier.entreprise}</div>
            <p style={{ fontSize:14, color:"#374151", lineHeight:1.7, fontFamily:"Calibri, sans-serif", margin:"8px 0 0" }}>{a.resume}</p>
          </div>
          {a.scores && (
            <div style={SD.card}>
              <div style={{ fontSize:14, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif", marginBottom:14 }}>
                Score de faisabilité — <span style={{ color:sc(a.scores.global) }}>{a.scores.global}/100</span>
              </div>
              {[{l:"Compatibilité externe",k:"compatibilite"},{l:"Similarité interne",k:"similarite"},{l:"Faisabilité collective",k:"faisabilite"}].map(({l,k}) => (
                <div key={k} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:12, color:"#6B7280", fontFamily:"Calibri, sans-serif" }}>{l}</span>
                    <span style={{ fontSize:12, fontWeight:"bold", color:sc(a.scores[k]) }}>{a.scores[k]}/100</span>
                  </div>
                  <div style={{ height:7, background:"#E5E7EB", borderRadius:4 }}>
                    <div style={{ height:"100%", width:`${a.scores[k]}%`, background:sc(a.scores[k]), borderRadius:4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {a.action_groupe && (
            <div style={SD.card}>
              <div style={{ fontSize:13, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif", marginBottom:8 }}>⚖️ Action de groupe — <span style={{ color: a.action_groupe.potentiel==="élevé" ? C.green : C.amber }}>Potentiel {a.action_groupe.potentiel}</span></div>
              <p style={{ fontSize:13, color:"#6B7280", lineHeight:1.6, fontFamily:"Calibri, sans-serif", margin:0 }}>{a.action_groupe.message}</p>
            </div>
          )}
          {a.recommandation && (
            <div style={{ ...SD.card, background:C.navy, border:`1px solid ${C.blue}` }}>
              <div style={{ fontSize:13, fontWeight:"bold", color:C.blue, fontFamily:"Palatino Linotype, serif", marginBottom:8 }}>💡 Recommandation</div>
              <p style={{ fontSize:14, color:C.cream, lineHeight:1.7, fontFamily:"Calibri, sans-serif", margin:0 }}>{a.recommandation}</p>
            </div>
          )}
          {a.etapes && (
            <div style={SD.card}>
              <div style={{ fontSize:13, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif", marginBottom:12 }}>🎯 Prochaines étapes</div>
              {a.etapes.map((e, i) => (
                <div key={i} style={{ display:"flex", gap:12, marginBottom:10 }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background:C.navy, color:C.blue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:"bold", flexShrink:0 }}>{i+1}</div>
                  <p style={{ fontSize:13, color:"#374151", lineHeight:1.6, fontFamily:"Calibri, sans-serif", margin:0, paddingTop:4 }}>{e}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex:1, background:"#F0F6FA", display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
      <div style={{ background:C.white, border:"1px solid #D0E4F0", borderRadius:16, padding:"44px 40px", width:"100%", maxWidth:420, boxShadow:"0 4px 24px rgba(11,26,62,0.1)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <Logo size={44} withText={false} />
          <h2 style={{ fontSize:22, color:C.navy, fontFamily:"Palatino Linotype, serif", marginBottom:8, marginTop:16 }}>Accéder à mon dossier</h2>
          <p style={{ fontSize:13, color:"#4A6A8A", fontFamily:"Calibri, sans-serif", lineHeight:1.5 }}>Connectez-vous avec vos identifiants</p>
        </div>
        {[
          { label:"Email", type:"email", val:email, set:setEmail, placeholder:"votre@email.com" },
          { label:"Mot de passe", type:"password", val:password, set:setPassword, placeholder:"••••••••" },
        ].map(f => (
          <div key={f.label} style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:"bold", color:C.navy, fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:7 }}>{f.label}</label>
            <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              onKeyDown={e => e.key === "Enter" && login()}
              style={{ width:"100%", padding:"12px 14px", border:"1.5px solid #D0E4F0", borderRadius:10, fontSize:14, fontFamily:"Calibri, sans-serif", outline:"none", boxSizing:"border-box", color:C.navy }} />
          </div>
        ))}
        {error && <p style={{ fontSize:12, color:C.red, fontFamily:"Calibri, sans-serif", marginBottom:14 }}>{error}</p>}
        <button onClick={login} disabled={loading}
          style={{ width:"100%", padding:14, background:C.navy, color:C.blue, border:"none", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:"bold", fontFamily:"Palatino Linotype, serif", opacity:loading ? 0.6 : 1, letterSpacing:1 }}>
          {loading ? "Connexion…" : "Accéder à mon dossier →"}
        </button>
      </div>
    </div>
  );
}

const SD = {
  card: { background:C.white, border:"1px solid #E5E7EB", borderRadius:14, padding:"20px 24px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
};

// ═══════════════════════════════════════════════════════════
// PAGE : ENTRÉE CABINET
// ═══════════════════════════════════════════════════════════
const CABINET_USERS = { Admin:"Admin", Cab1:"Cab1" };

function PageCabinet() {
  const [loginVal, setLoginVal]  = useState("");
  const [password, setPassword]  = useState("");
  const [error, setError]        = useState("");
  const [user, setUser]          = useState(null);
  const [dossiers, setDossiers]  = useState([]);
  const [loading, setLoading]    = useState(false);
  const [search, setSearch]      = useState("");
  const [selected, setSelected]  = useState(null);

  async function doLogin() {
    if (CABINET_USERS[loginVal] !== password) { setError("Identifiants incorrects."); return; }
    setError(""); setLoading(true); setUser(loginVal);
    try {
      const res = await fetch(`${SB_URL}/rest/v1/dossiers?select=*&order=created_at.desc`,
        { headers: { apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}` } });
      const data = await res.json();
      setDossiers(Array.isArray(data) ? data : []);
    } catch { setDossiers([]); }
    setLoading(false);
  }

  if (!user) {
    return (
      <div style={{ flex:1, background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
        <div style={{ background:C.navyMid, border:`1px solid ${C.navyMid}`, borderRadius:16, padding:"44px 40px", width:"100%", maxWidth:380, boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <Logo size={44} withText={false} />
            <h2 style={{ fontSize:22, color:C.blue, fontFamily:"Palatino Linotype, serif", marginBottom:6, marginTop:16 }}>Espace cabinet</h2>
            <p style={{ fontSize:12, color:C.grayMid, fontFamily:"Calibri, sans-serif" }}>Accès réservé</p>
          </div>
          {[
            { label:"Identifiant", type:"text", val:loginVal, set:setLoginVal, placeholder:"Admin ou Cab1" },
            { label:"Mot de passe", type:"password", val:password, set:setPassword, placeholder:"••••••••" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom:18 }}>
              <label style={{ fontSize:11, fontWeight:"bold", color:C.gray, fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:7 }}>{f.label}</label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                onKeyDown={e => e.key === "Enter" && doLogin()}
                style={{ width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.06)", border:`1px solid ${C.navyMid}`, borderRadius:10, fontSize:14, fontFamily:"Calibri, sans-serif", outline:"none", color:C.cream, boxSizing:"border-box" }} />
            </div>
          ))}
          {error && <p style={{ fontSize:12, color:C.red, fontFamily:"Calibri, sans-serif", marginBottom:14 }}>{error}</p>}
          <button onClick={doLogin}
            style={{ width:"100%", padding:14, background:C.blue, color:C.navy, border:"none", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:"bold", fontFamily:"Palatino Linotype, serif", letterSpacing:1 }}>
            Entrer →
          </button>
        </div>
      </div>
    );
  }

  const filtered = dossiers.filter(d => !search ||
    (d.entreprise||"").toLowerCase().includes(search.toLowerCase()) ||
    (d.email||"").toLowerCase().includes(search.toLowerCase()) ||
    (d.probleme||"").toLowerCase().includes(search.toLowerCase()));
  const sc = v => !v ? "#9CA3AF" : v>=75 ? C.green : v>=50 ? C.amber : C.red;

  return (
    <div style={{ flex:1, background:C.navy, padding:"24px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h2 style={{ color:C.blue, fontFamily:"Palatino Linotype, serif", fontSize:22, marginBottom:4 }}>Base cabinet — {user}</h2>
          <p style={{ fontSize:12, color:C.grayMid, fontFamily:"Calibri, sans-serif" }}>{dossiers.length} dossier{dossiers.length>1?"s":""} au total</p>
        </div>
        <button onClick={() => { setUser(null); setDossiers([]); setSelected(null); setLoginVal(""); setPassword(""); }}
          style={{ background:"transparent", border:`1px solid ${C.navyMid}`, color:C.gray, borderRadius:8, padding:"7px 16px", cursor:"pointer", fontSize:12, fontFamily:"Calibri, sans-serif" }}>
          Déconnexion
        </button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par entreprise, email, problème…"
        style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.05)", border:`1px solid ${C.navyMid}`, borderRadius:10, fontSize:13, fontFamily:"Calibri, sans-serif", outline:"none", color:C.cream, marginBottom:16, boxSizing:"border-box" }} />
      {loading ? (
        <div style={{ color:C.blue, fontFamily:"Calibri, sans-serif", fontSize:14, textAlign:"center", padding:40 }}>Chargement…</div>
      ) : filtered.length === 0 ? (
        <div style={{ color:C.grayMid, fontFamily:"Calibri, sans-serif", fontSize:14, textAlign:"center", padding:40 }}>Aucun dossier.</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap:12 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:"calc(100vh - 240px)", overflowY:"auto", paddingRight:4 }}>
            {filtered.map((d, i) => (
              <div key={i} onClick={() => setSelected(selected?.id===d.id ? null : d)}
                style={{ background: selected?.id===d.id ? C.navyMid : "rgba(255,255,255,0.04)", border:`1px solid ${selected?.id===d.id ? C.blue : C.navyMid}`, borderRadius:10, padding:"14px 16px", cursor:"pointer", transition:"all 0.15s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <span style={{ fontSize:14, fontWeight:"bold", color:C.cream, fontFamily:"Palatino Linotype, serif" }}>{d.entreprise||"—"}</span>
                  <span style={{ fontSize:12, fontWeight:"bold", color:sc(d.score_global) }}>{d.score_global ? `${d.score_global}/100` : "—"}</span>
                </div>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  <span style={{ fontSize:11, color:C.grayMid, fontFamily:"Calibri, sans-serif" }}>{d.email||"Sans email"}</span>
                  <span style={{ fontSize:11, color:C.grayMid, fontFamily:"Calibri, sans-serif" }}>{new Date(d.created_at).toLocaleDateString("fr-FR")}</span>
                  {d.action_groupe_potentiel && (
                    <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:d.action_groupe_potentiel==="élevé"?"#EAF3DE":"#FAEEDA", color:d.action_groupe_potentiel==="élevé"?C.green:C.amber, fontFamily:"Calibri, sans-serif" }}>
                      {d.action_groupe_potentiel}
                    </span>
                  )}
                </div>
                {d.probleme && <p style={{ fontSize:11, color:C.gray, fontFamily:"Calibri, sans-serif", margin:"5px 0 0", lineHeight:1.4 }}>{d.probleme.slice(0,90)}{d.probleme.length>90?"…":""}</p>}
              </div>
            ))}
          </div>
          {selected && (
            <div style={{ background:C.navyMid, border:`1px solid ${C.navyMid}`, borderRadius:12, padding:20, maxHeight:"calc(100vh - 240px)", overflowY:"auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <span style={{ fontSize:15, fontWeight:"bold", color:C.blue, fontFamily:"Palatino Linotype, serif" }}>{selected.entreprise}</span>
                <button onClick={() => setSelected(null)} style={{ background:"transparent", border:"none", color:C.grayMid, cursor:"pointer", fontSize:18 }}>✕</button>
              </div>
              {[
                { label:"Email",        val:selected.email },
                { label:"Téléphone",    val:selected.telephone },
                { label:"Nom",          val:selected.prenom ? `${selected.prenom} ${selected.nom}` : selected.nom },
                { label:"Date des faits", val:selected.date_faits },
                { label:"Montant",      val:selected.montant },
                { label:"Preuves",      val:selected.documents },
                { label:"Prescription", val:selected.prescription_statut },
                { label:"Score global", val:selected.score_global ? `${selected.score_global}/100` : null },
                { label:"Adresse",      val:selected.adresse },
              ].filter(r => r.val).map((r, i) => (
                <div key={i} style={{ marginBottom:10, borderBottom:`1px solid rgba(255,255,255,0.06)`, paddingBottom:10 }}>
                  <div style={{ fontSize:10, color:C.grayMid, fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>{r.label}</div>
                  <div style={{ fontSize:13, color:C.cream, fontFamily:"Calibri, sans-serif" }}>{r.val}</div>
                </div>
              ))}
              {selected.analyse_json?.recommandation && (
                <div style={{ marginTop:8 }}>
                  <div style={{ fontSize:10, color:C.grayMid, fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Recommandation</div>
                  <p style={{ fontSize:12, color:"#C2B89A", fontFamily:"Calibri, sans-serif", lineHeight:1.6, margin:0 }}>{selected.analyse_json.recommandation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ANALYSE — Composants utilitaires
// ═══════════════════════════════════════════════════════════
const STEPS_DEBUT = [
  { id:"cadre", label:"Cadre", question:"Dans quel cadre effectuez-vous cette demande ?",
    options:["Je suis un particulier consommateur","Je suis un petit professionnel (moins de 5 salariés)","Je représente une personne morale non professionnelle (ex : syndicat de copropriétaires)","Je suis un professionnel / une grande entreprise","Je représente une association","Je ne sais pas / autre situation"],
    clarif:{ "Je suis un petit professionnel (moins de 5 salariés)":"Depuis la loi 2025-391, certains petits professionnels peuvent participer si le contrat est hors activité principale. Cet achat était-il lié à votre activité professionnelle principale ?", "Je suis un professionnel / une grande entreprise":"Les actions de groupe sont réservées aux particuliers et petits professionnels. Cet achat était-il réalisé à titre personnel ?", "Je représente une association":"Seules les associations agréées (ou existant depuis 2 ans avec activité réelle) peuvent représenter des consommateurs. Votre association remplit-elle ces conditions ?" } },
  { id:"residence", label:"Résidence", question:"Dans quel pays résidez-vous actuellement ?",
    options:["France","Union européenne","Hors Union européenne","Je préfère ne pas préciser"] },
  { id:"localisation", label:"Lieu achat", question:"Dans quel pays l'achat ou la prestation a-t-elle eu lieu ?",
    options:["France","Union européenne","Hors Union européenne","Achat en ligne","Je ne sais pas"],
    clarif:{ "Hors Union européenne":"La loi française s'applique principalement aux achats en France et dans l'UE. L'entreprise vendeuse est-elle française ou européenne ?" } },
];

const STEPS_FIN = [
  { id:"similaires", label:"Collectif", question:"Savez-vous si d'autres consommateurs ont rencontré le même problème ?", options:["Oui, beaucoup (réseaux sociaux, presse…)","Oui, quelques cas autour de moi","Je pense que oui mais je ne suis pas sûr","Non / Je ne sais pas"] },
  { id:"similaires_source", label:"Source", question:"Comment avez-vous eu connaissance de ces situations similaires ?", options:["Forums internet","Réseaux sociaux","Articles de presse","Associations de consommateurs","Témoignages de proches","Autre"], multiSelect:true, skipIf:(a)=>!a.similaires?.includes("Oui") },
  { id:"prejudice_corpo", label:"Préjudice corporel", question:"Avez-vous subi un préjudice corporel suite à ce problème ?", options:["Oui","Non"] },
  { id:"prejudice_corpo_detail", label:"Type de préjudice", question:"Quel type de préjudice corporel avez-vous subi ?", options:["Blessure légère","Problème de santé / maladie","Hospitalisation","Séquelles durables","Décès d'un proche","Autre"], multiSelect:true, skipIf:(a)=>a.prejudice_corpo!=="Oui" },
  { id:"prejudice_corpo_medical", label:"Suivi médical", question:"Avez-vous consulté un médecin ou été hospitalisé ?", options:["Oui, consultation médicale","Oui, hospitalisation","Non, pas encore consulté","Non, pas nécessaire"], skipIf:(a)=>a.prejudice_corpo!=="Oui" },
  { id:"demarches", label:"Démarches", question:"Avez-vous déjà contacté l'entreprise pour résoudre le problème ?", options:["Oui, ma demande a été refusée","Oui, mais je n'ai pas reçu de réponse","Oui, en cours de traitement","Non, pas encore"] },
  { id:"montant", label:"Montant", question:"Avez-vous une idée du montant financier du préjudice ?", options:["Moins de 50€","Entre 50€ et 300€","Entre 300€ et 1 000€","Plus de 1 000€","Je ne sais pas / préjudice non financier"] },
  { id:"documents", label:"Preuves", question:"Disposez-vous de documents liés à cette situation ?", options:["Facture / preuve d'achat","Contrat ou conditions générales","Échanges avec l'entreprise","Photos / captures d'écran","Documents médicaux","Plusieurs de ces éléments","Aucun document"], multiSelect:true },
  { id:"participation", label:"Action collective", question:"Si d'autres consommateurs sont concernés, seriez-vous prêt à participer à une action collective ?", options:["Oui, tout à fait","Peut-être, selon les informations","Non"], last:true },
];

function ConvDateInput({ placeholder, onSubmit }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ marginTop:8, maxWidth:"80%", display:"flex", gap:8 }}>
      <input style={{ flex:1, padding:"9px 12px", border:`1.5px solid #D0E4F0`, borderRadius:8, fontSize:13, fontFamily:"Calibri, sans-serif", outline:"none", background:"#F0F6FA", color:C.navy }}
        value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder||"JJ/MM/AAAA"}
        onKeyDown={e=>{ if(e.key==="Enter"&&val.trim()) onSubmit(val); }} autoFocus />
      <button onClick={()=>{ if(val.trim()) onSubmit(val); }} disabled={!val.trim()}
        style={{ padding:"9px 14px", background:C.navy, color:C.blue, border:"none", borderRadius:8, cursor:"pointer", fontSize:13, opacity:val.trim()?1:0.4 }}>→</button>
    </div>
  );
}

function ConvMultiSelect({ options, onSubmit }) {
  const [selected, setSelected] = useState([]);
  const toggle = opt => setSelected(prev=>prev.includes(opt)?prev.filter(o=>o!==opt):[...prev,opt]);
  return (
    <div style={{ marginTop:8, maxWidth:"80%", display:"flex", flexDirection:"column", gap:6 }}>
      {options.map((opt,i) => {
        const checked = selected.includes(opt);
        return (
          <button key={i} onClick={()=>toggle(opt)}
            style={{ padding:"9px 14px", background:checked?"#E6F4FB":"#F0F6FA", border:checked?`1.5px solid ${C.blue}`:"1.5px solid #D0E4F0", borderRadius:8, cursor:"pointer", fontSize:13, color:C.navy, textAlign:"left", fontFamily:"Calibri, sans-serif", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ width:18, height:18, borderRadius:4, border:checked?`2px solid ${C.blue}`:"2px solid #D0E4F0", background:checked?C.blue:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.white, fontSize:11, fontWeight:"bold" }}>{checked?"✓":""}</span>
            {opt}
          </button>
        );
      })}
      <button onClick={()=>{ if(selected.length>0) onSubmit(selected.join(", ")); }} disabled={selected.length===0}
        style={{ padding:"9px 14px", background:C.navy, color:C.blue, border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"Calibri, sans-serif", opacity:selected.length>0?1:0.4, marginTop:4 }}>
        Valider ({selected.length}) →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE PRINCIPALE : ANALYSE
// ═══════════════════════════════════════════════════════════
function PageAnalyse({ resetKey }) {
  const [started, setStarted]               = useState(false);
  const [phase, setPhase]                   = useState("debut");
  const [debutIndex, setDebutIndex]         = useState(0);
  const [debutAnswers, setDebutAnswers]     = useState({});
  const [clarif, setClarif]                 = useState(null);
  const [clarifInput, setClarifInput]       = useState("");
  const [conversation, setConversation]     = useState([]);
  const [userInput, setUserInput]           = useState("");
  const [agentLoading, setAgentLoading]     = useState(false);
  const [conversationDone, setConversationDone] = useState(false);
  const [extractedData, setExtractedData]   = useState({});
  const [finIndex, setFinIndex]             = useState(0);
  const [finAnswers, setFinAnswers]         = useState({});
  const [multiSelected, setMultiSelected]   = useState([]);
  const [isLoading, setIsLoading]           = useState(false);
  const [analyse, setAnalyse]               = useState(null);
  // Offres + création de compte
  const [showPricing, setShowPricing]       = useState(false);
  const [selectedOffer, setSelectedOffer]   = useState(null);
  const [accountEmail, setAccountEmail]     = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountError, setAccountError]     = useState("");
  const [accountDone, setAccountDone]       = useState(false);
  const [savedAnalyse, setSavedAnalyse]     = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [conversation, agentLoading]);

  // Reset when parent resets
  useEffect(() => {
    setStarted(false); setPhase("debut"); setDebutIndex(0); setDebutAnswers({});
    setClarif(null); setClarifInput(""); setConversation([]); setUserInput("");
    setAgentLoading(false); setConversationDone(false); setExtractedData({});
    setFinIndex(0); setFinAnswers({}); setMultiSelected([]);
    setIsLoading(false); setAnalyse(null); setShowPricing(false); setSelectedOffer(null);
    setAccountEmail(""); setAccountPassword(""); setAccountError(""); setAccountDone(false); setSavedAnalyse(null);
  }, [resetKey]);

  function extractText(data) {
    if (data.reply) return data.reply;
    if (Array.isArray(data.content)) {
      const blocks = data.content.filter(b=>b.type==="text"&&b.text);
      if (blocks.length>0) return blocks[blocks.length-1].text;
    }
    return data.message||data.text||JSON.stringify(data);
  }

  async function callAPI(messages, system) {
    const body = system ? { messages, system } : { messages };
    const response = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    if (!response.ok) throw new Error(`API ${response.status}`);
    return extractText(await response.json());
  }

  // Création de compte utilisateur
  async function createAccount() {
    if (!accountEmail.trim() || !accountPassword.trim()) { setAccountError("Remplissez tous les champs."); return; }
    if (!accountEmail.includes("@")) { setAccountError("Email invalide."); return; }
    if (accountPassword.length < 4) { setAccountError("Mot de passe trop court (4 caractères min.)."); return; }
    setAccountError("");
    try {
      const res = await fetch("/api/save-dossier", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          dossier: { ...debutAnswers, ...extractedData, ...finAnswers,
            email: accountEmail, user_password: accountPassword, rgpd_consent:"Oui, j'accepte la sauvegarde et les alertes",
            conversation_resume: conversation.filter(m=>m.role==="user").map(m=>m.content).join(" | ") },
          analyse: savedAnalyse,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAccountDone(true);
        if (data.clustering_alerte && savedAnalyse?.action_groupe) {
          savedAnalyse.action_groupe.message = (savedAnalyse.action_groupe.message||"") + " D'autres consommateurs ont déjà signalé le même problème — une action collective est possible.";
        }
      } else { setAccountError("Erreur lors de la sauvegarde."); }
    } catch { setAccountError("Erreur réseau. Réessayez."); }
  }

  // Bloc 1
  const currentDebutStep = STEPS_DEBUT[debutIndex];
  function handleDebutOption(option) {
    if (currentDebutStep.clarif?.[option] && !clarif) { setClarif({ message:currentDebutStep.clarif[option], pendingAnswer:option }); return; }
    saveDebut(option);
  }
  function saveDebut(value) {
    const newAnswers = { ...debutAnswers, [currentDebutStep.id]:value };
    setDebutAnswers(newAnswers); setClarif(null); setClarifInput("");
    if (debutIndex+1 >= STEPS_DEBUT.length) { setPhase("conversation"); startConversation(newAnswers); }
    else setDebutIndex(i=>i+1);
  }

  // Bloc 2
  function getNextConvQuestion(conv, desc) {
    const d = desc.toLowerCase();
    const asked = conv.filter(m=>m.role==="assistant"&&m.id).map(m=>m.id);
    const hasDate = /20(2[0-9])/.test(d) || /\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/.test(d) || /il y a \d|depuis \d+ (an|mois)|l.an dernier|hier/.test(d);
    if (!asked.includes("date")&&!hasDate) return { id:"date", content:"Quelle est la date d'achat ou de début du problème ?", type:"date", placeholder:"JJ/MM/AAAA ou MM/AAAA", options:[] };
    if (!asked.includes("corpo")&&(d.includes("malade")||d.includes("symptôme")||d.includes("nausée")||d.includes("vomis")||d.includes("blessé")||d.includes("allergi")||d.includes("hospitali")||d.includes("bébé")||d.includes("enfant"))) return { id:"corpo", content:"Quel type de préjudice corporel ?", multiSelect:true, options:["Nausées / vomissements","Réaction allergique","Hospitalisation","Blessure","Séquelles durables","Aucun symptôme"] };
    return null;
  }

  function startConversation(answers) {
    setConversation([{ role:"assistant", id:"intro", content:"Décrivez votre problème en quelques mots.", options:[] }]);
  }

  async function sendMessage(optionalValue) {
    const val = (optionalValue!==undefined ? optionalValue : userInput).trim();
    if (!val||agentLoading) return;
    setUserInput("");
    const lastAgent = conversation[conversation.length-1];
    if (lastAgent?.id&&lastAgent.role==="assistant") lastAgent.userAnswer = val;
    const newConv = [...conversation, { role:"user", content:val }];
    setConversation(newConv);
    const firstUserMsg = newConv.find(m=>m.role==="user")?.content||"";
    const alreadyAsked = newConv.filter(m=>m.role==="assistant"&&m.id).map(m=>m.id);

    if (newConv.filter(m=>m.role==="user").length===1&&!alreadyAsked.includes("producteur")) {
      setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_loading", content:"Identification du producteur en cours…", options:[] }]);
      try {
        const text = await callAPI([{ role:"user", content:`L'utilisateur décrit ce problème : "${val}"\nIdentifie le fabricant / producteur / fournisseur principal.\nRetourne UNIQUEMENT un JSON :\n{"producteur":"Nom exact","certitude":"haute|moyenne|faible","explication":"1 phrase"}` }]);
        const clean = text.replace(/\`\`\`json|\`\`\`/g,"").trim();
        const s=clean.indexOf("{"), e=clean.lastIndexOf("}");
        let prodData = { producteur:null, certitude:"faible", explication:"" };
        if (s>=0&&e>s) prodData = JSON.parse(clean.slice(s,e+1));
        setConversation(prev => {
          const filtered = prev.filter(m=>m.id!=="producteur_loading");
          if (prodData.producteur&&prodData.certitude!=="faible") {
            return [...filtered,{ role:"assistant", id:"producteur", content:`J'ai identifié le producteur : **${prodData.producteur}**\n${prodData.explication}\n\nPouvez-vous confirmer ?`, producteur:prodData.producteur, options:[`Oui, c'est bien ${prodData.producteur}`,"Non, ce n'est pas ça","Je ne sais pas"] }];
          }
          return [...filtered,{ role:"assistant", id:"producteur", content:"Je n'ai pas réussi à identifier le producteur. Connaissez-vous le nom de l'entreprise ?", type:"producteur_inconnu", options:["Je ne connais pas le fabricant"] }];
        });
      } catch {
        setConversation(prev=>[...prev.filter(m=>m.id!=="producteur_loading"),{ role:"assistant", id:"producteur", content:"Pouvez-vous me préciser le nom du fabricant ou de l'entreprise ?", type:"producteur_inconnu", options:["Je ne connais pas le fabricant"] }]);
      }
      return;
    }

    if (alreadyAsked.includes("producteur")&&!alreadyAsked.includes("producteur_confirmed")&&!alreadyAsked.includes("producteur_question")) {
      const prodMsg = newConv.find(m=>m.role==="assistant"&&m.id==="producteur");
      if (val.startsWith("Oui")) {
        const pf = prodMsg?.producteur||val.replace(/^Oui, c'est bien /,"");
        setExtractedData(prev=>({...prev,entreprise:pf}));
        setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_confirmed", content:`✓ Producteur enregistré : **${pf}**`, options:[] }]);
        setTimeout(()=>continueAfterProducteur(newConv,firstUserMsg,pf),300);
        return;
      }
      if (val==="Je ne sais pas"||val==="Je ne connais pas le fabricant") {
        setAgentLoading(true);
        try {
          const text = await callAPI([{ role:"user", content:`L'utilisateur a un problème avec : "${firstUserMsg}"\nIl ne connaît pas le fabricant. Génère 1 question pour l'aider à l'identifier.\nRetourne UNIQUEMENT un JSON : {"question":"ta question ici"}` }]);
          const clean=text.replace(/\`\`\`json|\`\`\`/g,"").trim(); const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
          let q={question:"Pouvez-vous décrire où vous avez acheté ce produit ou quelle marque est indiquée ?"};
          if(s>=0&&e>s) q=JSON.parse(clean.slice(s,e+1));
          setAgentLoading(false);
          setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_question", content:q.question, type:"text_input", options:["Je ne sais vraiment pas"] }]);
        } catch { setAgentLoading(false); setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_question", content:"Quelle marque est indiquée sur le produit ?", type:"text_input", options:["Je ne sais vraiment pas"] }]); }
        return;
      }
      setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_question", content:"Connaissez-vous le nom du vrai fabricant ou de l'entreprise ?", type:"text_input", options:["Je ne connais pas le fabricant"] }]);
      return;
    }

    if (alreadyAsked.includes("producteur_question")&&!alreadyAsked.includes("producteur_confirmed")) {
      if (val==="Je ne sais vraiment pas"||val==="Je ne connais pas le fabricant") {
        setExtractedData(prev=>({...prev,entreprise:"Producteur inconnu"}));
        setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_confirmed", content:"✓ Producteur non identifié.", options:[] }]);
        setTimeout(()=>continueAfterProducteur(newConv,firstUserMsg,"Producteur inconnu"),300);
        return;
      }
      setAgentLoading(true);
      try {
        const text = await callAPI([{ role:"user", content:`Vérifie l'orthographe et la cohérence de ce producteur : "${val}"\nRetourne UNIQUEMENT un JSON :\n{"producteur_corrige":"nom corrigé","coherent":true,"explication":""}` }]);
        const clean=text.replace(/\`\`\`json|\`\`\`/g,"").trim(); const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
        let check={producteur_corrige:val,coherent:true,explication:""};
        if(s>=0&&e>s) check=JSON.parse(clean.slice(s,e+1));
        setAgentLoading(false);
        if (check.coherent) {
          setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_reconfirm", content:check.producteur_corrige!==val?`J'ai corrigé : **${check.producteur_corrige}**\n${check.explication}\n\nConfirmer ?`:`Confirmer **${check.producteur_corrige}** ?`, producteur:check.producteur_corrige, options:[`Oui, c'est bien ${check.producteur_corrige}`,"Non, ce n'est pas ça"] }]);
        } else {
          setExtractedData(prev=>({...prev,entreprise:"Producteur inconnu"}));
          setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_confirmed", content:`Je n'ai pas pu valider ce producteur. ${check.explication}`, options:[] }]);
          setTimeout(()=>continueAfterProducteur(newConv,firstUserMsg,"Producteur inconnu"),300);
        }
      } catch {
        setAgentLoading(false); setExtractedData(prev=>({...prev,entreprise:val}));
        setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_confirmed", content:`✓ Producteur enregistré : **${val}**`, options:[] }]);
        setTimeout(()=>continueAfterProducteur(newConv,firstUserMsg,val),300);
      }
      return;
    }

    if (alreadyAsked.includes("producteur_reconfirm")&&!alreadyAsked.includes("producteur_confirmed")) {
      const rm = newConv.find(m=>m.role==="assistant"&&m.id==="producteur_reconfirm");
      const pf = val.startsWith("Oui") ? (rm?.producteur||val.replace(/^Oui, c'est bien /,"")) : "Producteur inconnu";
      setExtractedData(prev=>({...prev,entreprise:pf}));
      setConversation(prev=>[...prev,{ role:"assistant", id:"producteur_confirmed", content:pf==="Producteur inconnu"?"✓ Producteur non identifié.":`✓ Producteur enregistré : **${pf}**`, options:[] }]);
      setTimeout(()=>continueAfterProducteur(newConv,firstUserMsg,pf),300);
      return;
    }

    const nextQ = getNextConvQuestion(newConv,firstUserMsg);
    if (nextQ) { setConversation(prev=>[...prev,{ role:"assistant",...nextQ }]); return; }

    setAgentLoading(true);
    const convData = {};
    newConv.filter(m=>m.role==="assistant"&&m.id).forEach(m=>{ if(m.userAnswer) convData[m.id]=m.userAnswer; });
    try {
      const text = await callAPI([{ role:"user", content:`Extrais les infos et retourne UNIQUEMENT un JSON :\n{"entreprise":"...","type_produit":"...","probleme":"...","date":"...","prejudice":"...","details":"résumé"}\nDescription : ${firstUserMsg}\nDonnées : ${JSON.stringify(convData)}` }]);
      const clean=text.replace(/\`\`\`json|\`\`\`/g,"").trim(); const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
      if(s>=0&&e>s) setExtractedData(JSON.parse(clean.slice(s,e+1)));
    } catch {}
    setAgentLoading(false);
    setConversation(prev=>[...prev,{ role:"assistant", id:"fin", content:"Merci, j'ai toutes les informations.", options:[] }]);
    setConversationDone(true);
  }

  async function continueAfterProducteur(newConv,firstUserMsg,pf) {
    const nextQ = getNextConvQuestion(newConv,firstUserMsg);
    if (nextQ) { setConversation(prev=>[...prev,{ role:"assistant",...nextQ }]); return; }
    setAgentLoading(true);
    try {
      const text = await callAPI([{ role:"user", content:`Extrais les infos et retourne UNIQUEMENT un JSON :\n{"entreprise":"${pf}","type_produit":"...","probleme":"...","date":"...","prejudice":"...","details":"résumé"}\nDescription : ${firstUserMsg}` }]);
      const clean=text.replace(/\`\`\`json|\`\`\`/g,"").trim(); const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
      if(s>=0&&e>s) setExtractedData(JSON.parse(clean.slice(s,e+1)));
    } catch {}
    setAgentLoading(false);
    setConversation(prev=>[...prev,{ role:"assistant", id:"fin", content:"Merci, j'ai toutes les informations.", options:[] }]);
    setConversationDone(true);
  }

  function passToFin() { setFinIndex(0); setPhase("fin"); }

  const activeFin = STEPS_FIN.filter(s=>{ if(s.skipIf&&s.skipIf({...finAnswers,...extractedData})) return false; return true; });
  const currentFinStep = activeFin[finIndex];

  function handleFinOption(option) {
    const newAnswers = { ...finAnswers, [currentFinStep.id]:option };
    setFinAnswers(newAnswers); setMultiSelected([]);
    if (currentFinStep.last) { launchAnalysis(newAnswers); return; }
    let next = finIndex+1;
    while (next<activeFin.length) { if(activeFin[next].skipIf?.({...newAnswers,...extractedData})){ next++; continue; } break; }
    if (next>=activeFin.length) launchAnalysis(newAnswers);
    else setFinIndex(next);
  }

  async function launchAnalysis(finalFinAnswers) {
    setPhase("results"); setIsLoading(true);
    const allData = { ...debutAnswers, ...extractedData, ...finalFinAnswers,
      conversation_resume: conversation.filter(m=>m.role==="user").map(m=>m.content).join(" | ") };
    try {
      const reply = await callAPI([{ role:"user", content:buildPrompt(allData) }]);
      const clean = reply.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("{"), e=clean.lastIndexOf("}");
      let parsed = null;
      if (s>=0&&e>s) { try { parsed=JSON.parse(clean.slice(s,e+1)); } catch { parsed={resume:reply,scores:{compatibilite:50,similarite:50,faisabilite:50,global:50}}; } }
      else parsed = { resume:reply, scores:{compatibilite:50,similarite:50,faisabilite:50,global:50} };

      if (parsed?.action_groupe?.message&&parsed?.scores) {
        const msg = (parsed.action_groupe.message+" "+(parsed.resume||"")).toLowerCase();
        if (msg.includes("en cours")||msg.includes("active")||msg.includes("lancée")||msg.includes("toujours en cours")) parsed.scores.compatibilite=82;
        else if (msg.includes("envisage")||msg.includes("potentiel")||msg.includes("précédent")) parsed.scores.compatibilite=55;
        else if (msg.includes("aucune")||msg.includes("pas identifiée")||msg.includes("non identifiée")) parsed.scores.compatibilite=30;
        if (parsed.prescription?.statut==="favorable") parsed.scores.faisabilite=Math.max(parsed.scores.faisabilite||0,65);
        if (parsed.prescription?.statut==="urgent") parsed.scores.faisabilite=Math.min(parsed.scores.faisabilite||100,40);
        if (msg.includes("milliers")||msg.includes("nombreux")||msg.includes("beaucoup")) parsed.scores.similarite=Math.max(parsed.scores.similarite||0,70);
        parsed.scores.global=Math.round((parsed.scores.compatibilite+parsed.scores.similarite+parsed.scores.faisabilite)/3);
      }
      setSavedAnalyse(parsed);
      setAnalyse(parsed);
    } catch(err) { setAnalyse({ resume:`Erreur : ${err.message}`, scores:{compatibilite:0,similarite:0,faisabilite:0,global:0} }); }
    setIsLoading(false);
  }

  function buildPrompt(a) {
    const lignes = Object.entries(a).filter(([k,v])=>v).map(([k,v]) => `- ${k.replace(/_/g," ")} : ${v}`).join("\n");
    return `Tu es AVOCACTION, agent IA spécialisé en droit de la consommation français (loi n° 2025-391 du 30 avril 2025).
Points de droit : prescription produit 2 ans (Art. L217-4), prescription faits 5 ans (Art. 2224 C. civil).

Données collectées :
${lignes}

Retourne UNIQUEMENT ce JSON valide, commence par { et termine par } :
{
  "entreprise": "nom identifié",
  "resume": "2-3 phrases résumant la situation et ce que tu as trouvé sur le web",
  "prescription": { "statut": "favorable", "message": "explication précise des délais", "expiration": "date ou période" },
  "rappel": { "existe": false, "message": "détail sur le rappel ou absence" },
  "action_groupe": {
    "potentiel": "élevé",
    "message": "1 phrase résumant la situation globale",
    "actions_trouvees": ["Nom action 1 — association — statut", "Nom action 2 — association — statut"]
  },
  "scores": { "compatibilite": 60, "similarite": 60, "faisabilite": 70, "global": 63 },
  "recommandation": "conseil personnalisé 2-3 phrases",
  "etapes": ["étape 1", "étape 2", "étape 3"],
  "urgence": "normale"
}`;
  }

  // ── Rendu landing ──────────────────────────────────────
  if (!started) {
    return (
      <div style={{ flex:1, background:C.navy, display:"flex", flexDirection:"column" }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"60px 24px", gap:28 }}>
          <Logo size={80} withText={false} />
          <div>
            <div style={{ fontSize:11, padding:"5px 16px", borderRadius:20, border:`1px solid ${C.blue}`, color:C.blue, fontFamily:"Calibri, sans-serif", letterSpacing:1, textTransform:"uppercase", display:"inline-block", marginBottom:20 }}>
              Loi n° 2025-391 du 30 avril 2025
            </div>
            <h1 style={{ fontSize:44, fontWeight:"bold", lineHeight:1.2, margin:"0 0 16px", color:C.white, fontFamily:"Palatino Linotype, serif" }}>
              La justice collective,<br /><span style={{ color:C.blue }}>accessible à tous.</span>
            </h1>
            <p style={{ fontSize:16, color:C.gray, lineHeight:1.8, fontFamily:"Calibri, sans-serif", maxWidth:540, margin:"0 auto" }}>
              AVOCACTION analyse votre situation, recherche les actions de groupe existantes et vérifie vos délais de prescription — en moins de 3 minutes.
            </p>
          </div>
          <button onClick={()=>setStarted(true)}
            style={{ padding:"16px 44px", background:C.blue, color:C.navy, border:"none", borderRadius:12, fontSize:16, fontWeight:"bold", cursor:"pointer", fontFamily:"Palatino Linotype, serif", letterSpacing:1, boxShadow:"0 8px 30px rgba(77,184,232,0.3)", transition:"all 0.2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background=C.blueLight; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=C.blue; e.currentTarget.style.transform="translateY(0)"; }}>
            Analyser ma situation →
          </button>
          <p style={{ fontSize:12, color:C.grayMid, fontFamily:"Calibri, sans-serif" }}>Confidentiel · Résultat immédiat</p>
        </div>
        <div style={{ display:"flex", gap:0, borderTop:`1px solid ${C.navyMid}` }}>
          {[
            { icon:"🔍", titre:"Recherche web réelle", desc:"Recherche automatique des actions de groupe existantes" },
            { icon:"⏱️", titre:"Prescription", desc:"Vérification des délais légaux avec alertes" },
            { icon:"🧠", titre:"Agent IA", desc:"Pose uniquement les questions nécessaires" },
            { icon:"🔔", titre:"Clustering", desc:"Détection de cas similaires dans notre base" },
          ].map((f,i) => (
            <div key={i} style={{ flex:1, padding:"24px 20px", borderRight:i<3?`1px solid ${C.navyMid}`:"none", textAlign:"center" }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{f.icon}</div>
              <div style={{ fontSize:13, fontWeight:"bold", color:C.blue, fontFamily:"Palatino Linotype, serif", marginBottom:6 }}>{f.titre}</div>
              <div style={{ fontSize:12, color:C.grayMid, fontFamily:"Calibri, sans-serif", lineHeight:1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Rendu résultats ────────────────────────────────────
  if (phase==="results") {
    const sc = v => v>=75?C.green:v>=50?C.amber:C.red;
    const sl = v => v>=75?"Élevé":v>=50?"Moyen":"Faible";
    const urgC = { haute:C.red, normale:C.amber, faible:C.green };
    const potC = { "élevé":C.green, moyen:C.amber, faible:C.red };
    const preC = { favorable:C.green, attention:C.amber, urgent:C.red };
    return (
      <div style={{ flex:1, background:C.navy, display:"flex", flexDirection:"column" }}>
        {isLoading ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24, padding:60 }}>
            <Logo size={52} withText={false} />
            <div style={{ color:C.blue, fontSize:18, fontFamily:"Palatino Linotype, serif" }}>Analyse en cours…</div>
            <div style={{ color:C.gray, fontSize:13, fontFamily:"Calibri, sans-serif", textAlign:"center", maxWidth:400 }}>
              Recherche des actions de groupe, vérification des délais, analyse de faisabilité…
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background:C.blue, animation:`bounce 1s infinite ${i*0.2}s` }}/>)}
            </div>
          </div>
        ) : analyse ? (
          <div style={{ flex:1, maxWidth:920, margin:"0 auto", padding:"32px 24px 60px", display:"flex", flexDirection:"column", gap:16, width:"100%", overflowY:"auto" }}>

            {/* Résumé */}
            <div style={SR2.card}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:10 }}>
                <span style={{ fontSize:20 }}>📋</span>
                <span style={{ fontSize:15, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif" }}>Résumé du dossier</span>
                {analyse.entreprise&&<span style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:"#F3F4F6", color:"#6B7280", fontFamily:"Calibri, sans-serif" }}>{analyse.entreprise}</span>}
                {analyse.urgence&&<span style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:(urgC[analyse.urgence]||C.amber)+"22", color:urgC[analyse.urgence]||C.amber, border:`1px solid ${urgC[analyse.urgence]||C.amber}`, fontFamily:"Calibri, sans-serif", fontWeight:"bold" }}>Urgence {analyse.urgence}</span>}
              </div>
              <p style={{ fontSize:14, color:"#374151", lineHeight:1.7, fontFamily:"Calibri, sans-serif", margin:0 }}>{analyse.resume}</p>
            </div>

            {/* Scores */}
            {analyse.scores&&(
              <div style={SR2.card}>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:12 }}>
                  <span style={{ fontSize:20 }}>📊</span>
                  <span style={{ fontSize:15, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif" }}>Score de faisabilité collective</span>
                  <span style={{ fontSize:28, fontWeight:"bold", color:sc(analyse.scores.global), marginLeft:"auto", fontFamily:"Palatino Linotype, serif" }}>{analyse.scores.global}/100</span>
                </div>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                  {[{label:"Compatibilité externe",key:"compatibilite"},{label:"Similarité interne",key:"similarite"},{label:"Faisabilité collective",key:"faisabilite"}].map(({label,key})=>{
                    const val=analyse.scores[key]||0;
                    return (
                      <div key={key} style={{ flex:1, minWidth:160 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ fontSize:12, color:"#6B7280", fontFamily:"Calibri, sans-serif" }}>{label}</span>
                          <span style={{ fontSize:13, fontWeight:"bold", color:sc(val) }}>{val}/100</span>
                        </div>
                        <div style={{ height:8, background:"#E5E7EB", borderRadius:4, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${val}%`, background:sc(val), borderRadius:4, transition:"width 1s ease" }}/>
                        </div>
                        <div style={{ fontSize:11, color:sc(val), marginTop:4, fontFamily:"Calibri, sans-serif" }}>{sl(val)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cards prescription / rappel / action */}
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {analyse.prescription&&(
                <div style={{ ...SR2.card, flex:1, minWidth:220, borderTop:`4px solid ${preC[analyse.prescription.statut]||C.amber}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:8 }}>
                    <span style={{ fontSize:20 }}>⏱️</span>
                    <span style={{ fontSize:14, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif" }}>Prescription</span>
                    <span style={{ fontSize:12, padding:"2px 10px", borderRadius:20, background:(preC[analyse.prescription.statut]||C.amber)+"22", color:preC[analyse.prescription.statut]||C.amber, border:`1px solid ${preC[analyse.prescription.statut]||C.amber}`, fontFamily:"Calibri, sans-serif", fontWeight:"bold" }}>
                      {analyse.prescription.statut==="favorable"?"✓ Favorable":analyse.prescription.statut==="urgent"?"⚠ Urgent":"ℹ Attention"}
                    </span>
                  </div>
                  <p style={{ fontSize:13, color:"#6B7280", lineHeight:1.6, fontFamily:"Calibri, sans-serif", margin:0 }}>{analyse.prescription.message}</p>
                  {analyse.prescription.expiration&&<p style={{ fontSize:12, color:C.amber, fontWeight:"bold", marginTop:8, fontFamily:"Calibri, sans-serif" }}>Expiration : {analyse.prescription.expiration}</p>}
                </div>
              )}
              {analyse.rappel&&(
                <div style={{ ...SR2.card, flex:1, minWidth:220, borderTop:`4px solid ${analyse.rappel.existe?C.red:C.green}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <span style={{ fontSize:20 }}>{analyse.rappel.existe?"🚨":"✅"}</span>
                    <span style={{ fontSize:14, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif" }}>Rappel officiel</span>
                    <span style={{ fontSize:12, padding:"2px 10px", borderRadius:20, background:analyse.rappel.existe?"#FEF2F2":"#F0FFF4", color:analyse.rappel.existe?C.red:C.green, border:`1px solid ${analyse.rappel.existe?C.red:C.green}`, fontFamily:"Calibri, sans-serif", fontWeight:"bold" }}>
                      {analyse.rappel.existe?"Confirmé":"Non détecté"}
                    </span>
                  </div>
                  <p style={{ fontSize:13, color:"#6B7280", lineHeight:1.6, fontFamily:"Calibri, sans-serif", margin:0 }}>{analyse.rappel.message}</p>
                </div>
              )}
              {analyse.action_groupe&&(
                <div style={{ ...SR2.card, flex:1, minWidth:220, borderTop:`4px solid ${potC[analyse.action_groupe.potentiel]||C.amber}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:10 }}>
                    <span style={{ fontSize:20 }}>⚖️</span>
                    <span style={{ fontSize:14, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif" }}>Action de groupe</span>
                    <span style={{ fontSize:12, padding:"2px 10px", borderRadius:20, background:(potC[analyse.action_groupe.potentiel]||C.amber)+"22", color:potC[analyse.action_groupe.potentiel]||C.amber, border:`1px solid ${potC[analyse.action_groupe.potentiel]||C.amber}`, fontFamily:"Calibri, sans-serif", fontWeight:"bold" }}>
                      Potentiel {analyse.action_groupe.potentiel}
                    </span>
                  </div>
                  <p style={{ fontSize:13, color:"#6B7280", lineHeight:1.6, fontFamily:"Calibri, sans-serif", margin:"0 0 10px" }}>{analyse.action_groupe.message}</p>
                  {analyse.action_groupe.actions_trouvees?.length > 0 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      <div style={{ fontSize:11, color:C.grayMid, fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1 }}>
                        Actions identifiées
                      </div>
                      {analyse.action_groupe.actions_trouvees.map((action, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 14px", background:"#FEF2F2", border:"1px solid #FECACA", borderLeft:"4px solid #F87171", borderRadius:8 }}>
                          <span style={{ color:"#F87171", fontSize:16, flexShrink:0, lineHeight:1.4 }}>⚠</span>
                          <span style={{ fontSize:13, color:"#991B1B", fontFamily:"Calibri, sans-serif", lineHeight:1.5 }}>{action}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recommandation */}
            {analyse.recommandation&&(
              <div style={{ ...SR2.card, background:C.navy, border:`1px solid ${C.blue}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:20 }}>💡</span>
                  <span style={{ fontSize:14, fontWeight:"bold", color:C.blue, fontFamily:"Palatino Linotype, serif" }}>Recommandation</span>
                </div>
                <p style={{ fontSize:14, color:C.cream, lineHeight:1.7, fontFamily:"Calibri, sans-serif", margin:0 }}>{analyse.recommandation}</p>
              </div>
            )}

            {/* Étapes */}
            {analyse.etapes&&(
              <div style={SR2.card}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:20 }}>🎯</span>
                  <span style={{ fontSize:14, fontWeight:"bold", color:C.navy, fontFamily:"Palatino Linotype, serif" }}>Prochaines étapes</span>
                </div>
                {analyse.etapes.map((e,i)=>(
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:10 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:C.navy, color:C.blue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:"bold", flexShrink:0 }}>{i+1}</div>
                    <p style={{ fontSize:14, color:"#374151", lineHeight:1.7, fontFamily:"Calibri, sans-serif", margin:0, paddingTop:4 }}>{e}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Offres + Création de compte */}
            {!accountDone ? (
              <div style={{ ...SR2.card, background:C.navyMid, border:`1px solid ${C.blue}` }}>

                {/* Étape 1 : CTA */}
                {!showPricing && !selectedOffer && (
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <span style={{ fontSize:20 }}>🔔</span>
                      <span style={{ fontSize:15, fontWeight:"bold", color:C.blue, fontFamily:"Palatino Linotype, serif" }}>Protégez votre dossier — choisissez votre offre</span>
                    </div>
                    <p style={{ fontSize:13, color:C.gray, fontFamily:"Calibri, sans-serif", lineHeight:1.6, marginBottom:16 }}>
                      Sauvegardez votre dossier, recevez des alertes à J-365, J-180 et J-30 avant la prescription, et soyez accompagné dans vos démarches.
                    </p>
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                      <button onClick={()=>setShowPricing(true)}
                        style={{ padding:"12px 28px", background:C.blue, color:C.navy, border:"none", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:"bold", fontFamily:"Palatino Linotype, serif", boxShadow:`0 4px 16px rgba(77,184,232,0.3)` }}>
                        Voir les offres →
                      </button>
                      <button onClick={()=>setAccountDone(true)}
                        style={{ padding:"12px 16px", background:"transparent", border:`1px solid ${C.navyMid}`, color:C.gray, borderRadius:10, cursor:"pointer", fontSize:13, fontFamily:"Calibri, sans-serif" }}>
                        Non merci
                      </button>
                    </div>
                  </div>
                )}

                {/* Étape 2 : Tableau comparatif */}
                {showPricing && !selectedOffer && (() => {
                  const OFFRES = [
                    { nom:"Découverte", prix:"Gratuit",  highlight:false },
                    { nom:"Suivi",      prix:"6€/mois",  highlight:false },
                    { nom:"Action",     prix:"15€",       highlight:false },
                    { nom:"Premium",    prix:"99€",       highlight:true  },
                  ];
                  const FEATURES = [
                    { label:"Analyse + scoring",                    v:[true, true, true, true]  },
                    { label:"Résultats détaillés",                  v:[true, true, true, true]  },
                    { label:"Accès dossier en ligne",               v:[false,true, true, true]  },
                    { label:"Alertes J-365 / J-180 / J-30",         v:[false,true, true, true]  },
                    { label:"Veille automatique",                   v:[false,true, true, true]  },
                    { label:"Soumission action de groupe",          v:[false,false,true, true]  },
                    { label:"Rapport PDF détaillé",                 v:[false,false,false,true]  },
                    { label:"Accompagnement personnalisé",          v:[false,false,false,true]  },
                    { label:"Suivi jusqu'à l'action",               v:[false,false,false,true]  },
                  ];
                  return (
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                        <span style={{ fontSize:20 }}>⚖️</span>
                        <span style={{ fontSize:15, fontWeight:"bold", color:C.blue, fontFamily:"Palatino Linotype, serif" }}>Choisissez votre offre</span>
                      </div>
                      <div style={{ overflowX:"auto" }}>
                        <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"Calibri, sans-serif" }}>
                          <thead>
                            <tr>
                              <th style={{ padding:"10px 12px", textAlign:"left", fontSize:12, color:C.gray, fontWeight:"normal", borderBottom:`1px solid rgba(255,255,255,0.08)`, minWidth:190 }} />
                              {OFFRES.map(o => (
                                <th key={o.nom} style={{ padding:"8px 10px", textAlign:"center", borderBottom:`1px solid rgba(255,255,255,0.08)`, minWidth:105 }}>
                                  <div style={{ display:"inline-block", padding:"8px 12px", borderRadius:10, background:o.highlight?C.blue:"rgba(255,255,255,0.06)", border:`1px solid ${o.highlight?C.blue:"rgba(255,255,255,0.1)"}` }}>
                                    {o.highlight && <div style={{ fontSize:9, color:C.navy, textTransform:"uppercase", letterSpacing:1, marginBottom:3, fontWeight:"bold" }}>⭐ Recommandé</div>}
                                    <div style={{ fontSize:14, fontWeight:"bold", color:o.highlight?C.navy:C.blue, fontFamily:"Palatino Linotype, serif" }}>{o.nom}</div>
                                    <div style={{ fontSize:12, color:o.highlight?C.navy:C.gray, marginTop:2 }}>{o.prix}</div>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {FEATURES.map((row, ri) => (
                              <tr key={ri} style={{ background:ri%2===0?"rgba(255,255,255,0.03)":"transparent" }}>
                                <td style={{ padding:"9px 12px", fontSize:12, color:C.gray, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{row.label}</td>
                                {row.v.map((val, vi) => (
                                  <td key={vi} style={{ padding:"9px 12px", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:15 }}>
                                    {val
                                      ? <span style={{ color:"#00D4AA", fontWeight:"bold" }}>✓</span>
                                      : <span style={{ color:"#F87171" }}>✗</span>
                                    }
                                  </td>
                                ))}
                              </tr>
                            ))}
                            <tr>
                              <td style={{ padding:"14px 12px" }}/>
                              {OFFRES.map(o => (
                                <td key={o.nom} style={{ padding:"14px 10px", textAlign:"center" }}>
                                  <button onClick={()=>setSelectedOffer(o)}
                                    style={{ padding:"9px 0", width:"100%", background:o.highlight?C.blue:"transparent",
                                      color:o.highlight?C.navy:C.blue, border:`1.5px solid ${C.blue}`,
                                      borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:"bold",
                                      fontFamily:"Calibri, sans-serif", transition:"all 0.15s" }}
                                    onMouseEnter={e=>{e.currentTarget.style.background=C.blue;e.currentTarget.style.color=C.navy;}}
                                    onMouseLeave={e=>{if(!o.highlight){e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.blue;}}}>
                                    Choisir
                                  </button>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <button onClick={()=>setShowPricing(false)}
                        style={{ marginTop:12, background:"transparent", border:"none", color:C.grayMid, cursor:"pointer", fontSize:12, fontFamily:"Calibri, sans-serif" }}>
                        ← Retour
                      </button>
                    </div>
                  );
                })()}

                {/* Étape 3 : Formulaire compte */}
                {selectedOffer && (
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:20 }}>👤</span>
                      <span style={{ fontSize:15, fontWeight:"bold", color:C.blue, fontFamily:"Palatino Linotype, serif" }}>
                        Créer mon compte
                      </span>
                      <span style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:`${C.blue}22`, color:C.blue, border:`1px solid ${C.blue}`, fontFamily:"Calibri, sans-serif", fontWeight:"bold" }}>
                        {selectedOffer.nom} — {selectedOffer.prix}
                      </span>
                    </div>
                    <p style={{ fontSize:12, color:C.grayMid, fontFamily:"Calibri, sans-serif", marginBottom:16 }}>
                      {selectedOffer.nom==="Découverte" ? "Accès gratuit — sauvegardez votre analyse."
                        : selectedOffer.nom==="Suivi"      ? "Veille automatique + alertes J-365, J-180, J-30 incluses."
                        : selectedOffer.nom==="Action"     ? "Soumission de votre dossier à une action de groupe."
                        : "Accompagnement complet : rapport PDF + suivi jusqu'à l'action de groupe."}
                    </p>
                    <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:400 }}>
                      {[
                        { label:"Email",        type:"email",    val:accountEmail,    set:setAccountEmail,    placeholder:"votre@email.com" },
                        { label:"Mot de passe", type:"password", val:accountPassword, set:setAccountPassword, placeholder:"Choisissez un mot de passe" },
                      ].map(f=>(
                        <div key={f.label}>
                          <label style={{ fontSize:11, fontWeight:"bold", color:C.gray, fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:5 }}>{f.label}</label>
                          <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder}
                            style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.07)", border:`1px solid ${C.navyMid}`, borderRadius:9, fontSize:13, fontFamily:"Calibri, sans-serif", outline:"none", color:C.cream, boxSizing:"border-box" }}/>
                        </div>
                      ))}
                      {accountError&&<p style={{ fontSize:12, color:C.red, fontFamily:"Calibri, sans-serif", margin:0 }}>{accountError}</p>}
                      <p style={{ fontSize:11, color:C.grayMid, fontFamily:"Calibri, sans-serif", lineHeight:1.5, margin:0 }}>
                        En créant un compte, vous acceptez notre <a href="/rgpd" style={{ color:C.blue }}>politique de confidentialité</a>.
                        {selectedOffer.nom!=="Découverte" && " Le paiement sera activé à l'ouverture commerciale."}
                      </p>
                      <div style={{ display:"flex", gap:10 }}>
                        <button onClick={createAccount}
                          style={{ flex:1, padding:"12px 0", background:C.blue, color:C.navy, border:"none", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:"bold", fontFamily:"Palatino Linotype, serif" }}>
                          Créer mon compte →
                        </button>
                        <button onClick={()=>setSelectedOffer(null)}
                          style={{ padding:"12px 14px", background:"transparent", border:`1px solid ${C.navyMid}`, color:C.gray, borderRadius:10, cursor:"pointer", fontSize:13, fontFamily:"Calibri, sans-serif" }}>
                          ←
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ ...SR2.card, background:"#0D3320", border:"1px solid #3B6D11" }}>
                <p style={{ fontSize:14, color:"#4ADE80", fontFamily:"Calibri, sans-serif", margin:0 }}>
                  ✓ Compte créé ! Offre <strong>{selectedOffer?.nom}</strong> enregistrée. Accédez à votre dossier depuis l'onglet "Suivre mon dossier".
                </p>
              </div>
            )}

            <div style={{ textAlign:"center", marginTop:8 }}>
              <button onClick={()=>{ setStarted(false); setPhase("debut"); setDebutIndex(0); setDebutAnswers({}); setConversation([]); setConversationDone(false); setExtractedData({}); setFinIndex(0); setFinAnswers({}); setAnalyse(null); setShowPricing(false); setSelectedOffer(null); setAccountDone(false); setSavedAnalyse(null); }}
                style={{ background:"transparent", border:`1px solid ${C.navyMid}`, borderRadius:10, padding:"10px 22px", color:C.gray, fontSize:13, cursor:"pointer", fontFamily:"Calibri, sans-serif" }}>
                ↺ Nouvelle analyse
              </button>
            </div>
            <div ref={chatEndRef}/>
          </div>
        ) : (
          <div style={{ padding:40, color:C.gray, textAlign:"center", fontFamily:"Calibri, sans-serif" }}>Chargement…</div>
        )}
      </div>
    );
  }

  const totalSteps = STEPS_DEBUT.length+1+activeFin.length;
  const currentGlobal = phase==="debut"?debutIndex:phase==="conversation"?STEPS_DEBUT.length:STEPS_DEBUT.length+1+finIndex;
  const progress = Math.round((currentGlobal/totalSteps)*100);

  return (
    <div style={{ flex:1, background:"#F0F6FA", display:"flex", flexDirection:"column" }}>
      {/* Progress */}
      <div style={{ background:C.navy, padding:"10px 40px", display:"flex", alignItems:"center", justifyContent:"flex-end", gap:12, borderBottom:`1px solid ${C.navyMid}` }}>
        <span style={{ fontSize:12, color:C.gray, fontFamily:"Calibri, sans-serif" }}>{currentGlobal+1} / {totalSteps}</span>
        <div style={{ width:160, height:3, background:C.navyMid, borderRadius:2 }}>
          <div style={{ height:"100%", width:`${progress}%`, background:C.blue, borderRadius:2, transition:"width 0.4s" }}/>
        </div>
      </div>

      {phase==="debut"&&(
        <div style={SQ.container}>
          <div style={SQ.stepLabel}>{currentDebutStep.label}</div>
          <p style={SQ.question}>{currentDebutStep.question}</p>
          {clarif ? (
            <div style={SQ.clarifBox}>
              <p style={{ fontSize:13, color:C.navy, lineHeight:1.5, margin:0, fontFamily:"Calibri, sans-serif" }}>{clarif.message}</p>
              <textarea style={SQ.clarifInput} value={clarifInput} onChange={e=>setClarifInput(e.target.value)} placeholder="Votre précision…" rows={2}
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();saveDebut(clarif.pendingAnswer+(clarifInput?" — "+clarifInput:""));} }} autoFocus/>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>saveDebut(clarif.pendingAnswer+(clarifInput?" — "+clarifInput:""))} style={SQ.clarifConfirm}>Confirmer</button>
                <button onClick={()=>saveDebut(clarif.pendingAnswer)} style={SQ.clarifSkip}>Passer</button>
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {currentDebutStep.options.map(opt=>(
                <button key={opt} onClick={()=>handleDebutOption(opt)} style={SQ.optionBtn}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.background="#E6F4FB";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#D0E4F0";e.currentTarget.style.background=C.white;}}>
                  {opt}
                </button>
              ))}
            </div>
          )}
          {debutIndex>0&&!clarif&&<button onClick={()=>{setDebutIndex(i=>i-1);setClarif(null);}} style={SQ.backBtn}>← Retour</button>}
        </div>
      )}

      {phase==="conversation"&&(
        <div style={{ flex:1, maxWidth:720, margin:"0 auto", padding:"24px 24px 16px", width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:16, paddingBottom:8, maxHeight:"calc(100vh - 300px)", minHeight:200 }}>
            {conversation.map((m,i)=>(
              <div key={i} style={{ display:"flex", flexDirection:"column", gap:4, alignItems:m.role==="user"?"flex-end":"flex-start" }}>
                {m.role==="assistant"&&<div style={{ fontSize:10, color:C.blue, fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>⚖ Agent AVOCACTION</div>}
                <div style={{ padding:"12px 16px", borderRadius:m.role==="user"?"14px 4px 14px 14px":"4px 14px 14px 14px", fontSize:14, lineHeight:1.6, maxWidth:"80%", fontFamily:"Calibri, sans-serif",
                  background:m.role==="user"?C.navy:C.white, color:m.role==="user"?C.cream:C.navy, border:m.role==="user"?"none":"1px solid #D0E4F0" }}>
                  {m.content.split(/(\*\*[^*]+\*\*)/).map((part,pi)=>
                    part.startsWith("**")&&part.endsWith("**")
                      ?<strong key={pi} style={{ color:C.blue }}>{part.slice(2,-2)}</strong>
                      :part.split("\n").map((line,li)=><span key={li}>{line}{li<part.split("\n").length-1&&<br/>}</span>)
                  )}
                </div>
                {m.role==="assistant"&&m.type==="date"&&i===conversation.length-1&&!conversationDone&&<ConvDateInput placeholder={m.placeholder} onSubmit={sendMessage}/>}
                {m.role==="assistant"&&m.options&&m.options.length>0&&i===conversation.length-1&&!conversationDone&&m.multiSelect&&<ConvMultiSelect options={m.options} onSubmit={sendMessage}/>}
                {m.role==="assistant"&&m.options&&m.options.length>0&&i===conversation.length-1&&!conversationDone&&!m.multiSelect&&(
                  <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8, maxWidth:"80%" }}>
                    {m.options.map((opt,j)=>(
                      <button key={j} onClick={()=>sendMessage(opt)}
                        style={{ padding:"9px 14px", background:"#F0F6FA", border:"1.5px solid #D0E4F0", borderRadius:8, cursor:"pointer", fontSize:13, color:C.navy, textAlign:"left", fontFamily:"Calibri, sans-serif", transition:"all 0.15s" }}
                        onMouseEnter={e=>{e.currentTarget.style.background="#E6F4FB";e.currentTarget.style.borderColor=C.blue;}}
                        onMouseLeave={e=>{e.currentTarget.style.background="#F0F6FA";e.currentTarget.style.borderColor="#D0E4F0";}}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {agentLoading&&(
              <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-start" }}>
                <div style={{ fontSize:10, color:C.blue, fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1 }}>⚖ Agent AVOCACTION</div>
                <div style={{ padding:"14px 18px", borderRadius:"4px 14px 14px 14px", background:C.white, border:"1px solid #D0E4F0", display:"flex", gap:6 }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background:C.blue, animation:`bounce 1.2s infinite ${i*0.2}s` }}/>)}
                </div>
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>
          {conversationDone?(
            <div style={{ background:"#EAF3DE", border:"1px solid #3B6D11", borderRadius:10, padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>
              <p style={{ fontSize:13, color:"#1F4A0A", fontFamily:"Calibri, sans-serif", margin:0 }}>✓ L'agent a collecté toutes les informations nécessaires.</p>
              <button onClick={passToFin} style={SQ.submitBtn}>Continuer vers l'analyse →</button>
            </div>
          ):(
            <>
              <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
                <textarea style={{ flex:1, padding:"10px 14px", border:`1.5px solid #D0E4F0`, borderRadius:10, fontSize:14, fontFamily:"Calibri, sans-serif", outline:"none", resize:"none", lineHeight:1.5, background:C.white, color:C.navy }}
                  value={userInput} onChange={e=>setUserInput(e.target.value)} placeholder="Décrivez votre situation…" rows={3}
                  onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} }} disabled={agentLoading}/>
                <button onClick={sendMessage} disabled={!userInput.trim()||agentLoading}
                  style={{ width:44, height:44, background:C.navy, color:C.blue, border:"none", borderRadius:10, cursor:"pointer", fontSize:20, fontWeight:"bold", flexShrink:0, opacity:userInput.trim()&&!agentLoading?1:0.4 }}>→</button>
              </div>
              <p style={{ fontSize:11, color:"#9CA3AF", margin:"4px 0 0", fontFamily:"Calibri, sans-serif", textAlign:"center" }}>Entrée pour envoyer · Maj+Entrée pour saut de ligne</p>
            </>
          )}
        </div>
      )}

      {phase==="fin"&&currentFinStep&&(
        <div style={SQ.container}>
          <div style={SQ.stepLabel}>{currentFinStep.label}</div>
          <p style={SQ.question}>{currentFinStep.question}</p>
          {currentFinStep.multiSelect?(
            <div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {currentFinStep.options.map(opt=>{
                  const checked=multiSelected.includes(opt);
                  return (
                    <button key={opt} onClick={()=>setMultiSelected(prev=>prev.includes(opt)?prev.filter(o=>o!==opt):[...prev,opt])}
                      style={{ ...SQ.optionBtn, borderColor:checked?C.blue:"#D0E4F0", background:checked?"#E6F4FB":C.white, display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ width:20, height:20, borderRadius:4, flexShrink:0, border:checked?`2px solid ${C.blue}`:"2px solid #D0E4F0", background:checked?C.blue:"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:C.white, fontSize:13, fontWeight:"bold" }}>{checked?"✓":""}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <button onClick={()=>{ if(multiSelected.length>0) handleFinOption(multiSelected.join(", ")); }}
                style={{ ...SQ.submitBtn, marginTop:16, opacity:multiSelected.length>0?1:0.4 }} disabled={multiSelected.length===0}>
                Valider ({multiSelected.length} sélectionné{multiSelected.length>1?"s":""}) →
              </button>
            </div>
          ):(
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {currentFinStep.options.map(opt=>(
                <button key={opt} onClick={()=>handleFinOption(opt)} style={SQ.optionBtn}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.background="#E6F4FB";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#D0E4F0";e.currentTarget.style.background=C.white;}}>
                  {opt}
                </button>
              ))}
            </div>
          )}
          {finIndex>0&&<button onClick={()=>{setFinIndex(i=>Math.max(0,i-1));setMultiSelected([]);}} style={SQ.backBtn}>← Retour</button>}
        </div>
      )}
    </div>
  );
}

const SR2 = {
  card: { background:C.white, border:"1px solid #E5E7EB", borderRadius:14, padding:"20px 24px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
};
const SQ = {
  container: { flex:1, maxWidth:680, margin:"0 auto", padding:"48px 24px 32px", width:"100%", display:"flex", flexDirection:"column", gap:16 },
  stepLabel:  { fontSize:11, fontWeight:"bold", color:C.blue, textTransform:"uppercase", letterSpacing:1.5, fontFamily:"Calibri, sans-serif" },
  question:   { fontSize:18, color:C.navy, lineHeight:1.5, margin:"0 0 4px", fontWeight:"bold", fontFamily:"Palatino Linotype, serif" },
  optionBtn:  { padding:"13px 16px", background:C.white, border:"1.5px solid #D0E4F0", borderRadius:10, cursor:"pointer", fontSize:14, color:C.navy, textAlign:"left", fontFamily:"Calibri, sans-serif", transition:"all 0.15s", lineHeight:1.4 },
  submitBtn:  { width:"100%", padding:"14px", background:C.navy, color:C.blue, border:"none", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:"bold", fontFamily:"Palatino Linotype, serif", letterSpacing:1 },
  backBtn:    { marginTop:8, padding:"8px 0", background:"transparent", border:"none", color:"#9CA3AF", cursor:"pointer", fontSize:12, fontFamily:"Calibri, sans-serif", alignSelf:"flex-start" },
  clarifBox:  { background:"#E6F4FB", border:`2px solid ${C.blue}`, borderRadius:10, padding:14, display:"flex", flexDirection:"column", gap:10 },
  clarifInput:{ width:"100%", padding:10, border:"1px solid #D0E4F0", borderRadius:8, fontSize:13, fontFamily:"Calibri, sans-serif", outline:"none", resize:"none", boxSizing:"border-box" },
  clarifConfirm:{ flex:1, padding:9, background:C.navy, color:C.blue, border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"Calibri, sans-serif" },
  clarifSkip: { padding:"9px 16px", background:"transparent", border:"1px solid #D0E4F0", borderRadius:8, cursor:"pointer", fontSize:12, color:"#6B7280", fontFamily:"Calibri, sans-serif" },
};

// ═══════════════════════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [activeTab, setActiveTab] = useState("analyse");
  const [resetKey, setResetKey]   = useState(0);

  function handleReset() { setResetKey(k=>k+1); }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:C.navy }}>
      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} onReset={handleReset}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        {activeTab==="analyse" && <PageAnalyse resetKey={resetKey}/>}
        {activeTab==="equipe"  && <PageEquipe/>}
        {activeTab==="dossier" && <PageDossier/>}
        {activeTab==="cabinet" && <PageCabinet/>}
      </div>
      <Footer/>
    </div>
  );
}
