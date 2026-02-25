'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { AlertBox } from '@/components/ui/AlertBox';

interface SectionE6Props {
  data?: {
    autres_services?: string;
  };
  onSave: (data: any) => void;
}

export const SectionE6: React.FC<SectionE6Props> = ({ data, onSave }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: data,
  });

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        E - Services et conditions
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        6. Autres services, conditions et restrictions
      </h3>

      <AlertBox variant="info">
        <p>
          Utilisez cet espace pour préciser tout autre service, condition ou restriction 
          applicable au bail qui n'a pas été mentionné dans les sections précédentes.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Autres services, conditions ou restrictions
          </label>
          <textarea
            {...register('autres_services')}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tal-blue"
            placeholder="Exemples de ce que vous pouvez mentionner:

• Accès à une buanderie commune (heures d'ouverture, coût)
• Règles sur le bruit et les heures silencieuses
• Restrictions sur les sous-locations ou colocataires
• Services de collecte des ordures (jours, horaires)
• Accès à un local à vélos ou entreposage
• Internet ou câble inclus
• Espaces communs disponibles (gym, salle communautaire)
• Règles sur les rénovations ou modifications au logement
• Conditions d'utilisation du stationnement
• Etc."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="font-medium text-gray-900 mb-2">Exemples de mentions courantes:</h4>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Heures silencieuses: de 22h à 7h en semaine, de 23h à 8h la fin de semaine</li>
            <li>Buanderie commune au sous-sol: 2,50$ par lavage, 2,00$ par séchage</li>
            <li>Collecte des ordures: mardis et vendredis, sortir les bacs avant 7h</li>
            <li>Internet haute vitesse inclus dans le loyer (50 Mbps)</li>
            <li>Local à vélos sécurisé accessible 24/7</li>
            <li>Salle communautaire disponible sur réservation</li>
          </ul>
        </div>

        <AlertBox variant="warning">
          <p>
            <strong>Attention:</strong> Les clauses ajoutées ici doivent respecter la loi. 
            Toute clause abusive ou contraire au Code civil du Québec sera considérée comme 
            nulle par le Tribunal administratif du logement.
          </p>
        </AlertBox>
      </form>
    </div>
  );
};
