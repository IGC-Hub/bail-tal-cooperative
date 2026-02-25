'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

interface SectionE3Props {
  data?: {
    service_concierge_actif?: boolean;
    nom?: string;
    telephone?: string;
    telephone_cell?: string;
    courriel?: string;
  };
  onSave: (data: any) => void;
}

export const SectionE3: React.FC<SectionE3Props> = ({ data, onSave }) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: data,
  });

  const serviceActif = watch('service_concierge_actif');

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        E - Services et conditions
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        3. Services du concierge
      </h3>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('service_concierge_actif')}
              className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                Un service de conciergerie est disponible
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Cochez si votre immeuble dispose d'un concierge ou d'un responsable de l'entretien
              </p>
            </div>
          </label>
        </div>

        {serviceActif && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Coordonnées du concierge</h4>
            
            <Input
              label="Nom du concierge"
              required
              {...register('nom', { required: 'Nom obligatoire' })}
              placeholder="Jean Tremblay"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Téléphone"
                type="tel"
                required
                {...register('telephone', { required: 'Téléphone obligatoire' })}
                placeholder="514 XXX-XXXX"
              />
              <Input
                label="Cellulaire"
                type="tel"
                {...register('telephone_cell')}
                placeholder="438 XXX-XXXX"
              />
            </div>

            <Input
              label="Courriel"
              type="email"
              {...register('courriel')}
              placeholder="concierge@cooperative.com"
            />

            <div className="bg-white p-4 rounded border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>Services du concierge:</strong> Entretien des espaces communs, 
                gestion des urgences, collecte des ordures, déneigement, etc.
              </p>
            </div>
          </div>
        )}

        {!serviceActif && (
          <div className="bg-gray-100 p-4 rounded border border-gray-300">
            <p className="text-sm text-gray-600">
              Aucun service de conciergerie n'est disponible pour cet immeuble.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
