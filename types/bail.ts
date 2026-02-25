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
  nom: string;
  numero: string;
  rue: string;
  app?: string;
  municipalite: string;
  code_postal: string;
  telephone: string;
  telephone_cell?: string;
  courriel?: string;
  representee_par: string;
}

export interface LocataireInfo {
  nom: string;
  prenom: string;
  numero: string;
  rue: string;
  app?: string;
  municipalite: string;
  code_postal: string;
  telephone: string;
  telephone_cell?: string;
  courriel?: string;
  represente_par?: string;
}

export interface LogementInfo {
  adresse: {
    numero: string;
    rue: string;
    app: string;
    municipalite: string;
    code_postal: string;
  };
  nombre_pieces: number;
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
  autres_accessoires?: string;
  engagement_avertisseurs_fumee: boolean;
  engagement_date?: string;
  engagement_initiales_coop?: string;
  engagement_initiales_locataire?: string;
}

export interface DureeBail {
  type: 'fixe' | 'indeterminee';
  // Pour bail fixe
  duree_nombre?: number;
  duree_unite?: 'semaines' | 'mois' | 'annees';
  date_debut?: string;
  date_fin?: string;
  // Pour bail indéterminé
  date_commencement?: string;
}

export interface LoyerInfo {
  loyer_base: number;
  cout_services?: number;
  loyer_total: number;
  frequence: 'mois' | 'semaine';
  programme_subvention: boolean;
  details_subvention?: string;
  
  paiement: {
    premier_terme_date: string;
    jour_paiement: number;
    periode: 'mois' | 'semaine';
    mode: 'comptant' | 'cheque' | 'virement' | 'autre';
    mode_autre?: string;
    cheques_postdates: boolean;
    lieu: string;
  };
}

export interface ServicesConditions {
  reglement_immeuble: {
    remis: boolean;
    date_remise?: string;
    initiales_locataire?: string;
  };
  
  travaux_reparations: {
    avant_delivrance?: string;
    en_cours_bail?: string;
  };
  
  service_concierge?: {
    actif: boolean;
    nom?: string;
    telephone?: string;
    courriel?: string;
    telephone_cell?: string;
  };
  
  services_taxes: {
    chauffage: 'cooperative' | 'locataire';
    electricite_source?: 'gaz' | 'electricite' | 'mazout';
    electricite_autre: 'cooperative' | 'locataire';
    chauffe_eau_location: 'cooperative' | 'locataire';
    eau_chaude_utilisation: 'cooperative' | 'locataire';
    taxe_eau: 'cooperative' | 'locataire';
    deneigement: {
      stationnement: 'cooperative' | 'locataire';
      balcon: 'cooperative' | 'locataire';
      entree: 'cooperative' | 'locataire';
      escalier: 'cooperative' | 'locataire';
    };
  };
  
  conditions: {
    sans_fumee: boolean;
    sans_fumee_details?: string;
    acces_terrain: boolean;
    acces_terrain_details?: string;
    animaux_permis: boolean;
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
  engagement_solidaire: boolean;
  initiales_locataire1?: string;
  initiales_locataire2?: string;
  autres_signataires?: AutreSignataire[];
}

export interface AutreSignataire {
  nom: string;
  adresse: string;
  qualite: string; // 'locataire', 'caution', etc.
  signature_date?: string;
}

export interface FinalisationInfo {
  langue_bail: 'francais' | 'anglais';
  mot_de_passe?: string;
  apercu_genere: boolean;
  date_signature_coop?: string;
  date_signature_locataire1?: string;
  date_signature_locataire2?: string;
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
