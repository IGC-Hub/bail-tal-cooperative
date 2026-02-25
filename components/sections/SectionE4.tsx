'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { AlertBox } from '@/components/ui/AlertBox';

interface SectionE4Props {
  data?: {
    chauffage?: 'cooperative' | 'locataire';
    electricite_source?: 'gaz' | 'electricite' | 'mazout';
    electricite_autre?: 'cooperative' | 'locataire';
    chauffe_eau_location?: 'cooperative' | 'locataire';
    eau_chaude_utilisation?: 'cooperative' | 'locataire';
    taxe_eau?: 'cooperative' | 'locataire';
    deneigement_stationnement?: 'cooperative' | 'locataire';
    deneigement_balcon?: 'cooperative' | 'locataire';
    deneigement_entree?: 'cooperative' | 'locataire';
    deneigement_escalier?: 'cooperative' | 'locataire';
  };
  onSave: (data: any) => void;
}

export const SectionE4: React.FC<SectionE4Props> = ({ data, onSave }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: data,
  });

  const RadioGroup = ({ name, label }: { name: string; label: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="cooperative"
            {...register(name as any)}
            className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
          />
          <span className="text-sm">Coopérative</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="locataire"
            {...register(name as any)}
            className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
          />
          <span className="text-sm">Locataire</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        E - Services et conditions
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        4. Services, taxes et coûts de consommation
      </h3>

      <AlertBox variant="info">
        <p>
          Indiquez qui, de la coopérative ou du locataire, assume les frais pour 
          chaque service ci-dessous.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        {/* Chauffage */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Chauffage</h4>
          <RadioGroup name="chauffage" label="Coût du chauffage" />
        </div>

        {/* Électricité */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Électricité</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source d'énergie pour le chauffage
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="gaz"
                  {...register('electricite_source')}
                  className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                />
                <span className="text-sm">Gaz naturel</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="electricite"
                  {...register('electricite_source')}
                  className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                />
                <span className="text-sm">Électricité</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="mazout"
                  {...register('electricite_source')}
                  className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                />
                <span className="text-sm">Mazout</span>
              </label>
            </div>
          </div>

          <RadioGroup 
            name="electricite_autre" 
            label="Coût de l'électricité (autre que chauffage)" 
          />
        </div>

        {/* Eau chaude */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Eau chaude</h4>
          <RadioGroup 
            name="chauffe_eau_location" 
            label="Location du chauffe-eau" 
          />
          <RadioGroup 
            name="eau_chaude_utilisation" 
            label="Coût de l'eau chaude (utilisation)" 
          />
        </div>

        {/* Taxe d'eau */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Eau</h4>
          <RadioGroup name="taxe_eau" label="Taxe d'eau potable et d'égout" />
        </div>

        {/* Déneigement */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Déneigement</h4>
          <RadioGroup 
            name="deneigement_stationnement" 
            label="Déneigement du stationnement" 
          />
          <RadioGroup 
            name="deneigement_balcon" 
            label="Déneigement du balcon ou de la galerie" 
          />
          <RadioGroup 
            name="deneigement_entree" 
            label="Déneigement de l'entrée privée" 
          />
          <RadioGroup 
            name="deneigement_escalier" 
            label="Déneigement de l'escalier privé" 
          />
        </div>

        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Les services cochés comme étant à la charge du locataire 
            ne sont pas inclus dans le loyer. Le locataire devra s'abonner directement 
            auprès des fournisseurs.
          </p>
        </div>
      </form>
    </div>
  );
};
