# 🚀 GUIDE: Publier sur GitHub IGC-Hub

## 📋 Étapes pour créer le repository

### 1. Créer le repository sur GitHub

1. Allez sur https://github.com/IGC-Hub
2. Cliquez sur **"New repository"** (bouton vert)
3. Configurez:
   - **Repository name:** `bail-tal-cooperative`
   - **Description:** `Formulaire de bail électronique TAL pour coopératives d'habitation du Québec`
   - **Visibility:** Private ou Public (votre choix)
   - ⚠️ **NE PAS** cocher "Add a README file"
   - ⚠️ **NE PAS** ajouter .gitignore
   - ⚠️ **NE PAS** choisir de licence (pour l'instant)
4. Cliquez sur **"Create repository"**

---

### 2. Initialiser Git localement

Ouvrez un terminal dans le dossier `bail-tal-coop`:

```bash
cd bail-tal-coop

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎉 Initial commit - Formulaire de bail TAL pour coopératives"
```

---

### 3. Connecter au repository GitHub

```bash
# Ajouter le remote (remplacez YOUR-REPO-NAME par le nom exact)
git remote add origin https://github.com/IGC-Hub/bail-tal-cooperative.git

# Vérifier
git remote -v
```

---

### 4. Pousser le code

```bash
# Renommer la branche en main (si nécessaire)
git branch -M main

# Pousser le code
git push -u origin main
```

---

### 5. Ajouter les secrets GitHub (pour CI/CD)

Dans les settings du repo GitHub:
1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez:
   - `SUPABASE_URL`: Votre URL Supabase
   - `SUPABASE_ANON_KEY`: Votre clé publique Supabase

---

## 🔐 SÉCURITÉ

### Fichiers déjà protégés par .gitignore:
- ✅ `.env.local` (credentials)
- ✅ `.env` (credentials)
- ✅ `node_modules/` (dépendances)
- ✅ `.next/` (build)

### ⚠️ IMPORTANT - Avant de pousser:

**Vérifiez qu'il n'y a PAS de credentials dans:**
```bash
# Vérifier les fichiers qui seront poussés
git status

# Vérifier le contenu
cat .env.local  # Ne devrait PAS exister dans le repo
```

---

## 📝 README suggéré pour GitHub

Voici un README.md parfait pour votre organisation:

```markdown
# 🏘️ Bail TAL - Coopérative d'habitation

Formulaire de bail électronique pour coopératives d'habitation du Québec, conforme au **Tribunal administratif du logement (TAL)**.

## 🎯 Objectif

Application web permettant aux coopératives d'habitation de:
- Créer des baux conformes au TAL
- Gérer les signatures électroniques
- Générer des PDF officiels
- Suivre l'état des baux

## 🚀 Démarrage rapide

\`\`\`bash
npm install
cp .env.example .env.local
# Configurez .env.local avec vos credentials Supabase
npm run dev
\`\`\`

## 📚 Documentation

- [Guide de démarrage](./DEMARRAGE.md)
- [Documentation complète](./README.md)
- [Vue d'ensemble du projet](./PROJET_LIVRÉ.md)

## 🛠️ Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- React Hook Form

## 📄 Licence

Propriétaire - IGC Hub © 2026

## 🤝 Support

Pour toute question, contactez l'équipe IGC Hub.
\`\`\`

---

## 🔄 Workflow de développement suggéré

### Branches recommandées:
```bash
main          # Production
develop       # Développement
feature/*     # Nouvelles fonctionnalités
hotfix/*      # Corrections urgentes
```

### Créer une branche de développement:
```bash
git checkout -b develop
git push -u origin develop
```

---

## 📦 Structure du repository

```
IGC-Hub/bail-tal-cooperative/
├── README.md
├── DEMARRAGE.md
├── PROJET_LIVRÉ.md
├── package.json
├── app/
├── components/
├── lib/
├── types/
└── ...
```

---

## 🎨 Badge GitHub suggérés

Ajoutez dans votre README.md:

```markdown
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)
```

---

## ✅ Checklist finale

Avant de pousser sur GitHub, vérifiez:

- [ ] `.env.local` est dans `.gitignore`
- [ ] Pas de credentials dans le code
- [ ] `node_modules/` ignoré
- [ ] README.md informatif créé
- [ ] LICENSE ajoutée (si applicable)
- [ ] DEMARRAGE.md présent
- [ ] Toutes les dépendances dans package.json

---

## 🚀 Commandes complètes (copier-coller)

```bash
# Aller dans le dossier
cd bail-tal-coop

# Initialiser Git
git init
git add .
git commit -m "🎉 Initial commit - Formulaire de bail TAL pour coopératives"

# Connecter à GitHub IGC-Hub
git remote add origin https://github.com/IGC-Hub/bail-tal-cooperative.git
git branch -M main

# Pousser
git push -u origin main
```

---

## 📞 Besoin d'aide?

Si vous rencontrez des problèmes:
1. Vérifiez vos permissions sur IGC-Hub
2. Assurez-vous que le nom du repo est correct
3. Vérifiez votre authentification Git

---

**Le projet est prêt à être poussé sur GitHub! 🎉**
