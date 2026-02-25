'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { AlertBox } from '@/components/ui/AlertBox';

interface SectionH1Props {
  data?: {
    engagement_solidaire?: boolean;
    initiales_locataire1?: string;
    initiales_locataire2?: string;
  };
  onSave: (data: any) => void;
}

export const SectionH1: React.FC<SectionH1Props> = ({ data, onSave }) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: data,
  });

  const engagementSolidaire = watch('engagement_solidaire');

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        H - Solidarité et caution
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        1. Engagement solidaire
      </h3>

      <AlertBox variant="info">
        <p className="mb-2">
          <strong>Qu'est-ce que la solidarité?</strong>
        </p>
        <p>
          Lorsque plusieurs locataires signent un bail de façon solidaire, chacun d'eux 
          est responsable de l'ensemble du bail. Cela signifie que la coopérative peut 
          demander à n'importe lequel des locataires de payer la totalité du loyer ou 
          d'exécuter toutes les obligations du bail, même si les autres locataires ne 
          paient pas leur part.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('engagement_solidaire')}
              className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-lg">
                Les locataires s'engagent solidairement
              </div>
              <p className="text-sm text-gray-600 mt-2">
                En cochant cette case, tous les locataires signataires du bail acceptent 
                d'être solidairement responsables du paiement du loyer et de l'exécution 
                de toutes les obligations prévues au bail.
              </p>
            </div>
          </label>
        </div>

        {engagementSolidaire && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">
              Confirmation de l'engagement solidaire
            </h4>
            
            <p className="text-sm text-gray-700">
              Les locataires confirment leur compréhension et leur accord en apposant 
              leurs initiales ci-dessous:
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Initiales du locataire principal"
                required
                maxLength={5}
                {...register('initiales_locataire1', { required: 'Initiales obligatoires' })}
                placeholder="Ex: SC"
              />
              
              <Input
                label="Initiales du locataire supplémentaire (si applicable)"
                maxLength={5}
                {...register('initiales_locataire2')}
                placeholder="Ex: JD"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mt-4">
              <p className="text-sm text-gray-700">
                <strong>Conséquences importantes:</strong>
              </p>
              <ul className="text-sm text-gray-700 mt-2 ml-4 list-disc space-y-1">
                <li>
                  Chaque locataire peut être tenu de payer la totalité du loyer, 
                  même si les autres ne paient pas
                </li>
                <li>
                  La coopérative peut s'adresser à n'importe lequel des locataires 
                  pour faire exécuter le bail
                </li>
                <li>
                  Si un locataire quitte, les autres restent responsables de tout le bail
                </li>
              </ul>
            </div>
          </div>
        )}

        {!engagementSolidaire && (
          <div className="bg-gray-100 p-4 rounded border border-gray-300">
            <p className="text-sm text-gray-600">
              Les locataires ne s'engagent pas solidairement. Chaque locataire est 
              responsable uniquement de sa propre part des obligations du bail.
            </p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Note légale:</strong> La solidarité entre locataires est courante 
            et légale. Elle protège la coopérative en cas de défaut de paiement d'un 
            des locataires.
          </p>
        </div>
      </form>
    </div>
  );
};
