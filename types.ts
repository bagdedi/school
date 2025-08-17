import type React from 'react';

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  alert?: boolean;
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  email: string;
  avatar: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  avatar: string;
}

export interface Scholarship {
  id: string;
  name: string;
  amount: number;
  eligibility: string;
  status: 'Active' | 'Inactive';
}
