import { z } from 'zod';

// --- Patterns de validation ---
const postalCodeRegex = /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i;
const phoneRegex = /^[\d\s().+-]{7,20}$/;

// --- Section A.1 : Coopérative ---
export const cooperativeSchema = z.object({
  organisation_code: z.string().min(1, 'Veuillez sélectionner une coopérative'),
  nom: z.string().min(1, 'Ce champ est obligatoire'),
  numero: z.string().min(1, 'Obligatoire'),
  rue: z.string().min(1, 'Obligatoire'),
  app: z.string().optional(),
  ville: z.string().min(1, 'Obligatoire'),
  province: z.string().min(1, 'Obligatoire'),
  code_postal: z.string().regex(postalCodeRegex, 'Format invalide (ex: H1G 1M1)').optional().or(z.literal('')),
  telephone: z.string().regex(phoneRegex, 'Numéro invalide').optional().or(z.literal('')),
  telephone_cell: z.string().optional(),
  courriel: z.string().email('Courriel invalide').optional().or(z.literal('')),
  mandataire_organisme: z.string().optional(),
  mandataire_numero: z.string().optional(),
  mandataire_rue: z.string().optional(),
  mandataire_ville: z.string().optional(),
  mandataire_province: z.string().optional(),
  mandataire_code_postal: z.string().optional(),
  mandataire_telephone: z.string().optional(),
  mandataire_courriel: z.string().optional(),
  signataire_prenom: z.string().min(1, 'Obligatoire'),
  signataire_nom: z.string().min(1, 'Obligatoire'),
  signataire_qualite: z.string().min(1, 'Obligatoire'),
});

// --- Section A.2 : Locataire ---
const locataireSchema = z.object({
  prenom: z.string().min(1, 'Obligatoire'),
  nom: z.string().min(1, 'Obligatoire'),
  numero: z.string().min(1, 'Obligatoire'),
  rue: z.string().min(1, 'Obligatoire'),
  app: z.string().optional(),
  municipalite: z.string().min(1, 'Obligatoire'),
  code_postal: z.string().regex(postalCodeRegex, 'Format invalide').optional().or(z.literal('')),
  telephone: z.string().min(1, 'Obligatoire'),
  telephone_cell: z.string().optional(),
  courriel: z.string().email('Courriel invalide').optional().or(z.literal('')),
  represente_par: z.string().optional(),
});

export const locataireFormSchema = z.object({
  locataire_principal: locataireSchema.partial(),
  locataires_supplementaires: z.array(locataireSchema.partial()),
});

// --- Section B.1 : Description logement ---
export const logementSchema = z.object({
  adresse: z.object({
    numero: z.string().min(1, 'Obligatoire'),
    rue: z.string().min(1, 'Obligatoire'),
    app: z.string().min(1, 'Obligatoire'),
    municipalite: z.string().min(1, 'Obligatoire'),
    code_postal: z.string().regex(postalCodeRegex, 'Format invalide').optional().or(z.literal('')),
  }).partial().optional(),
  nombre_pieces: z.coerce.number().min(1, 'Minimum 1').optional(),
  stationnement_exterieur: z.object({
    nombre: z.coerce.number(),
    emplacements: z.string(),
  }).partial().optional(),
  stationnement_interieur: z.object({
    nombre: z.coerce.number(),
    emplacements: z.string(),
  }).partial().optional(),
  remise: z.object({
    nombre: z.coerce.number(),
    emplacements: z.string(),
  }).partial().optional(),
  inclus_balcon: z.boolean().optional(),
  inclus_remise: z.boolean().optional(),
  acces_cour: z.boolean().optional(),
  buanderie_commune: z.boolean().optional(),
  autres_accessoires: z.string().optional(),
  engagement_avertisseurs_fumee: z.boolean().optional(),
  engagement_date: z.string().optional(),
  engagement_initiales_coop: z.string().optional(),
  engagement_initiales_locataire: z.string().optional(),
});

// --- Section C : Durée du bail ---
export const dureeSchema = z.object({
  type: z.enum(['fixe', 'indeterminee'], {
    message: 'Sélectionnez un type de bail',
  }).optional(),
  duree_nombre: z.coerce.number().min(1, 'Minimum 1').optional(),
  duree_unite: z.enum(['semaines', 'mois', 'annees']).optional(),
  date_debut: z.string().optional(),
  date_fin: z.string().optional(),
  date_commencement: z.string().optional(),
});

// --- Section D.1 : Loyer ---
export const loyerSchema = z.object({
  loyer_base: z.coerce.number().min(0, 'Montant invalide').optional(),
  cout_services: z.coerce.number().min(0, 'Montant invalide').optional(),
  loyer_total: z.coerce.number().optional(),
  frequence: z.enum(['mois', 'semaine']).optional(),
  programme_subvention: z.boolean().optional(),
  details_subvention: z.string().optional(),
});

// --- Section D.2 : Paiement ---
export const paiementSchema = z.object({
  premier_terme_date: z.string().min(1, 'Date obligatoire').optional(),
  jour_paiement: z.coerce.number().min(1, 'Entre 1 et 31').max(31, 'Entre 1 et 31').optional(),
  periode: z.enum(['mois', 'semaine']).optional(),
  mode: z.enum(['comptant', 'cheque', 'virement', 'autre']).optional(),
  mode_autre: z.string().optional(),
  cheques_postdates: z.boolean().optional(),
  lieu: z.string().min(1, 'Adresse obligatoire').optional(),
});

