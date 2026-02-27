'use client';

import { useState, useCallback, useEffect } from 'react';
import { BailFormData, FormState } from '@/types/bail';
import { supabase } from '@/lib/supabase';

// Ordre de navigation linéaire de toutes les sous-sections
const NAVIGATION_ORDER: { sectionId: string; subsectionId: string }[] = [
  { sectionId: 'intro', subsectionId: 'intro-1' },
  { sectionId: 'section-a', subsectionId: 'a-1' },
  { sectionId: 'section-a', subsectionId: 'a-2' },
  { sectionId: 'section-b', subsectionId: 'b-1' },
  { sectionId: 'section-b', subsectionId: 'b-2' },
  { sectionId: 'section-b', subsectionId: 'b-3' },
  { sectionId: 'section-c', subsectionId: 'c-1' },
  { sectionId: 'section-d', subsectionId: 'd-1' },
  { sectionId: 'section-d', subsectionId: 'd-2' },
  { sectionId: 'section-e', subsectionId: 'e-1' },
  { sectionId: 'section-e', subsectionId: 'e-2' },
  { sectionId: 'section-e', subsectionId: 'e-3' },
  { sectionId: 'section-e', subsectionId: 'e-4' },
  { sectionId: 'section-e', subsectionId: 'e-5' },
  { sectionId: 'section-e', subsectionId: 'e-6' },
  { sectionId: 'section-f', subsectionId: 'f-1' },
  { sectionId: 'section-h', subsectionId: 'h-1' },
  { sectionId: 'section-h', subsectionId: 'h-2' },
  { sectionId: 'mentions', subsectionId: 'mentions-1' },
  { sectionId: 'finalisation', subsectionId: 'final-1' },
  { sectionId: 'finalisation', subsectionId: 'final-2' },
  { sectionId: 'finalisation', subsectionId: 'final-3' },
  { sectionId: 'finalisation', subsectionId: 'final-4' },
];

export function useBailForm(leaseId?: string) {
  const [formState, setFormState] = useState<FormState>({
    currentSection: 'intro',
    currentSubsection: 'intro-1',
    data: {},
    errors: {},
    isDirty: false,
  });

  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Charger les données existantes
  useEffect(() => {
    if (leaseId) {
      loadFormData(leaseId);
    }
  }, [leaseId]);

  const loadFormData = async (id: string) => {
    if (!supabase) {
      console.warn('Supabase client not available');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('leases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormState(prev => ({
          ...prev,
          data: data as any, // TODO: mapper correctement
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const updateFormData = useCallback((sectionData: Partial<BailFormData>) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        ...sectionData,
      },
      isDirty: true,
    }));
  }, []);

  const saveFormData = useCallback(async () => {
    setIsSaving(true);
    try {
      // TODO: Sauvegarder dans Supabase
      console.log('Sauvegarde des données:', formState.data);
      
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormState(prev => ({
        ...prev,
        isDirty: false,
        lastSaved: new Date().toLocaleTimeString('fr-CA'),
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formState.data]);

  const navigateToSection = useCallback((sectionId: string, subsectionId: string) => {
    setFormState(prev => ({
      ...prev,
      currentSection: sectionId,
      currentSubsection: subsectionId,
    }));
  }, []);

  const getCurrentIndex = useCallback(() => {
    return NAVIGATION_ORDER.findIndex(
      (item) =>
        item.sectionId === formState.currentSection &&
        item.subsectionId === formState.currentSubsection
    );
  }, [formState.currentSection, formState.currentSubsection]);

  const canGoNext = useCallback(() => {
    const currentIndex = getCurrentIndex();
    return currentIndex < NAVIGATION_ORDER.length - 1;
  }, [getCurrentIndex]);

  const canGoPrevious = useCallback(() => {
    const currentIndex = getCurrentIndex();
    return currentIndex > 0;
  }, [getCurrentIndex]);

  const goToNext = useCallback(() => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < NAVIGATION_ORDER.length - 1) {
      const next = NAVIGATION_ORDER[currentIndex + 1];
      setFormState((prev) => ({
        ...prev,
        currentSection: next.sectionId,
        currentSubsection: next.subsectionId,
      }));
    }
  }, [getCurrentIndex]);

  const goToPrevious = useCallback(() => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      const prev = NAVIGATION_ORDER[currentIndex - 1];
      setFormState((p) => ({
        ...p,
        currentSection: prev.sectionId,
        currentSubsection: prev.subsectionId,
      }));
    }
  }, [getCurrentIndex]);

  const markSectionCompleted = useCallback((sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
  }, []);

  return {
    formState,
    completedSections,
    isSaving,
    updateFormData,
    saveFormData,
    navigateToSection,
    goToNext,
    goToPrevious,
    canGoNext: canGoNext(),
    canGoPrevious: canGoPrevious(),
    markSectionCompleted,
  };
}
