'use client';

import React from 'react';
import { AlertBox } from '@/components/ui/AlertBox';

export const IntroductionSection: React.FC = () => {
  return (
    <div className="section-card">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Informations sur le processus
      </h1>

      <AlertBox variant="warning">
        <p className="font-medium mb-2">
          Avant d'utiliser le service de bail électronique, vous devez vous assurer que toutes les parties signataires possèdent une adresse de courriel valide.
        </p>
        <p className="mt-3">
          À défaut, un formulaire de bail en version papier est en vente dans les bureaux du Tribunal administratif du logement, dans les librairies et aux Publications du Québec (1 800 463-2100). Il est également possible d'acheter le formulaire de bail en ligne sur le site Web{' '}
          <a href="#" className="text-tal-blue underline">
            Publications du Québec
          </a>.
        </p>
        <p className="mt-3">
          Si vous utilisez un formulaire de bail en version papier, veuillez noter que le Tribunal administratif du logement met à la disposition de la clientèle, sur son site Web, une trousse d'information à jour concernant les droits et obligations des parties, et ce, jusqu'à ce que le formulaire en version papier intègre l'ensemble des modifications légales.
        </p>
      </AlertBox>

      <div className="prose max-w-none">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          1. Remplissage du formulaire de bail électronique
        </h2>
        <p className="mb-4">
          À titre de <strong>locateur responsable</strong>, vous remplissez le formulaire de bail en ligne.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            Les champs <strong>obligatoires</strong> sont identifiés par un astérisque (*).
          </li>
          <li>
            Une fois le formulaire de bail électronique complété, il est{' '}
            <strong>automatiquement transmis à toutes les personnes concernées</strong>{' '}
            (p. ex. : autres locateurs, locataires et cautions, s'il y a lieu).
          </li>
        </ul>
        <p className="mb-6">
          Pour que chaque partie puisse recevoir le formulaire de bail électronique, il est{' '}
          <strong>nécessaire d'indiquer une adresse de courriel valide</strong>.
        </p>

        <AlertBox variant="warning">
          <p>
            Seul le locateur responsable peut modifier le contenu du formulaire de bail électronique. Si une erreur est constatée par une autre partie, celle-ci doit communiquer avec le locateur responsable pour qu'il puisse effectuer les corrections nécessaires, le cas échéant.
          </p>
        </AlertBox>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
          Enregistrement du formulaire de bail électronique
        </h3>
        <p className="mb-4">
          Si vous le souhaitez, vous pouvez enregistrer le formulaire de bail électronique et poursuivre la saisie des informations demandées à un autre moment. Le cas échéant, un hyperlien vous permettant d'accéder au formulaire vous sera transmis par courriel.
        </p>
        <p className="mb-6">
          L'accès au formulaire sera protégé par un mot de passe que vous aurez créé. Si vous oubliez ou perdez ce mot de passe, vous devrez remplir de nouveau le formulaire.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">
          2. Validation et signature
        </h2>
        <p className="mb-4">
          Chaque partie reçoit un <strong>hyperlien personnalisé</strong> lui permettant de :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>consulter le formulaire de bail électronique;</li>
          <li>valider les informations qui y sont inscrites;</li>
          <li>apposer sa signature électronique.</li>
        </ul>
        <p className="mb-4">
          L'hyperlien pour signer et conclure le formulaire de bail électronique est valide pour{' '}
          <strong>36 heures</strong> à compter de sa transmission aux autres parties.
        </p>
        <p className="mb-6">
          Pour des raisons de sécurité, un <strong>mot de passe est exigé</strong>.
        </p>
        <p className="mb-6">
          Vous devrez choisir un mot de passe et le{' '}
          <strong>transmettre aux parties par le moyen de votre choix</strong> (p. ex. : téléphone, message texte, courriel, etc.).
        </p>
      </div>
    </div>
  );
};
