import type { SubjectCoefficient } from '../../types';

export interface Exam {
  name: string;
  frequency?: string;
  duration?: string;
  coefficient: string | number;
  notes?: string;
}

export interface AssessmentRule {
  subject: string | string[];
  levels: string[];
  specializations: string[];
  exams: Exam[];
  formula: string;
  formulaDescription: string;
  notes?: string[];
}

const ALL_SPECIALIZATIONS: string[] = [
    'Tronc Commun', 'Lettres', 'Économie et Services', 'Technologie de l\'Informatique', 'Sciences',
    'Économie et Gestion', 'Sciences de l\'Informatique', 'Sciences Techniques', 'Sciences Expérimentales', 'Mathématiques', 'Sport'
];

const assessmentData: AssessmentRule[] = [
  // --- ARABE (p.5) ---
  {
      subject: 'Arabe',
      levels: ['1 annee', '2 annee', '3 annee', '4 annee'],
      specializations: ALL_SPECIALIZATIONS,
      exams: [
          { name: 'Oral (Chafawi)', coefficient: 1, frequency: 'Continu', duration: 'N/A' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre', duration: 'Variable' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '2 heures' },
      ],
      formula: '(Moy. Oral + DC + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
      notes: ["La durée du Devoir de Contrôle varie selon le niveau mais la formule de calcul reste la même."]
  },

  // --- FRANÇAIS (p.9, 15, 18, 21, 24) ---
  {
      subject: 'Français',
      levels: ['1 annee', '2 annee', '3 annee', '4 annee'],
      specializations: ['Tronc Commun', 'Sciences', 'Économie et Services', 'Technologie de l\'Informatique', 'Économie et Gestion', 'Sciences Expérimentales', 'Mathématiques', 'Sciences Techniques', 'Lettres'],
      exams: [
          { name: 'Épreuve Orale', coefficient: 1, frequency: '1 par trimestre', duration: '5 min/élève' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre', duration: '2 heures' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '2 heures' },
      ],
      formula: '(Oral + Contrôle + 2×Synthèse) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Français',
      levels: ['1 annee', '2 annee', '3 annee', '4 annee'],
      specializations: ['Sport'],
      exams: [
          { name: 'Épreuve Orale', coefficient: 1, frequency: '1 par trimestre', duration: '5 min environ' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '2 heures' },
      ],
      formula: '(Oral + 2×Synthèse) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },

  // --- ANGLAIS (p.28) ---
  {
      subject: 'Anglais',
      levels: ['1 annee', '2 annee', '3 annee'],
      specializations: ALL_SPECIALIZATIONS,
      exams: [
          { name: 'Note Orale (Speaking + Project)', coefficient: 1, frequency: 'Continu' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre' },
      ],
      formula: '(Oral + Contrôle + 2×Synthèse) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
      notes: ["La note orale (sur 20) est la somme d'un 'speaking test' (sur 10) et d'un 'project work' (sur 10)."]
  },
  {
      subject: 'Anglais',
      levels: ['4 annee'],
      specializations: ALL_SPECIALIZATIONS,
      exams: [
          { name: 'Note Orale (Speaking + Project)', coefficient: 1, frequency: 'Continu' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 (Trimestres 1 & 2)' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre' },
      ],
      formula: 'Variable',
      formulaDescription: 'La formule change au 3ème trimestre.',
      notes: [
          "Trimestres 1 & 2: Moyenne = (Note Orale + Note Contrôle + (Note Synthèse × 2)) / 4",
          "Trimestre 3: Moyenne = (Note Orale + (Note Synthèse × 2)) / 3",
          "La note orale (sur 20) est la somme d'un 'speaking test' (sur 10) et d'un 'project work' (sur 10)."
      ]
  },
  
    // --- PHILOSOPHIE (p.109-110) ---
  {
      subject: 'Philosophie',
      levels: ['2 annee'],
      specializations: ['Lettres'],
      exams: [
          { name: 'Oral', coefficient: 1, frequency: 'Continu' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre' },
      ],
      formula: '(Oral + Contrôle + 2×Synthèse) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Philosophie',
      levels: ['3 annee', '4 annee'],
      specializations: ['Lettres'],
      exams: [
          { name: 'Oral', coefficient: 0.5, frequency: 'Continu' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre' },
      ],
      formula: '(0.5×Oral + Contrôle + 2×Synthèse) / 3.5',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Philosophie',
      levels: ['3 annee', '4 annee'],
      specializations: ['Sciences Expérimentales', 'Mathématiques', 'Sciences Techniques', 'Sciences de l\'Informatique', 'Sport', 'Économie et Gestion'],
      exams: [
          { name: 'Oral', coefficient: 0.5, frequency: 'Continu' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre' },
          { name: 'Devoir de Synthèse', coefficient: 1, frequency: '1 par trimestre' },
      ],
      formula: '(0.5×Oral + Contrôle + Synthèse) / 2.5',
      formulaDescription: 'Moyenne Trimestrielle',
  },

  // --- HISTOIRE & GÉOGRAPHIE (p.119-122) ---
  {
      subject: ['Histoire', 'Géographie'],
      levels: ['1 annee', '2 annee', '3 annee', '4 annee'],
      specializations: ALL_SPECIALIZATIONS,
      exams: [
          { name: 'Oral (Chafawi)', coefficient: 1, frequency: 'Continu' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre' },
      ],
      formula: '(Oral + Contrôle + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },

  // --- EDUCATION CIVILE & PENSÉE ISLAMIQUE ---
  {
      subject: ['Education Civile', 'Pensée Islamique'],
      levels: ['1 annee', '2 annee', '3 annee', '4 annee'],
      specializations: ALL_SPECIALIZATIONS,
      exams: [
          { name: 'Oral (Chafawi)', coefficient: 1, frequency: 'Continu' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre' },
      ],
      formula: '(Oral + Contrôle + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },

  // --- ÉCONOMIE & GESTION ---
  {
      subject: 'Economie',
      levels: ['2 annee', '3 annee'],
      specializations: ['Économie et Services', 'Économie et Gestion'],
      exams: [
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '2h' },
          { name: 'Note de Projet', coefficient: 1, frequency: '1 par trimestre' },
      ],
      formula: '(Contrôle + 2×Synthèse + Projet) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Economie',
      levels: ['4 annee'],
      specializations: ['Économie et Gestion'],
      exams: [
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre', duration: '2h' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '3h' },
      ],
      formula: '(Contrôle + 2×Synthèse) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Gestion',
      levels: ['2 annee', '3 annee', '4 annee'],
      specializations: ['Économie et Services', 'Économie et Gestion'],
      exams: [
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre' },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
      notes: ["Durées variables selon le niveau."]
  },

  // --- MATHÉMATIQUES (p.37-38) ---
  {
      subject: 'Mathématiques',
      levels: ['1 annee'],
      specializations: ['Tronc Commun', 'Sport'],
      exams: [
          { name: 'Devoir de Contrôle 1', frequency: '1 par trimestre', duration: '45 min', coefficient: 1 },
          { name: 'Devoir de Contrôle 2', frequency: '1 par trimestre', duration: '45 min', coefficient: 1 },
          { name: 'Devoir de Synthèse', frequency: '1 par trimestre', duration: '1h 30min', coefficient: 2 },
      ],
      formula: '(DC1 + DC2 + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Mathématiques',
      levels: ['2 annee'],
      specializations: ['Sciences', 'Technologie de l\'Informatique'],
      exams: [
          { name: 'Devoir de Contrôle 1', frequency: '1 par trimestre', duration: '1h', coefficient: 1 },
          { name: 'Devoir de Contrôle 2', frequency: '1 par trimestre', duration: '1h', coefficient: 1 },
          { name: 'Devoir de Synthèse', frequency: '1 par trimestre', duration: '2h', coefficient: 2 },
      ],
      formula: '(DC1 + DC2 + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Mathématiques',
      levels: ['2 annee'],
      specializations: ['Économie et Services'],
      exams: [
          { name: 'Devoir de Contrôle 1', frequency: '1 par trimestre', duration: '30 min', coefficient: 1 },
          { name: 'Devoir de Contrôle 2', frequency: '1 par trimestre', duration: '30 min', coefficient: 1 },
          { name: 'Devoir de Synthèse', frequency: '1 par trimestre', duration: '1h', coefficient: 2 },
      ],
      formula: '(DC1 + DC2 + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Mathématiques',
      levels: ['2 annee'],
      specializations: ['Sport'],
       exams: [
          { name: 'Devoir de Contrôle', frequency: '1 par trimestre', duration: '45min', coefficient: 1 },
          { name: 'Devoir de Synthèse', frequency: '1 par trimestre', duration: '1h', coefficient: 2 },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Mathématiques',
      levels: ['2 annee'],
      specializations: ['Lettres'],
       exams: [
          { name: 'Devoir de Contrôle', frequency: '1 par trimestre', duration: '30min', coefficient: 1 },
          { name: 'Devoir de Synthèse', frequency: '1 par trimestre', duration: '1h', coefficient: 2 },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Mathématiques',
      levels: ['3 annee', '4 annee'],
      specializations: ['Mathématiques', 'Sciences Expérimentales', 'Sciences Techniques', 'Sciences de l\'Informatique', 'Économie et Gestion', 'Sport', 'Lettres'],
      exams: [
          { name: 'Devoir de Contrôle', frequency: '1 par trimestre', coefficient: 1 },
          { name: 'Devoir de Synthèse', frequency: '1 par trimestre', coefficient: 2 },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
      notes: [
          "Durées DC: 2h (Maths, Sc.Exp, Sc.Tech, Sc.Info), 1h30 (Eco), 1h (Sport), 30min (Lettres)",
          "Durées DS (3e): 3h (Maths, Sc.Exp, Sc.Tech, Sc.Info), 2h (Eco, Sport), 1h (Lettres)",
          "Durées DS (4e): 4h (Maths), 3h (Sc.Exp, Sc.Tech, Sc.Info), 2h (Eco, Sport), 1h (Lettres)",
      ]
  },

  // --- SVT (p.43-48) ---
  {
      subject: 'Sciences de la Vie et de la Terre',
      levels: ['2 annee'],
      specializations: ['Sciences'],
      exams: [
          { name: 'Travaux Pratiques (TP)', coefficient: 1, frequency: 'Continu' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '1h 30min' },
      ],
      formula: '(TP + DC + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Sciences de la Vie et de la Terre',
      levels: ['2 annee'],
      specializations: ['Lettres'],
      exams: [
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre', duration: '30min' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '1h' },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Sciences de la Vie et de la Terre',
      levels: ['3 annee'],
      specializations: ['Sciences Expérimentales'],
      exams: [
          { name: 'Travaux Pratiques (TP)', coefficient: 1, frequency: 'Continu' },
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre', duration: '1h 30min' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '2h' },
      ],
      formula: '(TP + DC + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Sciences de la Vie et de la Terre',
      levels: ['4 annee'],
      specializations: ['Sciences Expérimentales'],
      exams: [
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre', duration: '2h' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '3h' },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Sciences de la Vie et de la Terre',
      levels: ['3 annee', '4 annee'],
      specializations: ['Mathématiques'],
      exams: [
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre', duration: '1h 30min' },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },
    {
      subject: 'Sciences Biologiques', // Alias for SVT in Sport section
      levels: ['1 annee', '2 annee', '3 annee'],
      specializations: ['Sport'],
      exams: [
          { name: 'Travaux Pratiques (TP)', coefficient: 1, frequency: 'Continu (2-3 tests)' },
          { name: 'Devoir de Contrôle (DC)', coefficient: 1, frequency: '1 par trimestre', duration: '30min (1e/2e), 1h (3e)' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '1h (1e), 1h (2e), 2h (3e)' },
      ],
      formula: '(TP + DC + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Sciences Biologiques',
      levels: ['4 annee'],
      specializations: ['Sport'],
      exams: [
          { name: 'Devoir de Contrôle (DC)', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '3h' },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },

  // --- PHYSIQUE (p.81, 83, 85) ---
  {
      subject: 'Physique',
      levels: ['1 annee'],
      specializations: ['Tronc Commun'],
      exams: [
          { name: 'Devoir de Contrôle (DC)', coefficient: 1, frequency: '1 par trimestre', duration: '30 min' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '1h' },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Physique',
      levels: ['2 annee'],
      specializations: ['Sciences', 'Technologie de l\'Informatique'],
      exams: [
          { name: 'Travaux Pratiques (TP)', coefficient: 1, frequency: 'Continu', duration: '1h 30min' },
          { name: 'Devoir de Contrôle (DC)', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '2h (Sc), 1h (Info)' },
      ],
      formula: '(TP + DC + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Physique',
      levels: ['1 annee', '2 annee', '3 annee', '4 annee'],
      specializations: ['Sport'],
      exams: [
          { name: 'Devoir de Contrôle', coefficient: 1, frequency: '1 par trimestre' },
          { name: 'Devoir de Synthèse', coefficient: 2, frequency: '1 par trimestre' },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
      notes: [
          "Durées 1e/2e: DC(1h), DS(1h)",
          "Durées 3e/4e: DC(2h), DS(2h)",
      ]
  },
  {
      subject: 'Physique',
      levels: ['3 annee', '4 annee'],
      specializations: ['Mathématiques', 'Sciences Expérimentales', 'Sciences Techniques', 'Sciences de l\'Informatique'],
      exams: [
          { name: 'Travaux Pratiques (TP)', coefficient: 1, frequency: 'Continu', duration: '1h 30min' },
          { name: 'Devoir de Contrôle (DC)', coefficient: 1, frequency: '1 par trimestre', duration: '2h' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '3h' },
      ],
      formula: '(TP + DC + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  
  // --- TECHNOLOGIE & GÉNIE (p. 65, 67) ---
    {
      subject: 'Technologie',
      levels: ['1 annee', '2 annee'],
      specializations: ['Tronc Commun', 'Sciences', 'Technologie de l\'Informatique'],
      exams: [
          { name: 'Devoir de Contrôle (DC)', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Projet Commun (PC)', coefficient: 1, frequency: 'Continu' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '2h' },
      ],
      formula: '(DC + PC + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
    {
      subject: ['Génie Électrique', 'Génie Mécanique'],
      levels: ['3 annee', '4 annee'],
      specializations: ['Sciences Techniques'],
      exams: [
          { name: 'Tests Pratiques (TP)', coefficient: 1, frequency: 'Continu' },
          { name: 'Devoir de Contrôle (DC)', coefficient: 1, frequency: '1 par trimestre', duration: '2h' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '4h' },
      ],
      formula: '(TP + DC + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },

  // --- INFORMATIQUE (p.87-98) & Specialized Subjects ---
    {
      subject: 'Informatique',
      levels: ['1 annee'],
      specializations: ['Tronc Commun', 'Sport'],
       exams: [
          { name: 'Évaluations Périodiques (NG)', coefficient: 1, frequency: 'Au moins 2 par trimestre', duration: '30 min' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
      ],
      formula: '(NG + DS) / 2',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Informatique',
      levels: ['2 annee'],
      specializations: ['Technologie de l\'Informatique'],
      exams: [
          { name: 'Évaluations Périodiques (NG)', coefficient: 1, frequency: 'Au moins 2 par trimestre', duration: '30 min' },
          { name: 'Devoir de Contrôle (DC)', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '2h' },
      ],
      formula: '(NG + DC + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Informatique',
      levels: ['2 annee', '3 annee'],
      specializations: ['Lettres', 'Économie et Services', 'Sport', 'Sciences', 'Économie et Gestion'],
      exams: [
          { name: 'Évaluations Périodiques (NG)', coefficient: 1, frequency: 'Au moins 2 par trimestre', duration: '30 min' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
      ],
      formula: '(NG + DS) / 2',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: ['Informatique', 'Algorithmique & Programmation', 'Systèmes & Réseaux', 'Bases de données', 'Tech-Inf-comm (TIC)'],
      levels: ['3 annee', '4 annee'],
      specializations: ['Sciences de l\'Informatique', 'Mathématiques'],
      exams: [
          { name: 'Devoir de Contrôle Pratique (DCP)', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Devoir de Contrôle Théorique (DCT)', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '2h' },
      ],
      formula: '(DCP + DCT + 2×DS) / 4',
      formulaDescription: 'Moyenne Trimestrielle',
      notes: ["Cette règle s'applique à toutes les matières informatiques spécialisées."]
  },
  {
      subject: 'Informatique',
      levels: ['4 annee'],
      specializations: ['Mathématiques', 'Sciences Expérimentales', 'Sciences Techniques', 'Lettres', 'Économie et Gestion', 'Sport'],
      exams: [
          { name: 'Devoir de Contrôle (DC)', coefficient: 1, frequency: '1 par trimestre', duration: '1h' },
          { name: 'Devoir de Synthèse (DS)', coefficient: 2, frequency: '1 par trimestre', duration: '1h30 (Sc/Math/Tech), 1h (autres)' },
      ],
      formula: '(DC + 2×DS) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },

  // --- SPORT, ARTS, PROJET ---
  {
      subject: 'Sport',
      levels: ['1 annee', '2 annee', '3 annee', '4 annee'],
      specializations: ALL_SPECIALIZATIONS,
      exams: [
          { name: 'Note Pratique', coefficient: 2, frequency: 'Continu' },
          { name: 'Note Théorique', coefficient: 1, frequency: 'Continu' },
      ],
      formula: '(2×Pratique + Théorique) / 3',
      formulaDescription: 'Moyenne Trimestrielle',
  },
  {
      subject: 'Arts',
      levels: ['1 annee'],
      specializations: ['Tronc Commun'],
      exams: [
          { name: 'Évaluation Continue', coefficient: 1, frequency: 'Continu' },
          { name: 'Travail de Synthèse', coefficient: 1, frequency: '1 par trimestre' },
      ],
      formula: '(Continue + Synthèse) / 2',
      formulaDescription: 'Moyenne Trimestrielle',
  },
    {
      subject: 'Projet',
      levels: ['1 annee'],
      specializations: ['Tronc Commun'],
      exams: [
          { name: 'Note de Projet', coefficient: 1, frequency: 'Continu' },
      ],
      formula: 'Note de Projet',
      formulaDescription: 'La note du projet constitue la moyenne.',
  },
];


export const findAssessmentRule = (subjectDetails: SubjectCoefficient | null): AssessmentRule | undefined => {
  if (!subjectDetails) return undefined;
  const { subject, level, specialization } = subjectDetails;
  
  const normalizedSubject = subject.toLowerCase().includes('biologiques') ? 'Sciences Biologiques' : subject;

  // Find the most specific rule first
  const rule = assessmentData.find(rule => {
    const subjectMatch = Array.isArray(rule.subject)
      ? rule.subject.map(s => s.toLowerCase()).includes(normalizedSubject.toLowerCase())
      : rule.subject.toLowerCase() === normalizedSubject.toLowerCase();
      
    return subjectMatch &&
      rule.levels.includes(level) &&
      rule.specializations.includes(specialization);
  });

  return rule;
};
