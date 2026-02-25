'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { NavigationBar } from '@/components/NavigationBar';
import { IntroductionSection } from '@/components/sections/IntroductionSection';
import { SectionA1 } from '@/components/sections/SectionA1';
import { SectionA2 } from '@/components/sections/SectionA2';
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
            onSave={(data) => updateFormData({ cooperative: data })}
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
            onSave={(data) => updateFormData(data)}
          />
        );
      }
    }

    // TODO: Ajouter les autres sections

    return (
      <div className="section-card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Section en développement
        </h2>
        <p className="text-gray-600">
          Cette section est en cours de développement.
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
          canGoPrevious={formState.currentSection !== 'intro'}
          canGoNext={true}
          isSaving={isSaving}
          lastSaved={formState.lastSaved}
        />
      </div>
    </div>
  );
}
