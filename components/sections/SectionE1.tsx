'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { AlertBox } from '@/components/ui/AlertBox';

interface SectionE1Props {
  data?: {
    reglement_remis?: boolean;
    date_remise?: string;
    initiales_locataire?: string;
  };
  onSave: (data: any) => void;
}

export const SectionE1: React.FC<SectionE1Props> = ({ data, onSave }) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: data,
  });

  const reglementRemis = watch('reglement_remis');

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        E - Services et conditions
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        1. Règlement de l'immeuble
      </h3>

      <AlertBox variant="info">
        <p>
          Si un règlement régit l'utilisation de l'immeuble où se trouve le logement, 
          la coopérative doit en remettre copie au locataire. Le règlement fait alors 
          partie du bail.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('reglement_remis')}
              className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                Un règlement d'immeuble a été remis au locataire
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Cochez si votre coopérative possède un règlement d'immeuble 
                (ex: règles sur le bruit, animaux, utilisation des espaces communs)
              </p>
            </div>
          </label>
        </div>

        {reglementRemis && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Confirmation de remise</h4>
            
            <Input
              label="Date de remise du règlement"
              type="date"
              required
              {...register('date_remise', { required: 'Date obligatoire' })}
            />

            <Input
              label="Initiales du locataire (confirmation de réception)"
              required
              maxLength={5}
              {...register('initiales_locataire', { required: 'Initiales obligatoires' })}
              placeholder="Ex: SC"
            />

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> Le règlement d'immeuble fait partie intégrante 
                du bail. Le locataire s'engage à le respecter.
              </p>
            </div>
          </div>
        )}

        {!reglementRemis && (
          <div className="bg-gray-100 p-4 rounded border border-gray-300">
            <p className="text-sm text-gray-600">
              Aucun règlement d'immeuble n'est applicable à ce logement.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
