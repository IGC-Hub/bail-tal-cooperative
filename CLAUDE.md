# CLAUDE.md — bail-tal-coop (Formulaire de bail TAL pour coopératives)

## Projet

Formulaire de bail TAL (Tribunal administratif du logement) adapté aux coopératives d'habitation du Québec. Application Next.js autonome qui a été **intégrée dans le portail locataires** (`tenant-portal-avril2025-main`) sous le nom **BailCoop**.

**Statut :** Ce projet sert de **source de référence** pour les composants bail. Les composants ont été migrés et adaptés dans le portail locataires (`C:\Users\Mostafa\2026\tenant-portal-avril2025-main\src\components\bail\`).

## Stack technique

- **Next.js 14.1.0** + **TypeScript 5.4** (strict) + **React 18**
- **Tailwind CSS 3** — couleurs custom `tal-blue` (#003D5C) et `tal-yellow` (#FFF4D1)
- **react-hook-form** + **@hookform/resolvers** + **zod 4** — formulaires (22 sous-sections)
- **Supabase** (`@supabase/supabase-js` 2.112+) — Backend, schéma `core`, auth activé
- **Lucide React** 1.28+ — icônes
- **class-variance-authority** + **clsx** + **tailwind-merge** — utilitaires CSS
- **Vitest** + **@testing-library/react** — tests (108 tests)

## Sécurité

### Authentification

- Le client Supabase (`lib/supabase.ts`) est configuré avec `autoRefreshToken` et `persistSession`
- `getAuthenticatedUser()` vérifie l'identité avant toute opération d'écriture
- `hooks/useAuth.ts` expose l'état d'authentification (user, session, loading)
- `hooks/useBailForm.ts` bloque la sauvegarde si l'utilisateur n'est pas authentifié

### RLS (Row Level Security)

- Migration SQL dans `supabase/migrations/20260919_add_rls_policies.sql`
- Politiques RLS sur 7 tables : `leases`, `organizations`, `units`, `buildings`, `tenants`, `lease_tenants`, `bail_generation_logs`
- Filtrage par organisation via `core.user_organizations`
- **IMPORTANT :** La migration doit être appliquée manuellement via le dashboard Supabase ou `supabase db push`

### Headers HTTP

- Configurés dans `next.config.js` : X-Frame-Options (DENY), X-Content-Type-Options (nosniff), HSTS, Referrer-Policy, Permissions-Policy

### Validation

- Schémas Zod pour chaque section dans `lib/schemas.ts`
- `zodResolver` dans chaque `useForm()` avec `mode: 'onBlur'`
- Validation maître `bailFormDataSchema.safeParse()` dans `saveFormData()` avant envoi à Supabase

## Supabase

- **Projet :** `zpticyqqhvunstlahnie` (DB_Matress_IGC)
- **Schema :** `core` — configuré dans `lib/supabase.ts` via `db: { schema: 'core' }`
- **IMPORTANT :** Même base de données que le portail locataires et autres applications IGC. Ne jamais modifier le schéma sans vérifier l'impact.

### Tables utilisées

- `core.leases` — Bail principal. Colonnes bail TAL :
  - `bail_tal_data` (JSONB) — données complètes du formulaire (sauvegarde via `useBailForm.saveFormData`)
  - `bail_tal_statut` (varchar) — `non_genere`, `en_cours`, `complete`
  - `bail_tal_genere` (boolean), `bail_tal_date_generation`, `bail_tal_lien_pdf`
- `core.organizations` — Organisations (type: `cooperative` | `obnl` | `private` | `seniors` | `syndic`). Chargées dynamiquement dans SectionA1 (`.limit(100)`) pour le sélecteur de coopérative. Le gestionnaire/signataire est stocké dans le champ `settings` (JSONB).
- `core.units` — Logements (status: `occupied` | `vacant`)
- `core.buildings` — Immeubles (concierge, animaux, fumée, règlement)
- `core.tenants` — Locataires
- `core.lease_tenants` — Relation bail-locataires (multi-locataires)
- `core.bail_generation_logs` — Logs de génération de bail (lease_id, generated_by, pdf_url, status)
- **Storage bucket** `bail-pdfs` — PDFs générés (public, limite 10 Mo, PDF uniquement)

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

Le rendu utilise un **dictionnaire `SECTION_MAP`** (mémorisé via `useMemo`) indexé par `subsectionId`. Les 22 sections sont chargées via **`next/dynamic`** (imports dynamiques) pour optimiser le bundle — seule la section visible est chargée.

```ts
// Dans buildSectionMap()
'g-1': (data, update) => (
  <SectionG data={data.signatures} onSave={(d) => update({ signatures: d })} />
),
```

### Flux de données (auto-sync)

Les sections utilisent le hook **`useAutoSync`** (`hooks/useAutoSync.ts`) qui observe les changements via `watch()` de react-hook-form et appelle `onSave` avec un debounce de 300ms. Les données remontent automatiquement vers l'état parent sans bouton submit.

```
Section (useForm + useAutoSync) → onSave → updateFormData → formState.data → saveFormData → Supabase
```

### Persistance (`hooks/useBailForm.ts`)

- **Chargement :** `loadFormData(leaseId)` → `SELECT bail_tal_data, bail_tal_statut FROM core.leases WHERE id = ?`
- **Sauvegarde :** `saveFormData()` → vérification auth → validation Zod → `UPDATE core.leases SET bail_tal_data = ?, bail_tal_statut = 'en_cours' WHERE id = ?`
- **Complétion auto :** `updateFormData` marque automatiquement la sous-section courante comme complétée dans la Sidebar
- La navigation couvre 22 étapes (intro → PDF)

### Validation (`lib/schemas.ts`)

18 schémas Zod + 1 schéma maître (`bailFormDataSchema`). Chaque section utilise `zodResolver(schema)` avec `mode: 'onBlur'`.

| Schéma | Section(s) |
|--------|-----------|
| `cooperativeSchema` | A.1 |
| `locataireFormSchema` | A.2 |
| `logementSchema` | B.1, B.2, B.3 |
| `dureeSchema` | C |
| `loyerSchema` / `paiementSchema` | D.1, D.2 |
| `reglementSchema` / `travauxSchema` / `conciergeSchema` / `servicesTaxesSchema` / `conditionsSchema` / `autresServicesSchema` | E.1–E.6 |
| `restrictionsSchema` | F |
| `solidariteSchema` / `autresSignatairesFormSchema` | H.1, H.2 |
| `signaturesSchema` | G |

### Types (`types/bail.ts`)

Tous les champs des interfaces sont **optionnels** car le formulaire est rempli progressivement. Les interfaces principales :

| Interface | Utilisée par |
|-----------|-------------|
| `CooperativeInfo` | SectionA1 (inclut mandataire_* et signataire_*) |
| `LocataireInfo` | SectionA2 |
| `LogementInfo` | SectionB1, B2, B3 (inclut accessoires et avertisseurs) |
| `DureeBail` | SectionC |
| `LoyerInfo` + `PaiementInfo` | SectionD1, D2 |
| `ServicesConditions` | SectionE1-E6 |
| `RestrictionsInfo` | SectionF |
| `SolidariteInfo` + `AutreSignataire` | SectionH1, H2 |
| `SignaturesInfo` | SectionG |
| `FinalisationInfo` | SectionPDF |

### Génération PDF (`supabase/functions/generate-bail-pdf`)

Edge Function Supabase (Deno) qui génère le PDF du bail via `pdf-lib` :

```
SectionPDF (bouton) → POST /functions/v1/generate-bail-pdf (JWT requis)
  → Charge bail_tal_data depuis core.leases
  → Génère PDF A4 (Helvetica, couleurs TAL, pagination auto)
  → Upload dans Supabase Storage (bucket bail-pdfs)
  → Met à jour bail_tal_statut='complete', bail_tal_lien_pdf=URL
  → Log dans bail_generation_logs
  → Retourne { pdf_url, generated_at }
```

Le PDF inclut toutes les sections (A→H + Signatures) avec labels, champs, checkboxes, séparateurs et pieds de page (nom coopérative + date + pagination).

**Prérequis :** Le bucket `bail-pdfs` doit exister dans Supabase Storage avec les politiques RLS pour upload authentifié et lecture publique.

### Accessibilité (`components/ui/Input.tsx`)

Le composant `Input` génère automatiquement un `id` via `useId()` et lie le `<label>` via `htmlFor`. En cas d'erreur : `aria-invalid`, `aria-describedby` pointant vers le message d'erreur avec `role="alert"`.

## Structure du projet

```
bail-tal-coop/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI (type-check, lint, test, build) Node 18+20
├── app/
│   ├── globals.css             # Styles globaux + classes .input-tal, .label-tal, .section-card
│   ├── layout.tsx              # Layout Next.js (lang="fr", police Inter via next/font)
│   └── page.tsx                # Page principale — SECTION_MAP (dynamic imports) + Sidebar
├── components/
│   ├── Sidebar.tsx             # Navigation latérale (9 sections, 22 sous-sections)
│   ├── NavigationBar.tsx       # Barre Précédent/Enregistrer/Suivant
│   ├── ui/
│   │   ├── Input.tsx           # Input accessible (useId, htmlFor, aria-invalid, forwardRef)
│   │   ├── AlertBox.tsx        # Alertes warning/info
│   │   └── Button.tsx          # Bouton avec variantes (CVA)
│   └── sections/
│       ├── IntroductionSection.tsx    # Introduction (info, pas de formulaire)
│       ├── SectionA1.tsx              # A.1 Identification coopérative (Supabase + zodResolver)
│       ├── SectionA2.tsx              # A.2 Locataire(s) (useFieldArray + zodResolver)
│       ├── SectionB1.tsx              # B.1 Description logement
│       ├── SectionB2.tsx              # B.2 Accessoires
│       ├── SectionB3.tsx              # B.3 Avertisseurs de fumée
│       ├── SectionC.tsx               # C. Durée du bail
│       ├── SectionD1.tsx              # D.1 Coût du loyer (calcul auto)
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
│       ├── MentionsLegalesSection.tsx  # Mentions légales (statique)
│       ├── SectionRecapitulatif.tsx    # Récapitulatif (lecture seule)
│       ├── SectionG.tsx               # G. Signatures (checkboxes)
│       └── SectionPDF.tsx             # Génération PDF (appel Edge Function)
├── hooks/
│   ├── useAuth.ts              # État d'authentification Supabase (user, session, loading)
│   ├── useAutoSync.ts          # Auto-sync formulaire → état parent (watch + debounce 300ms)
│   └── useBailForm.ts          # État formulaire, navigation 22 étapes, auth, validation, sauvegarde
├── lib/
│   ├── schemas.ts              # 18 schémas Zod + schéma maître bailFormDataSchema
│   ├── supabase.ts             # Client Supabase (schéma core, auth activé)
│   └── utils.ts                # cn() helper, formatDate(), formatCurrency()
├── supabase/
│   ├── functions/
│   │   └── generate-bail-pdf/
│   │       └── index.ts            # Edge Function: génération PDF (pdf-lib + Storage)
│   └── migrations/
│       └── 20260919_add_rls_policies.sql  # Politiques RLS pour 7 tables
├── tests/
│   ├── setup.ts                # Setup vitest (@testing-library/jest-dom)
│   ├── schemas.test.ts         # 56 tests — validation Zod
│   ├── useBailForm.test.ts     # 19 tests — hook état/navigation/sauvegarde
│   ├── useAutoSync.test.ts     # 6 tests — debounce/cleanup
│   └── components.test.tsx     # 27 tests — rendu IntroductionSection, SectionC, D1, F
├── types/
│   └── bail.ts                 # Types TypeScript — toutes interfaces optionnelles
├── vitest.config.ts            # Configuration Vitest (jsdom, alias @/)
├── next.config.js              # Headers sécurité + configuration Next.js
├── tailwind.config.ts          # Configuration Tailwind (couleurs tal-blue, tal-yellow)
├── tsconfig.json               # Configuration TypeScript (strict: true)
├── postcss.config.js           # Configuration PostCSS
├── package.json                # Dépendances et scripts
└── .env.example                # Variables d'environnement (template)
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
| 20 | Finalisation | recap-1 | Récapitulatif |
| 21 | Finalisation | g-1 | Signatures |
| 22 | Finalisation | pdf-1 | Génération PDF |

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
npm test           # Tests Vitest (108 tests)
```

## Notes

- Ce projet est le **source de référence** des composants bail TAL
- Les modifications futures doivent être synchronisées avec le portail locataires
- La section G (Signatures) utilise des checkboxes simples, pas de signature électronique conforme RFC 3161
- La génération PDF utilise une Edge Function Supabase avec `pdf-lib` (stockage dans bucket `bail-pdfs`)
- Les données des coopératives sont chargées depuis `core.organizations` avec `.limit(100)`
- Le gestionnaire et signataire sont stockés dans `organizations.settings` (JSONB)
- Le build vérifie TypeScript et ESLint — zéro erreur tolérée
- CI/CD : Pipeline GitHub Actions sur push/PR vers `main` (Node 18 + 20)
- **Repo GitHub :** `IGC-Hub/bail-tal-cooperative`

---

*Dernière mise à jour : 2026-09-19*
