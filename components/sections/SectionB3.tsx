'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { AlertBox } from '@/components/ui/AlertBox';
import { Input } from '@/components/ui/Input';

interface SectionB3Props {
  data?: {
    engagement_accepted?: boolean;
    engagement_date?: string;
    engagement_initiales_coop?: string;
    engagement_initiales_locataire?: string;
  };
  onSave: (data: any) => void;
}

export const SectionB3: React.FC<SectionB3Props> = ({ data, onSave }) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: data,
  });

  const engagementAccepted = watch('engagement_accepted');

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        B - Description du logement loué, des accessoires et des dépendances
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        3. Engagement pour avertisseurs de fumée
      </h3>

      <AlertBox variant="info">
        <p className="font-medium">
          La coopérative et le locataire s'engagent, selon les responsabilités de chacun, 
          à respecter la réglementation relative à la présence et au bon fonctionnement 
          des avertisseurs de fumée dans le logement et dans l'immeuble.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('engagement_accepted')}
              className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
            />
            <span className="text-gray-900 font-medium">
              Je reconnais avoir pris connaissance de mon obligation de respecter 
              la réglementation sur les avertisseurs de fumée
            </span>
          </label>
        </div>

        {engagementAccepted && (
          <div className="space-y-4 pt-4">
            <Input
              label="Date de l'engagement"
              type="date"
              required
              {...register('engagement_date', { required: 'Date obligatoire' })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Initiales du mandataire de la coopérative"
                required
                maxLength={5}
                {...register('engagement_initiales_coop', { required: 'Obligatoire' })}
                placeholder="Ex: ZO"
              />
              <Input
                label="Initiales du locataire"
                required
                maxLength={5}
                {...register('engagement_initiales_locataire', { required: 'Obligatoire' })}
                placeholder="Ex: SC"
              />
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Note importante:</strong> La réglementation sur les avertisseurs de fumée 
            est obligatoire au Québec. Le locataire et la coopérative ont des responsabilités 
            spécifiques concernant l'installation, l'entretien et le remplacement des avertisseurs.
          </p>
        </div>
      </form>
    </div>
  );
};
