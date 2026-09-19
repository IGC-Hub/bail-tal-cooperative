'use client';

import { useEffect, useRef } from 'react';
import { FieldValues, UseFormWatch } from 'react-hook-form';

/**
 * Auto-synchronise les valeurs du formulaire react-hook-form avec l'état parent.
 * Observe tous les changements et appelle onSave avec un debounce.
 * Résout le problème de flux de données : les sections n'avaient pas de bouton
 * submit, donc onSave n'était jamais appelé.
 */
export function useAutoSync<T extends FieldValues>(
  watch: UseFormWatch<T>,
  onSave: (data: T) => void,
  debounceMs = 300
) {
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const subscription = watch((values) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onSaveRef.current(values as T);
      }, debounceMs);
    });
    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [watch, debounceMs]);
}
