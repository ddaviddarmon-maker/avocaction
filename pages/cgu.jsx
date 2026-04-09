// pages/cgu.jsx
export default function CGU() {
  return (
    <div style={S.page}>
      <div style={S.header}>
        <a href="/" style={S.back}>← Retour</a>
        <span style={S.logo}>⚖ AVOC<span style={{color:"#C9A84C"}}>ACTION</span></span>
      </div>
      <div style={S.body}>
        <h1 style={S.h1}>Conditions Générales d'Utilisation</h1>
        <p style={S.updated}>Dernière mise à jour : avril 2025</p>

        <h2 style={S.h2}>1. Objet</h2>
        <p style={S.p}>
          Les présentes CGU régissent l'utilisation du service AVOCACTION, outil d'aide à l'information
          juridique en matière de droit de la consommation et d'actions de groupe (loi n° 2025-391 du 30 avril 2025).
        </p>

        <h2 style={S.h2}>2. Acceptation</h2>
        <p style={S.p}>
          L'utilisation du service implique l'acceptation pleine et entière des présentes CGU.
          Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.
        </p>

        <h2 style={S.h2}>3. Description du service</h2>
        <p style={S.p}>
          AVOCACTION propose une analyse automatisée de situations de consommation à des fins informatives.
          Le service :<br/>
          — analyse la situation décrite par l'utilisateur via un agent IA ;<br/>
          — recherche les actions de groupe existantes ;<br/>
          — évalue les délais de prescription applicables ;<br/>
          — propose des recommandations générales non personnalisées au sens juridique.
        </p>

        <h2 style={S.h2}>4. Limites du service</h2>
        <p style={S.p}>
          <strong>AVOCACTION n'est pas un cabinet d'avocats</strong> et ne fournit pas de conseil juridique
          au sens de la loi du 31 décembre 1971. Les résultats sont fournis à titre indicatif.
          L'éditeur décline toute responsabilité quant aux décisions prises sur la base de ces informations.
          Pour toute démarche juridique, consultez un professionnel du droit.
        </p>

        <h2 style={S.h2}>5. Obligations de l'utilisateur</h2>
        <p style={S.p}>
          L'utilisateur s'engage à fournir des informations exactes, à utiliser le service dans un cadre légal,
          et à ne pas tenter de détourner ou contourner les mécanismes du service.
        </p>

        <h2 style={S.h2}>6. Disponibilité</h2>
        <p style={S.p}>
          L'éditeur s'efforce d'assurer la disponibilité du service mais ne garantit pas une disponibilité
          ininterrompue. Des interruptions techniques peuvent survenir sans préavis.
        </p>

        <h2 style={S.h2}>7. Modification des CGU</h2>
        <p style={S.p}>
          L'éditeur se réserve le droit de modifier les présentes CGU à tout moment.
          Les utilisateurs seront informés des modifications par mise à jour de la date ci-dessus.
        </p>

        <h2 style={S.h2}>8. Droit applicable</h2>
        <p style={S.p}>
          Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence
          des tribunaux français.
        </p>

        <h2 style={S.h2}>Contact</h2>
        <p style={S.p}>
          <a href="mailto:d.darmon@eleve-efb.fr" style={S.link}>d.darmon@eleve-efb.fr</a>
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
  link: { color:"#C9A84C" },
  updated: { fontSize:12, color:"#9CA3AF", marginBottom:32 },
};
