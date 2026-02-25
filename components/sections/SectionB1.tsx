'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { LogementInfo } from '@/types/bail';

interface SectionB1Props {
  data?: Partial<LogementInfo>;
  onSave: (data: Partial<LogementInfo>) => void;
}

export const SectionB1: React.FC<SectionB1Props> = ({ data, onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LogementInfo>({
    defaultValues: data,
  });

  const onSubmit = (formData: LogementInfo) => {
    onSave(formData);
  };

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        B - Description du logement loué, des accessoires et des dépendances
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        1. Description du logement
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Adresse du logement</h4>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="No"
              required
              {...register('adresse.numero', { required: 'Obligatoire' })}
              error={errors.adresse?.numero?.message}
              placeholder="6055"
            />
            <div className="col-span-2">
              <Input
                label="Rue"
                required
                {...register('adresse.rue', { required: 'Obligatoire' })}
                error={errors.adresse?.rue?.message}
                placeholder="Rue Villeneuve"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            <Input
              label="App."
              required
              {...register('adresse.app', { required: 'Obligatoire' })}
              error={errors.adresse?.app?.message}
              placeholder="302"
            />
            <div className="col-span-2">
              <Input
                label="Municipalité"
                required
                {...register('adresse.municipalite', { required: 'Obligatoire' })}
                error={errors.adresse?.municipalite?.message}
                placeholder="Montréal-Nord"
              />
            </div>
            <Input
              label="Code postal"
              required
              {...register('adresse.code_postal', { 
                required: 'Obligatoire',
                pattern: {
                  value: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,
                  message: 'Format invalide'
                }
              })}
              error={errors.adresse?.code_postal?.message}
              placeholder="H1G 1M1"
            />
          </div>
        </div>

        <Input
          label="Nombre de pièces"
          type="number"
          required
          {...register('nombre_pieces', { 
            required: 'Obligatoire',
            min: { value: 1, message: 'Minimum 1' }
          })}
          error={errors.nombre_pieces?.message}
          placeholder="4½"
        />

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Stationnement extérieur</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre de places"
              type="number"
              {...register('stationnement_exterieur.nombre')}
              placeholder="0"
            />
            <Input
              label="Emplacement(s)"
              {...register('stationnement_exterieur.emplacements')}
              placeholder="Ex: Place 12"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Stationnement intérieur</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre de places"
              type="number"
              {...register('stationnement_interieur.nombre')}
              placeholder="0"
            />
            <Input
              label="Emplacement(s)"
              {...register('stationnement_interieur.emplacements')}
              placeholder="Ex: Garage #5"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Remise(s) ou espace(s) de rangement</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre de places"
              type="number"
              {...register('remise.nombre')}
              placeholder="0"
            />
            <Input
              label="Emplacement(s)"
              {...register('remise.emplacements')}
              placeholder="Ex: Sous-sol"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <Input
            label="Autres accessoires"
            {...register('autres_accessoires')}
            placeholder="Ex: Buanderie, Balcon, etc."
          />
          <p className="text-sm text-gray-500 mt-1">
            Précisez les autres accessoires ou dépendances (buanderie, balcon, cour, etc.)
          </p>
        </div>
      </form>
    </div>
  );
};
