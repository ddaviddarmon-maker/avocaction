"use client";
import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// QUESTIONNAIRE — arbre de questions avec relances
// ═══════════════════════════════════════════════════════════
const STEPS_COMMUN_DEBUT = [
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
        "Depuis la loi 2025-391, certains petits professionnels peuvent participer à une action de groupe si le contrat concerné ne relève pas de leur activité principale. Cet achat était-il lié à votre activité professionnelle principale ?",
      "Je suis un professionnel / une grande entreprise":
        "Les actions de groupe en droit de la consommation sont réservées aux particuliers et aux petits professionnels. Cet achat était-il réalisé en dehors de votre activité professionnelle principale ?",
      "Je représente une association":
        "Seules les associations agréées (ou existant depuis 2 ans avec activité réelle) peuvent représenter des consommateurs en action de groupe. Votre association remplit-elle ces conditions ?",
      "Je représente une personne morale non professionnelle (ex : syndicat de copropriétaires)":
        "Depuis la réforme 2025, les personnes morales non professionnelles peuvent participer à une action de groupe. Continuons pour analyser votre situation.",
    },
  },
  {
    id: "residence", label: "Résidence",
    question: "Dans quel pays résidez-vous actuellement ?",
    options: ["France", "Union européenne", "Hors Union européenne", "Je préfère ne pas préciser"],
    clarif: {
      "Hors Union européenne":
        "Les recours disponibles peuvent différer selon votre pays de résidence. Le droit français peut toutefois s'appliquer si l'achat a eu lieu en France ou dans l'UE.",
    },
  },
  {
    id: "localisation", label: "Lieu achat",
    question: "Dans quel pays l'achat ou la prestation a-t-elle eu lieu ?",
    options: ["France", "Union européenne", "Hors Union européenne", "Achat en ligne", "Je ne sais pas"],
    clarif: {
      "Hors Union européenne":
        "La loi française sur les actions de groupe s'applique principalement aux achats en France et dans l'UE. L'entreprise vendeuse est-elle française ou européenne ?",
    },
  },
  {
    id: "description", label: "Problème",
    question: "Décrivez votre problème en 2–3 phrases : ce qui s'est passé, avec quelle entreprise, et quand environ.",
    type: "textarea",
    placeholder: "Ex : J'ai acheté un lave-linge chez Darty en janvier 2024, il est tombé en panne après 3 mois. Darty a refusé de l'échanger malgré la garantie...",
    minLength: 30,
    clarifVague: "Pouvez-vous préciser : avec quelle entreprise, quel type de problème exact, et à quelle période ?",
    autoSearchBrand: true,
  },
  {
    id: "type", label: "Type",
    question: "Quel type de produit ou de service est concerné ?",
    options: [
      "Produit physique (électroménager, auto, électronique…)",
      "Service numérique (abonnement, plateforme, app…)",
      "Banque / assurance / services financiers",
      "Transport / voyage / tourisme",
      "Produit alimentaire",
      "Protection des données (RGPD)",
      "Télécommunication / opérateur",
      "Santé / produits de santé",
      "Autre",
    ],
    isTypeBranch: true, // déclenche le branchement module
  },
];

// ── MODULE ALIMENTAIRE ─────────────────────────────────────
const MODULE_ALIMENTAIRE = [
  {
    id: "alim_type", label: "Aliment",
    question: "Précisez le type de produit alimentaire concerné :",
    options: [
      "Produit frais (viande, poisson, légumes…)",
      "Produit transformé (plat préparé, conserve…)",
      "Boisson",
      "Complément alimentaire",
      "Lait infantile / produit bébé",
      "Autre",
    ],
  },
  {
    id: "alim_lieu", label: "Lieu achat alim.",
    question: "Où avez-vous acheté ce produit ?",
    options: [
      "Supermarché / grande distribution",
      "Magasin spécialisé",
      "Restaurant / livraison de repas",
      "Site internet",
      "Marché / producteur",
      "Autre",
    ],
  },
  {
    id: "alim_probleme", label: "Problème alim.",
    question: "Quel problème avez-vous rencontré avec ce produit ?",
    options: [
      "Produit avarié ou impropre à la consommation",
      "Présence d'un corps étranger",
      "Intoxication alimentaire",
      "Étiquetage trompeur ou allergène non indiqué",
      "Origine du produit trompeuse",
      "Produit rappelé après achat",
      "Quantité inférieure à celle annoncée",
      "Autre",
    ],
  },
  {
    id: "alim_symptomes", label: "Symptômes",
    question: "Avez-vous subi des symptômes après consommation ?",
    options: ["Oui", "Non", "Je ne sais pas"],
    conditionalNext: {
      "Oui": "alim_symptomes_detail",
    },
  },
  {
    id: "alim_symptomes_detail", label: "Détail symptômes",
    question: "Quels symptômes avez-vous ressentis ?",
    options: [
      "Nausées / vomissements",
      "Diarrhée",
      "Douleurs abdominales",
      "Réaction allergique",
      "Hospitalisation",
      "Autre",
    ],
    conditionalSkipIf: (answers) => answers.alim_symptomes !== "Oui",
  },
  {
    id: "alim_infos", multiSelect: true, label: "Infos produit",
    question: "Disposez-vous d'informations sur le produit ?",
    options: [
      "Marque et nom du produit",
      "Numéro de lot",
      "Date de péremption",
      "Photo de l'emballage",
      "Aucune information",
    ],
    multiSelect: true,
  },
  {
    id: "alim_rappel", label: "Rappel officiel",
    question: "Savez-vous si ce produit a fait l'objet d'un rappel officiel, d'une alerte sanitaire ou d'articles de presse ?",
    options: ["Oui, rappel officiel", "Oui, articles de presse", "Oui, alerte sanitaire", "Je ne sais pas", "Non"],
  },
  {
    id: "alim_autres_cas", label: "Autres cas",
    question: "Avez-vous connaissance d'autres personnes ayant rencontré le même problème ?",
    options: ["Oui", "Non", "Je ne sais pas"],
  },
];

// ── MODULE PRODUIT PHYSIQUE ────────────────────────────────
const MODULE_PHYSIQUE = [
  {
    id: "phys_type", label: "Type produit",
    question: "De quel type de produit s'agit-il ?",
    options: [
      "Électroménager",
      "Électronique (smartphone, ordinateur, TV…)",
      "Automobile / véhicule",
      "Objet connecté",
      "Produit de bricolage / équipement",
      "Jouet",
      "Autre",
    ],
  },
  {
    id: "phys_modele", label: "Marque / modèle",
    question: "Quelle est la marque et, si possible, le modèle du produit ?",
    type: "text",
    placeholder: "Ex : Samsung Galaxy S22, Bosch WAT286H0FF…",
    optional: "Je ne me souviens plus",
  },
  {
    id: "phys_date_achat", label: "Date achat",
    question: "Quand avez-vous acheté ce produit ?",
    options: [
      "Moins de 6 mois",
      "Entre 6 mois et 2 ans",
      "Entre 2 et 5 ans",
      "Plus de 5 ans",
    ],
    alert: {
      "Plus de 5 ans": "⚠️ La garantie légale (2 ans) et la prescription responsabilité civile (5 ans) sont probablement expirées. Vérifiez avec un avocat.",
      "Entre 2 et 5 ans": "ℹ️ La garantie légale de 2 ans est dépassée. La prescription faits (5 ans, Art. 2224 C. civil) peut encore courir selon la date exacte.",
    },
  },
  {
    id: "phys_probleme", label: "Problème produit",
    question: "Quel problème avez-vous rencontré ?",
    options: [
      "Produit en panne",
      "Produit dangereux",
      "Défaut de fabrication",
      "Performance inférieure à celle annoncée",
      "Produit inutilisable après mise à jour",
      "Obsolescence rapide",
      "Garantie refusée",
      "Produit différent de celui annoncé",
      "Autre",
    ],
  },
  {
    id: "phys_danger", label: "Danger",
    question: "Ce produit a-t-il provoqué ou aurait-il pu provoquer un danger ?",
    options: ["Oui", "Non", "Je ne sais pas"],
    conditionalNext: { "Oui": "phys_danger_type" },
  },
  {
    id: "phys_danger_type", label: "Type danger",
    question: "Quel type de danger ?",
    options: ["Incendie", "Blessure", "Surchauffe", "Explosion", "Autre"],
    conditionalSkipIf: (answers) => answers.phys_danger !== "Oui",
  },
  {
    id: "phys_reparation", label: "Réparation",
    question: "Avez-vous demandé la réparation ou le remplacement du produit ?",
    options: ["Oui", "Non"],
    conditionalNext: { "Oui": "phys_reparation_reponse" },
  },
  {
    id: "phys_reparation_reponse", label: "Réponse vendeur",
    question: "Quelle a été la réponse du vendeur ou du fabricant ?",
    options: [
      "Réparation refusée",
      "Garantie refusée",
      "Réparation payante proposée",
      "Produit remplacé",
      "Aucune réponse",
    ],
    conditionalSkipIf: (answers) => answers.phys_reparation !== "Oui",
  },
  {
    id: "phys_similaires", label: "Cas similaires",
    question: "Savez-vous si d'autres consommateurs rencontrent le même problème avec ce produit ?",
    options: ["Oui, beaucoup", "Oui, quelques cas", "Je ne sais pas", "Non"],
    conditionalNext: { "Oui, beaucoup": "phys_similaires_source", "Oui, quelques cas": "phys_similaires_source" },
  },
  {
    id: "phys_similaires_source", label: "Source info",
    question: "Comment l'avez-vous appris ?",
    options: ["Forums internet", "Réseaux sociaux", "Articles de presse", "Connaissances personnelles", "Autre"],
    conditionalSkipIf: (answers) => !answers.phys_similaires?.includes("Oui"),
  },
];

