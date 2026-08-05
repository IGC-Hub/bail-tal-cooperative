'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { AlertBox } from '@/components/ui/AlertBox';
import { SignaturesInfo } from '@/types/bail';

interface SectionGProps {
  data?: Partial<SignaturesInfo>;
  cooperativeSignataire?: string;
  locatairePrincipal?: string;
  locataireSupplementaire?: string;
  onSave: (data: Partial<SignaturesInfo>) => void;
}

export const SectionG: React.FC<SectionGProps> = ({
  data,
  cooperativeSignataire,
  locatairePrincipal,
  locataireSupplementaire,
  onSave,
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignaturesInfo>({
    defaultValues: {
      signature_coop_nom: cooperativeSignataire ?? data?.signature_coop_nom,
      signature_coop_qualite: data?.signature_coop_qualite ?? 'Gestionnaire',
      signature_coop_date: data?.signature_coop_date ?? new Date().toISOString().split('T')[0],
      signature_coop_lieu: data?.signature_coop_lieu ?? 'Montréal',
      signature_locataire1_nom: locatairePrincipal ?? data?.signature_locataire1_nom,
      signature_locataire1_date: data?.signature_locataire1_date ?? new Date().toISOString().split('T')[0],
      signature_locataire1_lieu: data?.signature_locataire1_lieu ?? 'Montréal',
      signature_locataire2_nom: locataireSupplementaire ?? data?.signature_locataire2_nom,
      signature_locataire2_date: data?.signature_locataire2_date,
      signature_locataire2_lieu: data?.signature_locataire2_lieu,
      ...data,
    },
  });

  const coopAccepte = watch('signature_coop_accepte');
  const loc1Accepte = watch('signature_locataire1_accepte');
  const hasLoc2 = !!locataireSupplementaire;

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        G - Signatures
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        Signatures des parties au bail
      </h3>

      <AlertBox variant="info">
        <p>
          Le bail doit être signé par le représentant de la coopérative et par
          le ou les locataires. Chaque partie reçoit un exemplaire du bail signé.
          Conformément à l'article 1895 du Code civil du Québec, le bail est
          formé lorsque les parties signent.
        </p>
      </AlertBox>

      <form onSubmit={handleSubmit(onSave)} className="space-y-8 mt-6">
        {/* Signature du locateur (coopérative) */}
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">
            Signature du locateur (coopérative)
          </h4>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nom du signataire"
                required
                readOnly
                className="bg-gray-50"
                error={errors.signature_coop_nom?.message}
                {...register('signature_coop_nom', { required: 'Obligatoire' })}
              />
              <Input
                label="Qualité"
                required
                readOnly
                className="bg-gray-50"
                error={errors.signature_coop_qualite?.message}
                {...register('signature_coop_qualite', { required: 'Obligatoire' })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date de signature"
                type="date"
                required
                error={errors.signature_coop_date?.message}
                {...register('signature_coop_date', { required: 'Date obligatoire' })}
              />
              <Input
                label="Lieu de signature"
                required
                error={errors.signature_coop_lieu?.message}
                {...register('signature_coop_lieu', { required: 'Lieu obligatoire' })}
              />
            </div>

            <div className="bg-white p-4 rounded border border-blue-200">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('signature_coop_accepte', { required: 'Vous devez accepter pour signer' })}
                  className="w-5 h-5 mt-0.5 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
                />
                <span className="text-sm text-gray-900">
                  <strong>Je, soussigné(e), représentant(e) autorisé(e) de la coopérative,
                  confirme avoir lu et accepté l'ensemble des termes et conditions
                  de ce bail.</strong>
                </span>
              </label>
              {errors.signature_coop_accepte && (
                <p className="text-red-500 text-sm mt-2">{errors.signature_coop_accepte.message}</p>
              )}
            </div>

            {coopAccepte && (
              <div className="text-center py-3 bg-green-50 rounded border border-green-200">
                <p className="text-green-700 font-medium">Signé par la coopérative</p>
              </div>
            )}
          </div>
        </div>

        {/* Signature du locataire principal */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">
            Signature du locataire principal
          </h4>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nom du locataire"
                required
                readOnly
                className="bg-white"
                error={errors.signature_locataire1_nom?.message}
                {...register('signature_locataire1_nom', { required: 'Obligatoire' })}
              />
              <Input
                label="Date de signature"
                type="date"
                required
                error={errors.signature_locataire1_date?.message}
                {...register('signature_locataire1_date', { required: 'Date obligatoire' })}
              />
            </div>

            <Input
              label="Lieu de signature"
              required
              error={errors.signature_locataire1_lieu?.message}
              {...register('signature_locataire1_lieu', { required: 'Lieu obligatoire' })}
            />

            <div className="bg-white p-4 rounded border border-gray-300">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('signature_locataire1_accepte', { required: 'Le locataire doit accepter' })}
                  className="w-5 h-5 mt-0.5 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
                />
                <span className="text-sm text-gray-900">
                  <strong>Je, soussigné(e), locataire, confirme avoir lu et accepté
                  l'ensemble des termes et conditions de ce bail, y compris
                  le règlement de l'immeuble s'il y a lieu.</strong>
                </span>
              </label>
              {errors.signature_locataire1_accepte && (
                <p className="text-red-500 text-sm mt-2">{errors.signature_locataire1_accepte.message}</p>
              )}
            </div>

            {loc1Accepte && (
              <div className="text-center py-3 bg-green-50 rounded border border-green-200">
                <p className="text-green-700 font-medium">Signé par le locataire principal</p>
              </div>
            )}
          </div>
        </div>

        {/* Signature du locataire supplémentaire (si applicable) */}
        {hasLoc2 && (
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">
              Signature du locataire supplémentaire
            </h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nom du locataire"
                  required
                  readOnly
                  className="bg-white"
                  {...register('signature_locataire2_nom')}
                />
                <Input
                  label="Date de signature"
                  type="date"
                  {...register('signature_locataire2_date')}
                />
              </div>
              <Input
                label="Lieu de signature"
                {...register('signature_locataire2_lieu')}
              />
              <div className="bg-white p-4 rounded border border-gray-300">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('signature_locataire2_accepte')}
                    className="w-5 h-5 mt-0.5 text-tal-blue border-gray-300 rounded focus:ring-tal-blue"
                  />
                  <span className="text-sm text-gray-900">
                    <strong>Je, soussigné(e), locataire, confirme avoir lu et accepté
                    l'ensemble des termes et conditions de ce bail.</strong>
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Avertissement légal */}
        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
          <p className="text-sm text-gray-700">
            <strong>Important :</strong> Conformément à l'article 1895 du Code civil
            du Québec, le bail est conclu pour la durée fixée. Le locataire et le
            locateur sont liés par les obligations du bail dès sa signature.
            Chaque partie a droit à un exemplaire du bail.
          </p>
        </div>
      </form>
    </div>
  );
};
