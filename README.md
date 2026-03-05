# ⚖️ AVOCACTION — Agent IA Droit de la Consommation

Agent IA sécurisé pour analyser des situations juridiques et identifier des actions de groupe.

---

## 🚀 Déploiement en 5 étapes

### Étape 1 — Prérequis

Installe [Node.js](https://nodejs.org) (version 18 ou plus) si ce n'est pas déjà fait.

### Étape 2 — Installation locale

```bash
# Cloner ou décompresser le projet, puis :
cd avocaction
npm install
```

### Étape 3 — Configurer ta clé API

```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Ouvrir .env.local et remplacer la valeur :
# ANTHROPIC_API_KEY=sk-ant-VOTRE-VRAIE-CLÉ
```

👉 Obtenir une clé API : https://console.anthropic.com

### Étape 4 — Tester en local

```bash
npm run dev
# Ouvre http://localhost:3000
```

### Étape 5 — Déployer sur Vercel (gratuit)

**a) Crée un compte GitHub** (si pas déjà fait) : https://github.com

**b) Pousse le projet sur GitHub :**
```bash
git init
git add .
git commit -m "AVOCACTION v1.0"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/avocaction.git
git push -u origin main
```

**c) Déploie sur Vercel :**
1. Va sur https://vercel.com et connecte-toi avec GitHub
2. Clique "Add New Project"
3. Importe ton repo `avocaction`
4. Dans "Environment Variables", ajoute :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : `sk-ant-ta-clé-ici`
5. Clique "Deploy" ✅

Ton site sera en ligne sur `https://avocaction.vercel.app` en 2 minutes !

---

## 🔐 Sécurité

La clé API Anthropic est utilisée **uniquement côté serveur** via `pages/api/chat.js`.
Elle n'est **jamais exposée** au navigateur du client.

```
Navigateur → /api/chat (Next.js serveur) → API Anthropic
                    ↑
             Clé API sécurisée ici
```

---

## 📁 Structure du projet

```
avocaction/
├── pages/
│   ├── index.js          ← Page principale
│   ├── _app.js           ← Config globale
│   └── api/
│       └── chat.js       ← 🔐 Route sécurisée (clé API serveur)
├── components/
│   ├── AgentChat.js      ← Interface de chat
│   └── ScoreCard.js      ← Affichage des scores d'analyse
├── styles/
│   └── globals.css       ← Styles globaux + animations
├── .env.example          ← Template variables d'environnement
├── .env.local            ← ⚠️ NE PAS COMMITTER (dans .gitignore)
├── .gitignore
├── next.config.js
└── package.json
```

---

## 🔮 Prochaines évolutions

- [ ] Connexion au registre public des actions de groupe (loi 2025)
- [ ] Base vectorielle pour similarité avec cas internes (Pinecone / pgvector)
- [ ] Système de veille automatique (cron job + email)
- [ ] Rappels avant prescription (SendGrid)
- [ ] Paiement Stripe pour modèle payant
- [ ] Dashboard cabinet pour gérer les dossiers

---

## 📞 Support

Pour toute question technique, contactez votre développeur ou consultez :
- Documentation Next.js : https://nextjs.org/docs
- Documentation Anthropic : https://docs.anthropic.com
- Support Vercel : https://vercel.com/docs
