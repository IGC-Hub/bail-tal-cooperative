'use client';

import { useState, useCallback, useEffect } from 'react';
import { BailFormData, FormState } from '@/types/bail';
import { supabase } from '@/lib/supabase';

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

  const goToNext = useCallback(() => {
    // TODO: Implémenter la logique de navigation
    console.log('Navigation vers la section suivante');
  }, []);

  const goToPrevious = useCallback(() => {
    // TODO: Implémenter la logique de navigation
    console.log('Navigation vers la section précédente');
  }, []);

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
    markSectionCompleted,
  };
}
