// pages/mentions-legales.jsx
export default function MentionsLegales() {
  return (
    <div style={S.page}>
      <div style={S.header}>
        <a href="/" style={S.back}>← Retour</a>
        <span style={S.logo}>⚖ AVOC<span style={{color:"#C9A84C"}}>ACTION</span></span>
      </div>
      <div style={S.body}>
        <h1 style={S.h1}>Mentions légales</h1>
        <p style={S.updated}>Dernière mise à jour : avril 2025</p>

        <h2 style={S.h2}>Éditeur du site</h2>
        <p style={S.p}>
          Le site <strong>avocaction.vercel.app</strong> est édité par le projet <strong>Avocaction</strong>,
          actuellement en phase de développement académique.<br/>
          Contact : <a href="mailto:d.darmon@eleve-efb.fr" style={S.link}>d.darmon@eleve-efb.fr</a>
        </p>

        <h2 style={S.h2}>Hébergement</h2>
        <p style={S.p}>
          Le site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 900, San Francisco, CA 94104, États-Unis.<br/>
          Les données sont stockées sur <strong>Supabase</strong>, serveurs situés dans l'Union Européenne (région eu-west-3, Paris, France).
        </p>

        <h2 style={S.h2}>Nature du service</h2>
        <p style={S.p}>
          AVOCACTION est un outil d'aide à l'information juridique basé sur l'intelligence artificielle.
          Il ne constitue pas un conseil juridique au sens de la loi. Les résultats fournis sont indicatifs
          et ne sauraient engager la responsabilité de l'éditeur. Pour toute situation juridique,
          consultez un avocat ou une association de consommateurs agréée.
        </p>

        <h2 style={S.h2}>Propriété intellectuelle</h2>
        <p style={S.p}>
          L'ensemble des contenus du site (textes, interface, algorithmes) est la propriété exclusive
          du projet Avocaction. Toute reproduction sans autorisation préalable est interdite.
        </p>

        <h2 style={S.h2}>Contact</h2>
        <p style={S.p}>
          Pour toute question : <a href="mailto:d.darmon@eleve-efb.fr" style={S.link}>d.darmon@eleve-efb.fr</a>
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
