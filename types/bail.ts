// Types pour le formulaire de bail TAL

export interface BailFormData {
  // Section A - Identification
  cooperative: CooperativeInfo;
  locataire_principal: LocataireInfo;
  locataire_supplementaire?: LocataireInfo;
  
  // Section B - Description du logement
  logement: LogementInfo;
  
  // Section C - Durée du bail
  duree: DureeBail;
  
  // Section D - Loyer
  loyer: LoyerInfo;
  
  // Section E - Services et conditions
  services: ServicesConditions;
  
  // Section F - Restrictions
  restrictions?: RestrictionsInfo;
  
  // Section H - Solidarité et caution
  solidarite: SolidariteInfo;

  // Section G - Signatures
  signatures: SignaturesInfo;

  // Finalisation
  finalisation: FinalisationInfo;
  
  // Métadonnées
  metadata: {
    status: 'draft' | 'pending_signatures' | 'signed' | 'completed';
    created_at: string;
    updated_at: string;
    lease_id?: string;
  };
}

export interface CooperativeInfo {
  organisation_code?: string;
  nom?: string;
  numero?: string;
  rue?: string;
  app?: string;
  ville?: string;
  province?: string;
  code_postal?: string;
  telephone?: string;
  telephone_cell?: string;
  courriel?: string;
  // Mandataire (gestionnaire)
  mandataire_organisme?: string;
  mandataire_numero?: string;
  mandataire_rue?: string;
  mandataire_ville?: string;
  mandataire_province?: string;
  mandataire_code_postal?: string;
  mandataire_telephone?: string;
  mandataire_courriel?: string;
  // Signataire
  signataire_prenom?: string;
  signataire_nom?: string;
  signataire_qualite?: string;
}

export interface LocataireInfo {
  nom?: string;
  prenom?: string;
  numero?: string;
  rue?: string;
  app?: string;
  municipalite?: string;
  code_postal?: string;
  telephone?: string;
  telephone_cell?: string;
  courriel?: string;
  represente_par?: string;
}

export interface LogementInfo {
  adresse?: {
    numero?: string;
    rue?: string;
    app?: string;
    municipalite?: string;
    code_postal?: string;
  };
  nombre_pieces?: number;
  stationnement_exterieur?: {
    nombre: number;
    emplacements: string;
  };
  stationnement_interieur?: {
    nombre: number;
    emplacements: string;
  };
  remise?: {
    nombre: number;
    emplacements: string;
  };
  inclus_balcon?: boolean;
  inclus_remise?: boolean;
  acces_cour?: boolean;
  buanderie_commune?: boolean;
  autres_accessoires?: string;
  engagement_avertisseurs_fumee?: boolean;
  engagement_date?: string;
  engagement_initiales_coop?: string;
  engagement_initiales_locataire?: string;
}

export interface DureeBail {
  type?: 'fixe' | 'indeterminee';
  // Pour bail fixe
  duree_nombre?: number;
  duree_unite?: 'semaines' | 'mois' | 'annees';
  date_debut?: string;
  date_fin?: string;
  // Pour bail indéterminé
  date_commencement?: string;
}

export interface LoyerInfo {
  loyer_base?: number;
  cout_services?: number;
  loyer_total?: number;
  frequence?: 'mois' | 'semaine';
  programme_subvention?: boolean;
  details_subvention?: string;
  paiement?: PaiementInfo;
}

export interface PaiementInfo {
  premier_terme_date?: string;
  jour_paiement?: number;
  periode?: 'mois' | 'semaine';
  mode?: 'comptant' | 'cheque' | 'virement' | 'autre';
  mode_autre?: string;
  cheques_postdates?: boolean;
  lieu?: string;
}

export interface ServicesConditions {
  reglement_immeuble?: {
    reglement_remis?: boolean;
    date_remise?: string;
    initiales_locataire?: string;
  };

  travaux_reparations?: {
    travaux_avant_delivrance?: string;
    travaux_en_cours_bail?: string;
  };

  service_concierge?: {
    service_concierge_actif?: boolean;
    nom?: string;
    telephone?: string;
    courriel?: string;
    telephone_cell?: string;
  };

  services_taxes?: {
    chauffage?: 'cooperative' | 'locataire';
    electricite_source?: 'gaz' | 'electricite' | 'mazout';
    electricite_autre?: 'cooperative' | 'locataire';
    chauffe_eau_location?: 'cooperative' | 'locataire';
    eau_chaude_utilisation?: 'cooperative' | 'locataire';
    taxe_eau?: 'cooperative' | 'locataire';
    deneigement_stationnement?: 'cooperative' | 'locataire';
    deneigement_balcon?: 'cooperative' | 'locataire';
    deneigement_entree?: 'cooperative' | 'locataire';
    deneigement_escalier?: 'cooperative' | 'locataire';
  };

  conditions?: {
    sans_fumee?: boolean;
    sans_fumee_details?: string;
    acces_terrain?: boolean;
    acces_terrain_details?: string;
    animaux_permis?: boolean;
    animaux_details?: string;
  };

  autres_services?: string;
}

export interface RestrictionsInfo {
  situation: 'membre' | 'non_membre' | null;
  immeuble_recent?: boolean;
  immeuble_pret_date?: string;
  changement_affectation?: boolean;
  changement_date?: string;
  loyer_maximal?: number;
}

export interface SolidariteInfo {
  engagement_solidaire?: boolean;
  initiales_locataire1?: string;
  initiales_locataire2?: string;
  autres_signataires?: AutreSignataire[];
}

export interface AutreSignataire {
  prenom?: string;
  nom: string;
  adresse: string;
  telephone?: string;
  courriel?: string;
  qualite: 'caution' | 'garant' | 'autre';
  qualite_autre?: string;
  signature_date?: string;
}

export interface SignaturesInfo {
  // Signature du locateur (coopérative)
  signature_coop_nom?: string;
  signature_coop_qualite?: string;
  signature_coop_date?: string;
  signature_coop_lieu?: string;
  signature_coop_accepte?: boolean;
  // Signature du locataire principal
  signature_locataire1_nom?: string;
  signature_locataire1_date?: string;
  signature_locataire1_lieu?: string;
  signature_locataire1_accepte?: boolean;
  // Signature du locataire supplémentaire
  signature_locataire2_nom?: string;
  signature_locataire2_date?: string;
  signature_locataire2_lieu?: string;
  signature_locataire2_accepte?: boolean;
}

export interface FinalisationInfo {
  langue_bail?: 'francais' | 'anglais';
  apercu_genere?: boolean;
  pdf_genere?: boolean;
  pdf_date_generation?: string;
}

// Types pour la navigation
export interface NavigationSection {
  id: string;
  title: string;
  icon: string;
  subsections: NavigationSubsection[];
  completed: boolean;
}

export interface NavigationSubsection {
  id: string;
  title: string;
  order: number;
  completed: boolean;
}

// Type pour l'état du formulaire
export interface FormState {
  currentSection: string;
  currentSubsection: string;
  data: Partial<BailFormData>;
  errors: Record<string, string>;
  isDirty: boolean;
  lastSaved?: string;
}
