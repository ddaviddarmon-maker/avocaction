"use client";
import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// BLOC 1 — Questions fixes de début (1-3)
// ═══════════════════════════════════════════════════════════
const STEPS_DEBUT = [
  {
    id: "cadre", label: "Cadre",
    question: "Dans quel cadre effectuez-vous cette demande ?",
    options: [
      "Je suis un particulier consommateur",
      "Je suis un petit professionnel (moins de 5 salariés)",
      "Je représente une personne morale non professionnelle (ex : syndicat de copropriétaires)",
      "Je suis un professionnel / une grande entreprise",
      "Je représente une association",
      "Je ne sais pas / autre situation",
    ],
    clarif: {
      "Je suis un petit professionnel (moins de 5 salariés)":
        "Depuis la loi 2025-391, certains petits professionnels peuvent participer si le contrat est hors activité principale. Cet achat était-il lié à votre activité professionnelle principale ?",
      "Je suis un professionnel / une grande entreprise":
        "Les actions de groupe sont réservées aux particuliers et petits professionnels. Cet achat était-il réalisé à titre personnel ?",
      "Je représente une association":
        "Seules les associations agréées (ou existant depuis 2 ans avec activité réelle) peuvent représenter des consommateurs. Votre association remplit-elle ces conditions ?",
    },
  },
  {
    id: "residence", label: "Résidence",
    question: "Dans quel pays résidez-vous actuellement ?",
    options: ["France", "Union européenne", "Hors Union européenne", "Je préfère ne pas préciser"],
  },
  {
    id: "localisation", label: "Lieu achat",
    question: "Dans quel pays l'achat ou la prestation a-t-elle eu lieu ?",
    options: ["France", "Union européenne", "Hors Union européenne", "Achat en ligne", "Je ne sais pas"],
    clarif: {
      "Hors Union européenne": "La loi française s'applique principalement aux achats en France et dans l'UE. L'entreprise vendeuse est-elle française ou européenne ?",
    },
  },
];

// ═══════════════════════════════════════════════════════════
// BLOC 3 — Questions fixes de fin
// ═══════════════════════════════════════════════════════════
const STEPS_FIN = [
  {
    id: "similaires", label: "Collectif",
    question: "Savez-vous si d'autres consommateurs ont rencontré le même problème ?",
    options: [
      "Oui, beaucoup (réseaux sociaux, presse…)",
      "Oui, quelques cas autour de moi",
      "Je pense que oui mais je ne suis pas sûr",
      "Non / Je ne sais pas",
    ],
  },
  {
    id: "similaires_source", label: "Source",
    question: "Comment avez-vous eu connaissance de ces situations similaires ?",
    options: ["Forums internet", "Réseaux sociaux", "Articles de presse", "Associations de consommateurs", "Témoignages de proches", "Autre"],
    multiSelect: true,
    skipIf: (a) => !a.similaires?.includes("Oui"),
  },
  {
    id: "prejudice_corpo", label: "Préjudice corporel",
    question: "Avez-vous subi un préjudice corporel suite à ce problème (blessure, problème de santé, hospitalisation, séquelles) ?",
    options: ["Oui", "Non"],
  },
  {
    id: "prejudice_corpo_detail", label: "Type de préjudice corporel",
    question: "Quel type de préjudice corporel avez-vous subi ?",
    options: [
      "Blessure légère",
      "Problème de santé / maladie",
      "Hospitalisation",
      "Séquelles durables",
      "Décès d'un proche",
      "Autre",
    ],
    multiSelect: true,
    skipIf: (a) => a.prejudice_corpo !== "Oui",
  },
  {
    id: "prejudice_corpo_medical", label: "Suivi médical",
    question: "Avez-vous consulté un médecin ou été hospitalisé suite à ce problème ?",
    options: [
      "Oui, consultation médicale",
      "Oui, hospitalisation",
      "Non, pas encore consulté",
      "Non, pas nécessaire",
    ],
    skipIf: (a) => a.prejudice_corpo !== "Oui",
  },
  {
    id: "demarches", label: "Démarches",
    question: "Avez-vous déjà contacté l'entreprise pour résoudre le problème ?",
    options: [
      "Oui, ma demande a été refusée",
      "Oui, mais je n'ai pas reçu de réponse",
      "Oui, en cours de traitement",
      "Non, pas encore",
    ],
  },
  {
    id: "montant", label: "Montant",
    question: "Avez-vous une idée du montant financier du préjudice ?",
    options: [
      "Moins de 50€",
      "Entre 50€ et 300€",
      "Entre 300€ et 1 000€",
      "Plus de 1 000€",
      "Je ne sais pas / préjudice non financier",
    ],
  },
  {
    id: "documents", label: "Preuves",
    question: "Disposez-vous de documents liés à cette situation ?",
    options: [
      "Facture / preuve d'achat",
      "Contrat ou conditions générales",
      "Échanges avec l'entreprise",
      "Photos / captures d'écran",
      "Documents médicaux",
      "Plusieurs de ces éléments",
      "Aucun document",
    ],
    multiSelect: true,
  },
  {
    id: "rgpd_consent", label: "Consentement",
    question: "Souhaitez-vous que vos informations soient sauvegardées pour bénéficier de la veille automatique et des alertes de prescription ?",
    options: [
      "Oui, j'accepte la sauvegarde et les alertes",
      "Non, analyse unique sans sauvegarde",
    ],
  },
  {
    id: "participation", label: "Action collective",
    question: "Si d'autres consommateurs sont concernés, seriez-vous prêt à participer à une action collective ?",
    options: ["Oui, tout à fait", "Peut-être, selon les informations", "Non"],
    last: true,
  },
];

// ── Composant champ date dans conversation ────────────────
function ConvDateInput({ placeholder, onSubmit }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ marginTop:8, maxWidth:"80%", display:"flex", gap:8 }}>
      <input
        style={{ flex:1, padding:"9px 12px", border:"1.5px solid #E5E7EB", borderRadius:8, fontSize:13, fontFamily:"Calibri, sans-serif", outline:"none", background:"#F7F5F0", color:"#0A1628" }}
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder || "JJ/MM/AAAA"}
        onKeyDown={e => { if (e.key === "Enter" && val.trim()) onSubmit(val); }}
        autoFocus
      />
      <button
        onClick={() => { if (val.trim()) onSubmit(val); }}
        disabled={!val.trim()}
        style={{ padding:"9px 14px", background:"#0A1628", color:"#C9A84C", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, opacity: val.trim() ? 1 : 0.4 }}>
        →
      </button>
    </div>
  );
}

