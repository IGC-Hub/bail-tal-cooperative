# 🏘️ Bail TAL - Coopérative d'habitation

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)](https://supabase.com/)

> Formulaire de bail électronique pour coopératives d'habitation du Québec, conforme au **Tribunal administratif du logement (TAL)**.

---

## 🎯 Objectif

Application web moderne permettant aux **coopératives d'habitation du Québec** de:

- ✅ Créer des baux conformes au formulaire TAL officiel
- ✅ Gérer les informations des locataires et coopératives
- ✅ Collecter les signatures électroniques multiples
- ✅ Générer des PDF officiels conformes au TAL
- ✅ Suivre l'état d'avancement des baux (brouillon, en attente, signé)
- ✅ Sauvegarder automatiquement les données

---

## 📸 Aperçu

Interface fidèle au formulaire TAL officiel avec:
- Sidebar de navigation par sections (A-H)
- Formulaires avec validation en temps réel
- Système de sauvegarde automatique
- Workflow de signatures séquentiel

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase (gratuit)

### Installation

```bash
# Cloner le repository
git clone https://github.com/IGC-Hub/bail-tal-cooperative.git
cd bail-tal-cooperative

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditez .env.local avec vos identifiants Supabase

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

---

## 🗄️ Configuration Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Dans **SQL Editor**, exécutez le script: `schema_bail_tal_coop_v1.1.sql`
4. Récupérez vos identifiants dans **Settings** → **API**
5. Ajoutez-les dans `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique
```

---

## 📋 Fonctionnalités

### ✅ Implémentées

- [x] Navigation par sections avec sidebar
- [x] Section A: Identification coopérative et locataire(s)
- [x] Validation des formulaires
- [x] Sauvegarde automatique
- [x] Gestion multi-locataires
- [x] Interface responsive
- [x] Types TypeScript complets

### 🚧 En cours

- [ ] Section B: Description du logement
- [ ] Section C: Durée du bail
- [ ] Section D: Loyer et paiement
- [ ] Section E: Services et conditions
- [ ] Section F: Restrictions
- [ ] Section H: Solidarité et caution
- [ ] Génération PDF finale
- [ ] Système de signatures électroniques
- [ ] Envoi d'emails automatiques

---

## 🛠️ Technologies

| Technologie | Usage |
|-------------|-------|
| **Next.js 14** | Framework React avec App Router |
| **TypeScript** | Typage statique et sécurité |
| **Tailwind CSS** | Styles et design system |
| **Supabase** | Base de données PostgreSQL + Auth |
| **React Hook Form** | Gestion des formulaires |
| **Zod** | Validation des schémas |
| **Lucide Icons** | Icônes modernes |

---

## 📁 Structure du projet

```
bail-tal-cooperative/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page du formulaire
│   └── globals.css        # Styles globaux
├── components/
│   ├── Sidebar.tsx        # Navigation latérale
│   ├── NavigationBar.tsx  # Barre de navigation
│   ├── sections/          # Sections du formulaire TAL
│   └── ui/                # Composants réutilisables
├── lib/
│   ├── supabase.ts        # Client Supabase
│   └── utils.ts           # Fonctions utilitaires
├── hooks/
│   └── useBailForm.ts     # Hook de gestion d'état
├── types/
│   └── bail.ts            # Types TypeScript
└── public/                # Fichiers statiques
```

---

## 📖 Documentation

- 📘 [Guide de démarrage rapide](./DEMARRAGE.md)
- 📗 [Documentation complète](./README.md)
- 📙 [Vue d'ensemble du projet](./PROJET_LIVRÉ.md)
- 🔧 [Configuration GitHub](./GITHUB_SETUP.md)

---

## 🗄️ Base de données

### Schéma SQL

Le schéma de base de données comprend:
- **8 nouvelles tables** pour le formulaire TAL
- **3 tables enrichies** (leases, units, lease_tenants)
- **3 vues** optimisées pour la génération de PDF
- **3 fonctions** utilitaires
- **Triggers** pour mise à jour automatique
- **Politiques RLS** pour la sécurité

Fichier: `schema_bail_tal_coop_v1.1.sql`

---

## 🎨 Design

L'interface respecte fidèlement le design du **formulaire TAL officiel**:

- **Couleurs**: Bleu TAL (#003D5C)
- **Typographie**: Inter (Google Fonts)
- **Composants**: Boutons, inputs, alertes conformes au TAL
- **Layout**: Sidebar + contenu principal + navigation

---

## 🔐 Sécurité

- ✅ Row Level Security (RLS) sur Supabase
- ✅ Validation côté client et serveur
- ✅ Protection CSRF
- ✅ Variables d'environnement sécurisées
- ✅ Authentification Supabase Auth

---

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Variables d'environnement production

Ajoutez dans Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🤝 Contribution

Ce projet est maintenu par **IGC Hub**.

### Workflow de développement

```bash
# Créer une branche
git checkout -b feature/ma-nouvelle-fonctionnalite

# Faire vos modifications
git add .
git commit -m "✨ Ajout de [fonctionnalité]"

# Pousser et créer une Pull Request
git push origin feature/ma-nouvelle-fonctionnalite
```

---

## 📄 Licence

Propriétaire - **IGC Hub** © 2026

Ce projet est destiné à un usage interne pour les coopératives d'habitation du Québec.

---

## 🆘 Support

Pour toute question ou problème:

- 📧 Contactez l'équipe IGC Hub
- 🐛 Créez une [issue](https://github.com/IGC-Hub/bail-tal-cooperative/issues)
- 📚 Consultez la [documentation TAL officielle](https://www.tal.gouv.qc.ca)

---

## 🙏 Remerciements

- **Tribunal administratif du logement du Québec** pour le formulaire officiel
- Équipe **IGC Hub** pour le développement
- Communauté **Next.js** et **Supabase**

---

**Développé avec ❤️ pour les coopératives d'habitation du Québec**
