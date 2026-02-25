'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { LogementInfo } from '@/types/bail';

interface SectionB2Props {
  data?: Partial<LogementInfo>;
  onSave: (data: Partial<LogementInfo>) => void;
}

export const SectionB2: React.FC<SectionB2Props> = ({ data, onSave }) => {
  const { register, handleSubmit, watch } = useForm<LogementInfo>({
    defaultValues: data,
  });

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        B - Description du logement loué, des accessoires et des dépendances
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        2. Autres accessoires et dépendances
      </h3>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-700 mb-4">
            Indiquez les autres accessoires ou dépendances inclus avec le logement:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('inclus_balcon')}
                className="w-4 h-4 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
              />
              <span className="text-gray-700">Balcon</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('inclus_remise')}
                className="w-4 h-4 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
              />
              <span className="text-gray-700">Remise/Rangement</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
              />
              <span className="text-gray-700">Accès cour arrière</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
              />
              <span className="text-gray-700">Buanderie commune</span>
            </label>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Précisions</h4>
          <textarea
            {...register('autres_accessoires')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tal-blue"
            placeholder="Décrivez d'autres accessoires ou dépendances non listés ci-dessus..."
          />
        </div>
      </form>
    </div>
  );
};
