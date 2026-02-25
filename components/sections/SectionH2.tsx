'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertBox } from '@/components/ui/AlertBox';
import { Plus, X } from 'lucide-react';

interface AutreSignataire {
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  courriel?: string;
  qualite: 'caution' | 'garant' | 'autre';
  qualite_autre?: string;
}

interface SectionH2Props {
  data?: {
    autres_signataires?: AutreSignataire[];
  };
  onSave: (data: any) => void;
}

export const SectionH2: React.FC<SectionH2Props> = ({ data, onSave }) => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      autres_signataires: data?.autres_signataires || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'autres_signataires',
  });

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        H - Solidarité et caution
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        2. Autres signataires
      </h3>

      <AlertBox variant="info">
        <p className="mb-2">
          <strong>Qu'est-ce qu'une caution?</strong>
        </p>
        <p>
          Une caution (ou garant) est une personne qui s'engage à payer le loyer ou à 
          remplir les obligations du bail si le locataire ne le fait pas. La caution 
          signe le bail mais n'habite pas dans le logement.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        {fields.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded border border-gray-300 text-center">
            <p className="text-gray-600 mb-4">
              Aucun autre signataire (caution ou garant) n'a été ajouté pour ce bail.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({
                nom: '',
                prenom: '',
                adresse: '',
                telephone: '',
                courriel: '',
                qualite: 'caution',
                qualite_autre: '',
              })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une caution ou un garant
            </Button>
          </div>
        ) : (
          <>
            {fields.map((field, index) => {
              const qualite = watch(`autres_signataires.${index}.qualite`);
              
              return (
                <div key={field.id} className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">
                      Signataire #{index + 1}
                    </h4>
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

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Prénom"
                        required
                        {...register(`autres_signataires.${index}.prenom`, { required: true })}
                      />
                      <Input
                        label="Nom"
                        required
                        {...register(`autres_signataires.${index}.nom`, { required: true })}
                      />
                    </div>

                    <Input
                      label="Adresse complète"
                      required
                      {...register(`autres_signataires.${index}.adresse`, { required: true })}
                      placeholder="1234 Rue Example, Ville, QC, H1H 1H1"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Téléphone"
                        type="tel"
                        required
                        {...register(`autres_signataires.${index}.telephone`, { required: true })}
                        placeholder="514 XXX-XXXX"
                      />
                      <Input
                        label="Courriel"
                        type="email"
                        {...register(`autres_signataires.${index}.courriel`)}
                        placeholder="garant@email.com"
                      />
                    </div>

                    <div>
                      <label className="label-tal">Qualité du signataire</label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="caution"
                            {...register(`autres_signataires.${index}.qualite`, { required: true })}
                            className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                          />
                          <span>Caution</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="garant"
                            {...register(`autres_signataires.${index}.qualite`, { required: true })}
                            className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                          />
                          <span>Garant</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="autre"
                            {...register(`autres_signataires.${index}.qualite`, { required: true })}
                            className="w-4 h-4 text-tal-blue focus:ring-tal-blue"
                          />
                          <span>Autre</span>
                        </label>
                      </div>
                    </div>

                    {qualite === 'autre' && (
                      <Input
                        label="Précisez la qualité"
                        required
                        {...register(`autres_signataires.${index}.qualite_autre`, { required: true })}
                        placeholder="Ex: Co-signataire, Répondant, etc."
                      />
                    )}
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({
                nom: '',
                prenom: '',
                adresse: '',
                telephone: '',
                courriel: '',
                qualite: 'caution',
                qualite_autre: '',
              })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un autre signataire
            </Button>
          </>
        )}

        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> Les cautions et garants doivent comprendre qu'ils 
            s'engagent à payer le loyer et à respecter toutes les obligations du bail si 
            le locataire ne le fait pas. Ils recevront une copie du bail pour signature.
          </p>
        </div>
      </form>
    </div>
  );
};
