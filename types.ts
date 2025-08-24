import type React from 'react';

export type AttestationType = 'inscription' | 'presence' | 'both';

export type Term = 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3';

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
  option?: string[];
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
  password?: string;
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

export interface SubjectCoefficient {
  id: string;
  subject: string;
  level: string;
  specialization: string;
  hours: string;
  coefficient: string;
  groupHours?: string; // The portion of total hours that are done in groups.
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
  option: string;
  classe: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  tranche: string; // e.g., 'Inscription', '1ère Tranche'
}

export interface Installment {
  name: string; // 'Inscription', '1ère Tranche', '2ème Tranche', '3ème Tranche'
  dueDate: string; // YYYY-MM-DD
  amount: number;
}

export interface TuitionFee {
  niveau: string;
  specialite: string;
  total: number;
  installments: Installment[];
}

// --- NEW TYPES FOR GRADES/BULLETINS ---

export interface SubjectGrade {
  subjectName: string;
  notes: { [examName: string]: number | null };
  coefficient: number;
  average?: number; // Calculated
  rank?: number; // Calculated
  total?: number; // Calculated (average * coefficient)
  teacher?: string;
  appreciation?: string;
  subGrades?: SubjectGrade[];
}

export interface StudentGrades {
  studentId: string;
  term: Term;
  grades: SubjectGrade[];
}

// --- NEW TYPES FOR ATTENDANCE ---
export type AttendanceStatus = 'A' | 'R' | 'EX';

export type DailyClassAttendance = {
  [studentId: string]: {
    [timeLabel: string]: AttendanceStatus | null;
  };
};

export type AttendanceData = {
  [date: string]: { // YYYY-MM-DD
    [className: string]: DailyClassAttendance;
  };
};

// --- NEW TYPES FOR TEACHER DOCUMENTS ---
export interface TeacherDocument {
  id: string;
  teacherId: string;
  title: string;
  fileUrl: string; // Data URL
  fileName: string;
  fileType: string;
  niveau: string[];
  specialite: string[];
  uploadedAt: string;
}