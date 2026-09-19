import { describe, it, expect } from 'vitest';
import {
  cooperativeSchema,
  dureeSchema,
  loyerSchema,
  paiementSchema,
  restrictionsSchema,
  bailFormDataSchema,
} from '@/lib/schemas';

// --- cooperativeSchema ---
describe('cooperativeSchema', () => {
  const validData = {
    organisation_code: 'AC',
    nom: 'Coopérative ABC',
    numero: '123',
    rue: 'Rue Principale',
    ville: 'Montréal',
    province: 'Québec',
    signataire_prenom: 'Jean',
    signataire_nom: 'Tremblay',
    signataire_qualite: 'Président',
  };

  it('accepte des données valides complètes', () => {
    const result = cooperativeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepte des données avec champs optionnels remplis', () => {
    const result = cooperativeSchema.safeParse({
      ...validData,
      app: '4A',
      code_postal: 'H1G 1M1',
      telephone: '514-555-1234',
      courriel: 'info@coop.ca',
      mandataire_organisme: 'Gestion ABC',
    });
    expect(result.success).toBe(true);
  });

  it('rejette si organisation_code est manquant', () => {
    const { organisation_code, ...sans } = validData;
    const result = cooperativeSchema.safeParse(sans);
    expect(result.success).toBe(false);
  });

  it('rejette si nom est vide', () => {
    const result = cooperativeSchema.safeParse({ ...validData, nom: '' });
    expect(result.success).toBe(false);
  });

  it('rejette si signataire_prenom est manquant', () => {
    const { signataire_prenom, ...sans } = validData;
    const result = cooperativeSchema.safeParse(sans);
    expect(result.success).toBe(false);
  });

  it('rejette si signataire_nom est vide', () => {
    const result = cooperativeSchema.safeParse({ ...validData, signataire_nom: '' });
    expect(result.success).toBe(false);
  });

  it('rejette un code postal invalide', () => {
    const result = cooperativeSchema.safeParse({ ...validData, code_postal: '12345' });
    expect(result.success).toBe(false);
  });

  it('accepte un code postal valide avec espace', () => {
    const result = cooperativeSchema.safeParse({ ...validData, code_postal: 'H1G 1M1' });
    expect(result.success).toBe(true);
  });

  it('accepte un code postal valide sans espace', () => {
    const result = cooperativeSchema.safeParse({ ...validData, code_postal: 'H1G1M1' });
    expect(result.success).toBe(true);
  });

  it('accepte un code_postal vide (optionnel)', () => {
    const result = cooperativeSchema.safeParse({ ...validData, code_postal: '' });
    expect(result.success).toBe(true);
  });

  it('rejette un courriel invalide', () => {
    const result = cooperativeSchema.safeParse({ ...validData, courriel: 'pas-un-email' });
    expect(result.success).toBe(false);
  });

  it('accepte un courriel vide (optionnel)', () => {
    const result = cooperativeSchema.safeParse({ ...validData, courriel: '' });
    expect(result.success).toBe(true);
  });
});

// --- dureeSchema ---
describe('dureeSchema', () => {
  it('accepte un objet vide (tous les champs sont optionnels)', () => {
    const result = dureeSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepte un type fixe', () => {
    const result = dureeSchema.safeParse({ type: 'fixe' });
    expect(result.success).toBe(true);
  });

  it('accepte un type indeterminee', () => {
    const result = dureeSchema.safeParse({ type: 'indeterminee' });
    expect(result.success).toBe(true);
  });

  it('rejette un type invalide', () => {
    const result = dureeSchema.safeParse({ type: 'mensuel' });
    expect(result.success).toBe(false);
  });

  it('accepte duree_unite valide (mois)', () => {
    const result = dureeSchema.safeParse({ duree_unite: 'mois' });
    expect(result.success).toBe(true);
  });

  it('accepte duree_unite valide (annees)', () => {
    const result = dureeSchema.safeParse({ duree_unite: 'annees' });
    expect(result.success).toBe(true);
  });

  it('rejette duree_unite invalide', () => {
    const result = dureeSchema.safeParse({ duree_unite: 'jours' });
    expect(result.success).toBe(false);
  });

  it('rejette duree_nombre inférieur à 1', () => {
    const result = dureeSchema.safeParse({ duree_nombre: 0 });
    expect(result.success).toBe(false);
  });

  it('accepte des dates optionnelles', () => {
    const result = dureeSchema.safeParse({
      type: 'fixe',
      date_debut: '2026-07-01',
      date_fin: '2027-06-30',
    });
    expect(result.success).toBe(true);
  });
});

// --- loyerSchema ---
describe('loyerSchema', () => {
  it('accepte un objet vide (tous les champs optionnels)', () => {
    const result = loyerSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepte un loyer_base positif', () => {
    const result = loyerSchema.safeParse({ loyer_base: 929.00 });
    expect(result.success).toBe(true);
  });

  it('accepte un loyer_base de zéro', () => {
    const result = loyerSchema.safeParse({ loyer_base: 0 });
    expect(result.success).toBe(true);
  });

  it('rejette un loyer_base négatif', () => {
    const result = loyerSchema.safeParse({ loyer_base: -100 });
    expect(result.success).toBe(false);
  });

  it('rejette un cout_services négatif', () => {
    const result = loyerSchema.safeParse({ cout_services: -50 });
    expect(result.success).toBe(false);
  });

  it('accepte frequence mois', () => {
    const result = loyerSchema.safeParse({ frequence: 'mois' });
    expect(result.success).toBe(true);
  });

  it('accepte frequence semaine', () => {
    const result = loyerSchema.safeParse({ frequence: 'semaine' });
    expect(result.success).toBe(true);
  });

  it('rejette frequence invalide', () => {
    const result = loyerSchema.safeParse({ frequence: 'annee' });
    expect(result.success).toBe(false);
  });

  it('accepte programme_subvention booléen', () => {
    const result = loyerSchema.safeParse({ programme_subvention: true, details_subvention: 'PSL' });
    expect(result.success).toBe(true);
  });
});

