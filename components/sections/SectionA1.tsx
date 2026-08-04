'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { CooperativeInfo } from '@/types/bail';
import { supabase } from '@/lib/supabase';

interface OrganizationRow {
  id: string;
  code: string;
  name: string;
  legal_name: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  settings: Record<string, unknown> | null;
}

interface SectionA1Props {
  data?: Partial<CooperativeInfo>;
  onSave: (data: Partial<CooperativeInfo>) => void;
}

function parseAddress(address: string | null): { numero: string; rue: string } {
  if (!address) return { numero: '', rue: '' };
  const match = address.match(/^(\S+)\s+(.+)$/);
  if (match) return { numero: match[1], rue: match[2] };
  return { numero: '', rue: address };
}

export const SectionA1: React.FC<SectionA1Props> = ({ data, onSave }) => {
  const [cooperatives, setCooperatives] = useState<OrganizationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CooperativeInfo>({
    defaultValues: data,
  });

  const organisationSelectionnee = watch('organisation_code');

  // Charger les coopératives depuis Supabase
  useEffect(() => {
    async function loadCooperatives() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      try {
        const { data: orgs, error } = await supabase
          .from('organizations')
          .select('id, code, name, legal_name, address, city, postal_code, phone, email, settings')
          .eq('type', 'cooperative')
          .eq('is_active', true)
          .order('code');

        if (error) throw error;
        setCooperatives(orgs ?? []);
      } catch (err) {
        console.error('Erreur chargement coopératives:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCooperatives();
  }, []);

  // Auto-remplissage quand une coopérative est sélectionnée
  useEffect(() => {
    if (!organisationSelectionnee) return;
    const coop = cooperatives.find(c => c.code === organisationSelectionnee);
    if (!coop) return;

    const { numero, rue } = parseAddress(coop.address);
    setValue('nom', coop.legal_name ?? coop.name);
    setValue('numero', numero);
    setValue('rue', rue);
    setValue('ville', coop.city ?? '');
    setValue('province', 'QC');
    setValue('code_postal', coop.postal_code ?? '');

    // Charger le gestionnaire depuis les settings de l'organisation si disponible
    const settings = coop.settings as Record<string, string> | null;
    if (settings?.gestionnaire_nom) {
      setValue('mandataire_organisme', settings.gestionnaire_nom);
      setValue('mandataire_numero', settings.gestionnaire_numero ?? '');
      setValue('mandataire_rue', settings.gestionnaire_rue ?? '');
      setValue('mandataire_ville', settings.gestionnaire_ville ?? '');
      setValue('mandataire_province', settings.gestionnaire_province ?? 'QC');
      setValue('mandataire_code_postal', settings.gestionnaire_code_postal ?? '');
      setValue('mandataire_telephone', settings.gestionnaire_telephone ?? '');
      setValue('mandataire_courriel', settings.gestionnaire_courriel ?? '');
      setValue('signataire_prenom', settings.signataire_prenom ?? '');
      setValue('signataire_nom', settings.signataire_nom ?? '');
      setValue('signataire_qualite', settings.signataire_qualite ?? '');
    }
  }, [organisationSelectionnee, cooperatives, setValue]);

  // Pré-remplir le gestionnaire par défaut si pas encore rempli
  useEffect(() => {
    if (cooperatives.length > 0 && !organisationSelectionnee) return;
    // Le gestionnaire sera chargé depuis les settings de l'organisation
  }, [cooperatives, organisationSelectionnee]);

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
        {/* Sélection de la coopérative */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Sélectionner la coopérative <span className="text-red-500">*</span>
          </label>
          {isLoading ? (
            <p className="text-sm text-gray-500 py-2">Chargement des coopératives...</p>
          ) : (
            <select
              {...register('organisation_code', { required: 'Veuillez sélectionner une coopérative' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tal-blue text-base"
            >
              <option value="">-- Sélectionner une coopérative --</option>
              {cooperatives.map(coop => (
                <option key={coop.code} value={coop.code}>
                  {coop.code} - {coop.legal_name ?? coop.name}
                </option>
              ))}
            </select>
          )}
          {errors.organisation_code && (
            <p className="text-red-500 text-sm mt-1">{errors.organisation_code.message}</p>
          )}
        </div>

        {/* Nom de la coopérative (auto-rempli) */}
        <Input
          label="Nom de la coopérative (désignation légale)"
          required
          {...register('nom', { required: 'Ce champ est obligatoire' })}
          error={errors.nom?.message}
          placeholder="Sélectionnez d'abord une coopérative"
          readOnly
          className="bg-gray-50"
        />

        {/* Adresse de la coopérative (auto-remplie) */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="No"
            required
            {...register('numero', { required: 'Obligatoire' })}
            error={errors.numero?.message}
            readOnly
            className="bg-gray-50"
          />
          <div className="col-span-2">
            <Input
              label="Rue"
              required
              {...register('rue', { required: 'Obligatoire' })}
              error={errors.rue?.message}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Ville"
            required
            {...register('ville', { required: 'Obligatoire' })}
            error={errors.ville?.message}
            readOnly
            className="bg-gray-50"
          />
          <Input
            label="Province"
            required
            {...register('province', { required: 'Obligatoire' })}
            error={errors.province?.message}
            readOnly
            className="bg-gray-50"
          />
          <Input
            label="Code postal"
            required
            {...register('code_postal', { required: 'Obligatoire' })}
            error={errors.code_postal?.message}
            readOnly
            className="bg-gray-50"
          />
        </div>

        {/* Gestionnaire / Mandataire */}
        <div className="border-t pt-6 mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Gestionnaire / Mandataire
          </h4>

          <Input
            label="Nom de l'organisme gestionnaire"
            required
            {...register('mandataire_organisme')}
            readOnly
            className="bg-gray-50"
          />

          <div className="grid grid-cols-3 gap-4 mt-4">
            <Input
              label="No"
              {...register('mandataire_numero')}
              readOnly
              className="bg-gray-50"
            />
            <div className="col-span-2">
              <Input
                label="Rue"
                {...register('mandataire_rue')}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <Input
              label="Ville"
              {...register('mandataire_ville')}
              readOnly
              className="bg-gray-50"
            />
            <Input
              label="Province"
              {...register('mandataire_province')}
              readOnly
              className="bg-gray-50"
            />
            <Input
              label="Code postal"
              {...register('mandataire_code_postal')}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Téléphone"
              {...register('mandataire_telephone')}
              readOnly
              className="bg-gray-50"
            />
            <Input
              label="Courriel"
              {...register('mandataire_courriel')}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Signataire du bail */}
        <div className="border-t pt-6 mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Signataire du bail pour la coopérative
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              required
              {...register('signataire_prenom', { required: 'Obligatoire' })}
              error={errors.signataire_prenom?.message}
              readOnly
              className="bg-gray-50"
            />
            <Input
              label="Nom"
              required
              {...register('signataire_nom', { required: 'Obligatoire' })}
              error={errors.signataire_nom?.message}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <Input
            label="Qualité / Titre"
            required
            {...register('signataire_qualite', { required: 'Obligatoire' })}
            error={errors.signataire_qualite?.message}
            readOnly
            className="bg-gray-50 mt-4"
          />
        </div>
      </form>
    </div>
  );
};
