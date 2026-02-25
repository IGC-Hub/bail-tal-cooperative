'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { AlertBox } from '@/components/ui/AlertBox';

interface SectionD1Props {
  data?: {
    loyer_base?: number;
    cout_services?: number;
    loyer_total?: number;
    frequence?: 'mois' | 'semaine';
    programme_subvention?: boolean;
    details_subvention?: string;
  };
  onSave: (data: any) => void;
}

export const SectionD1: React.FC<SectionD1Props> = ({ data, onSave }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: data,
  });

  const loyerBase = watch('loyer_base');
  const coutServices = watch('cout_services');
  const programmeSubvention = watch('programme_subvention');

  // Calcul automatique du loyer total
  React.useEffect(() => {
    const base = parseFloat(loyerBase) || 0;
    const services = parseFloat(coutServices) || 0;
    setValue('loyer_total', base + services);
  }, [loyerBase, coutServices, setValue]);

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        D - Loyer
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        1. Coût
      </h3>

      <AlertBox variant="info">
        <p className="mb-2">
          <strong>Loyer:</strong> Le loyer est payable par versements égaux ne dépassant pas 
          un mois de loyer, sauf le dernier versement, qui peut être moins élevé.
        </p>
        <p>
          Le bail d'une durée de plus de douze mois peut faire l'objet d'un seul réajustement 
          du loyer au cours de chaque période de douze mois. Il ne peut varier au cours des 
          douze premiers mois.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Input
              label="Le loyer est de"
              type="number"
              step="0.01"
              required
              {...register('loyer_base', { 
                required: 'Obligatoire',
                min: { value: 0, message: 'Montant invalide' }
              })}
              error={errors.loyer_base?.message}
              placeholder="929.00"
            />
            <p className="text-sm text-gray-500 mt-1">$ CAD</p>
          </div>

          <div>
            <label className="label-tal">Fréquence</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="mois"
                  {...register('frequence', { required: true })}
                  className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                />
                <span>Par mois</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="semaine"
                  {...register('frequence', { required: true })}
                  className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                />
                <span>Par semaine</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Le coût total des services est de"
            type="number"
            step="0.01"
            {...register('cout_services')}
            placeholder="0.00"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
          <Input
            label="Le loyer total est de"
            type="number"
            step="0.01"
            readOnly
            {...register('loyer_total')}
            className="bg-gray-100 font-bold text-lg"
          />
          <p className="text-sm text-gray-600 mt-2">
            Calculé automatiquement: Loyer de base + Coût des services
          </p>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Programme de subvention</h4>
          
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('programme_subvention')}
              className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
            />
            <div>
              <div className="font-medium text-gray-900">
                Le locataire bénéficie d'un programme de subvention pour le paiement du loyer
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Cochez si applicable (ex: PSL, Supplément au loyer)
              </p>
            </div>
          </label>

          {programmeSubvention && (
            <div className="mt-4">
              <label className="label-tal">Précisez le programme</label>
              <textarea
                {...register('details_subvention')}
                rows={3}
                className="input-tal"
                placeholder="Ex: Programme Supplément au loyer (PSL), Allocation-logement, etc."
              />
            </div>
          )}
        </div>

        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> La coopérative ne peut exiger aucune autre somme 
            d'argent du locataire (exemple : dépôt pour les clés).
          </p>
        </div>
      </form>
    </div>
  );
};
