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
    const { currentSection, currentSubsection } = formState;

    // Introduction
    if (currentSection === 'intro') {
      return <IntroductionSection />;
    }

    // Section A - Identification
    if (currentSection === 'section-a') {
      if (currentSubsection === 'a-1') {
        return (
          <SectionA1
            data={formState.data.cooperative}
            onSave={(data: any) => updateFormData({ cooperative: data })}
          />
        );
      }
      if (currentSubsection === 'a-2') {
        return (
          <SectionA2
            data={{
              locataire_principal: formState.data.locataire_principal,
              locataire_supplementaire: formState.data.locataire_supplementaire,
            }}
            onSave={(data: any) => updateFormData(data)}
          />
        );
      }
    }

    // Section B - Description du logement
    if (currentSection === 'section-b') {
      if (currentSubsection === 'b-1') {
        return (
          <SectionB1
            data={formState.data.logement}
            onSave={(data: any) => updateFormData({ logement: data })}
          />
        );
      }
      if (currentSubsection === 'b-2') {
        return (
          <SectionB2
            data={formState.data.logement}
            onSave={(data: any) => updateFormData({ logement: data })}
          />
        );
      }
      if (currentSubsection === 'b-3') {
        return (
          <SectionB3
            data={formState.data.logement}
            onSave={(data: any) => updateFormData({ logement: data })}
          />
        );
      }
    }

    // Section C - Durée du bail
    if (currentSection === 'section-c') {
      return (
        <SectionC
          data={formState.data.duree}
          onSave={(data: any) => updateFormData({ duree: data })}
        />
      );
    }

    // Section D - Loyer
    if (currentSection === 'section-d') {
      if (currentSubsection === 'd-1') {
        return (
          <SectionD1
            data={formState.data.loyer}
            onSave={(data: any) => updateFormData({ loyer: data })}
          />
        );
      }
      if (currentSubsection === 'd-2') {
        return (
          <SectionD2
            data={formState.data.loyer?.paiement}
            onSave={(data: any) => updateFormData({ loyer: { ...formState.data.loyer, paiement: data } })}
          />
        );
      }
    }

    // Section E - Services et conditions
    if (currentSection === 'section-e') {
      if (currentSubsection === 'e-1') {
        return (
          <SectionE1
            data={formState.data.services?.reglement_immeuble}
            onSave={(data: any) => updateFormData({ services: { ...formState.data.services, reglement_immeuble: data } })}
          />
        );
      }
      if (currentSubsection === 'e-2') {
        return (
          <SectionE2
            data={formState.data.services?.travaux_reparations}
            onSave={(data: any) => updateFormData({ services: { ...formState.data.services, travaux_reparations: data } })}
          />
        );
      }
      if (currentSubsection === 'e-3') {
        return (
          <SectionE3
            data={formState.data.services?.service_concierge}
            onSave={(data: any) => updateFormData({ services: { ...formState.data.services, service_concierge: data } })}
          />
        );
      }
      if (currentSubsection === 'e-4') {
        return (
          <SectionE4
            data={formState.data.services?.services_taxes}
            onSave={(data: any) => updateFormData({ services: { ...formState.data.services, services_taxes: data } })}
          />
        );
      }
      if (currentSubsection === 'e-5') {
        return (
          <SectionE5
            data={formState.data.services?.conditions}
            onSave={(data: any) => updateFormData({ services: { ...formState.data.services, conditions: data } })}
          />
        );
      }
      if (currentSubsection === 'e-6') {
        return (
          <SectionE6
            data={{ autres_services: formState.data.services?.autres_services }}
            onSave={(data: any) => updateFormData({ services: { ...formState.data.services, ...data } })}
          />
        );
      }
    }

    // Section F - Restrictions
    if (currentSection === 'section-f') {
      return (
        <SectionF
          data={formState.data.restrictions}
          onSave={(data: any) => updateFormData({ restrictions: data })}
        />
      );
    }

    // Section H - Solidarité et caution
    if (currentSection === 'section-h') {
      if (currentSubsection === 'h-1') {
        return (
          <SectionH1
            data={formState.data.solidarite}
            onSave={(data: any) => updateFormData({ solidarite: data })}
          />
        );
      }
      if (currentSubsection === 'h-2') {
        return (
          <SectionH2
            data={{ autres_signataires: formState.data.solidarite?.autres_signataires }}
            onSave={(data: any) => updateFormData({ solidarite: { ...formState.data.solidarite, ...data } })}
          />
        );
      }
    }

    // Mentions légales
    if (currentSection === 'mentions') {
      return <MentionsLegalesSection />;
    }

    // Section par défaut (non implémentée)
    return (
      <div className="section-card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Section en développement
        </h2>
        <p className="text-gray-600">
          Cette section sera disponible prochainement.
        </p>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">
          Section: {currentSection}
          <br />
          Sous-section: {currentSubsection}
        </pre>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentSection={formState.currentSection}
        currentSubsection={formState.currentSubsection}
        onNavigate={navigateToSection}
        completedSections={completedSections}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Bandeau bleu TAL */}
        <header className="bg-tal-blue text-white px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">
              Bail d'un logement dans une coopérative
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              Formulaire obligatoire du Tribunal administratif du logement
            </p>
          </div>
        </header>

        {/* Zone de contenu */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentSection()}
          </div>
        </main>

        {/* Barre de navigation */}
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
