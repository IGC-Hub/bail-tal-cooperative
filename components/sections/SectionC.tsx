'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { AlertBox } from '@/components/ui/AlertBox';
import { DureeBail } from '@/types/bail';

interface SectionCProps {
  data?: Partial<DureeBail>;
  onSave: (data: Partial<DureeBail>) => void;
}

export const SectionC: React.FC<SectionCProps> = ({ data, onSave }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DureeBail>({
    defaultValues: data,
  });

  const bailType = watch('type');

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        C - Durée du bail
      </h2>

      <AlertBox variant="info">
        <p>
          Ni la coopérative ni le locataire ne peuvent mettre fin au bail unilatéralement, 
          sauf pour les exceptions prévues par la loi. Ils peuvent cependant y mettre fin 
          par consentement mutuel.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Type de bail</h3>
          
          <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              value="fixe"
              {...register('type', { required: 'Sélectionnez un type de bail' })}
              className="w-5 h-5 mt-1 text-tal-blue focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Bail à durée fixe</div>
              <div className="text-sm text-gray-600 mt-1">
                Le bail a une date de début et une date de fin précises
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              value="indeterminee"
              {...register('type', { required: 'Sélectionnez un type de bail' })}
              className="w-5 h-5 mt-1 text-tal-blue focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Bail à durée indéterminée</div>
              <div className="text-sm text-gray-600 mt-1">
                Le bail commence à une date précise mais n'a pas de date de fin
              </div>
            </div>
          </label>

          {errors.type && (
            <p className="text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        {/* Bail à durée fixe */}
        {bailType === 'fixe' && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Bail à durée fixe</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Durée"
                type="number"
                required
                {...register('duree_nombre', { required: 'Obligatoire', min: 1 })}
                error={errors.duree_nombre?.message}
                placeholder="12"
              />
              <div className="col-span-2">
                <label className="label-tal">Unité</label>
                <select
                  {...register('duree_unite', { required: 'Obligatoire' })}
                  className="input-tal"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="semaines">Semaines</option>
                  <option value="mois">Mois</option>
                  <option value="annees">Années</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date de début"
                type="date"
                required
                {...register('date_debut', { required: 'Obligatoire' })}
                error={errors.date_debut?.message}
              />
              <Input
                label="Date de fin"
                type="date"
                required
                {...register('date_fin', { required: 'Obligatoire' })}
                error={errors.date_fin?.message}
              />
            </div>
          </div>
        )}

        {/* Bail à durée indéterminée */}
        {bailType === 'indeterminee' && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Bail à durée indéterminée</h4>
            
            <Input
              label="Date de commencement"
              type="date"
              required
              {...register('date_commencement', { required: 'Obligatoire' })}
              error={errors.date_commencement?.message}
            />

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Un bail à durée indéterminée peut être résilié 
                par l'une ou l'autre des parties en donnant un préavis selon les règles établies.
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
