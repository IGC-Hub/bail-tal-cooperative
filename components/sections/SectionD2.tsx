'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

interface SectionD2Props {
  data?: {
    premier_terme_date?: string;
    jour_paiement?: number;
    periode?: 'mois' | 'semaine';
    mode?: 'comptant' | 'cheque' | 'virement' | 'autre';
    mode_autre?: string;
    cheques_postdates?: boolean;
    lieu?: string;
  };
  onSave: (data: any) => void;
}

export const SectionD2: React.FC<SectionD2Props> = ({ data, onSave }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: data,
  });

  const modePaiement = watch('mode');
  const periode = watch('periode');

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        D - Loyer
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        2. Paiement
      </h3>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <Input
          label="Le premier terme de loyer est payable le"
          type="date"
          required
          {...register('premier_terme_date', { required: 'Date obligatoire' })}
          error={errors.premier_terme_date?.message}
        />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Input
              label="Le loyer est ensuite payable le"
              type="number"
              min="1"
              max="31"
              required
              {...register('jour_paiement', { 
                required: 'Obligatoire',
                min: { value: 1, message: 'Entre 1 et 31' },
                max: { value: 31, message: 'Entre 1 et 31' }
              })}
              error={errors.jour_paiement?.message}
              placeholder="1"
            />
            <p className="text-sm text-gray-500 mt-1">Jour du mois (ex: 1 pour le 1er)</p>
          </div>

          <div>
            <label className="label-tal">De chaque</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="mois"
                  {...register('periode', { required: true })}
                  className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                />
                <span>Mois</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="semaine"
                  {...register('periode', { required: true })}
                  className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                />
                <span>Semaine</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Mode de paiement</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-3 border-2 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="comptant"
                {...register('mode', { required: true })}
                className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
              />
              <span>Comptant</span>
            </label>

            <label className="flex items-center space-x-3 p-3 border-2 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="cheque"
                {...register('mode', { required: true })}
                className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
              />
              <span>Chèque</span>
            </label>

            <label className="flex items-center space-x-3 p-3 border-2 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="virement"
                {...register('mode', { required: true })}
                className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
              />
              <span>Virement bancaire</span>
            </label>

            <label className="flex items-center space-x-3 p-3 border-2 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="autre"
                {...register('mode', { required: true })}
                className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
              />
              <span>Autre</span>
            </label>
          </div>

          {modePaiement === 'autre' && (
            <div className="mt-4">
              <Input
                label="Précisez le mode de paiement"
                required
                {...register('mode_autre', { required: 'Précisez le mode' })}
                placeholder="Ex: Prélèvement automatique"
              />
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('cheques_postdates')}
              className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
            />
            <div>
              <div className="font-medium text-gray-900">
                La coopérative accepte les chèques postdatés
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Le locataire peut remettre des chèques pour plusieurs mois à l'avance
              </p>
            </div>
          </label>
        </div>

        <Input
          label="Le loyer sera payable à l'adresse suivante (ou au lieu convenu)"
          required
          {...register('lieu', { required: 'Adresse obligatoire' })}
          error={errors.lieu?.message}
          placeholder="Ex: 7040 Rue Hutchison, Montréal, QC H3N 1Y7"
        />

        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Le loyer doit être payé au lieu indiqué ci-dessus, 
            sauf si les parties conviennent d'un autre lieu (exemple: compte bancaire 
            pour virement automatique).
          </p>
        </div>
      </form>
    </div>
  );
};
