'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/Sidebar';
import { NavigationBar } from '@/components/NavigationBar';
import { useBailForm } from '@/hooks/useBailForm';
import { BailFormData } from '@/types/bail';

// Chargement dynamique des sections — réduit le First Load JS
// Seule la section visible est chargée dans le bundle
const IntroductionSection = dynamic(() => import('@/components/sections/IntroductionSection').then(m => ({ default: m.IntroductionSection })));
const SectionA1 = dynamic(() => import('@/components/sections/SectionA1').then(m => ({ default: m.SectionA1 })));
const SectionA2 = dynamic(() => import('@/components/sections/SectionA2').then(m => ({ default: m.SectionA2 })));
const SectionB1 = dynamic(() => import('@/components/sections/SectionB1').then(m => ({ default: m.SectionB1 })));
const SectionB2 = dynamic(() => import('@/components/sections/SectionB2').then(m => ({ default: m.SectionB2 })));
const SectionB3 = dynamic(() => import('@/components/sections/SectionB3').then(m => ({ default: m.SectionB3 })));
const SectionC = dynamic(() => import('@/components/sections/SectionC').then(m => ({ default: m.SectionC })));
const SectionD1 = dynamic(() => import('@/components/sections/SectionD1').then(m => ({ default: m.SectionD1 })));
const SectionD2 = dynamic(() => import('@/components/sections/SectionD2').then(m => ({ default: m.SectionD2 })));
const SectionE1 = dynamic(() => import('@/components/sections/SectionE1').then(m => ({ default: m.SectionE1 })));
const SectionE2 = dynamic(() => import('@/components/sections/SectionE2').then(m => ({ default: m.SectionE2 })));
const SectionE3 = dynamic(() => import('@/components/sections/SectionE3').then(m => ({ default: m.SectionE3 })));
const SectionE4 = dynamic(() => import('@/components/sections/SectionE4').then(m => ({ default: m.SectionE4 })));
const SectionE5 = dynamic(() => import('@/components/sections/SectionE5').then(m => ({ default: m.SectionE5 })));
const SectionE6 = dynamic(() => import('@/components/sections/SectionE6').then(m => ({ default: m.SectionE6 })));
const SectionF = dynamic(() => import('@/components/sections/SectionF').then(m => ({ default: m.SectionF })));
const SectionH1 = dynamic(() => import('@/components/sections/SectionH1').then(m => ({ default: m.SectionH1 })));
const SectionH2 = dynamic(() => import('@/components/sections/SectionH2').then(m => ({ default: m.SectionH2 })));
const MentionsLegalesSection = dynamic(() => import('@/components/sections/MentionsLegalesSection').then(m => ({ default: m.MentionsLegalesSection })));
const SectionRecapitulatif = dynamic(() => import('@/components/sections/SectionRecapitulatif').then(m => ({ default: m.SectionRecapitulatif })));
const SectionG = dynamic(() => import('@/components/sections/SectionG').then(m => ({ default: m.SectionG })));
const SectionPDF = dynamic(() => import('@/components/sections/SectionPDF').then(m => ({ default: m.SectionPDF })));

type SectionRenderer = (
  data: Partial<BailFormData>,
  update: (d: Partial<BailFormData>) => void,
) => React.ReactNode;

