# CLAUDE.md — bail-tal-coop (Formulaire de bail TAL pour coopératives)

## Projet

Formulaire de bail TAL (Tribunal administratif du logement) adapté aux coopératives d'habitation du Québec. Application Next.js autonome qui a été **intégrée dans le portail locataires** (`tenant-portal-avril2025-main`) sous le nom **BailCoop**.

**Statut :** Ce projet sert de **source de référence** pour les composants bail. Les composants ont été migrés et adaptés dans le portail locataires (`C:\Users\Mostafa\2026\tenant-portal-avril2025-main\src\components\bail\`).

## Stack technique

- **Next.js 14** + **TypeScript 5.4** + **React 18**
- **Tailwind CSS 3** — couleurs custom `tal-blue` (#003D5C) et `tal-yellow` (#FFF4D1)
- **react-hook-form** + **@hookform/resolvers** + **zod 4** — formulaires (19 sous-sections)
- **Supabase** (`@supabase/supabase-js` 2.112+) — Backend, schéma `core`
- **Lucide React** 1.28+ — icônes
- **class-variance-authority** + **clsx** + **tailwind-merge** — utilitaires CSS

## Supabase

- **Projet :** `zpticyqqhvunstlahnie` (DB_Matress_IGC)
- **Schema :** `core` — configuré dans `lib/supabase.ts` via `db: { schema: 'core' }`
- **IMPORTANT :** Même base de données que le portail locataires et autres applications IGC. Ne jamais modifier le schéma sans vérifier l'impact.

### Tables utilisées

- `core.leases` — Bail principal. Colonnes bail TAL :
  - `bail_tal_data` (JSONB) — données complètes du formulaire (sauvegarde via `useBailForm.saveFormData`)
  - `bail_tal_statut` (varchar) — `non_genere`, `en_cours`, `complete`
  - `bail_tal_genere` (boolean), `bail_tal_date_generation`, `bail_tal_lien_pdf`
- `core.organizations` — Organisations (type: `cooperative` | `obnl` | `private` | `seniors` | `syndic`). Chargées dynamiquement dans SectionA1 pour le sélecteur de coopérative. Le gestionnaire/signataire est stocké dans le champ `settings` (JSONB) de chaque organisation.
- `core.units` — Logements (status: `occupied` | `vacant`)
- `core.buildings` — Immeubles (concierge, animaux, fumée, règlement)
- `core.tenants` — Locataires
- `core.lease_tenants` — Relation bail-locataires (multi-locataires)
- `core.bail_generation_logs` — Logs de génération de bail

### Conventions DB

- `core.leases.primary_tenant_id` (NOT NULL) — référence le locataire principal
- `core.leases.unit_id` (NOT NULL) — référence le logement
- `core.leases.lease_type` — enum: `fixed`, `month_to_month`, `reconduction`
- `core.leases.status` — enum: `draft`, `active`, `renewed`, `terminated`, `expired`
- `core.organizations.type` — enum: `cooperative`, `obnl`, `private`, `seniors`, `syndic`
- `core.units.status` — enum: `occupied`, `vacant`
- Coopératives connues (codes) : AC, CEF, DBC, LDE, LP, LOB

## Architecture

### Rendu des sections (`app/page.tsx`)

Le rendu utilise un **dictionnaire `SECTION_MAP`** indexé par `subsectionId` (ex: `'a-1'`, `'e-4'`). Chaque entrée est une fonction `(data, updateFormData) => JSX`. Pour ajouter une section :

```ts
// Dans SECTION_MAP
'g-1': (data, update) => (
  <SectionG1 data={data.signatures} onSave={(d) => update({ signatures: d })} />
),
```

### Persistance (`hooks/useBailForm.ts`)

- **Chargement :** `loadFormData(leaseId)` → `SELECT bail_tal_data, bail_tal_statut FROM core.leases WHERE id = ?`
- **Sauvegarde :** `saveFormData()` → `UPDATE core.leases SET bail_tal_data = ?, bail_tal_statut = 'en_cours' WHERE id = ?`
- Les données sont stockées dans `bail_tal_data` (JSONB) sous la structure `BailFormData` définie dans `types/bail.ts`
- La navigation couvre 19 étapes (intro → mentions légales), sans section de finalisation pour le moment

### Types (`types/bail.ts`)

Tous les champs des interfaces sont **optionnels** car le formulaire est rempli progressivement. Les interfaces principales :

| Interface | Utilisée par |
|-----------|-------------|
| `CooperativeInfo` | SectionA1 (inclut mandataire_* et signataire_*) |
| `LocataireInfo` | SectionA2 |
| `LogementInfo` | SectionB1, B2, B3 (inclut accessoires et avertisseurs) |
| `DureeBail` | SectionC |
| `LoyerInfo` + `PaiementInfo` | SectionD1, D2 |
| `ServicesConditions` | SectionE1-E6 (sous-objets : reglement_immeuble, travaux_reparations, service_concierge, services_taxes, conditions) |
| `RestrictionsInfo` | SectionF |
| `SolidariteInfo` + `AutreSignataire` | SectionH1, H2 |

### Accessibilité (`components/ui/Input.tsx`)

Le composant `Input` génère automatiquement un `id` via `useId()` et lie le `<label>` via `htmlFor`. En cas d'erreur : `aria-invalid`, `aria-describedby` pointant vers le message d'erreur avec `role="alert"`.

## Structure du projet

```
bail-tal-coop/
├── app/
│   ├── globals.css          # Styles globaux + classes .input-tal, .label-tal, .section-card
│   ├── layout.tsx           # Layout Next.js (lang="fr", police Inter)
│   └── page.tsx             # Page principale — SECTION_MAP + Sidebar + NavigationBar
├── components/
│   ├── Sidebar.tsx          # Navigation latérale (9 sections, 19 sous-sections)
│   ├── NavigationBar.tsx    # Barre Précédent/Enregistrer/Suivant
│   ├── ui/
│   │   ├── Input.tsx        # Input accessible (useId, htmlFor, aria-invalid, forwardRef)
│   │   ├── AlertBox.tsx     # Alertes warning/info
│   │   └── Button.tsx       # Bouton avec variantes (CVA)
│   └── sections/
│       ├── IntroductionSection.tsx    # Introduction (info, pas de formulaire)
│       ├── SectionA1.tsx              # A.1 Identification coopérative (données depuis Supabase)
│       ├── SectionA2.tsx              # A.2 Identification locataire(s) (useFieldArray)
│       ├── SectionB1.tsx              # B.1 Description logement
│       ├── SectionB2.tsx              # B.2 Accessoires
│       ├── SectionB3.tsx              # B.3 Avertisseurs de fumée
│       ├── SectionC.tsx               # C. Durée du bail
│       ├── SectionD1.tsx              # D.1 Coût du loyer
│       ├── SectionD2.tsx              # D.2 Paiement
│       ├── SectionE1.tsx              # E.1 Règlement immeuble
│       ├── SectionE2.tsx              # E.2 Travaux et réparations
│       ├── SectionE3.tsx              # E.3 Service concierge
│       ├── SectionE4.tsx              # E.4 Services et taxes (typé keyof)
│       ├── SectionE5.tsx              # E.5 Conditions
│       ├── SectionE6.tsx              # E.6 Autres services
│       ├── SectionF.tsx               # F. Restrictions (membre/non-membre)
│       ├── SectionH1.tsx              # H.1 Solidarité
│       ├── SectionH2.tsx              # H.2 Autres signataires (useFieldArray)
│       └── MentionsLegalesSection.tsx # Mentions légales (statique)
├── hooks/
│   └── useBailForm.ts       # État formulaire, navigation 19 étapes, sauvegarde Supabase
├── lib/
│   ├── supabase.ts          # Client Supabase (schéma core)
│   └── utils.ts             # cn() helper, formatDate(), formatCurrency()
├── types/
│   └── bail.ts              # Types TypeScript — toutes interfaces optionnelles
├── next.config.js           # Configuration Next.js (TS + ESLint vérifiés au build)
├── tailwind.config.ts       # Configuration Tailwind (couleurs tal-blue, tal-yellow)
├── tsconfig.json            # Configuration TypeScript (strict: true)
├── postcss.config.js        # Configuration PostCSS
├── package.json             # Dépendances et scripts
└── .env.example             # Variables d'environnement (template)
```

## Sections du bail (ordre de navigation)

| # | Section | Sous-section | Description |
|---|---------|-------------|-------------|
| 1 | Intro | intro-1 | Introduction et instructions |
| 2 | A | a-1 | Identification de la coopérative |
| 3 | A | a-2 | Identification du/des locataire(s) |
| 4 | B | b-1 | Description du logement |
| 5 | B | b-2 | Autres accessoires |
| 6 | B | b-3 | Avertisseurs de fumée |
| 7 | C | c-1 | Durée du bail |
| 8 | D | d-1 | Coût du loyer |
| 9 | D | d-2 | Paiement du loyer |
| 10 | E | e-1 | Règlement de l'immeuble |
| 11 | E | e-2 | Travaux et réparations |
| 12 | E | e-3 | Service de conciergerie |
| 13 | E | e-4 | Services, taxes et consommations |
| 14 | E | e-5 | Conditions particulières |
| 15 | E | e-6 | Autres services et conditions |
| 16 | F | f-1 | Restrictions (membre/non-membre) |
| 17 | H | h-1 | Solidarité entre colocataires |
| 18 | H | h-2 | Autres signataires (cautions/garants) |
| 19 | Mentions | mentions-1 | Mentions légales |

## Intégration dans le portail locataires

Les composants ont été migrés vers le portail (`tenant-portal-avril2025-main`) avec ces adaptations :

- `'use client'` retiré (Vite n'en a pas besoin)
- Imports `@/` remplacés par des chemins relatifs
- Composants UI originaux (Button CVA) remplacés par HTML + Tailwind
- Couleurs `tal-blue` remplacées par `blue-600`/`blue-700` du portail
- Client Supabase remplacé par celui du portail (`supabase.schema('core')`)
- Le bail concerne **exclusivement les coopératives** — filtre `organizations.type = 'cooperative'`
- Nouveaux baux créés depuis les **unités vacantes** (`units.status = 'vacant'`)
- Sidebar du portail : section "BailCoop" sous ADMINISTRATION

### Fichiers dans le portail

```
tenant-portal/src/
├── components/
│   ├── BailTAL.tsx                    # Composant principal (sélecteur + formulaire)
│   └── bail/
│       ├── BailSidebar.tsx            # Navigation latérale interne
│       ├── BailNavigationBar.tsx      # Barre navigation bas
│       ├── ui/BailInput.tsx           # Input adapté
│       ├── ui/BailAlertBox.tsx        # Alerte adaptée
│       └── sections/                  # 18 sections migrées
├── hooks/useBailForm.ts              # Hook adapté (leaseId + unitId)
└── types/bail.ts                     # Types adaptés (+ unit_id dans metadata)
```

## Commandes

```bash
npm run dev        # Serveur de développement Next.js
npm run build      # Build production (TypeScript + ESLint vérifiés)
npm run lint       # ESLint
npm run type-check # Vérification TypeScript (tsc --noEmit)
```

## Notes

- Ce projet est le **source de référence** des composants bail TAL
- Les modifications futures doivent être synchronisées avec le portail locataires
- La section G (Signatures) n'est pas encore implémentée (voir `MISE_A_JOUR_SECTION_G.md`)
- Les données des coopératives sont chargées depuis `core.organizations` (plus de données hardcodées)
- Le gestionnaire et signataire sont stockés dans `organizations.settings` (JSONB)
- Le build vérifie TypeScript et ESLint — zéro erreur tolérée
- **Repo GitHub :** `IGC-Hub/bail-tal-cooperative`

---

*Dernière mise à jour : 2026-08-04*
