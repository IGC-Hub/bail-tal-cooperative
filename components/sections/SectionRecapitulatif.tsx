'use client';

import React from 'react';
import { BailFormData } from '@/types/bail';
import { AlertBox } from '@/components/ui/AlertBox';

interface SectionRecapitulatifProps {
  data: Partial<BailFormData>;
}

function Field({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === undefined || value === null || value === '') return null;
  const display = typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : String(value);
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{display}</span>
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
      <h4 className="font-semibold text-tal-blue mb-3 text-sm uppercase tracking-wide">{title}</h4>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

export const SectionRecapitulatif: React.FC<SectionRecapitulatifProps> = ({ data }) => {
  const coop = data.cooperative;
  const loc = data.locataire_principal;
  const loc2 = data.locataire_supplementaire;
  const log = data.logement;
  const duree = data.duree;
  const loyer = data.loyer;
  const services = data.services;
  const restrictions = data.restrictions;
  const solidarite = data.solidarite;

  const formatMoney = (v?: number) => v !== undefined ? `${v.toFixed(2)} $` : undefined;

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Récapitulatif du bail
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        Vérifiez les informations avant de signer
      </h3>

      <AlertBox variant="info">
        <p>
          Veuillez vérifier attentivement toutes les informations ci-dessous.
          Si une information est incorrecte, utilisez la navigation pour retourner
          à la section concernée et la corriger.
        </p>
      </AlertBox>

      <div className="mt-6 space-y-2">
        {/* A - Identification */}
        <SectionBlock title="A.1 — Coopérative">
          <Field label="Coopérative" value={coop?.nom} />
          <Field label="Adresse" value={[coop?.numero, coop?.rue].filter(Boolean).join(' ')} />
          <Field label="Ville" value={coop?.ville} />
          <Field label="Code postal" value={coop?.code_postal} />
          <Field label="Gestionnaire" value={coop?.mandataire_organisme} />
          <Field label="Signataire" value={[coop?.signataire_prenom, coop?.signataire_nom].filter(Boolean).join(' ')} />
        </SectionBlock>

        <SectionBlock title="A.2 — Locataire principal">
          <Field label="Nom" value={[loc?.prenom, loc?.nom].filter(Boolean).join(' ')} />
          <Field label="Adresse" value={[loc?.numero, loc?.rue, loc?.app && `app. ${loc.app}`].filter(Boolean).join(' ')} />
          <Field label="Municipalité" value={loc?.municipalite} />
          <Field label="Téléphone" value={loc?.telephone} />
          <Field label="Courriel" value={loc?.courriel} />
        </SectionBlock>

        {loc2?.nom && (
          <SectionBlock title="A.2 — Locataire supplémentaire">
            <Field label="Nom" value={[loc2.prenom, loc2.nom].filter(Boolean).join(' ')} />
            <Field label="Téléphone" value={loc2.telephone} />
          </SectionBlock>
        )}

        {/* B - Logement */}
        <SectionBlock title="B — Logement">
          <Field label="Adresse" value={[log?.adresse?.numero, log?.adresse?.rue, log?.adresse?.app && `app. ${log.adresse.app}`].filter(Boolean).join(' ')} />
          <Field label="Municipalité" value={log?.adresse?.municipalite} />
          <Field label="Nombre de pièces" value={log?.nombre_pieces} />
          <Field label="Balcon inclus" value={log?.inclus_balcon} />
          <Field label="Remise incluse" value={log?.inclus_remise} />
          <Field label="Accès cour" value={log?.acces_cour} />
          <Field label="Avertisseurs de fumée" value={log?.engagement_avertisseurs_fumee} />
        </SectionBlock>

        {/* C - Durée */}
        <SectionBlock title="C — Durée du bail">
          <Field label="Type" value={duree?.type === 'fixe' ? 'Durée fixe' : duree?.type === 'indeterminee' ? 'Durée indéterminée' : undefined} />
          {duree?.type === 'fixe' && (
            <>
              <Field label="Durée" value={duree.duree_nombre && duree.duree_unite ? `${duree.duree_nombre} ${duree.duree_unite}` : undefined} />
              <Field label="Début" value={duree.date_debut} />
              <Field label="Fin" value={duree.date_fin} />
            </>
          )}
          {duree?.type === 'indeterminee' && (
            <Field label="Date de commencement" value={duree.date_commencement} />
          )}
        </SectionBlock>

        {/* D - Loyer */}
        <SectionBlock title="D — Loyer">
          <Field label="Loyer de base" value={formatMoney(loyer?.loyer_base)} />
          <Field label="Coût des services" value={formatMoney(loyer?.cout_services)} />
          <Field label="Loyer total" value={formatMoney(loyer?.loyer_total)} />
          <Field label="Fréquence" value={loyer?.frequence === 'mois' ? 'Par mois' : loyer?.frequence === 'semaine' ? 'Par semaine' : undefined} />
          <Field label="Subvention" value={loyer?.programme_subvention} />
          {loyer?.programme_subvention && <Field label="Détails subvention" value={loyer.details_subvention} />}
          <Field label="Mode de paiement" value={loyer?.paiement?.mode} />
          <Field label="Jour de paiement" value={loyer?.paiement?.jour_paiement} />
        </SectionBlock>

        {/* E - Services */}
        <SectionBlock title="E — Services et conditions">
          <Field label="Règlement d'immeuble remis" value={services?.reglement_immeuble?.reglement_remis} />
          <Field label="Concierge actif" value={services?.service_concierge?.service_concierge_actif} />
          {services?.service_concierge?.service_concierge_actif && (
            <Field label="Nom du concierge" value={services.service_concierge.nom} />
          )}
          <Field label="Chauffage" value={services?.services_taxes?.chauffage} />
          <Field label="Électricité" value={services?.services_taxes?.electricite_autre} />
          <Field label="Sans fumée" value={services?.conditions?.sans_fumee} />
          <Field label="Animaux permis" value={services?.conditions?.animaux_permis} />
        </SectionBlock>

        {/* F - Restrictions */}
        {restrictions?.situation && (
          <SectionBlock title="F — Restrictions">
            <Field label="Situation" value={restrictions.situation === 'membre' ? 'Membre' : 'Non-membre'} />
            <Field label="Immeuble récent" value={restrictions.immeuble_recent} />
          </SectionBlock>
        )}

        {/* H - Solidarité */}
        <SectionBlock title="H — Solidarité et caution">
          <Field label="Engagement solidaire" value={solidarite?.engagement_solidaire} />
          {solidarite?.autres_signataires && solidarite.autres_signataires.length > 0 && (
            <Field
              label="Cautions/garants"
              value={solidarite.autres_signataires.map(s => `${s.prenom ?? ''} ${s.nom} (${s.qualite})`).join(', ')}
            />
          )}
        </SectionBlock>
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-200">
        <p className="text-sm text-gray-700">
          <strong>Prochaine étape :</strong> Cliquez sur « Suivant » pour
          procéder à la signature du bail.
        </p>
      </div>
    </div>
  );
};
