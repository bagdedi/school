import type { DisciplineIncident } from '../../types';

export const mockDisciplineIncidents: DisciplineIncident[] = [
  // Student S0001 has 3 warnings
  { id: 'D001', studentId: 'S0001', date: '2025-10-05', type: 'Avertissement', reason: 'Bavardage excessif en classe.', reporter: 'Karim Ben Ali' },
  { id: 'D002', studentId: 'S0001', date: '2025-11-12', type: 'Avertissement', reason: 'Travail non fait.', reporter: 'Salma Mansouri' },
  { id: 'D003', studentId: 'S0001', date: '2025-11-28', type: 'Avertissement', reason: 'Utilisation du téléphone en cours.', reporter: 'Ahmed Zouari' },

  // Student S0002 has a suspension
  { id: 'D004', studentId: 'S0002', date: '2025-10-15', type: 'Avertissement', reason: 'Retards répétés.', reporter: 'Administration' },
  { id: 'D005', studentId: 'S0002', date: '2025-10-20', type: 'Avertissement', reason: 'Retards répétés.', reporter: 'Administration' },
  { id: 'D006', studentId: 'S0002', date: '2025-10-22', type: 'Exclusion Temporaire', reason: 'Insolence envers un enseignant.', reporter: 'Dr. Helmi Ahmed EL KAMEL', details: { duration: 3 } },

  // Student S0005 has one warning
  { id: 'D007', studentId: 'S0005', date: '2025-12-01', type: 'Avertissement', reason: 'Chahut en classe.', reporter: 'Mariem Trabelsi' },
  
  // Student S0006 has 5 warnings
  { id: 'D008', studentId: 'S0006', date: '2025-09-20', type: 'Avertissement', reason: 'Devoir non rendu.', reporter: 'Nour Guesmi' },
  { id: 'D009', studentId: 'S0006', date: '2025-10-01', type: 'Avertissement', reason: 'Comportement perturbateur.', reporter: 'Youssef Jlassi' },
  { id: 'D010', studentId: 'S0006', date: '2025-10-18', type: 'Avertissement', reason: 'Absence non justifiée en cours de sport.', reporter: 'Omar Dridi' },
  { id: 'D011', studentId: 'S0006', date: '2025-11-05', type: 'Avertissement', reason: 'Travail non fait.', reporter: 'Salma Mansouri' },
  { id: 'D012', studentId: 'S0006', date: '2025-11-15', type: 'Avertissement', reason: 'Bavardage.', reporter: 'Karim Ben Ali' },

];
