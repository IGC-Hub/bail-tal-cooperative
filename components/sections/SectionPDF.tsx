'use client';

import React, { useState, useCallback } from 'react';
import { AlertBox } from '@/components/ui/AlertBox';
import { Button } from '@/components/ui/Button';
import { BailFormData, FinalisationInfo } from '@/types/bail';
import { supabase } from '@/lib/supabase';
import { FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';

interface SectionPDFProps {
  data: Partial<BailFormData>;
  onSave: (data: Partial<FinalisationInfo>) => void;
}

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

export const SectionPDF: React.FC<SectionPDFProps> = ({ data, onSave }) => {
  const [status, setStatus] = useState<GenerationStatus>(
    data.finalisation?.pdf_genere ? 'success' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');

  const signaturesCompletes =
    data.signatures?.signature_coop_accepte &&
    data.signatures?.signature_locataire1_accepte;

  const leaseId = data.metadata?.lease_id;

  const handleGenerate = useCallback(async () => {
    if (!signaturesCompletes) return;

    setStatus('generating');
    setErrorMessage('');

    try {
      // Marquer le bail comme complété dans Supabase
      if (supabase && leaseId) {
        const { error } = await supabase
          .from('leases')
          .update({
            bail_tal_data: data,
            bail_tal_statut: 'complete',
            bail_tal_genere: true,
            bail_tal_date_generation: new Date().toISOString(),
          })
          .eq('id', leaseId);

        if (error) throw error;
      }

      // Mettre à jour l'état local
      onSave({
        pdf_genere: true,
        pdf_date_generation: new Date().toISOString(),
      });

      setStatus('success');
    } catch (err) {
      console.error('Erreur lors de la génération:', err);
      setErrorMessage('Une erreur est survenue lors de la génération. Veuillez réessayer.');
      setStatus('error');
    }
  }, [data, leaseId, onSave, signaturesCompletes]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="section-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Génération du bail
      </h2>
      <h3 className="text-lg font-semibold text-tal-blue mb-6">
        Finalisation et téléchargement
      </h3>

      {/* Vérification des prérequis */}
      {!signaturesCompletes && (
        <AlertBox variant="warning">
          <p>
            <strong>Signatures requises :</strong> Le bail doit être signé par
            la coopérative et le locataire principal avant de pouvoir être
            généré. Retournez à la section Signatures (G) pour compléter
            les signatures.
          </p>
        </AlertBox>
      )}

      {signaturesCompletes && status === 'idle' && (
        <AlertBox variant="info">
          <p>
            Toutes les signatures ont été recueillies. Vous pouvez maintenant
            générer le bail officiel.
          </p>
        </AlertBox>
      )}

      <div className="mt-6 space-y-6">
        {/* Résumé des signatures */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">État des signatures</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {data.signatures?.signature_coop_accepte ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-sm">
                Coopérative : {data.signatures?.signature_coop_nom ?? 'Non signé'}
                {data.signatures?.signature_coop_date && ` — ${data.signatures.signature_coop_date}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {data.signatures?.signature_locataire1_accepte ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-sm">
                Locataire principal : {data.signatures?.signature_locataire1_nom ?? 'Non signé'}
                {data.signatures?.signature_locataire1_date && ` — ${data.signatures.signature_locataire1_date}`}
              </span>
            </div>
            {data.locataire_supplementaire?.nom && (
              <div className="flex items-center gap-3">
                {data.signatures?.signature_locataire2_accepte ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
                <span className="text-sm">
                  Locataire supplémentaire : {data.signatures?.signature_locataire2_nom ?? 'Non signé'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="bg-white p-6 rounded-lg border-2 border-tal-blue">
          <div className="text-center space-y-4">
            {status === 'idle' && (
              <>
                <FileText className="w-16 h-16 text-tal-blue mx-auto" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Générer le bail officiel
                </h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Cette action finalisera le bail et le marquera comme complété.
                  Les données ne pourront plus être modifiées après la génération.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={!signaturesCompletes}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Générer le bail
                </Button>
              </>
            )}

            {status === 'generating' && (
              <>
                <div className="w-16 h-16 border-4 border-tal-blue border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Génération en cours...
                </h4>
                <p className="text-sm text-gray-600">
                  Veuillez patienter pendant la génération du bail.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <h4 className="text-lg font-semibold text-green-700">
                  Bail généré avec succès
                </h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Le bail a été finalisé et marqué comme complété.
                  {data.finalisation?.pdf_date_generation && (
                    <> Généré le {new Date(data.finalisation.pdf_date_generation).toLocaleDateString('fr-CA')}.</>
                  )}
                </p>
                <div className="flex gap-4 justify-center pt-2">
                  <Button type="button" variant="primary" onClick={handlePrint}>
                    <Download className="w-4 h-4 mr-2" />
                    Imprimer / Sauvegarder en PDF
                  </Button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
                <h4 className="text-lg font-semibold text-red-700">
                  Erreur de génération
                </h4>
                <p className="text-sm text-red-600">{errorMessage}</p>
                <Button type="button" variant="primary" onClick={handleGenerate}>
                  Réessayer
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Note légale */}
        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
          <p className="text-sm text-gray-700">
            <strong>Conformité :</strong> Ce bail est conforme au formulaire
            obligatoire du Tribunal administratif du logement du Québec.
            Chaque partie (coopérative et locataire) doit conserver un
            exemplaire signé du bail.
          </p>
        </div>
      </div>
    </div>
  );
};
