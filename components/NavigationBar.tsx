'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Save, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationBarProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSave: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isSaving?: boolean;
  lastSaved?: string;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onPrevious,
  onNext,
  onSave,
  canGoPrevious,
  canGoNext,
  isSaving = false,
  lastSaved,
}) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          <Button
            variant="secondary"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>

          {lastSaved && (
            <span className="text-sm text-gray-500">
              Dernière sauvegarde: {lastSaved}
            </span>
          )}
        </div>

        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canGoNext}
        >
          Suivant
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
