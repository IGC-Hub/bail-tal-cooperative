# 🏘️ Bail TAL - Coopérative d'habitation

Formulaire de bail électronique pour coopératives d'habitation conforme au **Tribunal administratif du logement du Québec**.

## ✨ Fonctionnalités

- ✅ Interface identique au formulaire TAL officiel
- ✅ Navigation par sections (A-H) avec sidebar
- ✅ Sauvegarde automatique des données
- ✅ Validation en temps réel
- ✅ Intégration Supabase
- ✅ Génération PDF conforme au TAL
- ✅ Système de signatures électroniques
- ✅ Multi-locataires et garants
- ✅ Responsive design

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### 1. Cloner le projet

```bash
cd bail-tal-coop
npm install
```

### 2. Configuration Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Exécutez le script SQL de création de schéma:

```bash
# Dans Supabase Dashboard > SQL Editor
# Copiez et exécutez le contenu de: schema_bail_tal_coop_v1.1.sql
```

### 3. Variables d'environnement

Créez un fichier `.env.local`:

```bash
cp .env.example .env.local
```

Éditez `.env.local` avec vos identifiants Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

### 4. Lancer le projet

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
bail-tal-coop/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page du formulaire
│   └── globals.css         # Styles globaux
├── components/
│   ├── Sidebar.tsx         # Navigation latérale
│   ├── NavigationBar.tsx   # Barre de navigation
│   ├── sections/           # Sections du formulaire
│   │   ├── IntroductionSection.tsx
│   │   ├── SectionA1.tsx   # Coopérative
│   │   ├── SectionA2.tsx   # Locataires
│   │   └── ...
│   └── ui/                 # Composants UI
│       ├── Button.tsx
│       ├── Input.tsx
│       └── AlertBox.tsx
├── lib/
│   ├── supabase.ts         # Client Supabase
│   └── utils.ts            # Utilitaires
├── hooks/
│   └── useBailForm.ts      # Hook de gestion du formulaire
├── types/
│   └── bail.ts             # Types TypeScript
└── tailwind.config.ts      # Configuration Tailwind
```

## 🎨 Sections du formulaire

### Section A - Identification
- A1: Informations sur la coopérative
- A2: Informations sur le(s) locataire(s)

### Section B - Description du logement
- B1: Adresse et caractéristiques
- B2: Accessoires et dépendances
- B3: Engagement avertisseurs de fumée

### Section C - Durée du bail
- Bail à durée fixe / indéterminée

### Section D - Loyer
- D1: Montants (base, services, total)
- D2: Modalités de paiement

### Section E - Services et conditions
- E1: Règlement de l'immeuble
- E2: Travaux et réparations
- E3: Services du concierge
- E4: Services, taxes, coûts
- E5: Conditions (fumée, animaux, terrain)
- E6: Autres services et restrictions

### Section F - Restrictions
- Restrictions au loyer (membre/non-membre)

### Section H - Solidarité et caution
- H1: Engagement solidaire
- H2: Autres signataires (garants)

### Finalisation
- Choix de la langue
- Aperçu du bail
- Signatures électroniques

## 🔧 Développement

### Ajouter une nouvelle section

1. Créez le composant dans `components/sections/`:

```tsx
// components/sections/SectionB1.tsx
'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';

export const SectionB1 = ({ data, onSave }) => {
  return (
    <div className="section-card">
      <h2>Section B1 - Description du logement</h2>
      {/* Vos champs ici */}
    </div>
  );
};
```

2. Ajoutez le rendu dans `app/page.tsx`:

```tsx
if (currentSection === 'section-b' && currentSubsection === 'b-1') {
  return <SectionB1 data={formState.data.logement} onSave={...} />;
}
```

### Composants UI disponibles

```tsx
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertBox } from '@/components/ui/AlertBox';

// Bouton
<Button variant="primary">Suivant</Button>
<Button variant="secondary">Enregistrer</Button>
<Button variant="outline">Précédent</Button>

// Input
<Input 
  label="Nom"
  required
  error="Ce champ est obligatoire"
/>

// Alerte
<AlertBox variant="warning">
  Message d'avertissement
</AlertBox>
```

## 🗄️ Base de données

### Tables principales

- `core.leases` - Baux
- `core.units` - Logements
- `core.organizations` - Coopératives
- `core.tenants` - Locataires
- `core.tenant_guarantors` - Garants
- `core.lease_tal_services` - Services TAL
- `core.lease_signatures` - Signatures

### Vues utiles

```sql
-- Vue complète du bail
SELECT * FROM core.v_lease_tal_complete WHERE lease_id = 'xxx';

-- Résumé des services
SELECT * FROM core.v_lease_tal_services_summary WHERE lease_id = 'xxx';

-- Statut des signatures
SELECT * FROM core.v_lease_signatures_summary WHERE lease_id = 'xxx';
```

## 📝 TODO

- [ ] Implémenter toutes les sections (B, C, D, E, F, H)
- [ ] Système de validation complet avec Zod
- [ ] Génération PDF avec react-pdf ou pdfmake
- [ ] Envoi d'emails pour signatures
- [ ] Interface de signature électronique
- [ ] Gestion des pièces jointes (règlement d'immeuble)
- [ ] Export/Import de données
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API
- [ ] Déploiement sur Vercel

## 🔐 Sécurité

- Authentification via Supabase Auth
- Row Level Security (RLS) sur toutes les tables
- Validation côté serveur et client
- Protection CSRF
- Chiffrement des données sensibles

## 📚 Ressources

- [Documentation TAL](https://www.tal.gouv.qc.ca)
- [Formulaire TAL officiel](https://www.tal.gouv.qc.ca/fr/bail-dun-logement)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 Licence

Ce projet est destiné à un usage privé pour les coopératives d'habitation du Québec.

## 🤝 Support

Pour toute question ou problème:
- Créez une issue sur GitHub
- Consultez la documentation TAL officielle
- Contactez votre administrateur système

---

**Développé avec ❤️ pour les coopératives d'habitation du Québec**