// --- paiementSchema ---
describe('paiementSchema', () => {
  it('accepte un objet vide', () => {
    const result = paiementSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepte jour_paiement valide (1)', () => {
    const result = paiementSchema.safeParse({ jour_paiement: 1 });
    expect(result.success).toBe(true);
  });

  it('accepte jour_paiement valide (31)', () => {
    const result = paiementSchema.safeParse({ jour_paiement: 31 });
    expect(result.success).toBe(true);
  });

  it('rejette jour_paiement inférieur à 1', () => {
    const result = paiementSchema.safeParse({ jour_paiement: 0 });
    expect(result.success).toBe(false);
  });

  it('rejette jour_paiement supérieur à 31', () => {
    const result = paiementSchema.safeParse({ jour_paiement: 32 });
    expect(result.success).toBe(false);
  });

  it('accepte mode comptant', () => {
    const result = paiementSchema.safeParse({ mode: 'comptant' });
    expect(result.success).toBe(true);
  });

  it('accepte mode virement', () => {
    const result = paiementSchema.safeParse({ mode: 'virement' });
    expect(result.success).toBe(true);
  });

  it('rejette mode invalide', () => {
    const result = paiementSchema.safeParse({ mode: 'bitcoin' });
    expect(result.success).toBe(false);
  });

  it('accepte periode mois ou semaine', () => {
    expect(paiementSchema.safeParse({ periode: 'mois' }).success).toBe(true);
    expect(paiementSchema.safeParse({ periode: 'semaine' }).success).toBe(true);
  });
});

// --- restrictionsSchema ---
describe('restrictionsSchema', () => {
  it('accepte un objet vide', () => {
    const result = restrictionsSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepte situation membre', () => {
    const result = restrictionsSchema.safeParse({ situation: 'membre' });
    expect(result.success).toBe(true);
  });

  it('accepte situation non_membre', () => {
    const result = restrictionsSchema.safeParse({ situation: 'non_membre' });
    expect(result.success).toBe(true);
  });

  it('accepte situation null (nullable)', () => {
    const result = restrictionsSchema.safeParse({ situation: null });
    expect(result.success).toBe(true);
  });

  it('rejette situation invalide', () => {
    const result = restrictionsSchema.safeParse({ situation: 'invite' });
    expect(result.success).toBe(false);
  });

  it('rejette loyer_maximal négatif', () => {
    const result = restrictionsSchema.safeParse({ loyer_maximal: -100 });
    expect(result.success).toBe(false);
  });

  it('accepte loyer_maximal positif', () => {
    const result = restrictionsSchema.safeParse({ loyer_maximal: 950 });
    expect(result.success).toBe(true);
  });

  it('accepte données complètes non_membre', () => {
    const result = restrictionsSchema.safeParse({
      situation: 'non_membre',
      immeuble_recent: true,
      immeuble_pret_date: '2024-01-15',
      changement_affectation: false,
      loyer_maximal: 1200,
    });
    expect(result.success).toBe(true);
  });
});

// --- bailFormDataSchema ---
describe('bailFormDataSchema', () => {
  it('accepte un objet vide (tout est partiel)', () => {
    const result = bailFormDataSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepte des données partielles de coopérative', () => {
    const result = bailFormDataSchema.safeParse({
      cooperative: { nom: 'Ma Coop' },
    });
    expect(result.success).toBe(true);
  });

  it('accepte des données imbriquées de services', () => {
    const result = bailFormDataSchema.safeParse({
      services: {
        reglement_immeuble: { reglement_remis: true, date_remise: '2026-01-15' },
        conditions: { sans_fumee: true },
      },
    });
    expect(result.success).toBe(true);
  });

  it('accepte des données complètes de durée et loyer', () => {
    const result = bailFormDataSchema.safeParse({
      duree: { type: 'fixe', duree_nombre: 12, duree_unite: 'mois' },
      loyer: { loyer_base: 929, frequence: 'mois' },
    });
    expect(result.success).toBe(true);
  });

  it('accepte des métadonnées', () => {
    const result = bailFormDataSchema.safeParse({
      metadata: {
        status: 'draft',
        lease_id: 'abc-123',
        created_at: '2026-01-01T00:00:00Z',
      },
    });
    expect(result.success).toBe(true);
  });

  it('accepte la section finalisation', () => {
    const result = bailFormDataSchema.safeParse({
      finalisation: {
        langue_bail: 'francais',
        apercu_genere: false,
      },
    });
    expect(result.success).toBe(true);
  });

  it('accepte la section restrictions dans le schéma maître', () => {
    const result = bailFormDataSchema.safeParse({
      restrictions: { situation: 'membre' },
    });
    expect(result.success).toBe(true);
  });

  it('accepte la section solidarité avec signataires', () => {
    const result = bailFormDataSchema.safeParse({
      solidarite: {
        engagement_solidaire: true,
        autres_signataires: [
          { nom: 'Dupont', adresse: '123 Rue', qualite: 'caution' },
        ],
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejette un signataire avec qualité invalide', () => {
    const result = bailFormDataSchema.safeParse({
      solidarite: {
        autres_signataires: [
          { nom: 'Dupont', adresse: '123 Rue', qualite: 'invalide' },
        ],
      },
    });
    expect(result.success).toBe(false);
  });
});
