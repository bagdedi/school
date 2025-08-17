import React from 'react';
import type { Teacher } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';

const mockTeachers: Teacher[] = [
  { id: 'T01', name: 'Dr. Eleanor Vance', subject: 'Physics', email: 'eleanor.v@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t01' },
  { id: 'T02', name: 'Mr. Samuel Reed', subject: 'History', email: 'samuel.r@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t02' },
  { id: 'T03', name: 'Ms. Clara Oswald', subject: 'English Literature', email: 'clara.o@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t03' },
  { id: 'T04', name: 'Mr. Alan Turing', subject: 'Computer Science', email: 'alan.t@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t04' },
  { id: 'T05', name: 'Dr. Rosalind Franklin', subject: 'Chemistry', email: 'rosalind.f@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t05' },
  { id: 'T06', name: 'Mr. David Attenborough', subject: 'Biology', email: 'david.a@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t06' },
];

const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => (
  <div className="bg-white rounded-xl shadow-md p-6 text-center flex flex-col items-center transform hover:-translate-y-1 transition-transform">
    <img src={teacher.avatar} alt={teacher.name} className="w-24 h-24 rounded-full mb-4 ring-4 ring-indigo-200" />
    <h3 className="text-lg font-bold text-gray-800">{teacher.name}</h3>
    <p className="text-indigo-600 font-semibold">{teacher.subject}</p>
    <p className="text-sm text-gray-500 mt-2">{teacher.email}</p>
  </div>
);

const TeachersPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
          <p className="mt-1 text-gray-600">Manage your teacher records here.</p>
        </div>
        <button className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          <PlusIcon />
          <span className="ml-2">Add Teacher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockTeachers.map(teacher => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;
