import type React from 'react';

export type AttestationType = 'inscription' | 'presence' | 'both';

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  alert?: boolean;
  subItems?: { name: string, icon?: React.ReactNode }[];
}

export interface Student {
  id: string;
  matricule: string;
  avatar: string;
  // Personal Info
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  phone?: string;
  email?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  // Academic Path
  academicLevel: string; // niveau
  academicSpecialty: string; // specialité
  option?: string;
  classe?: string;
  academicDiploma?: string;
  studyLevel?: string;
  bacYear?: string;
  schoolYear?: string;
  // Parent Info
  parentPhone?: string;
  parentEmail?: string;
  // Photo
  photoUrl?: string;
}

export interface Teacher {
  id: string;
  avatar: string;
  // Personal Info
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  address: string;
  // Professional Info
  diploma: string;
  specialty: string;
  professionalStatus: string;
  yearsOfExperience: string;
  matricule: string;
  // Bank Info
  bank: string;
  rib: string;
  // ID Info
  idType: string;
  idNumber: string;
  // Photo
  photoUrl?: string;
}


export interface Scholarship {
  id: string;
  name: string;
  amount: number;
  eligibility: string;
  status: 'Active' | 'Inactive';
}

export interface TimetableEvent {
  id: string;
  day: number; // 1 for Monday, 2 for Tuesday, etc.
  startTime: string; // 'HH:mm' format, e.g., '08:00'
  endTime: string; // 'HH:mm' format, e.g., '10:00'
  className: string; // '1ère Année'
  subject: string;
  teacher: string;
  hall: string;
  color: string; // e.g., 'bg-yellow-200 border-yellow-400 text-yellow-800'
}

export interface DayWorkingHours {
  day: string;
  dayIndex: number;
  isWorkingDay: boolean;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
}

export interface Classe {
  id: string;
  niveau: string;
  specialite: string;
  number: number;
  name:string;
}

export interface SharedFilterState {
  niveau: string;
  specialite: string;
  classe: string;
  option: string;
}