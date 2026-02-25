'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { AlertBox } from '@/components/ui/AlertBox';

interface SectionE5Props {
  data?: {
    sans_fumee?: boolean;
    sans_fumee_details?: string;
    acces_terrain?: boolean;
    acces_terrain_details?: string;
    animaux_permis?: boolean;
    animaux_details?: string;
  };
  onSave: (data: any) => void;
}

export const SectionE5: React.FC<SectionE5Props> = ({ data, onSave }) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: data,
  });

  const sansFumee = watch('sans_fumee');
  const accesTerrain = watch('acces_terrain');
  const animauxPermis = watch('animaux_permis');

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        E - Services et conditions
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        5. Conditions
      </h3>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        {/* Sans fumée */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('sans_fumee')}
              className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                Immeuble sans fumée
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Il est interdit de fumer dans le logement et/ou dans l'immeuble
              </p>
            </div>
          </label>

          {sansFumee && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Précisions sur les restrictions
              </label>
              <textarea
                {...register('sans_fumee_details')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tal-blue"
                placeholder="Ex: Interdit de fumer dans le logement, sur le balcon et dans les aires communes. Zone fumeurs désignée à l'extérieur."
              />
            </div>
          )}
        </div>

        {/* Accès terrain */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('acces_terrain')}
              className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                Accès à un terrain ou à une cour
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Le locataire a accès à un terrain, une cour ou un espace extérieur
              </p>
            </div>
          </label>

          {accesTerrain && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de l'accès
              </label>
              <textarea
                {...register('acces_terrain_details')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tal-blue"
                placeholder="Ex: Accès à la cour arrière commune. Usage partagé avec les autres locataires. Jardin communautaire disponible."
              />
            </div>
          )}
        </div>

        {/* Animaux */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('animaux_permis')}
              className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                Animaux permis
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Le locataire est autorisé à garder des animaux dans le logement
              </p>
            </div>
          </label>

          {animauxPermis && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restrictions ou conditions
              </label>
              <textarea
                {...register('animaux_details')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tal-blue"
                placeholder="Ex: Chiens et chats acceptés. Maximum 2 animaux. Doivent être tenus en laisse dans les aires communes. Dépôt de garantie de 200$ requis."
              />
            </div>
          )}

          {!animauxPermis && (
            <div className="mt-4 bg-white p-3 rounded border border-gray-300">
              <p className="text-sm text-gray-600">
                Les animaux ne sont pas permis dans ce logement.
              </p>
            </div>
          )}
        </div>

        <AlertBox variant="warning">
          <p>
            <strong>Note importante:</strong> Une clause interdisant totalement la présence 
            d'animaux dans un logement est abusive selon le Tribunal administratif du logement, 
            sauf exception (allergies documentées, immeuble à vocation particulière).
          </p>
        </AlertBox>
      </form>
    </div>
  );
};