// --- Section E.1 : Règlement immeuble ---
export const reglementSchema = z.object({
  reglement_remis: z.boolean().optional(),
  date_remise: z.string().optional(),
  initiales_locataire: z.string().max(5).optional(),
});

// --- Section E.2 : Travaux ---
export const travauxSchema = z.object({
  travaux_avant_delivrance: z.string().optional(),
  travaux_en_cours_bail: z.string().optional(),
});

// --- Section E.3 : Concierge ---
export const conciergeSchema = z.object({
  service_concierge_actif: z.boolean().optional(),
  nom: z.string().optional(),
  telephone: z.string().optional(),
  courriel: z.string().email('Courriel invalide').optional().or(z.literal('')),
  telephone_cell: z.string().optional(),
});

// --- Section E.4 : Services et taxes ---
const cooperativeOuLocataire = z.enum(['cooperative', 'locataire']).optional();
export const servicesTaxesSchema = z.object({
  chauffage: cooperativeOuLocataire,
  electricite_source: z.enum(['gaz', 'electricite', 'mazout']).optional(),
  electricite_autre: cooperativeOuLocataire,
  chauffe_eau_location: cooperativeOuLocataire,
  eau_chaude_utilisation: cooperativeOuLocataire,
  taxe_eau: cooperativeOuLocataire,
  deneigement_stationnement: cooperativeOuLocataire,
  deneigement_balcon: cooperativeOuLocataire,
  deneigement_entree: cooperativeOuLocataire,
  deneigement_escalier: cooperativeOuLocataire,
});

// --- Section E.5 : Conditions ---
export const conditionsSchema = z.object({
  sans_fumee: z.boolean().optional(),
  sans_fumee_details: z.string().optional(),
  acces_terrain: z.boolean().optional(),
  acces_terrain_details: z.string().optional(),
  animaux_permis: z.boolean().optional(),
  animaux_details: z.string().optional(),
});

// --- Section E.6 : Autres services ---
export const autresServicesSchema = z.object({
  autres_services: z.string().optional(),
});

// --- Section F : Restrictions ---
export const restrictionsSchema = z.object({
  situation: z.enum(['membre', 'non_membre']).nullable().optional(),
  immeuble_recent: z.boolean().optional(),
  immeuble_pret_date: z.string().optional(),
  changement_affectation: z.boolean().optional(),
  changement_date: z.string().optional(),
  loyer_maximal: z.coerce.number().min(0).optional(),
});

// --- Section H.1 : Solidarité ---
export const solidariteSchema = z.object({
  engagement_solidaire: z.boolean().optional(),
  initiales_locataire1: z.string().max(5).optional(),
  initiales_locataire2: z.string().max(5).optional(),
});

// --- Section H.2 : Autres signataires ---
export const autreSignataireSchema = z.object({
  prenom: z.string().optional(),
  nom: z.string().min(1, 'Nom obligatoire'),
  adresse: z.string().min(1, 'Adresse obligatoire'),
  telephone: z.string().optional(),
  courriel: z.string().email('Courriel invalide').optional().or(z.literal('')),
  qualite: z.enum(['caution', 'garant', 'autre']),
  qualite_autre: z.string().optional(),
  signature_date: z.string().optional(),
});

export const autresSignatairesFormSchema = z.object({
  autres_signataires: z.array(autreSignataireSchema),
});

// --- Section G : Signatures ---
export const signaturesSchema = z.object({
  signature_coop_nom: z.string().optional(),
  signature_coop_qualite: z.string().optional(),
  signature_coop_date: z.string().optional(),
  signature_coop_lieu: z.string().optional(),
  signature_coop_accepte: z.boolean().optional(),
  signature_locataire1_nom: z.string().optional(),
  signature_locataire1_date: z.string().optional(),
  signature_locataire1_lieu: z.string().optional(),
  signature_locataire1_accepte: z.boolean().optional(),
  signature_locataire2_nom: z.string().optional(),
  signature_locataire2_date: z.string().optional(),
  signature_locataire2_lieu: z.string().optional(),
  signature_locataire2_accepte: z.boolean().optional(),
});

// --- Schéma maître pour validation avant sauvegarde ---
export const bailFormDataSchema = z.object({
  cooperative: cooperativeSchema.partial().optional(),
  locataire_principal: locataireSchema.partial().optional(),
  locataire_supplementaire: locataireSchema.partial().optional(),
  logement: logementSchema.partial().optional(),
  duree: dureeSchema.optional(),
  loyer: loyerSchema.optional(),
  services: z.object({
    reglement_immeuble: reglementSchema.optional(),
    travaux_reparations: travauxSchema.optional(),
    service_concierge: conciergeSchema.optional(),
    services_taxes: servicesTaxesSchema.optional(),
    conditions: conditionsSchema.optional(),
    autres_services: z.string().optional(),
  }).optional(),
  restrictions: restrictionsSchema.optional(),
  solidarite: z.object({
    engagement_solidaire: z.boolean().optional(),
    initiales_locataire1: z.string().optional(),
    initiales_locataire2: z.string().optional(),
    autres_signataires: z.array(autreSignataireSchema).optional(),
  }).optional(),
  signatures: signaturesSchema.optional(),
  finalisation: z.object({
    langue_bail: z.enum(['francais', 'anglais']).optional(),
    apercu_genere: z.boolean().optional(),
    pdf_genere: z.boolean().optional(),
    pdf_date_generation: z.string().optional(),
    pdf_url: z.string().optional(),
  }).optional(),
  metadata: z.object({
    status: z.enum(['draft', 'pending_signatures', 'signed', 'completed']).optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    lease_id: z.string().optional(),
  }).optional(),
}).partial();
