// pages/rgpd.jsx
export default function Rgpd() {
  return (
    <div style={S.page}>
      <div style={S.header}>
        <a href="/" style={S.back}>← Retour</a>
        <span style={S.logo}>⚖ AVOC<span style={{color:"#C9A84C"}}>ACTION</span></span>
      </div>
      <div style={S.body}>
        <h1 style={S.h1}>Politique de confidentialité</h1>
        <p style={S.updated}>Dernière mise à jour : avril 2025 — Conforme RGPD (Règlement UE 2016/679)</p>

        <h2 style={S.h2}>1. Responsable du traitement</h2>
        <p style={S.p}>
          <strong>Avocaction</strong> (projet en développement)<br/>
          Contact DPO : <a href="mailto:d.darmon@eleve-efb.fr" style={S.link}>d.darmon@eleve-efb.fr</a>
        </p>

        <h2 style={S.h2}>2. Données collectées</h2>
        <p style={S.p}>
          Dans le cadre de l'analyse juridique, nous collectons uniquement les données nécessaires :
        </p>
        <ul style={S.ul}>
          <li style={S.li}><strong>Données d'identification</strong> : nom, prénom (si consentement RGPD donné)</li>
          <li style={S.li}><strong>Données de contact</strong> : adresse email, téléphone, adresse postale (si consentement)</li>
          <li style={S.li}><strong>Données de situation</strong> : description du problème, nom de l'entreprise concernée, date des faits, type de contrat, montant du préjudice</li>
          <li style={S.li}><strong>Données d'analyse</strong> : scores de faisabilité, recommandations générées</li>
        </ul>
        <p style={S.p}>
          <strong>Aucune donnée sensible</strong> (santé, origine ethnique, opinions politiques) n'est collectée
          sauf si vous la mentionnez volontairement dans la description de votre situation.
        </p>

        <h2 style={S.h2}>3. Finalités et bases légales</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong>Analyse juridique</strong> : exécution du service demandé (Art. 6.1.b RGPD)</li>
          <li style={S.li}><strong>Veille automatique et alertes prescription</strong> : consentement explicite (Art. 6.1.a RGPD)</li>
          <li style={S.li}><strong>Détection de cas similaires (clustering)</strong> : intérêt légitime à améliorer le service (Art. 6.1.f RGPD), données anonymisées</li>
        </ul>

        <h2 style={S.h2}>4. Hébergement et transferts</h2>
        <p style={S.p}>
          Les données sont stockées sur <strong>Supabase</strong> (serveurs EU — Paris, France).
          L'analyse est traitée via l'<strong>API Anthropic</strong> (serveurs USA) — Anthropic applique
          une politique de non-conservation des données d'API (<a href="https://www.anthropic.com/privacy" target="_blank" style={S.link}>voir politique Anthropic</a>).
          Le site est hébergé sur <strong>Vercel</strong> (USA) avec garanties contractuelles RGPD (DPA signé).
        </p>

        <h2 style={S.h2}>5. Durée de conservation</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong>Dossiers avec consentement</strong> : conservés 5 ans (durée de prescription légale), puis anonymisés</li>
          <li style={S.li}><strong>Analyses sans consentement</strong> : non sauvegardées, traitées uniquement en session</li>
        </ul>

        <h2 style={S.h2}>6. Vos droits</h2>
        <p style={S.p}>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul style={S.ul}>
          <li style={S.li}><strong>Accès</strong> : obtenir une copie de vos données</li>
          <li style={S.li}><strong>Rectification</strong> : corriger des données inexactes</li>
          <li style={S.li}><strong>Effacement</strong> : demander la suppression de vos données</li>
          <li style={S.li}><strong>Opposition</strong> : vous opposer à certains traitements</li>
          <li style={S.li}><strong>Portabilité</strong> : recevoir vos données dans un format structuré</li>
          <li style={S.li}><strong>Retrait du consentement</strong> : à tout moment, sans effet rétroactif</li>
        </ul>
        <p style={S.p}>
          Pour exercer vos droits : <a href="mailto:d.darmon@eleve-efb.fr" style={S.link}>d.darmon@eleve-efb.fr</a><br/>
          Délai de réponse : 30 jours maximum.<br/>
          En cas de litige : vous pouvez saisir la <a href="https://www.cnil.fr" target="_blank" style={S.link}>CNIL</a> (www.cnil.fr).
        </p>

        <h2 style={S.h2}>7. Sécurité</h2>
        <p style={S.p}>
          Les données sont protégées par chiffrement en transit (HTTPS) et au repos.
          L'accès à la base de données est restreint par clés API sécurisées.
          Aucun mot de passe utilisateur n'est stocké.
        </p>

        <h2 style={S.h2}>8. Cookies</h2>
        <p style={S.p}>
          Le site n'utilise pas de cookies de tracking ou publicitaires.
          Seuls des cookies techniques strictement nécessaires au fonctionnement peuvent être utilisés.
        </p>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:"100vh", background:"#F7F5F0", fontFamily:"Calibri, sans-serif" },
  header: { background:"#0A1628", padding:"16px 40px", display:"flex", alignItems:"center", gap:20, borderBottom:"3px solid #C9A84C" },
  back: { color:"#C9A84C", textDecoration:"none", fontSize:13 },
  logo: { fontSize:20, fontWeight:"bold", color:"#FFFFFF", letterSpacing:1, fontFamily:"Palatino Linotype, serif" },
  body: { maxWidth:760, margin:"0 auto", padding:"48px 24px 80px" },
  h1: { fontSize:28, color:"#0A1628", fontFamily:"Palatino Linotype, serif", marginBottom:8 },
  h2: { fontSize:17, color:"#0A1628", fontFamily:"Palatino Linotype, serif", marginTop:32, marginBottom:8, borderBottom:"2px solid #C9A84C", paddingBottom:6 },
  p: { fontSize:14, color:"#374151", lineHeight:1.8, margin:"0 0 12px" },
  ul: { paddingLeft:20, margin:"0 0 12px" },
  li: { fontSize:14, color:"#374151", lineHeight:1.8, marginBottom:6 },
  link: { color:"#C9A84C" },
  updated: { fontSize:12, color:"#9CA3AF", marginBottom:32 },
};