// ── MODULE NUMÉRIQUE ───────────────────────────────────────
const MODULE_NUMERIQUE = [
  {
    id: "num_type", label: "Service",
    question: "Quel type de service numérique est concerné ?",
    options: [
      "Plateforme de streaming (vidéo, musique)",
      "Réseau social",
      "Application mobile",
      "Service de stockage cloud",
      "Plateforme de commerce en ligne",
      "Plateforme de réservation",
      "Jeu vidéo en ligne",
      "Abonnement numérique (presse, formation, logiciel…)",
      "Autre",
    ],
  },
  {
    id: "num_usage", label: "Usage",
    question: "Comment utilisez-vous ce service ?",
    options: [
      "Compte gratuit",
      "Abonnement payant",
      "Achat ponctuel",
      "Achat intégré dans une application",
      "Je ne sais pas",
    ],
  },
  {
    id: "num_probleme", label: "Problème num.",
    question: "Quel problème principal avez-vous rencontré ?",
    options: [
      "Impossible ou difficile de résilier un abonnement",
      "Prélèvements ou frais non prévus",
      "Suppression ou suspension de compte",
      "Perte d'accès à un contenu acheté",
      "Service non conforme à ce qui était annoncé",
      "Modification des conditions sans accord",
      "Problème lié à mes données personnelles",
      "Contenu retiré après achat",
      "Autre",
    ],
  },
  {
    id: "num_souscription", label: "Souscription",
    question: "Comment aviez-vous souscrit à cet abonnement ?",
    options: [
      "Sur le site internet",
      "Via une application mobile",
      "Via Apple Store / Google Play",
      "Lors d'un achat d'un autre service",
      "Je ne sais pas",
    ],
  },
  {
    id: "num_facturation", label: "Facturation",
    question: "Avez-vous constaté des prélèvements ou des frais inattendus ?",
    options: ["Oui", "Non", "Je ne sais pas"],
    conditionalNext: { "Oui": "num_facturation_type" },
  },
  {
    id: "num_facturation_type", label: "Type frais",
    question: "Quel type de problème de facturation ?",
    options: [
      "Abonnement activé sans consentement clair",
      "Renouvellement automatique non souhaité",
      "Montant supérieur à celui annoncé",
      "Frais cachés",
      "Autre",
    ],
    conditionalSkipIf: (answers) => answers.num_facturation !== "Oui",
  },
  {
    id: "num_compte", label: "Compte suspendu",
    question: "Votre compte a-t-il été suspendu ou supprimé ?",
    options: ["Oui, sans explication", "Oui, avec explication", "Non"],
    conditionalNext: {
      "Oui, sans explication": "num_compte_perte",
      "Oui, avec explication": "num_compte_perte",
    },
  },
  {
    id: "num_compte_perte", label: "Perte contenu",
    question: "Cette suspension vous a-t-elle fait perdre…",
    options: [
      "Un abonnement payé",
      "Des contenus achetés",
      "Des données personnelles",
      "Plusieurs de ces éléments",
      "Rien de particulier",
    ],
    conditionalSkipIf: (answers) => answers.num_compte === "Non",
  },
  {
    id: "num_changement", label: "Changement service",
    question: "Le service a-t-il changé après votre inscription ?",
    options: [
      "Oui, des fonctionnalités ont disparu",
      "Oui, le prix a augmenté",
      "Oui, les conditions d'utilisation ont changé",
      "Non",
      "Je ne sais pas",
    ],
  },
];

// ── MODULE TRANSPORT ───────────────────────────────────────
const MODULE_TRANSPORT = [
  {
    id: "trans_secteur", label: "Secteur",
    question: "Dans quel secteur se situe votre problème ?",
    options: [
      "Transport aérien",
      "Train / transport ferroviaire",
      "Bus / transport routier",
      "Voyage organisé ou agence de voyage",
      "Plateforme de réservation (vol, hôtel, train)",
      "Plateforme de covoiturage",
      "Autre",
    ],
  },
  {
    id: "trans_probleme", label: "Problème transport",
    question: "Quel type de problème avez-vous rencontré ?",
    options: [
      "Annulation du voyage ou du transport",
      "Retard important",
      "Refus d'embarquement",
      "Modification du service sans mon accord",
      "Problème de remboursement",
      "Frais cachés ou prix modifié",
      "Autre problème contractuel",
    ],
  },
  {
    id: "trans_prix", label: "Prix affiché",
    question: "Le prix payé correspondait-il au prix affiché initialement ?",
    options: [
      "Oui",
      "Non, des frais ont été ajoutés",
      "Non, le prix a changé pendant la réservation",
      "Je ne suis pas sûr",
    ],
  },
  {
    id: "trans_cgv", label: "CGV",
    question: "Les conditions générales étaient-elles claires pour vous ?",
    options: [
      "Oui",
      "Partiellement",
      "Non, difficiles à comprendre",
      "Non, je ne les ai pas vues",
    ],
  },
  {
    id: "trans_solution", label: "Solution proposée",
    question: "Le professionnel vous a-t-il proposé une solution ?",
    options: [
      "Oui, satisfaisante",
      "Oui, mais insuffisante",
      "Oui, mais seulement un avoir",
      "Non, aucune solution",
    ],
  },
  {
    id: "trans_reclamation", label: "Réclamation",
    question: "Avez-vous déjà fait une réclamation ?",
    options: [
      "Oui, auprès de l'entreprise",
      "Oui, auprès d'un médiateur",
      "Oui, auprès d'une association de consommateurs",
      "Non",
    ],
  },
  {
    id: "trans_prejudice_type", label: "Préjudice transport",
    question: "Quel type de préjudice avez-vous subi ?",
    options: [
      "Perte financière",
      "Frais supplémentaires engagés",
      "Désorganisation du voyage",
      "Plusieurs de ces éléments",
    ],
  },
  {
    id: "trans_montant", label: "Montant transport",
    question: "Le montant du préjudice est :",
    options: ["Faible (moins de 50€)", "Modéré (50 à 300€)", "Élevé (plus de 300€)"],
  },
  {
    id: "trans_similaires", label: "Autres cas",
    question: "Pensez-vous que d'autres consommateurs ont rencontré le même problème ?",
    options: [
      "Oui, j'ai vu plusieurs témoignages similaires",
      "Probablement",
      "Je ne sais pas",
      "Non, mon cas semble isolé",
    ],
  },
];

// ── MODULE RGPD ────────────────────────────────────────────
const MODULE_RGPD = [
  {
    id: "rgpd_info", label: "Info collecte",
    question: "Lorsque vos données ont été collectées, avez-vous été informé de leur utilisation ?",
    options: ["Oui, clairement", "Oui, mais de manière peu claire", "Non", "Je ne sais pas"],
  },
  {
    id: "rgpd_types", label: "Types données",
    question: "Savez-vous quelles données personnelles ont été collectées ?",
    options: [
      "Nom / prénom",
      "Adresse email",
      "Numéro de téléphone",
      "Données de localisation",
      "Données financières",
      "Données de santé ou sensibles",
      "Je ne sais pas",
    ],
  },
  {
    id: "rgpd_excessif", label: "Données excessives",
    question: "Les données demandées vous ont-elles semblé excessives par rapport au service proposé ?",
    options: ["Oui", "Non", "Je ne sais pas"],
  },
  {
    id: "rgpd_consentement", label: "Consentement",
    question: "Comment avez-vous donné votre consentement ?",
    options: [
      "En cochant une case volontairement",
      "La case était déjà cochée",
      "Je n'ai jamais vu de consentement",
      "Autre",
    ],
  },
  {
    id: "rgpd_communications", label: "Communications",
    question: "Avez-vous reçu des communications non sollicitées (publicité, démarchage) ?",
    options: ["Oui, régulièrement", "Oui, occasionnellement", "Non"],
  },
  {
    id: "rgpd_partage", label: "Partage tiers",
    question: "Savez-vous si vos données ont été partagées avec des tiers ?",
    options: ["Oui", "Non", "Je ne sais pas"],
    conditionalNext: { "Oui": "rgpd_partage_type" },
  },
  {
    id: "rgpd_partage_type", label: "Type tiers",
    question: "Avec quels types d'organisations ?",
    options: [
      "Partenaires commerciaux",
      "Entreprises de publicité",
      "Prestataires techniques",
      "Je ne sais pas",
    ],
    conditionalSkipIf: (answers) => answers.rgpd_partage !== "Oui",
  },
  {
    id: "rgpd_acces", label: "Accès données",
    question: "Avez-vous déjà demandé l'accès à vos données personnelles ?",
    options: ["Oui", "Non"],
    conditionalNext: { "Oui": "rgpd_acces_reponse" },
  },
  {
    id: "rgpd_acces_reponse", label: "Réponse accès",
    question: "Avez-vous obtenu une réponse dans un délai d'un mois (délai légal RGPD) ?",
    options: ["Oui", "Non", "Je n'ai pas reçu de réponse"],
    conditionalSkipIf: (answers) => answers.rgpd_acces !== "Oui",
  },
  {
    id: "rgpd_suppression", label: "Suppression",
    question: "Avez-vous demandé la suppression de vos données ?",
    options: [
      "Oui et elles ont été supprimées",
      "Oui mais elles n'ont pas été supprimées",
      "Non",
    ],
  },
  {
    id: "rgpd_ampleur", label: "Ampleur",
    question: "Estimez-vous que ce problème concerne potentiellement un grand nombre d'utilisateurs ?",
    options: ["Oui", "Non", "Je ne sais pas"],
  },
];

