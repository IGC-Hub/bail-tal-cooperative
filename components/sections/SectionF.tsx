'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { AlertBox } from '@/components/ui/AlertBox';

interface SectionFProps {
  data?: {
    situation?: 'membre' | 'non_membre' | null;
    immeuble_recent?: boolean;
    immeuble_pret_date?: string;
    changement_affectation?: boolean;
    changement_date?: string;
    loyer_maximal?: number;
  };
  onSave: (data: any) => void;
}

export const SectionF: React.FC<SectionFProps> = ({ data, onSave }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: data,
  });

  const situation = watch('situation');
  const immeuble = watch('immeuble_recent');
  const changement = watch('changement_affectation');

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        F - Restrictions au droit à la fixation du loyer et à la modification du bail
      </h2>

      <AlertBox variant="info">
        <p>
          Les membres d'une coopérative d'habitation ne peuvent pas demander une fixation 
          de loyer au Tribunal administratif du logement. Cette section permet d'identifier 
          si le locataire est membre ou non-membre de la coopérative.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-900">Situation du locataire</h3>
          
          <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition">
            <input
              type="radio"
              value="membre"
              {...register('situation', { required: 'Sélectionnez une option' })}
              className="w-5 h-5 mt-1 text-tal-blue focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Membre de la coopérative</div>
              <p className="text-sm text-gray-600 mt-1">
                Le locataire est membre de la coopérative et participe à sa gestion
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition">
            <input
              type="radio"
              value="non_membre"
              {...register('situation', { required: 'Sélectionnez une option' })}
              className="w-5 h-5 mt-1 text-tal-blue focus:ring-tal-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Non-membre de la coopérative</div>
              <p className="text-sm text-gray-600 mt-1">
                Le locataire n'est pas membre de la coopérative (locataire externe)
              </p>
            </div>
          </label>

          {errors.situation && (
            <p className="text-sm text-red-600">{errors.situation.message}</p>
          )}
        </div>

        {situation === 'non_membre' && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-6">
            <AlertBox variant="warning">
              <p>
                <strong>Important pour les non-membres:</strong> Dans certains cas, 
                des restrictions s'appliquent au droit de demander une fixation de loyer.
              </p>
            </AlertBox>

            {/* Immeuble récent */}
            <div className="border-t pt-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('immeuble_recent')}
                  className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    L'immeuble est neuf ou presque neuf
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    L'immeuble a été construit ou mis en service pour la première fois depuis 
                    moins de 5 ans
                  </p>
                </div>
              </label>

              {immeuble && (
                <div className="mt-4 ml-8">
                  <Input
                    label="Date de mise en service du logement"
                    type="date"
                    required
                    {...register('immeuble_pret_date', { required: 'Date obligatoire' })}
                    error={errors.immeuble_pret_date?.message}
                  />
                </div>
              )}
            </div>

            {/* Changement d'affectation */}
            <div className="border-t pt-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('changement_affectation')}
                  className="w-5 h-5 mt-1 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    Changement d'affectation récent
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    L'immeuble a fait l'objet d'un changement d'affectation depuis moins de 5 ans 
                    (ex: conversion de bureaux en logements)
                  </p>
                </div>
              </label>

              {changement && (
                <div className="mt-4 ml-8">
                  <Input
                    label="Date du changement d'affectation"
                    type="date"
                    required
                    {...register('changement_date', { required: 'Date obligatoire' })}
                    error={errors.changement_date?.message}
                  />
                </div>
              )}
            </div>

            {/* Loyer maximal */}
            {(immeuble || changement) && (
              <div className="border-t pt-4">
                <Input
                  label="Loyer maximal (si applicable)"
                  type="number"
                  step="0.01"
                  {...register('loyer_maximal')}
                  placeholder="929.00"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Si un loyer maximal a été fixé par règlement, indiquez-le ici
                </p>
              </div>
            )}
          </div>
        )}

        {situation === 'membre' && (
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> En tant que membre de la coopérative, le locataire 
              participe aux décisions de la coopérative, incluant la fixation des loyers. 
              Il ne peut donc pas demander une fixation de loyer au Tribunal.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
