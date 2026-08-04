'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LocataireInfo } from '@/types/bail';
import { Plus, X } from 'lucide-react';

interface SectionA2FormData {
  locataire_principal: Partial<LocataireInfo>;
  locataires_supplementaires: Partial<LocataireInfo>[];
}

interface SectionA2Props {
  data?: {
    locataire_principal?: Partial<LocataireInfo>;
    locataire_supplementaire?: Partial<LocataireInfo>;
  };
  onSave: (data: Partial<{
    locataire_principal: Partial<LocataireInfo>;
    locataire_supplementaire: Partial<LocataireInfo>;
  }>) => void;
}

const EMPTY_LOCATAIRE: Partial<LocataireInfo> = {
  prenom: '', nom: '', numero: '', rue: '', app: '',
  municipalite: '', code_postal: '', telephone: '',
  telephone_cell: '', courriel: '', represente_par: '',
};

function LocataireFields({
  prefix,
  register,
  errors,
}: {
  prefix: string;
  register: ReturnType<typeof useForm<SectionA2FormData>>['register'];
  errors: Record<string, { message?: string }> | undefined;
}) {
  const field = (name: string) => `${prefix}.${name}` as keyof SectionA2FormData;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prénom"
          required
          {...register(field('prenom') as 'locataire_principal.prenom', { required: 'Obligatoire' })}
          error={(errors as Record<string, { message?: string }>)?.prenom?.message}
        />
        <Input
          label="Nom"
          required
          {...register(field('nom') as 'locataire_principal.nom', { required: 'Obligatoire' })}
          error={(errors as Record<string, { message?: string }>)?.nom?.message}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="No"
          required
          {...register(field('numero') as 'locataire_principal.numero', { required: 'Obligatoire' })}
          error={(errors as Record<string, { message?: string }>)?.numero?.message}
        />
        <div className="col-span-2">
          <Input
            label="Rue"
            required
            {...register(field('rue') as 'locataire_principal.rue', { required: 'Obligatoire' })}
            error={(errors as Record<string, { message?: string }>)?.rue?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Input label="App." {...register(field('app') as 'locataire_principal.app')} />
        <div className="col-span-2">
          <Input
            label="Municipalité"
            required
            {...register(field('municipalite') as 'locataire_principal.municipalite', { required: 'Obligatoire' })}
            error={(errors as Record<string, { message?: string }>)?.municipalite?.message}
          />
        </div>
        <Input
          label="Code postal"
          required
          {...register(field('code_postal') as 'locataire_principal.code_postal', { required: 'Obligatoire' })}
          error={(errors as Record<string, { message?: string }>)?.code_postal?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="No de téléphone"
          required
          type="tel"
          {...register(field('telephone') as 'locataire_principal.telephone', { required: 'Obligatoire' })}
          error={(errors as Record<string, { message?: string }>)?.telephone?.message}
        />
        <Input
          label="Autre no de téléphone (cellulaire)"
          type="tel"
          {...register(field('telephone_cell') as 'locataire_principal.telephone_cell')}
        />
      </div>

      <Input
        label="Adresse de courriel"
        type="email"
        {...register(field('courriel') as 'locataire_principal.courriel')}
      />

      <Input
        label="S'il y a lieu, représenté par"
        {...register(field('represente_par') as 'locataire_principal.represente_par')}
      />
    </div>
  );
}

export const SectionA2: React.FC<SectionA2Props> = ({ data, onSave }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<SectionA2FormData>({
    defaultValues: {
      locataire_principal: data?.locataire_principal ?? EMPTY_LOCATAIRE,
      locataires_supplementaires: data?.locataire_supplementaire
        ? [data.locataire_supplementaire]
        : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'locataires_supplementaires',
  });

  const onSubmit = (formData: SectionA2FormData) => {
    onSave({
      locataire_principal: formData.locataire_principal,
      locataire_supplementaire: formData.locataires_supplementaires[0],
    });
  };

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        A - Identification de la coopérative et du locataire
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        2. Locataire
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Locataire principal */}
        <div className="mb-8">
          <h4 className="font-medium text-gray-900 mb-4">Locataire principal</h4>
          <LocataireFields
            prefix="locataire_principal"
            register={register}
            errors={errors.locataire_principal as Record<string, { message?: string }> | undefined}
          />
        </div>

        {/* Locataires supplémentaires */}
        {fields.map((field, index) => (
          <div key={field.id} className="border-t pt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Locataire supplémentaire</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => remove(index)}
              >
                <X className="w-4 h-4 mr-1" />
                Retirer
              </Button>
            </div>
            <LocataireFields
              prefix={`locataires_supplementaires.${index}`}
              register={register}
              errors={errors.locataires_supplementaires?.[index] as Record<string, { message?: string }> | undefined}
            />
          </div>
        ))}

        {fields.length === 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append(EMPTY_LOCATAIRE)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un locataire supplémentaire
          </Button>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Les noms indiqués dans le bail doivent correspondre
            à ceux que la coopérative et les locataires peuvent légalement utiliser.
          </p>
        </div>
      </form>
    </div>
  );
};
