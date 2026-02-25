'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LocataireInfo } from '@/types/bail';
import { Plus, X } from 'lucide-react';

interface SectionA2Props {
  data?: {
    locataire_principal?: Partial<LocataireInfo>;
    locataire_supplementaire?: Partial<LocataireInfo>;
  };
  onSave: (data: any) => void;
}

export const SectionA2: React.FC<SectionA2Props> = ({ data, onSave }) => {
  const [hasSecondTenant, setHasSecondTenant] = React.useState(!!data?.locataire_supplementaire);
  
  const { register: register1, formState: { errors: errors1 } } = useForm<LocataireInfo>({
    defaultValues: data?.locataire_principal,
  });

  const { register: register2, formState: { errors: errors2 } } = useForm<LocataireInfo>({
    defaultValues: data?.locataire_supplementaire,
  });

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        A - Identification de la coopérative et du locataire
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        2. Locataire
      </h3>

      {/* Locataire principal */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Locataire principal</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              required
              {...register1('prenom', { required: 'Obligatoire' })}
              error={errors1.prenom?.message}
            />
            <Input
              label="Nom"
              required
              {...register1('nom', { required: 'Obligatoire' })}
              error={errors1.nom?.message}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="No"
              required
              {...register1('numero', { required: 'Obligatoire' })}
              error={errors1.numero?.message}
            />
            <div className="col-span-2">
              <Input
                label="Rue"
                required
                {...register1('rue', { required: 'Obligatoire' })}
                error={errors1.rue?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Input
              label="App."
              {...register1('app')}
            />
            <div className="col-span-2">
              <Input
                label="Municipalité"
                required
                {...register1('municipalite', { required: 'Obligatoire' })}
                error={errors1.municipalite?.message}
              />
            </div>
            <Input
              label="Code postal"
              required
              {...register1('code_postal', { required: 'Obligatoire' })}
              error={errors1.code_postal?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="No de téléphone"
              required
              type="tel"
              {...register1('telephone', { required: 'Obligatoire' })}
              error={errors1.telephone?.message}
            />
            <Input
              label="Autre no de téléphone (cellulaire)"
              type="tel"
              {...register1('telephone_cell')}
            />
          </div>

          <Input
            label="Adresse de courriel"
            type="email"
            {...register1('courriel')}
          />

          <Input
            label="S'il y a lieu, représenté par"
            {...register1('represente_par')}
          />
        </div>
      </div>

      {/* Locataire supplémentaire */}
      {hasSecondTenant ? (
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Locataire supplémentaire</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHasSecondTenant(false)}
            >
              <X className="w-4 h-4 mr-1" />
              Retirer
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                {...register2('prenom')}
              />
              <Input
                label="Nom"
                {...register2('nom')}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="No"
                {...register2('numero')}
              />
              <div className="col-span-2">
                <Input
                  label="Rue"
                  {...register2('rue')}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Input
                label="App."
                {...register2('app')}
              />
              <div className="col-span-2">
                <Input
                  label="Municipalité"
                  {...register2('municipalite')}
                />
              </div>
              <Input
                label="Code postal"
                {...register2('code_postal')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="No de téléphone"
                type="tel"
                {...register2('telephone')}
              />
              <Input
                label="Autre no de téléphone (cellulaire)"
                type="tel"
                {...register2('telephone_cell')}
              />
            </div>

            <Input
              label="Adresse de courriel"
              type="email"
              {...register2('courriel')}
            />

            <Input
              label="S'il y a lieu, représenté par"
              {...register2('represente_par')}
            />
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setHasSecondTenant(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un locataire supplémentaire
        </Button>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Les noms indiqués dans le bail doivent correspondre à ceux que la coopérative et les locataires peuvent légalement utiliser.
        </p>
      </div>
    </div>
  );
};
