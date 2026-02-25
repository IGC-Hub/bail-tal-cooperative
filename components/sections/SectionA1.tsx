'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { CooperativeInfo } from '@/types/bail';

interface SectionA1Props {
  data?: Partial<CooperativeInfo>;
  onSave: (data: Partial<CooperativeInfo>) => void;
}

export const SectionA1: React.FC<SectionA1Props> = ({ data, onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CooperativeInfo>({
    defaultValues: data,
  });

  const onSubmit = (formData: CooperativeInfo) => {
    onSave(formData);
  };

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        A - Identification de la coopérative et du locataire
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        1. Coopérative
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nom de la coopérative (la coopérative doit utiliser sa désignation légale)"
          required
          {...register('nom', { required: 'Ce champ est obligatoire' })}
          error={errors.nom?.message}
          placeholder="Ex: Coopérative d'habitation Les 2 Écus"
        />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="No"
            required
            {...register('numero', { required: 'Obligatoire' })}
            error={errors.numero?.message}
            placeholder="7040"
          />
          <div className="col-span-2">
            <Input
              label="Rue"
              required
              {...register('rue', { required: 'Obligatoire' })}
              error={errors.rue?.message}
              placeholder="Rue Hutchison"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Input
            label="App."
            {...register('app')}
            placeholder="101"
          />
          <div className="col-span-2">
            <Input
              label="Municipalité"
              required
              {...register('municipalite', { required: 'Obligatoire' })}
              error={errors.municipalite?.message}
              placeholder="Montréal"
            />
          </div>
          <Input
            label="Code postal"
            required
            {...register('code_postal', { 
              required: 'Obligatoire',
              pattern: {
                value: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,
                message: 'Format invalide (ex: H3N 1Y7)'
              }
            })}
            error={errors.code_postal?.message}
            placeholder="H3N 1Y7"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="No de téléphone"
            required
            type="tel"
            {...register('telephone', { required: 'Obligatoire' })}
            error={errors.telephone?.message}
            placeholder="438 393-3400"
          />
          <Input
            label="Autre no de téléphone (cellulaire)"
            type="tel"
            {...register('telephone_cell')}
            placeholder="514 XXX-XXXX"
          />
        </div>

        <Input
          label="Adresse de courriel"
          type="email"
          {...register('courriel')}
          placeholder="info@cooperative.com"
        />

        <Input
          label="Représentée par"
          required
          {...register('representee_par', { required: 'Obligatoire' })}
          error={errors.representee_par?.message}
          placeholder="Nom du représentant ou de la compagnie de gestion"
        />
      </form>
    </div>
  );
};
