'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { AlertBox } from '@/components/ui/AlertBox';

interface SectionE2Props {
  data?: {
    travaux_avant_delivrance?: string;
    travaux_en_cours_bail?: string;
  };
  onSave: (data: any) => void;
}

export const SectionE2: React.FC<SectionE2Props> = ({ data, onSave }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: data,
  });

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        E - Services et conditions
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        2. Travaux et réparations
      </h3>

      <AlertBox variant="info">
        <p className="mb-2">
          Les travaux et réparations, ainsi que les améliorations ou transformations 
          à effectuer, doivent être indiqués ci-dessous.
        </p>
        <p>
          La coopérative doit délivrer le logement en bon état d'habitabilité et le 
          maintenir ainsi pendant toute la durée du bail.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 mt-6">
        <div>
          <label className="label-tal">
            Travaux avant la délivrance du logement
          </label>
          <textarea
            {...register('travaux_avant_delivrance')}
            rows={5}
            className="input-tal"
            placeholder="Décrivez les travaux qui seront effectués AVANT la remise des clés...
            
Ex:
- Peinture de la cuisine (blanc)
- Remplacement du plancher de la salle de bain
- Installation d'un nouveau chauffe-eau"
          />
          <p className="text-sm text-gray-500 mt-1">
            Travaux que la coopérative s'engage à effectuer avant que le locataire prenne possession du logement
          </p>
        </div>

        <div className="border-t pt-6">
          <label className="label-tal">
            Travaux en cours de bail
          </label>
          <textarea
            {...register('travaux_en_cours_bail')}
            rows={5}
            className="input-tal"
            placeholder="Décrivez les travaux qui seront effectués PENDANT le bail...
            
Ex:
- Remplacement des fenêtres du salon (été 2026)
- Rénovation de la salle de bain (automne 2026)
- Isolation du grenier"
          />
          <p className="text-sm text-gray-500 mt-1">
            Travaux prévus pendant la durée du bail (avec dates estimées si possible)
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> Si aucun travaux n'est prévu, vous pouvez laisser 
            ces champs vides. Les travaux indiqués ici font partie des obligations de la coopérative.
          </p>
        </div>
      </form>
    </div>
  );
};
