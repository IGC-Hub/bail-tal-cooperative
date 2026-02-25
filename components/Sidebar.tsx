'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, FileText, Calendar, DollarSign, ClipboardList, AlertCircle, Users, CheckCircle, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubSection {
  id: string;
  title: string;
  order: number;
}

interface Section {
  id: string;
  code: string;
  title: string;
  icon: React.ReactNode;
  subsections: SubSection[];
}

interface SidebarProps {
  currentSection: string;
  currentSubsection: string;
  onNavigate: (sectionId: string, subsectionId: string) => void;
  completedSections: Set<string>;
}

const sections: Section[] = [
  {
    id: 'intro',
    code: '',
    title: 'Remplir votre formulaire de bail : étapes à suivre',
    icon: <User className="w-5 h-5" />,
    subsections: [
      { id: 'intro-1', title: 'Informations sur le processus', order: 1 },
    ],
  },
  {
    id: 'section-a',
    code: 'A',
    title: 'Identification de la coopérative et du locataire',
    icon: <User className="w-5 h-5" />,
    subsections: [
      { id: 'a-1', title: 'Coopérative', order: 1 },
      { id: 'a-2', title: 'Locataire', order: 2 },
    ],
  },
  {
    id: 'section-b',
    code: 'B',
    title: 'Description du logement loué, des accessoires et des dépendances',
    icon: <FileText className="w-5 h-5" />,
    subsections: [
      { id: 'b-1', title: 'Description du logement', order: 1 },
      { id: 'b-2', title: 'Autres accessoires et dépendances', order: 2 },
      { id: 'b-3', title: 'Engagement pour avertisseurs de fumée', order: 3 },
    ],
  },
  {
    id: 'section-c',
    code: 'C',
    title: 'Durée du bail',
    icon: <Calendar className="w-5 h-5" />,
    subsections: [
      { id: 'c-1', title: 'Durée du bail', order: 1 },
    ],
  },
  {
    id: 'section-d',
    code: 'D',
    title: 'Loyer',
    icon: <DollarSign className="w-5 h-5" />,
    subsections: [
      { id: 'd-1', title: 'Coût', order: 1 },
      { id: 'd-2', title: 'Paiement', order: 2 },
    ],
  },
  {
    id: 'section-e',
    code: 'E',
    title: 'Services et conditions',
    icon: <ClipboardList className="w-5 h-5" />,
    subsections: [
      { id: 'e-1', title: "Règlement de l'immeuble", order: 1 },
      { id: 'e-2', title: 'Travaux et réparations', order: 2 },
      { id: 'e-3', title: 'Services du concierge', order: 3 },
      { id: 'e-4', title: 'Services, taxes et coûts de consommation', order: 4 },
      { id: 'e-5', title: 'Conditions', order: 5 },
      { id: 'e-6', title: 'Autres services, conditions et restrictions', order: 6 },
    ],
  },
  {
    id: 'section-f',
    code: 'F',
    title: 'Restrictions loyer et bail',
    icon: <AlertCircle className="w-5 h-5" />,
    subsections: [
      { id: 'f-1', title: 'Restrictions au droit à la fixation du loyer et à la modification du bail', order: 1 },
    ],
  },
  {
    id: 'section-h',
    code: 'H',
    title: 'Solidarité et caution',
    icon: <Users className="w-5 h-5" />,
    subsections: [
      { id: 'h-1', title: 'Engagement solidaire', order: 1 },
      { id: 'h-2', title: 'Autres signataires', order: 2 },
    ],
  },
  {
    id: 'mentions',
    code: '',
    title: 'Mentions légales',
    icon: <FileCheck className="w-5 h-5" />,
    subsections: [
      { id: 'mentions-1', title: 'Mentions légales', order: 1 },
    ],
  },
  {
    id: 'finalisation',
    code: '',
    title: 'Finalisation du bail',
    icon: <CheckCircle className="w-5 h-5" />,
    subsections: [
      { id: 'final-1', title: 'Choix de la langue du bail', order: 1 },
      { id: 'final-2', title: 'Choix du mot de passe', order: 2 },
      { id: 'final-3', title: 'Aperçu du bail', order: 3 },
      { id: 'final-4', title: 'Révision', order: 4 },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  currentSubsection,
  onNavigate,
  completedSections,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([currentSection])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (sectionId: string) => sectionId === currentSection;

  return (
    <aside className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0">
      <div className="p-6">
        <h2 className="text-lg font-bold text-tal-blue mb-1">
          Bail d'un logement dans une coopérative
        </h2>
      </div>

      <nav className="px-4 pb-6">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const isCurrent = isActive(section.id);
          const isCompleted = completedSections.has(section.id);

          return (
            <div key={section.id} className="mb-2">
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                  isCurrent && 'bg-blue-50 border-2 border-tal-blue',
                  !isCurrent && 'hover:bg-gray-50 border-2 border-transparent'
                )}
              >
                <div className="flex-shrink-0 text-tal-blue">
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900">
                    {section.code && <span className="font-bold">{section.code} - </span>}
                    {section.title}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && section.subsections.length > 0 && (
                <div className="ml-6 mt-2 border-l-2 border-tal-blue pl-6 space-y-2">
                  {section.subsections.map((subsection) => {
                    const isSubActive = currentSubsection === subsection.id;
                    const isSubCompleted = completedSections.has(subsection.id);

                    return (
                      <button
                        key={subsection.id}
                        onClick={() => onNavigate(section.id, subsection.id)}
                        className={cn(
                          'w-full flex items-center gap-3 text-left py-2 px-3 rounded transition-colors',
                          isSubActive && 'bg-blue-50 text-tal-blue font-medium',
                          !isSubActive && 'text-gray-700 hover:text-tal-blue hover:bg-gray-50'
                        )}
                      >
                        <div
                          className={cn(
                            'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                            isSubActive && 'bg-tal-blue text-white',
                            !isSubActive && isSubCompleted && 'bg-green-100 text-green-700',
                            !isSubActive && !isSubCompleted && 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {subsection.order}
                        </div>
                        <span className="text-sm">{subsection.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
