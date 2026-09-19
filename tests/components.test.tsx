import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@/lib/supabase', () => ({
  supabase: null,
  getAuthenticatedUser: vi.fn().mockResolvedValue(null),
}));

// Mock useAutoSync pour éviter les effets de bord dans les tests de composants
vi.mock('@/hooks/useAutoSync', () => ({
  useAutoSync: vi.fn(),
}));

import { IntroductionSection } from '@/components/sections/IntroductionSection';
import { SectionC } from '@/components/sections/SectionC';
import { SectionD1 } from '@/components/sections/SectionD1';
import { SectionF } from '@/components/sections/SectionF';

// --- IntroductionSection ---
describe('IntroductionSection', () => {
  it('rend le titre principal', () => {
    render(<IntroductionSection />);
    expect(screen.getByText('Informations sur le processus')).toBeInTheDocument();
  });

  it('rend les instructions de remplissage', () => {
    render(<IntroductionSection />);
    expect(
      screen.getByText('1. Remplissage du formulaire de bail électronique')
    ).toBeInTheDocument();
  });

  it('rend la section validation et signature', () => {
    render(<IntroductionSection />);
    expect(
      screen.getByText('2. Validation et signature')
    ).toBeInTheDocument();
  });

  it('rend l\'avertissement sur les adresses courriel', () => {
    render(<IntroductionSection />);
    const matches = screen.getAllByText(/adresse de courriel valide/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('rend le lien vers Publications du Québec', () => {
    render(<IntroductionSection />);
    expect(screen.getByText('Publications du Québec')).toBeInTheDocument();
  });
});

// --- SectionC ---
describe('SectionC', () => {
  const defaultProps = {
    data: {},
    onSave: vi.fn(),
  };

  it('rend le titre de la section', () => {
    render(<SectionC {...defaultProps} />);
    expect(screen.getByText('C - Durée du bail')).toBeInTheDocument();
  });

  it('rend le bouton radio pour bail à durée fixe', () => {
    render(<SectionC {...defaultProps} />);
    expect(screen.getByText('Bail à durée fixe')).toBeInTheDocument();
  });

  it('rend le bouton radio pour bail à durée indéterminée', () => {
    render(<SectionC {...defaultProps} />);
    expect(screen.getByText('Bail à durée indéterminée')).toBeInTheDocument();
  });

  it('rend les deux options radio avec la valeur correcte', () => {
    render(<SectionC {...defaultProps} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute('value', 'fixe');
    expect(radios[1]).toHaveAttribute('value', 'indeterminee');
  });

  it('rend l\'alerte informative', () => {
    render(<SectionC {...defaultProps} />);
    expect(
      screen.getByText(/consentement mutuel/)
    ).toBeInTheDocument();
  });

  it('affiche les champs supplémentaires quand fixe est sélectionné', () => {
    render(<SectionC data={{ type: 'fixe' }} onSave={vi.fn()} />);
    expect(screen.getByText('Bail à durée fixe', { selector: 'h4' })).toBeInTheDocument();
  });

  it('affiche les champs supplémentaires quand indeterminee est sélectionné', () => {
    render(<SectionC data={{ type: 'indeterminee' }} onSave={vi.fn()} />);
    expect(
      screen.getByText('Bail à durée indéterminée', { selector: 'h4' })
    ).toBeInTheDocument();
  });
});

// --- SectionD1 ---
describe('SectionD1', () => {
  const defaultProps = {
    data: {},
    onSave: vi.fn(),
  };

  it('rend le titre de la section', () => {
    render(<SectionD1 {...defaultProps} />);
    expect(screen.getByText('D - Loyer')).toBeInTheDocument();
  });

  it('rend le sous-titre Coût', () => {
    render(<SectionD1 {...defaultProps} />);
    expect(screen.getByText('1. Coût')).toBeInTheDocument();
  });

  it('rend le champ loyer_base', () => {
    render(<SectionD1 {...defaultProps} />);
    expect(screen.getByText('Le loyer est de')).toBeInTheDocument();
  });

  it('rend les options de fréquence', () => {
    render(<SectionD1 {...defaultProps} />);
    expect(screen.getByText('Par mois')).toBeInTheDocument();
    expect(screen.getByText('Par semaine')).toBeInTheDocument();
  });

  it('rend le champ loyer total en lecture seule', () => {
    render(<SectionD1 {...defaultProps} />);
    expect(screen.getByText('Le loyer total est de')).toBeInTheDocument();
  });

  it('rend la section programme de subvention', () => {
    render(<SectionD1 {...defaultProps} />);
    expect(
      screen.getByText(/programme de subvention/)
    ).toBeInTheDocument();
  });

  it('rend l\'avertissement sur les sommes supplémentaires', () => {
    render(<SectionD1 {...defaultProps} />);
    expect(
      screen.getByText(/aucune autre somme/)
    ).toBeInTheDocument();
  });
});

// --- SectionF ---
describe('SectionF', () => {
  const defaultProps = {
    data: {},
    onSave: vi.fn(),
  };

  it('rend le titre de la section', () => {
    render(<SectionF {...defaultProps} />);
    expect(
      screen.getByText(/Restrictions au droit/)
    ).toBeInTheDocument();
  });

  it('rend le label Situation du locataire', () => {
    render(<SectionF {...defaultProps} />);
    expect(screen.getByText('Situation du locataire')).toBeInTheDocument();
  });

  it('rend le bouton radio pour membre', () => {
    render(<SectionF {...defaultProps} />);
    expect(screen.getByText('Membre de la coopérative')).toBeInTheDocument();
  });

  it('rend le bouton radio pour non-membre', () => {
    render(<SectionF {...defaultProps} />);
    expect(screen.getByText('Non-membre de la coopérative')).toBeInTheDocument();
  });

  it('rend les deux options radio avec la valeur correcte', () => {
    render(<SectionF {...defaultProps} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute('value', 'membre');
    expect(radios[1]).toHaveAttribute('value', 'non_membre');
  });

  it('affiche la note pour un membre sélectionné', () => {
    render(<SectionF data={{ situation: 'membre' }} onSave={vi.fn()} />);
    expect(
      screen.getByText(/participe aux décisions/)
    ).toBeInTheDocument();
  });

  it('affiche les options supplémentaires pour un non-membre', () => {
    render(<SectionF data={{ situation: 'non_membre' }} onSave={vi.fn()} />);
    expect(
      screen.getByText(/Important pour les non-membres/)
    ).toBeInTheDocument();
  });

  it('rend l\'alerte informative sur les coopératives', () => {
    render(<SectionF {...defaultProps} />);
    expect(
      screen.getByText(/fixation de loyer au Tribunal/)
    ).toBeInTheDocument();
  });
});
