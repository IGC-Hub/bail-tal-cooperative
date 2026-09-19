'use client';

import React, { useState, useCallback } from 'react';
import { AlertBox } from '@/components/ui/AlertBox';
import { Button } from '@/components/ui/Button';
import { BailFormData, FinalisationInfo } from '@/types/bail';
import { supabase } from '@/lib/supabase';
import { FileText, Download, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const signaturesCompletes =
    data.signatures?.signature_coop_accepte &&
    data.signatures?.signature_locataire1_accepte;

  const leaseId = data.metadata?.lease_id;

  const handleGenerate = useCallback(async () => {
    if (!signaturesCompletes || !supabase || !leaseId) return;

    setStatus('generating');
    setErrorMessage('');

    try {
      // Sauvegarder les données actuelles avant génération
      await supabase
        .from('leases')
        .update({ bail_tal_data: data })
        .eq('id', leaseId);

      // Obtenir le token d'auth pour l'Edge Function
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      // Appeler l'Edge Function
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-bail-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ lease_id: leaseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const result = await response.json();

      setPdfUrl(result.pdf_url);
      onSave({
        pdf_genere: true,
        pdf_date_generation: result.generated_at,
        pdf_url: result.pdf_url,
      });

      setStatus('success');
    } catch (err) {
      console.error('Erreur lors de la génération:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la génération. Veuillez réessayer.'
      );
      setStatus('error');
    }
  }, [data, leaseId, onSave, signaturesCompletes]);

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
            générer le bail officiel au format PDF.
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
                  Cette action finalisera le bail, générera un PDF conforme
                  et le stockera de façon permanente. Les données ne pourront
                  plus être modifiées après la génération.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={!signaturesCompletes}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Générer le bail PDF
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
                  Le bail est en cours de génération au format PDF.
                  Veuillez patienter.
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
                  Le bail a été finalisé et le PDF est disponible.
                  {data.finalisation?.pdf_date_generation && (
                    <> Généré le {new Date(data.finalisation.pdf_date_generation).toLocaleDateString('fr-CA')}.</>
                  )}
                </p>
                <div className="flex gap-4 justify-center pt-2">
                  {(pdfUrl || data.finalisation?.pdf_url) && (
                    <a
                      href={pdfUrl || data.finalisation?.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-tal-blue text-white rounded-md hover:bg-tal-blue-dark transition"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le PDF
                    </a>
                  )}
                  {(pdfUrl || data.finalisation?.pdf_url) && (
                    <a
                      href={pdfUrl || data.finalisation?.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ouvrir dans un nouvel onglet
                    </a>
                  )}
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
