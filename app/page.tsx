'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { NavigationBar } from '@/components/NavigationBar';
import { IntroductionSection } from '@/components/sections/IntroductionSection';
import { SectionA1 } from '@/components/sections/SectionA1';
import { SectionA2 } from '@/components/sections/SectionA2';
import { SectionB1 } from '@/components/sections/SectionB1';
import { SectionB2 } from '@/components/sections/SectionB2';
import { SectionB3 } from '@/components/sections/SectionB3';
import { SectionC } from '@/components/sections/SectionC';
import { SectionD1 } from '@/components/sections/SectionD1';
import { SectionD2 } from '@/components/sections/SectionD2';
import { SectionE1 } from '@/components/sections/SectionE1';
import { SectionE2 } from '@/components/sections/SectionE2';
import { SectionE3 } from '@/components/sections/SectionE3';
import { SectionE4 } from '@/components/sections/SectionE4';
import { SectionE5 } from '@/components/sections/SectionE5';
import { SectionE6 } from '@/components/sections/SectionE6';
import { SectionF } from '@/components/sections/SectionF';
import { SectionH1 } from '@/components/sections/SectionH1';
import { SectionH2 } from '@/components/sections/SectionH2';
import { MentionsLegalesSection } from '@/components/sections/MentionsLegalesSection';
import { useBailForm } from '@/hooks/useBailForm';
import { BailFormData } from '@/types/bail';

type SectionRenderer = (
  data: Partial<BailFormData>,
  update: (d: Partial<BailFormData>) => void,
) => React.ReactNode;

const SECTION_MAP: Record<string, SectionRenderer> = {
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
};

export default function BailFormPage() {
  const {
    formState,
    completedSections,
    isSaving,
    updateFormData,
    saveFormData,
    navigateToSection,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
  } = useBailForm();

  const renderCurrentSection = () => {
    const renderer = SECTION_MAP[formState.currentSubsection];

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