// ── QUESTIONS COMMUNES FINALES ─────────────────────────────
const STEPS_COMMUN_FIN = [
  {
    id: "probleme", label: "Nature",
    question: "Quel type de problème avez-vous rencontré ?",
    dynamicOptions: true,
  },
  {
    id: "date", label: "Date",
    question: "Quelle est la date d'achat ou de début du problème ?",
    type: "date",
    placeholder: "JJ/MM/AAAA ou MM/AAAA si vous ne connaissez pas le jour exact",
    clarifVague: "La date est importante pour vérifier si vos droits sont encore valables. Essayez au moins le mois et l'année.",
  },
  {
    id: "prejudice", multiSelect: true, label: "Préjudice",
    question: "Quel type de préjudice avez-vous subi ?",
    options: [
      "Perte financière",
      "Produit inutilisable ou défectueux",
      "Service non fourni",
      "Atteinte à mes données personnelles",
      "Préjudice moral / stress",
      "Plusieurs de ces éléments",
    ],
  },
  {
    id: "montant", label: "Montant",
    question: "Avez-vous une idée du montant du préjudice ?",
    options: [
      "Moins de 50€", "Entre 50€ et 300€", "Plus de 300€",
      "Je ne sais pas / préjudice non financier",
    ],
  },
  {
    id: "similaires", label: "Collectif",
    question: "Savez-vous si d'autres consommateurs ont rencontré le même problème ?",
    options: [
      "Oui, beaucoup (réseaux sociaux, presse…)",
      "Oui, quelques cas autour de moi",
      "Je pense que oui mais je ne suis pas sûr",
      "Non / Je ne sais pas",
    ],
    conditionalNext: {
      "Oui, beaucoup (réseaux sociaux, presse…)": "similaires_source",
      "Oui, quelques cas autour de moi": "similaires_source",
    },
  },
  {
    id: "similaires_source", multiSelect: true, label: "Source cas similaires",
    question: "Comment avez-vous eu connaissance de ces situations similaires ?",
    options: [
      "Forums internet", "Réseaux sociaux", "Articles de presse",
      "Associations de consommateurs", "Témoignages de proches", "Autre",
    ],
    conditionalSkipIf: (answers) => !answers.similaires?.includes("Oui"),
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
    id: "documents", multiSelect: true, label: "Preuves",
    question: "Disposez-vous de documents liés à cette situation ?",
    options: [
      "Facture / preuve d'achat",
      "Contrat ou conditions générales",
      "Échanges avec l'entreprise",
      "Photos / captures d'écran",
      "Plusieurs de ces éléments",
      "Aucun document",
    ],
    clarifVague: "Même des emails ou des SMS peuvent suffire. Avez-vous des échanges numériques avec l'entreprise ?",
  },
  {
    id: "optin", label: "Rejoindre le groupe",
    question: "Si une action de groupe est en cours pour votre situation, souhaiteriez-vous y adhérer ? (le délai d'adhésion peut aller jusqu'à 5 ans selon la loi 2025-391)",
    options: [
      "Oui, je veux rejoindre une action existante",
      "Je préfère être informé avant de décider",
      "Je souhaite initier une nouvelle action collective",
      "Non, je cherche uniquement des informations",
    ],
  },
  {
    id: "rgpd_consent_save", label: "Consentement RGPD",
    question: "Souhaitez-vous que vos informations soient sauvegardées pour bénéficier de la veille automatique et des alertes de prescription ?",
    options: [
      "Oui, j'accepte la sauvegarde et les alertes",
      "Non, analyse unique sans sauvegarde",
    ],
  },
  {
    id: "participation", label: "Action collective",
    question: "Si d'autres consommateurs sont concernés par le même problème, seriez-vous prêt à participer à une action collective ?",
    options: ["Oui, tout à fait", "Peut-être, selon les informations", "Non"],
    last: true,
  },
];

// ── Fonction qui construit le parcours dynamique ───────────
function buildSteps(answers) {
  const type = (answers.type || "").toLowerCase();
  let module = [];
  if (type.includes("alimentaire")) module = MODULE_ALIMENTAIRE;
  else if (type.includes("physique") || type.includes("électroménager") || type.includes("automobile")) module = MODULE_PHYSIQUE;
  else if (type.includes("numérique") || type.includes("abonnement") || type.includes("plateforme") || type.includes("télécommunication")) module = MODULE_NUMERIQUE;
  else if (type.includes("transport") || type.includes("voyage")) module = MODULE_TRANSPORT;
  else if (type.includes("rgpd") || type.includes("données")) module = MODULE_RGPD;

  const allSteps = [...STEPS_COMMUN_DEBUT, ...module, ...STEPS_COMMUN_FIN];

  // Filtrer les étapes conditionnelles (skip)
  return allSteps.filter(s => {
    if (s.conditionalSkipIf) return !s.conditionalSkipIf(answers);
    return true;
  });
}

// Compatibilité — STEPS initial (avant sélection du type)
const STEPS = [...STEPS_COMMUN_DEBUT, ...STEPS_COMMUN_FIN];

