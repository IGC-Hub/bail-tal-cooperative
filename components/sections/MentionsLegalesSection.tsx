'use client';

import React from 'react';
import { AlertBox } from '@/components/ui/AlertBox';

export const MentionsLegalesSection: React.FC = () => {
  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Mentions légales
      </h2>

      <AlertBox variant="info">
        <p>
          Les mentions légales suivantes font partie intégrante du bail et informent 
          les parties de leurs droits et obligations selon la loi québécoise.
        </p>
      </AlertBox>

      <div className="prose max-w-none mt-6 space-y-6">
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            1. Tribunal administratif du logement
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Le Tribunal administratif du logement est l'organisme chargé de trancher les litiges 
            entre locateurs et locataires. Pour toute question ou pour déposer une demande, 
            vous pouvez communiquer avec le Tribunal:
          </p>
          <ul className="mt-3 space-y-1 text-gray-700 ml-6 list-disc">
            <li>Site web: <a href="https://www.tal.gouv.qc.ca" target="_blank" rel="noopener noreferrer" className="text-tal-blue underline">www.tal.gouv.qc.ca</a></li>
            <li>Téléphone: 1 800 683-2245</li>
            <li>Sans frais: 1 800 683-2245</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            2. Droit au maintien dans les lieux
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Le locataire a le droit de demeurer dans le logement. Le bail est reconduit 
            automatiquement à la fin de chaque période, sauf si:
          </p>
          <ul className="mt-3 space-y-1 text-gray-700 ml-6 list-disc">
            <li>Le locateur envoie un avis de modification du bail ou de non-reconduction</li>
            <li>Le locataire envoie un avis de non-reconduction</li>
            <li>Les parties conviennent de mettre fin au bail</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            3. Fixation du loyer
          </h3>
          <p className="text-gray-700 leading-relaxed">
            À la reconduction du bail, le locateur peut proposer une modification du loyer. 
            Si le locataire refuse cette modification, il peut s'adresser au Tribunal 
            administratif du logement dans le mois suivant la réception de l'avis pour faire 
            fixer le loyer.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong>Note importante pour les coopératives:</strong> Les membres d'une coopérative 
            ne peuvent généralement pas demander la fixation du loyer, car ils participent aux 
            décisions concernant les loyers.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            4. Résiliation du bail
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Le bail peut être résilié dans les cas suivants:
          </p>
          <ul className="mt-3 space-y-2 text-gray-700 ml-6 list-disc">
            <li>
              <strong>Violence conjugale ou familiale:</strong> Le locataire victime peut 
              résilier le bail en tout temps avec un préavis d'un mois
            </li>
            <li>
              <strong>Admission en CHSLD ou logement social:</strong> Le locataire de 70 ans 
              ou plus ou ayant un handicap peut résilier avec 2 mois de préavis
            </li>
            <li>
              <strong>Reprise du logement ou éviction:</strong> Le locateur peut reprendre 
              le logement pour lui-même, ses proches, ou pour démolir/rénover, selon les 
              conditions prévues par la loi
            </li>
            <li>
              <strong>Défaut de paiement ou trouble de jouissance:</strong> En cas de non-paiement 
              du loyer ou de trouble grave, après décision du Tribunal
            </li>
          </ul>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            5. Sous-location et cession de bail
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Le locataire peut sous-louer le logement ou céder le bail avec le consentement 
            de la coopérative. La coopérative ne peut refuser sans motif sérieux. En cas de 
            refus, le locataire peut s'adresser au Tribunal administratif du logement dans 
            les 15 jours.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            6. Réparations et entretien
          </h3>
          <p className="text-gray-700 leading-relaxed">
            La coopérative doit:
          </p>
          <ul className="mt-3 space-y-1 text-gray-700 ml-6 list-disc">
            <li>Délivrer le logement en bon état d'habitabilité</li>
            <li>Effectuer les réparations nécessaires</li>
            <li>Garantir la jouissance paisible du logement</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Le locataire doit:
          </p>
          <ul className="mt-3 space-y-1 text-gray-700 ml-6 list-disc">
            <li>Se conduire de manière à ne pas troubler la jouissance des autres locataires</li>
            <li>Maintenir le logement en bon état de propreté</li>
            <li>Effectuer les réparations locatives (mineures)</li>
            <li>Aviser la coopérative des réparations à effectuer</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            7. Accès au logement
          </h3>
          <p className="text-gray-700 leading-relaxed">
            La coopérative peut accéder au logement:
          </p>
          <ul className="mt-3 space-y-1 text-gray-700 ml-6 list-disc">
            <li>Avec l'accord du locataire</li>
            <li>En cas d'urgence</li>
            <li>Pour faire visiter le logement à un locataire potentiel (2 heures par jour entre 9h et 21h)</li>
            <li>Pour effectuer des travaux (avec préavis de 24 heures, sauf urgence)</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            8. Protection contre la discrimination
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Il est interdit de discriminer un locataire en raison de:
          </p>
          <ul className="mt-3 space-y-1 text-gray-700 ml-6 list-disc">
            <li>La race, la couleur, le sexe, l'orientation sexuelle, l'identité de genre</li>
            <li>L'état civil, la grossesse</li>
            <li>L'âge (sauf dans la mesure prévue par la loi)</li>
            <li>La religion, les convictions politiques</li>
            <li>La langue, l'origine ethnique ou nationale</li>
            <li>La condition sociale</li>
            <li>Le handicap ou l'utilisation d'un moyen pour pallier ce handicap</li>
          </ul>
        </section>

        <section className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            ⚠️ Clauses interdites ou réputées non écrites
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            Certaines clauses sont automatiquement nulles, même si elles figurent au bail:
          </p>
          <ul className="space-y-2 text-gray-700 ml-6 list-disc">
            <li>Clause interdisant les animaux de façon absolue (sauf exceptions)</li>
            <li>Clause exigeant un dépôt de garantie (sauf dernier mois de loyer)</li>
            <li>Clause imposant des pénalités excessives en cas de retard de paiement</li>
            <li>Clause limitant le droit de recours du locataire</li>
            <li>Clause permettant au locateur de modifier unilatéralement le bail</li>
            <li>Clause obligeant le locataire à souscrire une assurance auprès d'un assureur désigné</li>
          </ul>
        </section>

        <section className="bg-blue-50 p-6 rounded-lg border-l-4 border-tal-blue">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📚 Pour plus d'information
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            Consultez les ressources suivantes:
          </p>
          <ul className="space-y-2 text-gray-700 ml-6 list-disc">
            <li>
              <strong>Tribunal administratif du logement:</strong>{' '}
              <a href="https://www.tal.gouv.qc.ca" target="_blank" rel="noopener noreferrer" className="text-tal-blue underline">
                www.tal.gouv.qc.ca
              </a>
            </li>
            <li>
              <strong>Code civil du Québec:</strong> Articles 1851 à 2000
            </li>
            <li>
              <strong>Éducaloi:</strong>{' '}
              <a href="https://www.educaloi.qc.ca" target="_blank" rel="noopener noreferrer" className="text-tal-blue underline">
                www.educaloi.qc.ca
              </a>
            </li>
            <li>
              <strong>Commission des droits de la personne et des droits de la jeunesse</strong> 
              pour les questions de discrimination
            </li>
          </ul>
        </section>

        <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 mt-8">
          <p className="text-sm text-gray-700 text-center">
            <strong>Note importante:</strong> Ces mentions légales sont fournies à titre informatif. 
            En cas de doute ou de litige, consultez le Tribunal administratif du logement ou un 
            conseiller juridique.
          </p>
        </div>
      </div>
    </div>
  );
};
