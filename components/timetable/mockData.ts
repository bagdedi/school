import type { TimetableEvent } from '../../types';

export const mockEvents: TimetableEvent[] = [
  // Lundi
  { id: '1', day: 1, startTime: '08:00', endTime: '10:00', className: '1ère Année', subject: 'physique', teacher: 'samir jbeli', hall: 'Salle1', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: '2', day: 1, startTime: '10:00', endTime: '12:00', className: '1ère Année', subject: 'math', teacher: 'teacher1 amil', hall: 'Salle1', color: 'bg-pink-200 border-pink-300 text-pink-900' },
  { id: '3', day: 1, startTime: '13:00', endTime: '15:00', className: '1ère Année', subject: 'info', teacher: 'hedia mansouri', hall: 'Labo1', color: 'bg-indigo-200 border-indigo-300 text-indigo-800' },
  // Mardi
  { id: '4', day: 2, startTime: '09:00', endTime: '11:00', className: '1ère Année', subject: 'gestion', teacher: 'hechmi messtiri', hall: 'Salle1', color: 'bg-[#6b4a39] border-[#4d3527] text-white' },
  { id: '5', day: 2, startTime: '12:00', endTime: '14:00', className: '1ère Année', subject: 'math', teacher: 'teacher1 amil', hall: 'Salle1', color: 'bg-pink-200 border-pink-300 text-pink-900' },
  { id: '6', day: 2, startTime: '14:00', endTime: '16:00', className: '1ère Année', subject: 'info', teacher: 'hedia mansouri', hall: 'Labo1', color: 'bg-indigo-200 border-indigo-300 text-indigo-800' },
  // Mercredi
  { id: '7', day: 3, startTime: '08:00', endTime: '10:00', className: '1ère Année', subject: 'gestion', teacher: 'hechmi messtiri', hall: 'Salle1', color: 'bg-[#6b4a39] border-[#4d3527] text-white' },
  { id: '8', day: 3, startTime: '14:00', endTime: '16:00', className: '1ère Année', subject: 'physique', teacher: 'samir jbeli', hall: 'Salle1', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  // Jeudi
  { id: '9', day: 4, startTime: '13:00', endTime: '15:00', className: '1ère Année', subject: 'info', teacher: 'hedia mansouri', hall: 'Labo1', color: 'bg-indigo-200 border-indigo-300 text-indigo-800' },
  { id: '10', day: 4, startTime: '15:00', endTime: '17:00', className: '1ère Année', subject: 'gestion', teacher: 'hechmi messtiri', hall: 'Salle1', color: 'bg-[#6b4a39] border-[#4d3527] text-white' },
  // Vendredi
  { id: '11', day: 5, startTime: '08:00', endTime: '10:00', className: '1ère Année', subject: 'info', teacher: 'hedia mansouri', hall: 'Labo1', color: 'bg-indigo-200 border-indigo-300 text-indigo-800' },
  { id: '12', day: 5, startTime: '10:00', endTime: '12:00', className: '1ère Année', subject: 'math', teacher: 'teacher1 amil', hall: 'Salle1', color: 'bg-pink-200 border-pink-300 text-pink-900' },
  { id: '13', day: 5, startTime: '13:00', endTime: '14:00', className: '1ère Année', subject: 'physique', teacher: 'samir jbeli', hall: 'Salle1', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  // Samedi
  { id: '14', day: 6, startTime: '10:00', endTime: '12:00', className: '1ère Année', subject: 'gestion', teacher: 'hechmi messtiri', hall: 'Salle1', color: 'bg-[#6b4a39] border-[#4d3527] text-white' },
];