function buildSectionMap(): Record<string, SectionRenderer> {
  return {
    'intro-1': () => <IntroductionSection />,

    'a-1': (data, update) => (
      <SectionA1
        data={data.cooperative}
        onSave={(d) => update({ cooperative: d })}
      />
    ),
    'a-2': (data, update) => (
      <SectionA2
        data={{
          locataire_principal: data.locataire_principal,
          locataire_supplementaire: data.locataire_supplementaire,
        }}
        onSave={(d) => update(d)}
      />
    ),

    'b-1': (data, update) => (
      <SectionB1 data={data.logement} onSave={(d) => update({ logement: d })} />
    ),
    'b-2': (data, update) => (
      <SectionB2 data={data.logement} onSave={(d) => update({ logement: d })} />
    ),
    'b-3': (data, update) => (
      <SectionB3 data={data.logement} onSave={(d) => update({ logement: d })} />
    ),

    'c-1': (data, update) => (
      <SectionC data={data.duree} onSave={(d) => update({ duree: d })} />
    ),

    'd-1': (data, update) => (
      <SectionD1 data={data.loyer} onSave={(d) => update({ loyer: d })} />
    ),
    'd-2': (data, update) => (
      <SectionD2
        data={data.loyer?.paiement}
        onSave={(d) => update({ loyer: { ...data.loyer, paiement: d } })}
      />
    ),

    'e-1': (data, update) => (
      <SectionE1
        data={data.services?.reglement_immeuble}
        onSave={(d) => update({ services: { ...data.services, reglement_immeuble: d } })}
      />
    ),
    'e-2': (data, update) => (
      <SectionE2
        data={data.services?.travaux_reparations}
        onSave={(d) => update({ services: { ...data.services, travaux_reparations: d } })}
      />
    ),
    'e-3': (data, update) => (
      <SectionE3
        data={data.services?.service_concierge}
        onSave={(d) => update({ services: { ...data.services, service_concierge: d } })}
      />
    ),
    'e-4': (data, update) => (
      <SectionE4
        data={data.services?.services_taxes}
        onSave={(d) => update({ services: { ...data.services, services_taxes: d } })}
      />
    ),
    'e-5': (data, update) => (
      <SectionE5
        data={data.services?.conditions}
        onSave={(d) => update({ services: { ...data.services, conditions: d } })}
      />
    ),
    'e-6': (data, update) => (
      <SectionE6
        data={{ autres_services: data.services?.autres_services }}
        onSave={(d) => update({ services: { ...data.services, ...d } })}
      />
    ),

    'f-1': (data, update) => (
      <SectionF data={data.restrictions} onSave={(d) => update({ restrictions: d })} />
    ),

    'h-1': (data, update) => (
      <SectionH1 data={data.solidarite} onSave={(d) => update({ solidarite: d })} />
    ),
    'h-2': (data, update) => (
      <SectionH2
        data={{ autres_signataires: data.solidarite?.autres_signataires }}
        onSave={(d) => update({ solidarite: { ...data.solidarite, ...d } })}
      />
    ),

    'mentions-1': () => <MentionsLegalesSection />,

    'recap-1': (data) => <SectionRecapitulatif data={data} />,

    'g-1': (data, update) => {
      const coopSig = [data.cooperative?.signataire_prenom, data.cooperative?.signataire_nom].filter(Boolean).join(' ');
      const loc1 = [data.locataire_principal?.prenom, data.locataire_principal?.nom].filter(Boolean).join(' ');
      const loc2 = data.locataire_supplementaire?.nom
        ? [data.locataire_supplementaire.prenom, data.locataire_supplementaire.nom].filter(Boolean).join(' ')
        : undefined;
      return (
        <SectionG
          data={data.signatures}
          cooperativeSignataire={coopSig}
          locatairePrincipal={loc1}
          locataireSupplementaire={loc2}
          onSave={(d) => update({ signatures: { ...data.signatures, ...d } })}
        />
      );
    },

    'pdf-1': (data, update) => (
      <SectionPDF
        data={data}
        onSave={(d) => update({ finalisation: { ...data.finalisation, ...d } })}
      />
    ),
  };
}

export default function BailFormPage() {
  const {
    formState,
    completedSections,
    isSaving,
    authError,
    updateFormData,
    saveFormData,
    navigateToSection,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
  } = useBailForm();

  // Mémoiser le SECTION_MAP pour éviter de recréer les fonctions à chaque render
  const sectionMap = useMemo(() => buildSectionMap(), []);

  const renderCurrentSection = () => {
    const renderer = sectionMap[formState.currentSubsection];

    if (renderer) {
      return renderer(formState.data, updateFormData);
    }

    return (
      <div className="section-card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Section en développement
        </h2>
        <p className="text-gray-600">
          Cette section sera disponible prochainement.
        </p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentSection={formState.currentSection}
        currentSubsection={formState.currentSubsection}
        onNavigate={navigateToSection}
        completedSections={completedSections}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-tal-blue text-white px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">
              Bail d&apos;un logement dans une coopérative
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              Formulaire obligatoire du Tribunal administratif du logement
            </p>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {authError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {authError}
              </div>
            )}
            {renderCurrentSection()}
          </div>
        </main>

        <NavigationBar
          onPrevious={goToPrevious}
          onNext={goToNext}
          onSave={saveFormData}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          isSaving={isSaving}
          lastSaved={formState.lastSaved}
        />
      </div>
    </div>
  );
}
