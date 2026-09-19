import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('@/lib/supabase', () => ({
  supabase: null,
  getAuthenticatedUser: vi.fn().mockResolvedValue(null),
}));

import { useBailForm } from '@/hooks/useBailForm';

describe('useBailForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- État initial ---
  describe('état initial', () => {
    it('démarre sur la section intro', () => {
      const { result } = renderHook(() => useBailForm());
      expect(result.current.formState.currentSection).toBe('intro');
      expect(result.current.formState.currentSubsection).toBe('intro-1');
    });

    it('démarre avec des données vides', () => {
      const { result } = renderHook(() => useBailForm());
      expect(result.current.formState.data).toEqual({});
    });

    it('démarre avec isDirty à false', () => {
      const { result } = renderHook(() => useBailForm());
      expect(result.current.formState.isDirty).toBe(false);
    });

    it('démarre avec un ensemble de sections complétées vide', () => {
      const { result } = renderHook(() => useBailForm());
      expect(result.current.completedSections.size).toBe(0);
    });

    it('démarre avec isSaving à false', () => {
      const { result } = renderHook(() => useBailForm());
      expect(result.current.isSaving).toBe(false);
    });
  });

  // --- updateFormData ---
  describe('updateFormData', () => {
    it('fusionne les données et met isDirty à true', () => {
      const { result } = renderHook(() => useBailForm());

      act(() => {
        result.current.updateFormData({
          duree: { type: 'fixe', duree_nombre: 12 },
        });
      });

      expect(result.current.formState.isDirty).toBe(true);
      expect(result.current.formState.data.duree).toEqual({
        type: 'fixe',
        duree_nombre: 12,
      });
    });

    it('conserve les données existantes lors de la fusion', () => {
      const { result } = renderHook(() => useBailForm());

      act(() => {
        result.current.updateFormData({
          duree: { type: 'fixe' },
        });
      });

      act(() => {
        result.current.updateFormData({
          restrictions: { situation: 'membre' },
        });
      });

      expect(result.current.formState.data.duree).toEqual({ type: 'fixe' });
      expect(result.current.formState.data.restrictions).toEqual({ situation: 'membre' });
    });

    it('marque la sous-section courante comme complétée', () => {
      const { result } = renderHook(() => useBailForm());

      act(() => {
        result.current.updateFormData({ duree: { type: 'fixe' } });
      });

      expect(result.current.completedSections.has('intro-1')).toBe(true);
    });
  });

  // --- Navigation ---
  describe('navigation', () => {
    it('goToNext avance à la section suivante', () => {
      const { result } = renderHook(() => useBailForm());

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.formState.currentSection).toBe('section-a');
      expect(result.current.formState.currentSubsection).toBe('a-1');
    });

    it('goToNext avance de a-1 à a-2', () => {
      const { result } = renderHook(() => useBailForm());

      act(() => {
        result.current.goToNext(); // intro -> a-1
      });
      act(() => {
        result.current.goToNext(); // a-1 -> a-2
      });

      expect(result.current.formState.currentSubsection).toBe('a-2');
    });

    it('goToPrevious recule à la section précédente', () => {
      const { result } = renderHook(() => useBailForm());

      act(() => {
        result.current.goToNext(); // intro -> a-1
      });
      act(() => {
        result.current.goToPrevious(); // a-1 -> intro
      });

      expect(result.current.formState.currentSection).toBe('intro');
      expect(result.current.formState.currentSubsection).toBe('intro-1');
    });

    it('canGoPrevious retourne false sur la première section', () => {
      const { result } = renderHook(() => useBailForm());
      expect(result.current.canGoPrevious).toBe(false);
    });

    it('canGoNext retourne true sur la première section', () => {
      const { result } = renderHook(() => useBailForm());
      expect(result.current.canGoNext).toBe(true);
    });

    it('canGoNext retourne false sur la dernière section', () => {
      const { result } = renderHook(() => useBailForm());

      // Naviguer jusqu'à la dernière section (pdf-1)
      act(() => {
        result.current.navigateToSection('finalisation', 'pdf-1');
      });

      expect(result.current.canGoNext).toBe(false);
    });

    it('navigateToSection saute directement à une section', () => {
      const { result } = renderHook(() => useBailForm());

      act(() => {
        result.current.navigateToSection('section-f', 'f-1');
      });

      expect(result.current.formState.currentSection).toBe('section-f');
      expect(result.current.formState.currentSubsection).toBe('f-1');
    });
  });

  // --- saveFormData ---
  describe('saveFormData', () => {
    it('log une erreur quand supabase est null', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useBailForm());

      await act(async () => {
        await result.current.saveFormData();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Sauvegarde impossible: client Supabase ou leaseId manquant'
      );
      consoleSpy.mockRestore();
    });

    it('ne modifie pas isSaving quand supabase est null', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useBailForm());

      await act(async () => {
        await result.current.saveFormData();
      });

      expect(result.current.isSaving).toBe(false);
      vi.restoreAllMocks();
    });
  });

  // --- markSectionCompleted ---
  describe('markSectionCompleted', () => {
    it('ajoute une section à completedSections', () => {
      const { result } = renderHook(() => useBailForm());

      act(() => {
        result.current.markSectionCompleted('a-1');
      });

      expect(result.current.completedSections.has('a-1')).toBe(true);
    });

    it('peut marquer plusieurs sections', () => {
      const { result } = renderHook(() => useBailForm());

      act(() => {
        result.current.markSectionCompleted('a-1');
        result.current.markSectionCompleted('b-1');
        result.current.markSectionCompleted('c-1');
      });

      expect(result.current.completedSections.size).toBe(3);
    });
  });
});