// ── Composant multi-select dans conversation ──────────────
function ConvMultiSelect({ options, onSubmit }) {
  const [selected, setSelected] = useState([]);
  const toggle = (opt) => setSelected(prev =>
    prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
  );
  return (
    <div style={{ marginTop:8, maxWidth:"80%", display:"flex", flexDirection:"column", gap:6 }}>
      {options.map((opt, i) => {
        const checked = selected.includes(opt);
        return (
          <button key={i} onClick={() => toggle(opt)}
            style={{ padding:"9px 14px", background: checked ? "#FFF8E7" : "#F7F5F0", border: checked ? "1.5px solid #C9A84C" : "1.5px solid #E5E7EB", borderRadius:8, cursor:"pointer", fontSize:13, color:"#0A1628", textAlign:"left", fontFamily:"Calibri, sans-serif", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ width:18, height:18, borderRadius:4, border: checked ? "2px solid #C9A84C" : "2px solid #D1D5DB", background: checked ? "#C9A84C" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"#fff", fontSize:11, fontWeight:"bold" }}>
              {checked ? "✓" : ""}
            </span>
            {opt}
          </button>
        );
      })}
      <button
        onClick={() => { if (selected.length > 0) onSubmit(selected.join(", ")); }}
        disabled={selected.length === 0}
        style={{ padding:"9px 14px", background:"#0A1628", color:"#C9A84C", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"Calibri, sans-serif", opacity: selected.length > 0 ? 1 : 0.4, marginTop:4 }}>
        Valider ({selected.length}) →
      </button>
    </div>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("debut");

  // Bloc 1
  const [debutIndex, setDebutIndex] = useState(0);
  const [debutAnswers, setDebutAnswers] = useState({});
  const [clarif, setClarif] = useState(null);
  const [clarifInput, setClarifInput] = useState("");

  // Bloc 2 — conversation
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);
  const [conversationDone, setConversationDone] = useState(false);
  const [extractedData, setExtractedData] = useState({});

  // Bloc 3
  const [finIndex, setFinIndex] = useState(0);
  const [finAnswers, setFinAnswers] = useState({});
  const [multiSelected, setMultiSelected] = useState([]);

  // Identification producteur
  const [producteurLoading, setProducteurLoading] = useState(false);

  // Formulaire contact RGPD
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({ nom:"", prenom:"", email:"", telephone:"", adresse:"" });
  const [contactErrors, setContactErrors] = useState({});
  const [pendingFinAnswers, setPendingFinAnswers] = useState(null);

  // Résultats
  const [isLoading, setIsLoading] = useState(false);
  const [analyse, setAnalyse] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, agentLoading]);

  // ── API helper ───────────────────────────────────────────
  function extractText(data) {
    if (Array.isArray(data.content)) {
      const block = data.content.find(b => b.type === "text" || b.text);
      if (block?.text) return block.text;
    }
    return data.reply || data.message || data.text || JSON.stringify(data);
  }

  async function callAPI(messages, system) {
    const body = system ? { messages, system } : { messages };
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    return extractText(await response.json());
  }

  // ═══════════════════════════════════════════════════════
  // BLOC 1
  // ═══════════════════════════════════════════════════════
  const currentDebutStep = STEPS_DEBUT[debutIndex];

  function handleDebutOption(option) {
    if (currentDebutStep.clarif?.[option] && !clarif) {
      setClarif({ message: currentDebutStep.clarif[option], pendingAnswer: option });
      return;
    }
    saveDebut(option);
  }

  function saveDebut(value) {
    const newAnswers = { ...debutAnswers, [currentDebutStep.id]: value };
    setDebutAnswers(newAnswers);
    setClarif(null);
    setClarifInput("");
    if (debutIndex + 1 >= STEPS_DEBUT.length) {
      setPhase("conversation");
      startConversation(newAnswers);
    } else {
      setDebutIndex(i => i + 1);
    }
  }

  // ═══════════════════════════════════════════════════════
  // BLOC 2 — Agent conversationnel
  // ═══════════════════════════════════════════════════════
  function getNextConvQuestion(conv, desc) {
    const d = desc.toLowerCase();
    const asked = conv.filter(m => m.role === "assistant" && m.id).map(m => m.id);

    if (!asked.includes("date") && !d.match(/20(2[0-9])|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|mois|semaine|hier|cette année/)) {
      return { id:"date", content:"Quelle est la date d'achat ou de début du problème ?", type:"date",
        placeholder:"JJ/MM/AAAA ou MM/AAAA", options:[] };
    }
    if (!asked.includes("corpo") && (d.includes("malade") || d.includes("symptôme") || d.includes("nausée") || d.includes("vomis") || d.includes("blessé") || d.includes("allergi") || d.includes("hospitali") || d.includes("bébé") || d.includes("enfant"))) {
      return { id:"corpo", content:"Quel type de préjudice corporel ?", multiSelect:true,
        options:["Nausées / vomissements","Réaction allergique","Hospitalisation","Blessure","Séquelles durables","Aucun symptôme"] };
    }
    if (!asked.includes("preuve")) {
      return { id:"preuve", content:"Disposez-vous d'une preuve d'achat ?", multiSelect:true,
        options:["Ticket de caisse","Facture","Relevé bancaire","Photo de l'emballage","Aucune preuve"] };
    }
    return null;
  }

  function startConversation(answers) {
    setConversation([{ role:"assistant", id:"intro",
      content:"Décrivez votre problème en quelques mots.", options:[] }]);
  }

  async function sendMessage(optionalValue) {
    const val = (optionalValue !== undefined ? optionalValue : userInput).trim();
    if (!val || agentLoading) return;
    setUserInput("");

    const lastAgent = conversation[conversation.length - 1];
    if (lastAgent?.id && lastAgent.role === "assistant") {
      lastAgent.userAnswer = val;
    }
    const newConv = [...conversation, { role:"user", content: val }];
    setConversation(newConv);

    const firstUserMsg = newConv.find(m => m.role === "user")?.content || "";

    // ── Après la description initiale → identifier le producteur ──────────
    const alreadyAsked = newConv.filter(m => m.role === "assistant" && m.id).map(m => m.id);
    const isFirstDescription = newConv.filter(m => m.role === "user").length === 1;

    if (isFirstDescription && !alreadyAsked.includes("producteur")) {
      setProducteurLoading(true);
      setConversation(prev => [...prev, {
        role:"assistant", id:"producteur_loading",
        content:"Identification du producteur en cours…", options:[]
      }]);

      try {
        const text = await callAPI([{ role:"user", content:
          `L'utilisateur décrit ce problème : "${val}"

Identifie le fabricant / producteur / fournisseur principal du produit ou service mentionné.
Utilise tes connaissances et si nécessaire infère à partir du contexte.

Retourne UNIQUEMENT un JSON :
{
  "producteur": "Nom exact de l'entreprise productrice (ex: Apple Inc., Samsung, Netflix...)",
  "certitude": "haute | moyenne | faible",
  "explication": "1 phrase expliquant pourquoi (ex: MacBook est un produit fabriqué par Apple)"
}

Si tu ne peux pas identifier le producteur, retourne {"producteur": null, "certitude": "faible", "explication": "Producteur non identifiable"}`
        }]);
        const clean = text.replace(/\`\`\`json|\`\`\`/g,"").trim();
        const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
        let prodData = { producteur: null, certitude: "faible", explication: "" };
        if (s >= 0 && e > s) prodData = JSON.parse(clean.slice(s, e+1));

        setProducteurLoading(false);

        if (prodData.producteur && prodData.certitude !== "faible") {
          // Remplacer le message loading par la confirmation
          setConversation(prev => {
            const filtered = prev.filter(m => m.id !== "producteur_loading");
            return [...filtered, {
              role: "assistant",
              id: "producteur",
              content: `J'ai identifié le producteur : **${prodData.producteur}**
${prodData.explication}

Pouvez-vous confirmer ?`,
              producteur: prodData.producteur,
              options: [
                `Oui, c'est bien ${prodData.producteur}`,
                "Non, ce n'est pas ça",
                "Je ne sais pas"
              ]
            }];
          });
        } else {
          // Producteur non identifié → demander directement
          setConversation(prev => {
            const filtered = prev.filter(m => m.id !== "producteur_loading");
            return [...filtered, {
              role: "assistant",
              id: "producteur",
              content: "Pouvez-vous me préciser le nom de l'entreprise ou du fabricant du produit concerné ?",
              type: "text_input",
              options: ["Je ne connais pas le fabricant"]
            }];
          });
        }
      } catch {
        setProducteurLoading(false);
        setConversation(prev => {
          const filtered = prev.filter(m => m.id !== "producteur_loading");
          return [...filtered, {
            role: "assistant",
            id: "producteur",
            content: "Pouvez-vous me préciser le nom de l'entreprise ou du fabricant du produit concerné ?",
            type: "text_input",
            options: ["Je ne connais pas le fabricant"]
          }];
        });
      }
      return;
    }

    // ── Réponse à la confirmation producteur ─────────────────────────────
    if (alreadyAsked.includes("producteur") && !alreadyAsked.includes("producteur_confirmed")) {
      // Sauvegarder le producteur confirmé
      const prodMsg = newConv.find(m => m.role === "assistant" && m.id === "producteur");
      let producteurFinal = val;
      if (val.startsWith("Oui") && prodMsg?.producteur) {
        producteurFinal = prodMsg.producteur;
      } else if (val === "Je ne sais pas" || val === "Je ne connais pas le fabricant") {
        producteurFinal = "";
      }
      setExtractedData(prev => ({ ...prev, entreprise: producteurFinal }));

      // Marquer comme confirmé et passer aux questions suivantes
      const confirmMsg = {
        role: "assistant",
        id: "producteur_confirmed",
        content: producteurFinal
          ? `✓ Producteur enregistré : ${producteurFinal}`
          : "✓ Producteur non renseigné — nous continuerons avec les informations disponibles.",
        options: []
      };
      setConversation(prev => [...prev, confirmMsg]);

      // Lancer la suite des questions
      const nextQ = getNextConvQuestion([...newConv, confirmMsg], firstUserMsg);
      if (nextQ) {
        setTimeout(() => setConversation(prev => [...prev, { role:"assistant", ...nextQ }]), 300);
      } else {
        setAgentLoading(true);
        try {
          const text = await callAPI([{ role:"user", content:
            `Extrais les infos et retourne UNIQUEMENT un JSON :
{"entreprise":"${producteurFinal}","type_produit":"...","probleme":"...","date":"...","prejudice":"...","details":"résumé"}
Description : ${firstUserMsg}` }]);
          const clean = text.replace(/\`\`\`json|\`\`\`/g,"").trim();
          const s = clean.indexOf("{"), e2 = clean.lastIndexOf("}");
          if (s>=0 && e2>s) setExtractedData(JSON.parse(clean.slice(s,e2+1)));
        } catch {}
        setAgentLoading(false);
        setConversation(prev => [...prev, { role:"assistant", id:"fin", content:"Merci, j'ai toutes les informations.", options:[] }]);
        setConversationDone(true);
      }
      return;
    }

    // ── Questions normales (date, preuves…) ───────────────────────────────
    const nextQ = getNextConvQuestion(newConv, firstUserMsg);
    if (nextQ) {
      setConversation(prev => [...prev, { role:"assistant", ...nextQ }]);
    } else {
      setAgentLoading(true);
      const convData = {};
      newConv.filter(m => m.role === "assistant" && m.id).forEach(m => { if (m.userAnswer) convData[m.id] = m.userAnswer; });
      try {
        const text = await callAPI([{ role:"user", content:
          `Extrais les infos de cette conversation et retourne UNIQUEMENT un JSON :
{"entreprise":"...","type_produit":"...","probleme":"...","date":"...","prejudice":"...","details":"résumé"}
Description : ${firstUserMsg}
Données collectées : ${JSON.stringify(convData)}` }]);
        const clean = text.replace(/\`\`\`json|\`\`\`/g,"").trim();
        const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
        if (s>=0 && e>s) setExtractedData(JSON.parse(clean.slice(s,e+1)));
      } catch {}
      setAgentLoading(false);
      setConversation(prev => [...prev, { role:"assistant", id:"fin",
        content:"Merci, j'ai toutes les informations.", options:[] }]);
      setConversationDone(true);
    }
  }

  function passToFin() {
    setFinIndex(0);
    setPhase("fin");
  }

  // ═══════════════════════════════════════════════════════
  // BLOC 3
  // ═══════════════════════════════════════════════════════
  const activeFin = STEPS_FIN.filter(s => {
    if (s.skipIf && s.skipIf({ ...finAnswers, ...extractedData })) return false;
    return true;
  });
  const currentFinStep = activeFin[finIndex];

  function handleFinOption(option) {
    const newAnswers = { ...finAnswers, [currentFinStep.id]: option };
    setFinAnswers(newAnswers);
    setMultiSelected([]);

    // Si RGPD = Oui → ouvrir le formulaire de contact avant de continuer
    if (currentFinStep.id === "rgpd_consent" && option.startsWith("Oui")) {
      setPendingFinAnswers(newAnswers);
      setShowContactForm(true);
      return;
    }

    if (currentFinStep.last) {
      launchAnalysis(newAnswers);
      return;
    }
    let next = finIndex + 1;
    while (next < activeFin.length) {
      if (activeFin[next].skipIf?.({ ...newAnswers, ...extractedData })) { next++; continue; }
      break;
    }
    if (next >= activeFin.length) launchAnalysis(newAnswers);
    else setFinIndex(next);
  }

  function validateContact() {
    const errors = {};
    if (!contactInfo.nom.trim()) errors.nom = "Requis";
    if (!contactInfo.prenom.trim()) errors.prenom = "Requis";
    if (!contactInfo.email.trim() || !contactInfo.email.includes("@")) errors.email = "Email invalide";
    if (!contactInfo.telephone.trim()) errors.telephone = "Requis";
    if (!contactInfo.adresse.trim()) errors.adresse = "Requis";
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function submitContactForm() {
    if (!validateContact()) return;
    // Fusionner les coordonnées dans les réponses
    const newAnswers = { ...pendingFinAnswers, ...contactInfo };
    setFinAnswers(newAnswers);
    setShowContactForm(false);
    // Continuer le questionnaire après rgpd_consent
    const rgpdIdx = activeFin.findIndex(s => s.id === "rgpd_consent");
    let next = rgpdIdx + 1;
    while (next < activeFin.length) {
      if (activeFin[next].skipIf?.({ ...newAnswers, ...extractedData })) { next++; continue; }
      break;
    }
    if (next >= activeFin.length) launchAnalysis(newAnswers);
    else setFinIndex(next);
  }

  // ═══════════════════════════════════════════════════════
  // ANALYSE + SAUVEGARDE SUPABASE
  // ═══════════════════════════════════════════════════════
  async function launchAnalysis(finalFinAnswers) {
    setPhase("results");
    setIsLoading(true);
    const allData = { ...debutAnswers, ...extractedData, ...finalFinAnswers,
      conversation_resume: conversation.filter(m => m.role === "user").map(m => m.content).join(" | ") };

    try {
      const reply = await callAPI([{ role: "user", content: buildPrompt(allData) }]);
      const clean = reply.replace(/```json|```/g, "").trim();
      const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
      let parsed = null;
      if (s >= 0 && e > s) {
        parsed = JSON.parse(clean.slice(s, e + 1));
      } else {
        parsed = { resume: reply, scores: { compatibilite: 50, similarite: 50, faisabilite: 50, global: 50 } };
      }

      // ── SAUVEGARDE SUPABASE (si consentement RGPD donné) ──
      if (finalFinAnswers.rgpd_consent === "Oui, j'accepte la sauvegarde et les alertes") {
        try {
          const saveRes = await fetch("/api/save-dossier", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dossier: {
                ...debutAnswers,
                ...extractedData,
                ...finalFinAnswers,
                conversation_resume: conversation
                  .filter(m => m.role === "user")
                  .map(m => m.content)
                  .join(" | "),
              },
              analyse: parsed,
            }),
          });
          const saveData = await saveRes.json();

          // Si clustering détecté → enrichir le message action de groupe
          if (saveData.clustering_alerte && parsed.action_groupe) {
            parsed.action_groupe = {
              ...parsed.action_groupe,
              potentiel: "élevé",
              message: (parsed.action_groupe.message || "") +
                " D'autres consommateurs ont déjà signalé le même problème dans notre base — une action collective est possible.",
            };
          }
        } catch (saveErr) {
          // Ne pas bloquer l'affichage des résultats si la sauvegarde échoue
          console.error("[save-dossier]", saveErr);
        }
      }

      setAnalyse(parsed);
    } catch (err) {
      setAnalyse({ resume: `Erreur : ${err.message}`, scores: { compatibilite: 0, similarite: 0, faisabilite: 0, global: 0 } });
    }
    setIsLoading(false);
  }

  function buildPrompt(a) {
    const lignes = Object.entries(a).filter(([k, v]) => v).map(([k, v]) => `- ${k.replace(/_/g, " ")} : ${v}`).join("\n");
    return `Tu es AVOCACTION, agent IA spécialisé en droit de la consommation français (loi n° 2025-391 du 30 avril 2025).

Points de droit clés :
- Prescription produit : 2 ans Art. L217-4 C. conso
- Prescription faits : 5 ans Art. 2224 C. civil
- Préjudice corporel : délai adhésion jusqu'à 5 ans, réparation intégrale
- Double procédure : responsabilité PUIS réparation (opt-in)

Données collectées :
${lignes}

Retourne UNIQUEMENT un JSON valide :
{
  "entreprise": "nom identifié",
  "resume": "2-3 phrases résumant la situation de façon claire et personnalisée",
  "prescription": {
    "statut": "favorable | attention | urgent",
    "message": "explication précise des délais applicables selon le type de problème",
    "expiration": "date ou période d'expiration"
  },
  "rappel": {
    "existe": true/false,
    "message": "détail sur le rappel ou l'alerte"
  },
  "action_groupe": {
    "potentiel": "élevé | moyen | faible",
    "message": "explication du potentiel d'action collective"
  },
  "scores": {
    "compatibilite": <0-100>,
    "similarite": <0-100>,
    "faisabilite": <0-100>,
    "global": <moyenne arrondie des 3 scores>
  },
  "recommandation": "conseil personnalisé et actionnable en 2-3 phrases",
  "etapes": ["action prioritaire 1", "action prioritaire 2", "action prioritaire 3"],
  "urgence": "haute | normale | faible"
}`;
  }

  function reset() {
    setStarted(false); setPhase("debut"); setDebutIndex(0); setDebutAnswers({});
    setClarif(null); setClarifInput(""); setConversation([]); setUserInput("");
    setAgentLoading(false); setConversationDone(false); setExtractedData({});
    setFinIndex(0); setFinAnswers({}); setMultiSelected([]);
    setIsLoading(false); setAnalyse(null);
  }

  // ═══════════════════════════════════════════════════════
  // RENDU — Landing
  // ═══════════════════════════════════════════════════════
  if (!started) {
    return (
      <div style={S.landingPage}>
        <div style={S.landingHeader}>
          <span style={S.logo}>⚖ AVOC<span style={S.logoGold}>ACTION</span></span>
          <span style={S.subtitle}>Agent IA · Droit de la Consommation</span>
        </div>
        <div style={S.landingHero}>
          <div style={S.landingBadge}>Loi n° 2025-391 du 30 avril 2025</div>
          <h1 style={S.landingTitle}>La justice collective,<br /><span style={S.landingTitleGold}>accessible à tous.</span></h1>
          <p style={S.landingSubtitle}>AVOCACTION analyse votre situation, recherche les actions de groupe existantes et vérifie vos délais de prescription — en moins de 3 minutes.</p>
          <button onClick={() => setStarted(true)} style={S.landingCTA}
            onMouseEnter={e => e.currentTarget.style.background = "#B8962A"}
            onMouseLeave={e => e.currentTarget.style.background = "#C9A84C"}>
            Analyser ma situation →
          </button>
          <p style={S.landingCTASub}>Confidentiel · Résultat immédiat</p>
        </div>
        <div style={S.landingFeatures}>
          {[
            { icon: "🔍", titre: "Registre officiel", desc: "Consultation automatique du registre des actions de groupe 2025 du Ministère de la Justice" },
            { icon: "⏱️", titre: "Surveillance prescription", desc: "Vérification des délais légaux (2 ans produit, 5 ans faits) avec alertes automatiques" },
            { icon: "🧠", titre: "Agent IA conversationnel", desc: "Analyse votre description et ne pose que les questions vraiment nécessaires" },
            { icon: "🔔", titre: "Clustering clients", desc: "Détection de cas similaires — vous pouvez rejoindre une action existante" },
          ].map((f, i) => (
            <div key={i} style={S.landingFeatureCard}>
              <div style={S.landingFeatureIcon}>{f.icon}</div>
              <div style={S.landingFeatureTitle}>{f.titre}</div>
              <div style={S.landingFeatureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={S.landingSteps}>
          <h2 style={S.landingH2}>Comment ça marche ?</h2>
          <div style={S.landingStepsRow}>
            {[
              { n: "1", titre: "3 questions rapides", desc: "Cadre, résidence, lieu d'achat" },
              { n: "2", titre: "Décrivez votre situation", desc: "L'agent analyse et pose uniquement les questions manquantes" },
              { n: "3", titre: "Résultat immédiat", desc: "Score de faisabilité, délais, recommandations personnalisées" },
            ].map((s, i) => (
              <div key={i} style={S.landingStep}>
                <div style={S.landingStepN}>{s.n}</div>
                <div style={S.landingStepTitle}>{s.titre}</div>
                <div style={S.landingStepDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={S.landingBottom}>
          <button onClick={() => setStarted(true)} style={S.landingCTA}
            onMouseEnter={e => e.currentTarget.style.background = "#B8962A"}
            onMouseLeave={e => e.currentTarget.style.background = "#C9A84C"}>
            Commencer l'analyse →
          </button>
          <p style={S.landingLegal}>Loi n° 2025-391 · Art. L217-4 C. conso · Art. 2224 C. civil</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RENDU — Résultats
  // ═══════════════════════════════════════════════════════
  if (phase === "results") {
    const sc = (v) => v >= 75 ? "#2D7D4E" : v >= 50 ? "#C9A84C" : "#C0392B";
    const sl = (v) => v >= 75 ? "Élevé" : v >= 50 ? "Moyen" : "Faible";
    const urgC = { haute: "#C0392B", normale: "#C9A84C", faible: "#2D7D4E" };
    const potC = { "élevé": "#2D7D4E", moyen: "#C9A84C", faible: "#C0392B" };
    const preC = { favorable: "#2D7D4E", attention: "#C9A84C", urgent: "#C0392B" };

    if (analyse?.scores) {
      const { compatibilite: c, similarite: s2, faisabilite: f } = analyse.scores;
      if ((c > 0 || s2 > 0 || f > 0) && Math.abs(analyse.scores.global - Math.round((c+s2+f)/3)) > 20)
        analyse.scores.global = Math.round((c + s2 + f) / 3);
    }

    return (
      <div style={S.resultsPage}>
        <div style={S.resultsHeader}>
          <span style={S.logo}>⚖ AVOC<span style={S.logoGold}>ACTION</span></span>
          <span style={S.subtitle}>Analyse de votre dossier</span>
          <button onClick={reset} style={S.newAnalysisBtn}>+ Nouvelle analyse</button>
        </div>
        {isLoading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, gap:24, padding:60 }}>
            <div style={{ fontSize:48 }}>⚖️</div>
            <div style={{ color:"#C9A84C", fontSize:18, fontFamily:"Palatino Linotype, serif" }}>Analyse en cours…</div>
            <div style={{ color:"#8B9AB0", fontSize:13, fontFamily:"Calibri, sans-serif", textAlign:"center", maxWidth:400 }}>
              Recherche dans le registre officiel, vérification des délais, analyse de faisabilité collective…
            </div>
            <div style={S.typing}>
              <span style={{ ...S.dot, animationDelay:"0s" }} />
              <span style={{ ...S.dot, animationDelay:"0.2s" }} />
              <span style={{ ...S.dot, animationDelay:"0.4s" }} />
            </div>
          </div>
        ) : analyse ? (
          <div style={S.resultsBody}>
            <div style={S.rCard}>
              <div style={S.rCardHeader}>
                <span style={S.rIcon}>📋</span>
                <span style={S.rCardTitle}>Résumé du dossier</span>
                {analyse.entreprise && <span style={S.rBadgeGray}>{analyse.entreprise}</span>}
                {analyse.urgence && <span style={{ ...S.rBadge, background:(urgC[analyse.urgence]||"#C9A84C")+"22", color:urgC[analyse.urgence]||"#C9A84C", border:`1px solid ${urgC[analyse.urgence]||"#C9A84C"}` }}>Urgence {analyse.urgence}</span>}
              </div>
              <p style={S.rText}>{analyse.resume}</p>
            </div>

            {analyse.scores && (
              <div style={S.rCard}>
                <div style={S.rCardHeader}>
                  <span style={S.rIcon}>📊</span>
                  <span style={S.rCardTitle}>Score de faisabilité collective</span>
                  <span style={{ fontSize:28, fontWeight:"bold", color:sc(analyse.scores.global), marginLeft:"auto", fontFamily:"Palatino Linotype, serif" }}>
                    {analyse.scores.global}/100
                  </span>
                </div>
                <div style={{ display:"flex", gap:16, marginTop:8, flexWrap:"wrap" }}>
                  {[{label:"Compatibilité externe",key:"compatibilite"},{label:"Similarité interne",key:"similarite"},{label:"Faisabilité collective",key:"faisabilite"}].map(({ label, key }) => {
                    const val = analyse.scores[key] || 0;
                    return (
                      <div key={key} style={{ flex:1, minWidth:160 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ fontSize:12, color:"#6B7280", fontFamily:"Calibri, sans-serif" }}>{label}</span>
                          <span style={{ fontSize:13, fontWeight:"bold", color:sc(val) }}>{val}/100</span>
                        </div>
                        <div style={{ height:8, background:"#E5E7EB", borderRadius:4, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${val}%`, background:sc(val), borderRadius:4, transition:"width 1s ease" }} />
                        </div>
                        <div style={{ fontSize:11, color:sc(val), marginTop:4, fontFamily:"Calibri, sans-serif" }}>{sl(val)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {analyse.prescription && (
                <div style={{ ...S.rCard, flex:1, minWidth:220, borderTop:`4px solid ${preC[analyse.prescription.statut]||"#C9A84C"}` }}>
                  <div style={S.rCardHeader}>
                    <span style={S.rIcon}>⏱️</span>
                    <span style={S.rCardTitle}>Prescription</span>
                    <span style={{ ...S.rBadge, background:(preC[analyse.prescription.statut]||"#C9A84C")+"22", color:preC[analyse.prescription.statut]||"#C9A84C", border:`1px solid ${preC[analyse.prescription.statut]||"#C9A84C"}` }}>
                      {analyse.prescription.statut === "favorable" ? "✓ Favorable" : analyse.prescription.statut === "urgent" ? "⚠ Urgent" : "ℹ Attention"}
                    </span>
                  </div>
                  <p style={S.rTextSm}>{analyse.prescription.message}</p>
                  {analyse.prescription.expiration && <p style={{ ...S.rTextSm, color:"#C9A84C", fontWeight:"bold" }}>Expiration : {analyse.prescription.expiration}</p>}
                </div>
              )}
              {analyse.rappel && (
                <div style={{ ...S.rCard, flex:1, minWidth:220, borderTop:`4px solid ${analyse.rappel.existe ? "#C0392B" : "#2D7D4E"}` }}>
                  <div style={S.rCardHeader}>
                    <span style={S.rIcon}>{analyse.rappel.existe ? "🚨" : "✅"}</span>
                    <span style={S.rCardTitle}>Rappel officiel</span>
                    <span style={{ ...S.rBadge, background:analyse.rappel.existe?"#FEF2F2":"#F0FFF4", color:analyse.rappel.existe?"#C0392B":"#2D7D4E", border:`1px solid ${analyse.rappel.existe?"#C0392B":"#2D7D4E"}` }}>
                      {analyse.rappel.existe ? "Confirmé" : "Non détecté"}
                    </span>
                  </div>
                  <p style={S.rTextSm}>{analyse.rappel.message}</p>
                </div>
              )}
              {analyse.action_groupe && (
                <div style={{ ...S.rCard, flex:1, minWidth:220, borderTop:`4px solid ${potC[analyse.action_groupe.potentiel]||"#C9A84C"}` }}>
                  <div style={S.rCardHeader}>
                    <span style={S.rIcon}>⚖️</span>
                    <span style={S.rCardTitle}>Action de groupe</span>
                    <span style={{ ...S.rBadge, background:(potC[analyse.action_groupe.potentiel]||"#C9A84C")+"22", color:potC[analyse.action_groupe.potentiel]||"#C9A84C", border:`1px solid ${potC[analyse.action_groupe.potentiel]||"#C9A84C"}` }}>
                      Potentiel {analyse.action_groupe.potentiel}
                    </span>
                  </div>
                  <p style={S.rTextSm}>{analyse.action_groupe.message}</p>
                </div>
              )}
            </div>

            {analyse.recommandation && (
              <div style={{ ...S.rCard, background:"#0F2040", border:"1px solid #C9A84C" }}>
                <div style={S.rCardHeader}>
                  <span style={S.rIcon}>💡</span>
                  <span style={{ ...S.rCardTitle, color:"#C9A84C" }}>Recommandation</span>
                </div>
                <p style={{ ...S.rText, color:"#E8E4DC" }}>{analyse.recommandation}</p>
              </div>
            )}

            {analyse.etapes && (
              <div style={S.rCard}>
                <div style={S.rCardHeader}>
                  <span style={S.rIcon}>🎯</span>
                  <span style={S.rCardTitle}>Prochaines étapes</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:4 }}>
                  {analyse.etapes.map((e, i) => (
                    <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:"#0A1628", color:"#C9A84C", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:"bold", flexShrink:0 }}>{i+1}</div>
                      <p style={{ ...S.rText, margin:0, paddingTop:4 }}>{e}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        ) : (
          <div style={{ padding:40, color:"#8B9AB0", textAlign:"center" }}>Chargement…</div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RENDU — Questionnaire
  // ═══════════════════════════════════════════════════════
  const totalSteps = STEPS_DEBUT.length + 1 + activeFin.length;
  const currentGlobal = phase === "debut" ? debutIndex : phase === "conversation" ? STEPS_DEBUT.length : STEPS_DEBUT.length + 1 + finIndex;
  const progress = Math.round((currentGlobal / totalSteps) * 100);

  return (
    <div style={S.quizPage}>
      <div style={S.quizHeader}>
        <span style={S.logo}>⚖ AVOC<span style={S.logoGold}>ACTION</span></span>
        <div style={S.quizProgress}>
          <span style={S.stepCounter}>{currentGlobal + 1} / {totalSteps}</span>
          <div style={S.progressBar}><div style={{ ...S.progressFill, width:`${progress}%` }} /></div>
        </div>
      </div>

      {phase === "debut" && (
        <div style={S.questionContainer}>
          <div style={S.stepLabel}>{currentDebutStep.label}</div>
          <p style={S.question}>{currentDebutStep.question}</p>
          {clarif ? (
            <div style={S.clarifBox}>
              <p style={S.clarifMsg}>{clarif.message}</p>
              <textarea style={S.clarifInput} value={clarifInput} onChange={e => setClarifInput(e.target.value)}
                placeholder="Votre précision…" rows={2}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveDebut(clarif.pendingAnswer + (clarifInput ? " — " + clarifInput : "")); } }}
                autoFocus />
              <div style={S.clarifButtons}>
                <button onClick={() => saveDebut(clarif.pendingAnswer + (clarifInput ? " — " + clarifInput : ""))} style={S.clarifConfirm}>Confirmer</button>
                <button onClick={() => saveDebut(clarif.pendingAnswer)} style={S.clarifSkip}>Passer</button>
              </div>
            </div>
          ) : (
            <div style={S.optionsGrid}>
              {currentDebutStep.options.map(opt => (
                <button key={opt} onClick={() => handleDebutOption(opt)} style={S.optionBtn}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.background = "#FFF8E7"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#FFFFFF"; }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
          {debutIndex > 0 && !clarif && (
            <button onClick={() => { setDebutIndex(i => i - 1); setClarif(null); }} style={S.backBtn}>← Retour</button>
          )}
        </div>
      )}

      {phase === "conversation" && (
        <div style={S.convContainer}>
          <div style={S.convChat}>
            {conversation.map((m, i) => (
              <div key={i} style={{ ...S.convMsg, ...(m.role === "user" ? S.convMsgUser : S.convMsgAgent) }}>
                {m.role === "assistant" && <div style={S.convRole}>⚖ Agent AVOCACTION</div>}
                <div style={{ ...S.convBubble, ...(m.role === "user" ? S.convBubbleUser : S.convBubbleAgent) }}>
                  {m.content.split(/(\*\*[^*]+\*\*)/).map((part, pi) =>
                    part.startsWith("**") && part.endsWith("**")
                      ? <strong key={pi} style={{ color:"#C9A84C" }}>{part.slice(2,-2)}</strong>
                      : part.split("\n").map((line, li) => <span key={li}>{line}{li < part.split("\n").length-1 && <br/>}</span>)
                  )}
                </div>
                {m.role === "assistant" && m.type === "date" && i === conversation.length - 1 && !conversationDone && (
                  <ConvDateInput placeholder={m.placeholder} onSubmit={sendMessage} />
                )}
                {m.role === "assistant" && m.options && m.options.length > 0 && i === conversation.length - 1 && !conversationDone && m.multiSelect && (
                  <ConvMultiSelect options={m.options} onSubmit={sendMessage} />
                )}
                {m.role === "assistant" && m.options && m.options.length > 0 && i === conversation.length - 1 && !conversationDone && !m.multiSelect && (
                  <div style={S.convOptions}>
                    {m.options.map((opt, j) => (
                      <button key={j}
                        onClick={() => sendMessage(opt)}
                        style={S.convOptionBtn}
                        onMouseEnter={e => { e.currentTarget.style.background = "#FFF8E7"; e.currentTarget.style.borderColor = "#C9A84C"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#F7F5F0"; e.currentTarget.style.borderColor = "#E5E7EB"; }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {agentLoading && (
              <div style={{ ...S.convMsg, ...S.convMsgAgent }}>
                <div style={S.convRole}>⚖ Agent AVOCACTION</div>
                <div style={{ ...S.convBubble, ...S.convBubbleAgent }}>
                  <div style={S.typing}>
                    <span style={{ ...S.dot, animationDelay:"0s" }} />
                    <span style={{ ...S.dot, animationDelay:"0.2s" }} />
                    <span style={{ ...S.dot, animationDelay:"0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {conversationDone ? (
            <div style={S.convDoneBox}>
              <p style={S.convDoneText}>✓ L'agent a collecté toutes les informations nécessaires.</p>
              <button onClick={passToFin} style={S.submitBtn}>Continuer vers l'analyse →</button>
            </div>
          ) : (
            <>
              <div style={S.convInputRow}>
                <textarea style={S.convInput} value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder="Décrivez votre situation ou répondez à la question…"
                  rows={3}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  disabled={agentLoading} />
                <button onClick={sendMessage}
                  style={{ ...S.convSendBtn, opacity: userInput.trim() && !agentLoading ? 1 : 0.4 }}
                  disabled={!userInput.trim() || agentLoading}>→</button>
              </div>
              <p style={S.hint}>Entrée pour envoyer · Maj+Entrée pour saut de ligne</p>
            </>
          )}
        </div>
      )}

      {/* ── FORMULAIRE CONTACT RGPD ── */}
      {showContactForm && (
        <div style={S.questionContainer}>
          <div style={S.stepLabel}>Vos coordonnées</div>
          <p style={S.question}>Pour vous recontacter et activer la veille personnalisée</p>
          <p style={{ fontSize:12, color:S_GREY, fontFamily:"Calibri, sans-serif", margin:"-8px 0 4px" }}>
            Vos données sont protégées conformément à notre{" "}
            <a href="/rgpd" target="_blank" style={{ color:"#C9A84C", textDecoration:"underline" }}>
              politique de confidentialité (RGPD)
            </a>
          </p>

          {[
            { id:"prenom", label:"Prénom", type:"text", placeholder:"Votre prénom" },
            { id:"nom", label:"Nom", type:"text", placeholder:"Votre nom de famille" },
            { id:"email", label:"Email", type:"email", placeholder:"votre@email.com" },
            { id:"telephone", label:"Téléphone", type:"tel", placeholder:"06 00 00 00 00" },
            { id:"adresse", label:"Adresse complète", type:"text", placeholder:"N° rue, ville, code postal" },
          ].map(field => (
            <div key={field.id} style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <label style={{ fontSize:12, fontWeight:"bold", color:"#0A1628", fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1 }}>
                {field.label} <span style={{ color:"#C0392B" }}>*</span>
              </label>
              <input
                type={field.type}
                value={contactInfo[field.id]}
                onChange={e => setContactInfo(prev => ({ ...prev, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                style={{
                  padding:"12px 14px", border: contactErrors[field.id] ? "1.5px solid #C0392B" : "1.5px solid #E5E7EB",
                  borderRadius:10, fontSize:14, fontFamily:"Calibri, sans-serif", outline:"none",
                  background:"#FFFFFF", color:"#0A1628"
                }}
              />
              {contactErrors[field.id] && (
                <span style={{ fontSize:11, color:"#C0392B", fontFamily:"Calibri, sans-serif" }}>{contactErrors[field.id]}</span>
              )}
            </div>
          ))}

          <div style={{ fontSize:11, color:"#6B7280", fontFamily:"Calibri, sans-serif", lineHeight:1.6, background:"#F7F5F0", padding:"10px 14px", borderRadius:8, border:"1px solid #E5E7EB" }}>
            En soumettant ce formulaire, vous consentez à ce que vos données personnelles soient utilisées
            pour l'analyse juridique, la veille automatique et les alertes de prescription.
            Vous pouvez retirer votre consentement à tout moment. Voir notre{" "}
            <a href="/rgpd" target="_blank" style={{ color:"#C9A84C" }}>politique de confidentialité</a>.
          </div>

          <button onClick={submitContactForm} style={S.submitBtn}>
            Valider et continuer vers l'analyse →
          </button>
          <button onClick={() => { setShowContactForm(false); setContactErrors({}); }}
            style={S.backBtn}>
            ← Annuler (analyse sans sauvegarde)
          </button>
        </div>
      )}

      {phase === "fin" && currentFinStep && !showContactForm && (
        <div style={S.questionContainer}>
          <div style={S.stepLabel}>{currentFinStep.label}</div>
          <p style={S.question}>{currentFinStep.question}</p>
          {currentFinStep.multiSelect ? (
            <div>
              <div style={S.optionsGrid}>
                {currentFinStep.options.map(opt => {
                  const checked = multiSelected.includes(opt);
                  return (
                    <button key={opt}
                      onClick={() => setMultiSelected(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])}
                      style={{ ...S.optionBtn, borderColor:checked?"#C9A84C":"#E5E7EB", background:checked?"#FFF8E7":"#FFFFFF", display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ width:20, height:20, borderRadius:4, flexShrink:0, border:checked?"2px solid #C9A84C":"2px solid #D1D5DB", background:checked?"#C9A84C":"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:"bold" }}>
                        {checked ? "✓" : ""}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => { if (multiSelected.length > 0) handleFinOption(multiSelected.join(", ")); }}
                style={{ ...S.submitBtn, marginTop:16, opacity:multiSelected.length > 0 ? 1 : 0.4 }}
                disabled={multiSelected.length === 0}>
                Valider ({multiSelected.length} sélectionné{multiSelected.length > 1 ? "s" : ""}) →
              </button>
            </div>
          ) : (
            <div style={S.optionsGrid}>
              {currentFinStep.options.map(opt => (
                <button key={opt} onClick={() => handleFinOption(opt)} style={S.optionBtn}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.background = "#FFF8E7"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#FFFFFF"; }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
          {finIndex > 0 && (
            <button onClick={() => { setFinIndex(i => Math.max(0, i-1)); setMultiSelected([]); }} style={S.backBtn}>← Retour</button>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════
const S_GREY = "#6B7280";
const S = {
  logo: { fontSize:22, fontWeight:"bold", letterSpacing:1, color:"#FFFFFF" },
  logoGold: { color:"#C9A84C" },
  subtitle: { fontSize:12, color:"#8B9AB0", fontFamily:"Calibri, sans-serif" },
  landingPage: { minHeight:"100vh", background:"#0A1628", display:"flex", flexDirection:"column", fontFamily:"'Palatino Linotype', Palatino, serif", color:"#FFFFFF" },
  landingHeader: { padding:"20px 48px", display:"flex", alignItems:"center", gap:16, borderBottom:"1px solid #1E3050" },
  landingHero: { display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"72px 24px 48px", gap:20, maxWidth:760, margin:"0 auto", width:"100%" },
  landingBadge: { fontSize:12, padding:"5px 14px", borderRadius:20, border:"1px solid #C9A84C", color:"#C9A84C", fontFamily:"Calibri, sans-serif" },
  landingTitle: { fontSize:48, fontWeight:"bold", lineHeight:1.2, margin:0, color:"#FFFFFF" },
  landingTitleGold: { color:"#C9A84C" },
  landingSubtitle: { fontSize:17, color:"#8B9AB0", lineHeight:1.7, fontFamily:"Calibri, sans-serif", maxWidth:560, margin:0 },
  landingCTA: { padding:"16px 40px", background:"#C9A84C", color:"#0A1628", border:"none", borderRadius:10, fontSize:16, fontWeight:"bold", cursor:"pointer", fontFamily:"'Palatino Linotype', serif", transition:"background 0.2s" },
  landingCTASub: { fontSize:12, color:"#5B6B7C", fontFamily:"Calibri, sans-serif", margin:0 },
  landingFeatures: { display:"flex", gap:16, padding:"0 48px 48px", flexWrap:"wrap", maxWidth:1100, margin:"0 auto", width:"100%", boxSizing:"border-box" },
  landingFeatureCard: { flex:1, minWidth:200, background:"#0F2040", border:"1px solid #1E3050", borderRadius:12, padding:"24px 20px", display:"flex", flexDirection:"column", gap:10 },
  landingFeatureIcon: { fontSize:28 },
  landingFeatureTitle: { fontSize:14, fontWeight:"bold", color:"#C9A84C", fontFamily:"Palatino Linotype, serif" },
  landingFeatureDesc: { fontSize:13, color:"#6B7280", lineHeight:1.6, fontFamily:"Calibri, sans-serif" },
  landingSteps: { background:"#0F2040", padding:"48px", display:"flex", flexDirection:"column", alignItems:"center", gap:32, borderTop:"1px solid #1E3050", borderBottom:"1px solid #1E3050" },
  landingH2: { fontSize:28, fontWeight:"bold", color:"#FFFFFF", margin:0, textAlign:"center" },
  landingStepsRow: { display:"flex", gap:32, flexWrap:"wrap", justifyContent:"center", maxWidth:900, width:"100%" },
  landingStep: { flex:1, minWidth:220, display:"flex", flexDirection:"column", alignItems:"center", gap:12, textAlign:"center" },
  landingStepN: { width:48, height:48, borderRadius:"50%", background:"#C9A84C", color:"#0A1628", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:"bold" },
  landingStepTitle: { fontSize:15, fontWeight:"bold", color:"#FFFFFF", fontFamily:"Palatino Linotype, serif" },
  landingStepDesc: { fontSize:13, color:"#6B7280", lineHeight:1.6, fontFamily:"Calibri, sans-serif" },
  landingBottom: { display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 24px", gap:16 },
  landingLegal: { fontSize:11, color:"#3D4F63", fontFamily:"Calibri, sans-serif", textAlign:"center", margin:0 },
  quizPage: { minHeight:"100vh", background:"#F7F5F0", display:"flex", flexDirection:"column", fontFamily:"'Palatino Linotype', Palatino, serif" },
  quizHeader: { background:"#0A1628", padding:"16px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"3px solid #C9A84C" },
  quizProgress: { display:"flex", alignItems:"center", gap:16 },
  stepCounter: { fontSize:13, color:"#C9A84C", fontFamily:"Calibri, sans-serif", whiteSpace:"nowrap" },
  progressBar: { width:200, height:4, background:"#1E3050", borderRadius:2 },
  progressFill: { height:"100%", background:"#C9A84C", borderRadius:2, transition:"width 0.4s ease" },
  questionContainer: { flex:1, maxWidth:680, margin:"0 auto", padding:"48px 24px 32px", width:"100%", display:"flex", flexDirection:"column", gap:16 },
  stepLabel: { fontSize:11, fontWeight:"bold", color:"#C9A84C", textTransform:"uppercase", letterSpacing:1.5, fontFamily:"Calibri, sans-serif" },
  question: { fontSize:18, color:"#0A1628", lineHeight:1.5, margin:"0 0 4px", fontWeight:"bold" },
  optionsGrid: { display:"flex", flexDirection:"column", gap:8 },
  optionBtn: { padding:"13px 16px", background:"#FFFFFF", border:"1.5px solid #E5E7EB", borderRadius:10, cursor:"pointer", fontSize:14, color:"#0A1628", textAlign:"left", fontFamily:"Calibri, sans-serif", transition:"all 0.15s", lineHeight:1.4 },
  submitBtn: { width:"100%", padding:"14px", background:"#0A1628", color:"#C9A84C", border:"none", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:"bold", fontFamily:"Palatino Linotype, serif" },
  backBtn: { marginTop:8, padding:"8px 0", background:"transparent", border:"none", color:"#9CA3AF", cursor:"pointer", fontSize:12, fontFamily:"Calibri, sans-serif", alignSelf:"flex-start" },
  hint: { fontSize:11, color:"#9CA3AF", margin:"4px 0 0", fontFamily:"Calibri, sans-serif", textAlign:"center" },
  clarifBox: { background:"#FFF8E7", border:"2px solid #C9A84C", borderRadius:10, padding:14, display:"flex", flexDirection:"column", gap:10 },
  clarifMsg: { fontSize:13, color:"#0A1628", lineHeight:1.5, margin:0, fontFamily:"Calibri, sans-serif" },
  clarifInput: { width:"100%", padding:10, border:"1px solid #E5E7EB", borderRadius:8, fontSize:13, fontFamily:"Calibri, sans-serif", outline:"none", resize:"none", boxSizing:"border-box" },
  clarifButtons: { display:"flex", gap:8 },
  clarifConfirm: { flex:1, padding:9, background:"#0A1628", color:"#C9A84C", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"Calibri, sans-serif" },
  clarifSkip: { padding:"9px 16px", background:"transparent", border:"1px solid #E5E7EB", borderRadius:8, cursor:"pointer", fontSize:12, color:"#6B7280", fontFamily:"Calibri, sans-serif" },
  convContainer: { flex:1, maxWidth:720, margin:"0 auto", padding:"24px 24px 16px", width:"100%", display:"flex", flexDirection:"column", gap:12 },
  convChat: { flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:16, paddingBottom:8, maxHeight:"calc(100vh - 300px)", minHeight:200 },
  convMsg: { display:"flex", flexDirection:"column", gap:4 },
  convMsgAgent: { alignItems:"flex-start" },
  convMsgUser: { alignItems:"flex-end" },
  convRole: { fontSize:10, color:"#C9A84C", fontFamily:"Calibri, sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:2 },
  convBubble: { padding:"12px 16px", borderRadius:14, fontSize:14, lineHeight:1.6, maxWidth:"80%", fontFamily:"Calibri, sans-serif" },
  convBubbleAgent: { background:"#FFFFFF", border:"1px solid #E5E7EB", borderRadius:"4px 14px 14px 14px", color:"#0A1628" },
  convBubbleUser: { background:"#0A1628", color:"#FFFFFF", borderRadius:"14px 4px 14px 14px" },
  convInputRow: { display:"flex", gap:8, alignItems:"flex-end" },
  convInput: { flex:1, padding:"10px 14px", border:"1.5px solid #E5E7EB", borderRadius:10, fontSize:14, fontFamily:"Calibri, sans-serif", outline:"none", resize:"none", lineHeight:1.5, background:"#FFFFFF", color:"#0A1628" },
  convSendBtn: { width:44, height:44, background:"#0A1628", color:"#C9A84C", border:"none", borderRadius:10, cursor:"pointer", fontSize:20, fontWeight:"bold", flexShrink:0 },
  convDoneBox: { background:"#EAF3DE", border:"1px solid #3B6D11", borderRadius:10, padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 },
  convDoneText: { fontSize:13, color:"#1F4A0A", fontFamily:"Calibri, sans-serif", margin:0 },
  convOptions: { display:"flex", flexDirection:"column", gap:6, marginTop:8, maxWidth:"80%" },
  convOptionBtn: { padding:"9px 14px", background:"#F7F5F0", border:"1.5px solid #E5E7EB", borderRadius:8, cursor:"pointer", fontSize:13, color:"#0A1628", textAlign:"left", fontFamily:"Calibri, sans-serif", transition:"all 0.15s" },
  resultsPage: { minHeight:"100vh", background:"#0A1628", display:"flex", flexDirection:"column", fontFamily:"'Palatino Linotype', Palatino, serif" },
  resultsHeader: { padding:"20px 40px", borderBottom:"1px solid #1E3050", display:"flex", alignItems:"center", gap:20 },
  resultsBody: { flex:1, maxWidth:900, margin:"0 auto", padding:"32px 24px 60px", display:"flex", flexDirection:"column", gap:16, width:"100%", overflowY:"auto" },
  newAnalysisBtn: { marginLeft:"auto", padding:"8px 20px", background:"transparent", border:"1px solid #C9A84C", color:"#C9A84C", borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"Calibri, sans-serif" },
  rCard: { background:"#FFFFFF", border:"1px solid #E5E7EB", borderRadius:14, padding:"20px 24px", display:"flex", flexDirection:"column", gap:10, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  rCardHeader: { display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" },
  rCardTitle: { fontSize:15, fontWeight:"bold", color:"#0A1628", fontFamily:"Palatino Linotype, serif" },
  rIcon: { fontSize:20 },
  rText: { fontSize:14, color:"#374151", lineHeight:1.7, fontFamily:"Calibri, sans-serif", margin:0 },
  rTextSm: { fontSize:13, color:"#6B7280", lineHeight:1.6, fontFamily:"Calibri, sans-serif", margin:0 },
  rBadge: { fontSize:12, padding:"3px 10px", borderRadius:20, fontFamily:"Calibri, sans-serif", fontWeight:"bold" },
  rBadgeGray: { fontSize:12, padding:"3px 10px", borderRadius:20, background:"#F3F4F6", color:"#6B7280", fontFamily:"Calibri, sans-serif" },
  typing: { display:"flex", gap:6, alignItems:"center", padding:"4px 0" },
  dot: { width:8, height:8, borderRadius:"50%", background:"#C9A84C", display:"inline-block", animation:"bounce 1s infinite" },
};
