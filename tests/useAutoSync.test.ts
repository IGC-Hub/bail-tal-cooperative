import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoSync } from '@/hooks/useAutoSync';

// Simule le watch de react-hook-form
function createMockWatch() {
  let callback: ((values: Record<string, unknown>) => void) | null = null;
  const unsubscribe = vi.fn();

  const watch = (cb: (values: Record<string, unknown>) => void) => {
    callback = cb;
    return { unsubscribe };
  };

  const trigger = (values: Record<string, unknown>) => {
    callback?.(values);
  };

  return { watch: watch as unknown as Parameters<typeof useAutoSync>[0], trigger, unsubscribe };
}

describe('useAutoSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ignore le premier rendu (ne déclenche pas onSave)', () => {
    const onSave = vi.fn();
    const { trigger } = createMockWatch();
    const mockWatch = createMockWatch();

    renderHook(() => useAutoSync(mockWatch.watch, onSave, 300));

    // Premier appel du callback watch (premier rendu)
    mockWatch.trigger({ nom: 'initial' });
    vi.advanceTimersByTime(500);

    expect(onSave).not.toHaveBeenCalled();
  });

  it('appelle onSave après le debounce sur un changement', () => {
    const onSave = vi.fn();
    const mockWatch = createMockWatch();

    renderHook(() => useAutoSync(mockWatch.watch, onSave, 300));

    // Premier appel ignoré
    mockWatch.trigger({ nom: 'initial' });
    vi.advanceTimersByTime(300);

    // Deuxième appel devrait déclencher onSave
    mockWatch.trigger({ nom: 'modifié' });
    vi.advanceTimersByTime(300);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({ nom: 'modifié' });
  });

  it('le debounce fusionne les appels rapides en un seul', () => {
    const onSave = vi.fn();
    const mockWatch = createMockWatch();

    renderHook(() => useAutoSync(mockWatch.watch, onSave, 300));

    // Premier appel ignoré
    mockWatch.trigger({ nom: 'v0' });

    // Changements rapides
    mockWatch.trigger({ nom: 'v1' });
    vi.advanceTimersByTime(100);
    mockWatch.trigger({ nom: 'v2' });
    vi.advanceTimersByTime(100);
    mockWatch.trigger({ nom: 'v3' });
    vi.advanceTimersByTime(300);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({ nom: 'v3' });
  });

  it('appelle unsubscribe au démontage', () => {
    const onSave = vi.fn();
    const mockWatch = createMockWatch();

    const { unmount } = renderHook(() => useAutoSync(mockWatch.watch, onSave, 300));

    unmount();

    expect(mockWatch.unsubscribe).toHaveBeenCalled();
  });

  it('nettoie le timeout au démontage', () => {
    const onSave = vi.fn();
    const mockWatch = createMockWatch();

    const { unmount } = renderHook(() => useAutoSync(mockWatch.watch, onSave, 300));

    // Premier appel ignoré
    mockWatch.trigger({ nom: 'initial' });

    // Déclencher un timeout en attente
    mockWatch.trigger({ nom: 'en cours' });

    unmount();

    // Avancer le temps après le démontage
    vi.advanceTimersByTime(500);

    // onSave ne devrait pas être appelé car le timeout a été nettoyé
    expect(onSave).not.toHaveBeenCalled();
  });

  it('respecte le délai de debounce personnalisé', () => {
    const onSave = vi.fn();
    const mockWatch = createMockWatch();

    renderHook(() => useAutoSync(mockWatch.watch, onSave, 1000));

    // Premier appel ignoré
    mockWatch.trigger({ nom: 'initial' });

    // Deuxième appel
    mockWatch.trigger({ nom: 'modifié' });

    // Pas encore passé les 1000ms
    vi.advanceTimersByTime(500);
    expect(onSave).not.toHaveBeenCalled();

    // Maintenant le debounce est écoulé
    vi.advanceTimersByTime(500);
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