// ═══════════════════════════════════════════════════════════
// OPTIONS DYNAMIQUES selon le type de produit
// ═══════════════════════════════════════════════════════════
function getProblemeOptions(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("alimentaire")) {
    return [
      "Produit avarié ou impropre à la consommation",
      "Présence d'un corps étranger",
      "Intoxication alimentaire",
      "Étiquetage trompeur ou allergène non indiqué",
      "Origine du produit trompeuse",
      "Produit rappelé après achat",
      "Quantité inférieure à celle annoncée",
      "Autre",
    ];
  }
  if (t.includes("transport") || t.includes("voyage")) {
    return [
      "Annulation du transport ou voyage",
      "Retard important",
      "Refus d'embarquement",
      "Modification du service sans accord",
      "Problème de remboursement",
      "Frais cachés ou prix modifié",
      "Autre",
    ];
  }
  if (t.includes("rgpd") || t.includes("données")) {
    return [
      "Collecte sans consentement clair",
      "Partage avec des tiers non autorisé",
      "Refus de suppression des données",
      "Fuite de données personnelles",
      "Publicité ciblée excessive",
      "Autre",
    ];
  }
  if (t.includes("numérique") || t.includes("abonnement") || t.includes("plateforme")) {
    return [
      "Impossible ou difficile de résilier un abonnement",
      "Prélèvements ou frais non prévus",
      "Suppression ou suspension de compte",
      "Service non conforme à ce qui était annoncé",
      "Modification des conditions sans accord",
      "Perte d'accès à un contenu acheté",
      "Autre",
    ];
  }
  // Défaut (physique, banque, santé, autre)
  return [
    "Produit défectueux ou en panne",
    "Service non conforme ou mal exécuté",
    "Facturation abusive ou frais injustifiés",
    "Abonnement difficile à résilier",
    "Pratique commerciale trompeuse",
    "Non-respect d'une garantie",
    "Utilisation abusive de données personnelles",
    "Retard ou annulation de service",
    "Autre",
  ];
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function Home() {
  // Page state
  const [started, setStarted] = useState(false); // false = landing, true = questionnaire

  // Questionnaire state
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textValue, setTextValue] = useState("");
  const [clarif, setClarif] = useState(null); // message de clarification en cours
  const [clarifInput, setClarifInput] = useState("");
  const [alert, setAlert] = useState(null);
  const [done, setDone] = useState(false);

  // Résultats / chat state
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // Recherche marque automatique depuis description
  const [brandResults, setBrandResults] = useState([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandSearched, setBrandSearched] = useState(false);
  const [brandConfirmed, setBrandConfirmed] = useState(null);

  // Extraction automatique type + problème depuis description
  const [autoExtracted, setAutoExtracted] = useState(null);
  const [autoConfirmPending, setAutoConfirmPending] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [multiSelected, setMultiSelected] = useState([]);
  const [brandStep, setBrandStep] = useState(false); // affiche la confirmation marque comme étape
  const [pendingAdvance, setPendingAdvance] = useState(null); // réponses en attente pendant brandStep

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reconstruction dynamique du parcours selon les réponses
  const activeSteps = buildSteps(answers);
  const currentStep = activeSteps[stepIndex] || activeSteps[activeSteps.length - 1];
  const progress = Math.round((stepIndex / activeSteps.length) * 100);

  // ── Extraction automatique type + problème depuis description ──
  async function extractTypeAndProblem(description) {
    try {
      const text = await callAPI([{
        role: "user",
        content: `Analyse cette description de problème consommateur et extrais deux informations :

"${description}"

Retourne UNIQUEMENT un JSON valide :
{
  "type": "une des valeurs suivantes exactement : Produit physique | Service numérique | Banque / assurance / services financiers | Transport / voyage / tourisme | Produit alimentaire | Protection des données (RGPD) | Télécommunication / opérateur | Santé / produits de santé | Autre",
  "probleme": "résumé du problème en moins de 8 mots",
  "confidence": "high | medium | low"
}

Si tu ne peux pas déterminer le type avec certitude, mets confidence: low.`
      }]);
      const clean = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start >= 0 && end > start) {
        const parsed = JSON.parse(clean.slice(start, end + 1));
        return parsed;
      }
    } catch (e) {
      console.error("extractTypeAndProblem error:", e);
    }
    return null;
  }

  // ── Confirmer la marque et avancer ──────────────────────
  function confirmBrand(brandName) {
    setBrandStep(false);
    setBrandResults([]);
    setBrandSearched(false);
    const { val, extraAnswers } = pendingAdvance || {};
    const allExtras = { ...extraAnswers, entreprise: brandName };
    saveAndAdvanceWithExtra(val, allExtras);
    setPendingAdvance(null);
  }

  // ── Recherche autonome de marque avec web search ─────────
  // Appelle l'API avec le tool web_search activé pour identifier
  // la marque exacte à partir de la description libre
  async function searchBrandFromDescription(description) {
    if (!description.trim()) return;
    setBrandLoading(true);
    setBrandSearched(true);
    setBrandResults([]);
    setBrandConfirmed(null);
    try {
      // Appel avec web_search activé côté backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Un consommateur décrit son problème ainsi : "${description}"

Ta mission : identifier la marque ou l'entreprise concernée, en remontant à la société mère si c'est une sous-marque.

Exemples :
- "Gallia" → Danone (marque de lait infantile du groupe Danone)
- "Free Mobile" → Iliad / Free
- "Dacia" → Groupe Renault
- "Lidl" → Lidl France

Règles :
1. Extrais toute mention de marque, produit ou enseigne dans le texte
2. Identifie la société mère ou le groupe si c'est une sous-marque
3. Retourne UNIQUEMENT un tableau JSON (sans texte avant ou après) :
[{"nom": "Nom du groupe/société mère", "marque": "Nom de la marque si différent", "secteur": "Secteur précis", "pays": "France"}]

Exemples de réponses attendues :
- Pour "Gallia" : [{"nom": "Danone", "marque": "Gallia", "secteur": "Alimentation infantile", "pays": "France"}]
- Pour "Orange" : [{"nom": "Orange SA", "marque": "Orange", "secteur": "Télécommunications", "pays": "France"}]

Donne 1 à 2 résultats. Si aucune marque identifiable, retourne [].`
          }],
          enableWebSearch: true
        }),
      });
      if (!response.ok) throw new Error("API " + response.status);
      const data = await response.json();
      const text = extractText(data);
      const clean = text.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("[");
      const end = clean.lastIndexOf("]");
      const jsonStr = start >= 0 && end > start ? clean.slice(start, end + 1) : "[]";
      const parsed = JSON.parse(jsonStr);
      setBrandResults(parsed.slice(0, 3));
    } catch (err) {
      console.error("searchBrand error:", err);
      setBrandResults([]);
    } finally {
      setBrandLoading(false);
    }
  }

  async function searchBrand(query) {
    return searchBrandFromDescription(query);
  }

  // ── Sélection d'une option ──────────────────────────────
  function handleOption(option) {
    // Alerte prescription ?
    if (currentStep.alert?.[option]) {
      setAlert(currentStep.alert[option]);
    } else {
      setAlert(null);
    }

    // Clarification requise ?
    if (currentStep.clarif?.[option] && !clarif) {
      setClarif({ message: currentStep.clarif[option], pendingAnswer: option });
      return;
    }

    saveAndAdvance(option);
  }

  // ── Validation texte libre ─────────────────────────────
  async function handleTextSubmit() {
    const val = textValue.trim();
    if (!val) return;

    if (currentStep.minLength && val.length < currentStep.minLength && !clarif) {
      setClarif({ message: currentStep.clarifVague, pendingAnswer: val, isText: true });
      return;
    }

    // Si description — attendre l'extraction AVANT d'avancer
    if (currentStep.autoSearchBrand && !brandSearched) {
      setAnalysing(true);
      setTextValue("");
      // Lancer marque + extraction en parallèle
      const [extracted] = await Promise.all([
        extractTypeAndProblem(val),
        searchBrandFromDescription(val),
      ]);
      setAnalysing(false);
    setMultiSelected([]);
    setBrandStep(false);
    setPendingAdvance(null);

      // Pré-remplir les réponses si confiance suffisante
      let extraAnswers = {};
      if (extracted) {
        setAutoExtracted(extracted);
        if (extracted.confidence === "high" || extracted.confidence === "medium") {
          extraAnswers = { type: extracted.type, probleme: extracted.probleme };
        }
      }
      // Avancer avec les réponses pré-remplies
      saveAndAdvanceWithExtra(val, extraAnswers);
      return;
    }

    saveAndAdvance(val);
    setTextValue("");
  }

  // ── Réponse à une clarification ───────────────────────
  function handleClarifSubmit() {
    const val = clarifInput.trim();
    if (!val) return;
    // On accepte la réponse enrichie
    const enriched = (clarif.pendingAnswer || "") + " — précision : " + val;
    setClarif(null);
    setClarifInput("");
    saveAndAdvance(enriched);
    setTextValue("");
  }

  function skipClarif() {
    setClarif(null);
    setClarifInput("");
    saveAndAdvance(clarif.pendingAnswer || "Non précisé");
    setTextValue("");
  }

  // ── Sauvegarde avec réponses extra (pour skip auto) ────
  function saveAndAdvanceWithExtra(value, extraAnswers = {}) {
    const newAnswers = { ...answers, [currentStep.id]: value, ...extraAnswers };
    setAnswers(newAnswers);
    setClarif(null);
    setAlert(null);

    if (currentStep.last) {
      setDone(true);
      launchAnalysis(newAnswers);
      return;
    }

    const newSteps = buildSteps(newAnswers);
    const currentIdx = newSteps.findIndex(s => s.id === currentStep.id);
    let nextIdx = currentIdx >= 0 ? currentIdx + 1 : stepIndex + 1;

    // Sauter les étapes déjà remplies
    while (nextIdx < newSteps.length) {
      const nextStep = newSteps[nextIdx];
      if (newAnswers[nextStep.id]) { nextIdx++; continue; }
      break;
    }

    if (nextIdx >= newSteps.length) {
      setDone(true);
      launchAnalysis(newAnswers);
      return;
    }
    setStepIndex(nextIdx);
  }

  // ── Sauvegarde et avance ───────────────────────────────
  function saveAndAdvance(value) {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);
    setClarif(null);
    setAlert(null);
    setMultiSelected([]);

    if (currentStep.last) {
      setDone(true);
      launchAnalysis(newAnswers);
      return;
    }

    // Reconstruire le parcours avec les nouvelles réponses
    const newSteps = buildSteps(newAnswers);

    // Chercher l'étape suivante — en sautant les questions déjà auto-remplies
    const currentIdx = newSteps.findIndex(s => s.id === currentStep.id);
    let nextIdx = currentIdx >= 0 ? currentIdx + 1 : stepIndex + 1;

    // Sauter "type" et "probleme" si déjà extraits avec confidence high/medium
    while (nextIdx < newSteps.length) {
      const nextStep = newSteps[nextIdx];
      if ((nextStep.id === "type" || nextStep.id === "probleme") && newAnswers[nextStep.id]) {
        nextIdx++;
        continue;
      }
      break;
    }

    if (nextIdx >= newSteps.length) {
      setDone(true);
      launchAnalysis(newAnswers);
      return;
    }

    setStepIndex(nextIdx);
  }

  // ── Lancement analyse Claude ───────────────────────────
  // Helper — extrait le texte de la réponse quel que soit le format
  function extractText(data) {
    // Format Anthropic SDK direct : { content: [{type:"text", text:"..."}] }
    if (Array.isArray(data.content)) {
      const block = data.content.find((b) => b.type === "text" || b.text);
      if (block?.text) return block.text;
    }
    // Format simplifié : { reply: "..." } ou { message: "..." } ou { text: "..." }
    if (data.reply) return data.reply;
    if (data.message) return data.message;
    if (data.text) return data.text;
    // Format streaming résolu : { choices: [{message:{content:"..."}}] }
    if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
    // Dernier recours : stringify
    return JSON.stringify(data);
  }

  async function callAPI(messages) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API ${response.status}: ${errText}`);
    }
    const data = await response.json();
    return extractText(data);
  }

  async function launchAnalysis(finalAnswers) {
    setAnalysisStarted(true);
    setIsLoading(true);

    const prompt = buildPrompt(finalAnswers);

    setMessages([
      {
        role: "assistant",
        content:
          "Merci — j'ai reçu toutes vos informations. Je lance l'analyse : recherche dans le registre officiel des actions de groupe 2025, comparaison avec la base du cabinet, et vérification des délais de prescription...",
      },
    ]);

    try {
      const reply = await callAPI([{ role: "user", content: prompt }]);
      const clean = reply.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start >= 0 && end > start) {
        const parsed = JSON.parse(clean.slice(start, end + 1));
        setMessages([{ role: "assistant", content: JSON.stringify(parsed) }]);
      } else {
        setMessages([{ role: "assistant", content: reply }]);
      }
    } catch (err) {
      console.error("launchAnalysis error:", err);
      setMessages([{ role: "assistant", content: `ERREUR: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }

  function buildPrompt(a) {
    const lignes = Object.entries(a)
      .filter(([k, v]) => v && v !== "Non précisé")
      .map(([k, v]) => `- ${k.replace(/_/g, ' ')} : ${v}`)
      .join("\n");

    return `Tu es AVOCACTION, agent IA spécialisé en droit de la consommation français (loi n° 2025-391 du 30 avril 2025).

Réponses du questionnaire :
${lignes}

Retourne UNIQUEMENT un objet JSON valide (sans texte avant ou après) avec cette structure exacte :
{
  "entreprise": "nom de l'entreprise identifiée",
  "resume": "2-3 phrases claires résumant la situation",
  "prescription": {
    "statut": "favorable | attention | urgent",
    "message": "explication courte des délais applicables",
    "expiration": "date ou période d'expiration si applicable"
  },
  "rappel": {
    "existe": true ou false,
    "message": "détail si rappel officiel connu ou non"
  },
  "action_groupe": {
    "potentiel": "élevé | moyen | faible",
    "message": "explication du potentiel d'action collective"
  },
  "scores": {
    "compatibilite": <score 0-100 : critères légaux remplis ? particulier en France, produit/service concerné par la loi conso, délais non expirés>,
    "similarite": <score 0-100 : cas similaires connus ? rappel officiel, articles presse, autres plaignants mentionnés, entreprise avec antécédents>,
    "faisabilite": <score 0-100 : action collective faisable ? préjudice homogène, nombre de victimes estimé, entreprise solvable, preuves disponibles>,
    "global": <moyenne pondérée des 3 scores : (compatibilite + similarite + faisabilite) / 3, arrondi à l'entier>
  },
  "recommandation": "conseil principal en 2-3 phrases",
  "etapes": [
    "Action concrète 1",
    "Action concrète 2",
    "Action concrète 3"
  ],
  "urgence": "haute | normale | faible"
}`;
  }

  // ── Réinitialisation ───────────────────────────────────
  function reset() {
    setStarted(false);
    setStepIndex(0);
    setAnswers({});
    setTextValue("");
    setClarif(null);
    setClarifInput("");
    setAlert(null);
    setDone(false);
    setMessages([]);
    setIsLoading(false);
    setAnalysisStarted(false);
    setBrandResults([]);
    setBrandSearched(false);
    setBrandLoading(false);
    setBrandConfirmed(null);
    setAutoExtracted(null);
    setAutoConfirmPending(false);
    setAnalysing(false);
  }

  // ══════════════════════════════════════════════════════
  // RENDU
  // ══════════════════════════════════════════════════════
  // ── Phase : questionnaire ou résultats ──────────────────
  if (done || analysisStarted) {
    // ═══ PAGE RÉSULTATS PLEIN ÉCRAN ════════════════════════
    // Parser les données de l'analyse
    let analyse = null;
    if (messages.length > 0) {
      try {
        analyse = JSON.parse(messages[0].content);
      } catch(e) { analyse = null; }
    }

    const scoreColor = (s) => s >= 75 ? "#2D7D4E" : s >= 50 ? "#C9A84C" : "#C0392B";
    const scoreLabel = (s) => s >= 75 ? "Élevé" : s >= 50 ? "Moyen" : "Faible";

    // Recalculer le global si incohérent avec les sous-scores
    if (analyse?.scores) {
      const { compatibilite: c, similarite: s, faisabilite: f } = analyse.scores;
      if (c > 0 || s > 0 || f > 0) {
        const calculated = Math.round((c + s + f) / 3);
        // Si global est 0 ou très différent des sous-scores, on recalcule
        if (analyse.scores.global === 0 || Math.abs(analyse.scores.global - calculated) > 20) {
          analyse.scores.global = calculated;
        }
      }
    }
    const urgenceColor = { haute: "#C0392B", normale: "#C9A84C", faible: "#2D7D4E" };
    const potentielColor = { élevé: "#2D7D4E", moyen: "#C9A84C", faible: "#C0392B" };
    const prescColor = { favorable: "#2D7D4E", attention: "#C9A84C", urgent: "#C0392B" };

    return (
      <div style={styles.resultsPage}>
        {/* Header */}
        <div style={styles.resultsHeader}>
          <span style={styles.logo}>⚖ AVOC<span style={styles.logoGold}>ACTION</span></span>
          <span style={styles.subtitle}>Analyse de votre dossier</span>
          <button onClick={reset} style={styles.newAnalysisBtn}>+ Nouvelle analyse</button>
        </div>

        {isLoading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, gap:24, padding:60 }}>
            <div style={{ fontSize:48 }}>⚖️</div>
            <div style={{ color:"#C9A84C", fontSize:18, fontFamily:"Palatino Linotype, serif" }}>Analyse en cours…</div>
            <div style={{ color:"#8B9AB0", fontSize:13, fontFamily:"Calibri, sans-serif", textAlign:"center", maxWidth:400 }}>
              Recherche dans le registre officiel des actions de groupe 2025, vérification des délais de prescription, analyse de faisabilité collective…
            </div>
            <div style={styles.typing}>
              <span style={{ ...styles.dot, animationDelay:"0s" }} />
              <span style={{ ...styles.dot, animationDelay:"0.2s" }} />
              <span style={{ ...styles.dot, animationDelay:"0.4s" }} />
            </div>
          </div>
        ) : analyse ? (
          <div style={styles.resultsBody}>

            {/* ── Résumé ── */}
            <div style={styles.rCard}>
              <div style={styles.rCardHeader}>
                <span style={styles.rIcon}>📋</span>
                <span style={styles.rCardTitle}>Résumé du dossier</span>
                {analyse.entreprise && <span style={styles.rBadgeGray}>{analyse.entreprise}</span>}
                {analyse.urgence && <span style={{ ...styles.rBadge, background: urgenceColor[analyse.urgence]+"22", color: urgenceColor[analyse.urgence], border:`1px solid ${urgenceColor[analyse.urgence]}` }}>Urgence {analyse.urgence}</span>}
              </div>
              <p style={styles.rText}>{analyse.resume}</p>
            </div>

            {/* ── Scores ── */}
            {analyse.scores && (
              <div style={styles.rCard}>
                <div style={styles.rCardHeader}>
                  <span style={styles.rIcon}>📊</span>
                  <span style={styles.rCardTitle}>Score de faisabilité collective</span>
                  <span style={{ fontSize:28, fontWeight:"bold", color: scoreColor(analyse.scores.global), marginLeft:"auto", fontFamily:"Palatino Linotype, serif" }}>
                    {analyse.scores.global}/100
                  </span>
                </div>
                <div style={{ display:"flex", gap:16, marginTop:8, flexWrap:"wrap" }}>
                  {[
                    { label:"Compatibilité externe", key:"compatibilite" },
                    { label:"Similarité interne", key:"similarite" },
                    { label:"Faisabilité collective", key:"faisabilite" },
                  ].map(({ label, key }) => {
                    const val = analyse.scores[key] || 0;
                    return (
                      <div key={key} style={{ flex:1, minWidth:160 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ fontSize:12, color:"#6B7280", fontFamily:"Calibri, sans-serif" }}>{label}</span>
                          <span style={{ fontSize:13, fontWeight:"bold", color: scoreColor(val) }}>{val}/100</span>
                        </div>
                        <div style={{ height:8, background:"#E5E7EB", borderRadius:4, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${val}%`, background: scoreColor(val), borderRadius:4, transition:"width 1s ease" }} />
                        </div>
                        <div style={{ fontSize:11, color: scoreColor(val), marginTop:4, fontFamily:"Calibri, sans-serif" }}>{scoreLabel(val)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── 3 cartes en ligne ── */}
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>

              {/* Prescription */}
              {analyse.prescription && (
                <div style={{ ...styles.rCard, flex:1, minWidth:220, borderTop:`4px solid ${prescColor[analyse.prescription.statut] || "#C9A84C"}` }}>
                  <div style={styles.rCardHeader}>
                    <span style={styles.rIcon}>⏱️</span>
                    <span style={styles.rCardTitle}>Prescription</span>
                    <span style={{ ...styles.rBadge, background: (prescColor[analyse.prescription.statut]||"#C9A84C")+"22", color: prescColor[analyse.prescription.statut]||"#C9A84C", border:`1px solid ${prescColor[analyse.prescription.statut]||"#C9A84C"}` }}>
                      {analyse.prescription.statut === "favorable" ? "✓ Favorable" : analyse.prescription.statut === "urgent" ? "⚠ Urgent" : "ℹ Attention"}
                    </span>
                  </div>
                  <p style={styles.rTextSm}>{analyse.prescription.message}</p>
                  {analyse.prescription.expiration && <p style={{ ...styles.rTextSm, color:"#C9A84C", fontWeight:"bold" }}>Expiration : {analyse.prescription.expiration}</p>}
                </div>
              )}

              {/* Rappel */}
              {analyse.rappel && (
                <div style={{ ...styles.rCard, flex:1, minWidth:220, borderTop:`4px solid ${analyse.rappel.existe ? "#C0392B" : "#2D7D4E"}` }}>
                  <div style={styles.rCardHeader}>
                    <span style={styles.rIcon}>{analyse.rappel.existe ? "🚨" : "✅"}</span>
                    <span style={styles.rCardTitle}>Rappel officiel</span>
                    <span style={{ ...styles.rBadge, background: analyse.rappel.existe ? "#FEF2F2" : "#F0FFF4", color: analyse.rappel.existe ? "#C0392B" : "#2D7D4E", border:`1px solid ${analyse.rappel.existe ? "#C0392B" : "#2D7D4E"}` }}>
                      {analyse.rappel.existe ? "Confirmé" : "Non détecté"}
                    </span>
                  </div>
                  <p style={styles.rTextSm}>{analyse.rappel.message}</p>
                </div>
              )}

              {/* Action de groupe */}
              {analyse.action_groupe && (
                <div style={{ ...styles.rCard, flex:1, minWidth:220, borderTop:`4px solid ${potentielColor[analyse.action_groupe.potentiel] || "#C9A84C"}` }}>
                  <div style={styles.rCardHeader}>
                    <span style={styles.rIcon}>⚖️</span>
                    <span style={styles.rCardTitle}>Action de groupe</span>
                    <span style={{ ...styles.rBadge, background:(potentielColor[analyse.action_groupe.potentiel]||"#C9A84C")+"22", color:potentielColor[analyse.action_groupe.potentiel]||"#C9A84C", border:`1px solid ${potentielColor[analyse.action_groupe.potentiel]||"#C9A84C"}` }}>
                      Potentiel {analyse.action_groupe.potentiel}
                    </span>
                  </div>
                  <p style={styles.rTextSm}>{analyse.action_groupe.message}</p>
                </div>
              )}
            </div>

            {/* ── Recommandation ── */}
            {analyse.recommandation && (
              <div style={{ ...styles.rCard, background:"#0F2040", border:"1px solid #C9A84C" }}>
                <div style={styles.rCardHeader}>
                  <span style={styles.rIcon}>💡</span>
                  <span style={{ ...styles.rCardTitle, color:"#C9A84C" }}>Recommandation</span>
                </div>
                <p style={{ ...styles.rText, color:"#E8E4DC" }}>{analyse.recommandation}</p>
              </div>
            )}

            {/* ── Prochaines étapes ── */}
            {analyse.etapes && (
              <div style={styles.rCard}>
                <div style={styles.rCardHeader}>
                  <span style={styles.rIcon}>🎯</span>
                  <span style={styles.rCardTitle}>Prochaines étapes</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:4 }}>
                  {analyse.etapes.map((e, i) => (
                    <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:"#0A1628", color:"#C9A84C", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:"bold", flexShrink:0, fontFamily:"Palatino Linotype, serif" }}>
                        {i+1}
                      </div>
                      <p style={{ ...styles.rText, margin:0, paddingTop:4 }}>{e}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div style={{ padding:40, color:"#8B9AB0", textAlign:"center", fontFamily:"Calibri, sans-serif" }}>
            {messages[0]?.content || "Analyse en cours…"}
          </div>
        )}
      </div>
    );
  }

  // ═══ PAGE D'ACCUEIL ═════════════════════════════════════
  if (!started) {
    return (
      <div style={styles.landingPage}>
        {/* Header */}
        <div style={styles.landingHeader}>
          <span style={styles.logo}>⚖ AVOC<span style={styles.logoGold}>ACTION</span></span>
          <span style={styles.subtitle}>Agent IA · Droit de la Consommation</span>
        </div>

        {/* Hero */}
        <div style={styles.landingHero}>
          <div style={styles.landingBadge}>Loi n° 2025-391 du 30 avril 2025</div>
          <h1 style={styles.landingTitle}>
            La justice collective,<br />
            <span style={styles.landingTitleGold}>accessible à tous.</span>
          </h1>
          <p style={styles.landingSubtitle}>
            AVOCACTION analyse votre situation, recherche les actions de groupe existantes
            et vérifie vos délais de prescription — en moins de 3 minutes.
          </p>
          <button
            onClick={() => setStarted(true)}
            style={styles.landingCTA}
            onMouseEnter={e => { e.currentTarget.style.background = "#B8962A"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#C9A84C"; }}
          >
            Analyser ma situation →
          </button>
          <p style={styles.landingCTASub}>Gratuit · Confidentiel · Résultat immédiat</p>
        </div>

        {/* Features */}
        <div style={styles.landingFeatures}>
          {[
            { icon:"🔍", titre:"Registre officiel", desc:"Consultation automatique du registre des actions de groupe 2025 du Ministère de la Justice" },
            { icon:"⏱️", titre:"Surveillance prescription", desc:"Vérification des délais légaux (2 ans produit, 5 ans faits) avec alertes automatiques" },
            { icon:"🧠", titre:"Analyse IA", desc:"Agent IA décisionnel qui qualifie votre dossier et calcule un score de faisabilité collective" },
            { icon:"🔔", titre:"Clustering clients", desc:"Détection de cas similaires au cabinet — vous pouvez rejoindre une action existante" },
          ].map((f, i) => (
            <div key={i} style={styles.landingFeatureCard}>
              <div style={styles.landingFeatureIcon}>{f.icon}</div>
              <div style={styles.landingFeatureTitle}>{f.titre}</div>
              <div style={styles.landingFeatureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Comment ça marche */}
        <div style={styles.landingSteps}>
          <h2 style={styles.landingH2}>Comment ça marche ?</h2>
          <div style={styles.landingStepsRow}>
            {[
              { n:"1", titre:"Décrivez votre situation", desc:"Un questionnaire guidé de 10 à 15 minutes selon votre cas" },
              { n:"2", titre:"L'agent analyse", desc:"Recherche dans les bases officielles, scoring automatique, vérification des délais" },
              { n:"3", titre:"Recevez votre analyse", desc:"Rapport personnalisé avec recommandations et prochaines étapes concrètes" },
            ].map((s, i) => (
              <div key={i} style={styles.landingStep}>
                <div style={styles.landingStepN}>{s.n}</div>
                <div style={styles.landingStepTitle}>{s.titre}</div>
                <div style={styles.landingStepDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bas */}
        <div style={styles.landingBottom}>
          <button
            onClick={() => setStarted(true)}
            style={styles.landingCTA}
            onMouseEnter={e => { e.currentTarget.style.background = "#B8962A"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#C9A84C"; }}
          >
            Commencer l'analyse →
          </button>
          <p style={styles.landingLegal}>
            Analyse basée sur la loi n° 2025-391 du 30 avril 2025 · Art. L217-4 C. conso · Art. 2224 C. civil
          </p>
        </div>
      </div>
    );
  }

  // ═══ PAGE QUESTIONNAIRE PLEIN ÉCRAN ════════════════════
  return (
    <div style={styles.quizPage}>
      {/* Header */}
      <div style={styles.quizHeader}>
        <span style={styles.logo}>⚖ AVOC<span style={styles.logoGold}>ACTION</span></span>
        <div style={styles.quizProgress}>
          <span style={styles.stepCounter}>{stepIndex + 1} / {activeSteps.length}</span>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Zone réservée (bandeau supprimé - confirmation = étape) */}
      <div style={{ minHeight: 0 }}>

        {/* Badge entreprise confirmée */}
        {answers.entreprise && !brandStep && (
          <div style={{ padding: "8px 40px", background: "#EAF3DE", borderBottom: "1px solid #3B6D11", fontSize: 12, color: "#1F4A0A", fontFamily: "Calibri, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
            ✓ Entreprise : <strong>{answers.entreprise}</strong>
            {answers.type && <span style={{ color: "#6B7280", marginLeft: 6 }}>· {answers.type}</span>}
          </div>
        )}

        {/* ═══ ÉTAPE CONFIRMATION MARQUE ═══ */}
        {brandStep ? (
          <div style={styles.questionContainer}>
            <div style={styles.stepTabs}>
              {activeSteps.map((s, i) => (
                <div key={s.id} style={{
                  ...styles.stepTab,
                  ...(i === stepIndex ? styles.stepTabActive : {}),
                  ...(i < stepIndex ? styles.stepTabDone : {}),
                }} />
              ))}
            </div>
            <div style={styles.stepLabel}>Entreprise</div>
            <p style={styles.question}>
              {brandLoading
                ? "Identification de l'entreprise en cours…"
                : brandResults.length === 1 && brandResults[0].marque && brandResults[0].marque !== brandResults[0].nom
                ? `Est-ce la marque ${brandResults[0].marque} (groupe ${brandResults[0].nom}) ?`
                : "Quelle est l'entreprise ou la marque concernée ?"}
            </p>

            {brandLoading ? (
              <div style={styles.typing}>
                <span style={{ ...styles.dot, animationDelay: "0s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
              </div>
            ) : (
              <div style={styles.optionsGrid}>
                {brandResults.map((r, i) => {
                  const label = r.marque && r.marque !== r.nom
                    ? `${r.marque} — ${r.nom}`
                    : r.nom;
                  return (
                    <button
                      key={i}
                      onClick={() => confirmBrand(label)}
                      style={styles.optionBtn}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.background = "#FFF8E7"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#FFFFFF"; }}
                    >
                      <div style={{ fontWeight: "bold", color: "#0A1628" }}>
                        {r.marque && r.marque !== r.nom ? r.marque : r.nom}
                      </div>
                      {r.marque && r.marque !== r.nom && (
                        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Groupe {r.nom}</div>
                      )}
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{r.secteur}</div>
                    </button>
                  );
                })}
                <button
                  onClick={() => confirmBrand("Non précisé")}
                  style={{ ...styles.optionBtn, color: "#9CA3AF", fontSize: 13 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#D1D5DB"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
                >
                  Autre entreprise / Je ne sais pas
                </button>
              </div>
            )}
          </div>
        ) : false ? null : (
          /* Question active */
          <div style={styles.questionContainer}>
            {/* Étiquettes étapes */}
            <div style={styles.stepTabs}>
              {activeSteps.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    ...styles.stepTab,
                    ...(i === stepIndex ? styles.stepTabActive : {}),
                    ...(i < stepIndex ? styles.stepTabDone : {}),
                  }}
                  title={s.label}
                />
              ))}
            </div>

            <div style={styles.stepLabel}>{currentStep.label}</div>
            <p style={styles.question}>{currentStep.question}</p>

            {/* Alerte prescription */}
            {alert && (
              <div style={styles.alertBox}>
                {alert}
              </div>
            )}

            {/* Message de clarification */}
            {clarif ? (
              <div style={styles.clarifBox}>
                <p style={styles.clarifMsg}>{clarif.message}</p>
                <textarea
                  style={styles.clarifInput}
                  value={clarifInput}
                  onChange={(e) => setClarifInput(e.target.value)}
                  placeholder="Votre précision…"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleClarifSubmit();
                    }
                  }}
                  autoFocus
                />
                <div style={styles.clarifButtons}>
                  <button onClick={handleClarifSubmit} style={styles.clarifConfirm} disabled={!clarifInput.trim()}>
                    Confirmer
                  </button>
                  <button onClick={skipClarif} style={styles.clarifSkip}>
                    Passer
                  </button>
                </div>
              </div>
            ) : currentStep.type === "date" ? (
              <div>
                <input
                  style={styles.textInput}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={currentStep.placeholder}
                  onKeyDown={(e) => { if (e.key === "Enter") handleTextSubmit(); }}
                  autoFocus
                />
                {textValue && (() => {
                  // Alerte prescription automatique selon la date saisie
                  const match = textValue.match(/(\d{4})/);
                  const year = match ? parseInt(match[1]) : null;
                  const age = year ? new Date().getFullYear() - year : null;
                  if (age >= 5) return <div style={styles.alertBox}>⚠️ Attention : le délai de prescription de 5 ans (Art. 2224 C. civil) pourrait être atteint. Vérifiez rapidement avec un avocat.</div>;
                  if (age >= 2) return <div style={{ ...styles.alertBox, background:"#FFFBEB", borderColor:"#CA8A04", color:"#713F12" }}>ℹ️ Si le problème concerne un produit physique, la garantie légale (2 ans) est dépassée. La prescription faits (5 ans) court encore.</div>;
                  return null;
                })()}
                <button
                  onClick={handleTextSubmit}
                  style={{ ...styles.submitBtn, opacity: textValue.trim() ? 1 : 0.5, marginTop: 12 }}
                  disabled={!textValue.trim()}
                >
                  Continuer →
                </button>
                <p style={styles.hint}>Entrée pour valider · Format libre : 15/01/2024 ou 01/2024</p>
              </div>
            ) : currentStep.type === "textarea" ? (
              <div>
                <textarea
                  ref={textareaRef}
                  style={styles.textarea}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={currentStep.placeholder}
                  rows={5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) handleTextSubmit();
                  }}
                />
                <button
                  onClick={handleTextSubmit}
                  style={{ ...styles.submitBtn, opacity: (textValue.trim().length >= 10 && !analysing) ? 1 : 0.5 }}
                  disabled={textValue.trim().length < 10 || analysing}
                >
                  {analysing ? "Analyse en cours…" : "Continuer →"}
                </button>
                {analysing && <p style={styles.hint}>Identification de l'entreprise et du type de problème…</p>}
                {!analysing && <p style={styles.hint}>Ctrl+Entrée pour valider</p>}
              </div>
            ) : currentStep.type === "text" ? (
              <div>
                <input
                  style={styles.textInput}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={currentStep.placeholder}
                  onKeyDown={(e) => { if (e.key === "Enter") handleTextSubmit(); }}
                  autoFocus
                />
                {currentStep.optional && (
                  <button
                    onClick={() => saveAndAdvance(currentStep.optional)}
                    style={styles.optionalBtn}
                  >
                    {currentStep.optional}
                  </button>
                )}
                <button
                  onClick={handleTextSubmit}
                  style={{ ...styles.submitBtn, opacity: textValue.trim() ? 1 : 0.5 }}
                  disabled={!textValue.trim()}
                >
                  Continuer →
                </button>
              </div>
            ) : currentStep.multiSelect ? (
              /* Multi-select — cases à cocher */
              <div>
                <div style={styles.optionsGrid}>
                  {(currentStep.dynamicOptions
                    ? getProblemeOptions(answers.type)
                    : currentStep.options
                  ).map((opt) => {
                    const checked = multiSelected.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          setMultiSelected(prev =>
                            prev.includes(opt)
                              ? prev.filter(o => o !== opt)
                              : [...prev, opt]
                          );
                        }}
                        style={{
                          ...styles.optionBtn,
                          borderColor: checked ? "#C9A84C" : "#E5E7EB",
                          background: checked ? "#FFF8E7" : "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <span style={{
                          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                          border: checked ? "2px solid #C9A84C" : "2px solid #D1D5DB",
                          background: checked ? "#C9A84C" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: 13, fontWeight: "bold",
                        }}>
                          {checked ? "✓" : ""}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    if (multiSelected.length > 0) {
                      handleOption(multiSelected.join(", "));
                      setMultiSelected([]);
                    }
                  }}
                  style={{
                    ...styles.submitBtn,
                    marginTop: 16,
                    opacity: multiSelected.length > 0 ? 1 : 0.4,
                  }}
                  disabled={multiSelected.length === 0}
                >
                  Valider ({multiSelected.length} sélectionné{multiSelected.length > 1 ? "s" : ""}) →
                </button>
              </div>
            ) : (
              /* Single select */
              <div style={styles.optionsGrid}>
                {(currentStep.dynamicOptions
                  ? getProblemeOptions(answers.type)
                  : currentStep.options
                ).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    style={styles.optionBtn}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#C9A84C";
                      e.currentTarget.style.background = "#FFF8E7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E5E7EB";
                      e.currentTarget.style.background = "#FFFFFF";
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Navigation retour */}
            {stepIndex > 0 && !clarif && (
              <button
                onClick={() => {
                  setAlert(null);
                  setTextValue("");
                  setMultiSelected([]);
                  setStepIndex((i) => Math.max(0, i - 1));
                }}
                style={styles.backBtn}
              >
                ← Retour
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════
const styles = {
  // ══ PAGE D'ACCUEIL ══════════════════════════════════════
  landingPage: {
    minHeight: "100vh",
    background: "#0A1628",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Palatino Linotype', Palatino, serif",
    color: "#FFFFFF",
  },
  landingHeader: {
    padding: "20px 48px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    borderBottom: "1px solid #1E3050",
  },
  landingHero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "72px 24px 48px",
    gap: 20,
    maxWidth: 760,
    margin: "0 auto",
    width: "100%",
  },
  landingBadge: {
    fontSize: 12,
    padding: "5px 14px",
    borderRadius: 20,
    border: "1px solid #C9A84C",
    color: "#C9A84C",
    fontFamily: "Calibri, sans-serif",
    letterSpacing: 0.5,
  },
  landingTitle: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 1.2,
    margin: 0,
    color: "#FFFFFF",
  },
  landingTitleGold: { color: "#C9A84C" },
  landingSubtitle: {
    fontSize: 17,
    color: "#8B9AB0",
    lineHeight: 1.7,
    fontFamily: "Calibri, sans-serif",
    maxWidth: 560,
    margin: 0,
  },
  landingCTA: {
    padding: "16px 40px",
    background: "#C9A84C",
    color: "#0A1628",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Palatino Linotype', serif",
    transition: "background 0.2s",
    letterSpacing: 0.5,
  },
  landingCTASub: {
    fontSize: 12,
    color: "#5B6B7C",
    fontFamily: "Calibri, sans-serif",
    margin: 0,
  },
  landingFeatures: {
    display: "flex",
    gap: 16,
    padding: "0 48px 48px",
    flexWrap: "wrap",
    maxWidth: 1100,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  landingFeatureCard: {
    flex: 1,
    minWidth: 200,
    background: "#0F2040",
    border: "1px solid #1E3050",
    borderRadius: 12,
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  landingFeatureIcon: { fontSize: 28 },
  landingFeatureTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#C9A84C",
    fontFamily: "Palatino Linotype, serif",
  },
  landingFeatureDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 1.6,
    fontFamily: "Calibri, sans-serif",
  },
  landingSteps: {
    background: "#0F2040",
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 32,
    borderTop: "1px solid #1E3050",
    borderBottom: "1px solid #1E3050",
  },
  landingH2: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    margin: 0,
    textAlign: "center",
  },
  landingStepsRow: {
    display: "flex",
    gap: 32,
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 900,
    width: "100%",
  },
  landingStep: {
    flex: 1,
    minWidth: 220,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    textAlign: "center",
  },
  landingStepN: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#C9A84C",
    color: "#0A1628",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Palatino Linotype, serif",
  },
  landingStepTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Palatino Linotype, serif",
  },
  landingStepDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 1.6,
    fontFamily: "Calibri, sans-serif",
  },
  landingBottom: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 24px",
    gap: 16,
  },
  landingLegal: {
    fontSize: 11,
    color: "#3D4F63",
    fontFamily: "Calibri, sans-serif",
    textAlign: "center",
    margin: 0,
  },

  // ══ PAGE QUESTIONNAIRE PLEIN ÉCRAN ════════════════════
  quizPage: {
    minHeight: "100vh",
    background: "#F7F5F0",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Palatino Linotype', Palatino, serif",
  },
  quizHeader: {
    background: "#0A1628",
    padding: "16px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "3px solid #C9A84C",
  },
  quizProgress: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  // ══ PAGE RÉSULTATS PLEIN ÉCRAN ══════════════════════════
  resultsPage: {
    minHeight: "100vh",
    background: "#0A1628",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Palatino Linotype', Palatino, serif",
  },
  resultsHeader: {
    padding: "20px 40px",
    borderBottom: "1px solid #1E3050",
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  resultsBody: {
    flex: 1,
    maxWidth: 900,
    margin: "0 auto",
    padding: "32px 24px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: "100%",
    overflowY: "auto",
  },
  newAnalysisBtn: {
    marginLeft: "auto",
    padding: "8px 20px",
    background: "transparent",
    border: "1px solid #C9A84C",
    color: "#C9A84C",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "Calibri, sans-serif",
  },
  loadingText: {
    fontSize: 13,
    color: "#8B9AB0",
    fontFamily: "Calibri, sans-serif",
    fontStyle: "italic",
    marginBottom: 8,
  },
  rCard: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  rCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  rCardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0A1628",
    fontFamily: "Palatino Linotype, serif",
  },
  rIcon: { fontSize: 20 },
  rText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.7,
    fontFamily: "Calibri, sans-serif",
    margin: 0,
  },
  rTextSm: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 1.6,
    fontFamily: "Calibri, sans-serif",
    margin: 0,
  },
  rBadge: {
    fontSize: 12,
    padding: "3px 10px",
    borderRadius: 20,
    fontFamily: "Calibri, sans-serif",
    fontWeight: "bold",
  },
  rBadgeGray: {
    fontSize: 12,
    padding: "3px 10px",
    borderRadius: 20,
    background: "#F3F4F6",
    color: "#6B7280",
    fontFamily: "Calibri, sans-serif",
  },

  // ══ Éléments communs ════════════════════════════════════
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#FFFFFF",
  },
  logoGold: { color: "#C9A84C" },
  subtitle: {
    fontSize: 12,
    color: "#8B9AB0",
    fontFamily: "Calibri, sans-serif",
  },
  messageBlock: { display: "flex", flexDirection: "column", gap: 8 },
  messageRole: {
    fontSize: 11,
    color: "#C9A84C",
    fontFamily: "Calibri, sans-serif",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  messageContent: {
    fontSize: 15,
    color: "#E8E4DC",
    lineHeight: 1.8,
    whiteSpace: "pre-wrap",
    fontFamily: "Calibri, sans-serif",
    background: "#0F2040",
    padding: "20px 24px",
    borderRadius: 12,
    borderLeft: "3px solid #C9A84C",
  },
  typing: { display: "flex", gap: 6, alignItems: "center", padding: "8px 0" },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#C9A84C",
    display: "inline-block",
    animation: "bounce 1s infinite",
  },

  // ══ Questionnaire ═══════════════════════════════════════
  stepCounter: {
    fontSize: 13,
    color: "#C9A84C",
    fontFamily: "Calibri, sans-serif",
    whiteSpace: "nowrap",
  },
  progressBar: {
    width: 200,
    height: 4,
    background: "#1E3050",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    background: "#C9A84C",
    borderRadius: 2,
    transition: "width 0.4s ease",
  },
  questionContainer: {
    flex: 1,
    maxWidth: 680,
    margin: "0 auto",
    padding: "48px 24px 32px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  stepTabs: {
    display: "flex",
    gap: 4,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  stepTab: {
    width: 18,
    height: 4,
    borderRadius: 2,
    background: "#E5E7EB",
    transition: "background 0.2s",
  },
  stepTabActive: { background: "#C9A84C" },
  stepTabDone: { background: "#0A1628" },
  stepLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#C9A84C",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontFamily: "Calibri, sans-serif",
  },
  question: {
    fontSize: 15,
    color: "#0A1628",
    lineHeight: 1.5,
    margin: "0 0 4px",
    fontWeight: "bold",
  },
  alertBox: {
    background: "#FEF2F2",
    border: "1.5px solid #A32D2D",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 12,
    color: "#7B1F1F",
    lineHeight: 1.5,
    fontFamily: "Calibri, sans-serif",
  },
  optionsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  optionBtn: {
    padding: "11px 16px",
    background: "#FFFFFF",
    border: "1.5px solid #E5E7EB",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 13,
    color: "#0A1628",
    textAlign: "left",
    fontFamily: "Calibri, sans-serif",
    transition: "all 0.15s",
    lineHeight: 1.4,
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1.5px solid #E5E7EB",
    borderRadius: 10,
    fontSize: 13,
    color: "#0A1628",
    fontFamily: "Calibri, sans-serif",
    resize: "vertical",
    outline: "none",
    lineHeight: 1.5,
    boxSizing: "border-box",
  },
  textInput: {
    width: "100%",
    padding: "12px",
    border: "1.5px solid #E5E7EB",
    borderRadius: 10,
    fontSize: 13,
    color: "#0A1628",
    fontFamily: "Calibri, sans-serif",
    outline: "none",
    marginBottom: 8,
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "#0A1628",
    color: "#C9A84C",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Palatino Linotype, serif",
    marginTop: 8,
    transition: "opacity 0.2s",
  },
  optionalBtn: {
    width: "100%",
    padding: "10px",
    background: "transparent",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Calibri, sans-serif",
    marginBottom: 4,
  },
  hint: {
    fontSize: 11,
    color: "#9CA3AF",
    margin: "4px 0 0",
    fontFamily: "Calibri, sans-serif",
  },
  clarifBox: {
    background: "#FFF8E7",
    border: "2px solid #C9A84C",
    borderRadius: 10,
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  clarifMsg: {
    fontSize: 13,
    color: "#0A1628",
    lineHeight: 1.5,
    margin: 0,
    fontFamily: "Calibri, sans-serif",
  },
  clarifInput: {
    width: "100%",
    padding: "10px",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "Calibri, sans-serif",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
  },
  clarifButtons: { display: "flex", gap: 8 },
  clarifConfirm: {
    flex: 1,
    padding: "9px",
    background: "#0A1628",
    color: "#C9A84C",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "Calibri, sans-serif",
  },
  clarifSkip: {
    padding: "9px 16px",
    background: "transparent",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Calibri, sans-serif",
  },
  backBtn: {
    marginTop: 8,
    padding: "8px 0",
    background: "transparent",
    border: "none",
    color: "#9CA3AF",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "Calibri, sans-serif",
    alignSelf: "flex-start",
  },
  searchBtn: {
    padding: "0 14px",
    background: "#0A1628",
    color: "#C9A84C",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 18,
    flexShrink: 0,
    height: 42,
    transition: "opacity 0.2s",
  },
  brandResults: {
    border: "1.5px solid #E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },
  brandResultsTitle: {
    fontSize: 11,
    color: "#6B7280",
    fontFamily: "Calibri, sans-serif",
    padding: "8px 12px 4px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  brandResultItem: {
    width: "100%",
    padding: "10px 12px",
    background: "#F9FAFB",
    border: "none",
    borderTop: "1px solid #F3F4F6",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
    transition: "all 0.15s",
    textAlign: "left",
  },
  brandName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0A1628",
    fontFamily: "Calibri, sans-serif",
  },
  brandSecteur: {
    fontSize: 11,
    color: "#6B7280",
    fontFamily: "Calibri, sans-serif",
  },
  brandLoading: {
    padding: "10px 12px",
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Calibri, sans-serif",
    fontStyle: "italic",
  },
  searchSpinner: {
    display: "flex",
    alignItems: "center",
    padding: "0 14px",
    color: "#C9A84C",
    fontSize: 20,
    fontWeight: "bold",
  },
  brandNone: {
    width: "100%",
    padding: "9px 12px",
    background: "transparent",
    border: "none",
    borderTop: "1px solid #F3F4F6",
    cursor: "pointer",
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "Calibri, sans-serif",
    textAlign: "left",
    fontStyle: "italic",
  },
  autoDetectedBadge: {
    padding: "10px 20px",
    background: "#EAF3DE",
    borderBottom: "2px solid #3B6D11",
    fontSize: 12,
    color: "#1F4A0A",
    fontFamily: "Calibri, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  autoDetectedEdit: {
    marginLeft: "auto",
    background: "transparent",
    border: "1px solid #3B6D11",
    borderRadius: 6,
    padding: "2px 10px",
    fontSize: 11,
    color: "#3B6D11",
    cursor: "pointer",
    fontFamily: "Calibri, sans-serif",
  },
  brandConfirmBanner: {
    borderBottom: "1px solid #E5E7EB",
    background: "#FAFAF8",
  },
  brandConfirmLoading: {
    padding: "10px 20px",
    fontSize: 12,
    color: "#C9A84C",
    fontFamily: "Calibri, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  brandSpinnerDot: {
    animation: "pulse 1s infinite",
    fontSize: 10,
  },
  brandConfirmedBox: {
    padding: "10px 20px",
    fontSize: 13,
    color: "#0A1628",
    fontFamily: "Calibri, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#F0FFF4",
    borderBottom: "2px solid #2D7D4E",
  },
  brandConfirmedIcon: {
    color: "#2D7D4E",
    fontWeight: "bold",
    fontSize: 16,
  },
  brandChangeBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: "1px solid #D1D5DB",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 11,
    color: "#6B7280",
    cursor: "pointer",
    fontFamily: "Calibri, sans-serif",
  },
  brandAskBox: {
    padding: "12px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  brandAskTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0A1628",
    fontFamily: "Calibri, sans-serif",
  },
  brandAskOptions: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  brandAskBtn: {
    padding: "9px 14px",
    background: "#fff",
    border: "1.5px solid #E5E7EB",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    textAlign: "left",
    fontFamily: "Calibri, sans-serif",
    transition: "all .15s",
    display: "flex",
    alignItems: "center",
  },
  brandAskNone: {
    padding: "7px 14px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "Calibri, sans-serif",
    textAlign: "left",
    fontStyle: "italic",
  },

  // ── Récap final ─────────────────────────────────────────

};
